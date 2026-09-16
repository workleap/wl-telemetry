import { createTelemetryContext, HoneycombInstrumentationProvider, registerHoneycombInstrumentation } from "@workleap/honeycomb/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

// The sample proxy rejects the trace requests without this cookie. The browser sends it to the proxy because
// the Honeycomb instrumentation sends the trace requests with the session credentials.
document.cookie = "wl-sample-session=1; path=/";

const honeycombClient = registerHoneycombInstrumentation("sample", "honeycomb-proxy-sample", [/http:\/\/localhost:1234\.*/], {
    proxy: "http://localhost:5678/v1/traces",
    telemetryContext: createTelemetryContext("wlp", { verbose: true }),
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
        <HoneycombInstrumentationProvider client={honeycombClient}>
            <App />
        </HoneycombInstrumentationProvider>
    </StrictMode>
);
