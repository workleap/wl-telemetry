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
const client = useHoneycombInstrumentationClient(options?: { dontThrowOnUndefined? });
```

### Parameters

- `options`: An optional object literal of options:
    - `dontThrowOnUndefined`: Whether or not an exception should be throw if a client instance hasn't been provided.

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
