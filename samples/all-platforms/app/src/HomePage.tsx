import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";

export function HomePage() {
    const track = useMixpanelTrackingFunction();

    track("Page View", {
        "Page": "Home Page"
    });

    return (
        <>
            <h1>Home</h1>
            <div>This is the homepage!</div>
        </>
    );
}
