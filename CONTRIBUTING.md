# Contributing to RALS

RALS is developed in the open. Contributions are welcome from renewable-energy M&A practitioners, data-room and marketplace operators, AI-agent implementers, and anyone else with a stake in machine-readable asset listings.

This document explains how to contribute. Governance — who decides what — is in [`GOVERNANCE.md`](GOVERNANCE.md). Expected conduct is in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Ways to contribute

### Report an issue

Use GitHub Issues at <https://github.com/mahlerhutter/rals/issues>. There are templates for:

- **Spec clarification** — a passage of the specification is ambiguous or contradictory.
- **Validator bug** — the reference validator accepts an invalid document or rejects a valid one.
- **RFC proposal** — a substantive change to the spec or schema (see below).
- **Compliance mapping** — a proposal to add or correct a jurisdiction mapping.

A good issue quotes the specific section, schema fragment, or file and line.

### Propose a change to the specification — RFCs

Substantive changes go through the RFC process:

1. Copy [`rfcs/0000-template.md`](rfcs/0000-template.md) to `rfcs/NNNN-short-title.md`, choosing the next free number.
2. Fill in every section: Observation, current behavior, proposed resolution, trade-offs, alternatives considered, open questions.
3. Open a pull request. The RFC is open for comment for at least 30 days.
4. The RFC is accepted, rejected, deferred, or withdrawn, with a public rationale.

Anyone may submit an RFC. There is no membership requirement.

### Contribute an example

Realistic — but **fictional** — example documents are valuable, especially for technologies, jurisdictions, or lifecycle stages not yet covered. An example contribution must:

- be a fictional asset; invent all names, figures, counterparties, and operational data;
- validate at Level 3 against `schema/rals.schema.json` (unless it is an intentional invalid case under `examples/invalid/`);
- annotate every field with an inline tier marker (`# [P]`, `# [N]`, `# [F]`);
- carry a header comment stating what the example is designed to exercise.

### Contribute a compliance mapping

To add a jurisdiction, add `docs/compliance/<country>.md` mapping local regulatory requirements to RALS fields, and propose yourself as its steward. Use the `compliance-mapping` issue template to discuss scope first.

### Extend the tests

The conformance suite lives under [`tests/conformance/`](tests/conformance/). New must-pass and must-reject cases are welcome; each test file carries a header comment stating the expected outcome and the reason.

## Local setup

The reference implementations require **Node.js 20+** (validator, parsers, auth-server) and **Python 3.11+** (Python parser).

```bash
# Reference validator
cd reference/validator
npm install
npm test

# Validate every example against the schema
node src/cli.js ../../examples/project-helios-pv-spain.rals.yaml --level=3
```

Before opening a pull request that touches the schema or examples, confirm that:

- every file under `examples/` (except `examples/invalid/`) validates at Level 3;
- every file under `examples/invalid/` fails validation;
- filtering each example to the `public` tier leaks no `nda_required` or `final_shortlist` field.

CI enforces all three.

## Pull request expectations

- One logical change per pull request.
- Reference the issue or RFC the PR addresses.
- Specification and schema changes update [`CHANGELOG.md`](CHANGELOG.md).
- Keep prose in the RFC-style register of the rest of the repository: precise, dry, no marketing language.

## Language

Specification, schema, code, and technical documentation are written in **English**. German is used only where legal terminology is clearer in the original — currently in `docs/compliance/germany.md` and `docs/compliance/austria.md`. The glossary is bilingual where helpful.

## Licensing of contributions

By contributing you agree that your contribution is licensed under the repository's licenses: **CC BY 4.0** for specification and documentation, **MIT** for code. Do not contribute material you do not have the right to license this way.
