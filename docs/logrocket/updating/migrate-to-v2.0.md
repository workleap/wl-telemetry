---
order: 190
label: Migrate to v2.0
meta:
    title: Migrate to v2.0 - LogRocket
toc:
    depth: 2-3
---

# Migrate to v2.0

This major version introduces several important changes. `registerLogRocketInstrumentation` now returns a [client](../reference/LogRocketInstrumentationClient.md) instance. The standalone `createUserTraits` function has been moved to the client, telemetry correlation ids are no longuer implicitly added to session replays, and global variables for third-party integrations have been deprecated. To attach telemetry correlation ids to session replays, you must now provide a [TelemetryContext](../reference/createTelemetryContext.md#telemetrycontext) instance. Third-party libraries such as Squide and the Platform widgets should also be explicitly provided with the returned client instance to integrate with Workleap's LogRocket instrumentation.

## Breaking changes

### Removed

- Removed the `createUserTraits` standalone function, use [client.createWorkleapPlatformDefaultUserTraits](../reference/LogRocketInstrumentationClient.md#methods) instead.

### Deprecated

- The `window.__WLP_LOGROCKET_INSTRUMENTATION_IS_REGISTERED__` global variable have been deprecated. Instead, provide a [client](../reference/LogRocketInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__` global variable have been deprecated. Instead, provide a [client](../reference/LogRocketInstrumentationClient.md) instance to the third-party libraries.

### Others

- The `telemetryId` and `deviceId` correlation ids are no longer implicitly attached to LogRocket session replays. To attach these ids, provide a [TelemetryContext](../reference/createTelemetryContext.md#telemetrycontext) instance to the [registerLogRocketInstrumentation](../reference/registerLogRocketInstrumentation.md) function. You can create a `TelemetryContext` instance using the [createTelemetryContext](../reference/createTelemetryContext.md) utility function.
- If your application is a React application, you must now import everything from `@workleap/logrocket/react` rather than `@workleap/logrocket`.

## New React context

- A new [LogRocketInstrumentationClientProvider](../reference/LogRocketInstrumentationClientProvider.md) React context provider is available to forward a `LogRocketInstrumentatonClient` instance.
- A new [useLogRocketInstrumentationClient](../reference/useLogRocketInstrumentationClient.md) hook is available to retrieve the provided `LogRocketInstrumentatonClient` instance.

## Migrate to `2.0`

Before:

```tsx
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

```tsx !#6-8,14,16
import { registerLogRocketInstrumentation, LogRocketInstrumentationClientProvider, createTelemetryContext } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext: createTelemetryContext()
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <LogRocketInstrumentationClientProvider value={client}>
            <App />
        </LogRocketInstrumentationClientProvider>
    </StrictMode>
);
```



