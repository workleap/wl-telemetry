---
order: 190
label: Migrate to v3.0
meta:
    title: Migrate to v3.0 - Mixpanel
---

# Migrate to v3.0

This major version introduces several important changes. `initializeMixpanel` now returns a [client](../reference/MixpanelClient.md) instance. The standalone `createTrackingFunction` and `setSuperProperties` functions has been moved to the client, telemetry correlation ids are no longuer implicitly added to session replays, and global variables for third-party integrations have been deprecated. To attach telemetry correlation ids to session replays, you must now provide a [TelemetryContext](../reference/createTelemetryContext.md#telemetrycontext) instance. Third-party libraries such as Squide and the Platform widgets should also be explicitly provided with the returned client instance to use Mixpanel.

## Breaking changes

### Removed

- Removed the `setSuperProperty` and `setSuperProperties` standalone functions, use [client.setGlobalEventProperty](../reference/MixpanelClient.md#methods) and [client.setGlobalEventProperties](../reference/MixpanelClient.md#methods) instead.

### Deprecated

- The `createTrackingFunction` has been deprecated, use [client.createTrackFunction](../reference/MixpanelClient.md#methods) instead.
- The `window.__WLP_MIXPANEL_IS_INITIALIZED__` global variable have been deprecated. Instead, provide a [client](../reference/MixpanelClient.md) instance to the third-party libraries.

### Others

- The `telemetryId` and `deviceId` correlation ids are no longer implicitly attached to LogRocket session replays. To attach these ids, provide a [TelemetryContext](../reference/createTelemetryContext.md#telemetrycontext) instance to the [initializeMixpanel](../reference/initializeMixpanel.md) function. You can create a `TelemetryContext` instance using the [createTelemetryContext](../reference/createTelemetryContext.md) utility function.
- If your application is a React application, you must now import everything from `@workleap/mixpanel/react` rather than `@workleap/mixpanel`.


## New React context

- A new [MixpanelClientProvider](../reference/MixpanelClientProvider.md) React context provider is available to forward a `MixpanelClient` instance.
- A new [useMixpanelClient](../reference/useMixpanelClient.md) hook is available to retrieve the provided `MixpanelClient` instance.

## Migrate to `3.0`

Before:

```tsx
import { initializeMixpanel} from "@workleap/mixpanel";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("wlp", "development");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

Now:

```tsx !#6-8,14,16
import { initializeMixpanel, MixpanelClientProvider, createTelemetryContext } from "@workleap/mixpanel/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("wlp", "development", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <MixpanelClientProvider value={client}>
            <App />
        </MixpanelClientProvider>
    </StrictMode>
);
```
