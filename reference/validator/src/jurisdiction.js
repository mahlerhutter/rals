/**
 * RALS Jurisdiction Package support (RFC-0003).
 *
 * Implements the machine-checkable parts of the 8-step workflow described in
 * jurisdictions/README.md:
 *
 *   1-2. base schema validation + identity.country detection — see validator.js
 *   3. load the matching jurisdiction package                — loadJurisdictionPackage
 *   4. apply field-overrides.yaml interpretation rules        — checkFieldOverrides
 *   5-7. evidence/readiness/risk assessment                   — assessReadiness, checkRiskFlags
 *   8. output report                                          — see cli.js
 *
 * Scope note: evidence-requirements.yaml and the validation_rule prose in
 * risks.yaml describe evidence in free text ("valid Netzanschlusszusage
 * received from DSO or APG"), not as RALS field paths — there is no
 * structured mapping from that prose to document fields, and inventing one
 * would mean this reference implementation asserting jurisdiction-specific
 * legal/technical judgment beyond what the package data actually encodes
 * (the project's own non-negotiable: jurisdiction claims come only from the
 * versioned packages, never inferred). This module therefore checks exactly
 * what field-overrides.yaml and risks.yaml structurally support: required
 * fields and allowed values, self-declared readiness level, and referential
 * integrity of the document's own risk_flags against the package's risk
 * taxonomy. It does not derive or upgrade a readiness level from evidence.
 */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function readYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Jurisdiction package directories are named after the country
 * (jurisdictions/austria/), not the ISO code — resolve a 2-letter code by
 * reading each package's profile.yaml. This is self-describing rather than
 * a hardcoded code->directory map, so adding a new package needs no change
 * here.
 */
function resolvePackageDir(code, jurisdictionsRoot) {
  const wanted = code.toUpperCase();
  const entries = fs.readdirSync(jurisdictionsRoot, { withFileTypes: true }).filter((e) => e.isDirectory());
  for (const entry of entries) {
    const profilePath = path.join(jurisdictionsRoot, entry.name, 'profile.yaml');
    if (!fs.existsSync(profilePath)) continue;
    const profile = readYaml(profilePath);
    if (profile?.jurisdiction_code === wanted) return path.join(jurisdictionsRoot, entry.name);
  }
  return null;
}

/**
 * Load every file of a jurisdiction package for the given 2-letter code.
 * @throws if no package matches the code.
 */
export function loadJurisdictionPackage(code, jurisdictionsRoot) {
  const dir = resolvePackageDir(code, jurisdictionsRoot);
  if (!dir) {
    const available = fs.readdirSync(jurisdictionsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory() && fs.existsSync(path.join(jurisdictionsRoot, e.name, 'profile.yaml')))
      .map((e) => readYaml(path.join(jurisdictionsRoot, e.name, 'profile.yaml')).jurisdiction_code)
      .sort();
    throw new Error(`No jurisdiction package found for code "${code}". Available: ${available.join(', ')}`);
  }
  return {
    code: code.toUpperCase(),
    dir,
    profile: readYaml(path.join(dir, 'profile.yaml')),
    fieldOverrides: readYaml(path.join(dir, 'field-overrides.yaml')),
    evidenceRequirements: readYaml(path.join(dir, 'evidence-requirements.yaml')),
    transactionReadiness: readYaml(path.join(dir, 'transaction-readiness.yaml')),
    risks: readYaml(path.join(dir, 'risks.yaml')),
  };
}

function getByPath(doc, dotPath) {
  return dotPath.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), doc);
}

/**
 * Collect every dot-path the base RALS schema actually defines (walking
 * `properties`, and array `items.properties`). Used to tell a genuine
 * "this required field is missing from the document" violation apart from
 * "this field-overrides.yaml entry doesn't name a real RALS field" — the
 * jurisdiction packages were authored with some evidence-category labels
 * (e.g. `land.land_evidence`, `revenue.revenue_model`) that read like field
 * paths but were never RALS schema fields; those are a package content
 * issue, not a fact about any document, and must not fail validation of
 * documents that are otherwise fine.
 */
export function getKnownSchemaPaths(schema) {
  const paths = new Set();
  function walk(node, prefix) {
    const propsSource = node.properties ? node : (node.items?.properties ? node.items : null);
    if (!propsSource) return;
    for (const [key, propSchema] of Object.entries(propsSource.properties)) {
      const p = prefix ? `${prefix}.${key}` : key;
      paths.add(p);
      walk(propSchema, p);
    }
  }
  walk(schema, '');
  return paths;
}

/**
 * Check a document's fields against a jurisdiction package's
 * field-overrides.yaml: required fields must be present, and where
 * allowed_values is given, the value(s) must be a member of that list.
 *
 * Entries whose field path isn't part of the base RALS schema are reported
 * separately (`packageFieldPathUnknown: true`) rather than as document
 * violations — see getKnownSchemaPaths.
 *
 * @param {Set<string>} [knownSchemaPaths] from getKnownSchemaPaths(schema); if
 *        omitted, path validity isn't checked and every entry is enforced.
 * @returns {Array<{field: string, issue: 'missing'|'invalid_value', message: string, packageFieldPathUnknown?: boolean}>}
 */
