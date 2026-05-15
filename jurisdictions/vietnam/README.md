# RALS Jurisdiction Package — Vietnam (VN)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Vietnam.

Vietnam is a frontier renewable energy market with significant solar and wind resources, a rapidly growing installed base, and a complex regulatory environment undergoing structural reform. The market is characterised by EVN's monopoly over grid and power purchasing, the expiry of legacy FiT programmes, the introduction of a DPPA framework (Decree 57/2025) and a market-based transitional framework (Decree 58/2025/ND-CP), and systemic grid congestion in the most resource-rich provinces.

International investors and lenders face material challenges in Vietnam including EVN counterparty risk, uncompensated curtailment, FX convertibility restrictions, and decree-level regulatory instability. This package helps structure transaction-readiness assessment against these realities.

## Supported Asset Types

- **Solar PV** — primary technology; concentrated in south-central provinces (Ninh Thuan, Binh Thuan) and Mekong Delta; severe curtailment risk in south-central zone
- **Onshore wind** — growing sector; key development areas in Ca Mau, Ben Tre, Tra Vinh (south), Ninh Thuan, Binh Thuan (south-central), and Quang Tri (central)
- **Offshore wind** — in development; significant pipeline announced but regulatory and grid framework not yet mature; limited completed transactions as of 2026
- **Small hydro** — established, mainly operating; hydro concession risk applicable
- **BESS** — emerging; regulatory framework for standalone BESS developing

## Key Authorities

| Authority | Role |
|-----------|------|
| MOIT (Ministry of Industry and Trade) | Energy policy, sector oversight, power development planning |
| EVN (Vietnam Electricity) | Grid operator, power buyer, monopoly utility |
| NLDC / A0 | National Load Dispatch Centre — grid dispatch and connection applications |
| MoNRE | Environmental Impact Assessment (EIA) approval |
| MPI / provincial DPI | Investment Registration Certificate (IRC) issuance |
| Provincial People's Committees | Construction permits, land use, agricultural conversion approval |

## Main Transaction Risks

- **EVN counterparty risk (HIGH)**: Standard EVN PPAs are widely considered un-bankable by international lenders. Unfavorable force majeure and termination clauses, no sovereign guarantee on EVN payment obligations, VND denomination vs USD-denominated financing costs.
- **Uncompensated curtailment (HIGH)**: South-central provinces (Ninh Thuan, Binh Thuan, Khanh Hoa, Phu Yen) face severe and systemic curtailment. 364 GWh curtailed nationally in 2020. No compensation mechanism in most contracts. P50 yields must be adjusted.
- **FX convertibility risk (HIGH)**: Revenue in VND; profit repatriation and debt service conversion require SBV approval; structural mitigants required for international financing.
- **Decree regulatory instability (MEDIUM)**: Framework has changed multiple times since 2017. Decree 57/2025 (DPPA) and Decree 58/2025/ND-CP (transitional market) are the current framework but further changes are possible.
- **LURC agricultural conversion (MEDIUM)**: Agricultural land conversion requires provincial PPC approval; timelines unpredictable (12–24 months additional risk); prerequisite for construction permit.
- **EVN grid monopoly (MEDIUM)**: No independent grid regulator or appeals mechanism; queue management opaque; connection timelines uncertain.

## Revenue Framework (as of 2025–2026)

| Revenue Model | Decree | Status |
|---------------|--------|--------|
| FiT 1 / FiT 2 / FiT 3 | Various (2017–2020) | Expired — no new contracts |
| DPPA (Direct PPA to large consumers) | Decree 57/2025 | Active |
| EVN transitional contract (70% minimum output, 12 years) | Decree 58/2025/ND-CP | Active for eligible projects |
| VWEM spot market (via EVN) | Decree 58/2025/ND-CP | Active |
| Competitive auction (AUCTT) | None in force | Not operational as of 2025 |

## Permitting Chain

All four of the following are required before ready-to-build classification:

1. **IRC** — Investment Registration Certificate (from provincial DPI or MPI)
2. **ERC** — Enterprise Registration Certificate
3. **EIA approval** — from MoNRE; typically 6–12 months from submission
4. **Construction permit** — from provincial Construction Department; requires EIA approval

## Readiness Level Interpretation

| Level | Label | Vietnam-Specific Trigger |
|-------|-------|--------------------------|
| L0 | Teaser Only | Asset identified; no permit/grid/land evidence |
| L1 | Screenable | Province confirmed; grid inquiry submitted; LURC holder identified; IRC status known; EVN counterparty risk acknowledged |
| L2 | Investment Memo Ready | IRC obtained; EIA submitted; EVN technical conditions letter received; LURC or JV land access signed; bankable yield with curtailment; revenue model confirmed against current decree |
| L3 | Lender Diligence Ready | IRC + ERC + EIA approval + construction permit all obtained; signed EVN Connection Agreement; revenue contract (DPPA or transitional); LURC secured; EVN counterparty risk structurally addressed; curtailment in DSCR base case |
| L4 | Data Room Ready | EPC signed; all permits final; connection works contracted; FX/repatriation structure agreed; all VDD reports complete |

## Example Files

| File | Asset Type | Stage | Level | Key Issues |
|------|------------|-------|-------|------------|
| `examples/vietnam-solar-development-l1.rals.yaml` | Solar PV (100 MW) | Development | L1 | Ninh Thuan curtailment zone; IRC only; no EVN connection agreement; DPPA counterparty unidentified; agricultural conversion pending |
| `examples/vietnam-wind-operating-l2.rals.yaml` | Onshore Wind (50 MW) | Operating | L2 | FiT expired pre-commissioning; pure VWEM spot revenue; curtailment 15% historically; EVN metering disputes; FX risk |

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice. Vietnam's renewable energy regulatory framework is subject to frequent and material change. The Decree 57/2025 and Decree 58/2025/ND-CP frameworks described here reflect the position as of May 2026. Always verify current requirements with qualified Vietnamese legal counsel and MOIT/EVN directly. Foreign investors should obtain independent FX and repatriation advice.
