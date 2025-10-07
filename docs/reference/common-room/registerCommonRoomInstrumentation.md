---
order: 100
label: registerCommonRoomInstrumentation
toc:
    depth: 2-3
---

# registerCommonRoomInstrumentation

Initialize [Common Room](https://www.commonroom.io/) instrumentation.

## Reference

```ts
const client = registerCommonRoomInstrumentation(siteId, options?: { onReady, verbose });
```

### Parameters

- `siteId`: The site id.
- `options`: An optional object literal of options:
    - `verbose`: If no `loggers` are configured, verbose mode will automatically send logs to the console. In some cases, enabling verbose mode also produces additional debug information.
    - `loggers`: An optional array of `RootLogger` instances.

### Returns

A [CommonRoomInstrumentationClient](./CommonRoomInstrumentationClient.md) instance.

## Usage

### Initialize with a site id

```ts !#3
import { registerCommonRoomInstrumentation } from "@workleap/common-room";

const client = registerCommonRoomInstrumentation("my-site-id");
```

### Verbose mode 

```ts !#4
import { registerCommonRoomInstrumentation } from "@workleap/common-room";

const client = registerCommonRoomInstrumentation("my-site-id", {
    verbose: true
});
```

### Loggers

```ts !#6
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { LogRocketLogger } from "@workleap/logrocket";
import { BrowserConsoleLogger, LogLevel } from "@workleap/logging";

const client = registerCommonRoomInstrumentation("my-site-id", {
    loggers: [new BrowserConsoleLogger(), new LogRocketLogger({ logLevel: LogLevel.information })]
});
```
