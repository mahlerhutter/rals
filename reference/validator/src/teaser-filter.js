/**
 * RALS reference tier filter.
 *
 * Projects a full RALS document down to a lower confidentiality tier by
 * keeping only the fields the specification tags at or below that tier
 * (SPEC sections 6-12, tier model in SPEC 4.3). Every field not on the
 * relevant allowlist is dropped, per SPEC 4.3 ("the default for any field
 * not explicitly tagged is nda_required").
 *
 * PUBLIC_FIELDS / filterToTeaser — the public Teaser Profile (SPEC 13
 * Level 1). This is the single source of truth for tier filtering: the web
 * server uses it to publish listings, and the tier-leak CI check uses it to
 * verify no confidential field reaches a Teaser.
 *
 * STANDARD_FIELDS / filterToStandard — public + nda_required, dropping only
 * final_shortlist (SPEC 13 Level 2 "Standard"). Used by the reference
 * validator's --level=2 conformance check.
 *
 * GENERATED FILE — do not hand-edit. Regenerate with
 * `node scripts/generate-teaser-filter.mjs` in the rals repo after
 * changing any x-rals-tier annotation in schema/rals.schema.json — it writes
 * both reference/validator/src/teaser-filter.js (this repo) and
 * ../web/lib/teaser-filter.js (the sibling web repo vendors a copy).
 *
 * Allowlist grammar:
 *   true   — keep this key and its whole subtree
 *   object — recurse: keep only the listed sub-keys (arrays apply it per item)
 */

export const PUBLIC_FIELDS = {
  rals_version: true,
  document_id: true,
  generated_at: true,
  generated_by: true,
  language: true,
  identity: {
    asset_name: true,
    asset_type: true,
    lifecycle_stage: true,
    country: true,
    region: true,
    sub_region: true,
    site_area_hectares: true,
    site_configuration: true,
    total_capacity_mw: true,
    total_capacity_mw_ac: true,
    total_capacity_mw_dc: true,
    dc_ac_ratio: true,
    total_energy_mwh: true,
    number_of_turbines: true,
    transaction_type: true,
    equity_offered_pct: true,
  },
  technical: {
    commissioning_date: true,
    expected_lifetime_years: true,
    design_basis_year: true,
    repowering_potential: true,
    repowering_eligible_from: true,
    production_estimates: {
      methodology: true,
    },
    mounting: {
      type: true,
      manufacturer: true,
      model: true,
      tilt_range_deg: true,
    },
    bess_chemistry: true,
  },
  grid_offtake: {
    grid_connection: {
      voltage_level_kv: true,
      connection_capacity_mw: true,
      grid_operator: true,
    },
    offtake_structure: true,
    offtake_contracts: {
      contract_id: true,
      counterparty: true,
      counterparty_credit_rating: true,
      contract_type: true,
      structure_type: true,
      delivery_form: true,
      capacity_mw: true,
    },
  },
  financials: {
    reporting_currency: true,
  },
  compliance: {
    eu_taxonomy_alignment: {
      applicable_activity: true,
      substantial_contribution: true,
      dnsh_assessment_complete: true,
      dnsh_assessment_date: true,
      dnsh_climate_adaptation: true,
      dnsh_climate_adaptation_notes: true,
      dnsh_water: true,
      dnsh_water_notes: true,
      dnsh_circular_economy: true,
      dnsh_circular_economy_notes: true,
      dnsh_pollution: true,
      dnsh_pollution_notes: true,
      dnsh_biodiversity: true,
      dnsh_biodiversity_notes: true,
      minimum_safeguards_complete: true,
      taxonomy_aligned_capex_pct: true,
      taxonomy_aligned_opex_pct: true,
      taxonomy_aligned_turnover_pct: true,
    },
    esg: {
      scope_1_2_emissions_tco2e_yr: true,
      avoided_emissions_tco2e_yr: true,
      avoided_emissions_methodology: true,
      biodiversity_net_gain_pct: true,
      community_benefit_scheme: true,
    },
  },
  operating_history: {
    scada_access: true,
  },
  process: {
    process_type: true,
    invited_bidders_count: true,
    process_lead: {
      organization: true,
      contact_role: true,
      contact_email: true,
      contact_phone: true,
      name: true,
      role: true,
    },
    process_timeline: {
      teaser_distribution: true,
      information_memorandum_distribution: true,
      site_visits: true,
      non_binding_offers_due: true,
      management_presentations: true,
      binding_offers_due: true,
      signing_target: true,
      closing_target: true,
      long_stop_date: true,
      nda_deadline: true,
      indicative_bid_deadline: true,
      target_close: true,
    },
    nda_template: true,
    access_endpoint: true,
    confidentiality_note: true,
  },
};

