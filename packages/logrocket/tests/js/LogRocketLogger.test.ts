// These tests cannot be concurrent because of global mocked on LogRocket.

import { LogLevel } from "@workleap/logging";
import LogRocket from "logrocket";
import { afterEach, describe, test, vi } from "vitest";
import { LogRocketLogger, LogRocketLoggerScope } from "../../src/js/LogRocketLogger.ts";

vi.mock("logrocket", () => ({
    default: {
        log: vi.fn(),
        warn: vi.fn(),
        error: vi.fn()
    }
}));

// Helper strongly typed to mocked instance.
const getMocks = () => {
    const mocked = LogRocket as unknown as {
        log: ReturnType<typeof vi.fn>;
        warn: ReturnType<typeof vi.fn>;
        error: ReturnType<typeof vi.fn>;
    };

    return {
        log: mocked.log,
        warn: mocked.warn,
        error: mocked.error
    };
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("LogRocketLogger", () => {
    describe.each([
        ["debug", "log", [true, false, false, false, false]],
        ["information", "log", [true, true, false, false, false]],
        ["warning", "warn", [true, true, true, false, false]],
        ["error", "error", [true, true, true, true, false]],
        ["critical", "error", [true, true, true, true, true]]
    ] satisfies [keyof LogRocketLogger, keyof typeof LogRocket, boolean[]][]
    )("can write a \"%s\" log", (loggerFunction, logRocketMethod, expectedResults) => {
        test.for([
            ["debug", LogLevel.debug],
            ["information", LogLevel.information],
            ["warning", LogLevel.warning],
            ["error", LogLevel.error],
            ["critical", LogLevel.critical]
        ] satisfies [keyof LogRocketLogger, LogLevel][])("when the log level is \"%s\"", ([, logLevel], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel });
            const logValue = "foo";

            logger[loggerFunction](logValue);

            const expectedResult = expectedResults[logLevel];

            if (expectedResult === undefined) {
                throw new Error(`There's no expected result for logLevel: "${logLevel}".`);
            }

            if (expectedResult) {
                expect(logMock).toHaveBeenCalledExactlyOnceWith(logValue);
            } else {
                expect(logMock).not.toHaveBeenCalled();
            }
        });
    });

    describe("builder", () => {
        const pairs = [
            ["debug", "log"],
            ["information", "log"],
            ["warning", "warn"],
            ["error", "error"],
            ["critical", "error"]
        ] satisfies [keyof LogRocketLogger, keyof typeof LogRocket][];

        test.for(pairs)("can build a \"%s\" log with text", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withText("Hello")
                .withText("World")
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).toHaveBeenCalledExactlyOnceWith("Hello World");
        });

        test.for(pairs)("can build a \"%s\" log with object", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const obj = { name: "John", age: 30 };

            logger
                .withText("User:")
                .withObject(obj)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "User:",
                obj
            );
        });

        test.for(pairs)("can build a \"%s\" log with error", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const error = new Error("Test error");

            logger
                .withText("Error occurred:")
                .withError(error)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "Error occurred:",
                error
            );
        });

        test.for(pairs)("can build a \"%s\" log with line changes", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const obj = { name: "John", age: 30 };
            const error = new Error("Test error");

            logger
                .withText("Processing segment")
                .withLineChange()
                .withText("on multiple lines")
                .withObject(obj)
                .withLineChange()
                .withText("failed with error")
                .withError(error)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "Processing segment",
                "\r\n",
                "on multiple lines",
                obj,
                "\r\n",
                "failed with error",
                error
            );
        });

        test.for(pairs)("can build a \"%s\" log with mixed segments", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const obj = { id: 1 };
            const error = new Error("Test error");

            logger
                .withText("Processing segment")
                .withObject(obj)
                .withText("failed with error")
                .withError(error)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            // The sequencing has been preserved because there's no styling.
            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "Processing segment",
                obj,
                "failed with error",
                error
            );
        });

        test.for(pairs)("when the text is undefined, do not log a %s entry", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withText()
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).not.toHaveBeenCalled();
        });

        test.for(pairs)("when the object is undefined, do not log a %s entry", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withObject()
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).not.toHaveBeenCalled();
        });

        test.for(pairs)("when the error is undefined, do not log a %s entry", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withError()
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            expect(logMock).not.toHaveBeenCalled();
        });
    });

    describe("scope", () => {
        test("starting a scope always return a new instance", ({ expect }) => {
            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            const scope1 = logger.startScope("foo");
            const scope2 = logger.startScope("bar");

            expect(scope1).not.toBe(scope2);
        });

        test("a scope inherit from the root logger log level", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.error });
            const scope = logger.startScope("foo");

            scope.information("bar");
            scope.end();

            expect(logMock).not.toHaveBeenCalled();
        });

        test("when a scope is started, the root logger can still write logs", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const logValue = "bar";

            logger.startScope("foo");
            logger.information(logValue);

            expect(logMock).toHaveBeenCalledExactlyOnceWith(logValue);
        });
    });

    describe("line change", () => {
        test("can add a single line change", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withText("First line")
                .withLineChange()
                .withText("Second line")
                .debug();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "First line",
                "\r\n",
                "Second line"
            );
        });

        test("can add multiple line changes", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withText("First line")
                .withLineChange()
                .withLineChange()
                .withLineChange()
                .withText("Last line")
                .debug();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "First line",
                "\r\n",
                "\r\n",
                "\r\n",
                "Last line"
            );
        });

        test("can add multiple lines with text followed by an object", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const obj1 = { id: 1 };
            const obj2 = { id: 2 };
            const obj3 = { id: 3 };

            logger
                .withText("First line")
                .withObject(obj1)
                .withLineChange()
                .withText("Second line")
                .withObject(obj2)
                .withLineChange()
                .withText("Third line")
                .withObject(obj3)
                .debug();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "First line",
                obj1,
                "\r\n",
                "Second line",
                obj2,
                "\r\n",
                "Third line",
                obj3
            );
        });
    });

    describe("leading space", () => {
        test("can remove the leading space for 2 text segments", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });

            logger
                .withText("First")
                .withText("Second", { leadingSpace: false })
                .debug();

            expect(logMock).toHaveBeenCalledExactlyOnceWith("FirstSecond");
        });

        test("can remove the leading space from multiple mixed text segments", ({ expect }) => {
            const logMock = getMocks().log;

            const logger = new LogRocketLogger({ logLevel: LogLevel.debug });
            const obj = { id: 1 };

            logger
                .withText("Text 1", { leadingSpace: false })
                .withText("Text 2", { leadingSpace: false })
                .withObject(obj)
                .withText("Text 3", { leadingSpace: false })
                .withText("Text 4", { leadingSpace: false })
                .withLineChange()
                .withText("Text 5", { leadingSpace: false })
                .debug();

            expect(logMock).toHaveBeenCalledExactlyOnceWith(
                "Text 1Text 2",
                obj,
                "Text 3Text 4",
                "\r\n",
                "Text 5"
            );
        });
    });
});

