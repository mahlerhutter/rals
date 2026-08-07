# RALS Jurisdiction Packages

RALS Jurisdiction Packages extend the base RALS standard with country-specific interpretation, evidence requirements, readiness rules, and risk taxonomies for renewable energy asset transactions.

## What are Jurisdiction Packages?

The RALS base schema defines a vendor-neutral, technology-agnostic format for describing renewable energy assets. It is intentionally general: it does not assume a specific permitting system, grid connection process, support scheme structure, or land-rights regime.

Jurisdiction Packages fill that gap. Each package defines:

- **Field interpretation** — how standard RALS fields should be read, completed, and validated in a specific country context
- **Evidence requirements** — what documentation is expected at each readiness level
- **Readiness thresholds** — country-specific definitions of what constitutes L0–L4
- **Risk taxonomy** — structured risk flags relevant to that market
- **Example listings** — synthetic RALS files demonstrating different maturity levels

## Relationship to Base RALS

Jurisdiction Packages do not replace or extend the base JSON Schema. They operate as a validation overlay:

1. A validator loads the base RALS schema and validates the document structure
2. It detects `identity.country`
3. It loads the matching jurisdiction package
4. It applies field-level interpretation rules from `field-overrides.yaml`
5. It checks evidence requirements from `evidence-requirements.yaml` against `process.data_room_status` and compliance fields
6. It assigns a readiness level based on `transaction-readiness.yaml`
7. It outputs missing data, red flags, and validation warnings from `risks.yaml`

A validator MUST NOT upgrade the readiness level beyond what the jurisdiction package's `transaction-readiness.yaml` permits for the available evidence.

## How Validators Should Use These Packages

```
Input: RALS YAML document
  → Step 1: Validate against base schema (rals.schema.json)
  → Step 2: Read identity.country (ISO 3166-1 alpha-2)
  → Step 3: Load jurisdictions/{country}/
  → Step 4: Apply field-overrides.yaml interpretation rules
  → Step 5: Check evidence-requirements.yaml for claimed readiness level
  → Step 6: Evaluate risks.yaml validation_rules
  → Step 7: Assign or confirm readiness level
  → Step 8: Output report (level, missing evidence, active risks, warnings)
```

**Reference implementation:** `reference/validator` implements this workflow —
`rals-validate --jurisdiction=<code> --readiness=<lN> file.rals.yaml` (see
`src/jurisdiction.js`). Steps 4 (field-overrides.yaml) and 7 (risk_flags
cross-check against risks.yaml) are fully machine-checked. Steps 5-6
(evidence-requirements.yaml, and the `validation_rule` prose in risks.yaml)
are written as human-readable evidence descriptions, not RALS field paths —
there is no structured mapping from "valid Netzanschlusszusage received from
DSO or APG" to a document field, and the reference validator does not invent
one (see the module doc comment in `src/jurisdiction.js` for why: doing so
would mean the reference implementation asserting jurisdiction-specific
legal/technical judgment beyond what the package data actually encodes). It
reports the document's self-declared readiness level rather than deriving
one from evidence.

## Why Jurisdiction-Specific Evidence Matters

A solar asset classified as "ready-to-build" means something different in each market:

- In **Austria**, RTB requires a rechtskräftige Baugenehmigung or UVP decision (no VwGH appeal pending), a signed Netzanschlussvertrag with the DSO/TSO, and secured long-term land rights (Bestandsvertrag)
- In **Italy**, RTB means Autorizzazione Unica has been granted and is final (no TAR/Consiglio di Stato appeal pending), a Soluzione di connessione from Terna/DSO is accepted, and all land is under enforceable lease
- In **Romania**, RTB requires a valid ATR with 5% financial guarantee deposited, a building permit, and land with signed arenda agreements and confirmed Cartea Funciara registration
- In **Ukraine**, the same technical status carries fundamentally different risk because of war, grid damage, and martial law uncertainty — no asset can be L3+ without war-risk insurance or IFI guarantee
- In **Germany**, RTB requires a BImSchG permit that is **rechtskräftig** (appeal window closed, no Verwaltungsgericht challenge pending), a signed Netzanschlussvertrag with the TSO/DSO, and full Pachtvertrag + Grundbuch registrations
- In **Chile**, an apparently advanced solar project in northern Atacama may be unfinanceable due to curtailment and zero-price spot risk, regardless of environmental permits — unless a long-term corporate PPA is in place
- In **Vietnam**, EVN counterparty risk and curtailment exposure without compensation make standard PPA structures internationally un-bankable without additional structural mitigants

Without jurisdiction packages, cross-border readiness comparisons are unreliable.

## Supported Packages

| Code | Country | Status | Version | Key Focus |
|------|---------|--------|---------|-----------|
| AT | Austria | Active | 0.1 | Mature market; BImSchG-equivalent permitting by Bundesland; hydro concessions; grid constraints |
| IT | Italy | Active | 0.1 | Autorizzazione Unica; TAR/Consiglio di Stato appeal risk; Southern Italy grid saturation; curtailment |
| RO | Romania | Active | 0.1 | ATR auction system (2026); readiness inflation; CF land title; CfD in development |
| UA | Ukraine | Active | 0.1 | War risk; grid damage; martial law; IFI dependency; occupied territory exclusion |
| DE | Germany | Active | 0.1 | BImSchG appeals (Klagewelle); Rotmilan/species protection; Redispatch 2.0 curtailment; post-2026 EEG uncertainty |
| VN | Vietnam | Active | 0.1 | EVN monopoly/counterparty risk; curtailment uncompensated; DPPA (Decree 57/2025); FX/convertibility |
| NA | Namibia | Active | 0.1 | NamPower single buyer; Minister approval risk; communal land title; small grid; green hydrogen ambitions |
| GE | Georgia | Active | 0.1 | CfD auctions (oversubscribed); seasonal hydro variability; GSE grid congestion; Black Sea export potential |
| CL | Chile | Active | 0.1 | Atacama curtailment; indigenous consultation (PCPI/ILO 169); DGA water rights; mature corporate PPA market |

## Disclaimer

RALS Jurisdiction Packages are technical transaction-readiness references. They are not legal advice. Country-specific regulatory frameworks change frequently. Always verify current rules with qualified local legal counsel before relying on this package for a specific transaction.

Field interpretations marked `validation_warning: true` reflect areas of genuine regulatory uncertainty as of the package version date.

## Contributing

To propose a new jurisdiction package or corrections to an existing one, open a GitHub Issue or Pull Request at `github.com/mahlerhutter/rals`. See `CONTRIBUTING.md` for the process.

See [RFC-0003](../docs/rfcs/RFC-0003-jurisdiction-packages.md) for the design rationale behind Jurisdiction Packages.
