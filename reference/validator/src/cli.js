#!/usr/bin/env node
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { validateDocument } from './validator.js';
import { assessJurisdiction } from './jurisdiction.js';

const LEVEL_NAMES = { 1: 'Teaser', 2: 'Standard', 3: 'Complete' };

const flags = {};
const positionals = [];
for (const arg of process.argv.slice(2)) {
  const m = arg.match(/^--([^=]+)(?:=(.*))?$/);
  if (m) flags[m[1]] = m[2] === undefined ? true : m[2];
  else positionals.push(arg);
}

const docPath = positionals[0];

if (!docPath || flags.help) {
  console.error('Usage: rals-validate <document.rals.yaml> [schema.json] [options]');
  console.error('  --schema=path        path to the JSON Schema (default: ../../schema/rals.schema.json)');
  console.error('  --level=1|2|3        conformance level (SPEC section 13): 1 = Teaser, 2 = Standard, 3 = Complete (default 3)');
  console.error('  --jurisdiction=CODE   assess against a jurisdiction package (RFC-0003), e.g. --jurisdiction=at');
  console.error('                        defaults to the document\'s identity.country if omitted');
  console.error('  --readiness=LN        readiness level to check the document against, e.g. --readiness=l2');
  console.error('                        requires --jurisdiction (or an inferable identity.country)');
  console.error('  --jurisdictions=path  path to the jurisdictions/ directory (default: ../../jurisdictions)');
  process.exit(docPath ? 0 : 1);
}

const schemaPath =
  flags.schema || positionals[1] || path.join(process.cwd(), '../../schema/rals.schema.json');

const level = flags.level ? Number(flags.level) : 3;
if (![1, 2, 3].includes(level)) {
  console.error(`❌ Invalid --level "${flags.level}". Use 1 (Teaser), 2 (Standard), or 3 (Complete).`);
  process.exit(1);
}

const result = validateDocument(docPath, schemaPath, { level });

if (!result.valid) {
  console.error(`❌ Validation failed for ${docPath} (Level ${level} — ${LEVEL_NAMES[level]}):`);
  console.error(JSON.stringify(result.errors, null, 2));
  process.exit(1);
}

console.log(`✅ ${docPath} is a valid RALS document (Level ${level} — ${LEVEL_NAMES[level]}).`);

const wantsJurisdiction = flags.jurisdiction || flags.readiness;
if (!wantsJurisdiction) {
  process.exit(0);
}

const jurisdictionsRoot = flags.jurisdictions || path.join(process.cwd(), '../../jurisdictions');
const jurisdictionCode = flags.jurisdiction === true ? undefined : flags.jurisdiction;
const readinessLevel = flags.readiness === true ? undefined : flags.readiness;

let assessment;
try {
  // Assess against the full document regardless of --level: jurisdiction
  // field-overrides and readiness are about the Full Profile the seller
  // holds, not the projection a particular buyer tier can currently see.
  const fullDoc = yaml.load(fs.readFileSync(docPath, 'utf8'));
  assessment = assessJurisdiction(fullDoc, jurisdictionsRoot, { code: jurisdictionCode, readinessLevel });
} catch (err) {
  console.error(`❌ Jurisdiction assessment failed: ${err.message}`);
  process.exit(1);
}

console.log(`\n— Jurisdiction: ${assessment.jurisdictionName} (${assessment.jurisdiction}) —`);

if (assessment.countryMismatch) {
  console.warn(`⚠ identity.country does not match the assessed jurisdiction (${assessment.jurisdiction}).`);
}

const { readiness } = assessment;
if (readiness.requestedLevel) {
  console.log(`Requested readiness: ${readiness.requestedLevel} — ${readiness.requestedLevelLabel}`);
}
console.log(`Declared readiness:  ${readiness.declaredLevel || '(not declared)'}${readiness.declaredLabel ? ` — ${readiness.declaredLabel}` : ''}`);
if (readiness.belowRequestedLevel) {
  console.warn(`⚠ Document declares ${readiness.declaredLevel}, below the requested ${readiness.requestedLevel}.`);
}

const { riskFlags } = assessment;
console.log(`Risk flags: ${riskFlags.active} active / ${riskFlags.total} total`);
if (riskFlags.unknownRiskIds.length > 0) {
  console.warn(`⚠ risk_flags reference risk_id(s) not defined in the ${assessment.jurisdiction} package: ${riskFlags.unknownRiskIds.join(', ')}`);
}

if (assessment.packageFieldPathWarnings.length > 0) {
  console.warn(`\n⚠ ${assessment.packageFieldPathWarnings.length} field-overrides.yaml entr${assessment.packageFieldPathWarnings.length === 1 ? 'y names' : 'ies name'} a field not in the RALS schema (package content issue, not checked against the document):`);
  for (const v of assessment.packageFieldPathWarnings) console.warn(`   ${v.field}`);
}

if (assessment.fieldOverrideViolations.length > 0) {
  console.error(`\n❌ ${assessment.fieldOverrideViolations.length} field-override violation(s):`);
  for (const v of assessment.fieldOverrideViolations) console.error(`   ${v.message}`);
  process.exit(1);
}

console.log(`\n✅ No jurisdiction field-override violations.`);
process.exit(0);
