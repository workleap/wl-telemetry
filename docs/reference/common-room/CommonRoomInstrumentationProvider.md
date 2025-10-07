---
order: 80
label: CommonRoomInstrumentationProvider
toc:
    depth: 2-3
---

# CommonRoomInstrumentationProvider

React provider to share a `CommonRoomInstrumentationProvider` instance with the application code.

## Reference

```tsx
<CommonRoomInstrumentationProvider client={client}>
    <App />
</CommonRoomInstrumentationProvider>
```

### Properties

- `client`: A [CommonRoomInstrumentationClient](./CommonRoomInstrumentationClient.md) instance.

## Usage

### Provide a client instance

```tsx !#10,12
import { registerCommonRoomInstrumentation, CommonRoomInstrumentationProvider } from "@workleap/common-room/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerCommonRoomInstrumentation("my-site-id")

const root = createRoot(document.getElementById("root"));

root.render(
    <CommonRoomInstrumentationProvider client={client}>
        <App />
    </CommonRoomInstrumentationProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useCommonRoomInstrumentationClient } from "@workleap/common-room/react";

const client = useCommonRoomInstrumentationClient();

client.identify("johndoe@contoso.com");
```
