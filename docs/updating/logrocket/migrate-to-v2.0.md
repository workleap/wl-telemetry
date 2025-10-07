---
order: 190
label: Migrate to v2.0
meta:
    title: Migrate to v2.0 - LogRocket
toc:
    depth: 2-3
---

# Migrate to v2.0

This major version introduces several important changes. `registerLogRocketInstrumentation` now returns a [client](../../reference/telemetry/LogRocketInstrumentationClient.md) instance. The standalone `createUserTraits` function has been moved to the client, telemetry correlation ids are no longer implicitly added to session replays, and global variables for third-party integrations have been deprecated. To attach telemetry correlation ids to session replays, you must now provide a [TelemetryContext](../../reference/telemetry/TelemetryContext.md) instance. Third-party libraries such as [Squide](https://workleap.github.io/wl-squide) and the [Platform widgets](https://dev.azure.com/workleap/WorkleapPlatform/_git/workleap-platform-widgets?path=/README.md) should also be explicitly provided with the returned client instance to integrate with Workleap's LogRocket instrumentation.

## Breaking changes

### Removed

- Removed the `createUserTraits` standalone function, use the client [createWorkleapPlatformDefaultUserTraits](../../reference/telemetry/LogRocketInstrumentationClient.md#methods) method instead.

### Deprecated

- The `window.__WLP_LOGROCKET_INSTRUMENTATION_IS_REGISTERED__` global variable have been deprecated. Instead, provide a [client](../../reference/telemetry/LogRocketInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__` global variable have been deprecated. Instead, provide a [client](../../reference/telemetry/LogRocketInstrumentationClient.md) instance to the third-party libraries.

### Others

- The `telemetryId` and `deviceId` correlation ids are no longer implicitly attached to LogRocket session replays. To attach these ids, provide a [TelemetryContext](../../reference/telemetry/TelemetryContext.md) instance to the [registerLogRocketInstrumentation](../../standalone-libraries/setup-logrocket.md) function. You can create a `TelemetryContext` instance using the [createTelemetryContext](../../standalone-libraries/setup-logrocket.md) utility function.
- If your application is a React application, you must now import everything from `@workleap/logrocket/react` rather than `@workleap/logrocket`.

### Update the initialization code

The [registerLogRocketInstrumentation](../../standalone-libraries/setup-logrocket.md) function now returns a [client](../../reference/telemetry/LogRocketInstrumentationClient.md) that must be forwarded to the [LogRocketInstrumentationProvider](../../standalone-libraries/setup-logrocket.md). In addition, a [TelemetryContext](../../reference/telemetry/TelemetryContext.md) instance must be manually provided to the registration function to ensure correlation ids continue being attached to LogRocket session replays.

Before:

```tsx index.ts
import { registerLogRocketInstrumentation } from "@workleap/logrocket";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerLogRocketInstrumentation("my-app-id");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

Now:

```tsx !#6-8,14,16 index.ts
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider, createTelemetryContext } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <LogRocketInstrumentationProvider client={client}>
            <App />
        </LogRocketInstrumentationProvider>
    </StrictMode>
);
```

### Replace `createUserTraits` with the client

The `createUserTraits` standalone function is not exported anymore. Use the client [createWorkleapPlatformDefaultUserTraits](../../reference/telemetry/LogRocketInstrumentationClient.md#methods) method instead.

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
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
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

## New React context

- A new [LogRocketInstrumentationProvider](../../standalone-libraries/setup-logrocket.md) React context provider is available to forward a `LogRocketInstrumentatonClient` instance.
- A new [useLogRocketInstrumentationClient](../../standalone-libraries/setup-logrocket.md) hook is available to retrieve the provided `LogRocketInstrumentatonClient` instance.



