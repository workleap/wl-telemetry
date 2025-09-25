import { registerCommonRoomInstrumentation } from "@workleap/common-room";
import { CommonRoomInstrumentationClientProvider } from "@workleap/common-room/react";
import { BrowserConsoleLogger, type RootLogger } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/logrocket";
import { initializeTelemetry, TelemetryClientProvider } from "@workleap/telemetry/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";

const loggers: RootLogger[] = [
    new BrowserConsoleLogger(),
    new LogRocketLogger()
];

const telemetryClient = initializeTelemetry({
    logRocket: {
        appId: process.env.LOGROCKET_APP_ID as string,
        options: {
            rootHostname: "workleap.com"
        }
    },
    honeycomb: {
        namespace: "sample",
        serviceName: "all-platforms-sample",
        apiServiceUrls: [/.+/g],
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

const commonRoomClient = registerCommonRoomInstrumentation(process.env.COMMON_ROOM_SITE_ID as string, {
    verbose: true,
    loggers
});

const root = createRoot(document.getElementById("root")!);

root.render(
    <StrictMode>
        <TelemetryClientProvider value={telemetryClient}>
            <CommonRoomInstrumentationClientProvider value={commonRoomClient}>
                <App />
            </CommonRoomInstrumentationClientProvider>
        </TelemetryClientProvider>
    </StrictMode>
);
