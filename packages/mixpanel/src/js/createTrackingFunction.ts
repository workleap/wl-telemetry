// DEPRECATED: Grace period ends on January 1th 2026.
// Must keep this code until the end of the grace period because host applications using version 2.* of
// this package would get runtime errors from the Platform Widgets CDN otherwise.

import type { CreateMixpanelTrackingFunctionOptions, MixpanelTrackingFunction } from "@workleap-telemetry/core";
import { getMixpanelContext } from "./context.ts";
import { getBaseProperties } from "./properties.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function createTrackingFunction(options: CreateMixpanelTrackingFunctionOptions = {}) {
    const {
        targetProductId
    } = options;

    const {
        productId,
        endpoint,
        globalEventProperties,
        logger
    } = getMixpanelContext();

    const trackFunction: MixpanelTrackingFunction = async (eventName, properties, _options = {}) => {
        try {
            const {
                keepAlive = false
            } = _options;

            const baseProperties = getBaseProperties();

            const allProperties = {
                ...baseProperties,
                ...Object.fromEntries(globalEventProperties),
                ...properties
            };

            await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                keepalive: keepAlive,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventName,
                    productIdentifier: productId,
                    // Not sure why, but it seems important to send "null" if not target product identifier
                    // are provided.
                    targetProductIdentifier : targetProductId ?? null,
                    properties: allProperties
                })
            });
        } catch (error: unknown) {
            logger
                .withText(`[mixpanel] An error occurred while sending a tracking event to "${endpoint}":`)
                .withError(error as Error)
                .error();
        }
    };

    return trackFunction;
}