export const STANDARD_FIELDS = {
  rals_version: true,
  document_id: true,
  generated_at: true,
  generated_by: true,
  language: true,
  identity: {
    asset_name: true,
    asset_type: true,
    lifecycle_stage: true,
    country: true,
    region: true,
    sub_region: true,
    coordinates: true,
    site_area_hectares: true,
    site_configuration: true,
    total_capacity_mw: true,
    total_capacity_mw_ac: true,
    total_capacity_mw_dc: true,
    dc_ac_ratio: true,
    total_energy_mwh: true,
    number_of_turbines: true,
    transaction_type: true,
    equity_offered_pct: true,
    seller_legal_entity: true,
    seller_jurisdiction: true,
    spv_structure: true,
    spv_jurisdiction: true,
    spv_form: true,
    spv_tax_grouping: true,
  },
  technical: {
    commissioning_date: true,
    expected_lifetime_years: true,
    design_basis_year: true,
    repowering_potential: true,
    repowering_eligible_from: true,
    units: {
      cluster_id: true,
      turbines: true,
      total_capacity_mw: true,
      turbine_model_ref: true,
    },
    production_estimates: {
      methodology: true,
      assessor: true,
      assessment_date: true,
      p50_gwh_yr: true,
      p75_gwh_yr: true,
      p90_gwh_yr: true,
      p99_gwh_yr: true,
      uncertainty_pct: true,
      reference_year: true,
      reference_period: true,
      confidence_interval: true,
    },
    degradation_curve: {
      methodology: true,
      year_1_pct: true,
      year_2_to_25_pct_yr: true,
      year_26_to_35_pct_yr: true,
    },
    losses_breakdown: {
      soiling_pct: true,
      shading_pct: true,
      mismatch_pct: true,
      dc_cable_pct: true,
      inverter_pct: true,
      ac_cable_pct: true,
      transformer_pct: true,
      availability_pct: true,
      total_pct: true,
    },
    module: {
      manufacturer: true,
      model: true,
      technology: true,
      bifacial: true,
      bifaciality_factor: true,
      nominal_power_w: true,
      units_total: true,
      warranty_product_years: true,
      warranty_performance_years: true,
      warranty_performance_end_pct: true,
    },
    inverter: {
      manufacturer: true,
      model: true,
      nominal_power_kw: true,
      units_total: true,
      warranty_years_remaining: true,
    },
    mounting: {
      type: true,
      manufacturer: true,
      model: true,
      tilt_range_deg: true,
    },
    performance_ratio: true,
    specific_yield_kwh_kwp: true,
    turbine_configurations: {
      id: true,
      manufacturer: true,
      model: true,
      nominal_power_mw: true,
      rotor_diameter_m: true,
      hub_height_m: true,
      total_height_m: true,
      iec_class: true,
      cut_in_speed_ms: true,
      cut_out_speed_ms: true,
      units_total: true,
      warranty_remaining_years: true,
    },
    wind_resource: {
      methodology: true,
      long_term_mean_wind_speed_hub_height_ms: true,
      weibull_a: true,
      weibull_k: true,
      measurement_height_m: true,
      measurement_period_years: true,
      correlated_to_reanalysis: true,
      reanalysis_source: true,
    },
    capacity_factor: true,
    full_load_hours_yr: true,
    net_specific_yield_kwh_kw: true,
    noise_emission: {
      night_mode_required: true,
      night_mode_capacity_reduction_pct: true,
      affected_turbines_count: true,
      noise_compliance_basis: true,
    },
    shadow_flicker: {
      automatic_shutdown_system: true,
      max_annual_minutes_per_dwelling: true,
      actual_2025_minutes: true,
    },
    bess_chemistry: true,
  },
  grid_offtake: {
    grid_connection: {
      connection_point: true,
      voltage_level_kv: true,
      connection_capacity_mw: true,
      grid_operator: true,
      line_length_km: true,
      line_ownership: true,
      pooling_partners_count: true,
      connection_agreement_date: true,
      connection_agreement_term_years: true,
      grid_code_compliance: true,
      redispatch_2_0_obligation: true,
    },
    offtake_structure: true,
    offtake_contracts: {
      contract_id: true,
      counterparty: true,
      counterparty_credit_rating: true,
      counterparty_rating_agency: true,
      contract_type: true,
      structure_type: true,
      delivery_form: true,
      capacity_mw: true,
      volume_mwh_yr: true,
      anzulegender_wert_eur_mwh: true,
      start_date: true,
      end_date: true,
      remaining_years: true,
      change_of_control_clause: true,
      change_of_control_consent_required: true,
      notes: true,
    },
    curtailment_history: {
      methodology: true,
      annual: {
        year: true,
        grid_curtailment_pct: true,
        environmental_curtailment_pct: true,
        compensated_pct: true,
      },
    },
    balancing_responsibility: true,
    green_certificates: {
      scheme: true,
      annual_volume_mwh: true,
      monetization: true,
      remainder_avg_price_eur_mwh: true,
    },
  },
  financials: {
    reporting_currency: true,
    reporting_basis: true,
    fiscal_year_end: true,
    capex: {
      total_eur: true,
      per_mw_eur: true,
      per_mw_ac_eur: true,
      breakdown: {
        modules_eur: true,
        inverters_eur: true,
        mounting_eur: true,
        bos_eur: true,
        civil_works_eur: true,
        grid_connection_eur: true,
        development_permits_eur: true,
        epc_margin_eur: true,
        financing_costs_eur: true,
      },
      realized_vs_budget_pct: true,
      cost_overrun_drivers: true,
      final_account_settled: true,
    },
    opex_breakdown: {
      currency: true,
      basis_year: true,
      per_mw_per_year: {
        om_service: true,
        land_lease: true,
        insurance: true,
        asset_management: true,
        direct_marketing: true,
        grid_charges: true,
        monitoring_scada: true,
        administrative: true,
        other: true,
      },
      total_per_mw_yr: true,
      total_annual_eur: true,
      inflation_assumption_pct: true,
    },
    revenue_history: {
      year: true,
      gross_revenue_eur: true,
      ppa_revenue_eur: true,
      cfd_revenue_eur: true,
      merchant_revenue_eur: true,
    },
    ebitda_history: {
      year: true,
      ebitda_eur: true,
      margin_pct: true,
    },
    debt_structure: {
      senior_debt: {
        outstanding_eur: true,
        original_principal_eur: true,
        lender: true,
        margin_bps: true,
        reference_rate: true,
        hedging: true,
        maturity: true,
        amortization: true,
        dscr_p50: true,
        dscr_p90: true,
        cash_sweep: true,
        lock_up_dscr: true,
        change_of_control_clause: true,
      },
      mezzanine: {
        outstanding_eur: true,
      },
      refinancing_options_open: true,
      refinancing_window: true,
    },
    subsidy_remaining: {
      scheme: true,
      award_date: true,
      guaranteed_price_eur_mwh: true,
      anzulegender_wert_eur_mwh: true,
      gueltestellenfaktor: true,
      remaining_years: true,
      remaining_volume_mwh: true,
      indexation: true,
    },
    tax_position: {
      nol_carryforward_eur: true,
      nol_expiry: true,
      accelerated_depreciation: true,
      sociedades_rate_pct: true,
    },
    valuation_reference: {
      provider: true,
      valuation_date: true,
      enterprise_value_eur: true,
      methodology: true,
    },
  },
  compliance: {
    permits: {
      permit_type: true,
      issuing_authority: true,
      reference: true,
      issue_date: true,
      valid_until: true,
      conditions: true,
      status: true,
    },
    land_rights: {
      structure: true,
      consolidation: true,
      lessor: true,
      lease_duration_years: true,
      remaining_years: true,
      annual_lease_eur: true,
      lease_structure: true,
      indexation: true,
      early_termination_rights: true,
      decommissioning_obligation: true,
      title_insurance: true,
      change_of_control_consent_required: true,
    },
    environmental_assessments: {
      assessment_type: true,
      completed_date: true,
      authority: true,
      outcome: true,
      reference: true,
    },
    eu_taxonomy_alignment: {
      applicable_activity: true,
      substantial_contribution: true,
      dnsh_assessment_complete: true,
      dnsh_assessment_date: true,
      dnsh_climate_adaptation: true,
      dnsh_climate_adaptation_notes: true,
      dnsh_water: true,
      dnsh_water_notes: true,
      dnsh_circular_economy: true,
      dnsh_circular_economy_notes: true,
      dnsh_pollution: true,
      dnsh_pollution_notes: true,
      dnsh_biodiversity: true,
      dnsh_biodiversity_notes: true,
      minimum_safeguards_complete: true,
      taxonomy_aligned_capex_pct: true,
      taxonomy_aligned_opex_pct: true,
      taxonomy_aligned_turnover_pct: true,
    },
    litigation_disputes: true,
    insurance_coverage: {
      operational_all_risks: {
        insurer: true,
        coverage_eur: true,
        deductible_eur: true,
        renewal_date: true,
      },
      business_interruption: {
        coverage_months: true,
        daily_indemnity_eur: true,
      },
      third_party_liability: {
        coverage_eur: true,
      },
    },
    decommissioning_obligation: {
      regulatory_requirement: true,
      estimated_cost_eur: true,
      estimated_cost_per_mw_eur: true,
      cost_basis_year: true,
      bond_amount_eur: true,
      bond_provider: true,
      bond_renewal: true,
    },
    esg: {
      scope_1_2_emissions_tco2e_yr: true,
      avoided_emissions_tco2e_yr: true,
      avoided_emissions_methodology: true,
      biodiversity_net_gain_pct: true,
      community_benefit_scheme: true,
    },
    bnk_system_status: true,
  },
  operating_history: {
    monthly_production: {
      inline_summary: {
        year: true,
        gross_mwh: true,
        net_mwh: true,
        availability_pct: true,
      },
      detailed_url: true,
      detailed_access: true,
      detailed_schema: true,
    },
    availability_history: {
      year: true,
      availability_pct: true,
      planned_outages_hours: true,
      unplanned_outages_hours: true,
    },
    major_events: {
      date: true,
      type: true,
      affected_capacity_mw: true,
      duration_hours: true,
      root_cause: true,
      resolved_under_warranty: true,
      revenue_impact_eur: true,
      bi_insurance_claim: true,
    },
    service_contract: {
      provider: true,
      scope: true,
      type: true,
      start_date: true,
      duration_years: true,
      remaining_years: true,
      annual_fee_eur: true,
      indexation: true,
      sla_availability_pct: true,
      sla_response_hours: true,
      liquidated_damages: true,
      structure: true,
      contracts: true,
    },
    warranty_status: {
      module_product_remaining_years: true,
      module_performance_remaining_years: true,
      inverter_remaining_years: true,
      mounting_remaining_years: true,
      epc_workmanship_remaining_years: true,
    },
    scada_access: true,
    scada_provider: true,
  },
  process: {
    process_type: true,
    invited_bidders_count: true,
    process_lead: {
      organization: true,
      contact_role: true,
      contact_email: true,
      contact_phone: true,
      name: true,
      role: true,
    },
    process_timeline: {
      teaser_distribution: true,
      information_memorandum_distribution: true,
      site_visits: true,
      non_binding_offers_due: true,
      management_presentations: true,
      binding_offers_due: true,
      signing_target: true,
      closing_target: true,
      long_stop_date: true,
      nda_deadline: true,
      indicative_bid_deadline: true,
      target_close: true,
    },
    closing_conditions: {
      regulatory_approvals_required: true,
      consents_required: true,
      landowner_consents_required: true,
      estimated_signing_to_closing_months: true,
    },
    data_room: {
      provider: true,
      url: true,
      access_mechanism: true,
      document_count_approx: true,
      structure: true,
      vendor_dd_reports: true,
    },
    nda_template: true,
    access_endpoint: true,
    confidentiality_note: true,
  },
};

