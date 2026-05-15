# Chile Compliance Mapping

This document maps RALS fields to specific regulatory and market structures in Chile (e.g., SEN nodal pricing, PMGD, environmental approvals).

## 1. Nodal Pricing (SEN)
Chile operates a nodal pricing system (Sistema Eléctrico Nacional - SEN).
- `grid_offtake.offtake_contracts`: For PPA contracts, the injection node and the withdrawal node should be specified. Basis risk between nodes is a key valuation driver.
- Use `grid_offtake.locational_pricing` (upcoming in v0.2) to specify the "Nudo" (Node).

## 2. Environmental Approvals (SEIA)
- `compliance.environmental_assessments`: Must include the "Resolución de Calificación Ambiental" (RCA) issued by the Servicio de Evaluación Ambiental (SEA).
- `permit_type`: Use "RCA" for the primary environmental permit.

## 3. PMGD (Pequeños Medios de Generación Distribuida)
For assets under 9 MW:
- `grid_offtake.offtake_structure`: Should reflect "PMGD" if applicable.
- `grid_offtake.offtake_contracts`: The "Precio Estabilizado" (stabilized price) mechanism should be detailed.

## 4. Land Rights (Concesiones)
- `compliance.land_rights`: Specify if the land is held under a "Concesión Onerosa" from the Ministerio de Bienes Nacionales (MBN), or private lease/ownership.
