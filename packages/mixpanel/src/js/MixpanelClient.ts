import type { CreateMixpanelTrackingFunctionOptions, MixpanelTrackingFunction } from "@workleap-telemetry/core";
import type { Logger } from "@workleap/logging";
import { getBaseProperties } from "./properties.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface MixpanelClient {
    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    createTrackingFunction: (options?: CreateMixpanelTrackingFunctionOptions) => MixpanelTrackingFunction;
    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setGlobalEventProperty: (key: string, value: unknown) => void;
    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    setGlobalEventProperties: (values: Record<string, unknown>) => void;
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface MixpanelClientOptions {
    /**
     * @see {@link https://workleap.github.io/wl-telemetry}
     */
    productId?: string;
}

export class MixpanelClientImpl implements MixpanelClient {
    readonly #globalEventProperties = new Map<string, unknown>();
    readonly #endpoint: string;
    readonly #logger: Logger;
    readonly #productId?: string;

    constructor(endpoint: string, logger: Logger, options: MixpanelClientOptions = {}) {
        const {
            productId
        } = options;

        this.#endpoint = endpoint;
        this.#logger = logger;
        this.#productId = productId;
    }

    // IMPORTANT: If you update this method, make sure to update the MixpanelPartialClient
    // interface as well in @workleap-telemetry/core.
    createTrackingFunction(options: CreateMixpanelTrackingFunctionOptions = {}) {
        const {
            productId,
            targetProductId,
            additionalProperties = {}
        } = options;

        const trackFunction: MixpanelTrackingFunction = async (eventName, properties, _options = {}) => {
            try {
                const {
                    keepAlive = false
                } = _options;

                const baseProperties = getBaseProperties();

                const allProperties = {
                    ...baseProperties,
                    ...Object.fromEntries(this.#globalEventProperties),
                    ...additionalProperties,
                    ...properties
                };

                await fetch(this.#endpoint, {
                    method: "POST",
                    credentials: "include",
                    keepalive: keepAlive,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        eventName,
                        productIdentifier: productId ?? this.#productId,
                        // Not sure why, but it seems important to send "null" if not target product identifier
                        // are provided.
                        targetProductIdentifier: targetProductId ?? null,
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

    setGlobalEventProperty(key: string, value: unknown) {
        this.#globalEventProperties.set(key, value);
    }

    setGlobalEventProperties(values: Record<string, unknown>) {
        Object.keys(values).forEach(x => {
            this.#globalEventProperties.set(x, values[x]);
        });
    }
}
