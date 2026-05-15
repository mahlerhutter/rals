# Changelog

All notable changes to the RALS specification and reference implementations are recorded here. The specification follows [Semantic Versioning](https://semver.org/): the standard is at `v0.1.0` and breaking changes are expected until `v1.0.0`.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/).

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
