---
order: 145
label: NoopLogRocketInstrumentationClient
toc:
    depth: 2-3
---

# NoopLogRocketInstrumentationClient

A fake implementation of [LogRocketInstrumentationClient](../telemetry/LogRocketInstrumentationClient.md) for use in non-standard contexts such as unit tests and Storybook.

## Usage

```ts
import { NoopLogRocketInstrumentationClient } from "@workleap/telemetry/react";

const client = new NoopLogRocketInstrumentationClient();
```
