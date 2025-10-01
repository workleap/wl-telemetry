---
order: 80
label: LogRocket session URL
meta:
    title: LogRocket session URL - Introduction
---

# LogRocket session URL

In addition to the correlation ids, if LogRocket instrumentation is initialized, the Honeycomb and Mixpanel libraries will automatically enrich their data with the [LogRocket](https://logrocket.com/) session URL once it's available:

| Honeycomb | Mixpanel |
| --- | --- |
| `app.logrocket_session_url` | `LogRocket Session URL` |

!!!warning
This feature is available only when using the following package versions or higher:

- `@workleap/telemetry` ≥ `2.0.0`
- `@workleap/logrocket` ≥ `1.0.0`
- `@workleap/honeycomb` ≥ `6.0.0`
- `@workleap/mixpanel` ≥ `2.0.0`

If your application is using older versions, refer to the [migration guide](./migrate.md) to update.
!!!
