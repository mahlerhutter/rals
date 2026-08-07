import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import {
  loadJurisdictionPackage,
  getKnownSchemaPaths,
  checkFieldOverrides,
  assessReadiness,
  checkRiskFlags,
  assessJurisdiction,
} from '../src/jurisdiction.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const JURISDICTIONS = path.join(__dirname, '../../../jurisdictions');
const SCHEMA = path.join(__dirname, '../../../schema/rals.schema.json');

function loadExample(relPath) {
  return yaml.load(fs.readFileSync(path.join(JURISDICTIONS, relPath), 'utf8'));
}

describe('loadJurisdictionPackage', () => {
  it('loads a package by its 2-letter code, case-insensitively', () => {
    const pkg = loadJurisdictionPackage('at', JURISDICTIONS);
    expect(pkg.code).toBe('AT');
    expect(pkg.profile.name).toBe('Austria');
    expect(pkg.fieldOverrides.fields).toBeTruthy();
    expect(pkg.transactionReadiness.levels.L0).toBeTruthy();
    expect(pkg.risks.risks.length).toBeGreaterThan(0);
  });

  it('throws a clear error for an unknown code', () => {
    expect(() => loadJurisdictionPackage('zz', JURISDICTIONS)).toThrow(/No jurisdiction package found for code "zz"/);
  });

  it('loads all 9 documented packages without error', () => {
    for (const code of ['AT', 'IT', 'RO', 'UA', 'DE', 'VN', 'NA', 'GE', 'CL']) {
      expect(() => loadJurisdictionPackage(code, JURISDICTIONS)).not.toThrow();
    }
  });
});

describe('getKnownSchemaPaths', () => {
  const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
  const paths = getKnownSchemaPaths(schema);

  it('includes real RALS field paths', () => {
    expect(paths.has('identity.country')).toBe(true);
    expect(paths.has('identity.region')).toBe(true);
    expect(paths.has('grid_offtake.grid_connection')).toBe(true);
  });

  it('does not include paths that are not RALS schema fields', () => {
    expect(paths.has('land.land_evidence')).toBe(false);
    expect(paths.has('revenue.revenue_model')).toBe(false);
  });
});

describe('checkFieldOverrides', () => {
  const pkg = loadJurisdictionPackage('AT', JURISDICTIONS);
  const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
  const knownPaths = getKnownSchemaPaths(schema);

  it('flags a real, required field that is missing from the document', () => {
    const violations = checkFieldOverrides({ identity: {} }, pkg, knownPaths);
    const countryViolation = violations.find((v) => v.field === 'identity.country');
    expect(countryViolation).toBeTruthy();
    expect(countryViolation.issue).toBe('missing');
    expect(countryViolation.packageFieldPathUnknown).toBe(false);
  });

  it('flags a value outside allowed_values for a real field', () => {
    const violations = checkFieldOverrides({ identity: { country: 'AT', region: 'Nonexistent' } }, pkg, knownPaths);
    const regionViolation = violations.find((v) => v.field === 'identity.region');
    expect(regionViolation).toBeTruthy();
    expect(regionViolation.issue).toBe('invalid_value');
  });

  it('marks entries whose path is not a real RALS field as packageFieldPathUnknown, not a document violation', () => {
    const violations = checkFieldOverrides({}, pkg, knownPaths);
    const unknownPathEntries = violations.filter((v) => v.packageFieldPathUnknown);
    expect(unknownPathEntries.length).toBeGreaterThan(0);
    expect(unknownPathEntries.every((v) => !getKnownSchemaPaths(schema).has(v.field))).toBe(true);
  });

  it('passes a real, fully-populated example with no violations on known-path fields', () => {
    const doc = loadExample('austria/examples/austria-pv-rtb-l2.rals.yaml');
    const violations = checkFieldOverrides(doc, pkg, knownPaths).filter((v) => !v.packageFieldPathUnknown);
    expect(violations).toEqual([]);
  });
});

describe('assessReadiness', () => {
  const pkg = loadJurisdictionPackage('AT', JURISDICTIONS);

  it('reports the declared level and the requested level definition', () => {
    const doc = loadExample('austria/examples/austria-pv-rtb-l2.rals.yaml');
    const readiness = assessReadiness(doc, pkg, 'l2');
    expect(readiness.declaredLevel).toBe('L2');
    expect(readiness.requestedLevel).toBe('L2');
    expect(readiness.requestedLevelLabel).toBe(pkg.transactionReadiness.levels.L2.label);
    expect(readiness.belowRequestedLevel).toBe(false);
  });

  it('flags belowRequestedLevel when the document claims less than requested', () => {
    const doc = loadExample('austria/examples/austria-pv-rtb-l2.rals.yaml'); // declares L2
    const readiness = assessReadiness(doc, pkg, 'l3');
    expect(readiness.belowRequestedLevel).toBe(true);
  });

  it('does not flag belowRequestedLevel when the document exceeds what was requested', () => {
    const doc = loadExample('austria/examples/austria-hydro-operating-l3.rals.yaml'); // declares L3
    const readiness = assessReadiness(doc, pkg, 'l2');
    expect(readiness.belowRequestedLevel).toBe(false);
  });

  it('throws for a readiness level the package does not define', () => {
    const doc = loadExample('austria/examples/austria-pv-rtb-l2.rals.yaml');
    expect(() => assessReadiness(doc, pkg, 'l9')).toThrow(/does not define readiness level "L9"/);
  });
});

describe('checkRiskFlags', () => {
  it('counts active/total risk flags and finds no unknown risk_ids in a real example', () => {
    const pkg = loadJurisdictionPackage('AT', JURISDICTIONS);
    const doc = loadExample('austria/examples/austria-hydro-operating-l3.rals.yaml');
    const result = checkRiskFlags(doc, pkg);
    expect(result.total).toBeGreaterThan(0);
    expect(result.unknownRiskIds).toEqual([]);
  });

  it('flags a risk_id the package does not define', () => {
    const pkg = loadJurisdictionPackage('AT', JURISDICTIONS);
    const result = checkRiskFlags({ risk_flags: [{ risk_id: 'totally_made_up_risk', active: true }] }, pkg);
    expect(result.unknownRiskIds).toEqual(['totally_made_up_risk']);
  });
});

describe('assessJurisdiction (end to end)', () => {
  it('runs cleanly against every jurisdiction example (all 9 packages)', () => {
    const files = [];
    for (const country of fs.readdirSync(JURISDICTIONS, { withFileTypes: true })) {
      if (!country.isDirectory()) continue;
      const exDir = path.join(JURISDICTIONS, country.name, 'examples');
      if (!fs.existsSync(exDir)) continue;
      for (const f of fs.readdirSync(exDir)) if (f.endsWith('.rals.yaml')) files.push(path.join(exDir, f));
    }
    expect(files.length).toBeGreaterThanOrEqual(18);

    for (const file of files) {
      const doc = yaml.load(fs.readFileSync(file, 'utf8'));
      const assessment = assessJurisdiction(doc, JURISDICTIONS, { schemaPath: SCHEMA });
      expect(assessment.fieldOverrideViolations, `${file}: ${JSON.stringify(assessment.fieldOverrideViolations)}`).toEqual([]);
      expect(assessment.riskFlags.unknownRiskIds, `${file}`).toEqual([]);
    }
  });

  it('infers the jurisdiction from identity.country when no code is given', () => {
    const doc = loadExample('chile/examples/chile-wind-ppa-l2.rals.yaml');
    const assessment = assessJurisdiction(doc, JURISDICTIONS, { schemaPath: SCHEMA });
    expect(assessment.jurisdiction).toBe('CL');
  });
});
