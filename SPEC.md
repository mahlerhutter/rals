# Renewable Asset Listing Standard (RALS)

**Specification v0.1 — Draft for Public Comment**

Status: Working Draft
Editor: Manuel Mendel
License: CC BY 4.0 (specification), MIT (reference implementations)
Date: 2026-05-15

---

## Abstract

The Renewable Asset Listing Standard (RALS) defines a machine-readable, vendor-neutral format for describing renewable energy assets that are offered for sale, refinancing, or partnership. It enables sellers, advisors, and prospective buyers — including AI agents acting on behalf of institutional investors — to discover, parse, and evaluate utility-scale renewable assets without proprietary data rooms or bespoke spreadsheet templates.

RALS is a YAML 1.2 serialization format hosted at well-known URLs on seller or advisor domains, with a two-tier access model: a public **Teaser Profile** discoverable by any agent, and an authenticated **Full Profile** accessible after NDA via OAuth 2.0 token exchange.

This document specifies version 0.1 of the standard. It is a Working Draft and subject to change.

---

## 1. Status of this Document

This is a Working Draft. It is intended for review by:

- Renewable energy M&A practitioners (IPPs, utilities, funds, advisors)
- Operators of data room platforms and asset marketplaces
- Implementers of AI agent systems for institutional asset acquisition
- Industry associations (SolarPower Europe, WindEurope, BSW-Solar, BWE)

Comments are welcomed via GitHub Issues at `github.com/mahlerhutter/rals`.

The editor expects breaking changes between v0.1 and v1.0. Implementations of v0.1 SHOULD declare `rals_version: "0.1"` and MUST be prepared to migrate.

---

## 2. Terminology

The key words **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174).

Throughout this specification:

- **Asset** refers to a renewable energy generation or storage facility, or a portfolio of such facilities offered as a single transaction lot.
- **Seller** refers to the legal entity offering the Asset for sale or other transaction.
- **Advisor** refers to a third party (M&A boutique, investment bank, broker) acting on behalf of the Seller.
- **Buyer** refers to any party evaluating the Asset for acquisition, including their authorized agents.
- **Agent** refers to an automated system (typically LLM-based) acting on behalf of a Buyer.
- **Teaser Profile** refers to the publicly accessible subset of an RALS document.
- **Full Profile** refers to the complete RALS document, accessible only after authentication.

---

## 3. Design Principles

RALS is designed around five principles. Implementers SHOULD understand them before extending or critiquing the standard.

**P1 — Machine-first, human-readable.** YAML was chosen over JSON-LD or XML because deal teams maintain RALS documents in version control alongside their data rooms. Humans must be able to read and diff them.

**P2 — Two-tier confidentiality is intrinsic.** Unlike property listings, renewable asset transactions are confidential by default. RALS does not pretend otherwise. Every field is classified as `public`, `nda_required`, or `final_shortlist`.

**P3 — Bring-your-own-data-room.** RALS does not replace Drooms, Datasite, or Intralinks. It references them. Sellers continue to operate their data rooms; RALS provides the structured index.

**P4 — Opinionated where the industry isn't.** Where industry practice has settled (e.g. P50/P75/P90 production estimates), RALS adopts it. Where practice is fragmented (e.g. OPEX line-item structure), RALS imposes a canonical taxonomy and lets implementers extend it.

**P5 — Compliance-anchored.** Fields map explicitly to EU Taxonomy (Regulation 2020/852), MiFID II disclosure requirements where relevant, and country-specific permitting frameworks. See Annex B.

---

## 4. File Format and Discovery

### 4.1 File Format

An RALS document MUST be a valid YAML 1.2 file, UTF-8 encoded, with file extension `.rals.yaml` or hosted at the path `/.well-known/rals.yaml`.

Maximum file size: 512 KB. Larger payloads (e.g. production timeseries, technical reports) MUST be referenced by URL rather than inlined.

### 4.2 Discovery Mechanisms

Three discovery mechanisms are defined, in decreasing order of preference.

**Method 1 — Well-Known URI (preferred):**
```
https://seller.example.com/.well-known/rals.yaml
```

For sellers offering multiple assets, a directory index MAY be served at `/.well-known/rals/index.json`:
```json
{
  "version": "0.1",
  "assets": [
    "/.well-known/rals/asset-001.yaml",
    "/.well-known/rals/asset-002.yaml"
  ],
  "updated": "2026-05-15T10:00:00Z"
}
```

**Method 2 — HTML Link Tag:**
```html
<link rel="rals" href="/assets/operating-pv-iberia.rals.yaml" type="application/yaml" />
```

**Method 3 — Registry Submission:**
Sellers MAY submit their well-known URI to the public RALS Registry (operated by the RALS Working Group), which provides a queryable index for buyer agents. Registry submission is OPTIONAL.

### 4.3 Confidentiality Tiers

Every field in the RALS schema carries a confidentiality tier:

- `public` — included in the Teaser Profile, no authentication required
- `nda_required` — visible only after NDA acceptance via the access flow described in Section 12
- `final_shortlist` — visible only to buyers explicitly admitted to the final shortlist by the Seller

Servers MUST filter fields by tier based on the requesting agent's authorization level. The default for any field not explicitly tagged is `nda_required`.

Tiers are assigned at field granularity, and a tier MAY be assigned to an individual field nested inside an object. A nested field inherits the tier of its enclosing object unless it carries its own tier. This allows, for example, `production_estimates.methodology` to be `public` while the P50/P75/P90 numbers in the same object remain `nda_required`. Implementation-defined fields not listed in this specification default to `nda_required` regardless of their position; servers MUST NOT expose them in the Teaser tier unless the schema explicitly tags them `public`.

---

## 5. Document Structure

An RALS document consists of seven top-level sections plus a metadata header:

```yaml
rals_version: "0.1"
document_id: "rals:01H8XY...PVN9"
generated_at: "2026-05-15T10:00:00Z"
generated_by: "seller.example.com/rals-generator/v1.2"
language: "en"

identity: { ... }
technical: { ... }
grid_offtake: { ... }
financials: { ... }
compliance: { ... }
operating_history: { ... }
process: { ... }
```

