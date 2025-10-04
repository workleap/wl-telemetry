---
order: 80
label: LogRocket session URL
meta:
    title: LogRocket session URL - Introduction
---

# LogRocket session URL

With the [@worleap/telemetry](https://www.npmjs.com/package/@workleap/telemetry) umbrella package, if LogRocket instrumentation is enabled, the Honeycomb and Mixpanel libraries will automatically attach the [LogRocket](https://logrocket.com/) session URL to their traces/events once it's available:

| Honeycomb | Mixpanel |
| --- | --- |
| `app.logrocket_session_url` | `LogRocket Session URL` |

A similar result can be achieved with the standalone telemetry library by manually providing a [LogRocketInstrumentationClient]() instance to the libraries:

- [@workleap/honeycomb](../honeycomb/reference/registerHoneycombInstrumentation.md#logrocketinstrumentationclient)
- [@workleap/mixpanel](../mixpanel/reference/initializeMixpanel.md#integrate-with-logrocket)

!!!warning
This feature is available only when using the following package versions or higher:

- `@workleap/telemetry` ≥ `2.0.0`
- `@workleap/logrocket` ≥ `1.0.0`
- `@workleap/honeycomb` ≥ `6.0.0`
- `@workleap/mixpanel` ≥ `2.0.0`

If your application is using older versions, refer to the [migration guide](./migrate.md) to update.
!!!
