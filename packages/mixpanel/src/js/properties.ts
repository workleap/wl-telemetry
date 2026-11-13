import type { MixpanelEventProperties, TelemetryContext } from "@workleap-telemetry/core";
import { browserName, browserVersion, deviceType, osName, redactQueryParameters, referringDomain } from "./utils.ts";

export const BaseProperties = {
    Browser: "$browser",
    BrowserVersion: "$browser_version",
    CurrentUrl: "$current_url",
    Device: "$device",
    IsMobile: "Is Mobile",
    Os: "$os",
    Referrer: "$referrer",
    ReferringDomain: "$referring_domain",
    ScreenHeight: "$screen_height",
    ScreenWidth: "$screen_width"
} as const;

export function getBaseProperties(privateQueryParameterNames: string[]) {
    const userAgent = navigator.userAgent;
    const device = deviceType(userAgent);

    return {
        [BaseProperties.Os]: osName(userAgent),
        [BaseProperties.Browser]: browserName(userAgent, navigator.vendor),
        [BaseProperties.Referrer]: redactQueryParameters(document.referrer, privateQueryParameterNames),
        [BaseProperties.ReferringDomain]: referringDomain(document.referrer),
        [BaseProperties.Device]: device,
        // The fragment is removed because it can include sensitive values, such as an access token.
        [BaseProperties.CurrentUrl]: redactQueryParameters(window.location.href.split("#")[0], privateQueryParameterNames),
        [BaseProperties.BrowserVersion]: browserVersion(userAgent, navigator.vendor),
        [BaseProperties.ScreenHeight]: window.screen.height,
        [BaseProperties.ScreenWidth]: window.screen.width,
        [BaseProperties.IsMobile]: device.length > 0
    } satisfies MixpanelEventProperties;
}

export const TelemetryProperties = {
    DeviceId: "Device Id",
    TelemetryId: "Telemetry Id"
} as const;

export function getTelemetryProperties(context: TelemetryContext) {
    return {
        [TelemetryProperties.TelemetryId]: context.telemetryId,
        [TelemetryProperties.DeviceId]: context.deviceId
    } satisfies MixpanelEventProperties;
}

export const OtherProperties = {
    LogRocketSessionUrl: "LogRocket Session Url"
};