All seven sections are REQUIRED for a Full Profile. For a Teaser Profile, only `identity`, plus the `public`-tagged fields of `technical`, `grid_offtake`, and `process`, are REQUIRED.

---

## 6. Section: identity

The `identity` section establishes who and what is being offered. It forms the core of the Teaser Profile and is mostly `public`; precise location and seller-identifying fields are restricted.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `asset_name` | string | MUST | public | Project or portfolio display name. Anonymized in Teaser if desired (e.g. "Project Helios"). |
| `asset_type` | enum | MUST | public | One of: `solar_pv`, `onshore_wind`, `offshore_wind`, `bess`, `hybrid`, `hydro`, `biomass`, `geothermal`, `csp`. |
| `lifecycle_stage` | enum | MUST | public | One of: `greenfield`, `development`, `ready_to_build`, `under_construction`, `commissioning`, `operating`, `repowering_candidate`, `decommissioning`. |
| `country` | string (ISO 3166-1 alpha-2) | MUST | public | Country of asset location. |
| `region` | string | SHOULD | public | First-level sub-national region (e.g. "Andalucía", "Schleswig-Holstein"). |
| `sub_region` | string | MAY | public | Second-level region, province, or district (e.g. "Albacete Province", "Kreis Dithmarschen"). |
| `coordinates` | geo | SHOULD | `nda_required` (single site) / `public` (portfolio centroid) | WGS84 `[longitude, latitude]`. For portfolios, the centroid MAY be exposed in the Teaser tier. |
| `site_area_hectares` | number | MAY | public | Total site area in hectares. |
| `site_configuration` | string | MAY | public | Free-text note on site layout (e.g. "two clusters, 12 km apart, single SPV"). |
| `total_capacity_mw` | number | MUST (non-PV) | public | Installed AC capacity / power rating in MW. See Section 6.1 for the technology-conditional rule. |
| `total_capacity_mw_ac` | number | MUST (PV) | public | AC capacity (inverter-limited) in MW. REQUIRED when `asset_type` is `solar_pv`. |
| `total_capacity_mw_dc` | number | MUST (PV) | public | DC capacity (module nameplate) in MW. REQUIRED when `asset_type` is `solar_pv`. |
| `dc_ac_ratio` | number | SHOULD (PV) | public | Ratio of DC to AC capacity. |
| `total_energy_mwh` | number | MUST (BESS) | public | Stored energy capacity. REQUIRED when `asset_type` is `bess`, MAY for others. |
| `number_of_turbines` | integer | MUST (wind) | public | Turbine count. REQUIRED when `asset_type` is `onshore_wind` or `offshore_wind`. |
| `transaction_type` | enum | MUST | public | One of: `full_acquisition`, `majority_stake`, `minority_stake`, `refinancing`, `joint_venture`, `ppa_only`. |
| `equity_offered_pct` | number | SHOULD | public | Percentage of equity offered in the transaction. |
| `seller_legal_entity` | string | MUST | nda_required | Registered legal entity of the Seller. |
| `seller_jurisdiction` | string | SHOULD | nda_required | Jurisdiction of the Seller entity. |
| `spv_structure` | boolean | SHOULD | nda_required | Whether the Asset is held in a dedicated SPV. |
| `spv_jurisdiction` | string | SHOULD if `spv_structure` is true | nda_required | Jurisdiction of the SPV. |
| `spv_form` | string | MAY | nda_required | Legal form of the SPV (e.g. "GmbH & Co. KG"). |
| `spv_tax_grouping` | string | MAY | nda_required | Tax grouping / fiscal-unity note (e.g. "no Organschaft"). |
| `internal_reference` | string | MAY | final_shortlist | Seller's internal project code. |

### 6.1 Capacity Fields by Technology

Capacity is expressed differently across technologies, reflecting industry practice:

- **`solar_pv`:** MUST provide `total_capacity_mw_ac` and `total_capacity_mw_dc`, and SHOULD provide `dc_ac_ratio`. The flat `total_capacity_mw` MAY be omitted, since only PV has a routine, value-relevant AC/DC distinction.
- **`onshore_wind`, `offshore_wind`, `hydro`, `biomass`, `geothermal`, `csp`:** MUST provide `total_capacity_mw` (AC).
- **`bess`:** MUST provide `total_capacity_mw` (power rating) and `total_energy_mwh` (energy capacity).
- **`hybrid`:** MUST provide `total_capacity_mw`; component capacities are described per-unit in Section 7.

### 6.2 Example

```yaml
identity:
  asset_name: "Project Helios"        # [P]
  asset_type: solar_pv                # [P]
  lifecycle_stage: operating          # [P]
  country: ES                         # [P]
  region: "Castilla-La Mancha"        # [P]
  sub_region: "Albacete Province"     # [P]
  coordinates: [-3.4521, 39.8842]     # [N]
  site_area_hectares: 142             # [P]
  total_capacity_mw_ac: 87.5          # [P]
  total_capacity_mw_dc: 105.0         # [P]
  dc_ac_ratio: 1.20                   # [P]
  transaction_type: full_acquisition  # [P]
  equity_offered_pct: 100             # [P]
  seller_legal_entity: "Helios Iberica Holdings S.L."  # [N]
  seller_jurisdiction: "Spain"        # [N]
  spv_structure: true                 # [N]
  spv_jurisdiction: "Spain"           # [N]
  internal_reference: "WEI-IB-2026-014"  # [F]
```

---

## 7. Section: technical

The `technical` section describes the physical configuration and expected performance. It opens with fields common to all technologies (7.1), followed by technology-specific subsections (7.2–7.4) and the shared `production_estimates` object (7.5).

### 7.1 Common Fields

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `commissioning_date` | date (ISO 8601) | MUST if operating | public | Date of Commercial Operation (COD). |
| `expected_lifetime_years` | integer | SHOULD | public | Design life. |
| `design_basis_year` | integer | SHOULD | public | Year the design / yield-assessment basis was established. |
| `repowering_potential` | boolean | MAY | public | Whether the site is a repowering candidate. |
| `repowering_eligible_from` | date | MAY | public | Earliest date repowering is contractually or legally available. |
| `units` | array of objects | MUST | nda_required | Generating units (inverter blocks, turbine clusters, BESS racks). Entry structure is technology-specific; wind entries reference a `turbine_model_ref` matching a `turbine_configurations[].id`. |
| `production_estimates` | object | MUST | mixed | See Section 7.5. |
| `degradation_curve` | object | SHOULD | nda_required | Annual % degradation, optionally piecewise (`year_1_pct`, `year_2_to_25_pct_yr`, etc.). |
| `losses_breakdown` | object | SHOULD | nda_required | Itemized energy losses. `total_pct` is the sum of the line items. |

