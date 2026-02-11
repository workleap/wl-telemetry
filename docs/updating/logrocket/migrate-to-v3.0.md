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

### New `createShareGateDefaultUserTraits` function

The LogRocket instrumentation client have a new [createShareGateDefaultUserTraits](../../standalone-libraries/setup-logrocket.md#get-default-user-traits-for-sharegate) method:

```ts
const traits = client.createShareGateDefaultUserTraits({
    shareGateAccountId: "cd7fb5ca-f13d-420f-9a87-637b3419d242",
    microsoftUserId: "e9bb1688-a68b-4235-b514-95a59a7bf8bc",
    microsoftTenantId: "86bea6e5-5dbb-43c9-93a4-b10bf91cc6db",
    workspaceId: "225e6494-c008-4086-ac80-3770aa47085b"
});
```
