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

- `logRocketClient`: Return the LogRocket instrumentation client.
- `honeycombClient`: Return the Honeycomb instrumentation client.
- `mixpanelClient`: Return the Mixpanel client.

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
