import { createTelemetryContext, HoneycombInstrumentationClientProvider, registerHoneycombInstrumentation } from "@workleap/honeycomb/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const honeycombClient = registerHoneycombInstrumentation("sample", "honeycomb-proxy-sample", [/http:\/\/localhost:1234\.*/], {
    proxy: "http://localhost:5678/v1/traces",
    telemetryContext: createTelemetryContext({ verbose: true }),
    verbose: true
});

// Update telemetry global attributes.
honeycombClient.setGlobalSpanAttributes({
    "app.user_id": "123",
    "app.user_prefered_language": "fr-CA"
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <HoneycombInstrumentationClientProvider value={honeycombClient}>
            <App />
        </HoneycombInstrumentationClientProvider>
    </StrictMode>
);
