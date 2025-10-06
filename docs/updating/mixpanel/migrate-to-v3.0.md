---
order: 190
label: Migrate to v3.0
meta:
    title: Migrate to v3.0 - Mixpanel
---

# Migrate to v3.0

This major version introduces several important changes. `initializeMixpanel` now returns a [client](../../reference/telemetry/MixpanelClient.md) instance. The standalone `createTrackingFunction` and `setSuperProperties` functions has been moved to the client, telemetry correlation ids are no longuer implicitly added to session replays, and global variables for third-party integrations have been deprecated. To attach telemetry correlation ids to session replays, you must now provide a [TelemetryContext](../../reference/telemetry/TelemetryContext.md) instance. Third-party libraries such as [Squide](https://workleap.github.io/wl-squide) and the [Platform widgets](https://dev.azure.com/workleap/WorkleapPlatform/_git/workleap-platform-widgets?path=/README.md) should also be explicitly provided with the returned client instance to use Mixpanel.

## Breaking changes

### Removed

- Removed the `setSuperProperty` and `setSuperProperties` standalone functions, use the client [setGlobalEventProperty](../../reference/telemetry/MixpanelClient.md#methods) and [setGlobalEventProperties](../../reference/telemetry/MixpanelClient.md#methods) methods instead.

### Deprecated

- The `createTrackingFunction` has been deprecated, use the client [createTrackingFunction](../../reference/telemetry/MixpanelClient.md#methods) method instead.
- The `window.__WLP_MIXPANEL_IS_INITIALIZED__` global variable have been deprecated. Instead, provide a [client](../../reference/telemetry/MixpanelClient.md) instance to the third-party libraries.

### Others

- The `telemetryId` and `deviceId` correlation ids are no longer implicitly attached to LogRocket session replays. To attach these ids, provide a [TelemetryContext](../../reference/telemetry/TelemetryContext.md) instance to the [initializeMixpanel](../../standalone-libraries/setup-mixpanel.md) function. You can create a `TelemetryContext` instance using the [createTelemetryContext](../../standalone-libraries/setup-mixpanel.md) utility function.
- If your application is a React application, you must now import everything from `@workleap/mixpanel/react` rather than `@workleap/mixpanel`.

### Update the initialization code

The [initializeMixpanel](../../standalone-libraries/setup-mixpanel.md) function now returns a [client](../../reference/telemetry/MixpanelClient.md) that must be forwarded to the [MixpanelProvider](../../standalone-libraries/setup-mixpanel.md). In addition, a [TelemetryContext](../../reference/telemetry/TelemetryContext.md) instance must be manually provided to the registration function to ensure correlation ids continue being attached to Mixpanel events.

Before:

```tsx index.ts
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

```tsx !#6-8,14,16 index.ts
import { initializeMixpanel, MixpanelProvider, createTelemetryContext } from "@workleap/mixpanel/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = initializeMixpanel("wlp", "development", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <MixpanelProvider client={client}>
            <App />
        </MixpanelProvider>
    </StrictMode>
);
```

### Replace `setSuperProperty` and `setSuperProperties` with the client

The `setSuperProperty` and `setSuperProperties` standalone functions are not exported anymore. Use the client [setGlobalEventProperty](../../reference/telemetry/MixpanelClient.md#methods) and [setGlobalEventProperties](../../reference/telemetry/MixpanelClient.md#methods) methods instead.

Before:

```ts
import { setSuperProperties } from "@workleap/mixpanel";

setSuperProperties({
    "User Id": "123" 
});
```

Now:

```ts !#3,5,7-9
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperty("User Id", "123");

client.setGlobalEventProperties({
    "User Id": "123" 
});
```

### Replace `createTrackingFunction` with the client

The `createTrackingFunction` standalone function is not exported anymore. Use the client [createTrackingFunction](../../reference/telemetry/MixpanelClient.md#methods) method instead.

Before:

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

Now:

```ts !#3,5,7
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

## New React context

- A new [MixpanelProvider](../../standalone-libraries/setup-mixpanel.md) React context provider is available to forward a `MixpanelClient` instance.
- A new [useMixpanelClient](../../standalone-libraries/setup-mixpanel.md) hook is available to retrieve the provided `MixpanelClient` instance.
