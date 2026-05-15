# Quickstart for M&A Advisors

As an M&A Advisor, standardizing your dealflow via RALS drastically reduces buyer friction. Instead of manually answering the same initial DD questions across a dozen potential buyers, RALS gives buyers a structured, parseable format.

## The Workflow

1. **Mapping:** Convert your bespoke Teaser / Information Memorandum into a RALS document.
2. **Hosting:** Host the `.rals.yaml` file on your firm's domain, hooked into your standard Data Room (e.g., Datasite, Intralinks) API or NDA portal.
3. **Distribution:** Include the `.well-known` RALS link in your process letters and outreach emails.
   - Example: `"This asset is RALS-compliant. Your parsing agents can fetch the structured teaser at https://deals.yourfirm.com/.well-known/rals.yaml?id=PROJ-123"`
4. **Data Room Sync:** RALS does not replace your data room. Instead, use the `process.data_room` field to point the buyer precisely to the documents that support the claims in the RALS file.

By offering a RALS endpoint, you attract institutional capital that uses automated screening, ensuring your assets are parsed and ranked faster than legacy PDF teasers.
