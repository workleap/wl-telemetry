import { type HoneycombOptions, HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { Span } from "@opentelemetry/api";
import { getWebAutoInstrumentations, type InstrumentationConfigMap } from "@opentelemetry/auto-instrumentations-web";
import type { DocumentLoadInstrumentationConfig } from "@opentelemetry/instrumentation-document-load";
import type { FetchInstrumentationConfig, FetchRequestHookFunction as OpenTelemetryFetchRequestHookFunction } from "@opentelemetry/instrumentation-fetch";
import type { UserInteractionInstrumentationConfig } from "@opentelemetry/instrumentation-user-interaction";
import type { XMLHttpRequestInstrumentationConfig } from "@opentelemetry/instrumentation-xml-http-request";
import type { PropagateTraceHeaderCorsUrls, SpanProcessor } from "@opentelemetry/sdk-trace-web";
import { BootstrappingStore, TelemetryContext } from "@workleap-telemetry/core";
import { createCompositeLogger, type Logger, type RootLogger } from "@workleap/logging";
import { applyTransformers, type HoneycombSdkOptionsTransformer } from "./applyTransformers.ts";
import { FetchRequestHookFunction, FetchRequestPipeline } from "./FetchRequestPipeline.ts";
import { GlobalAttributeSpanProcessor } from "./GlobalAttributeSpanProcessor.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";
import { HoneycombInstrumentationClient } from "./HoneycombInstrumentationClient.ts";
import type { HoneycombSdkInstrumentations, HoneycombSdkOptions } from "./honeycombTypes.ts";
import { NormalizeAttributesSpanProcessor } from "./NormalizeAttributesSpanProcessor.ts";
import { patchXmlHttpRequest } from "./patchXmlHttpRequest.ts";

export const ServiceNamespaceAttributeName = "service.namespace";
export const TelemetryIdAttributeName = "app.telemetry_id";
export const DeviceIdAttributeName = "app.device_id";

///////////////////////////

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type DefineFetchInstrumentationOptionsFunction = (defaultOptions: FetchInstrumentationConfig) => FetchInstrumentationConfig;

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type DefineXmlHttpRequestInstrumentationOptionsFunction = (defaultOptions: XMLHttpRequestInstrumentationConfig) => XMLHttpRequestInstrumentationConfig;

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type DefineDocumentLoadInstrumentationOptionsFunction = (defaultOptions: DocumentLoadInstrumentationConfig) => DocumentLoadInstrumentationConfig;

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export type DefineUserInteractionInstrumentationOptionsFunction = (defaultOptions: UserInteractionInstrumentationConfig) => UserInteractionInstrumentationConfig;

const defaultDefineFetchInstrumentationOptions: DefineFetchInstrumentationOptionsFunction = defaultOptions => {
    return defaultOptions;
};

const defaultDefineDocumentLoadInstrumentationOptions: DefineDocumentLoadInstrumentationOptionsFunction = defaultOptions => {
    return defaultOptions;
};

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface RegisterHoneycombInstrumentationOptions {
    proxy?: string;
    apiKey?: HoneycombSdkOptions["apiKey"];
    verbose?: boolean;
    loggers?: RootLogger[];
    instrumentations?: HoneycombSdkInstrumentations;
    spanProcessors?: SpanProcessor[];
    fetchInstrumentation?: false | DefineFetchInstrumentationOptionsFunction;
    xmlHttpRequestInstrumentation?: false | DefineXmlHttpRequestInstrumentationOptionsFunction;
    documentLoadInstrumentation?: false | DefineDocumentLoadInstrumentationOptionsFunction;
    userInteractionInstrumentation?: false | DefineUserInteractionInstrumentationOptionsFunction;
    transformers?: HoneycombSdkOptionsTransformer[];
}

function augmentFetchInstrumentationOptionsWithFetchRequestPipeline(options: FetchInstrumentationConfig, fetchRequestPipeline: FetchRequestPipeline) {
    if (options.requestHook) {
        fetchRequestPipeline.registerHook(options.requestHook);
    }

    options.requestHook = ((span: Span, request: Request | RequestInit) => {
        fetchRequestPipeline.dispatchRequest(span, request);
    }) satisfies OpenTelemetryFetchRequestHookFunction;

    return options;
}

export function getHoneycombSdkOptions(
    serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>,
    apiServiceUrls: PropagateTraceHeaderCorsUrls,
    globalAttributeSpanProcessor: GlobalAttributeSpanProcessor,
    fetchRequestPipeline: FetchRequestPipeline,
    options: RegisterHoneycombInstrumentationOptions = {}
) {
    const {
        proxy,
        apiKey,
        verbose = false,
        loggers = [],
        instrumentations = [],
        spanProcessors = [],
        fetchInstrumentation = defaultDefineFetchInstrumentationOptions,
        xmlHttpRequestInstrumentation = false,
        documentLoadInstrumentation = defaultDefineDocumentLoadInstrumentationOptions,
        userInteractionInstrumentation = false,
        transformers = []
    } = options;

    if (!proxy && !apiKey) {
        throw new Error("[honeycomb] Instrumentation must be initialized with either a \"proxy\" or \"apiKey\" option.");
    }

    const logger = createCompositeLogger(verbose, loggers);

    const instrumentationOptions = {
        ignoreNetworkEvents: true,
        propagateTraceHeaderCorsUrls: apiServiceUrls
    };

    const autoInstrumentations: InstrumentationConfigMap = {};

    if (fetchInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-fetch"] =
            augmentFetchInstrumentationOptionsWithFetchRequestPipeline(
                fetchInstrumentation(instrumentationOptions),
                fetchRequestPipeline
            );
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-fetch"] = {
            enabled: false
        };
    }

    if (xmlHttpRequestInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-xml-http-request"] = xmlHttpRequestInstrumentation(instrumentationOptions);
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-xml-http-request"] = {
            enabled: false
        };
    }

    if (documentLoadInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-document-load"] = documentLoadInstrumentation(instrumentationOptions);
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-document-load"] = {
            enabled: false
        };
    }

    if (userInteractionInstrumentation) {
        autoInstrumentations["@opentelemetry/instrumentation-user-interaction"] = userInteractionInstrumentation({});
    } else {
        autoInstrumentations["@opentelemetry/instrumentation-user-interaction"] = {
            enabled: false
        };
    }

    const sdkOptions = {
        endpoint: proxy,
        apiKey,
        debug: verbose,
        localVisualizations: verbose,
        serviceName,
        // Watch out, getWebAutoInstrumentations enables by default all the supported instrumentations.
        // It's important to disabled those that we don't want.
        instrumentations: [
            ...getWebAutoInstrumentations(autoInstrumentations),
            ...instrumentations
        ],
        spanProcessors: [globalAttributeSpanProcessor, new NormalizeAttributesSpanProcessor(), ...spanProcessors]
    } satisfies HoneycombSdkOptions;

    return applyTransformers(sdkOptions, transformers, {
        verbose,
        logger
    });
}