### 7.2 Solar PV Fields

REQUIRED when `asset_type` is `solar_pv` (and for the PV component of a `hybrid` asset).

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `module` | object | MUST | nda_required | Module manufacturer, model, technology, bifaciality, nominal power, unit count, product/performance warranties. |
| `inverter` | object | MUST | nda_required | Inverter manufacturer, model, `nominal_power_kw`, `units_total`, warranty. |
| `mounting` | object | SHOULD | public | `type` (one of `fixed_tilt`, `single_axis_tracker`, `dual_axis_tracker`), manufacturer, model, `tilt_range_deg`. |
| `performance_ratio` | number | SHOULD | nda_required | Decimal between 0 and 1. |
| `specific_yield_kwh_kwp` | number | SHOULD | nda_required | Annual specific yield per kWp. |

### 7.3 Wind Fields

REQUIRED when `asset_type` is `onshore_wind` or `offshore_wind`.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `turbine_configurations` | array of objects | MUST | nda_required | One entry per turbine model on site: `id`, manufacturer, model, `nominal_power_mw`, `rotor_diameter_m`, `hub_height_m`, `total_height_m`, `iec_class`, cut-in/cut-out speeds, `units_total`, `warranty_remaining_years`. |
| `wind_resource` | object | SHOULD | nda_required | Long-term wind regime: methodology, mean wind speed at hub height, Weibull `a`/`k`, measurement period, reanalysis correlation. |
| `capacity_factor` | number | SHOULD | nda_required | Decimal between 0 and 1. |
| `full_load_hours_yr` | integer | SHOULD | nda_required | Equivalent full-load hours per year. |
| `net_specific_yield_kwh_kw` | number | MAY | nda_required | Net annual yield per kW installed. |
| `noise_emission` | object | SHOULD | nda_required | Night-mode requirement, capacity reduction, affected turbines, compliance basis. |
| `shadow_flicker` | object | SHOULD | nda_required | Shutdown system, annual limit, actual measured minutes. |

### 7.4 BESS Fields

REQUIRED when `asset_type` is `bess`.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `bess_chemistry` | enum | MUST | public | One of: `lfp`, `nmc`, `lto`, `flow_vanadium`, `other`. |

An expanded BESS subschema and a dedicated BESS reference example are deferred; see Section 15.

### 7.5 Production Estimates

| Field | Type | Tier | Description |
|---|---|---|---|
| `methodology` | string | public | Tool and assessment type, e.g. "PVsyst v7.4, third-party yield assessment". |
| `assessor` | string | nda_required | Assessing firm, e.g. "DNV", "TÜV NORD". |
| `assessment_date` | date | nda_required | Date of the yield assessment. |
| `p50_gwh_yr` / `p75_gwh_yr` / `p90_gwh_yr` | number | nda_required | Exceedance-probability annual production. |
| `p99_gwh_yr` | number | nda_required | P99 annual production (MAY). |
| `uncertainty_pct` | number | nda_required | Total uncertainty of the assessment (MAY). |
| `reference_year` / `reference_period` | integer / string | nda_required | Reference year or period for the estimate. |
| `confidence_interval` | string | nda_required | Exceedance basis, e.g. "10-year exceedance" (MAY). |

```yaml
production_estimates:
  methodology: "PVsyst v7.4, third-party yield assessment"  # [P]
  assessor: "DNV"                                           # [N]
  assessment_date: "2022-04-18"                             # [N]
  p50_gwh_yr: 167.2                                         # [N]
  p75_gwh_yr: 161.8                                         # [N]
  p90_gwh_yr: 155.4                                         # [N]
  reference_year: 2025                                      # [N]
```

The `methodology` field is `public` so buyer agents can filter by assessment quality without seeing the numbers. The numbers themselves are `nda_required`.

---

## 8. Section: grid_offtake

The `grid_offtake` section describes how the asset connects to the grid and how its output is monetized.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `grid_connection` | object | MUST | mixed | See 8.1. |
| `offtake_structure` | enum | MUST | public | One of: `feed_in_tariff`, `cfd`, `corporate_ppa`, `utility_ppa`, `merchant`, `hybrid`. |
| `offtake_contracts` | array of objects | MUST if not pure merchant | mixed | See 8.2. |
| `curtailment_history` | object | SHOULD if operating | nda_required | `methodology` plus an `annual` array of per-year curtailment percentages and compensation status. |
| `balancing_responsibility` | enum | SHOULD | nda_required | One of: `self`, `aggregator`, `offtaker`, `direktvermarkter`. |
| `balancing_fee_eur_mwh` | number | MAY | final_shortlist | Balancing cost per MWh. |
| `green_certificates` | object | MAY | nda_required | Guarantee-of-Origin / HKN / REGO / I-REC scheme, annual volume, monetization. |

### 8.1 Grid Connection

| Field | Type | Tier | Description |
|---|---|---|---|
| `connection_point` | string | nda_required | Substation or connection-point name. |
| `voltage_level_kv` | number | public | Connection voltage level. |
| `connection_capacity_mw` | number | public | Contracted connection capacity. |
| `grid_operator` | string | public | DSO/TSO operating the connection. |
| `line_length_km` | number | nda_required | Length of dedicated connection line. |
| `line_ownership` | string | nda_required | Ownership of the connection line (`asset`, `shared (cable pooling)`, etc.). |
| `pooling_partners_count` | integer | nda_required | Number of cable-pooling partners, if shared (MAY). |
| `connection_agreement_date` | date | nda_required | Date of the grid connection agreement. |
| `connection_agreement_term_years` | integer | nda_required | Term of the connection agreement (MAY). |
| `grid_code_compliance` | string | nda_required | Applicable grid code, e.g. "VDE-AR-N 4120", "ENTSO-E NC RfG". |
| `redispatch_2_0_obligation` | boolean | nda_required | DE-specific: subject to Redispatch 2.0 (MAY). |

