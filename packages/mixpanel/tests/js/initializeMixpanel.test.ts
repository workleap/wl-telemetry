import { type LogRocketInstrumentationPartialClient } from "@workleap-telemetry/core";
import { test } from "vitest";
import { initializeMixpanel, MixpanelInitializer } from "../../src/js/initializeMixpanel.ts";

class DummyLogRocketInstrumentationClient implements LogRocketInstrumentationPartialClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly #listeners: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    registerGetSessionUrlListener(listener: any) {
        this.#listeners.push(listener);
    }

    get listenerCount() {
        return this.#listeners.length;
    }
}

test.concurrent("when mixpanel has already been initialized, throw an error", ({ expect }) => {
    initializeMixpanel("http://api/navigation");

    expect(() => initializeMixpanel("http://api/navigation")).toThrow("[mixpanel] Mixpanel has already been initialized. Did you call the \"initializeMixpanel\" function twice?");
});

test.concurrent("when a logrocket instrumentation client is provided, register a listener for logrocket get session url", ({ expect }) => {
    const logRocketInstrumentationClient = new DummyLogRocketInstrumentationClient();

    const initializer = new MixpanelInitializer();

    initializer.initialize("http://api/navigation", {
        logRocketInstrumentationClient
    });

    expect(logRocketInstrumentationClient.listenerCount).toBe(1);
});

