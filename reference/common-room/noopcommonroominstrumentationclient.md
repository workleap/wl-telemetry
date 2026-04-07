# NoopCommonRoomInstrumentationClient

A fake implementation of [CommonRoomInstrumentationClient](../common-room/CommonRoomInstrumentationClient.md) for use in non-standard contexts such as unit tests and Storybook.

## Usage

```ts
import { NoopCommonRoomInstrumentationClient } from "@workleap/common-room/react";

const client = new NoopCommonRoomInstrumentationClient();
```
