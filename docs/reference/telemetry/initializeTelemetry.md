---
order: 200
label: initializeTelemetry
toc:
    depth: 2-3
---

# initializeTelemetry

## Reference

```ts
const client = initializeTelemetry(options?: { logRocket?, honeycomb?, mixpanel?, verbose?, loggers? });
```

### Parameters

- `options`: An optional object literal of options:
    - `logRocket`: An optional LogRocket instrumentation registration options object. If provided, LogRocket instrumentation is registered, if omitted, it is skipped.
        - `appId`: The LogRocket application id.
        - `options`: An optional object literal of options:
            - `rootHostname`: A [root hostname](https://docs.logrocket.com/reference/roothostname) to track sessions across subdomains.
            - `privateFieldNames`: Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.
            - `privateQueryParameterNames`: Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.
    - `honeycomb`: An optional Honeycomb instrumentation registration options object. If provided, Honeycomb instrumentation is registered, if omitted, it is skipped.
        - `namespace`: The service namespace. Will be added to traces as a `service.namespace` custom attribute.
        - `serviceName`: Honeycomb application service name.
        - `apiServiceUrls`: A `RegExp` or `string` that matches the URLs of the application's backend services. If unsure, start with the temporary regex `/.+/g,` to match all URLs.
        - `options`: An optional object literal of options:
            - `proxy`:
            - `apiKey`:
            - `instrumentations`:
            - `spanProcessors`:
            - `fetchInstrumentation`:
            - `documentLoadInstrumentation`:
            - `xmlHttpRequestInstrumentation`:
            - `userInteractionInstrumentation`:
    - `mixpanel`: An optional Mixpanel initialization options object. If provided, Mixpanel is initialized, if omitted, it is skipped.
        - `productId`: The product id.
        - `envOrTrackingApiBaseUrl`: The environment to get the navigation url from or a base URL.
        - `options`: An optional object literal of options:
            - `trackingEndpoint`: An optional tracking endpoint.
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

A [TelemetryClient](./TelemetryClient.md) instance.

## Usage

### Initialize all telemetry platforms

```ts !#4-18
import { initializeTelemetry } from "@workleap/telemetry/react";

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
```

### Initialize LogRocket

```ts !#4-6
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    }
});
```

### Initialize Honeycomb

```ts !#4-11
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    honeycomb: {
        namespace: "sample",
        serviceName: "my-app-name",
        apiServiceUrls: [/.+/g],
        options: {
            proxy: "https://sample-proxy"
        }
    }
});
```

### Initialize Mixpanel

```ts !#4-7
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});
```

### Verbose mode

```ts !#19
import { initializeTelemetry } from "@workleap/telemetry/react";

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
    },
    verbose: true
});
```

### Loggers

```ts !#21
import { initializeTelemetry } from "@workleap/telemetry/react";
import { LogRocketLogger } from "@workleap/logrocket/react";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

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
    },
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```


