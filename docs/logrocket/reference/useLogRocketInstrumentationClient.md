---
order: 70
label: useLogRocketInstrumentationClient
meta:
    title: useLogRocketInstrumentationClient - LogRocket
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

A `LogRocketInstrumentationClient` instance.

## Usage

```tsx !#3
import { useLogRocketInstrumentationClient } from "@workleap/logrocket/react";

const client = useLogRocketInstrumentationClient();

client.registerGetSessionUrlListener(sessionUrl => {
    console.log(sessionUrl);
});
```
