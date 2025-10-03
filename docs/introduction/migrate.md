---
order: 0
label: Migrate
meta:
    title: Migrate - Introduction
---

# Migrate

## Standalone libraries

To migrate standalone telemetry libraries, follow the migration guide for each library:

| Name | Minimum version | Migration guide |
| --- | --- | --- |
| ![](../static/logos/logrocket.svg){ class="h-5 w-5 mr-2 -mt-1" }[LogRocket](https://logrocket.com/) | ≥ v1.0.0 | [Migrate to v2.0](../logrocket/updating/migrate-to-v2.0.md) |
| ![](../static/logos/honeycomb.svg){ class="h-5 w-5 mr-2 -mt-1" }[Honeycomb](https://www.honeycomb.io/) | ≥ v6.0.0 | [Migrate to v7.0](../honeycomb/updating/migrate-to-v7.0.md) |
| ![](../static/logos/mixpanel.svg){ class="h-5 w-5 mr-2 -mt-1" }[Mixpanel](https://mixpanel.com/) | ≥ v2.0.0 | [Migration to v3.0](../mixpanel/updating/migrate-to-v3.0.md) 

## Umbrella package

To migrate to the new [@workleap/telemetry](https://www.npmjs.com/package/@workleap/telemetry) umbrella package, follow these steps :point_down:

### Remove the standalone library packages

Since the `@workleap/telemetry` package declares dependencies on the standalone telemetry libraries, host applications no longer need to declare direct dependencies on those packages.

To get started, open a terminal at the root of your application and install the telemetry umbrella package. (If your application uses other packages for additional functionality, such as `LogRocketLogger`, you may still want to keep those installed separately.)

```bash
pnpm remove @workleap/logrocket @workleap/honeycomb @workleap/mixpanel
```

Then, install the `@workleap/telemetry` package:

```bash
pnpm add @workleap/telemetry logrocket
```

### Update the initialization code

Then, update the initialize code to use the [initializeTelemetry](./reference/initializeTelemetry.md) function instead of standalone registration/initialization functions:

Before:

```tsx index.tsx
import { createRoot } from "react-dom/client";
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { initializeMixpanel } from "@workleap/mixpanel";

registerLogRocketInstrumentation("my-app-id");

registerHoneycombInstrumentation("sample", "my-app-id", [/.+/g,], {
    proxy: "https://sample-proxy",
});

initializeMixpanel("wlp", "development");

const root = createRoot(document.getElementById("root")!);

root.render(
    <App />
);
```

Now:

```tsx !#4-20,25,27 index.tsx
import { createRoot } from "react-dom/client";
import { initializeTelemetry, TelemetryProvider } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <TelemetryProvider client={client}>
        <App />
    </TelemetryProvider>
);
```

### Replace `createUserTraits` with the client

The `createUserTraits` standalone function is not exported anymore. Use the client [createWorkleapPlatformDefaultUserTraits](../logrocket/reference/LogRocketInstrumentationClient.md#methods) method instead.

Before:

```ts
import { createDefaultUserTraits } from "@workleap/logrocket";
import LogRocket from "logrocket";

const traits = createDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});

LogRocket.identify(traits.userId, traits);
```

Now:

```ts !#4,6-13
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

const traits = client.createWorkleapPlatformDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});

LogRocket.identify(traits.userId, traits);
```

### Replace `setGlobalSpanAttribute` and `setGlobalSpanAttributes` with the client

The `setGlobalSpanAttribute` and `setGlobalSpanAttributes` standalone functions are not exported anymore. Use the client [setGlobalSpanAttribute](../honeycomb/reference/HoneycombInstrumentationClient.md#methods) and [setGlobalSpanAttributes](../honeycomb/reference/HoneycombInstrumentationClient.md#methods) methods instead.

Before:

```ts
import { setGlobalSpanAttributes } from "@workleap/honeycomb";

setGlobalSpanAttribute("app.user_id", "123");
```

Now:

```ts !#3,5,7-9
import { useHoneycombInstrumentationClient } from "@workleap/telemetry/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttribute("app.user_id", "123");

client.setGlobalSpanAttributes({
    "app.user_id": "123"
})
```

### Replace `setSuperProperty` and `setSuperProperties` with the client

The `setSuperProperty` and `setSuperProperties` standalone functions are not exported anymore. Use the client [setGlobalEventProperty](../mixpanel/reference/MixpanelClient.md#methods) and [setGlobalEventProperties](../mixpanel/reference/MixpanelClient.md#methods) methods instead.

Before:

```ts
import { setSuperProperties } from "@workleap/mixpanel";

setSuperProperties({
    "User Id": "123" 
});
```

Now:

```ts !#3,5,7-9
import { useMixpanelClient } from "@workleap/telemetry/react";

const client = useMixpanelClient();

client.setGlobalEventProperty("User Id", "123");

client.setGlobalEventProperties({
    "User Id": "123" 
});
```

### Replace `createTrackingFunction` with the client

The `createTrackingFunction` standalone function is not exported anymore. Use the client [createTrackingFunction](../mixpanel/reference/MixpanelClient.md#methods) method instead.

Before:

```ts
import { createTrackingFunction } from "@workleap/mixpanel";

const track = createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```

Now:

```ts !#3,5,7
import { useMixpanelClient } from "@workleap/telemetry/react";

const client = useMixpanelClient();

const track = client.createTrackingFunction();

track("ButtonClicked", { "Trigger": "ChangePlan", "Location": "Header" });
```
