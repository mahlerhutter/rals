import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateDocument } from '../src/validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA = path.join(__dirname, '../../../schema/rals.schema.json');
const EXAMPLES = path.join(__dirname, '../../../examples');

describe('validateDocument', () => {
  it('accepts a well-formed reference example at Level 3 (Complete)', () => {
    const result = validateDocument(path.join(EXAMPLES, 'project-helios-pv-spain.rals.yaml'), SCHEMA, { level: 3 });
    expect(result.valid).toBe(true);
  });

  it('accepts the same document at Level 1 (Teaser) and Level 2 (Standard)', () => {
    const doc = path.join(EXAMPLES, 'project-helios-pv-spain.rals.yaml');
    expect(validateDocument(doc, SCHEMA, { level: 1 }).valid).toBe(true);
    expect(validateDocument(doc, SCHEMA, { level: 2 }).valid).toBe(true);
  });

  it('rejects a document with an invalid asset_type enum value', () => {
    const result = validateDocument(path.join(EXAMPLES, 'invalid/bad-enum-asset-type.rals.yaml'), SCHEMA, { level: 3 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.instancePath === '/identity/asset_type')).toBe(true);
  });

  it('rejects a document missing a required top-level section', () => {
    const result = validateDocument(path.join(EXAMPLES, 'invalid/missing-required-section.rals.yaml'), SCHEMA, { level: 3 });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.params?.missingProperty === 'process')).toBe(true);
  });

  it('returns a structured error rather than throwing on a nonexistent file', () => {
    const result = validateDocument(path.join(EXAMPLES, 'does-not-exist.rals.yaml'), SCHEMA, { level: 3 });
    expect(result.valid).toBe(false);
    expect(result.errors).toBeTruthy();
  });
});
