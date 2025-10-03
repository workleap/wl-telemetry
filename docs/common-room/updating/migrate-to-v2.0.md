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

- Removed the `identify` standalone function, use the client [identify](../reference/CommonRoomInstrumentationClient.md#methods) method instead.

### Update the initialization code

The [registerCommonRoomInstrumentation](../reference/registerCommonRoomInstrumentation.md) function now returns a [client](../reference/CommonRoomInstrumentationClient.md) that must be forwarded using [CommonRoomInstrumentationProvider](../reference/CommonRoomInstrumentationProvider.md).

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

### Replace `identify` with the client

The `identify` standalone function is not exported anymore. Use the client [identify](../reference/CommonRoomInstrumentationClient.md#methods) method instead.

Before:

```ts index.ts
import { identify } from "@workleap/common-room";

identify("johndoe@contoso.com");
```

Now:

```ts !#3,5 index.ts
import { useCommonRoomInstrumentationClient } from "@workleap/common-room/react";

const client = useCommonRoomInstrumentationClient();

useCommonRoomInstrumentationClient.identify("johndoe@contoso.com");
```

## New React context

- A new [CommonRoomInstrumentationProvider](../reference/CommonRoomInstrumentationProvider.md) React context provider is available to forward a `CommonRoomInstrumentationClient` instance.
- A new [useCommnRoomInstrumentationClient](../reference/useCommonRoomInstrumentationClient.md) hook is available to retrieve the provided `CommonRoomInstrumentationClient` instance.

