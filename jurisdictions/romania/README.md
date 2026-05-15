# RALS Jurisdiction Package — Romania (RO)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Romania.

Romania is one of Central and Eastern Europe's most active renewable energy markets, with a large PV and wind pipeline and a growing BESS sector. However, there is a significant gap between nominal pipeline claims and bankable, transaction-ready assets. Over 60 GW of projects hold ATRs (grid connection permits) but only a fraction have the permits, land security, and revenue route required for institutional investment.

## Supported Asset Types

- Solar PV (utility-scale ground-mount)
- Onshore wind (Dobrogea and Transylvania)
- Battery energy storage (BESS) — standalone and co-located
- Legacy hydro and biomass (primarily operating/refinancing context)

## Main Transaction Risks

- **Grid saturation (Dobrogea)**: Romania's primary renewable energy zone has severe grid constraints. ATRs are plentiful on paper; physical connection capacity is scarce. Transelectrica's new 2026 auction-based allocation creates additional transition risk.
- **ATR validity and guarantee**: ANRE Order 20/2025 requires a 5% financial guarantee to maintain ATR validity. ATRs without guarantee are at risk of lapsing.
- **Land title complexity**: unregistered land (not inscris in Cartea Funciara) is common in rural Romania and creates material title risk. Agricultural land de-registration is required before construction permits.
- **Readiness claim inflation**: projects marketed as "RTB" frequently do not meet L2 evidence requirements. Apply rigorous evidence-based classification.
- **Revenue uncertainty**: no new support scheme (CfD) is operational as of 2026. New builds are merchant or PPA. Do not model CfD revenue without an official award.

## Readiness Level Interpretation

| Level | Label | Romania-Specific Trigger |
|-------|-------|--------------------------|
| L0 | Teaser Only | Technology and county known; no ATR/permit/land evidence |
| L1 | Screenable | Site confirmed; ATR application submitted; land situation assessed |
| L2 | Investment Memo Ready | Valid ATR with guarantee; env. permit in process; binding arenda signed |
| L3 | Lender Diligence Ready | Permits final (no contestatie); connection contract signed; PPA or GC confirmed |
| L4 | Data Room Ready | EPC signed; all conditions precedent met; VDD complete |

## Example Files

| File | Asset Type | Stage | Level |
|------|------------|-------|-------|
| `examples/romania-pv-development-l1.rals.yaml` | Solar PV | Development | L1 |
| `examples/romania-bess-rtb-l2.rals.yaml` | BESS | Ready-to-Build | L2 |

## Key Authorities

- **ANRE**: energy regulator — [anre.ro](https://www.anre.ro)
- **Transelectrica**: national TSO — [transelectrica.ro](https://www.transelectrica.ro)
- **Ministerul Energiei**: energy ministry — [energie.gov.ro](https://energie.gov.ro)

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice. Romanian energy regulation, the new 2026 ATR auction system, and support scheme development are evolving rapidly. Always verify with qualified Romanian legal counsel, ANRE, and Transelectrica.
