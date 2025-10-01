---
order: 70
label: useTelemetryClient
meta:
    title: useTelemetryClient
toc:
    depth: 2-3
---

# useTelemetryClient

Retrieve a `TelemetryClient` instance.

## Reference

```ts
const client = useTelemetryClient();
```

### Parameters

None

### Returns

A [TelemetryClient](./TelemetryClient.md) instance.

## Usage

```ts !#3
import { useTelemetryClient } from "@workleap/telemetry/react";

const client = useTelemetryClient();

client.logRocket.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```
