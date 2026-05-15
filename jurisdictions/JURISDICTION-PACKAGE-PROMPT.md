# RALS Jurisdiction Package — Creation Prompt Template

**Version:** 1.0  
**Date:** 2026-05-15  
**Purpose:** Reusable prompt/spec for creating new RALS Jurisdiction Packages for additional countries.

---

## How to use this file

Copy the prompt below and adapt the "Target countries" section for new countries.
Keep all other instructions intact — they define the quality bar and structure for all jurisdiction packages.

---

## Prompt

You are working inside the GitHub repository:
https://github.com/mahlerhutter/rals

Goal: Create and integrate RALS Jurisdiction Packages for [COUNTRY LIST].

Context:
RALS means Renewable Asset Listing Standard. It is an open, machine-readable standard for describing renewable energy assets offered for sale, refinancing, or partnership.
The next strategic layer is jurisdiction-aware validation. Renewable asset readiness depends heavily on local rules, permitting pathways, grid connection processes, land rights, support schemes, evidence requirements, and transaction practices.
Create "RALS Jurisdiction Packages" as modular country-specific extensions.

Important:
Do not create generic country reports.
Do not write marketing content.
Create structured, machine-readable jurisdiction packages that can be used by validators, AI agents, advisors, investors, and transaction teams.

Target countries:
- [COUNTRY 1] ([ISO CODE])
- [COUNTRY 2] ([ISO CODE])
- [etc.]

Use this naming:
RALS Jurisdiction Packages

Use this folder structure (one block per country):

```
jurisdictions/
  {country_code}/
    README.md
    profile.yaml
    field-overrides.yaml
    evidence-requirements.yaml
    transaction-readiness.yaml
    risks.yaml
    examples/
      {country}-{tech}-{stage}-{level}.rals.yaml
      {country}-{tech}-{stage}-{level}.rals.yaml
```

Also update:
- jurisdictions/README.md (add new countries to the supported packages table)
- README.md (update the Jurisdiction Packages section)

Research requirement:
Before writing jurisdiction-specific assumptions, research current public information about each market. Use official or credible sources where possible, especially:
- national energy regulators
- TSOs / DSOs
- government energy ministries
- EU sources
- IEA / IRENA / World Bank / EBRD, where useful
- reputable legal or energy market summaries

However:
Do not overfit the package to one legal interpretation.
This is a technical transaction-readiness standard, not legal advice.
Where the legal situation is uncertain, write "jurisdiction_note" and "validation_warning" fields.

Core design principles:
1. Keep RALS base schema general.
2. Jurisdiction packages should define:
   - field interpretation
   - local required evidence
   - readiness thresholds
   - risk taxonomy
   - country-specific validation notes
   - sample RALS listings
3. Packages should be YAML-first and machine-readable.
4. README files should explain the purpose clearly but briefly.
5. The examples must intentionally include different maturity levels, including weak assets.
6. Do not hide weaknesses. If land, grid, permits, support scheme, PPA, environmental or war-risk issues are unresolved, make them explicit.
7. Use consistent naming, keys, and structure across all countries.

Create this general package structure:

profile.yaml:
- jurisdiction_code
- name
- rals_jurisdiction_version
- status
- last_reviewed
- supported_technologies
- common_transaction_types
- common_lifecycle_stages
- primary_authorities
- grid_authorities
- market_design_notes
- key_transaction_risks
- validation_scope
- disclaimer

field-overrides.yaml:
Define jurisdiction-specific interpretation of RALS fields. Include at least:
- identity.country
- identity.location
- technical.technology
- technical.capacity
- technical.lifecycle_stage
- land.land_control_status
- land.land_evidence
- grid_offtake.grid_connection_status
- grid_offtake.grid_capacity
- grid_offtake.connection_evidence
- compliance.permitting_status
- compliance.environmental_status
- revenue.revenue_model
- revenue.support_scheme
- financials.capex_confidence
- financials.opex_confidence
- process.transaction_type
- process.data_room_status
- risks.risk_flags

Each field should include:
- required: true/false
- importance: low/medium/high/critical
- allowed_values, where useful
- jurisdiction_note
- validation_warning, where useful

evidence-requirements.yaml:
Define required evidence by readiness level for:
- site_identification
- land_control
- grid_connection
- permitting
- environmental
- technical_design
- energy_yield
- revenue_model
- support_scheme
- financial_model
- corporate_ownership
- data_room
- insurance
- war_political_risk (for conflict-affected or high-risk markets)

