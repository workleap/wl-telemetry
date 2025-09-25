// DEPRECATED: Grace period ends on January 1th 2026.
// Must keep this code until the end of the grace period because host applications using version 2.* of
// this package would get runtime errors from the Platform Widgets CDN otherwise.

import type { Logger } from "@workleap/logging";
import { MixpanelSuperProperties } from "./MixpanelClient.ts";

export const MixpanelContextVariableName = "__WLP_MIXPANEL_CONTEXT__";

export interface MixpanelContext {
    productId: string;
    endpoint: string;
    superProperties: MixpanelSuperProperties;
    logger: Logger;
}

export function setMixpanelContext(context: MixpanelContext) {
    // Will be used by the "track" function.
    // It's important to share the context with a global DOM object rather than
    // a singleton because projects like the platform widgets will use a distinct instance
    // of this package than the host application.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[MixpanelContextVariableName] = context;
}

export function getMixpanelContext() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const context = globalThis[MixpanelContextVariableName] as MixpanelContext;

    if (!context) {
        throw new Error("[mixpanel] The Mixpanel context is not available. Did you initialize Mixpanel with the \"initializeMixpanel\" function?");
    }

    return context;
}


