---
order: 190
label: Migrate to v7.0
meta:
    title: Migrate to v7.0 - Honeycomb
---

# Migrate to v7.0

This major version introduces several important changes. `registerHoneycombInstrumentation` now returns a [client](../reference/HoneycombInstrumentationClient.md) instance. The standalone `setGlobalSpanAttribute` and `setGlobalSpanAttributes` functions has been moved to the client, telemetry correlation ids are no longuer implicitly added to traces, and global variables for third-party integrations have been deprecated. To attach telemetry correlation ids to traces, you must now provide a [TelemetryContext](../reference/createTelemetryContext.md#telemetrycontext) instance. Third-party libraries such as Squide and the Platform widgets should also be explicitly provided with the returned client instance to integrate with Workleap's Honeycomb instrumentation.

## Breaking changes

### Removed

- Removed the `setGlobalSpanAttribute` and `setGlobalSpanAttributes` standalone functions, use [client.setGlobalSpanAttribute](../reference/HoneycombInstrumentationClient.md#methods) and [client.setGlobalSpanAttributes](../reference/HoneycombInstrumentationClient.md#methods) instead.

### Deprecated

- The `window.__WLP_HONEYCOMB_INSTRUMENTATION_IS_REGISTERED__` global variable have been deprecated. Instead, provide a [client](../reference/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK__` global variable have been deprecated. Instead, provide a [client](../reference/HoneycombInstrumentationClient.md) instance to the third-party libraries.
- The `window.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK_AT_START__` global variable have been deprecated. Instead, provide a [client](../reference/HoneycombInstrumentationClient.md) instance to the third-party libraries.

### Others

- The `telemetryId` and `deviceId` correlation ids are no longer implicitly attached to Honeycomb traces. To attach these ids, provide a [TelemetryContext](../reference/createTelemetryContext.md#telemetrycontext) instance to the [registerHoneycombInstrumentation](../reference/registerHoneycombInstrumentation.md) function. You can create a `TelemetryContext` instance using the [createTelemetryContext](../reference/createTelemetryContext.md) utility function.
- If your application is a React application, you must now import everything from `@workleap/honeycomb/react` rather than `@workleap/honeycomb`.

## New React context

- A new [HoneycombInstrumentationClientProvider](../reference/HoneycombInstrumentationClientProvider.md) React context provider is available to forward a `HoneycombInstrumentationClient` instance.
- A new [useHoneycombInstrumentationClient](../reference/useHoneycombInstrumentationClient.md) hook is available to retrieve the provided `HoneycombInstrumentatonClient` instance.

## Migrate to `7.0`

Before:

```tsx
import { registerHoneycombInstrumentation } from "@workleap/honeycomb";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const honeycombInstrumentationClient = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

Now:

```tsx !#7,11,12,19,21
import { registerHoneycombInstrumentation, HoneycombInstrumentationClientProvider, createTelemetryContext } from "@workleap/honeycomb/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("app-id");

const honeycombInstrumentationClient = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy",
    telemetryContext: createTelemetryContext(),
    logRocketInstrumentationClient
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <HoneycombInstrumentationClientProvider value={client}>
            <App />
        </HoneycombInstrumentationClientProvider>
    </StrictMode>
);
```
