---
order: 200
label: Migrate to v2.0
meta:
    title: Migrate to v2.0 - Common Room
---

# Migrate to v2.0

This major version introduces two changes: The `registerHoneycombInstrumentation` now returns a [client](../reference/CommonRoomInstrumentationClient.md) and the standalone `identify` function has been moved to the client.

## Breaking changes

### Removed

- Removed the `identify` standalone function, use [client.identify](../reference/CommonRoomInstrumentationClient.md#methods) instead.

## New React context

- A new [CommonRoomInstrumentationProvider](../reference/CommonRoomInstrumentationProvider.md) React context provider is available to forward a `CommonRoomInstrumentationClient` instance.
- A new [useCommnRoomInstrumentationClient](../reference/useCommonRoomInstrumentationClient.md) hook is available to retrieve the provided `CommonRoomInstrumentationClient` instance.

## Migrate to `2.0`

Before:

```tsx
import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

registerCommonRoomInstrumentation("my-site-id");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
```

Now:

```tsx !#6,12,14
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerCommonRoomInstrumentation("my-site-id");

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <CommonRoomInstrumentationProvider client={client}>
            <App />
        </CommonRoomInstrumentationProvider>
    </StrictMode>
);
```