/**
 * Project a RALS document down to the given allowlist.
 * @param {*} doc   parsed RALS document (or sub-tree, during recursion)
 * @param {*} allow allowlist node (PUBLIC_FIELDS or STANDARD_FIELDS)
 * @returns the filtered value, or undefined if nothing on the allowlist remains
 */
export function filterByAllowlist(doc, allow) {
  if (allow === true) return doc;
  if (doc == null || allow == null) return undefined;

  if (Array.isArray(doc)) {
    const items = doc.map((item) => filterByAllowlist(item, allow)).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }

  if (typeof doc === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(doc)) {
      if (!Object.prototype.hasOwnProperty.call(allow, key)) continue;
      const filtered = filterByAllowlist(value, allow[key]);
      if (filtered !== undefined) out[key] = filtered;
    }
    return Object.keys(out).length ? out : undefined;
  }

  // Scalar reached without an explicit `true` allowance — drop it.
  return undefined;
}

/** Return the Teaser Profile (public tier only, SPEC 13 Level 1) projection of a RALS document. */
export function filterToTeaser(doc, allow = PUBLIC_FIELDS) {
  return filterByAllowlist(doc, allow);
}

/** Return the Standard (public + nda_required, SPEC 13 Level 2) projection of a RALS document. */
export function filterToStandard(doc, allow = STANDARD_FIELDS) {
  return filterByAllowlist(doc, allow);
}
