/**
 * Public API of @rals/validator — the RALS reference validator.
 *
 * `import { validateDocument } from '@rals/validator'` (or a relative path
 * to this file) gets you the same functionality as src/cli.js, for
 * programmatic use.
 */
export { validateDocument } from './validator.js';
export { filterToTeaser, filterToStandard, PUBLIC_FIELDS, STANDARD_FIELDS } from './teaser-filter.js';
export {
  loadJurisdictionPackage,
  checkFieldOverrides,
  assessReadiness,
  checkRiskFlags,
  assessJurisdiction,
} from './jurisdiction.js';
