---
order: 200
label: Migrate to v6.0
meta:
    title: Migrate to v6.0 - Honeycomb
---

# Migrate to v6.0

This new version introduces two correlation ids, `telemetryId` and `deviceId`, to help unify and correlate data across [LogRocket](https://logrocket.com/), [Honeycomb](https://www.honeycomb.io/) and [Mixpanel](https://mixpanel.com/) and a new automatic enrichment of the traces with the LogRocket session url if the [LogRocket instrumentation](../../logrocket/getting-started.md) is registered.

## Improvements

### Correlation ids

To help unify and correlate data across LogRocket, Honeycomb, and Mixpanel, the [registerHoneycombInstrumentation](../reference/registerHoneycombInstrumentation.md) function now automatically adds two correlation ids as attributes to every trace:

- `telemetryId` is an identifier that represents a single application load.
- `deviceId` is an identifier that represents a single device across multiple loads.

### Session URL enrichment

A built-in integration now automatically allows other telemetry libraries to include the LogRocket session replay URL in their traces.

Once the LogRocket session URL is retrieved, each trace is enriched with an `app.logrocket_session_url` attribute:

:::align-image-left
![Enrichment example](../../static/honeycomb/honeycomb-logrocket-session-url.png){width=328}
:::
