---
order: 80
label: useMixpanelClient
meta:
    title: useMixpanelClient - Mixpanel
toc:
    depth: 2-3
---

# useMixpanelClient

Retrieve a `MixpanelClient` instance.

## Reference

```ts
const client = useMixpanelClient();
```

### Parameters

None

### Returns

A [MixpanelClient](./MixpanelClient.md) instance.

## Usage

```ts !#3
import { useMixpanelClient } from "@workleap/mixpanel/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```
