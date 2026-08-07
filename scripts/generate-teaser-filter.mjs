#!/usr/bin/env node
/**
 * Generates lib/teaser-filter.js's PUBLIC_FIELDS and STANDARD_FIELDS
 * allowlists from the x-rals-tier annotations in schema/rals.schema.json,
 * instead of hand-maintaining them separately (TSK-43). Run after any
 * schema tier change:
 *
 *   node scripts/generate-teaser-filter.mjs [--check]
 *
 * --check exits 1 without writing if the generated allowlists would differ
 * from what's on disk (for CI). Writes both the web/ and reference/validator/
 * copies, which must stay identical (there's no package boundary between the
 * two repos to share a single module across).
 *
 * Tier inheritance (SPEC 4.3): a field without its own x-rals-tier inherits
 * its enclosing object's tier; the default at the document root is
 * nda_required. A field not described in the schema at all is always
 * nda_required — this walk only ever emits explicitly-allowed keys, so
 * undocumented extension fields are dropped even inside an otherwise-allowed
 * object, per SPEC 4.3 ("implementation-defined fields... default to
 * nda_required regardless of their position").
 *
 * PUBLIC_FIELDS backs the Teaser Profile (SPEC 13 Level 1) and the web
 * server's publish path. STANDARD_FIELDS additionally keeps nda_required
 * fields (dropping only final_shortlist) and backs SPEC 13 Level 2 ("all
 * nda_required fields") in the reference validator's --level flag.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');

const schema = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'schema/rals.schema.json'), 'utf8'));

const TIER_KEY = 'x-rals-tier';

// Walks an object-type schema node and returns the allowlist subtree for it
// (undefined if nothing under it is kept), given the tier this node inherits
// from its parent and a predicate deciding which tiers to keep.
function extractFields(node, inheritedTier, keepTier) {
  const tier = node[TIER_KEY] || inheritedTier;
  const propsSource = node.properties ? node : (node.items && node.items.properties ? node.items : null);
  if (!propsSource) {
    // Leaf (or object/array with no known sub-structure): keep the whole
    // value only if its tier passes the predicate.
    return keepTier(tier) ? true : undefined;
  }
  const out = {};
  let any = false;
  for (const [key, propSchema] of Object.entries(propsSource.properties)) {
    const propTier = propSchema[TIER_KEY] || tier;
    const nested = extractFields(propSchema, propTier, keepTier);
    if (nested !== undefined) {
      out[key] = nested;
      any = true;
    }
  }
  return any ? out : undefined;
}

const publicFields = extractFields(schema, 'nda_required', (t) => t === 'public') || {};
const standardFields = extractFields(schema, 'nda_required', (t) => t === 'public' || t === 'nda_required') || {};

function serialize(node, indent) {
  const pad = '  '.repeat(indent);
  const childPad = '  '.repeat(indent + 1);
  if (node === true) return 'true';
  const keys = Object.keys(node);
  if (!keys.length) return '{}';
  const lines = keys.map((k) => `${childPad}${/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k)}: ${serialize(node[k], indent + 1)},`);
  return `{\n${lines.join('\n')}\n${pad}}`;
}

const publicBody = serialize(publicFields, 0);
const standardBody = serialize(standardFields, 0);

const FILE_TEMPLATE = `/**
 * RALS reference tier filter.
 *
 * Projects a full RALS document down to a lower confidentiality tier by
 * keeping only the fields the specification tags at or below that tier
 * (SPEC sections 6-12, tier model in SPEC 4.3). Every field not on the
 * relevant allowlist is dropped, per SPEC 4.3 ("the default for any field
 * not explicitly tagged is nda_required").
 *
 * PUBLIC_FIELDS / filterToTeaser — the public Teaser Profile (SPEC 13
 * Level 1). This is the single source of truth for tier filtering: the web
 * server uses it to publish listings, and the tier-leak CI check uses it to
 * verify no confidential field reaches a Teaser.
 *
 * STANDARD_FIELDS / filterToStandard — public + nda_required, dropping only
 * final_shortlist (SPEC 13 Level 2 "Standard"). Used by the reference
 * validator's --level=2 conformance check.
 *
 * GENERATED FILE — do not hand-edit. Regenerate with
 * \`node scripts/generate-teaser-filter.mjs\` in the rals repo after
 * changing any x-rals-tier annotation in schema/rals.schema.json — it writes
 * both reference/validator/src/teaser-filter.js (this repo) and
 * ../web/lib/teaser-filter.js (the sibling web repo vendors a copy).
 *
 * Allowlist grammar:
 *   true   — keep this key and its whole subtree
 *   object — recurse: keep only the listed sub-keys (arrays apply it per item)
 */

export const PUBLIC_FIELDS = ${publicBody};

export const STANDARD_FIELDS = ${standardBody};

/**
 * Project a RALS document down to the given allowlist.
 * @param {*} doc   parsed RALS document (or sub-tree, during recursion)
 * @param {*} allow allowlist node (PUBLIC_FIELDS or STANDARD_FIELDS)
 * @returns the filtered value, or undefined if nothing on the allowlist remains
 */
export function filterByAllowlist(doc, allow) {
  if (allow === true) return doc;
  if (doc == null || allow == null) return undefined;

  if (Array.isArray(doc)) {
    const items = doc.map((item) => filterByAllowlist(item, allow)).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }

  if (typeof doc === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(doc)) {
      if (!Object.prototype.hasOwnProperty.call(allow, key)) continue;
      const filtered = filterByAllowlist(value, allow[key]);
      if (filtered !== undefined) out[key] = filtered;
    }
    return Object.keys(out).length ? out : undefined;
  }

  // Scalar reached without an explicit \`true\` allowance — drop it.
  return undefined;
}

/** Return the Teaser Profile (public tier only, SPEC 13 Level 1) projection of a RALS document. */
export function filterToTeaser(doc, allow = PUBLIC_FIELDS) {
  return filterByAllowlist(doc, allow);
}

/** Return the Standard (public + nda_required, SPEC 13 Level 2) projection of a RALS document. */
export function filterToStandard(doc, allow = STANDARD_FIELDS) {
  return filterByAllowlist(doc, allow);
}
`;

const targets = [
  path.join(REPO_ROOT, 'reference/validator/src/teaser-filter.js'),
  path.join(REPO_ROOT, '..', 'web', 'lib', 'teaser-filter.js'),
];

const checkOnly = process.argv.includes('--check');

let drift = false;
for (const target of targets) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
  if (current !== FILE_TEMPLATE) {
    drift = true;
    if (checkOnly) {
      console.error(`would update: ${path.relative(REPO_ROOT, target)}`);
    } else {
      fs.writeFileSync(target, FILE_TEMPLATE, 'utf8');
      console.log(`wrote ${path.relative(REPO_ROOT, target)}`);
    }
  }
}

if (checkOnly && drift) {
  console.error('\nteaser-filter.js is out of date with schema/rals.schema.json x-rals-tier annotations. Run: node scripts/generate-teaser-filter.mjs');
  process.exit(1);
}
if (!drift) {
  console.log('teaser-filter.js already up to date.');
}
