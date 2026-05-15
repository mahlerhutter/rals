/**
 * RALS reference teaser filter.
 *
 * Projects a full RALS document down to its public Teaser Profile by keeping
 * only the fields the specification tags `public` (SPEC sections 6-12).
 * Every field not on the allowlist defaults to `nda_required` and is dropped,
 * per SPEC section 4.3 ("The default for any field not explicitly tagged is
 * nda_required").
 *
 * This is the single source of truth for tier filtering: the web server uses
 * it to publish listings, and the tier-leak CI check uses it to verify no
 * confidential field reaches a Teaser.
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
    mounting: true,
    bess_chemistry: true,
    production_estimates: {
      methodology: true,
    },
  },

  grid_offtake: {
    offtake_structure: true,
    grid_connection: {
      voltage_level_kv: true,
      connection_capacity_mw: true,
      grid_operator: true,
    },
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
    eu_taxonomy_alignment: true,
    esg: true,
  },

  operating_history: {
    scada_access: true,
  },

  process: {
    process_type: true,
    invited_bidders_count: true,
    process_lead: true,
    process_timeline: true,
    nda_template: true,
    access_endpoint: true,
    confidentiality_note: true,
  },
};

/**
 * Return the Teaser Profile projection of a RALS document.
 * @param {*} doc   parsed RALS document (or sub-tree, during recursion)
 * @param {*} allow allowlist node (defaults to the full PUBLIC_FIELDS map)
 * @returns the filtered value, or undefined if nothing public remains
 */
export function filterToTeaser(doc, allow = PUBLIC_FIELDS) {
  if (allow === true) return doc;
  if (doc == null || allow == null) return undefined;

  if (Array.isArray(doc)) {
    const items = doc.map((item) => filterToTeaser(item, allow)).filter((v) => v !== undefined);
    return items.length ? items : undefined;
  }

  if (typeof doc === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(doc)) {
      if (!Object.prototype.hasOwnProperty.call(allow, key)) continue;
      const filtered = filterToTeaser(value, allow[key]);
      if (filtered !== undefined) out[key] = filtered;
    }
    return Object.keys(out).length ? out : undefined;
  }

  // Scalar reached without an explicit `true` allowance — drop it.
  return undefined;
}
