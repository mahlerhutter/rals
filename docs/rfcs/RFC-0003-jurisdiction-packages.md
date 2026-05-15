# RFC-0003: RALS Jurisdiction Packages

**Status:** Draft  
**Date:** 2026-05-15  
**Author:** RALS Editorial Team  
**Repository:** github.com/mahlerhutter/rals  

---

## Summary

This RFC introduces **RALS Jurisdiction Packages** as a modular, machine-readable extension layer for the base RALS standard. Jurisdiction Packages define country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomies for renewable energy asset transactions.

A validator equipped with a Jurisdiction Package can assess not just whether a RALS document is structurally valid, but whether it meets the evidence standards required for a specific readiness level in a specific country.

---

## Motivation

The RALS base schema (`rals.schema.json`) is intentionally country-agnostic. It can represent a solar PV asset in Spain, an offshore wind farm in the UK, or a BESS project in Ukraine using the same structure.

However, what constitutes "ready to build" in Austria is not the same as in Romania. An Austrian RTB asset requires a *rechtskräftige Baugenehmigung* or UVP decision with no pending VwGH appeal, a signed *Netzanschlussvertrag* with the Netzbetreiber, and a notarised 25-year *Bestandsvertrag* for all key parcels. A Romanian asset claiming RTB status requires a valid *Aviz Tehnic de Racordare* backed by a 5% financial guarantee, a final *autorizatie de construire*, and a signed *arenda* with confirmed *Cartea Funciara* registration.

Without jurisdiction-specific interpretation rules, a RALS-aware validator cannot reliably assess readiness level across countries — and AI agents, banks, and advisors relying on RALS-based data make decisions based on incomparable or misleading readiness claims.

The Romanian market alone demonstrates this problem at scale: over 60 GW of projects hold ATRs but only a fraction meet the evidence requirements for bankable transaction-readiness. Without jurisdiction packages, automated validators cannot distinguish between these.

---

## Problem

1. **Field interpretation varies by country.** `grid_connection_status: connection_offer_received` means different things in Austria (where the Netzanschlusszusage is a formal offer), Italy (where the SdC is a binding technical solution), and Romania (where the ATR process has changed fundamentally since January 2026).

2. **Evidence requirements vary by country.** What documents are expected for a "lender-diligence ready" classification differ by jurisdiction, regulatory framework, and market maturity.

3. **Risk taxonomies are country-specific.** Austria has hydro concession renewal risk; Italy has AU appeal risk; Romania has ATR auction queue risk; Ukraine has martial law, war damage, and convertibility risk. These cannot be modelled in a generic schema.

4. **Readiness level thresholds are not universal.** An asset classified as L2 in a stable market may need substantially stronger evidence than in an emerging market where L2 is the norm for early marketing.

5. **Validators and AI agents need explicit rules.** Without machine-readable jurisdiction packages, automated validation logic must either hardcode country rules or operate without them.

---

## Design Goals

1. **Machine-readable first.** All jurisdiction packages are YAML. No prose-only paragraphs in core validation fields.

2. **Modular and extensible.** A new country package can be added without modifying the base schema. Packages are independent of each other.

3. **Consistent structure across countries.** Every package uses the same file names, field names, and readiness level identifiers.

4. **Explicit about uncertainty.** Where regulatory interpretation is uncertain, packages use `jurisdiction_note` and `validation_warning` fields to flag the uncertainty rather than asserting false confidence.

5. **Not legal advice.** Packages define transaction-readiness evidence requirements. They do not constitute legal opinions or regulatory compliance certification.

6. **Backwards-compatible.** RALS documents that do not use jurisdiction packages remain valid under the base schema.

---

## Non-Goals

1. Replacing national legal counsel or regulatory guidance.
2. Providing financial model audit or tax structuring advice.
3. Defining security classifications for conflict zones (beyond flags referencing external assessment).
4. Covering every country in the world in the initial release.
5. Modifying the base RALS JSON Schema.

---

## Package Structure

Each jurisdiction package lives in `jurisdictions/{country_code}/` and consists of:

```
jurisdictions/
  {country_code}/
    README.md                   Human-readable overview
    profile.yaml                Market profile and authorities
    field-overrides.yaml        Field-level interpretation rules
    evidence-requirements.yaml  Required evidence by readiness level
    transaction-readiness.yaml  Readiness level definitions and thresholds
    risks.yaml                  Structured risk taxonomy
    examples/
      {example}.rals.yaml       Synthetic example listings
```

### profile.yaml

Defines the market context:

