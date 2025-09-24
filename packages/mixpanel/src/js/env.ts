const EnvironmentList = ["development", "staging", "production", "local", "msw"] as const;

export type Environment = typeof EnvironmentList[number];

const NavigationApiBaseUrl: Record<Environment, string> = {
    "production": "https://api.platform.workleap.com/shell/navigation/",
    "staging": "https://api.platform.workleap-stg.com/shell/navigation/",
    "development": "https://api.platform.workleap-dev.com/shell/navigation/",
    "local": "https://api.platform.workleap-dev.com/shell/navigation/",
    "msw": "/api/shell/navigation/"
};

// Cannot use URL() because it doesn't support relative base url: https://github.com/whatwg/url/issues/531.
function resolveApiUrl(path: string, baseUrl: string | undefined) : string {
    return `${baseUrl}${baseUrl!.endsWith("/") ? "" : "/"}${path.startsWith("/") ? path.substring(1) : path}`;
}

export function getTrackingEndpoint(envOrTrackingApiBaseUrl: Environment | (string & {}), trackingEndpoint = "tracking/track"): string {
    let baseUrl: string;

    if (EnvironmentList.includes(envOrTrackingApiBaseUrl as Environment)) {
        baseUrl = NavigationApiBaseUrl[envOrTrackingApiBaseUrl as Environment];
    } else {
        baseUrl = envOrTrackingApiBaseUrl;
    }

    return resolveApiUrl(trackingEndpoint, baseUrl);
}
