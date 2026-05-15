# Vietnam Compliance Mapping

This document maps RALS fields to specific regulatory and market structures in Vietnam (e.g., DPPA, EVN PPA, environmental approvals).

## 1. Direct Power Purchase Agreement (DPPA)
Vietnam's emerging DPPA mechanism allows generators to sell directly to large consumers.
- `grid_offtake.offtake_structure`: Specify "DPPA" if applicable.
- `grid_offtake.offtake_contracts`: Ensure the "contract_type" reflects the virtual or physical DPPA structure. Counterparty should be explicitly identified if not EVN.

## 2. EVN Power Purchase Agreements
- Historically, the sole offtaker is EVN (Vietnam Electricity).
- `grid_offtake.offtake_contracts.counterparty`: Usually "EVN" or a specific regional subsidiary (e.g., EVN SPC).
- `grid_offtake.offtake_contracts.price_eur_mwh`: Note that EVN PPAs are typically denominated in VND, pegged to USD. Foreign exchange risk handling should be captured in `financials.currency_profile` (v0.2).

## 3. Master Plan Alignment (PDP8)
- Assets must align with the Power Development Plan 8 (PDP8).
- `compliance.permits`: Include "Investment Policy Approval" (Chấp thuận chủ trương đầu tư) from the provincial People's Committee or Prime Minister.

## 4. Environmental and Social
- `compliance.environmental_assessments`: Must include the Environmental Impact Assessment (ĐTM - Đánh giá Tác động Môi trường) approved by MONRE or provincial DONRE.
