---
order: 90
label: TelemetryClient
meta:
    title: TelemetryClient
toc:
    depth: 2-3
---

# TelemetryClient

!!!warning
Don't create your own instance of `TelemetryClient`, use the `initializeTelemetry` function instead.
!!!

## Reference

```ts
const client = new TelemetryClient(logRocketClient?, honeycombClient?, mixpanelClient?);
```

### Parameters

- `logRocketClient`: An optional [LogRocketInstrumentationClient](../../logrocket/reference/LogRocketInstrumentationClient.md) instance.
- `honeycombClient`: An optional [HoneycombInstrumentationClient](../../honeycomb/reference/HoneycombInstrumentationClient.md) instance.
- `mixpanelClient`: An optional [MixpanelClient](../../mixpanel/reference/MixpanelClient.md) instance.

### Getters

- `logRocketClient`: Retrieve the LogRocket instrumentation client.
- `honeycombClient`: Retrieve the Honeycomb instrumentation client.
- `mixpanelClient`: Retrieve the Mixpanel client.

## Usage

### LogRocket instrumentation client

```ts !#9-11
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    logRocket: {
        appId: "my-app-id"
    }
});

client.logRocket.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

### Honeycomb instrumentation client

```ts !#14-16
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

client.honeycomb.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

### Mixpanel client

```ts !#10-12
import { initializeTelemetry } from "@workleap/telemetry/react";

const client = initializeTelemetry({
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "development"
    }
});

client.mixpanel.setGlobalEventProperties({
    "User Id": "123"
});
```
