# Invalid Examples

These documents are **intentionally invalid**. The `validate-examples` CI
workflow runs them through the reference validator and fails the build if any
of them is accepted — they are the negative half of the validation test suite.

| File | Defect |
|---|---|
| `bad-enum-asset-type.rals.yaml` | `identity.asset_type` uses a value outside the RALS enum. |
| `missing-required-section.rals.yaml` | The required top-level `process` section is absent. |

Each file remains valid YAML; the failure is a schema violation, not a parse
error. When adding a new invalid case, document the defect here and keep the
`.rals.yaml` extension so the workflow's glob picks it up.
