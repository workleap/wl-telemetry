---
order: 140
label: useMixpanelClient
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

A [MixpanelClient](../../mixpanel/reference/MixpanelClient.md) instance.

## Usage

```ts !#3
import { useMixpanelClient } from "@workleap/telemetry/react";

const client = useMixpanelClient();

client.setGlobalEventProperties({
    "User Id": "123"
});
```
