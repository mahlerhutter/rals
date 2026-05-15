# Quickstart for Sellers & Developers

If you own or are developing a renewable asset, formatting your asset data as a RALS document makes it significantly easier for institutional investors (and their AI screening tools) to evaluate your project.

## Step 1: Gather your data
You will need your standard Information Memorandum (IM), technical DD reports, and financial model. RALS expects data across 7 core dimensions: Identity, Technical, Grid & Offtake, Financials, Compliance, Operating History, and Process.

## Step 2: Create the RALS file
You can start with one of the examples in the `examples/` directory that most closely matches your asset (e.g., Solar PV, Onshore Wind). 

## Step 3: Understand Confidentiality Tiers
Not everything should be public. RALS enforces a strict tiering system:
- `[P] public`: Information safe for a teaser (e.g., MW capacity, country, technology).
- `[N] nda_required`: Information revealed only after an NDA (e.g., specific counterparty names, specific coordinates, EBITDA).
- `[F] final_shortlist`: Highly sensitive data (e.g., PPA strike price, floor/cap, exact ask price).

## Step 4: Validate
Use the reference validator to ensure your document conforms to the RALS schema:
```bash
node reference/validator/src/cli.js my-project.rals.yaml
```

## Step 5: Host and Distribute
Host the file on your domain. Expose a server endpoint that serves the full YAML *only* to authenticated requests, while serving a tier-filtered "teaser" to unauthenticated requests. You can then provide the `.well-known` URI to your advisory team.
