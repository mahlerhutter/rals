import fs from 'fs';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { filterToTeaser } from './teaser-filter.js';

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

/**
 * Validate a RALS document against the JSON Schema.
 *
 * @param {string} filePath   path to the .rals.yaml document
 * @param {string} schemaPath path to the JSON Schema
 * @param {object} [options]
 * @param {number} [options.level=3] conformance level (SPEC section 13):
 *        1 = Teaser, 2 = Standard, 3 = Complete. Level 1 validates the public
 *        Teaser projection; levels 2 and 3 validate the full document.
 * @returns {{valid: boolean, errors?: any[], doc?: object}}
 */
export function validateDocument(filePath, schemaPath, { level = 3 } = {}) {
  try {
    const doc = yaml.load(fs.readFileSync(filePath, 'utf8'));
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    const target = level === 1 ? (filterToTeaser(doc) ?? {}) : doc;

    const validate = ajv.compile(schema);
    const valid = validate(target);

    if (!valid) {
      return { valid: false, errors: validate.errors };
    }
    return { valid: true, doc };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
}
