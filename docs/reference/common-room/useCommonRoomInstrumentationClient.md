---
order: 70
label: useCommonRoomInstrumentationClient
toc:
    depth: 2-3
---

# useCommonRoomInstrumentationClient

Retrieve a `CommonRoomInstrumentationClient` instance.

## Reference

```ts
const client = useCommonRoomInstrumentationClient(options?: { throwOnUndefined? });
```

### Parameters

- `options`: An optional object literal of options:
    - `throwOnUndefined`: Whether or not an exception should be thrown if a client instance hasn't been provided.

### Returns

A [CommonRoomInstrumentationClient](./CommonRoomInstrumentationClient.md) instance.

## Usage

```ts !#3
import { useCommonRoomInstrumentationClient } from "@workleap/common-room/react";

const client = useCommonRoomInstrumentationClient();

client.identify("johndoe@contoso.com");
```
