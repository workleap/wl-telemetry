import { NoopLogger } from "@workleap/logging";
import { test, vi } from "vitest";
import { type BootstrappingAction, type BootstrappingActionType, type BootstrappingState, BootstrappingStore } from "../src/BootstrappingStore.ts";

function createInitialBootstrappingState() {
    return {
        isLogRocketReady: false,
        isHoneycombReady: false
    } satisfies BootstrappingState;
}

test.concurrent.for([
    ["logrocket-ready", "isLogRocketReady"],
    ["honeycomb-ready", "isHoneycombReady"]
] satisfies [BootstrappingActionType, keyof BootstrappingState][]
)("when \"%s\" is dispatched, \"%s\" is true", ([actionType, stateKey], { expect }) => {
    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.dispatch({ type: actionType });

    expect(store.state[stateKey]).toBeTruthy();
});

test.concurrent("when the dispatched action type is not handled, throw an error", ({ expect }) => {
    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    // @ts-expect-error This is expected given that the purpose of the test is to validate the behavior when an unknown action type is dispatched.
    expect(() => store.dispatch({ type: "foo" })).toThrow();
});

test.concurrent("when an action is dispatched and no listener is registered, reduce the action", ({ expect }) => {
    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    expect(store.state.isLogRocketReady).toBeFalsy();

    store.dispatch({ type: "logrocket-ready" });

    expect(store.state.isLogRocketReady).toBeTruthy();
});

test.concurrent("cannot add the same listener twice", ({ expect }) => {
    const listener = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener);
    store.subscribe(listener);

    store.dispatch({ type: "logrocket-ready" });

    expect(store.listenerCount).toBe(1);
    expect(listener).toHaveBeenCalledOnce();
});

test.concurrent("when a single listener is registered and an action is dispatched, the listener is notified", ({ expect }) => {
    const listener = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener);

    const action: BootstrappingAction = { type: "logrocket-ready" };

    store.dispatch(action);

    expect(listener).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(action, store, expect.anything());
});

test.concurrent("when multiple listeners are registered and an action is dispatched, all the listeners are notified", ({ expect }) => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const listener3 = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener1);
    store.subscribe(listener2);
    store.subscribe(listener3);

    const action: BootstrappingAction = { type: "logrocket-ready" };

    store.dispatch(action);

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener1).toHaveBeenCalledWith(action, store, expect.anything());

    expect(listener2).toHaveBeenCalledOnce();
    expect(listener2).toHaveBeenCalledWith(action, store, expect.anything());

    expect(listener3).toHaveBeenCalledOnce();
    expect(listener3).toHaveBeenCalledWith(action, store, expect.anything());
});

test.concurrent("can unsubscribe a listener, when a single listener is registered", ({ expect }) => {
    const listener = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener);

    expect(store.listenerCount).toBe(1);

    store.unsubscribe(listener);

    expect(store.listenerCount).toBe(0);

    store.dispatch({ type: "logrocket-ready" });

    expect(listener).not.toHaveBeenCalled();
});

test.concurrent("can unsubscribe a listener when multiple listeners are registered", ({ expect }) => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    const listener3 = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener1);
    store.subscribe(listener2);
    store.subscribe(listener3);

    expect(store.listenerCount).toBe(3);

    store.unsubscribe(listener2);

    expect(store.listenerCount).toBe(2);

    store.dispatch({ type: "logrocket-ready" });

    expect(listener1).toHaveBeenCalledOnce();
    expect(listener3).toHaveBeenCalledOnce();

    expect(listener2).not.toHaveBeenCalled();
});

test.concurrent("can unsubscribe a listener with the function returned from it's registration", ({ expect }) => {
    const listener = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    const removeFunction = store.subscribe(listener);

    expect(store.listenerCount).toBe(1);

    removeFunction();

    expect(store.listenerCount).toBe(0);

    store.dispatch({ type: "logrocket-ready" });

    expect(listener).not.toHaveBeenCalled();
});

test.concurrent("can unsubscribe a listener from the function provided as a second argument of a listener", ({ expect }) => {
    const listener = vi.fn((_1, _2, unsubscribe) => {
        unsubscribe();
    });

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener);

    expect(store.listenerCount).toBe(1);

    store.dispatch({ type: "logrocket-ready" });
    store.dispatch({ type: "logrocket-ready" });

    expect(listener).toHaveBeenCalledOnce();
    expect(store.listenerCount).toBe(0);
});

test.concurrent("when the listener to unsubscribe doesn't exist, do nothing", ({ expect }) => {
    const listener = vi.fn();

    const state = createInitialBootstrappingState();
    const store = new BootstrappingStore(state, new NoopLogger());

    store.subscribe(listener);

    expect(store.listenerCount).toBe(1);

    store.unsubscribe(() => {});

    expect(store.listenerCount).toBe(1);

    store.dispatch({ type: "logrocket-ready" });

    expect(listener).toHaveBeenCalledOnce();
});
