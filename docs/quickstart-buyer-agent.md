# Quickstart for Buyer Agents & AI

RALS is designed to be consumed by software—specifically, LLMs and autonomous buyer agents acting on behalf of institutional capital.

## 1. Discovery
Agents can discover assets by looking for the `.well-known/rals.yaml` file on an advisor or developer's domain.

## 2. Parsing the Teaser
A standard `GET` request to the discovery endpoint will yield the **Teaser Profile**. All `nda_required` and `final_shortlist` fields are stripped server-side.

```bash
curl -H "Accept: application/yaml" https://advisor.example.com/.well-known/rals.yaml
```

## 3. Pre-qualification
Your agent can parse the YAML and match it against the buyer's mandate (e.g., Solar PV, Spain, >50 MW, Operating).

## 4. Authentication (NDA)
If the asset matches the mandate, the agent looks at `process.access_endpoint`. It follows the OAuth 2.0 flow specified in Section 12 to programmatically sign an NDA (or notify a human to sign it) and obtain a Bearer token.

## 5. Fetching the Full Profile
With the token, the agent fetches the Full Profile, which includes the `[N]` tier data:

```bash
curl -H "Authorization: Bearer <token>" https://advisor.example.com/.well-known/rals.yaml
```