Use readiness levels:
L0: Teaser Only
L1: Screenable
L2: Investment Memo Ready
L3: Lender Diligence Ready
L4: Data Room Ready

transaction-readiness.yaml:
Define local readiness thresholds:
- L0 through L4
Each level should include:
- label
- description
- minimum_requirements
- typical_use
- not_sufficient_for
- validation_notes

risks.yaml:
Create a structured risk taxonomy. Include:
- risk_id
- label
- severity_default
- affected_sections
- buyer_impact
- lender_impact
- mitigation_evidence
- validation_rule
- jurisdiction_note (optional)

At minimum include risks for:
- land_not_secured
- grid_not_secured
- grid_capacity_uncertain
- permitting_not_started
- permitting_under_appeal
- environmental_constraints
- unclear_revenue_route
- merchant_exposure_high
- capex_unvalidated
- yield_unvalidated
- missing_data_room
- counterparty_unclear
- title_or_ownership_unclear
- political_or_regulatory_risk
- curtailment_risk

For conflict-affected or high-risk markets additionally include as appropriate:
- martial_law_risk
- war_damage_risk
- occupation_or_security_risk
- convertibility_transfer_risk
- sovereign_or_counterparty_risk
- grid_damage_or_reconstruction_risk
- war_risk_insurance_missing
- political_expropriation_risk
- currency_inconvertibility_risk

Country-specific focus guidelines (add notes per country here):
[COUNTRY 1]: Emphasize [key market characteristics]
[COUNTRY 2]: Emphasize [key market characteristics]

Examples:
Create realistic fictional example listings using RALS YAML format.
Examples should be plausible but clearly fictional.
Add at the top of each example:
  fictional: true
  source: "synthetic_example"
  confidentiality: "public_example"

Each country needs 2 examples at different readiness levels (e.g. L0+L2, L1+L3).
Examples must demonstrate the validator logic.
Show weaknesses explicitly — unresolved land, grid, permits, revenue, risk flags.

README for each country:
Include:
- package purpose
- supported asset types
- main transaction risks
- readiness interpretation
- example files
- disclaimer

Quality bar:
- YAML must be valid (run yaml.safe_load on all files).
- Use consistent indentation (2 spaces).
- Avoid unnecessary legal claims.
- Use "validation_warning" where uncertain.
- Use machine-readable keys, not prose-only paragraphs.
- Keep examples realistic but synthetic.
- Do not include confidential real project information.
- Do not invent specific laws unless verified.
- If unsure, state uncertainty in the YAML notes.
- Wrap long list items in quotes if they contain colons or span multiple lines.

After implementation:
Run a YAML parse check over all added .yaml files:
  python3 -c "import yaml,os; [yaml.safe_load(open(os.path.join(r,f))) for r,d,files in os.walk('jurisdictions') for f in files if f.endswith('.yaml')]"
Fix syntax errors.
Provide a final summary of files created, files changed, countries added, examples added, and any assumptions or uncertainties.

---

## Country-Specific Context Reference (completed packages)

### Austria (AT) — v0.1 — completed 2026-05-15
Key: EAG support scheme, OeMAG tenders, Netzanschlusszusage → Netzanschlussvertrag, UVP/Baugenehmigung, Wasserrechtsbescheid (hydro), Bundesland permitting variability, grid saturation Burgenland/Lower Austria.

### Italy (IT) — v0.1 — completed 2026-05-15
Key: Autorizzazione Unica (AU), TAR/Consiglio di Stato appeal risk, Terna SdC (Soluzione di Connessione), GSE FER 1/FER 2/FER X, Southern Italy grid queue saturation + moratoria, re-dispatch curtailment 5–20%.

### Romania (RO) — v0.1 — completed 2026-05-15
Key: ANRE Order 20/2025 (5% ATR guarantee), ANRE Order 53/2024 (auction-based grid allocation from 2026), Cartea Funciara (CF) mandatory land registration, arenda ≥25 years, CfD in development (not yet active), readiness gap warning (60+ GW ATR vs bankable capacity).

### Ukraine (UA) — v0.1 — completed 2026-05-15
Key: War/martial law exceptional risk environment, ~50% grid damaged, occupied territory = L0 hard cap, IFI financing (EBRD/EIB/World Bank/MIGA), war-risk insurance required for L3+, green tariff restructured (80% of original), Energorynok sovereign counterparty risk, NBU convertibility restrictions.
