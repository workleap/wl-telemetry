---
order: 70
label: useCommonRoomInstrumentationClient
meta:
    title: useCommonRoomInstrumentationClient - Common Room
toc:
    depth: 2-3
---

# useCommonRoomInstrumentationClient

Retrieve a `CommonRoomInstrumentationClient` instance.

## Reference

```ts
const client = useCommonRoomInstrumentationClient();
```

### Parameters

None

### Returns

A [CommonRoomInstrumentationClient](./CommonRoomInstrumentationClient.md) instance.

## Usage

```ts !#3
import { useCommonRoomInstrumentationClient } from "@workleap/common-room/react";

const client = useCommonRoomInstrumentationClient();

client.identify("johndoe@contoso.com");
```
