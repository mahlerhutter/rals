# RALS Jurisdiction Package — Austria (AT)

## Package Purpose

This package provides country-specific field interpretation, evidence requirements, readiness thresholds, and risk taxonomy for renewable energy asset transactions in Austria.

Austria is a mature European renewable energy market with a federal regulatory structure. Permitting, spatial planning, and building permits are primarily Bundesland competences, while grid connection is handled by regional DSOs and the national TSO (APG). The EAG (Erneuerbaren-Ausbau-Gesetz) governs support schemes administered by OeMAG.

## Supported Asset Types

- Solar PV (utility-scale ground-mount and rooftop)
- Onshore wind
- Small and run-of-river hydro
- Battery energy storage (BESS)
- Hybrid assets

## Main Transaction Risks

- **Grid capacity constraints**: rapid PV deployment has saturated some DSO substations, particularly in Burgenland and Lower Austria. Conditional connection offers pending grid reinforcement are common.
- **Permitting variability by Bundesland**: nine states with different Raumordnungsgesetze and building codes. Wind development is heavily restricted in Alpine states.
- **UVP appeals**: environmental impact assessment decisions for wind and large PV are frequently appealed by NGOs or Bürgerinitiativen to VwG or VwGH. Rechtskraft confirmation is mandatory at L3.
- **Hydro concession renewal**: Wasserrechtsbescheid expiry creates unique transaction risk for hydro assets.
- **Legislative uncertainty**: the ElWG and EABG reform packages were pending as of mid-2026.

## Readiness Level Interpretation

| Level | Label | Austria-Specific Trigger |
|-------|-------|--------------------------|
| L0 | Teaser Only | Asset identified, no permit/grid/land evidence |
| L1 | Screenable | Site confirmed, grid inquiry submitted, land contact established |
| L2 | Investment Memo Ready | Netzanschlusszusage valid, permit application submitted, land option signed |
| L3 | Lender Diligence Ready | Permit rechtskräftig, Netzanschlussvertrag signed, OeMAG contract or PPA |
| L4 | Data Room Ready | EPC signed, all conditions precedent met, VDD complete |

## Example Files

| File | Asset Type | Stage | Level |
|------|------------|-------|-------|
| `examples/austria-pv-rtb-l2.rals.yaml` | Solar PV | Ready-to-Build | L2 |
| `examples/austria-hydro-operating-l3.rals.yaml` | Hydro | Operating | L3 |

## Key Authorities

- **E-Control**: energy regulator — [e-control.at](https://www.e-control.at)
- **OeMAG**: EAG support scheme administrator — [oem-ag.at](https://www.oem-ag.at)
- **APG**: national TSO — [apg.at](https://www.apg.at)
- **BMK**: federal energy ministry — [bmk.gv.at](https://www.bmk.gv.at)

## Disclaimer

This package is a technical reference for transaction-readiness assessment. It is not legal advice. Austrian law and grid connection rules change frequently. Always verify with qualified Austrian legal counsel and the relevant Netzbetreiber or Landesbehörde.
