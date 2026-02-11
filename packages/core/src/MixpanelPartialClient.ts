/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface CreateMixpanelTrackingFunctionOptions {
    /**
     * The product identifier.
     */
    productId?: string;
    /**
     * The product identifier of the target product.
     */
    targetProductId?: string;
    additionalProperties?: Record<string, unknown>;
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

export type MixpanelEventProperties = Record<string, unknown>;

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
export interface MixpanelPartialClient {
    createTrackingFunction: (options: CreateMixpanelTrackingFunctionOptions) => MixpanelTrackingFunction;
}
