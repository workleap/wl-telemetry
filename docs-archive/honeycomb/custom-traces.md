---
order: 90
---

Applications are expected to use the [OpenTelemetry API](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/#add-custom-instrumentation) to send custom traces to Honeycomb:

```tsx !#4,9-10 src/Page.tsx
import { useEffect } from "react";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("sample");

export function Page() {
    useEffect(() => {
        // OK, this is a pretty bad example.
        const span = tracer.startSpan("sample-span");
        span.end();
    }, []);

    return (
        <div>Hello from a page!</div>
    );
}
```