///////////////////////////

function registerLogRocketSessionUrlListener(globalAttributeSpanProcessor: GlobalAttributeSpanProcessor, logger: Logger) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__) {
        // Automatically add the LogRocket session URL to all Honeycomb traces as an attribute.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__((sessionUrl: string) => {
            logger
                .withText("[honeycomb] Received LogRocket session replay URL:")
                .withText(sessionUrl)
                .debug();

            globalAttributeSpanProcessor.setAttribute("app.logrocket_session_url", sessionUrl);
        });
    } else {
        logger.information("[honeycomb] Cannot integrate with LogRocket because \"globalThis.__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__\" is not available.");
    }
}

///////////////////////////

// DEPRECATED: Grace period ends on January 1th 2026.
// Don't forget to remove the tests as well.
export const IsRegisteredVariableName = "__WLP_HONEYCOMB_INSTRUMENTATION_IS_REGISTERED__";
export const RegisterDynamicFetchRequestHookFunctionName = "__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK__";
export const RegisterDynamicFetchRequestHookAtStartFunctionName = "__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK_AT_START__";

// DEPRECATED: Grace period ends on January 1th 2026.
function registerDeprecatedGlobalVariables(fetchRequestPipeline: FetchRequestPipeline) {
    // Indicates to the host applications that the Honeycomb instrumentation
    // has been registered.
    // It's useful in cases where an "add-on", like the platform widgets needs
    // to know whether or not the host application is using Honeycomb.
    // While there are ways that the host application could tell to an "add-on" if
    // it's using Honeycomb or not, doing it this way is transparent for the consumer,
    // which is great for DX.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[IsRegisteredVariableName] = true;

    const registerFetchRequestHook = (hook: FetchRequestHookFunction) => {
        fetchRequestPipeline.registerHook(hook);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[RegisterDynamicFetchRequestHookFunctionName] = registerFetchRequestHook

    // Temporary naming due to a previous error.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK = registerFetchRequestHook;

    const registerFetchRequestHookAtStart = (hook: FetchRequestHookFunction) => {
        fetchRequestPipeline.registerHookAtStart(hook);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[RegisterDynamicFetchRequestHookAtStartFunctionName] = registerFetchRequestHookAtStart;

    // Temporary naming due to a previous error.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.__WLP_HONEYCOMB_REGISTER_DYNAMIC_FETCH_REQUEST_HOOK_AT_START = registerFetchRequestHookAtStart;
}

///////////////////////////

let registrationGuardInstance: HasExecutedGuard | undefined;

// It's important to use a lazy singleton instead of a singleton to avoid
// any future probleme related to HMR, tree-shaking, SSR, etc..
function getRegistrationGuard() {
    if (!registrationGuardInstance) {
        registrationGuardInstance = new HasExecutedGuard();
    }

    return registrationGuardInstance;
}

// This function should only be used by tests.
export function __resetRegistrationGuard() {
    if (registrationGuardInstance) {
        registrationGuardInstance.reset();
    }
}

///////////////////////////

export type HoneycombSdkFactory = (options: HoneycombOptions) => HoneycombWebSDK;

export class HoneycombInstrumentationRegistrator {
    readonly #globalAttributeSpanProcessor: GlobalAttributeSpanProcessor;
    readonly #fetchRequestPipeline: FetchRequestPipeline;
    readonly #createHoneycombSdkInstance: HoneycombSdkFactory;

    constructor(
        globalAttributeSpanProcessor: GlobalAttributeSpanProcessor,
        fetchRequestPipeline: FetchRequestPipeline,
        createHoneycombSdkInstance: HoneycombSdkFactory,
    ) {
        this.#globalAttributeSpanProcessor = globalAttributeSpanProcessor;
        this.#fetchRequestPipeline = fetchRequestPipeline;
        this.#createHoneycombSdkInstance = createHoneycombSdkInstance;
    }

    register(
        namespace: string,
        serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>,
        apiServiceUrls: PropagateTraceHeaderCorsUrls,
        telemetryContext: TelemetryContext,
        bootstrappingStore: BootstrappingStore,
        options: RegisterHoneycombInstrumentationOptions = {}
    ) {
        const {
            proxy,
            verbose = false,
            loggers = []
        } = options;

        const logger = createCompositeLogger(verbose, loggers);

        if (proxy) {
            patchXmlHttpRequest(proxy);
        }

        const sdkOptions = getHoneycombSdkOptions(serviceName, apiServiceUrls, this.#globalAttributeSpanProcessor, this.#fetchRequestPipeline, options);
        const sdkInstance = this.#createHoneycombSdkInstance(sdkOptions);

        sdkInstance.start();

        // This is a custom field recommended by Honeycomb to organize the data.
        this.#globalAttributeSpanProcessor.setAttribute(ServiceNamespaceAttributeName, namespace);

        // Add telemetry correlation ids to traces.
        this.#globalAttributeSpanProcessor.setAttribute(TelemetryIdAttributeName, telemetryContext.telemetryId);
        this.#globalAttributeSpanProcessor.setAttribute(DeviceIdAttributeName, telemetryContext.deviceId);

        // If LogRocket is already available, register the listener. Otherwise, subscribe to the bootstrapping store
        // and register the listener once a notification is received that LogRocket is registered.
        if (bootstrappingStore.state.isLogRocketReady) {
            registerLogRocketSessionUrlListener(this.#globalAttributeSpanProcessor, logger);
        } else {
            bootstrappingStore.subscribe((action, store, unsubscribe) => {
                if (store.state.isLogRocketReady) {
                    unsubscribe();
                    registerLogRocketSessionUrlListener(this.#globalAttributeSpanProcessor, logger);
                }
            });
        }

        registerDeprecatedGlobalVariables(this.#fetchRequestPipeline);

        // Let the other telemetry libraries know that Honeycomb instrumentation is ready.
        bootstrappingStore.dispatch({ type: "honeycomb-ready" });

        logger.information("[honeycomb] Honeycomb instrumentation is registered.");

        return new HoneycombInstrumentationClient(this.#globalAttributeSpanProcessor, this.#fetchRequestPipeline);
    }
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function registerHoneycombInstrumentation(
    namespace: string,
    serviceName: NonNullable<HoneycombSdkOptions["serviceName"]>,
    apiServiceUrls: PropagateTraceHeaderCorsUrls,
    telemetryContext: TelemetryContext,
    // TODO: Probably replace the store with the actual client instance instead.
    // and delete permanently the store implementation.
    bootstrappingStore: BootstrappingStore,
    options?: RegisterHoneycombInstrumentationOptions
) {
    getRegistrationGuard().throw("[honeycomb] The Honeycomb instrumentation has already been registered. Did you call the \"registerHoneycombInstrumentation\" function twice?");

    return new HoneycombInstrumentationRegistrator(
        new GlobalAttributeSpanProcessor(),
        new FetchRequestPipeline(),
        x => new HoneycombWebSDK(x),
    ).register(
        namespace,
        serviceName,
        apiServiceUrls,
        telemetryContext,
        bootstrappingStore,
        options
    );
}
