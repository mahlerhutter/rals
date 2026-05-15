# RALS Jurisdiction Package — Germany (DE)

**Version:** 0.1  
**Status:** Active  
**Last Reviewed:** 2026-05-15

---

## Package Purpose

This package defines Germany-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for RALS-based renewable energy asset transaction assessment.

Germany is a mature, high-volume renewable energy market with sophisticated M&A practices and well-defined transaction-readiness standards. The primary complexity for validators lies in BImSchG permitting appeal risk, species protection (Rotmilan/red kite and bats), grid connection delays, and post-2026 EEG regulatory uncertainty.

This package is **not legal advice**. Use `jurisdiction_note` and `validation_warning` fields where regulatory interpretation is uncertain.

---

## Supported Asset Types

Onshore wind (primary), solar PV (primary), BESS (growing), offshore wind (specialist), biomass/biogas/hydro (limited coverage in this package).

---

## Main Transaction Risks

**Critical:** BImSchG permit under appeal (Klagewelle) — ~20–30% of wind permits appealed; species protection (Rotmilan/§44 BNatSchG) is the leading ground.

**High:** Grid connection delay (NAZ conditional on reinforcement; TSO queue saturation); land not formally secured (Pachtvertrag + Grundbuch registrations missing); BESS queue risk (§118(6) EnWG deadline Aug 3, 2029).

**Medium:** Curtailment (Redispatch 2.0) in northern Germany; post-2026 EEG support design uncertainty; repowering complexity (new BImSchG permit + Rückbau).

---

## Readiness Interpretation

| Level | Germany-Specific Threshold |
|-------|--------------------------|
| L0 | Technology + Bundesland identified. No evidence. |
| L1 | Scoping/pre-application; landowner contacted; informal grid inquiry; no fatal constraint. |
| L2 | Permit application vollständig; NAZ received; land option/lease; species survey underway; EEG eligibility confirmed or PPA term sheet. |
| L3 | BImSchG permit rechtskräftig (no pending appeal); signed NAV; Pachtvertrag all parcels + Grundbuch registrations; EEG Zuschlagsbescheid OR binding PPA; bankable yield with curtailment modelled. |
| L4 | EPC signed; insurance bound; financial close ready. |

**Key Germany rule:** A BImSchG permit within its 1-month appeal window, or subject to any pending Verwaltungsgericht challenge, is **NOT RTB** and caps the asset at L2.

---

## Example Files

| File | Asset | Level |
|------|-------|-------|
| `examples/germany-wind-development-l2.rals.yaml` | 48 MW onshore wind, Brandenburg — permit submitted, NAZ received, Rotmilan survey in progress | L2 |
| `examples/germany-pv-rtb-l3.rals.yaml` | 72 MW solar PV, Saxony-Anhalt — permit rechtskräftig, NAV signed, EEG auction won | L3 |

---

## Disclaimer

This RALS Jurisdiction Package is a structured reference for transaction-readiness assessment only. It does not constitute German legal advice (keine Rechtsberatung). Regulatory references are as of May 2026. German energy law (EEG, BImSchG, EnWG) changes frequently. Always consult qualified German legal counsel (Rechtsanwalt) before relying on this package for transactional decisions.
