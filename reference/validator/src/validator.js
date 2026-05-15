import fs from 'fs';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

export function validateDocument(filePath, schemaPath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const doc = yaml.load(fileContents);
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const schema = JSON.parse(schemaContent);
    
    const validate = ajv.compile(schema);
    const valid = validate(doc);
    
    if (!valid) {
      return { valid: false, errors: validate.errors };
    }
    return { valid: true, doc };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
}