```yaml
grid_connection:
  connection_point: "Substation Albacete-Sur"            # [N]
  voltage_level_kv: 132                                  # [P]
  connection_capacity_mw: 90                             # [P]
  grid_operator: "Red Eléctrica de España (REE)"         # [P]
  line_length_km: 4.2                                    # [N]
  line_ownership: "asset"                                # [N]
  connection_agreement_date: "2022-03-15"                # [N]
```

### 8.2 Offtake Contracts

Each entry of `offtake_contracts` describes one revenue contract. An asset MAY carry several (e.g. a subsidy contract plus a corporate PPA layered on top). Contracted `capacity_mw` MAY exceed nameplate capacity where a financial contract is a notional overlay rather than a physical allocation — such cases SHOULD be explained in `notes`.

| Field | Type | Tier | Description |
|---|---|---|---|
| `contract_id` | string | public | Stable identifier for the contract within the document. |
| `counterparty` | string | public | Counterparty, anonymized if required (e.g. "Investment-grade European utility"). |
| `counterparty_actual` | string | final_shortlist | Real counterparty name, where `counterparty` is anonymized. |
| `counterparty_credit_rating` | string | public | Credit rating of the counterparty. |
| `counterparty_rating_agency` | string | nda_required | Rating agency (MAY). |
| `contract_type` | enum | public | One of: `feed_in_tariff`, `cfd`, `corporate_ppa`, `utility_ppa`, `gleitende_marktpraemie`, `merchant`. |
| `structure_type` | enum | public | One of: `pay_as_produced`, `baseload`, `as_produced_with_baseload_floor`. |
| `delivery_form` | enum | public | One of: `physical`, `financial`. |
| `capacity_mw` | number | public | Contracted capacity (notional for financial overlays; see note above). |
| `volume_mwh_yr` | number | nda_required | Contracted or expected annual volume. |
| `price_eur_mwh` | number | final_shortlist | Contract price. For subsidy contracts (`cfd`), the price MAY be `nda_required`. |
| `price_floor_eur_mwh` / `price_cap_eur_mwh` | number | final_shortlist | Collar bounds, if any. |
| `anzulegender_wert_eur_mwh` | number | nda_required | DE-specific: EEG anzulegender Wert for `gleitende_marktpraemie` contracts. |
| `indexation` | string | final_shortlist | Indexation mechanism. |
| `start_date` / `end_date` | date | nda_required | Contract term. |
| `remaining_years` | number | nda_required | Years remaining as of `generated_at`. |
| `change_of_control_clause` | boolean | nda_required | Whether the contract has a change-of-control clause. |
| `change_of_control_consent_required` | boolean | nda_required | Whether counterparty consent is required on a change of control. |
| `notes` | string | nda_required | Free-text clarification (MAY). |

```yaml
offtake_contracts:
  - contract_id: "PPA-01"
    counterparty: "Investment-grade European utility"  # [P]
    counterparty_actual: "Iberdrola Clientes S.A.U."   # [F]
    counterparty_credit_rating: "BBB+"                 # [P]
    contract_type: corporate_ppa                       # [P]
    structure_type: pay_as_produced                    # [P]
    delivery_form: physical                            # [P]
    capacity_mw: 50                                    # [P]
    price_eur_mwh: 42.50                               # [F]
    start_date: "2024-01-01"                           # [N]
    end_date: "2033-12-31"                             # [N]
    remaining_years: 7.6                               # [N]
```

---

## 9. Section: financials

The `financials` section is the most sensitive. By default, all fields except `reporting_currency` and aggregate-level CAPEX/OPEX ranges are `nda_required` or `final_shortlist`.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `reporting_currency` | string (ISO 4217) | MUST | public | Currency of all monetary fields in this section. |
| `reporting_basis` | string | SHOULD | nda_required | Accounting standard (`IFRS`, `HGB`, etc.). |
| `fiscal_year_end` | string (`MM-DD`) | SHOULD | nda_required | Fiscal year end. |
| `capex` | object | MUST | nda_required | See 9.1. |
| `opex_breakdown` | object | MUST | nda_required | See 9.2. |
| `revenue_history` | array of objects | MUST if operating | nda_required | Annual revenue, with breakdown by revenue stream; ≥3 years if available. |
| `ebitda_history` | array of objects | MUST if operating | nda_required | Annual EBITDA and margin, same granularity as revenue. |
| `debt_structure` | object | MUST if leveraged | nda_required | See 9.3. |
| `subsidy_remaining` | object | MUST if subsidized | nda_required | See 9.4. |
| `tax_position` | object | SHOULD | nda_required | NOL carryforward, depreciation status, jurisdiction-specific tax fields. |
| `asking_price` | object | MAY | final_shortlist | Indicated price range and multiples. Sellers SHOULD prefer process-based pricing; see 9.5. |
| `valuation_reference` | object | MAY | nda_required | Independent valuation summary. |

### 9.1 CAPEX

The `capex` object carries `total_eur`, a per-MW figure (`per_mw_eur`, or `per_mw_ac_eur` for PV), a `breakdown` object, and settlement metadata (`realized_vs_budget_pct`, `cost_overrun_drivers`, `final_account_settled`). The per-MW figure MAY be exposed as a rounded range in the Teaser tier.

```yaml
capex:
  total_eur: 58_300_000
  per_mw_ac_eur: 666_000
  breakdown:
    modules_eur: 18_200_000
    inverters_eur: 4_100_000
    mounting_eur: 8_900_000
    bos_eur: 6_300_000
    civil_works_eur: 5_800_000
    grid_connection_eur: 7_200_000
    development_permits_eur: 2_400_000
    epc_margin_eur: 3_900_000
    financing_costs_eur: 1_500_000
  realized_vs_budget_pct: 102.4
  final_account_settled: true
```

### 9.2 OPEX Breakdown (canonical taxonomy)

