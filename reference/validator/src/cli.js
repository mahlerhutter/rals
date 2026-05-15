import { validateDocument } from './validator.js';
import path from 'path';

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
  console.error('Usage: node src/cli.js <document.rals.yaml> [schema.json] [--schema=path] [--level=1|2|3]');
  console.error('  --level   conformance level (SPEC section 13): 1 = Teaser, 2 = Standard, 3 = Complete (default 3)');
  console.error('  --schema  path to the JSON Schema (default: ../../schema/rals.schema.json)');
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

if (result.valid) {
  console.log(`✅ ${docPath} is a valid RALS document (Level ${level} — ${LEVEL_NAMES[level]}).`);
  process.exit(0);
} else {
  console.error(`❌ Validation failed for ${docPath} (Level ${level} — ${LEVEL_NAMES[level]}):`);
  console.error(JSON.stringify(result.errors, null, 2));
  process.exit(1);
}