- `jurisdiction_code` — ISO 3166-1 alpha-2
- `name` — Country name
- `rals_jurisdiction_version` — Package version
- `status` — active, draft, deprecated
- `last_reviewed` — ISO date
- `supported_technologies` — List
- `common_transaction_types` — List
- `primary_authorities` — Energy regulator, ministry, grid TSO/DSO, support scheme administrator
- `grid_authorities` — TSO, DSO list, connection process description
- `market_design_notes` — Support schemes, market structure, key notes
- `key_transaction_risks` — List of primary risk identifiers
- `validation_scope` — What the package covers and does not cover
- `disclaimer` — Legal non-reliance statement

### field-overrides.yaml

For each RALS field, defines:

- `required` — true/false in this jurisdiction
- `importance` — low/medium/high/critical
- `allowed_values` — where jurisdiction-specific allowed values apply
- `jurisdiction_note` — Country-specific interpretation
- `validation_warning` — Machine-readable flag for uncertain interpretation

Fields covered at minimum: `identity.country`, `identity.region`, `identity.lifecycle_stage`, `technical.technology`, `technical.capacity`, `land.land_control_status`, `land.land_evidence`, `grid_offtake.grid_connection_status`, `grid_offtake.grid_capacity`, `grid_offtake.connection_evidence`, `compliance.permitting_status`, `compliance.environmental_status`, `revenue.revenue_model`, `revenue.support_scheme`, `financials.capex_confidence`, `financials.opex_confidence`, `process.transaction_type`, `process.data_room_status`, `risks.risk_flags`.

### evidence-requirements.yaml

For each evidence category and readiness level (L0–L4), defines:

- `required` — true/false
- `description` — What is expected
- `{country}_note` — Country-specific note (e.g. `austria_note`, `ukraine_note`)

Evidence categories: `site_identification`, `land_control`, `grid_connection`, `permitting`, `environmental`, `technical_design`, `energy_yield`, `revenue_model`, `support_scheme`, `financial_model`, `corporate_ownership`, `data_room`, `insurance`, `war_political_risk` (mandatory for Ukraine).

### transaction-readiness.yaml

For each level (L0–L4):

- `label` — Short label
- `description` — What the level means in this jurisdiction
- `minimum_requirements` — List of criteria that must all be met
- `typical_use` — What this level is typically used for
- `not_sufficient_for` — What this level cannot support
- `validation_notes` — Jurisdiction-specific notes on edge cases

### risks.yaml

For each risk:

- `risk_id` — Machine-readable identifier
- `label` — Human-readable short description
- `severity_default` — low/medium/high/critical
- `affected_sections` — RALS sections affected
- `buyer_impact` — Impact on buyer decision
- `lender_impact` — Impact on debt financing
- `mitigation_evidence` — List of documents/facts that mitigate the risk
- `validation_rule` — Machine-readable rule for when to raise this risk
- `jurisdiction_note` — Country-specific context (optional)

---

## Readiness Model

The five readiness levels are consistent across all jurisdiction packages:

| Level | Label | General Meaning |
|-------|-------|-----------------|
| L0 | Teaser Only | Technology, capacity, location. No permit, grid, or land evidence. |
| L1 | Screenable | Site confirmed; key pathways identified; no fatal constraint known. |
| L2 | Investment Memo Ready | Core commercial risks mitigated at concept level; NBO-ready. |
| L3 | Lender Diligence Ready | All major risks documented and mitigated; credit committee ready. |
| L4 | Data Room Ready | EPC contracted; all conditions precedent met; financial close ready. |

Jurisdiction packages define the country-specific evidence that must be present for each level. A validator must apply the **most restrictive** applicable rule — it cannot upgrade a level based on seller claims alone.

### Special Override: Ukraine

The Ukraine package introduces a `war_risk_override` that constrains readiness levels based on security and risk mitigation evidence. No Ukrainian asset can be classified above L2 without documented war-risk insurance or IFI political risk guarantee plus independent security assessment. Assets in occupied territories cannot receive any readiness classification.

---

## Evidence Requirements

Evidence requirements are defined per category per level. The key principle is:

**Evidence is cumulative.** An asset at L3 must meet all L0, L1, L2, and L3 requirements for all categories.

**Evidence must be current.** In jurisdictions with volatile regulatory environments (Romania, Ukraine), evidence that predates major regulatory changes must be re-confirmed. In Ukraine, pre-2022 documents are generally insufficient as the sole basis for any evidence claim.

---

## Risk Taxonomy

Each package defines a structured risk taxonomy. Risks have:

- A machine-readable `risk_id`
- A default severity
- Mitigation evidence requirements
- Explicit validation rules (if/then conditions on RALS fields)

Validators should evaluate all risks in the relevant package against the document being validated. Active risks reduce the maximum assignable readiness level according to the rules in `transaction-readiness.yaml`.

Standard risks (present in all packages): `land_not_secured`, `grid_not_secured`, `grid_capacity_uncertain`, `permitting_not_started`, `permitting_under_appeal`, `environmental_constraints`, `unclear_revenue_route`, `merchant_exposure_high`, `capex_unvalidated`, `yield_unvalidated`, `missing_data_room`, `counterparty_unclear`, `title_or_ownership_unclear`, `political_or_regulatory_risk`, `curtailment_risk`.

