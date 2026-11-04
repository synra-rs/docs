---
title: Error Codes
---

# Error Codes

Branch on structured error codes, not translated UI text.

## Error forms

| Boundary | Message representation | Additional context |
| --- | --- | --- |
| Plugin client `SynraError` | A human-readable message string | Code, retryability, suggested actions and optional details |
| Host management `IpcError` | A localizable message key | Code, optional params/details, retryability and suggested actions |

Optional fields and empty arrays may be omitted during serialization.
Consumers must handle absent `actions`, `params` and `details` according to their declared types.

## Code catalogue

| Code | Meaning | Retryable by code |
| --- | --- | --- |
| `capability_denied` | Required grant or scope missing | no |
| `plugin_not_installed` | Required plugin absent | no |
| `device_offline` | Target currently unreachable | yes |
| `not_paired` | Pairing required | no |
| `transport_not_open` | Link not usable | yes |
| `transfer_failed` | Transfer failed | yes |
| `integrity_mismatch` | Digest does not match | no |
| `payload_too_large` | Payload exceeds its limit | no |
| `timeout` | Operation deadline exceeded | yes |
| `rate_limited` | Call budget exhausted | yes |
| `unsupported` | Host or platform lacks the operation | no |
| `invalid_argument` | Invalid input | no |
| `scheme_not_allowed` | URL scheme refused | no |
| `host_not_allowed` | HTTP host outside allowed scope | no |
| `ip_not_allowed` | Resolved address refused | no |
| `redirect_blocked` | Redirect leaves allowed scope | no |
| `response_too_large` | Response exceeds its limit | no |
| `protocol_violation` | Contract or namespace violation | no |
| `protocol_version_unsupported` | Incompatible peer protocol | no |
| `plugin_trapped` | Guest trapped or exceeded a runtime limit | no |
| `plugin_timeout` | Plugin exceeded its time budget | no |
| `internal` | Unexpected failure | yes |

This column reflects the protocol code's default classification, not permission to automatically
repeat a business operation.

## Retry and recovery

A retryable network error may justify retrying an idempotent read.
It does not justify replaying a click, transfer decision or other effect without knowing its outcome.

For `capability_denied`, inspect the declaration and current grant.
For `unsupported`, choose a supported path. For `not_paired`, complete pairing first.
An integrity mismatch is not retryable by the code's default classification; inspect or rebuild
the source and start a deliberate new transfer if appropriate.

## Useful context

Show relevant suggested actions and parameterized reasons near the failed operation.
Preserve a form draft when saving fails. Include the first error and task identity in a report,
without forwarding private payloads or secrets.

## Next

- [Troubleshooting](/guide/troubleshooting).
- [Capabilities](/reference/capabilities).
