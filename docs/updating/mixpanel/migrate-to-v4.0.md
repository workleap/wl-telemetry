---
order: 180
label: Migrate to v4.0
meta:
    title: Migrate to v4.0 - Mixpanel
---

# Migrate to v4.0

This major version remove the global variables deprecated in [v.3.0](./migrate-to-v3.0.md#deprecated) and introduce a `productFamily` argument.

## Breaking changes

### Removed

- The `createTrackingFunction` has been removed, use the client [createTrackingFunction](../../reference/telemetry/MixpanelClient.md#methods) method instead.
- The `window.__WLP_MIXPANEL_IS_INITIALIZED__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/MixpanelClient.md) instance to the third-party libraries.
