---
"@workleap/logrocket": patch
"@workleap/telemetry": patch
---

Redact the private query parameters from the URL of the network requests recorded in LogRocket session replays. Previously, the private query parameters were only redacted from the page URLs. Every occurrence of a private query parameter is now redacted, previously only the first occurrence was.
