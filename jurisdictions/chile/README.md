# RALS Jurisdiction Package — Chile (CL)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Chile.

Chile is Latin America's most mature renewable energy and corporate PPA market. It operates the SEIN (Sistema Eléctrico Nacional), a unified national grid dispatched by CEN (Coordinador Eléctrico Nacional). The country has exceptional solar resources in the north (Atacama) and strong wind resources in the south (Biobío, La Araucanía, Los Lagos), but faces structural challenges including transmission bottlenecks in the north and mandatory indigenous consultation requirements under ILO 169.

## Supported Asset Types

- Solar PV (utility-scale; primary technology in Antofagasta/Atacama regions)
- Onshore wind (primary technology in Biobío/La Araucanía/Los Lagos regions)
- BESS (growing, particularly as PPA storage-bundled structures)
- CSP (legacy; new development limited by DGA water rights scarcity)
- Small hydro
- Hybrid assets

## Main Transaction Risks

- **Curtailment (Atacama/North)**: Transmission bottleneck between northern solar generation and central demand centres. The Kimal-Lo Aguirre line (1,342 km, 3,000 MW) is under development but not yet operational. Approximately 2,684 GWh were dispatched at zero cost or curtailed in the first 7 months of 2025. Mandatory disclosure for all northern Chile assets above L0.
- **Indigenous consultation (PCPI)**: ILO 169 is ratified in Chile. PCPI (Consulta Previa y Participación Indígena) is mandatory when projects may affect indigenous communities. SEA coordinates within the SEIA process. Timelines: 2–4 months formally, but 6–24 months in practice; community opposition can block projects entirely. PCPI must be completed (not merely initiated) for L3 classification.
- **DGA water rights**: Extremely scarce in northern Chile. Competing mining industry claims are common. Judicial disputes can last years. Critical blocker for CSP and hydro projects in Atacama/Antofagasta.
- **Transmission expansion lag**: Kimal-Lo Aguirre under development; not yet operational as of 2025–2026. Financial models assuming early commissioning create lender risk.
- **RCA finality**: The RCA (Resolución de Calificación Ambiental) issued by SEA must be final and uncontested — no pending recurso de reclamación at Comité de Ministros or in court. An RCA under appeal is a hard blocker for L3 classification.
- **PPA market maturation**: Pure solar PPAs without storage are increasingly difficult to finance as market saturates. Mining-company offtakers increasingly demand storage-bundled or 24/7 supply structures.

## Key Regulatory Authorities

| Authority | Role |
|-----------|------|
| **MinEnergia** | Energy policy and sector oversight |
| **CNE** | Energy planning; sets transmission tariffs; price regulation |
| **SEC** | Technical safety regulator; grid code |
| **CEN** | Grid operator and dispatcher; processes connection applications |
| **SEA** | Environmental assessment authority; issues RCA; coordinates PCPI |
| **DGA** | Water rights authority; issues derechos de aprovechamiento |
| **CONAF** | Forest permits (native forest proximity) |
| **Municipalidad** | Construction permits (permiso de edificación) |
| **CONADI / MoA** | Indigenous consultation liaison |

## Readiness Level Interpretation

| Level | Label | Chile-Specific Trigger |
|-------|-------|------------------------|
| L0 | Teaser Only | Asset identified; no permit/grid/land evidence; curtailment risk noted for northern assets |
| L1 | Screenable | SEIA applicability assessed; PCPI applicability assessed; CEN pre-application initiated; desktop yield available |
| L2 | Investment Memo Ready | SEIA submitted to SEA; PCPI initiated (if required); CEN technical review submitted; land option signed; PPA term sheet with named counterparty |
| L3 | Lender Diligence Ready | RCA final and uncontested; PCPI completed (if required); CEN connection agreement signed; land registered; PPA signed ≥10 years |
| L4 | Data Room Ready | EPC signed; all conditions precedent met; VDD complete; CEN dispatch registration initiated |

## Example Files

| File | Asset Type | Stage | Level | Region |
|------|------------|-------|-------|--------|
| `examples/chile-solar-development-l1.rals.yaml` | Solar PV, 120 MW | Development | L1 | Antofagasta (Atacama) |
| `examples/chile-wind-ppa-l2.rals.yaml` | Onshore Wind, 80 MW | Development | L2 | Biobío (South) |

## Grid and Market Design Notes

- **SEIN**: Unified national grid (former SING + SIC, merged 2019). Open-access transmission. CEN dispatches on merit-order (lowest marginal cost first).
- **Corporate PPA market**: Most mature in Latin America. Typical terms: 10–20 years, USD-denominated. Mining companies are primary offtakers.
- **PMGD**: Assets below 9 MW on distribution network. DS 125 (2025) introduced curtailment rules requiring forecast and monitoring. Two pricing options: Precio Estabilizado (stabilised) or marginal (SEIN spot).
- **Spot market**: Northern Atacama nodes frequently reach zero or near-zero during peak solar hours. Financial models must reflect this.

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice. Chilean renewable energy law, SEIA requirements, indigenous consultation rules, and grid connection standards change frequently. The PMGD framework was materially amended by DS 125 in 2025. The SEIA reform of 2025 changed some exemption thresholds. Always verify with qualified Chilean legal counsel, a licensed environmental consultant, and the relevant authorities (CEN, SEA, DGA, CONAF, Municipalidad) before relying on this package for a specific transaction.
