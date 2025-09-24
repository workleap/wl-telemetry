import { type Logger, type LoggerOptions, type LoggerScope, type LoggerScopeEndOptions, LogLevel, type LogOptions } from "@workleap/logging";
import LogRocket from "logrocket";

interface Segment {
    type: "text" | "object" | "error" | "line-change";
    value: unknown;
    options?: LogOptions;
}

function appendText(currentText: string, newText: string, options: { leadingSpace?: boolean } = {}) {
    const {
        leadingSpace = true
    } = options;

    if (currentText.length > 0) {
        return `${currentText}${leadingSpace ? " " : ""}${newText}`;
    }

    return newText;
}

/**
 * Formats an array of Segment objects into a list of log arguments.
 *
 * - Consecutive "text" segments are concatenated into a single string, separated by spaces (unless `leadingSpace` is false).
 * - Non-"text" segments ("object", "error", "line-change") are added directly to the output array.
 * - When a non-"text" segment is encountered, any buffered text is flushed to the output before adding the segment.
 * - At the end, any remaining buffered text is flushed.
 */
function formatSegments(segments: Segment[]) {
    const logs: unknown[] = [];

    let textBuffer = "";

    const flushText = () => {
        if (textBuffer.length > 0) {
            logs.push(textBuffer);

            textBuffer = "";
        }
    };

    segments.forEach(x => {
        if (x.type === "text") {
            textBuffer = appendText(textBuffer, x.value as string, {
                leadingSpace: x.options?.leadingSpace
            });
        } else {
            flushText();

            logs.push(x.value);
        }
    });

    // If the last segment is text, the text buffer hasn't been flushed.
    flushText();

    return logs;
}

type LogFunction = (...rest: unknown[]) => void;
type PendingLog = () => void;

/**
 * An scope implementation for the LogRocket logger.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class LogRocketLoggerScope implements LoggerScope {
    readonly #logLevel: LogLevel;
    readonly #label: string;

    #segments: Segment[] = [];
    #pendingLogs: PendingLog[] = [];
    #hasEnded: boolean = false;

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    constructor(label: string, logLevel: LogLevel) {
        this.#logLevel = logLevel;
        this.#label = label;
    }

    #resetSegments() {
        this.#segments = [];
    }

    #log(fct: LogFunction, threshold: LogLevel) {
        if (this.#segments.length > 0) {
            if (this.#logLevel <= threshold) {
                // Required closure to preserved the current log items for when they will be formatted when the scope is ended.
                const segments = this.#segments;

                this.#pendingLogs.push(() => {
                    const formattedSegments = formatSegments(segments);
                    // Since LogRocket session replay UI doesn't have a concept similar to console.group,
                    // the logs of a group are indented by 4 spaces under the group label.
                    formattedSegments.unshift("    ");

                    fct(...formattedSegments);
                });
            }

            this.#resetSegments();
        }
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withText(text?: string, options?: Omit<LogOptions, "style">) {
        if (text) {
            this.#segments.push({
                type: "text",
                value: text,
                options
            });
        }

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withError(error?: Error) {
        if (error) {
            this.#segments.push({
                type: "error",
                value: error
            });
        }

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withObject(obj?: unknown) {
        if (obj) {
            this.#segments.push({
                type: "object",
                value: obj
            });
        }

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withLineChange() {
        this.#segments.push({
            type: "line-change",
            value: "\r\n"
        });

        return this;
    }

    /**
     * Write a debug log. The log will be processed only if the logger LogLevel is >= debug.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    debug(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.log, LogLevel.debug);
    }

    /**
     * Write an information log. The log will be processed only if the logger LogLevel is >= information.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    information(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.log, LogLevel.information);
    }

    /**
     * Write a warning log. The log will be processed only if the logger LogLevel is >= warning.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    warning(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.warn, LogLevel.warning);
    }

    /**
     * Write an error log. The log will be processed only if the logger LogLevel is >= error.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    error(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.error, LogLevel.error);
    }

    /**
     * Write a critical log. The log will be processed only if the logger LogLevel is >= critical.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    critical(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.error, LogLevel.critical);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    end(options: LoggerScopeEndOptions = {}) {
        const {
            dismiss = false
        } = options;

        if (!this.#hasEnded) {
            this.#hasEnded = true;

            if (!dismiss) {
                if (this.#pendingLogs.length > 0) {
                    LogRocket.log(this.#label);

                    this.#pendingLogs.forEach(x => {
                        x();
                    });

                    this.#pendingLogs = [];
                }
            }
        }
    }
}

/**
 * A logger implementation for LogRocket.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class LogRocketLogger implements Logger {
    readonly #logLevel: LogLevel;
    #segments: Segment[] = [];

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    constructor(options: LoggerOptions = {}) {
        const {
            logLevel = LogLevel.debug
        } = options;

        this.#logLevel = logLevel;
    }

    #resetSegments() {
        this.#segments = [];
    }

    #log(fct: LogFunction, threshold: LogLevel) {
        if (this.#segments.length > 0) {
            if (this.#logLevel <= threshold) {
                const formattedSegments = formatSegments(this.#segments);

                fct(...formattedSegments);
            }

            this.#resetSegments();
        }
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    getName() {
        return LogRocketLogger.name;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withText(text?: string, options?: Omit<LogOptions, "style">) {
        if (text) {
            this.#segments.push({
                type: "text",
                value: text,
                options
            });
        }

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withError(error?: Error) {
        if (error) {
            this.#segments.push({
                type: "error",
                value: error
            });
        }

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withObject(obj?: unknown) {
        if (obj) {
            this.#segments.push({
                type: "object",
                value: obj
            });
        }

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withLineChange() {
        this.#segments.push({
            type: "line-change",
            value: "\r\n"
        });

        return this;
    }

    /**
     * Write a debug log. The log will be processed only if the logger LogLevel is >= debug.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    debug(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.log, LogLevel.debug);
    }

    /**
     * Write an information log. The log will be processed only if the logger LogLevel is >= information.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    information(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.log, LogLevel.information);
    }

    /**
     * Write a warning log. The log will be processed only if the logger LogLevel is >= warning.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    warning(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.warn, LogLevel.warning);
    }

    /**
     * Write an error log. The log will be processed only if the logger LogLevel is >= error.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    error(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.error, LogLevel.error);
    }

    /**
     * Write a critical log. The log will be processed only if the logger LogLevel is >= critical.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    critical(log?: string) {
        if (log) {
            this.#segments.push({
                type: "text",
                value: log
            });
        }

        this.#log(LogRocket.error, LogLevel.critical);
    }

    /**
     * Start a new logging scope. The scope will inherit the LogLevel of the root logger.
     * @see {@link https://workleap.github.io/wl-logging}
     */
    startScope(label: string) {
        return new LogRocketLoggerScope(label, this.#logLevel);
    }
}
