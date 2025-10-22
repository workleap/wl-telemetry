---
order: 140
label: useLogRocketInstrumentationClient
toc:
    depth: 2-3
---

# useLogRocketInstrumentationClient

Retrieve a `LogRocketInstrumentationClient` instance.

## Reference

```ts
const client = useLogRocketInstrumentationClient(options?: { throwOnUndefined? });
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

### Returns

A [LogRocketInstrumentationClient](./LogRocketInstrumentationClient.md) instance.

## Usage

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```
