# RALS Governance

This document describes how the Renewable Asset Listing Standard is governed. It is intended to be honest about the project's current stage rather than to project an institutional maturity the project does not yet have.

## 1. Current model: single editor (BDFL)

RALS is currently maintained under a **single-editor model**. The editor is Manuel Mendel. The editor:

- merges changes to the specification, schema, and reference implementations;
- decides the disposition of RFCs;
- cuts releases.

This is a deliberate choice for the Working Draft phase. A standard with no adopters does not need a committee; it needs a coherent first draft. Concentrating editorial control while the standard is small keeps it internally consistent.

It is also a temporary choice. The model below is a commitment, not an aspiration.

## 2. Transition to a Steering Committee

When RALS reaches **five independent adopters** — five organizations, not affiliated with the editor, that have published or consumed RALS documents in a real transaction context — the editor will convene a **Steering Committee** within 90 days.

- The Steering Committee has **3 to 5 seats**.
- **At least two seats** must be held by people outside the editor's professional network, to prevent the committee from being a single network in formal dress.
- Seats are held by individuals, not companies.
- The editor holds one seat and, during a 12-month transition period, retains a casting vote on deadlocked decisions. After the transition period the editor's vote is equal to any other member's.

Once the Steering Committee exists, it — not the editor alone — merges specification changes, by simple majority.

"Independent adopter" status is tracked publicly in the repository so the trigger condition is verifiable.

## 3. The RFC process

Substantive changes to the specification or schema are made through RFCs.

- **Who may submit:** anyone. There is no membership requirement.
- **Where:** as a pull request adding a numbered file under [`rfcs/`](rfcs/), using [`rfcs/0000-template.md`](rfcs/0000-template.md).
- **Review:** an RFC is open for comment for a minimum of 30 days.
- **Decision:** under the single-editor model, the editor decides and records a public rationale. Under the Steering Committee, the committee decides by simple majority.
- **Outcome:** an RFC is *accepted*, *rejected*, *deferred*, or *withdrawn*. Accepted RFCs are merged and referenced from the changelog.

Editorial changes — typos, clarifications, broken links, non-normative wording — do not require an RFC and may be merged directly.

## 4. Conflict resolution

Disagreement is expected and welcome during a Working Draft phase. Where consensus cannot be reached:

- Under the single-editor model, the editor decides and documents the decision and the dissent.
- Under the Steering Committee, an unresolved question is put to a vote. If the vote is tied and the transition period has ended, the question is **deferred to the next minor version** rather than resolved by force. The standard's credibility depends more on getting fewer things right than on shipping contested decisions.

## 5. Versioning and release cadence

RALS uses Semantic Versioning.

- **Major versions** (breaking changes) are published **at most once every 18 months**, to give implementers a stable target.
- **Minor versions** (backward-compatible additions) may be published **at any time**.
- **Patch releases** (clarifications, errata, schema bug-fixes that do not change conformance) are published as needed.

Reference implementations track the specification with a matching major version.

## 6. Stewardship of jurisdiction compliance mappings

Compliance mappings (e.g. [`docs/compliance/germany.md`](docs/compliance/germany.md)) age as regulations change. Each mapping names a steward responsible for keeping it current. Stewardship is open: propose yourself in a pull request. An unmaintained mapping is marked stale rather than silently trusted.

## 7. Scope of this document

This document governs the standard. It does not govern the conduct of contributors — see [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — nor the mechanics of contributing — see [`CONTRIBUTING.md`](CONTRIBUTING.md).
