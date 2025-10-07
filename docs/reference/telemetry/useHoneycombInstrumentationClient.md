---
order: 120
label: useHoneycombInstrumentationClient
toc:
    depth: 2-3
---

# useHoneycombInstrumentationClient

Retrieve a `HoneycombInstrumentationClient` instance.

## Reference

```ts
const client = useHoneycombInstrumentationClient();
```

### Parameters

None

### Returns

A [HoneycombInstrumentationClient](./HoneycombInstrumentationClient.md) instance.

## Usage

```ts !#3
import { useHoneycombInstrumentationClient } from "@workleap/telemetry/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```
