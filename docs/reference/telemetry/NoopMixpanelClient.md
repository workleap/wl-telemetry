---
order: 101
label: NoopMixpanelClient
toc:
    depth: 2-3
---

# NoopMixpanelClient

A fake implementation of [NoopMixpanelClient](../telemetry/MixpanelClient.md) for use in non-standard contexts such as unit tests and Storybook.

## Usage

```ts
import { NoopMixpanelClient } from "@workleap/telemetry/react";

const client = new NoopMixpanelClient();
```
