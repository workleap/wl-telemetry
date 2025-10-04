---
order: 100
label: registerLogRocketInstrumentation
meta:
    title: registerLogRocketInstrumentation - LogRocket
toc:
    depth: 2-3
---

# registerLogRocketInstrumentation

Initializes [LogRocket](https://logrocket.com/) instrumentation with Workleap's default settings.

## Reference

```ts
const client = registerLogRocketInstrumentation(appId, options?: { rootHostname, privateFieldNames, privateQueryParameterNames })
```

### Parameters

- `appId`: The LogRocket application id.
- `options`: An optional object literal of [predefined options](#predefined-options).

### Returns

A [LogRocketInstrumentationClient](./LogRocketInstrumentationClient.md) instance.

## Predefined options

The `registerLogRocketInstrumentation(appId, options?: {})` function also accepts a few predefined options 👇

### `rootHostname`

- **Type**: `string`
- **Default**: `workleap.com`

A [root hostname](https://docs.logrocket.com/reference/roothostname) to track sessions across subdomains.

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    rootHostname: "an-host.com"
});
```

### `privateFieldNames`

- **Type**: `string[]`
- **Default**:  `undefined`

Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    privateFieldNames: ["a-custom-field"]
});
```

To view the default private fields, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### `privateQueryParameterNames`

- **Type**: `string[]`
- **Default**:  `undefined`

Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    privateQueryParameterNames: ["a-custom-param"]
});
```

To view the default private query parameters, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### `telemetryContext`

- **Type**: `TelemetryContext`
- **Default**: `undefined`

A [TelemetryContext](../../introduction/reference/TelemetryContext.md) instance containing the telemetry correlation ids to attach to LogRocket session replays. Starting with version `2.0`, if no telemetry context is provided, the correlation ids will not be attached to LogRocket session replays.

```ts !#3,6
import { registerLogRocketInstrumentation, createTelemetryContext } from "@workleap/logrocket/react";

const telemetryContext = createTelemetryContext();

const client = registerLogRocketInstrumentation("my-app-id", {
    telemetryContext
});
```

### `verbose`

- **Type**: `boolean`
- **Default**: `false`

If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.

```ts !#4
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const client = registerLogRocketInstrumentation("my-app-id", {
    verbose: true
});
```

### `loggers`

- **Type**: `RootLogger[]`
- **Default**: `undefined`

The logger instances that will output messages.

```ts !#5
import { registerLogRocketInstrumentation, LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = registerLogRocketInstrumentation("my-app-id", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```

## Configuration transformers

!!!warning
We do not guarantee that your configuration transformers won't break after an update. It's your responsibility to keep them up to date with new releases.
!!!

The [predefined options](#predefined-options) are useful to quickly customize the default configuration of the [LogRocket SDK](https://docs.logrocket.com/reference/init), but only covers a subset of the options. If you need full control over the configuration, you can provide configuration transformer functions through the `transformers` option of the `registerLogRocketInstrumentation` function. Remember, **no locked in** :heart::v:.

To view the default configuration of `registerLogRocketInstrumentation`, have a look at the [registerLogRocketInstrumentation.ts](https://github.com/workleap/wl-telemetry/blob/main/packages/logrocket/src/registerLogRocketInstrumentation.ts) file on GitHub.

### `transformers`

- **Type**: `((options: LogRocketSdkOptions, context: LogRocketSdkOptionsTransformer) => LogRocketSdkOptions)[]`
- **Default**: `[]`

```ts
transformer(options: LogRocketSdkOptions, context: LogRocketSdkOptionsTransformer) => LogRocketSdkOptions;
```

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

### Execution context

Generic transformers can use the `context` argument to gather additional information about their execution context:

```ts !#4,8 transformer.js
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

- `verbose`: `boolean`
- `logger`: `Logger`
