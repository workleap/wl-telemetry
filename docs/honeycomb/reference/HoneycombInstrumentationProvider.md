---
order: 80
label: HoneycombInstrumentationProvider
meta:
    title: HoneycombInstrumentationProvider - LogRocket
toc:
    depth: 2-3
---

# HoneycombInstrumentationProvider

React provider to share a `HoneycombInstrumentationProvider` instance with the application code.

## Reference

```tsx
<HoneycombInstrumentationProvider client={client}>
    <App />
</HoneycombInstrumentationProvider>
```

### Properties

- `client`: A [HoneycombInstrumentationClient](./HoneycombInstrumentationClient.md) instance.

## Usage

### Provide a client instance

```tsx !#12-14
import { registerHoneycombInstrumentation, HoneycombInstrumentationProvider } from "@workleap/honeycomb/react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

const root = createRoot(document.getElementById("root"));

root.render(
    <HoneycombInstrumentationProvider client={client}>
        <App />
    </HoneycombInstrumentationProvider>
);
```

### Retrieve a client instance

```ts !#3
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```
