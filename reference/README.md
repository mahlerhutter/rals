# RALS Reference Implementations

This directory contains reference code to help developers adopt RALS.

## Validator
`validator/` contains a Node.js JSON Schema validator (`ajv`-based) capable of verifying RALS documents against `schema/rals.schema.json` at any of the three SPEC 13 conformance levels, plus:

- **Tier filtering** (`src/teaser-filter.js`) — projects a full document down to its Teaser (public) or Standard (public + nda_required) tier. Generated from the schema's `x-rals-tier` annotations (`scripts/generate-teaser-filter.mjs`), not hand-maintained.
- **Jurisdiction Packages** (`src/jurisdiction.js`, RFC-0003) — loads a package, checks a document against its `field-overrides.yaml`, cross-references `risk_flags` against its risk taxonomy, and compares self-declared readiness. See the [Jurisdiction Packages section of the root README](../README.md#jurisdiction-packages).

Install with `npm install` in `validator/`, then `node src/cli.js --help` for usage, or `npm test` for the test suite (`validator/tests/` unit tests plus the `tests/conformance/` fixture suite).

## Auth Server (Coming Soon)
A reference OAuth 2.0 implementation for the `.well-known` endpoint.
