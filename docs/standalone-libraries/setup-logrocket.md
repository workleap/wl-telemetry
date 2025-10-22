---
order: 100
label: Setup LogRocket
---

# Setup LogRocket

!!!warning
Prefer using the [@workleap/telemetry](../introduction/getting-started.md) umbrella package over this standalone library.
!!!

While we recommend using the `@workleap/telemetry` umbrella package, Workleap's LogRocket instrumentation can also be used as a standalone [@worleap/logrocket](https://www.npmjs.com/package/@workleap/logrocket) package.

To set it up, follow these steps :point_down:

## Install the packages

First, open a terminal at the root of the application and install the following packages:

```bash
pnpm add @workleap/logrocket logrocket
```

## Register instrumentation

Then, update the application bootstrapping code to register LogRocket instrumentation using the [registerLogRocketInstrumentation](#registerlogrocketinstrumentation) function and forward the client using a React context provider:

```tsx !#6-8,14,16 index.tsx
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

## Identify a user

Most applications need to identify the current user environment. To help with that, [LogRocketInstrumentationClient](#logrocketinstrumentationclient) expose the [createWorkleapPlatformDefaultUserTraits](#methods) method. When used with [LogRocket.identify](https://docs.logrocket.com/reference/identify), it provides all the tools to identify a  user with the key information that we track at Workleap:

```tsx index.tsx
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

```ts !#6-13,15
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

## Get the session URL

Every session replay is associated with a unique URL. To register a callback receiving the session replay once it's available, use the [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) function: 

```ts !#3-5 index.tsx
import LogRocket from "logrocket";

LogRocket.getSessionUrl(url => {
    console.log(url);
});
```

## Try it :rocket:

Start the application in a development environment using the dev script. Render a page, then navigate to your [LogRocket](https://app.logrocket.com/) instance. Go to "Session Replay" page, you should see a new session appear.

You can try filtering the session list using different user traits, such as:

- `User Id`
- `Organization Id`
- `Is Admin`

### Troubleshoot issues

If you are experiencing issues with this guide:

- Set the [verbose](#verbose-mode) predefined option to `true`.
- Open the [DevTools](https://developer.chrome.com/docs/devtools/) console and look for logs starting with `[logrocket]`.
- Refer to the sample on [GitHub](https://github.com/workleap/wl-telemetry/tree/main/samples/all-platforms).

## Reference

### registerLogRocketInstrumentation

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

#### Parameters

- `appId`: The LogRocket application id.
- `options`: An optional object literal of predefined options.
    - `rootHostname`: A [root hostname](https://docs.logrocket.com/reference/roothostname) to track sessions across subdomains.
    - `privateFieldNames`: Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.
    - `privateQueryParameterNames`: Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.
    - `telemetryContext`: A `TelemetryContext` instance containing the telemetry correlation ids to attach to LogRocket session replays. Starting with version `2.0`, if no telemetry context is provided, the correlation ids will not be attached to LogRocket session replays.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An array of logger instances that will output messages.
    - `transformers`: An array of transformer functions to update the default LogRocket options.

#### Returns

A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

#### Set a root hostname

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    rootHostname: "an-host.com"
});
```

#### Remove custom private fields

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    privateFieldNames: ["a-custom-field"]
});
```

To view the default private fields, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

#### Remove custom query parameters

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    privateQueryParameterNames: ["a-custom-param"]
});
```

To view the default private query parameters, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

#### Use a telemetry context

```ts !#3,6
import { registerLogRocketInstrumentation, createTelemetryContext } from "@workleap/logrocket/react";

const telemetryContext = createTelemetryContext();

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext
});
```

