---
order: 100
label: initializeMixpanel
meta:
    title: initializeMixpanel - Mixpanel
toc:
    depth: 2-3
---

# initializeMixpanel

Initialize [Mixpanel](https://mixpanel.com) with Workleap's default settings.

## Reference

```ts
const client = initializeMixpanel(productId, envOrTrackingApiBaseUrl, options?: { 
    trackingEndpoint?,
    telemetryContext?,
    logRocketInstrumentationClient?,
    verbose?,
    loggers?
});
```

### Parameters

- `productId`: The product id.
- `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
- `options`: An optional object literal of options:
    - `trackingEndpoint`: An optional tracking endpoint.
    - `telemetryContext`: A [TelemetryContext](./createTelemetryContext.md#telemetrycontext) instance containing the telemetry correlation ids to attach to Honeycomb traces. Starting with version `7.0`, if no telemetry context is provided, the correlation ids will not be attached to Honeycomb traces.
    - `logRocketInstrumentationClient`: A [LogRocketInstrumentationClient](../../logrocket/reference/LogRocketInstrumentationClient.md) instance to integrate Honeycomb traces with LogRocket session replays. Starting with version `7.0`, if no LogRocket instrumentation client is provided, the Honeycomb traces will not integrate with LogRocket session replays.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

A [MixpanelClient](./MixpanelClient.md) instance.

### Environments

Supported environments are:

- `production`
- `staging`
- `development`
- `local`
- `msw`

## Usage

### Initialize with a predefined environment

Mixpanel can be initialized for any of the following predefined environments:

- `production`
- `staging`
- `development`
- `local`
- `msw`

```ts !#3
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development");
```

### Initialize with a base url

```ts !#3
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "https://my-tracking-api");
```

### Use a custom tracking endpoint

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development", {
    trackingEndpoint: "custom/tracking/track"
});
```

### Initialize with a telemetry context

```ts !#6
import { initializeMixpanel, createTelemetryContext } from "@workleap/mixpanel/react";

const telemetryContext = createTelemetryContext();

const client = initializeMixpanel("wlp", "development", {
    telemetryContext
});
```

### Integrate with LogRocket

```ts !#4,7
import { initializeMixpanel } from "@workleap/mixpanel/react";
import { registerLogRocketInstrumentation } from "@workleap/logrocket/react";

const logRocketInstrumentationClient = registerLogRocketInstrumentation("my-app-id");

const client = initializeMixpanel("wlp", "development", {
    logRocketInstrumentationClient
});
```

### Verbose mode

```ts !#4
import { initializeMixpanel } from "@workleap/mixpanel/react";

const client = initializeMixpanel("wlp", "development", {
    verbose: true
});
```

### Loggers

```ts !#6
import { initializeMixpanel } from "@workleap/mixpanel/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = initializeMixpanel("wlp", "development", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```





