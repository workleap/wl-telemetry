---
order: 100
label: initializeTelemetry
meta:
    title: initializeTelemetry
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
    - `logRocket`: An optional [LogRocket instrumentation registration options](https://workleap.github.io/wl-telemetry/logrocket/reference/registerlogrocketinstrumentation) object. If provided, LogRocket instrumentation is registered, if omitted, it is skipped.
    - `honeycomb`: An optional [Honeycomb instrumentation registration options](https://workleap.github.io/wl-telemetry/honeycomb/reference/registerhoneycombinstrumentation) object. If provided, Honeycomb instrumentation is registered, if omitted, it is skipped.
    - `mixpanel`: An optional [Mixpanel initialization options](https://workleap.github.io/wl-telemetry/mixpanel/reference/initializemixpanel/) object. If provided, Mixpanel is initialized, if omitted, it is skipped.
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
        serviceName: "all-platforms-sample",
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
        serviceName: "all-platforms-sample",
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
        serviceName: "all-platforms-sample",
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
        serviceName: "all-platforms-sample",
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


