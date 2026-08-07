import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateDocument } from '../src/validator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA = path.join(__dirname, '../../../schema/rals.schema.json');
const CONFORMANCE_ROOT = path.join(__dirname, '../../../tests/conformance');

const LEVEL_DIRS = {
  1: 'level-1-teaser',
  2: 'level-2-standard',
  3: 'level-3-complete',
};

// Each fixture carries a header comment stating the expected outcome
// (CONTRIBUTING.md's convention for the conformance suite), e.g.:
//   # CONFORMANCE TEST — Level 2 (Standard)
//   # Expected: PASS
function readExpectedOutcome(filePath) {
  const head = fs.readFileSync(filePath, 'utf8').split('\n', 10).join('\n');
  const m = head.match(/^#\s*Expected:\s*(PASS|FAIL)\s*$/m);
  if (!m) throw new Error(`${filePath}: missing "# Expected: PASS|FAIL" header comment required by the conformance suite convention (see CONTRIBUTING.md).`);
  return m[1];
}

for (const [level, dirName] of Object.entries(LEVEL_DIRS)) {
  const dir = path.join(CONFORMANCE_ROOT, dirName);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.rals.yaml')) : [];

  describe(`conformance suite — ${dirName} (--level=${level})`, () => {
    it('has at least one must-pass and one must-fail fixture', () => {
      const outcomes = files.map((f) => readExpectedOutcome(path.join(dir, f)));
      expect(outcomes).toContain('PASS');
      expect(outcomes).toContain('FAIL');
    });

    for (const file of files) {
      const filePath = path.join(dir, file);
      const expected = readExpectedOutcome(filePath);
      it(`${file} — expected ${expected}`, () => {
        const result = validateDocument(filePath, SCHEMA, { level: Number(level) });
        expect(result.valid).toBe(expected === 'PASS');
      });
    }
  });
}
