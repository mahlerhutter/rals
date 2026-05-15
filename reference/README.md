# RALS Reference Implementations

This directory contains reference code to help developers adopt RALS.

## Validator
`validator/` contains a Node.js JSON Schema validator (`ajv`-based) capable of verifying RALS documents against `schema/rals.schema.json`.

## Parsers (Coming Soon)
Libraries for parsing RALS YAML, specifically to handle Tier Marker filtering safely before releasing data to agents.

## Auth Server (Coming Soon)
A reference OAuth 2.0 implementation for the `.well-known` endpoint.
