import { describe, it, expect } from 'vitest';
import { filterToTeaser, filterToStandard, PUBLIC_FIELDS, STANDARD_FIELDS } from '../src/teaser-filter.js';

const DOC = {
  rals_version: '0.1',
  identity: {
    asset_name: 'Test Asset',
    asset_type: 'solar_pv',
    country: 'AT',
    seller_legal_entity: 'Confidential Seller GmbH', // nda_required
    internal_reference: 'SECRET-042', // final_shortlist
  },
  grid_offtake: {
    offtake_structure: 'feed_in_tariff',
    grid_connection: {
      voltage_level_kv: 110, // public
      connection_agreement_date: '2022-01-01', // nda_required
    },
  },
  financials: {
    reporting_currency: 'EUR', // public
    capex: { total_eur: 50000000 }, // nda_required
  },
};

describe('filterToTeaser (SPEC 13 Level 1 — public only)', () => {
  it('keeps public fields and drops nda_required and final_shortlist fields', () => {
    const teaser = filterToTeaser(DOC);
    expect(teaser.identity.asset_name).toBe('Test Asset');
    expect(teaser.identity.seller_legal_entity).toBeUndefined();
    expect(teaser.identity.internal_reference).toBeUndefined();
    expect(teaser.grid_offtake.grid_connection.voltage_level_kv).toBe(110);
    expect(teaser.grid_offtake.grid_connection.connection_agreement_date).toBeUndefined();
    expect(teaser.financials.capex).toBeUndefined();
  });

  it('drops a field entirely absent from PUBLIC_FIELDS even if present in the document', () => {
    const teaser = filterToTeaser({ identity: { asset_name: 'x', undocumented_extension_field: 'leak me' } });
    expect(teaser.identity.undocumented_extension_field).toBeUndefined();
  });
});

describe('filterToStandard (SPEC 13 Level 2 — public + nda_required)', () => {
  it('keeps public and nda_required fields, drops only final_shortlist', () => {
    const standard = filterToStandard(DOC);
    expect(standard.identity.asset_name).toBe('Test Asset');
    expect(standard.identity.seller_legal_entity).toBe('Confidential Seller GmbH');
    expect(standard.identity.internal_reference).toBeUndefined(); // final_shortlist
    expect(standard.grid_offtake.grid_connection.connection_agreement_date).toBe('2022-01-01');
    expect(standard.financials.capex.total_eur).toBe(50000000);
  });

  it('STANDARD_FIELDS is a strict superset of PUBLIC_FIELDS at the top level', () => {
    for (const key of Object.keys(PUBLIC_FIELDS)) {
      expect(STANDARD_FIELDS).toHaveProperty(key);
    }
  });
});
