# RALS — Renewable Asset Listing Standard

**🌐 [www.rals.energy](https://www.rals.energy)**

RALS is a machine-readable standard for renewable energy asset listings, enabling AI-driven discovery and evaluation while preserving deal confidentiality.

It defines a vendor-neutral YAML format that sellers and M&A advisors host on their own domains, so that buyer agents — including LLM-based systems acting for institutional investors — can discover, parse, and pre-qualify utility-scale renewable assets without proprietary data rooms or bespoke spreadsheet templates.

## 30-second example

A public **Teaser Profile** is what any agent can read without authentication. Sensitive fields are filtered out server-side:

```yaml
rals_version: "0.1"
identity:
  asset_name: "Iberian Solar Opportunity"   # anonymized
  asset_type: solar_pv
  lifecycle_stage: operating
  country: ES
  region: "Castilla-La Mancha"
  total_capacity_mw_ac: 87.5
  total_capacity_mw_dc: 105.0
  transaction_type: full_acquisition
technical:
  commissioning_date: "2023-09-15"
  production_estimates:
    methodology: "PVsyst v7.4, third-party yield assessment"
grid_offtake:
  offtake_structure: hybrid
process:
  process_type: limited_auction
  process_timeline:
    non_binding_offers_due: "2026-07-15"
  access_endpoint: "https://advisor.example.com/.well-known/rals/auth"
```

The corresponding **Full Profile** — production numbers, financials, debt structure, permits — is reachable only after NDA, via the authentication flow in [Section 12 of the spec](SPEC.md#12-section-process). Every field carries a confidentiality tier: `public`, `nda_required`, or `final_shortlist`.

## Status

**v0.1 — Working Draft.** This is an early public draft published for comment. Breaking changes are expected between v0.1 and v1.0. Implementations of v0.1 should declare `rals_version: "0.1"` and be prepared to migrate.

The roadmap toward v0.2 is consolidated in [RFC-0002](rfcs/0002-v0.2-roadmap.md).

## How it works

- **Discovery.** A RALS document lives at a well-known URL (`/.well-known/rals.yaml`), is referenced from an HTML `<link>` tag, or is submitted to the optional public registry.
- **Two-tier confidentiality.** Renewable-asset transactions are confidential by default. The well-known URL serves only the Teaser Profile; the Full Profile sits behind an OAuth 2.0–style access endpoint that releases data after NDA.
- **Bring-your-own-data-room.** RALS does not replace Drooms, Datasite, or Intralinks. It is the structured index that points into them.
- **Seven sections.** `identity`, `technical`, `grid_offtake`, `financials`, `compliance`, `operating_history`, `process`.

## Repository layout

| Path | Contents |
|---|---|
| [`SPEC.md`](SPEC.md) | The normative specification (v0.1). |
| [`schema/`](schema/) | JSON Schema for validation. |
| [`examples/`](examples/) | Six complete reference documents plus invalid cases. |
| [`reference/`](reference/) | Reference validator, parsers, and auth-server. |
| [`discovery/`](discovery/) | Discovery and authentication mechanism specs. |
| [`docs/`](docs/) | Quickstarts, glossary, and compliance mappings. |
| [`rfcs/`](rfcs/) | Design RFCs, including the v0.2 roadmap. |
| [`tests/`](tests/) | Conformance test suite. |

## Quickstart

- **Sellers:** translate an existing Information Memorandum into a RALS file — [`docs/quickstart-seller.md`](docs/quickstart-seller.md).
- **Buyer-agent implementers:** crawl, authenticate, and audit-log — [`docs/quickstart-buyer-agent.md`](docs/quickstart-buyer-agent.md).
- **M&A advisors:** fit RALS into a process letter — [`docs/quickstart-advisor.md`](docs/quickstart-advisor.md).
- **New to renewable-asset M&A?** Start with [`docs/industry-context.md`](docs/industry-context.md).

To validate a document locally:

```bash
cd reference/validator
npm install
node src/cli.js ../../examples/project-helios-pv-spain.rals.yaml --level=3
```

## Contributing

RALS is developed in the open. Anyone may file an issue, propose an RFC, contribute an example, or submit a compliance mapping for a new jurisdiction. See [`CONTRIBUTING.md`](CONTRIBUTING.md).

Governance is documented honestly in [`GOVERNANCE.md`](GOVERNANCE.md): RALS currently operates under a single-editor (BDFL) model with an explicit, pre-committed path to a Steering Committee once the standard has independent adopters.

## License

- Specification and documentation: **CC BY 4.0** — see [`LICENSE`](LICENSE).
- Reference implementations and code: **MIT** — see [`LICENSE-CODE`](LICENSE-CODE).

## Security

Misconfigured tier filtering — a server leaking `nda_required` or `final_shortlist` data into a Teaser — is treated as a high-severity vulnerability. Disclosure process: [`SECURITY.md`](SECURITY.md).
