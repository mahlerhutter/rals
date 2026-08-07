import fs from 'fs';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { filterToTeaser, filterToStandard } from './teaser-filter.js';

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

/**
 * Validate a RALS document against the JSON Schema.
 *
 * @param {string} filePath   path to the .rals.yaml document
 * @param {string} schemaPath path to the JSON Schema
 * @param {object} [options]
 * @param {number} [options.level=3] conformance level (SPEC section 13):
 *        1 = Teaser (public fields only), 2 = Standard (public + nda_required),
 *        3 = Complete (all tiers, the full document as authored).
 * @returns {{valid: boolean, errors?: any[], doc?: object}}
 */
export function validateDocument(filePath, schemaPath, { level = 3 } = {}) {
  try {
    const doc = yaml.load(fs.readFileSync(filePath, 'utf8'));
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    const target = level === 1 ? (filterToTeaser(doc) ?? {}) : level === 2 ? (filterToStandard(doc) ?? {}) : doc;

    // Reuse an already-compiled validator for this schema $id rather than
    // recompiling: ajv throws on a second compile() of the same $id, which
    // only ever surfaced here once validateDocument started being called
    // more than once per process (e.g. the test suite, or any programmatic
    // caller using src/index.js).
    const validate = (schema.$id && ajv.getSchema(schema.$id)) || ajv.compile(schema);
    const valid = validate(target);

    if (!valid) {
      return { valid: false, errors: validate.errors };
    }
    return { valid: true, doc };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
}