#### Verbose mode

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    verbose: true
});
```

#### Use loggers

```ts !#5
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = registerLogRocketInstrumentation("my-app-id", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

#### Use transformer functions

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

### LogRocketInstrumentationClient

A lightweight client providing access to LogRocket instrumentation utilities.

```ts
const client = new LogRocketInstrumentationClientImpl(telemetryContext?)
```

#### Parameters

- `telemetryContext`: An optional `TelemetryContext` instance.

#### Methods

- `createWorkleapPlatformDefaultUserTraits(identification)`: Creates an object containing the default user traits used to identify a web user for the Workleap platform.
- `registerGetSessionUrlListener(listener)`: Registers a listener that receives the session replay URL as a parameter once it becomes available. Host applications should use [LogRocket.getSessionURL](https://docs.logrocket.com/reference/get-session-url) instead of this method.

#### Get default user traits for the Workleap platform

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

#### Send additional traits

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

#### Register a session URL listener

```ts !#6-8
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";
import LogRocket from "logrocket";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

### LogRocketInstrumentationProvider

React provider to share a [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance with the application code.

```tsx
<LogRocketInstrumentationProvider client={client}>
    <App />
</LogRocketInstrumentationProvider>
```

#### Properties

- `client`: A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

#### Provide a client instance

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

#### Retrieve a client instance

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

### NoopLogRocketInstrumentationClient

A fake implementation of [NoopLogRocketInstrumentationClient](#logrocketinstrumentationclient) for use in non-standard contexts such as unit tests and Storybook.

```ts
import { NoopLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = new NoopLogRocketInstrumentationClient();
```

### LogRocketInstrumentationProvider

React provider to share a `LogRocketInstrumentationProvider` instance with the application code.

```tsx
<LogRocketInstrumentationProvider client={client}>
    <App />
</LogRocketInstrumentationProvider>
```

#### Properties

- `client`: A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

#### Provide a client instance

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

#### Retrieve a client instance

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

const traits = client.createWorkleapPlatformDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});
```

### useLogRocketInstrumentationClient

Retrieve a `LogRocketInstrumentationClient` instance.

```ts
const client = useLogRocketInstrumentationClient(options?: { dontThrowOnUndefined? })
```

#### Parameters

- `options`: An optional object literal of options:
    - `dontThrowOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

#### Returns

A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

#### Usage

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

const traits = client.createWorkleapPlatformDefaultUserTraits({
    userId: "6a5e6b06-0cac-44ee-8d2b-00b9419e7da9",
    organizationId: "e6bb30f8-0a00-4928-8943-1630895a3f14",
    organizationName: "Acme",
    isMigratedToWorkleap: true,
    isOrganizationCreator: false,
    isAdmin: false
});
```

### useLogRocketInstrumentationClient

Retrieve a [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

```ts
const client = useLogRocketInstrumentationClient();
```

#### Parameters

None

#### Returns

A [LogRocketInstrumentationClient](#logrocketinstrumentationclient) instance.

#### Usage

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

### createTelemetryContext

Creates a `TelemetryContext` instance containing the telemetry correlation ids.

```ts
const telemetryContext = createTelemetryContext(options?: { identityCookieExpiration?, identityCookieDomain?, verbose?, loggers? });
```

#### Parameters

- `options`: An optional object literal of options:
    - `identityCookieExpiration`: The expiration date of the `wl-identity` cookie if the cookie hasn't been already written. The default value is 365 days.
    - `identityCookieDomain`: The domain of the `wl-identity` cookie if the cookie hasn't been already written. The default value is `*.workleap`
    - `verbose`: If no loggers are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `Logger` instances.

#### Returns

A `TelemetryContext` instance.

#### Create a telemetry context

```ts !#3
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext();
```

#### Set a custom cookie expiration

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext({
    identityCookieExpiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
});
```

#### Set a custom cookie domain

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext({
    identityCookieDomain: ".contso.com";
});
```

#### Verbose mode

```ts !#4
import { createTelemetryContext } from "@workleap/logrocket/react";

const context = createTelemetryContext({
    verbose: true
});
```

#### Loggers

```ts !#5
import { createTelemetryContext, LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const context = createTelemetryContext({
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```




