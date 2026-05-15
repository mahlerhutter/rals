# RALS Jurisdiction Package — Italy (IT)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Italy.

Italy is one of Europe's largest renewable energy markets with significant PV, wind, and emerging BESS activity. The regulatory framework is complex: permitting is primarily managed by regional governments (Regioni) via the Autorizzazione Unica (AU) procedure, grid connection is managed by Terna (TSO) and regional DSOs, and support is administered by GSE via competitive FER tenders. The Southern Italian regions (Puglia, Campania, Calabria, Sicily, Sardinia) offer the best resource but face the highest permitting variability and grid saturation risk.

## Supported Asset Types

- Solar PV (utility-scale ground-mount, agrivoltaics)
- Onshore wind
- Offshore wind (early development stage as of 2026)
- Battery energy storage (BESS) — standalone and co-located
- Hybrid assets

## Main Transaction Risks

- **AU permitting variability**: AU timelines range from 18 months (cooperative regions) to 48+ months (contested or sensitive areas). TAR/Consiglio di Stato appeals can add 1–3 years and may annul the permit.
- **Grid queue saturation (Southern Italy)**: Terna has imposed moratoria on new SdC issuance in several HV substations. Assets without an accepted SdC in moratorium zones have no viable construction timeline.
- **Land control complexity**: Italian agricultural land (terreni agricoli) has specific lease and conversion rules. Informal landowner agreements are not enforceable.
- **GSE contract transferability**: FER incentive contracts may require GSE notification or approval for assignment in M&A context. Share deal typically preserves the contract; asset deal may not.
- **Curtailment (Southern Italy)**: re-dispacciamento curtailment by Terna can reduce yield by 5–20% in congested zones. Must be modelled in base case DSCR.

## Readiness Level Interpretation

| Level | Label | Italy-Specific Trigger |
|-------|-------|------------------------|
| L0 | Teaser Only | Technology and region known; no AU/SdC/land evidence |
| L1 | Screenable | Site confirmed; AU track identified; SdC inquiry submitted |
| L2 | Investment Memo Ready | AU application submitted; SdC accepted; land under binding contract |
| L3 | Lender Diligence Ready | AU final (no appeal); Convention signed; GSE contract or PPA |
| L4 | Data Room Ready | EPC signed; all AU conditions met; VDD complete |

## Example Files

| File | Asset Type | Stage | Level |
|------|------------|-------|-------|
| `examples/italy-wind-greenfield-l0.rals.yaml` | Onshore Wind | Greenfield | L0 |
| `examples/italy-pv-rtb-l2.rals.yaml` | Solar PV | Ready-to-Build | L2 |

## Key Authorities

- **ARERA**: energy regulator — [arera.it](https://www.arera.it)
- **MASE**: energy ministry — [mase.gov.it](https://www.mase.gov.it)
- **GSE**: support scheme administrator — [gse.it](https://www.gse.it)
- **Terna**: national TSO — [terna.it](https://www.terna.it)

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice. Italian renewable energy law, grid connection rules, and support scheme terms change frequently. Always verify with qualified Italian legal counsel, Terna, and the relevant Regione.
