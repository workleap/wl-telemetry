---
"@workleap/logrocket": patch
"@workleap/telemetry": patch
---

Redact the credential headers of the network requests and responses recorded in LogRocket session replays, regardless of the casing of the header name. A header is now redacted when its name contains `auth`, `cookie`, `token`, `session`, `secret`, `key`, `csrf`, `xsrf` or `x-honeycomb-team`. Previously, only a request header named exactly `Authorization` was redacted.
