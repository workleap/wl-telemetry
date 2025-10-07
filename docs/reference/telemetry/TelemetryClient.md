---
order: 190
label: TelemetryClient
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

- `logRocketClient`: An optional [LogRocketInstrumentationClient](./LogRocketInstrumentationClient.md) instance.
- `honeycombClient`: An optional [HoneycombInstrumentationClient](./HoneycombInstrumentationClient.md) instance.
- `mixpanelClient`: An optional [MixpanelClient](./MixpanelClient.md) instance.

### Getters

- `logRocketClient`: Return the [LogRocketInstrumentationClient](./LogRocketInstrumentationClient.md) instance.
- `honeycombClient`: Return the [HoneycombInstrumentationClient](./HoneycombInstrumentationClient.md) instance.
- `mixpanelClient`: Return the [MixpanelClient](./MixpanelClient.md) instance.

## Usage

### LogRocket instrumentation client

```ts !#5-7
import { useTelemetryClient } from "@workleap/telemetry/react";

const client = useTelemetryClient();

client.logRocket.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```

### Honeycomb instrumentation client

```ts !#5-7
import { useTelemetryClient } from "@workleap/telemetry/react";

const client = useTelemetryClient();

client.honeycomb.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```

### Mixpanel client

```ts !#5-7
import { useTelemetryClient } from "@workleap/telemetry/react";

const client = useTelemetryClient();

client.mixpanel.setGlobalEventProperties({
    "User Id": "123"
});
```