export function checkFieldOverrides(doc, pkg, knownSchemaPaths) {
  const violations = [];
  const fields = pkg.fieldOverrides?.fields || {};
  for (const [fieldPath, rule] of Object.entries(fields)) {
    const pathUnknown = knownSchemaPaths ? !knownSchemaPaths.has(fieldPath) : false;
    const value = getByPath(doc, fieldPath);
    const present = value !== undefined && value !== null;

    if (rule.required && !present) {
      violations.push({
        field: fieldPath,
        issue: 'missing',
        message: pathUnknown
          ? `${fieldPath} is not a RALS schema field — ${pkg.code}/field-overrides.yaml needs a content fix (this is a package issue, not a document issue).`
          : `${fieldPath} is required by the ${pkg.code} jurisdiction package but is missing.`,
        packageFieldPathUnknown: pathUnknown,
      });
      continue;
    }
    if (!present || !rule.allowed_values) continue;
    for (const v of Array.isArray(value) ? value : [value]) {
      if (!rule.allowed_values.includes(v)) {
        violations.push({
          field: fieldPath,
          issue: 'invalid_value',
          message: `${fieldPath} = ${JSON.stringify(v)} is not one of the ${pkg.code} package's allowed values: ${rule.allowed_values.join(', ')}`,
          packageFieldPathUnknown: pathUnknown,
        });
      }
    }
  }
  return violations;
}

/**
 * Compare a document's self-declared readiness (rals_jurisdiction.assessed_readiness_level)
 * against a requested level, and look up that level's definition from the
 * package's transaction-readiness.yaml. Does not derive a level from evidence
 * — see module doc comment.
 */
export function assessReadiness(doc, pkg, requestedLevel) {
  const declaredLevel = doc.rals_jurisdiction?.assessed_readiness_level ?? null;
  const declaredLabel = doc.rals_jurisdiction?.readiness_label ?? null;
  const levels = pkg.transactionReadiness?.levels || {};

  const requestedKey = requestedLevel ? requestedLevel.toUpperCase() : null;
  if (requestedKey && !levels[requestedKey]) {
    throw new Error(`Jurisdiction package ${pkg.code} does not define readiness level "${requestedKey}". Known levels: ${Object.keys(levels).join(', ')}`);
  }
  const requestedDefinition = requestedKey ? levels[requestedKey] : null;

  const LEVEL_ORDER = ['L0', 'L1', 'L2', 'L3', 'L4'];
  const belowRequested = requestedKey && declaredLevel
    && LEVEL_ORDER.indexOf(declaredLevel) >= 0
    && LEVEL_ORDER.indexOf(declaredLevel) < LEVEL_ORDER.indexOf(requestedKey);

  return {
    requestedLevel: requestedKey,
    requestedLevelLabel: requestedDefinition?.label ?? null,
    requestedLevelDescription: requestedDefinition?.description?.trim() ?? null,
    declaredLevel,
    declaredLabel,
    // true only when the document claims LESS than what was requested — a
    // document exceeding the requested level is not a mismatch.
    belowRequestedLevel: Boolean(belowRequested),
  };
}

/**
 * Cross-check the document's own risk_flags[].risk_id values against the
 * jurisdiction package's risk taxonomy (risks.yaml). Flags risk_ids the
 * document uses that the package doesn't define — a naming drift signal,
 * not a judgment about whether the underlying risk is real.
 */
export function checkRiskFlags(doc, pkg) {
  const knownIds = new Set((pkg.risks?.risks || []).map((r) => r.risk_id));
  const docFlags = doc.risk_flags || [];
  const unknownRiskIds = docFlags.filter((f) => !knownIds.has(f.risk_id)).map((f) => f.risk_id);
  return {
    total: docFlags.length,
    active: docFlags.filter((f) => f.active).length,
    unknownRiskIds,
  };
}

/**
 * Run the full jurisdiction assessment (steps 3-7 of the README workflow)
 * for a document already validated against the base schema.
 *
 * @param {string} [schemaPath] path to rals.schema.json, for filtering
 *        field-overrides.yaml entries down to real RALS field paths (see
 *        getKnownSchemaPaths). Defaults to schema/rals.schema.json next to
 *        jurisdictionsRoot's parent (the standard repo layout).
 */
export function assessJurisdiction(doc, jurisdictionsRoot, { code, readinessLevel, schemaPath } = {}) {
  const targetCode = code || doc.identity?.country;
  if (!targetCode) {
    throw new Error('No jurisdiction code given and document has no identity.country to infer one from.');
  }
  const pkg = loadJurisdictionPackage(targetCode, jurisdictionsRoot);

  const countryMismatch = Boolean(doc.identity?.country) && doc.identity.country.toUpperCase() !== pkg.code;

  const resolvedSchemaPath = schemaPath || path.join(jurisdictionsRoot, '..', 'schema', 'rals.schema.json');
  let knownSchemaPaths;
  try {
    knownSchemaPaths = getKnownSchemaPaths(JSON.parse(fs.readFileSync(resolvedSchemaPath, 'utf8')));
  } catch {
    knownSchemaPaths = undefined; // schema not found: fall back to enforcing every entry
  }

  const fieldOverrideViolations = checkFieldOverrides(doc, pkg, knownSchemaPaths);

  return {
    jurisdiction: pkg.code,
    jurisdictionName: pkg.profile?.name ?? pkg.code,
    countryMismatch,
    fieldOverrideViolations: fieldOverrideViolations.filter((v) => !v.packageFieldPathUnknown),
    packageFieldPathWarnings: fieldOverrideViolations.filter((v) => v.packageFieldPathUnknown),
    readiness: assessReadiness(doc, pkg, readinessLevel),
    riskFlags: checkRiskFlags(doc, pkg),
  };
}
