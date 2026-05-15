/**
 * RALS tier-leak check.
 *
 * For each example document, this verifies that the public Teaser Profile
 * produced by the reference teaser filter contains no field the document
 * itself marks `nda_required` (`# [N]`) or `final_shortlist` (`# [F]`).
 *
 * A leak — confidential data reaching an unauthenticated Teaser — is the
 * high-severity failure described in SECURITY.md. This check is the CI guard
 * against the reference filter's allowlist drifting out of sync with the spec.
 *
 * Usage: node src/tier-leak-check.js <file.rals.yaml> [<file.rals.yaml> ...]
 */

import fs from 'fs';
import yaml from 'js-yaml';
import { filterToTeaser } from './teaser-filter.js';

const TIER_RANK = { P: 0, N: 1, F: 2 };

/**
 * Build a `dotted.path -> tier` map from a tier-annotated example file by
 * tracking YAML indentation. Array indices are collapsed: tiers are a property
 * of the field, not of an individual list element.
 */
function buildTierMap(raw) {
  const map = new Map();
  const stack = []; // { indent, key }

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    let indent = line.match(/^(\s*)/)[1].length;
    let rest = line.slice(indent);
    while (rest.startsWith('- ')) { rest = rest.slice(2); indent += 2; }

    const keyMatch = rest.match(/^([a-z][a-z0-9_]*)\s*:/);
    if (!keyMatch) continue;
    const key = keyMatch[1];

    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const path = [...stack.map((s) => s.key), key].join('.');
    stack.push({ indent, key });

    const tierMatch = line.match(/#\s*\[([PNF])\]/);
    if (tierMatch) {
      const tier = tierMatch[1];
      const prev = map.get(path);
      if (!prev || TIER_RANK[tier] > TIER_RANK[prev]) map.set(path, tier);
    }
  }
  return map;
}

/** Collect every leaf path present in the (already filtered) teaser document. */
function teaserLeafPaths(node, prefix = '', acc = new Set()) {
  if (Array.isArray(node)) {
    node.forEach((n) => teaserLeafPaths(n, prefix, acc));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      teaserLeafPaths(v, prefix ? `${prefix}.${k}` : k, acc);
    }
  } else if (prefix) {
    acc.add(prefix);
  }
  return acc;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node src/tier-leak-check.js <file.rals.yaml> ...');
  process.exit(2);
}

let failed = false;

for (const file of files) {
  let raw, doc;
  try {
    raw = fs.readFileSync(file, 'utf8');
    doc = yaml.load(raw);
  } catch (err) {
    console.error(`✗ ${file} — could not read/parse: ${err.message}`);
    failed = true;
    continue;
  }

  const tierMap = buildTierMap(raw);
  const teaser = filterToTeaser(doc) || {};

  if (!teaser.rals_version || !teaser.identity) {
    console.error(`✗ ${file} — teaser projection lost required fields (rals_version/identity)`);
    failed = true;
    continue;
  }

  const leaks = [...teaserLeafPaths(teaser)]
    .filter((p) => {
      const tier = tierMap.get(p);
      return tier === 'N' || tier === 'F';
    })
    .sort();

  if (leaks.length > 0) {
    console.error(`✗ ${file} — teaser leaks ${leaks.length} confidential field(s):`);
    for (const p of leaks) console.error(`    ${p}  [${tierMap.get(p)}]`);
    failed = true;
  } else {
    const confidentialCount = [...tierMap.values()].filter((t) => t !== 'P').length;
    console.log(`✓ ${file} — teaser clean (${confidentialCount} confidential fields filtered out)`);
  }
}

if (failed) {
  console.error('\nTier-leak check FAILED — see leaks above.');
  process.exit(1);
}
console.log('\nTier-leak check passed — no Teaser exposes nda_required/final_shortlist data.');