```yaml
opex_breakdown:
  currency: EUR
  basis_year: 2025
  per_mw_per_year:
    om_service: 8500       # O&M service contract
    land_lease: 3200       # Land lease, ground rent
    insurance: 1800
    asset_management: 1200
    direct_marketing: 900  # Direktvermarktung fee
    grid_charges: 2100
    monitoring_scada: 400
    administrative: 700
    other: 500
  total_per_mw_yr: 19300
  total_annual_eur: 1_688_750
  inflation_assumption_pct: 2.0
```

Implementations MAY add fields to the canonical taxonomy (e.g. a jurisdiction-specific `gewerbesteuer_reserve`) but MUST NOT remove or rename the canonical keys. `total_per_mw_yr` is the sum of the `per_mw_per_year` line items; `total_annual_eur` is `total_per_mw_yr` multiplied by total capacity.

### 9.3 Debt Structure

The `debt_structure` object nests a `senior_debt` object, an optional `mezzanine` object, and refinancing metadata. The `senior_debt` object carries `outstanding_eur`, `original_principal_eur`, `lender`, `margin_bps`, `reference_rate`, `hedging`, `maturity`, `amortization`, `dscr_p50`, `dscr_p90`, `cash_sweep`, `lock_up_dscr`, and change-of-control fields.

```yaml
debt_structure:
  senior_debt:
    outstanding_eur: 42_800_000
    original_principal_eur: 49_500_000
    lender: "Anonymized Spanish bank syndicate"
    margin_bps: 180
    reference_rate: "EURIBOR 6M"
    maturity: "2032-06-30"
    dscr_p50: 1.35
    dscr_p90: 1.18
    change_of_control_clause: true
  mezzanine:
    outstanding_eur: 0
  refinancing_options_open: true
  refinancing_window: "2027-2028"
```

### 9.4 Subsidy Remaining

A subsidy contract carries `guaranteed_price_eur_mwh` (or, for German EEG assets, `anzulegender_wert_eur_mwh`), award metadata, and remaining term/volume. `remaining_volume_mwh: null` means the support is time-bound only, not volume-bound.

```yaml
subsidy_remaining:
  scheme: "REER Spain Auction Round 2"
  award_date: "2021-10-15"
  guaranteed_price_eur_mwh: 28.40
  remaining_years: 6.4
  remaining_volume_mwh: null
  indexation: "none (fixed nominal)"
```

### 9.5 Asking Price

`asking_price` is an object, not a single number. It carries an indicated range (`indicated_range_eur_low` / `indicated_range_eur_high`), a `basis` (e.g. "enterprise value, cash-free debt-free"), a `valuation_date`, and an optional `multiples_indication` object.

```yaml
asking_price:
  indicated_range_eur_low: 78_000_000
  indicated_range_eur_high: 92_000_000
  basis: "enterprise value, cash-free debt-free"
  valuation_date: "2026-04-01"
```

---

## 10. Section: compliance

The `compliance` section addresses permits, regulatory standing, ESG, and known liabilities.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `permits` | array of objects | MUST | nda_required | See 10.1. |
| `land_rights` | object | MUST | nda_required | Ownership or lease structure; see 10.3. |
| `environmental_assessments` | array of objects | MUST if applicable | nda_required | EIA/UVP, Natura 2000, avian and bat studies. |
| `eu_taxonomy_alignment` | object | SHOULD | public | See 10.2. |
| `litigation_disputes` | array of objects | MUST | nda_required | Open, threatened, or settled proceedings. An empty array `[]` asserts none. |
| `insurance_coverage` | object | SHOULD | nda_required | Coverage limits, deductibles, insurer, per coverage line. |
| `decommissioning_obligation` | object | MUST | nda_required | Regulatory basis, estimated cost, bond/guarantee details. |
| `esg` | object | SHOULD | public | See 10.4. |

Jurisdiction-specific status flags MAY appear at the top level of `compliance` (e.g. `bnk_system_status` for German aviation-marking compliance). Such fields default to `nda_required` unless individually tagged.

### 10.1 Permits

Each permit entry carries `permit_type`, `issuing_authority`, an optional `reference`, `issue_date`, `valid_until` (`null` if open-ended), optional `conditions`, and `status`. The `permit_type` vocabulary is open and MAY use jurisdiction-native values (e.g. `construction_permit`, `bimschg_genehmigung`, `naturschutzrechtliche_ausnahmegenehmigung`).

```yaml
permits:
  - permit_type: "construction_permit"
    issuing_authority: "Junta de Castilla-La Mancha"
    reference: "EXP-2022-CLM-PV-0142"
    issue_date: "2022-08-12"
    valid_until: "2052-08-12"
    conditions: "Biannual avian monitoring; soil management plan"
    status: active
  - permit_type: "grid_connection_authorization"
    issuing_authority: "Red Eléctrica de España"
    issue_date: "2022-03-15"
    valid_until: null
    status: active
```

### 10.2 EU Taxonomy Alignment

The `eu_taxonomy_alignment` object is `public` so SFDR Article 8/9 buyer agents can screen for eligibility pre-NDA. In addition to the headline alignment percentages, the six Do No Significant Harm criteria MAY be reported individually (`dnsh_climate_adaptation`, `dnsh_water`, `dnsh_circular_economy`, `dnsh_pollution`, `dnsh_biodiversity`), each as `passed`, `passed_with_conditions`, or `failed`, with optional `*_notes`.

```yaml
eu_taxonomy_alignment:
  applicable_activity: "4.1 Electricity generation using solar photovoltaic technology"
  substantial_contribution: climate_change_mitigation
  dnsh_assessment_complete: true
  dnsh_assessment_date: "2024-06-30"
  dnsh_climate_adaptation: passed
  dnsh_water: passed
  dnsh_circular_economy: passed
  dnsh_pollution: passed
  dnsh_biodiversity: passed
  minimum_safeguards_complete: true
  taxonomy_aligned_capex_pct: 100
  taxonomy_aligned_opex_pct: 100
  taxonomy_aligned_turnover_pct: 100
```

### 10.3 Land Rights

The `land_rights` object carries the tenure `structure` (`long_term_lease`, `freehold`, etc.), consolidation note, landowner count and type mix, lease duration and remaining years, annual lease cost, lease structure (fixed and/or revenue-share), indexation, early-termination rights, decommissioning obligation, and any change-of-control consent requirement.

