import { validateDocument } from './validator.js';
import path from 'path';

const docPath = process.argv[2];
const schemaPath = process.argv[3] || path.join(process.cwd(), '../../schema/rals.schema.json');

if (!docPath) {
  console.error("Usage: node src/cli.js <path-to-document.rals.yaml> [path-to-schema.json]");
  process.exit(1);
}

const result = validateDocument(docPath, schemaPath);

if (result.valid) {
  console.log(`✅ Document ${docPath} is a valid RALS document.`);
  process.exit(0);
} else {
  console.error(`❌ Validation failed for ${docPath}:`);
  console.error(JSON.stringify(result.errors, null, 2));
  process.exit(1);
}
