import type { Logger } from "@workleap/logging";

export const BootstrappingStoreVariableName = "__WLP_TELEMETRY_BOOTSTRAPPING_STORE__";

export interface BootstrappingState {
    isLogRocketReady: boolean;
    isHoneycombReady: boolean;
}

export type BootstrappingActionType = "logrocket-ready" | "honeycomb-ready";

export interface BootstrappingAction {
    type: BootstrappingActionType;
    payload?: unknown;
}

export type BootstrappingStoreListenerFunction = (action: BootstrappingAction, store: BootstrappingStore, unsubscribe: () => void) => void;

export class BootstrappingStore {
    #state: BootstrappingState;

    readonly #logger: Logger;
    readonly #listeners = new Set<BootstrappingStoreListenerFunction>();

    constructor(initialialState: BootstrappingState, logger: Logger) {
        this.#state = initialialState;
        this.#logger = logger;
    }

    subscribe(listener: BootstrappingStoreListenerFunction) {
        this.#listeners.add(listener);

        return () => {
            this.unsubscribe(listener);
        };
    }

    unsubscribe(listener: BootstrappingStoreListenerFunction) {
        this.#listeners.delete(listener);
    }

    dispatch(action: BootstrappingAction) {
        this.#logger.debug(`[telemetry] The "${action.type.toString()}" action has been dispatched to the bootstrapping store.`);

        const newState = this.#reducer({ ...this.#state }, action);

        this.#logger
            .withText("[telemetry] The bootstrapping state has been updated to:")
            .withObject(newState)
            .debug();

        this.#state = newState;

        // Creating a copy of the listeners in case some are removed during the looping.
        // To be honest, it might not be necessary, I simply don't know.
        new Set(this.#listeners).forEach(x => {
            x(action, this, () => {
                this.unsubscribe(x);
            });
        });
    }

    #reducer(state: BootstrappingState, action: BootstrappingAction) {
        const newState = state;

        switch (action.type) {
            case "logrocket-ready": {
                newState.isLogRocketReady = true;
                break;
            }
            case "honeycomb-ready": {
                newState.isHoneycombReady = true;
                break;
            }
            default: {
                throw new Error(`[telemetry] The bootstrapping store reducer doesn't support action type "${action.type}".`);
            }
        }

        return newState;
    }

    get state() {
        return this.#state;
    }

    get listenerCount() {
        return this.#listeners.size;
    }
}

export function createBootstrappingStore(logger: Logger) {
    return new BootstrappingStore({
        isLogRocketReady: false,
        isHoneycombReady: false
    }, logger);
}


