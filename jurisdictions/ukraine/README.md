# RALS Jurisdiction Package — Ukraine (UA)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Ukraine.

**Ukraine is subject to an exceptional risk environment.** Since February 2022, Ukraine has been under full-scale armed conflict. Martial law is in effect. Approximately 50% of large-scale grid infrastructure has been damaged or destroyed. This package applies heightened risk standards that override standard RALS readiness logic.

A Ukrainian asset **cannot be classified above L2** without documented war-risk insurance or IFI political risk guarantee, an independent security assessment, and legal confirmation of contract validity under martial law. Assets in occupied territories cannot be classified at any readiness level.

## Supported Asset Types

- Solar PV (operating and development)
- Onshore wind
- Battery energy storage (BESS)
- Hybrid (wind + BESS, wind + H2 concept-stage)
- Hydro (reconstruction context)

## Main Transaction Risks

- **War damage**: Russian strikes target energy infrastructure in all Ukrainian oblasts. Physical condition of any asset must be independently confirmed post-invasion.
- **Grid damage and reconstruction**: ~50% of large substation capacity damaged. Pre-war grid connection agreements may reference non-functional infrastructure.
- **Occupation and security risk**: assets in occupied oblasts (Kherson, Zaporizhzhia, Donetsk, Luhansk, parts of Kharkiv/Mykolaiv) cannot be transacted. Near-frontline assets require security assessment.
- **Martial law**: standard civil and administrative procedures are modified. Contract validity and enforceability require current legal opinions.
- **Currency convertibility**: profit repatriation is restricted by National Bank of Ukraine. Investment structure must address this explicitly.
- **State counterparty risk**: Energorynok (FiT buyer), Ukrenergo, and state DSOs are under stress. Prior FiT restructuring demonstrated risk of imposed losses.
- **War-risk insurance gap**: commercial war-risk insurance for Ukraine is scarce. MIGA, EBRD, or equivalent IFI political risk cover is typically required for any financing.

## Readiness Level Interpretation

| Level | Label | Ukraine Override |
|-------|-------|-----------------|
| L0 | Teaser Only | Not in occupied territory. No other evidence required. |
| L1 | Screenable | Physical condition confirmed; not in frontline zone; grid status assessed |
| L2 | Investment Memo Ready | Security assessment; war-risk insurance concept; current grid confirmation; IFI screening feasible |
| L3 | Lender Diligence Ready | Requires IFI guarantee or MIGA cover; legal opinion on martial law; exceptional; rare in 2026 |
| L4 | Data Room Ready | Effectively post-conflict exception; vanishingly rare in 2026 |

## Example Files

| File | Asset Type | Stage | Level |
|------|------------|-------|-------|
| `examples/ukraine-pv-development-l1.rals.yaml` | Solar PV | Development | L1 (max given risks) |
| `examples/ukraine-wind-hybrid-h2-l0.rals.yaml` | Wind + H2 Hybrid | Greenfield Concept | L0 |

## Key Authorities

- **NEURC**: energy regulator — [nerc.gov.ua](https://www.nerc.gov.ua)
- **Ukrenergo**: national TSO — [ua.energy](https://ua.energy)
- **Ministry of Energy**: [mpe.kmu.gov.ua](https://mpe.kmu.gov.ua)
- **EBRD Ukraine**: key IFI for project finance — [ebrd.com](https://www.ebrd.com)
- **MIGA (World Bank)**: political risk insurance — [miga.org](https://www.miga.org)

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice, political risk assessment, or security advisory. The situation in Ukraine is evolving rapidly. Always verify current conditions with qualified Ukrainian legal counsel, Ukrenergo, NEURC, and relevant IFI representatives before relying on this package.
