import { createCompositeLogger, type RootLogger } from "@workleap/logging";
import { BootstrappingStore, TelemetryContext } from "@workleap/telemetry";
import LogRocket from "logrocket";
import LogrocketFuzzySanitizer from "logrocket-fuzzy-search-sanitizer";
import { applyTransformers, type LogRocketSdkOptionsTransformer } from "./applyTransformers.ts";
import { createRequestSanitizer } from "./createRequestSanitizer.ts";
import { createResponseSanitizer } from "./createResponseSanitizer.ts";
import { createUrlSanitizer } from "./createUrlSanitizer.ts";
import { HasExecutedGuard } from "./HasExecutedGuard.ts";
import { DeviceIdTrait, LogRocketInstrumentationClient, TelemetryIdTrait } from "./LogRocketInstrumentationClient.ts";
import type { LogRocketSdkOptions } from "./logRocketTypes.ts";

const DefaultPrivateFieldNames = [
    "email",
    "personalEmail",
    "phoneNumber",
    "password",
    "firstName",
    "lastName",
    "givenName",
    "fullName",
    "gender",
    "timeZone",
    "birthday"
];

const DefaultPrivateQueryParameterNames = [
    "token",
    "email",
    "password"
];

///////////////////////////

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface RegisterLogRocketInstrumentationOptions {
    /**
     * A root hostname to track sessions across subdomains. Set this option to capture traffic from all subdomains under one session: https://docs.logrocket.com/reference/roothostname.
     */
    rootHostname?: LogRocketSdkOptions["rootHostname"];
    /**
     * Names of additional fields to exclude from session replays. These fields will be removed from network requests, responses using a fuzzy-matching algorithm.
     */
    privateFieldNames?: string[];
    /**
     * Names of additional fields to exclude from session replays. These fields will be removed from query parameters using a fuzzy-matching algorithm.
     */
    privateQueryParameterNames?: string[];
    /**
     * Indicates whether or not debug information should be logged to the console.
     */
    verbose?: boolean;
    /**
     * The logger instances that will output messages.
     */
    loggers?: RootLogger[];
    /**
     * Hooks to transform the resulting LogRocket SDK options.
     */
    transformers?: LogRocketSdkOptionsTransformer[];
}

// The function return type is mandatory, otherwise we got an error TS4058.
export function getLogRocketSdkOptions(userOptions: RegisterLogRocketInstrumentationOptions, logger: RootLogger): LogRocketSdkOptions {
    const {
        rootHostname = "workleap.com",
        privateFieldNames = [],
        privateQueryParameterNames = [],
        verbose = false,
        transformers = []
    } = userOptions;

    const mergedPrivateFieldNames = DefaultPrivateFieldNames.concat(privateFieldNames);
    const mergedPrivateQueryParameterNames = DefaultPrivateQueryParameterNames.concat(privateQueryParameterNames);

    // The "LogrocketFuzzySearch.setup" code is awkward. For now, we prefer to play it safe and call it once here, then forward the sanitize functions
    // to the appropriate factories.
    // No clue why the "setup" method is not available. This package is shady.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { requestSanitizer: fuzzyRequestSanitizer, responseSanitizer: fuzzyResponseSanitizer } = LogrocketFuzzySanitizer.setup(mergedPrivateFieldNames);

    const sdkOptions = {
        console: {
            // Prevent console logs from being visible in LogRocket session replays and leaking PII.
            // To capture logs in a session replay, use the LogRocketLogger class.
            isEnabled: false
        },
        rootHostname,
        dom: {
            textSanitizer: true,
            inputSanitizer: true
        },
        network: {
            requestSanitizer: createRequestSanitizer(fuzzyRequestSanitizer),
            responseSanitizer: createResponseSanitizer(fuzzyResponseSanitizer)
        },
        browser: {
            urlSanitizer: createUrlSanitizer(mergedPrivateQueryParameterNames)
        },
        shouldDebugLog: verbose
    } satisfies LogRocketSdkOptions;

    return applyTransformers(sdkOptions, transformers, {
        verbose,
        logger
    });
}

///////////////////////////

// DEPRECATED: Grace period ends on January 1th 2026.
export const IsRegisteredVariableName = "__WLP_LOGROCKET_INSTRUMENTATION_IS_REGISTERED__";
export const RegisterGetSessionUrlFunctionName = "__WLP_LOGROCKET_INSTRUMENTATION_REGISTER_GET_SESSION_URL_LISTENER__";

// DEPRECATED: Grace period ends on January 1th 2026.
function registerDeprecatedGlobalVariables() {
    // Indicates to the host applications that logrocket has been initialized.
    // It's useful in cases where an "add-on", like the platform widgets needs
    // to know whether or not the host application is using LogRocket.
    // While there are ways that the host application could tell to an "add-on" if
    // it's using LogRocket or not, doing it this way is transparent for the consumer,
    // which is great for DX.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[IsRegisteredVariableName] = true;

    // While consumers could directly call LogRocket.getSessionURL, by doing it this way,
    // it allow consumers to not take a direct dependency on the "logrocket" package.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis[RegisterGetSessionUrlFunctionName] = listener => {
        LogRocket.getSessionURL(listener);
    };
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

export class LogRocketInstrumentationRegistrator {
    register(
        appId: string,
        telemetryContext: TelemetryContext,
        // TODO: Probably replace the store with the actual client instance instead.
        // and delete permanently the store implementation.
        bootstrappingStore: BootstrappingStore,
        options: RegisterLogRocketInstrumentationOptions = {}
    ) {
        const {
            verbose = false,
            loggers = []
        } = options;

        const logger = createCompositeLogger(verbose, loggers);
        const sdkOptions = getLogRocketSdkOptions(options, logger);

        // Session starts anonymously when LogRocket.init() is called.
        LogRocket.init(appId, sdkOptions);

        // LogRocket maintains the same session even if the user starts as anonymous and later becomes identified via LogRocket.identify().
        // If LogRocket.identify is called multiple times during a recording, you can search for any of the identified users in the session.
        LogRocket.identify(telemetryContext.deviceId, {
            [DeviceIdTrait]: telemetryContext.deviceId,
            [TelemetryIdTrait]: telemetryContext.telemetryId
        });

        LogRocket.getSessionURL(url => {
            logger
                .withText("[logrocket] Session replay URL is now available:")
                .withText(url)
                .debug();
        });

        registerDeprecatedGlobalVariables();

        // Let the other telemetry libraries know that LogRocket instrumentation is ready.
        bootstrappingStore.dispatch({ type: "logrocket-ready" });

        logger.information("[logrocket] LogRocket instrumentation is registered.");

        return new LogRocketInstrumentationClient(telemetryContext);
    }
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function registerLogRocketInstrumentation(
    appId: string,
    telemetryContext: TelemetryContext,
    // TODO: Probably replace the store with the actual client instance instead.
    // and delete permanently the store implementation.
    bootstrappingStore: BootstrappingStore,
    options?: RegisterLogRocketInstrumentationOptions
) {
    getRegistrationGuard().throw("[logrocket] The LogRocket instrumentation has already been registered. Did you call the \"registerLogRocketInstrumentation\" function twice?");

    return new LogRocketInstrumentationRegistrator().register(appId, telemetryContext, bootstrappingStore, options);
}
