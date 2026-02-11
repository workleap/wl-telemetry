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

### `initializeTelemetry` requires a `productFamily` argument

With the addition of ShareGate to this library, a way to distinguish whether the consumer is a Workleap Platform or a ShareGate application is now required. This is the purpose of the new [productFamily]() argument of the [initializeTelemetry]() function:

```ts
initializeTelemetry("sg", {
    ...
});
```

### Mixpanel `productId` is now an option

The [initializeTelemetry]() function `mixpanel.productId` has been moved as an option.

Previously, it made sense for `productId` to be a required argument because all WLP products were single-product applications, and the product identifier was known at initialization time. This is not the case for all ShareGate applications.

Before:

```ts !#3
initializeTelemetry("wlp", {
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});
```

After:

```ts !#5
const telemetryClient = initializeTelemetry("wlp", {
    mixpanel: {
        envOrTrackingApiBaseUrl: "development",
        options: {
            productId: "wlp"
        }
    }
});
```

## Improvements

### New `productId` option for `createTrackingFunction`

A Mixpanel client [createTrackingFunction](../reference/telemetry/MixpanelClient.md) instance now accept a `productId` as an option:

```ts !#8
const telemetryClient = initializeTelemetry("wlp", {
    mixpanel: {
        envOrTrackingApiBaseUrl: "development"
    }
});

const track = telemetryClient.mixpanelClient.createTrackingFunction({
    productId: "wlp"
});
```

If a `productId` is provided both during initialization and as an option to `createTrackingFunction`, the value passed to `createTrackingFunction` takes precedence.

### New `productId` option for `useMixpanelTrackingFunction`

The [useMixpanelTrackingFunction](../reference/telemetry/useMixpanelTrackingFunction.md) hook now accept a `productId` as an option:

```ts !#2
const track = useMixpanelTrackingFunction({
    productId: "wlp"
});
```



