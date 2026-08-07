# Changelog

All notable changes to the RALS specification and reference implementations are recorded here. The specification follows [Semantic Versioning](https://semver.org/): the standard is at `v0.1.0` and breaking changes are expected until `v1.0.0`.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added

- `schema/rals.schema.json` now defines `properties` for all 31 object nodes that previously had none (derived from SPEC.md §7-12), so the schema is actually checkable against everything the spec's field tables describe.
- `x-rals-tier` annotation on every schema field (`public`/`nda_required`/`final_shortlist`, SPEC 4.3). `lib/teaser-filter.js`'s `PUBLIC_FIELDS`/`STANDARD_FIELDS` allowlists are now generated from these annotations (`scripts/generate-teaser-filter.mjs`) instead of hand-maintained separately from the schema.
- `document_id` now has a `pattern` requiring the `rals:` prefix (SPEC 5).
- Jurisdiction Package validation (RFC-0003): `reference/validator/src/jurisdiction.js` loads a package, checks a document's fields against `field-overrides.yaml`, cross-references `risk_flags` against the package's risk taxonomy, and compares self-declared readiness against a requested level. `rals-validate --jurisdiction=<code> --readiness=<lN> file.rals.yaml`.
- SPEC 13 Level 2 ("Standard") is now actually distinct from Level 3 ("Complete") in the reference validator — previously identical.
- Test suites for `reference/validator/tests/` and `tests/conformance/level-{1,2,3}-*/`, previously empty directories.
- `GET /.well-known/rals.yaml` on rals.energy (web layer), serving a reference Teaser Profile — the discovery mechanism SPEC 4.2 describes, now actually implemented.

### Changed

- `grid_offtake.offtake_structure` and `offtake_contracts[].contract_type`/`structure_type` are `string` rather than a closed `enum` in the schema; the SPEC-defined vocabulary is documented via `x-rals-canonical-values` rather than enforced, so jurisdiction-specific mechanisms (e.g. UK Capacity Market, Vietnamese avoided-cost tariff) that RFC-0002 §4 plans to formalize in v0.2 don't fail schema validation in the interim. This was needed for 3 of the 6 reference examples (Prometheus, Mekong, Atacama) to validate — a pre-existing gap between what Annex A calls "Level 3 Complete" and what the schema, once deep enough to check these fields at all, actually accepted.
- All 18 jurisdiction package examples now validate against `schema/rals.schema.json` (previously 17 of 18 failed); `validate-examples.yml` and `tier-leak-check.yml` now cover them.
- `schema/extensions/*` (solar-pv, bess, wind-onshore) removed — unreferenced by any validator, and superseded by the deepened core schema (BESS remains explicitly out of scope for v0.1 per SPEC 7.4).

### Fixed

- A path-traversal hole in the web layer's `/api/listings/ping` (unvalidated `identity.country` in a filesystem path).
- The `/api/generate` prompt taught the model to emit `voltage_kv`; the teaser-filter allowlist only recognized `voltage_level_kv`, silently dropping the whole `grid_connection` block on publish. Canonicalized on `voltage_level_kv` throughout.
- A latent Ajv bug in `validateDocument` that threw on a second call within the same process (the CLI never triggered this; the new test suite and the `src/index.js` programmatic API do).

[Unreleased]: https://github.com/mahlerhutter/rals/compare/v0.1.0...main

## [0.1.0] — 2026-05-15

Initial public Working Draft.

### Added

- Seven-section document model: `identity`, `technical`, `grid_offtake`, `financials`, `compliance`, `operating_history`, `process`.
- Three-tier confidentiality model (`public`, `nda_required`, `final_shortlist`) with field-level granularity and tier inheritance for nested fields.
- Two-tier access model: a public Teaser Profile and an authenticated Full Profile.
- Three discovery mechanisms: Well-Known URI, HTML `<link>` tag, and optional Registry submission.
- OAuth 2.0–compatible access endpoint for programmatic Full Profile retrieval.
- Technology-conditional capacity fields (PV uses AC/DC; other technologies use a single MW figure).
- Technology-specific `technical` subsections for solar PV, wind, and BESS.
- Canonical OPEX taxonomy.
- EU Taxonomy alignment fields, including per-criterion DNSH reporting.
- Conformance levels: Level 1 (Teaser), Level 2 (Standard), Level 3 (Complete).
- JSON Schema (Draft 2020-12) for validation.
- Six reference example documents: Helios (PV/ES), Aeolus (wind/DE), Prometheus (BESS/GB), Mekong (hydro/VN), Atacama (hybrid/CL), Wisła (development PV/PL).
- Reference validator (Node.js).

### Notes

- The field tables of the specification were aligned with the structure of the reference example documents prior to publication.
- `RFC-0002` consolidates structural gaps surfaced by the six reference implementations and defines the v0.2 roadmap. See [`rfcs/0002-v0.2-roadmap.md`](rfcs/0002-v0.2-roadmap.md).

[0.1.0]: https://github.com/mahlerhutter/rals/releases/tag/v0.1.0