### 10.4 ESG

The `esg` object is `public`. It carries operational and avoided emissions (`scope_1_2_emissions_tco2e_yr`, `avoided_emissions_tco2e_yr` with `avoided_emissions_methodology`), biodiversity measures, and any community-benefit scheme.

---

## 11. Section: operating_history

REQUIRED for assets in lifecycle stages `operating`, `commissioning`, or `repowering_candidate`. OPTIONAL otherwise.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `monthly_production` | object | MUST | nda_required | See 11.1. |
| `availability_history` | array of objects | MUST | nda_required | Per-year availability %, with planned/unplanned outage hours. |
| `major_events` | array of objects | MUST | nda_required | Unplanned outages, major repairs, warranty claims, grid events. |
| `service_contract` | object | SHOULD | nda_required | O&M / OEM service agreement details. See 11.2. |
| `warranty_status` | object | SHOULD | nda_required | Equipment warranties remaining, including serial-defect extensions. |
| `scada_access` | enum | MAY | public | One of: `none`, `read_only_pre_closing`, `read_only_post_closing`, `full_post_closing`. |
| `scada_provider` | string | MAY | nda_required | SCADA platform(s) in use. |

### 11.1 Monthly Production

`monthly_production` is an object combining an `inline_summary` (a per-year array of aggregate figures, suitable for buyer-agent screening once NDA tier is granted) with a pointer to the granular dataset (`detailed_url`, `detailed_access`, `detailed_schema`). The full monthly/turbine-level series MUST NOT be inlined where it would push the document past the 512 KB limit (Section 4.1).

```yaml
monthly_production:
  inline_summary:
    - year: 2024
      gross_mwh: 163_800
      net_mwh: 161_200
      availability_pct: 97.9
    - year: 2025
      gross_mwh: 167_400
      net_mwh: 164_900
      availability_pct: 98.1
  detailed_url: "https://dataroom.example.com/helios/production-2023-2025.csv"
  detailed_access: nda_required
  detailed_schema: ["month", "gross_mwh", "net_mwh", "availability_pct", "irradiance_kwh_m2"]
```

### 11.2 Service Contract

`service_contract` accommodates two shapes: a single-provider object, or — where O&M is split between manufacturers (common for multi-turbine wind farms) — an object with a `structure` note and a `contracts` array, one entry per provider. Each contract carries `provider`, `scope`, `type`, term dates, remaining years, annual fee, indexation, SLA terms, and any change-of-control clause.

---

## 12. Section: process

The `process` section is partially public and is what buyer agents read first to determine whether to request the Full Profile.

| Field | Type | Required | Tier | Description |
|---|---|---|---|---|
| `process_type` | enum | MUST | public | One of: `bilateral`, `limited_auction`, `broad_auction`, `open_market`. |
| `invited_bidders_count` | integer | MAY | public | Number of bidders invited (meaningful for `limited_auction`). |
| `process_lead` | object | MUST | public | See 12.1. |
| `process_timeline` | object | MUST | public | Key dates. See 12.2. |
| `closing_conditions` | object | SHOULD | nda_required | Regulatory approvals and consents required to close. See 12.3. |
| `data_room` | object | MUST | nda_required | Data-room provider, URL, and access mechanism. See 12.4. |
| `nda_template` | URL | SHOULD | public | URL to downloadable NDA template. |
| `access_endpoint` | URL | SHOULD | public | RALS-compliant authentication endpoint (see 12.5). |
| `confidentiality_note` | string | SHOULD | public | Free-text note on confidentiality requirements. |

### 12.1 Process Lead

```yaml
process_lead:
  organization: "Anonymized M&A Advisory"
  contact_role: "M&A Director"
  contact_email: "deals@advisor.example.com"
  contact_phone: null  # public, but optional
```

### 12.2 Process Timeline

`process_timeline` carries the key process dates. Beyond the core milestones, it MAY include `site_visits` and a `long_stop_date`. Dates are ISO 8601; range values MAY be expressed as free-text (e.g. `"2026-08-01 to 2026-08-31"`, `"2027-Q1"`).

```yaml
process_timeline:
  teaser_distribution: "2026-04-15"
  information_memorandum_distribution: "2026-05-20"
  site_visits: "2026-06-15 to 2026-06-30"
  non_binding_offers_due: "2026-07-15"
  management_presentations: "2026-08-01 to 2026-08-31"
  binding_offers_due: "2026-10-15"
  signing_target: "2026-12-15"
  closing_target: "2027-Q1"
  long_stop_date: "2027-06-30"
```

### 12.3 Closing Conditions

`closing_conditions` describes what must happen between signing and closing: `regulatory_approvals_required` (e.g. merger control, FDI screening), `consents_required` (lender and offtaker change-of-control consents), `landowner_consents_required`, and `estimated_signing_to_closing_months`.

### 12.4 Data Room

The `data_room` object carries `provider`, `url`, `access_mechanism`, an approximate `document_count_approx`, a `structure` note, and a `vendor_dd_reports` list. The data room itself remains operated by the seller's chosen provider; RALS only indexes it (Design Principle P3).

### 12.5 Access Endpoint

For programmatic access to the Full Profile, RALS defines an OAuth 2.0–compatible flow:

```
POST https://seller.example.com/.well-known/rals/auth

Request:
{
  "asset_id": "rals:01H8XY...PVN9",
  "buyer_legal_entity": "Acme Infrastructure Fund III L.P.",
  "buyer_aml_status": "verified",
  "nda_signed_at": "2026-05-18T14:22:00Z",
  "nda_document_hash": "sha256:abc123..."
}

Response:
{
  "access_token": "eyJhbGc...",
  "expires_in": 2592000,
  "scope": "rals.full"
}
```

The access token is then presented as a Bearer token when fetching the Full Profile URL.

This authentication flow is OPTIONAL in v0.1. Sellers MAY continue using their existing data room provider's authentication. The endpoint is defined here to enable future agent-to-agent automation.

---

## 13. Validation

A conforming RALS document MUST pass validation against the JSON Schema published at `https://rals.org/schema/v0.1/rals.schema.json`.

Conformance levels:

