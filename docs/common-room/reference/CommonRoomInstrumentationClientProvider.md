---
order: 80
label: CommonRoomInstrumentationClientProvider
meta:
    title: CommonRoomInstrumentationClientProvider - Common Room
toc:
    depth: 2-3
---

# CommonRoomInstrumentationClientProvider

React provider to share a `CommonRoomInstrumentationClientProvider` instance with the application code.

## Reference

```tsx
<CommonRoomInstrumentationClientProvider value={client}>
    <App />
</CommonRoomInstrumentationClientProvider>
```

### Properties

- `value`: A [CommonRoomInstrumentationClient](./CommonRoomInstrumentationClient.md) instance.

## Usage

### Provide a client instance

```tsx !#10,12
import { createRoot } from "react-dom/client";
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationClientProvider } from "@workleap/common-room/react";
import { App } from "./App.tsx";

const client = registerCommonRoomInstrumentation("my-site-id")

const root = createRoot(document.getElementById("root"));

root.render(
    <CommonRoomInstrumentationClientProvider value={client}>
        <App />
    </CommonRoomInstrumentationClientProvider>
);
```

### Retrieve a client instance

```tsx !#3
import { useCommonRoomInstrumentationClient } from "@workleap/common-room/react";

const client = useCommonRoomInstrumentationClient();

client.identify("johndoe@contoso.com");
```