describe("LogRocketLoggerScope", () => {
    describe.each([
        ["debug", "log", [true, false, false, false, false]],
        ["information", "log", [true, true, false, false, false]],
        ["warning", "warn", [true, true, true, false, false]],
        ["error", "error", [true, true, true, true, false]],
        ["critical", "error", [true, true, true, true, true]]
    ] satisfies [keyof LogRocketLoggerScope, keyof typeof LogRocket, boolean[]][])("can write a \"%s\" log", (loggerFunction, logRocketMethod, expectedResults) => {
        test.for([
            ["debug", LogLevel.debug],
            ["information", LogLevel.information],
            ["warning", LogLevel.warning],
            ["error", LogLevel.error],
            ["critical", LogLevel.critical]
        ] satisfies [keyof LogRocketLoggerScope, LogLevel][])("when the log level is \"%s\"", ([, logLevel], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", logLevel);
            const logValue = "bar";

            scope[loggerFunction](logValue);
            scope.end();

            const expectedResult = expectedResults[logLevel];

            if (expectedResult === undefined) {
                throw new Error(`There's no expected result for logLevel: "${logLevel}".`);
            }

            if (expectedResult) {
                if ((loggerFunction === "debug" || loggerFunction === "information") && (logLevel === LogLevel.debug || logLevel === LogLevel.information)) {
                    expect(logMock).toHaveBeenCalledTimes(2);
                } else {
                    expect(logMock).toHaveBeenCalledOnce();
                }
            } else {
                expect(logMock).not.toHaveBeenCalled();
            }
        });
    });

    describe("builder", () => {
        const pairs = [
            ["debug", "log"],
            ["information", "log"],
            ["warning", "warn"],
            ["error", "error"],
            ["critical", "error"]
        ] satisfies [keyof LogRocketLoggerScope, keyof typeof LogRocket][];

        test.for(pairs)("can build a \"%s\" log with text", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withText("Hello")
                .withText("World")
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            if (logRocketMethod === "log") {
                expect(logMock).toHaveBeenCalledTimes(2);
                expect(logMock).toHaveBeenCalledWith("foo");
            } else {
                expect(logMock).toHaveBeenCalledOnce();

                expect(getMocks().log).toHaveBeenCalledExactlyOnceWith("foo");
            }

            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "Hello World"
            );
        });

        test.for(pairs)("can build a \"%s\" log with object", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);
            const obj = { name: "John", age: 30 };

            scope
                .withText("User:")
                .withObject(obj)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            if (logRocketMethod === "log") {
                expect(logMock).toHaveBeenCalledTimes(2);
                expect(logMock).toHaveBeenCalledWith("foo");
            } else {
                expect(logMock).toHaveBeenCalledOnce();

                expect(getMocks().log).toHaveBeenCalledExactlyOnceWith("foo");
            }

            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "User:",
                obj
            );
        });

        test.for(pairs)("can build a \"%s\" log with error", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);
            const error = new Error("Test error");

            scope
                .withText("Error occurred:")
                .withError(error)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            if (logRocketMethod === "log") {
                expect(logMock).toHaveBeenCalledTimes(2);
                expect(logMock).toHaveBeenCalledWith("foo");
            } else {
                expect(logMock).toHaveBeenCalledOnce();

                expect(getMocks().log).toHaveBeenCalledExactlyOnceWith("foo");
            }

            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "Error occurred:",
                error
            );
        });

        // eslint-disable-next-line vitest/no-identical-title
        test.for(pairs)("can build a \"%s\" log with error", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);
            const obj = { name: "John", age: 30 };
            const error = new Error("Test error");

            scope
                .withText("Processing segment")
                .withLineChange()
                .withText("on multiple lines")
                .withObject(obj)
                .withLineChange()
                .withText("failed with error")
                .withError(error)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            if (logRocketMethod === "log") {
                expect(logMock).toHaveBeenCalledTimes(2);
                expect(logMock).toHaveBeenCalledWith("foo");
            } else {
                expect(logMock).toHaveBeenCalledOnce();

                expect(getMocks().log).toHaveBeenCalledExactlyOnceWith("foo");
            }

            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "Processing segment",
                "\r\n",
                "on multiple lines",
                obj,
                "\r\n",
                "failed with error",
                error
            );
        });

        test.for(pairs)("can build a \"%s\" log with mixed segments", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);
            const obj = { id: 1 };
            const error = new Error("Test error");

            scope
                .withText("Processing segment")
                .withObject(obj)
                .withText("failed with error")
                .withError(error)
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            if (logRocketMethod === "log") {
                expect(logMock).toHaveBeenCalledTimes(2);
                expect(logMock).toHaveBeenCalledWith("foo");
            } else {
                expect(logMock).toHaveBeenCalledOnce();

                expect(getMocks().log).toHaveBeenCalledExactlyOnceWith("foo");
            }

            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "Processing segment",
                obj,
                "failed with error",
                error
            );
        });

        test.for(pairs)("when the text is undefined, do not log a %s entry", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withText()
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            expect(logMock).not.toHaveBeenCalled();
        });

        test.for(pairs)("when the object is undefined, do not log a %s entry", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withObject()
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            expect(logMock).not.toHaveBeenCalled();
        });

        test.for(pairs)("when the error is undefined, do not log a %s entry", ([loggerFunction, logRocketMethod], { expect }) => {
            const logMock = getMocks()[logRocketMethod];

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withError()
                // eslint-disable-next-line no-unexpected-multiline
                [loggerFunction]();

            scope.end();

            expect(logMock).not.toHaveBeenCalled();
        });
    });

    describe("end", () => {
        test("can dismiss scope without logging", ({ expect }) => {
            const logMock = getMocks().log;

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope.debug("This should not appear");
            scope.end({ dismiss: true });

            expect(logMock).not.toHaveBeenCalled();
        });
    });

    describe("line change", () => {
        test("can add a single line change", ({ expect }) => {
            const logMock = getMocks().log;

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withText("First line")
                .withLineChange()
                .withText("Second line")
                .debug();

            scope.end();

            expect(logMock).toHaveBeenCalledTimes(2);
            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "First line",
                "\r\n",
                "Second line"
            );
        });

        test("can add multiple line changes", ({ expect }) => {
            const logMock = getMocks().log;

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withText("First line")
                .withLineChange()
                .withLineChange()
                .withLineChange()
                .withText("Last line")
                .debug();

            scope.end();

            expect(logMock).toHaveBeenCalledTimes(2);
            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "First line",
                "\r\n",
                "\r\n",
                "\r\n",
                "Last line"
            );
        });

        test("can add multiple lines with text followed by an object", ({ expect }) => {
            const logMock = getMocks().log;

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);
            const obj1 = { id: 1 };
            const obj2 = { id: 2 };
            const obj3 = { id: 3 };

            scope
                .withText("First line")
                .withObject(obj1)
                .withLineChange()
                .withText("Second line")
                .withObject(obj2)
                .withLineChange()
                .withText("Third line")
                .withObject(obj3)
                .debug();

            scope.end();

            expect(logMock).toHaveBeenCalledTimes(2);
            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "First line",
                obj1,
                "\r\n",
                "Second line",
                obj2,
                "\r\n",
                "Third line",
                obj3
            );
        });
    });

    describe("leading space", () => {
        test("can remove the leading space for 2 text segments", ({ expect }) => {
            const logMock = getMocks().log;

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);

            scope
                .withText("First")
                .withText("Second", { leadingSpace: false })
                .debug();

            scope.end();

            expect(logMock).toHaveBeenCalledTimes(2);
            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "FirstSecond"
            );
        });

        test("can remove the leading space from multiple mixed text segments", ({ expect }) => {
            const logMock = getMocks().log;

            const scope = new LogRocketLoggerScope("foo", LogLevel.debug);
            const obj = { id: 1 };

            scope
                .withText("Text 1", { leadingSpace: false })
                .withText("Text 2", { leadingSpace: false })
                .withObject(obj)
                .withText("Text 3", { leadingSpace: false })
                .withText("Text 4", { leadingSpace: false })
                .withLineChange()
                .withText("Text 5", { leadingSpace: false })
                .debug();

            scope.end();

            expect(logMock).toHaveBeenCalledTimes(2);
            expect(logMock).toHaveBeenCalledWith(
                "    ",
                "Text 1Text 2",
                obj,
                "Text 3Text 4",
                "\r\n",
                "Text 5"
            );
        });
    });
});
