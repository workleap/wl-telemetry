---
"@workleap/mixpanel": minor
"@workleap/telemetry": patch
---

Redact the private query parameters from the `$current_url` and `$referrer` properties sent with every Mixpanel event, and remove the fragment from `$current_url`. The `token`, `email` and `password` query parameters are redacted by default, additional names can be provided with the new `privateQueryParameterNames` option. An application using hash routing will no longer get the route in `$current_url`.
