# RALS Jurisdiction Package — Namibia (NA)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Namibia.

Namibia operates a **Modified Single Buyer (MSB)** electricity market in which NamPower is the sole grid operator and the only wholesale electricity buyer. There is no competitive wholesale electricity market. All grid-connected renewable energy projects must sell to NamPower under a PPA approved by RERA and the Minister of Mines and Energy.

The package covers solar PV, onshore wind, and green hydrogen (H2 in development — no operational offtake framework for most projects).

## Supported Asset Types

- Solar PV (utility-scale; 2025 IPP tender market)
- Onshore wind
- Green hydrogen (concept and development stage only; validate separately as L0 unless signed offtake exists)
- Hybrid (solar + wind; solar/wind + H2 concept)

## Key Market Features

- **Modified Single Buyer model** (since September 2019): NamPower is single buyer and TSO. No merchant or wholesale market.
- **2025 IPP Tender**: NamPower tender for 120 MW solar (6 × 20 MW). Competitive bidding. Local content: 39% Namibian ownership + 20% previously disadvantaged Namibians (PDN). Bids due January 2026.
- **REFIT**: Expired for new projects. ~14 licences (70 MW total) issued historically; most operational. No new REFIT licences.
- **Green Hydrogen**: Hyphen Hydrogen Energy project (5 GW wind/solar + 3 GW electrolyser) is the flagship. Most other H2 projects lack offtake frameworks.
- **Grid**: NamPower peak demand ~1.5 GW. Small grid. Grid connection timeline: 6–12 months for feasibility + engineering. No competitive grid access.

## Main Transaction Risks

- **NamPower single buyer risk** (HIGH): NamPower is the only offtaker. No market backup exists. NamPower creditworthiness and sovereign support must be assessed.
- **RERA/Minister approval risk** (HIGH): The Minister of Mines and Energy has final discretion on generation licences. A positive RERA recommendation does not guarantee approval.
- **Communal land title risk** (HIGH): Communal land under the Communal Land Reform Act 2002 requires formal Communal Land Board registration, which is slow and uncertain. Unregistered communal land caps readiness at L1 maximum.
- **Local content requirement** (MEDIUM): 39% Namibian ownership + 20% PDN is a bid qualifier for the 2025 IPP tender. Non-compliance is a disqualifier.
- **Grid capacity / small market** (MEDIUM): 1.5 GW peak demand limits absorption of large new projects. Large projects need NamPower capacity confirmation.
- **H2 offtake uncertainty** (HIGH for H2 component): No standardised H2 offtake framework. H2 revenue claims without signed offtake are L0 speculative.
- **Currency / NAD-ZAR peg** (MEDIUM): NAD pegged to ZAR at 1:1. EUR/USD FX risk material for international investors over long PPA terms.
- **Limited EPC/O&M capacity** (MEDIUM): Minimal Namibian contractor base; dependence on South African and international firms adds cost and logistics risk.

## Readiness Level Interpretation

| Level | Label | Namibia-Specific Gate Conditions |
|-------|-------|----------------------------------|
| L0 | Teaser Only | Technology, region, approximate capacity. No evidence required. |
| L1 | Screenable | Site identified; land tenure type known; communal unregistered acceptable but capped here |
| L2 | Investment Memo Ready | Freehold/state lease/communal registered title; ECC application submitted; RERA application submitted; NamPower grid inquiry active; NamPower PPA term sheet or IPP tender bid submitted |
| L3 | Lender Diligence Ready | ECC granted; generation licence granted by **Minister**; NamPower **connection agreement signed**; **signed NamPower PPA** or confirmed IPP award |
| L4 | Data Room Ready | EPC contracted; all permits final; NamPower PPA effective; financial close ready |

**Three hard rules for Namibia:**
1. Communal unregistered land = maximum L1
2. Signed NamPower PPA (or confirmed IPP tender award with PPA heads of terms) required for L3
3. Minister of Mines and Energy generation licence (not only RERA recommendation) required for L3

## Key Authorities

- **MME** — Ministry of Mines and Energy: generation licence final decision
- **RERA** — Renewable Energy and Electricity Authority (formerly ECB): generation licence review and recommendation; PPA tariff approval
- **NamPower** — TSO and single buyer: grid connection and PPA counterparty
- **MEFT** — Ministry of Environment Forestry and Tourism: Environmental Clearance Certificate
- **Ministry of Lands / Deeds Office**: title deed and state lease registration

## Example Files

| File | Asset Type | Stage | Level |
|------|------------|-------|-------|
| `examples/namibia-solar-greenfield-l0.rals.yaml` | Solar PV + H2 concept | Greenfield Concept | L0 |
| `examples/namibia-wind-ppa-l2.rals.yaml` | Onshore Wind | Development | L2 |

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice, regulatory opinion, or investment advice. Namibia's renewable energy framework is evolving; the 2025 IPP tender and H2 policy are subject to change. Always verify current conditions with qualified Namibian legal counsel, NamPower, RERA, and MEFT before relying on this package. Communal land tenure requires specialist Namibian legal advice that this package cannot substitute.
