# RALS Discovery & Authentication

RALS defines how buyer agents can discover assets and authenticate to retrieve confidential tiers.

## 1. Well-Known URI
The standard entry point for an asset is the well-known URI.
`https://example.com/.well-known/rals.yaml` (for a single asset) or a query-parameter driven endpoint for multiple assets.

## 2. Authentication Flow
To retrieve `nda_required` data, an agent must:
1. Parse the Teaser Profile.
2. Extract the `process.access_endpoint`.
3. Perform an OAuth 2.0 Client Credentials or Authorization Code flow against that endpoint.
4. Present the resulting Bearer token in subsequent requests:
   `Authorization: Bearer <token>`

The authorization server is responsible for verifying that the requesting entity has a valid, signed NDA on file for the specific `document_id`.
