import type { Logger } from "@workleap/logging";
import Cookies from "js-cookie";

// The identity cookie is a concept created by Workleap's marketing teams. With this cookie, telemetry data can be
// correlated with a device id across multiple sites / apps.
export const IdentityCookieName = "wl-identity";

interface IdentityCookie {
    deviceId: string;
}

export function getDeviceId(logger: Logger) {
    try {
        const cookie = Cookies.get(IdentityCookieName);

        if (cookie) {
            logger
                .withText("Found identity cookie:")
                .withText(cookie)
                .debug();

            const parsedCookie = JSON.parse(cookie) as IdentityCookie;

            return parsedCookie.deviceId;
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        // Do nothing.
    }
}

export function setDeviceId(deviceId: string, cookieExpiration: Date, cookieDomain: string, logger: Logger) {
    const value = {
        deviceId
    } satisfies IdentityCookie;

    try {
        // Not setting an expiration date because we want a "session" cookie.
        Cookies.set(IdentityCookieName, JSON.stringify(value), {
            expires: cookieExpiration,
            domain: cookieDomain
        });

        logger.debug(`Set identity cookie with name: "${IdentityCookieName}", expiration: "${cookieExpiration}", domain: "${cookieDomain}".`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
        // Do nothing.
    }
}