Ukraine-specific additional risks: `martial_law_risk`, `war_damage_risk`, `occupation_or_security_risk`, `convertibility_transfer_risk`, `sovereign_or_counterparty_risk`, `grid_damage_or_reconstruction_risk`, `war_risk_insurance_missing`.

---

## Validator Behaviour

A RALS-compliant validator incorporating Jurisdiction Packages should:

1. Load and validate the RALS document against the base schema (`rals.schema.json`).
2. Detect `identity.country` (ISO 3166-1 alpha-2).
3. Look up the matching jurisdiction package in `jurisdictions/{country}/`.
4. Apply field interpretation rules from `field-overrides.yaml`:
   - Check required fields are present
   - Check allowed values where specified
   - Apply jurisdiction-specific interpretation to field values
5. Check evidence requirements from `evidence-requirements.yaml`:
   - For each evidence category, determine what level of evidence is present in the document
   - Compare against the requirements for the claimed readiness level
6. Evaluate all risks from `risks.yaml`:
   - Apply `validation_rule` conditions against document field values
   - Determine which risks are active
   - Apply active risks to determine maximum permissible readiness level
7. Assign or confirm the readiness level from `transaction-readiness.yaml`:
   - Check all `minimum_requirements` for the claimed level are met
   - **Never upgrade the claimed level beyond what evidence supports**
8. Output a structured validation report:
   - Confirmed readiness level
   - Missing evidence by category
   - Active risk flags with severity
   - Validation warnings from field overrides
   - Jurisdiction-specific notes

### Key Principle: No Level Inflation

A validator applying a jurisdiction package MUST NOT assign a readiness level higher than what the evidence in the document supports. Seller or advisor claims in prose fields (e.g. `process_timeline`, free-text notes) cannot substitute for documented evidence in the structured fields.

---

## Initial Jurisdictions

The following packages are included in the initial release (v0.1):

| Code | Country | Key Focus |
|------|---------|-----------|
| AT | Austria | Mature market; permitting variability by Bundesland; hydro concessions; grid constraints |
| IT | Italy | AU permitting; grid queue saturation in Southern Italy; GSE transferability; curtailment |
| RO | Romania | ATR auction system (2026); readiness inflation; CF land title; CfD development |
| UA | Ukraine | War risk; grid damage; martial law; IFI dependency; occupied territory exclusion |

Future packages may include: Germany (DE), Spain (ES), Poland (PL), Greece (GR), Chile (CL), Vietnam (VN), South Africa (ZA), Georgia (GE), Namibia (NA).

---

## Versioning

Each jurisdiction package declares `rals_jurisdiction_version` independently of the RALS base version. Packages are versioned using semantic versioning (major.minor):

- **Major version bump**: breaking change to package structure or field names
- **Minor version bump**: addition of new fields, risks, or evidence categories; non-breaking updates to notes or regulatory descriptions

RALS documents that include a `rals_jurisdiction` block should declare the package version used for their assessment:

```yaml
rals_jurisdiction:
  jurisdiction_package: AT
  rals_jurisdiction_version: "0.1"
  assessed_readiness_level: L2
  jurisdiction_assessment_date: "2026-05-15"
```

---

## Open Questions

1. **Multi-jurisdiction assets**: How should a validator handle portfolio assets spanning multiple countries? Proposal: evaluate each country separately; apply the most conservative risk outcome.

2. **Jurisdiction package updates**: When a package is updated (e.g. due to regulatory change), should existing RALS documents be re-validated? Proposal: version pinning in the `rals_jurisdiction` block; re-validation optional but recommended annually.

3. **Sub-national packages**: Some jurisdictions have material sub-national variation (e.g. Italian Regione-level permitting). Should sub-national packages be introduced? Proposal: handle via `jurisdiction_note` and `validation_warning` fields in national package initially; introduce sub-national packages if the variation is too large to manage in notes.

4. **Occupied territory classification**: The Ukraine package excludes occupied territories from classification. How should this be maintained as the conflict evolves and territorial control changes? Proposal: the package's `last_reviewed` date is critical; validators should reject Ukraine package assessments older than 6 months without re-review.

5. **Machine-readable validation rules**: The `validation_rule` fields in `risks.yaml` are currently prose descriptions. A future RFC should formalise these as a structured rule language (e.g. JSON Logic or a simple RALS Rule Language) to enable fully automated validator implementation.

6. **IFI-specific readiness tracks**: Should there be a separate IFI readiness track for markets like Ukraine where IFI financing is the only viable route? Proposal: model as a `readiness_track` modifier in future version rather than a separate level.

---

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 0.1 | 2026-05-15 | Initial RFC and package structure; AT, IT, RO, UA packages |
