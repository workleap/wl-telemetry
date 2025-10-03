import { BrowserConsoleLogger, CompositeLogger, type CompositeLoggerScope } from "@workleap/logging";
import { LogRocketLogger } from "@workleap/logrocket";
import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";
import { useCallback, useState } from "react";

function getShortId() {
    return crypto.randomUUID().slice(0, 8);
}

function generateRandomObject() {
    const id = Math.floor(Math.random() * 1000);
    const value = Math.random().toString(36).substring(2, 8);

    return { id, value };
}

function generateRandomError(): Error {
    const messages = [
        "Something went wrong",
        "Unexpected failure",
        "Unknown error occurred",
        "Operation timed out",
        "Internal server error"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return new Error(randomMessage);
}

//////////////////////

const logger = new CompositeLogger([new BrowserConsoleLogger(), new LogRocketLogger()]);

function useLogCallback(level: string) {
    return useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        logger[level]();
    }, [level]);
}

function useLogWithTextCallback(level: string) {
    return useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        logger[level](`Log: ${getShortId()}`);
    }, [level]);
}

function LoggerSection() {
    const handleTextClick = useCallback(() => {
        logger.withText(`Text: ${getShortId()}`);
    }, []);

    const handleObjectClick = useCallback(() => {
        logger.withObject(generateRandomObject());
    }, []);

    const handleErrorClick = useCallback(() => {
        logger.withError(generateRandomError());
    }, []);

    const handleNoLeadingSpaceText = useCallback(() => {
        logger.withText(`Text: ${getShortId()}`, {
            leadingSpace: false
        });
    }, []);

    const handleLineChange = useCallback(() => {
        logger.withLineChange();
    }, []);

    return (
        <>
            <h2>Logger</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={handleTextClick}>Text</button>
                    <button type="button" onClick={handleObjectClick}>Object</button>
                    <button type="button" onClick={handleErrorClick}>Error</button>
                    <button type="button" onClick={handleNoLeadingSpaceText}>No leading space text</button>
                    <button type="button" onClick={handleLineChange}>Line change</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogCallback("debug")}>Debug</button>
                    <button type="button" onClick={useLogWithTextCallback("debug")}>Debug with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogCallback("information")}>Information</button>
                    <button type="button" onClick={useLogWithTextCallback("information")}>Information with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogCallback("warning")}>Warning</button>
                    <button type="button" onClick={useLogWithTextCallback("warning")}>Warning with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogCallback("error")}>Error</button>
                    <button type="button" onClick={useLogWithTextCallback("error")}>Error with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogCallback("critical")}>Critical</button>
                    <button type="button" onClick={useLogWithTextCallback("critical")}>Critical with text</button>
                </div>
            </div>
        </>
    );
}

//////////////////////

function useLogRocketScopeLogCallback(level: string, scope?: CompositeLoggerScope) {
    return useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        scope?.[level]();
    }, [scope, level]);
}

function useLogRocketScopeLogWithTextCallback(level: string, scope?: CompositeLoggerScope) {
    return useCallback(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        scope?.[level](`Log: ${getShortId()}`);
    }, [scope, level]);
}

function ScopeSection() {
    const [scope, setScope] = useState<CompositeLoggerScope>();

    const handleCreateScopeClick = useCallback(() => {
        if (scope) {
            scope.end({ dismiss: true });
        }

        setScope(logger.startScope(getShortId()));
    }, [scope]);

    const handleEndScopeClick = useCallback(() => {
        scope?.end();
        setScope(undefined);
    }, [scope]);

    const handleTextClick = useCallback(() => {
        scope?.withText(`Text: ${getShortId()}`);
    }, [scope]);

    const handleObjectClick = useCallback(() => {
        scope?.withObject(generateRandomObject());
    }, [scope]);

    const handleErrorClick = useCallback(() => {
        scope?.withError(generateRandomError());
    }, [scope]);

    return (
        <>
            <h3>Scope</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={handleCreateScopeClick}>Create scope</button>
                    <button type="button" onClick={handleEndScopeClick}>End scope</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={handleTextClick}>Text</button>
                    <button type="button" onClick={handleObjectClick}>Object</button>
                    <button type="button" onClick={handleErrorClick}>Error</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogRocketScopeLogCallback("debug", scope)}>Debug</button>
                    <button type="button" onClick={useLogRocketScopeLogWithTextCallback("debug", scope)}>Debug with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogRocketScopeLogCallback("information", scope)}>Information</button>
                    <button type="button" onClick={useLogRocketScopeLogWithTextCallback("information", scope)}>Information with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogRocketScopeLogCallback("warning", scope)}>Warning</button>
                    <button type="button" onClick={useLogRocketScopeLogWithTextCallback("warning", scope)}>Warning with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogRocketScopeLogCallback("error", scope)}>Error</button>
                    <button type="button" onClick={useLogRocketScopeLogWithTextCallback("error", scope)}>Error with text</button>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button type="button" onClick={useLogRocketScopeLogCallback("critical", scope)}>Critical</button>
                    <button type="button" onClick={useLogRocketScopeLogWithTextCallback("critical", scope)}>Critical with text</button>
                </div>
            </div>
        </>
    );
}

//////////////////////

export function LogRocketLoggerPage() {
    const track = useMixpanelTrackingFunction();

    track("Page View", {
        "Page": "LogRocket Logger"
    });

    return (
        <>
            <h1>LogRocket Logger</h1>
            <LoggerSection />
            <ScopeSection />
        </>
    );
}
