---
"@workleap/honeycomb": minor
"@workleap/telemetry": patch
---

Redact the private query parameters from the URLs sent with the Honeycomb traces, such as the `url.full`, `page.url` and `entry_page.referrer` attributes, and remove the fragment from those URLs. The `page.hash` and `entry_page.hash` attributes are no longer sent. The `token`, `email` and `password` query parameters are redacted by default, additional names can be provided with the new `privateQueryParameterNames` option. An application using hash routing will no longer get the route in `page.url` and `page.hash`.
