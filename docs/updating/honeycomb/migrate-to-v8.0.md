---
order: 180
label: Migrate to v8.0
meta:
    title: Migrate to v8.0 - Honeycomb
---

# Migrate to v8.0

This major version remove the global variables deprecated in [v.7.0](./migrate-to-v7.0.md#deprecated) and introduce a `productFamily` argument.

## Breaking changes

### Removed

- The `window.__WLP_HONEYCOMB_INSTRUMENTATION_IS_REGISTERED__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK_AT_START__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/HoneycombInstrumentationClient.md) instance to the third-party libraries.



