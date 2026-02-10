---
order: 190
label: Migrate to the umbrella v3.0
toc:
    depth: 2-3
---

# Migrate to the umbrella v3.0

This major version remove the global variables deprecated in the previous versions of the standalone libraries and introduce a `productFamily` argument.

## Breaking changes

### Removed

- The `window.__WLP_HONEYCOMB_INSTRUMENTATION_IS_REGISTERED__` global variable have been removed. Instead, provide a [client](../reference/telemetry/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK__` global variable have been removed. Instead, provide a [client](../reference/telemetry/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK_AT_START__` global variable have been removed. Instead, provide a [client](../reference/telemetry/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_LOGROCKET_INSTRUMENTATION_IS_REGISTERED__` global variable have been removed. Instead, provide a [client](../reference/telemetry/LogRocketInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__` global variable have been removed. Instead, provide a [client](../reference/telemetry/LogRocketInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_MIXPANEL_IS_INITIALIZED__` global variable have been removed. Instead, provide a [client](../reference/telemetry/MixpanelClient.md) instance to the third-party libraries.
- The `createTrackingFunction` has been removed, use the client [createTrackingFunction](../reference/telemetry/MixpanelClient.md#methods) method instead.

