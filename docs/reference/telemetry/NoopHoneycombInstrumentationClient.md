---
order: 125
label: NoopHoneycombInstrumentationClient
toc:
    depth: 2-3
---

# NoopHoneycombInstrumentationClient

A fake implementation of [HoneycombInstrumentationClient](../telemetry/HoneycombInstrumentationClient.md) for use in non-standard contexts such as unit tests and Storybook.

## Usage

```ts
import { NoopHoneycombInstrumentationClient } from "@workleap/telemetry/react";

const client = new NoopHoneycombInstrumentationClient();
```


