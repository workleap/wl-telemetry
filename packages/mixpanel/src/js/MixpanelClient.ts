import { Logger } from "@workleap/logging";
import { CreateTrackingFunctionOptions, TrackingFunction } from "./createTrackingFunction.ts";
import { getBaseProperties } from "./properties.ts";

// Equivalent to: https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#setting-super-properties.
export type SuperProperties = Map<string, unknown>;

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class MixpanelClient {
    readonly #productId: string;
    readonly #endpoint: string;
    readonly #superProperties: SuperProperties;
    readonly #logger: Logger;

    constructor(productId: string, endpoint: string, superProperties: SuperProperties, logger: Logger) {
        this.#productId = productId;
        this.#endpoint = endpoint;
        this.#superProperties = superProperties;
        this.#logger = logger;
    }

    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    createTrackingFunction(options: CreateTrackingFunctionOptions = {}) {
        const {
            targetProductId
        } = options;

        const trackFunction: TrackingFunction = async (eventName, properties, _options = {}) => {
            try {
                const {
                    keepAlive = false
                } = _options;

                const baseProperties = getBaseProperties();

                const allProperties = {
                    ...baseProperties,
                    ...Object.fromEntries(this.#superProperties),
                    ...properties
                };

                await fetch(this.#endpoint, {
                    method: "POST",
                    credentials: "include",
                    keepalive: keepAlive,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventName,
                        productIdentifier: this.#productId,
                        // Not sure why, but it seems important to send "null" if not target product identifier
                        // are provided.
                        targetProductIdentifier : targetProductId ?? null,
                        properties: allProperties
                    })
                });
            } catch (error: unknown) {
                this.#logger
                    .withText(`[mixpanel] An error occurred while sending a tracking event to "${this.#endpoint}":`)
                    .withError(error as Error)
                    .error();
            }
        };

        return trackFunction;
    }

    /**
     * Equivalent to https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#setting-super-properties.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setSuperProperty(key: string, value: unknown) {
        this.#superProperties.set(key, value);
    }

    /**
     * Equivalent to https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript#setting-super-properties.
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setSuperProperties(values: Record<string, unknown>) {
        Object.keys(values).forEach(x => {
            this.#superProperties.set(x, values[x]);
        });
    }
}
