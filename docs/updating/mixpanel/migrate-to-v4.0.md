---
order: 180
label: Migrate to v4.0
meta:
    title: Migrate to v4.0 - Mixpanel
toc:
    depth: 2-3
---

# Migrate to v4.0

This major version remove the global variables deprecated in [v3.0](./migrate-to-v3.0.md#deprecated).

## Breaking changes

### Removed

- The `createTrackingFunction` has been removed, use the client [createTrackingFunction](../../reference/telemetry/MixpanelClient.md#methods) method instead.
- The `window.__WLP_MIXPANEL_IS_INITIALIZED__` global variable have been removed. Instead, provide a [client](../../reference/telemetry/MixpanelClient.md) instance to the third-party libraries.

### `productId` is now an option of `initializeMixpanel`

The [initializeMixpanel](../../standalone-libraries/mixpanel/reference.md#initializemixpanel) function no longuer accept `productId` as it's first argument, it is now provided as an option.

Previously, it made sense for `productId` to be a required argument because all WLP products were single-product applications, and the product identifier was known at initialization time. This is not the case for all ShareGate applications.

Before:

```ts
initializeMixpanel("wlp", "development", {
    telemetryContext: createTelemetryContext()
});
```

Now:

```ts !#2
initializeMixpanel("development", {
    productId: "wlp",
    telemetryContext: createTelemetryContext()
});
```

### `createTelemetryContext` now requires a `productFamily` argument

The `createTelemetryContext` function signature has been updated to introduce a `productFamily` argument as the first parameter.

Before:

```ts
const context = createTelemetryContext();
```

Now:

```ts !#1
const context = createTelemetryContext("sg");
```

## Improvements

### New `productId` option for `createTrackingFunction`

A Mixpanel instrumentation client [createTrackingFunction](../../standalone-libraries/mixpanel/reference.md#mixpanelclient) instance now accept a `productId` as an option:

```ts !#6
const client = initializeMixpanel("development", {
    telemetryContext: createTelemetryContext()
});

const track = client.createTrackingFunction({
    productId: "wlp"
});
```

If a `productId` is provided both during initialization and as an option to `createTrackingFunction`, the value passed to `createTrackingFunction` takes precedence.

### New `MixpanelPropertiesProvider`

A new [MixpanelPropertiesProvider](../../standalone-libraries/mixpanel/reference.md#mixpanelpropertiesprovider) is available to define scoped Mixpanel properties. These properties are automatically attached to every event tracked by components nested within the provider.

```tsx !#7,9
const MixpanelProperties = {
    section: "User Form"
};

function App() {
    return (
        <MixpanelPropertiesProvider value={MixpanelProperties}>
            <NestedComponent />
        </MixpanelPropertiesProvider>
    )
}
```