- **Level 1 — Teaser:** `identity` complete, plus `public`-tagged fields of `technical`, `grid_offtake`, and `process`.
- **Level 2 — Standard:** Levels 1 plus all `nda_required` fields.
- **Level 3 — Complete:** All fields including `final_shortlist` tier.

A document declaring `rals_version: "0.1"` MUST achieve at least Level 1.

---

## 14. Security Considerations

### 14.1 Data Sensitivity

RALS documents at Level 2 or 3 contain commercially sensitive information. Sellers MUST NOT host Full Profiles at publicly accessible URLs without authentication. The well-known URI serves the **Teaser Profile only**. Full Profiles MUST be behind the access endpoint described in Section 12.5 or equivalent.

### 14.2 Integrity

Full Profile documents SHOULD be signed using JWS (JSON Web Signature) so buyers can verify the document has not been tampered with after retrieval. No signing mechanism is specified in v0.1. RFC-0002 defers the signing mechanism to v0.3, on the basis that the security model needs further design and broader implementer feedback before it is specified.

### 14.3 Agent Authentication

Buyer agents accessing Full Profiles MUST authenticate on behalf of an identified legal entity. Pseudonymous or anonymous agents MUST be refused access to Level 2+ data.

### 14.4 Audit

Sellers SHOULD log all access requests, including agent identity, requesting IP, and timestamp, for a minimum of 24 months post-transaction. This protects both parties in the event of post-closing disputes about information disclosed pre-signing.

---

## 15. Roadmap and Open Issues

The roadmap beyond v0.1 is maintained in **RFC-0002** (*RALS v0.2 Roadmap — Learnings from v0.1 Reference Implementations*), which consolidates structural gaps surfaced by six reference implementations. RFC-0002 supersedes the flat open-issues list that appeared in earlier drafts of this section. The summary below is informative; RFC-0002 is authoritative.

### 15.1 Targeted for v0.2

RFC-0002 identifies eight structural gaps that require schema changes for v0.2:

1. **Stage-specific Section 11.** Replace `operating_history` with a polymorphic section whose schema varies by lifecycle stage (operating history / construction tracker / development tracker / decommissioning status).
2. **Hybrid multi-technology sub-blocks.** Formal per-technology sub-block structure plus an `integration` block for hybrid assets, replacing the bare `hybrid` enum value.
3. **Locational pricing.** A structured `locational_pricing` block in `grid_offtake` for nodal and zonal markets.
4. **Regulated revenue programs.** A `regulated_revenue_programs` array in `grid_offtake`, separate from bilateral `offtake_contracts`, for regulator-administered capacity and support programs.
5. **Connection-process state.** Replace the implicit connection status in `grid_connection` with a structured connection-state object and state history.
6. **Greenfield risk quantification.** Probabilistic milestone fields and a `risk_register`, primarily for development-stage assets.
7. **Multi-currency FX modeling.** Replace the single `reporting_currency` field with a structured `currency_profile`.
8. **Jurisdiction-compliance container.** A canonical `jurisdictions` array under `compliance`, replacing ad-hoc per-jurisdiction blocks.

Repowering optionality is expected to be carried within `technical` as a sub-section in v0.2; a dedicated top-level repowering subschema is not planned.

### 15.2 Deferred to v0.3 or later

- **JWS document signing** (see Section 14.2) — deferred to v0.3 pending further security-model design.
- **Multi-document portfolio aggregation** — how a portfolio RALS references its constituent single-asset files.
- **Q&A protocol** — a structured replacement for email-based seller–buyer diligence Q&A.
- **Comparable transaction references** — optional links to anonymized closed comparables.
- **Comprehensive ESG / CSRD-ESRS-aligned reporting** — `compliance.esg` remains minimal until a v1.x release.

---

## Annex A — Reference Examples

Complete fictional RALS documents are maintained as separate files rather than inlined in this specification, so that the examples and the normative text cannot drift apart:

- **`examples/project-helios-pv-spain.rals.yaml`** — Project Helios, an operating 87.5 MW (AC) / 105 MW (DC) solar PV plant in Castilla-La Mancha, Spain. Level 3 (Complete). Exercises the PV-specific `technical` fields (`module`, `inverter`, `mounting`), a hybrid corporate-PPA + CfD revenue stack, and Spanish REER subsidy mechanics.
- **`examples/project-aeolus-wind-germany.rals.yaml`** — Project Aeolus, an operating 148.5 MW onshore wind farm in Schleswig-Holstein, Germany. Level 3 (Complete). Exercises the wind-specific `technical` fields (`turbine_configurations`, `wind_resource`, `noise_emission`, `shadow_flicker`), the EEG gleitende Marktprämie revenue mechanism, BImSchG/BNatSchG permitting, and repowering optionality.
- **`examples/project-prometheus-bess-uk.rals.yaml`** — Project Prometheus, a ready-to-build 100 MW / 200 MWh battery storage asset in Great Britain. Level 3 (Complete). Exercises pre-operational lifecycle handling, the UK Capacity Market, and stacked merchant revenue streams.
- **`examples/project-mekong-hydro-vietnam.rals.yaml`** — Project Mekong, an operating run-of-river hydro asset in Vietnam. Level 3 (Complete). Exercises an emerging-market jurisdiction, multi-currency (USD/VND) exposure, and Vietnamese DPPA mechanics.
- **`examples/project-atacama-hybrid-chile.rals.yaml`** — Project Atacama, an operating PV + wind + BESS triple-hybrid behind a single grid connection in Chile. Level 3 (Complete). Exercises multi-technology configuration, Chilean nodal pricing, and a mining-company offtaker.
- **`examples/project-wisla-greenfield-poland.rals.yaml`** — Project Wisła, a late-stage development PV asset in Poland. Level 3 (Complete). Exercises development-stage milestone tracking, connection-process states, and probabilistic risk fields.

> **Note (v0.1).** The pre-operational examples (Prometheus, Wisła) and the hybrid example (Atacama) use structures that v0.1 does not yet formalize — pre-operational status handling, multi-technology sub-blocks, and nodal pricing. These were the inputs to RFC-0002, which proposes the corresponding v0.2 schema work (see Section 15).

