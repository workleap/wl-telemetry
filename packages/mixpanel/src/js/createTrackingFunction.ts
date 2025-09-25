// DEPRECATED: Grace period ends on January 1th 2026.
// Must keep this code until the end of the grace period because host applications using version 2.* of
// this package would get runtime errors from the Platform Widgets CDN otherwise.

import { getMixpanelContext } from "./context.ts";
import { getBaseProperties, type MixpanelEventProperties } from "./properties.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface CreateMixpanelTrackingFunctionOptions {
    /**
     * The product identifier of the target product.
     */
    targetProductId?: string;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface MixpanelTrackingFunctionOptions {
    /**
   * Whether to keep the connection alive for the tracking request.
   * It is mostly used for tracking links where the user might navigate away before the request is completed.
   *
   * Caution! The body size for keepalive requests is limited to 64 kibibytes.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive
   *
   * @default false
   */
    keepAlive?: boolean;
}

/**
 * A function that sends tracking events to the tracking API.
 * @param eventName The name of the event to track.
 * @param properties The properties to send with the event.
 * @param options Options for tracking the event.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type MixpanelTrackingFunction = (eventName: string, properties: MixpanelEventProperties, options?: MixpanelTrackingFunctionOptions) => Promise<void>;

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
        superProperties,
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
                ...Object.fromEntries(superProperties),
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
