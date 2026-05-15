# RALS Jurisdiction Package — Georgia (GE)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Georgia.

Georgia is a developing renewable energy market with significant hydro dominance, a growing solar pipeline, and an active CfD auction programme introduced in 2022. The regulatory framework is administered centrally (GNERC as regulator; GSE as sole TSO; ESCO as market operator). Land rights for most large renewable projects rely on state usufruct agreements. The market is at an early stage of IPP development with limited large-scale solar and wind track record.

## Supported Asset Types

- Hydro (run-of-river) — primary technology; dominant in existing generation mix
- Solar PV — growing sector; primarily east Georgia
- Onshore wind — nascent; limited operating track record
- Hybrid — development stage

## Key Regulatory Authorities

| Authority | Role | URL |
|-----------|------|-----|
| Ministry of Economy and Sustainable Development | Energy policy; CfD programme | economy.ge |
| GNERC | Energy regulator; issues generation licences | gnerc.org |
| GSE (Georgian State Electrosystem) | Sole TSO; grid connection agreements | gse.com.ge |
| ESCO | Electricity market operator | esco.ge |
| GEDF (Georgian Energy Development Fund) | Energy project financing and development | — |
| NAPR (National Agency of Public Registry) | Land title registration | — |

## Revenue Routes

| Route | Description | Notes |
|-------|-------------|-------|
| CfD auction | 15-year fixed strike price, Government auction | Oversubscribed; award not guaranteed |
| Industrial PPA | Direct contract with large consumers (>100 kW) | Growing; credit quality varies |
| ESCO market | Wholesale market; guaranteed capacity | Uncontracted; revenue volatile |
| Regulated tariff | Legacy GNERC-set tariff | Declining relevance for new projects |
| Export PPA (Turkey) | Cross-border export; limited volumes | Limited by interconnection capacity |

## Readiness Level Interpretation

| Level | Label | Georgia-Specific Trigger |
|-------|-------|--------------------------|
| L0 | Teaser Only | Asset identified; no permit/grid/land evidence required |
| L1 | Screenable | Site confirmed; GSE inquiry submitted; land status identified; revenue route stated |
| L2 | Investment Memo Ready | GSE technical conditions received; usufruct signed and NAPR registered; construction permit issued; EIA clearance; GNERC licence applied |
| L3 | Lender Diligence Ready | GSE connection agreement signed; GNERC licence issued; confirmed CfD award OR signed PPA; bankable hydrological study (hydro) |
| L4 | Data Room Ready | EPC signed; all conditions precedent met; all contracts final; VDD complete |

## Critical Georgia-Specific Requirements

**Two separate permitting tracks** must both be completed for RTB:
1. Construction permit from local municipality (or Ministry of Regional Development for strategic/large projects)
2. GNERC generation licence from GNERC

**Land control**: most large projects use state usufruct under Government Resolution 515 (October 2018). Usufruct must be signed and NAPR-registered — unregistered usufruct does not constitute secured land for L2+ purposes.

**GSE connection process**: application → technical conditions letter → connection agreement → construction → COD. Typical timeline: 6–9 months. The technical conditions letter (L2) and the signed connection agreement (L3) are separate milestones.

**CfD revenue**: a pending CfD application is NOT confirmed revenue. Only a confirmed CfD contract award satisfies L3 revenue requirements. Both the 2023 and 2024 auctions were oversubscribed.

## Main Transaction Risks

- **Seasonal hydro variability**: run-of-river hydro is highly seasonal; multi-year P50/P90 and dry year scenario are essential. Winter revenues are low; Georgia imports 40–60% of electricity in winter.
- **Grid congestion (west Georgia)**: west Georgia transmission constraints; GSE curtailment possible without compensation.
- **CfD auction competition**: oversubscribed auctions mean not all applicants receive CfD contracts.
- **GNERC licence delay**: licence is a separate requirement from construction permit; delays are a known risk.
- **Political risk**: government transitions, democratic concerns, and Russian regional influence create uncertainty.
- **Currency risk (GEL/USD)**: emerging market currency volatility; capital remittance restrictions possible.
- **Limited IPP track record**: immature solar/wind developer and EPC market.

## Example Files

| File | Asset Type | Stage | Level |
|------|------------|-------|-------|
| `examples/georgia-hydro-development-l1.rals.yaml` | Hydro run-of-river | Development | L1 |
| `examples/georgia-solar-cfd-l2.rals.yaml` | Solar PV | Development | L2 |

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice. Georgian energy law, GNERC licensing procedures, CfD auction rules, and GSE grid connection requirements change and should be verified with qualified Georgian legal counsel and directly with GNERC and GSE before relying on this package for a specific transaction.
