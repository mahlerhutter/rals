# Security Policy

## Supported Versions

Currently only the `main` branch (working toward `v1.0`) is supported for security updates.

## Reporting a Vulnerability

If you discover a vulnerability in the RALS specification, schema, or reference implementations—especially one that could lead to a leak of `nda_required` or `final_shortlist` fields into the public teaser profile—please report it immediately.

**Do not open a public issue.**

Instead, please email `security@orls.org`. We aim to acknowledge receipt within 48 hours and provide a timeline for a fix.

### What is considered a vulnerability?
- Schema definitions that inadvertently expose sensitive fields in default filtering implementations.
- Flaws in the reference validator or reference auth server that could bypass access controls.
- OAuth 2.0 implementation weaknesses in the discovery/auth specifications.