Each example is a fictional asset; all names, financial figures, counterparties, and operational data are invented for illustration. Any resemblance to real assets, transactions, or entities is coincidental.

For documentation purposes, the example files annotate every field with an inline tier marker — `# [P]` (public), `# [N]` (nda_required), `# [F]` (final_shortlist). In production deployments, tier filtering is performed server-side based on the requesting agent's authorization scope; an unfiltered file like these is never served directly to an unauthenticated agent.

---

## Annex B — Compliance-Mapping (Deutschsprachiger Anhang)

Dieser Annex dokumentiert die Verknüpfung von RALS-Feldern mit deutschen, österreichischen und EU-rechtlichen Anforderungen. Er ist informativ, nicht normativ.

### B.1 EU-Taxonomie (VO 2020/852)

Die `compliance.eu_taxonomy_alignment`-Sektion erfasst alle Felder, die institutionelle Investoren nach der EU-Offenlegungsverordnung (SFDR) und der Taxonomie-Verordnung für Reporting-Zwecke benötigen:

- `applicable_activity` entspricht der Aktivitäts-ID aus den delegierten Rechtsakten (z.B. 4.1 für PV, 4.3 für Wind onshore, 4.10 für Energiespeicher).
- `substantial_contribution` benennt das adressierte Umweltziel (typischerweise Klimaschutz für Renewables).
- `dnsh_assessment_complete` dokumentiert den "Do No Significant Harm"-Nachweis.
- `minimum_safeguards_complete` bestätigt die Einhaltung der OECD-Leitsätze und UN-Leitprinzipien für Wirtschaft und Menschenrechte.

### B.2 Deutschland — EEG, BImSchG, BNatSchG

Für Assets in Deutschland sind folgende Pflichtangaben relevant:

- **EEG-Förderung:** Wenn `financials.subsidy_remaining.scheme` auf eine EEG-Vergütung verweist, MÜSSEN das Inbetriebnahmedatum (`technical.commissioning_date`) und der anzulegende Wert in `subsidy_remaining.anzulegender_wert_eur_mwh` korrekt erfasst sein. Für deutsche EEG-Assets wird `anzulegender_wert_eur_mwh` anstelle des generischen `guaranteed_price_eur_mwh` verwendet. Die Förderdauer ergibt sich aus EEG §25.
- **Bundes-Immissionsschutzgesetz (BImSchG):** Genehmigungen für Windkraftanlagen >50m Höhe MÜSSEN in `compliance.permits` mit `permit_type: "bimschg_genehmigung"` erfasst werden.
- **Bundesnaturschutzgesetz (BNatSchG):** Artenschutzrechtliche Ausnahmegenehmigungen (§45 Abs. 7) sind in `compliance.environmental_assessments` zu dokumentieren.

### B.3 Österreich — ElWG, ÖSG, UVP-G

Für Assets in Österreich sind folgende Pflichtangaben relevant:

- **Elektrizitätswirtschafts- und Organisationsgesetz (ElWG):** Anlagengenehmigungen nach Landes-Elektrizitätsrecht in `compliance.permits` mit landesspezifischer `issuing_authority`.
- **Ökostromgesetz (ÖSG) / EAG:** Marktprämien und Investitionsförderungen nach EAG sind in `financials.subsidy_remaining` mit `scheme: "EAG Marktprämie"` bzw. `scheme: "EAG Investitionsförderung"` zu erfassen.
- **UVP-Gesetz:** Umweltverträglichkeitsprüfungs-Bescheide in `compliance.environmental_assessments`.

### B.4 SFDR Article 8/9 Fonds-Eignung

Käufer, die als SFDR Article 8 oder Article 9 Fonds operieren, benötigen die Felder unter `compliance.eu_taxonomy_alignment` vollständig ausgefüllt. RALS-Implementierungen für Verkäufer SOLLEN diese Felder als technisch verpflichtend behandeln, wenn der Käuferkreis institutionelle EU-Investoren umfasst.

---

## Annex C — Implementer Notes

### C.1 For Sellers

The RALS document is not a replacement for your Information Memorandum. It is a structured layer beneath it. Generate the RALS file from the same source data you use for your IM and data room. A well-maintained RALS file reduces buyer Q&A volume by an estimated 30–50% because buyer agents can answer their own questions directly from the structured data.

### C.2 For Advisors

RALS adoption signals process sophistication. Buyers increasingly run preliminary screening through LLM-based agents; assets without structured data require manual extraction, which delays evaluation and disadvantages your client in competitive processes. Consider offering RALS generation as a value-added service in mandate proposals.

### C.3 For Buyer Agents

When fetching an RALS document, MUST honor `confidentiality` tags. Do not include `nda_required` or `final_shortlist` content in summaries or recommendations distributed beyond the authorized buyer team. Audit logging of agent access is RECOMMENDED.

---

## Acknowledgements

This specification was drafted by Manuel Mendel in May 2026, drawing on practical experience operating renewable energy assets across Austria, Hungary, Italy, and North Macedonia, and on community feedback from the renewable energy M&A practitioner network.

The two-tier confidentiality model is informed by industry practice at Drooms, Datasite, and Intralinks. The opinionated OPEX taxonomy reflects common reporting structures used by mid-cap IPPs across European markets.

RALS is not endorsed by any industry association at the time of v0.1 publication. Endorsement conversations are open.

---

## Change Log

- **v0.1 (2026-05-15):** Initial public draft. Seven sections, three-tier confidentiality (`public` / `nda_required` / `final_shortlist`), reference examples "Project Helios" (PV) and "Project Aeolus" (onshore wind).
- **v0.1 (2026-05-15, editorial revision):** Field tables in Sections 6–12 revised to match the structure of the reference example documents — technology-conditional capacity fields (Section 6.1), technology-specific `technical` subsections (7.2–7.4), nested `capex`/`debt_structure` objects, `asking_price` as an object, and new sections for `tax_position`, `esg`, and `closing_conditions`. Corrected internal cross-references to the access endpoint (now Section 12.5). Section 15 reframed as a roadmap referencing RFC-0002 as the authoritative v0.2 plan, and Section 14.2 updated to note that JWS document signing is deferred to v0.3. No change to the tier model or document structure.

---

*End of RALS Specification v0.1*
