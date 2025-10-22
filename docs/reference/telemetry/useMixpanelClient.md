---
order: 101
label: useMixpanelClient
toc:
    depth: 2-3
---

# useMixpanelClient

Retrieve a `MixpanelClient` instance.

## Reference

```ts
const client = useMixpanelClient(options?: { dontThrowOnUndefined? });
```

### Parameters

- `options`: An optional object literal of options:
    - `dontThrowOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

### Returns

A [MixpanelClient](./MixpanelClient.md) instance.

## Usage

```ts !#3
import { useMixpanelClient } from "@workleap/telemetry/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```
