import { CommonRoomInstrumentationProvider, registerCommonRoomInstrumentation } from "@workleap/common-room/react";
import { BrowserConsoleLogger, type RootLogger } from "@workleap/logging";
import { initializeTelemetry, LogRocketLogger, TelemetryProvider } from "@workleap/telemetry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const loggers: RootLogger[] = [
    new BrowserConsoleLogger(),
    new LogRocketLogger()
];

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: process.env.LOGROCKET_APP_ID!,
        options: {
            rootHostname: "workleap.com"
        }
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "all-platforms-sample",
        apiServiceUrls: [/http:\/\/localhost:1234.*/],
        options: {
            apiKey: process.env.HONEYCOMB_API_KEY
        }
    },
    mixpanel: {
        productId: "wlp",
        envOrTrackingApiBaseUrl: "https://local.workleap.com:5678/api/shell/navigation/"
    },
    verbose: true,
    loggers
});

const commonRoomClient = registerCommonRoomInstrumentation(process.env.COMMON_ROOM_SITE_ID!, {
    verbose: true,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryProvider client={telemetryClient}>
            <CommonRoomInstrumentationProvider client={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationProvider>
        </TelemetryProvider>
    </StrictMode>
);
