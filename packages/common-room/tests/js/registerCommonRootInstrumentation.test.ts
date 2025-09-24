import { afterEach, test, vi } from "vitest";
import { __resetRegistrationGuard, registerCommonRoomInstrumentation } from "../../src/js/registerCommonRoomInstrumentation.ts";

afterEach(() => {
    vi.resetAllMocks();

    __resetRegistrationGuard();
});

test("when Common Room instrumentation has not been registered, register the instrumentation", async ({ expect }) => {
    const createElementMock = vi.spyOn(document, "createElement").mockImplementation(() => {
        return {} as unknown as HTMLScriptElement;
    });

    const appendChildMock = vi.spyOn(document.head, "appendChild").mockImplementation(element => {
        (element as HTMLScriptElement).onload?.(new Event("foo"));

        return element;
    });

    registerCommonRoomInstrumentation("123");

    await vi.waitFor(() => expect(createElementMock).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(appendChildMock).toHaveBeenCalledTimes(1));
});

test("when Common Room instrumentation has already been registered, throw an error", ({ expect }) => {
    vi.spyOn(document, "createElement").mockImplementation(() => {
        return {} as unknown as HTMLScriptElement;
    });

    vi.spyOn(document.head, "appendChild").mockImplementation(element => {
        (element as HTMLScriptElement).onload?.(new Event("foo"));

        return element;
    });

    registerCommonRoomInstrumentation("123");

    expect(() => registerCommonRoomInstrumentation("123")).toThrow("[common-room] The Common Room instrumentation has already been registered. Did you call the \"registerCommonRoomInstrumentation\" function twice?");
});
