---
order: 60
label: useLogRocketInstrumentationClient
meta:
    title: useLogRocketInstrumentationClient
toc:
    depth: 2-3
---

# useLogRocketInstrumentationClient

Retrieve a `LogRocketInstrumentationClient` instance.

## Reference

```ts
const client = useLogRocketInstrumentationClient();
```

### Parameters

None

### Returns

A [LogRocketInstrumentationClient](../../logrocket/reference/LogRocketInstrumentationClient.md) instance.

## Usage

```ts !#3
import { useLogRocketInstrumentationClient } from "@workleap/telemetry/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```
