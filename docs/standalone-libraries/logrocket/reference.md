---
order: 90
label: Reference
title: Reference - LogRocket
toc:
    depth: 2-3
---

# Reference

## `registerLogRocketInstrumentation`

Initializes [LogRocket](https://logrocket.com/) instrumentation with Workleap's default settings.

```ts
const client = registerLogRocketInstrumentation(appId, options?: { 
    rootHostname?,
    privateFieldNames?,
    privateQueryParameterNames?,
    telemetryContext?,
    verbose?,
    loggers?,
    transformers?
})
```

### Parameters

- `appId`: The LogRocket application id.
- `options`: An optional object literal of predefined options.
    - `rootHostname`: A [root hostname](https://docs.logrocket.com/reference/roothostname) to track sessions across subdomains.
    - `privateFieldNames`: Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.
    - `privateQueryParameterNames`: Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.
    - `telemetryContext`: A `TelemetryContext` instance containing the telemetry correlation ids to attach to LogRocket session replays.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An array of logger instances that will output messages.
    - `transformers`: An array of transformer functions to update the default LogRocket options.

### Returns

A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

### Set a root hostname

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    rootHostname: "an-host.com"
});
```

### Remove custom private fields

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    privateFieldNames: ["a-custom-field"]
});
```

To view the default private fields, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### Remove custom query parameters

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    privateQueryParameterNames: ["a-custom-param"]
});
```

To view the default private query parameters, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### Use a telemetry context

```ts !#3,6
import { registerLogRocketInstrumentation, createTelemetryContext } from "@workleap/logrocket/react";

const telemetryContext = createTelemetryContext();

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext
});
```

### Verbose mode

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    verbose: true
});
```

### Use loggers

```ts !#5
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = registerLogRocketInstrumentation("my-app-id", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

### Use transformer functions

The predefined options are useful to quickly customize the default configuration of the [LogRocket SDK](https://docs.logrocket.com/reference/init), but only covers a subset of the options. If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the [registerLogRocketInstrumentation](#registerlogrocketinstrumentation) function. Remember, **no locked in** :heart::v:.

To view the default configuration of `registerLogRocketInstrumentation`, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

```ts !#3-8,11
import { registerLogRocketInstrumentation, type LogRocketSdkOptionsTransformer } from "@workleap/logrocket/react";

const disableConsoleLogging: LogRocketSdkOptionsTransformer = config => {
    config.console = ...(config.console || {});
    config.console.isEnabled = false;

    return config;
};

const client = registerLogRocketInstrumentation("my-app-id", {
    transformers: [disableConsoleLogging]
});
```

Generic transformers can use the `context` argument to gather additional information about their execution context:

```ts !#4,8 transformer.ts
import type { LogRocketSdkOptionsTransformer } from "@workleap/logrocket/react";

const disableConsoleLogging: LogRocketSdkOptionsTransformer = (config, context) => {
    if (!context.verbose) {
        config.console = ...(config.console || {});
        config.shouldDebugLog = false;

        context.logger.debug("Disabling LogRocket SDK debug logs.");
    }

    return config;
}
```

## `LogRocketInstrumentationClient`

A lightweight client providing access to LogRocket instrumentation utilities.

```ts
const client = new LogRocketInstrumentationClientImpl(telemetryContext?)
```

### Parameters

- `telemetryContext`: An optional `TelemetryContext` instance.

### Methods

- `createWorkleapPlatformDefaultUserTraits(identification)`: Creates an object containing the default user traits used to identify a web user for the Workleap platform.
- `createShareGateDefaultUserTraits(identification)`: Creates an object containing the default user traits used to identify a web user for ShareGate.
- `registerGetSessionUrlListener(listener)`: Registers a listener that receives the session replay URL as a parameter once it becomes available. Host applications should use [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) instead of this method.

### Get default user traits for the Workleap platform

```ts !#6-13
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

Logrocket.identify(traits.userId, traits);
```

### Get default user traits for ShareGate

```ts !#6-11
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

const traits = client.createShareGateDefaultUserTraits({
    shareGateAccountId: "cd7fb5ca-f13d-420f-9a87-637b3419d242",
    microsoftUserId: "e9bb1688-a68b-4235-b514-95a59a7bf8bc",
    microsoftTenantId: "86bea6e5-5dbb-43c9-93a4-b10bf91cc6db",
    workspaceId: "225e6494-c008-4086-ac80-3770aa47085b"
});

Logrocket.identify(traits.shareGateAccountId, traits);
```

### Send additional traits

```ts !#15
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

const allTraits = {
    ...client.createWorkleapPlatformDefaultUserTraits({
        userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
        organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
        organizationName: "Acme",
        isMigratedToWorkleap: true,
        isOrganizationCreator: false,
        isAdmin: false
    }),
    "Additional Trait": "Trait Value"
};

Logrocket.identify(allTraits.userId, allTraits);
```

### Register a session URL listener

```ts !#6-8
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

## `LogRocketInstrumentationProvider`

React provider to share a [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance with the application code.

```tsx
<LogRocketInstrumentationProvider client={client}>
    <App />
</LogRocketInstrumentationProvider>
```

### Properties

- `client`: A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

### Provide a client instance

```tsx !#10-12
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider } from "@workleap/logrocket/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id");

const root = createRoot(document.getElementById("root"));

root.render(
    <LogRocketInstrumentationProvider client={client}>
        <App />
    </LogRocketInstrumentationProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

## `NoopLogRocketInstrumentationClient`

A fake implementation of [NoopLogRocketInstrumentationClient](#logrocketinstrumentationclient) for use in non-standard contexts such as unit tests and Storybook.

```ts
import { NoopLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = new NoopLogRocketInstrumentationClient();
```

## `LogRocketInstrumentationProvider`

React provider to share a `LogRocketInstrumentationProvider` instance with the application code.

```tsx
<LogRocketInstrumentationProvider client={client}>
    <App />
</LogRocketInstrumentationProvider>
```

### Properties

- `client`: A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

### Provide a client instance

```tsx !#12-14
import { registerLogRocketInstrumentation, LogRocketInstrumentationProvider } from "@workleap/logrocket/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerLogRocketInstrumentation("my-app-id", {
    rootHostname: "an-host.com"
});

const root = createRoot(document.getElementById("root"));

root.render(
    <LogRocketInstrumentationProvider client={client}>
        <App />
    </LogRocketInstrumentationProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

## `useLogRocketInstrumentationClient`

Retrieve a `LogRocketInstrumentationClient` instance.

```ts
const client = useLogRocketInstrumentationClient(options?: { throwOnUndefined? })
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

### Returns

A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

### Usage

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

## `useLogRocketInstrumentationClient`

Retrieve a [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

```ts
const client = useLogRocketInstrumentationClient();
```

### Parameters

None

### Returns

A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

### Usage

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

## `createTelemetryContext`

Creates a `TelemetryContext` instance containing the telemetry correlation ids.

```ts
const telemetryContext = createTelemetryContext(productFamily, options?: { identityCookieExpiration?, verbose?, loggers? });
```

### Parameters

- `productFamily`: `wlp` or `sg`.
- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The expiration date of the `wl-identity` cookie if the cookie hasn't been already written. The default value is 365 days.
    - `verbose`: If no loggers are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `Logger` instances.

### Returns

A `TelemetryContext` instance.

### Create a telemetry context

```ts !#3
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext("sg");
```

### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext("wlp", {
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext("sg", {
    verbose: true
});
```

### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext("wlp", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```
