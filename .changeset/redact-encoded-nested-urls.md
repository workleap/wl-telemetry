---
"@workleap-telemetry/core": patch
"@workleap/logrocket": patch
"@workleap/honeycomb": patch
"@workleap/mixpanel": patch
"@workleap/telemetry": patch
---

A private query parameter that is nested in a percent-encoded value, such as the `token` of `returnUrl=https%3A%2F%2Fapp%2Fcallback%3Ftoken%3DABCDEF`, is now redacted from the URLs. The percent-encoded value is redacted as a whole. A private name that is partially percent-encoded in a URL, such as `to%6Ben`, is now matched as well.
