# NoopTelemetryClient

A fake implementation of [TelemetryClient](../telemetry/TelemetryClient.md) for use in non-standard contexts such as unit tests and Storybook.

## Usage

```ts
import { NoopTelemetryClient } from "@workleap/telemetry/react";

const client = new NoopTelemetryClient();
```
