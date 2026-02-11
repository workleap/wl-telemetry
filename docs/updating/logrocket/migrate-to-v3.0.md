---
order: 180
label: Migrate to v3.0
meta:
    title: Migrate to v3.0 - LogRocket
toc:
    depth: 2-3
---

# Migrate to v3.0

This major version remove the global variables deprecated in [v2.0](./migrate-to-v2.0.md#deprecated).

## Breaking changes

### Removed

- The `window.__WLP_LOGROCKET_INSTRUMENTATION_IS_REGISTERED__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/LogRocketInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/LogRocketInstrumentationClient.md) instance to the third-party libraries.

## Improvements

### New `createShareGateDefaultUserTraits` function

The [LogRocketInstrumentationClient]() have a new [createShareGateDefaultUserTraits]() function:

```ts
```
