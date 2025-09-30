---
order: 80
label: HoneycombInstrumentationClientProvider
meta:
    title: HoneycombInstrumentationClientProvider - LogRocket
toc:
    depth: 2-3
---

# HoneycombInstrumentationClientProvider

React provider to share a `HoneycombInstrumentationClientProvider` instance with the application code.

## Reference

```tsx
<HoneycombInstrumentationClientProvider value={client}>
    <App />
</HoneycombInstrumentationClientProvider>
```

### Properties

- `value`: A [HoneycombInstrumentationClient](./HoneycombInstrumentationClient.md) instance.

## Usage

### Provide a client instance

```tsx !#12-14
import { createRoot } from "react-dom/client";
import { registerHoneycombInstrumentation, HoneycombInstrumentationClientProvider } from "@workleap/honeycomb/react";
import { App } from "./App.tsx";

const client = registerHoneycombInstrumentation("sample", "my-app", [/.+/g,], {
    proxy: "https://sample-proxy"
});

const root = createRoot(document.getElementById("root"));

root.render(
    <HoneycombInstrumentationClientProvider value={client}>
        <App />
    </HoneycombInstrumentationClientProvider>
);
```

### Retrieve a client instance

```tsx !#3
import { useHoneycombInstrumentationClient } from "@workleap/honeycomb/react";

const client = useHoneycombInstrumentationClient();

client.setGlobalSpanAttributes({
    "app.user_id": "123"
});
```
