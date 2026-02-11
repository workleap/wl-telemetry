import { AdditionalMixpanelPropertiesProvider, useMixpanelTrackingFunction } from "@workleap/telemetry/react";
import { useCallback } from "react";

const FooProp = {
    foo: "bar"
};

const JohnProp = {
    john: "doe"
};

function NestedTrack({ buttonLabel }: { buttonLabel: string }) {
    const track = useMixpanelTrackingFunction();

    const handleTrack = useCallback(() => {
        track("event", {});
    }, []);

    return (
        <button type="button" onClick={handleTrack}>{buttonLabel}</button>
    );
}

export function MixpanelPage() {
    const trackWithProductId = useMixpanelTrackingFunction({
        productId: "scoped-product-id"
    });

    const trackWithTargetProductId = useMixpanelTrackingFunction({
        targetProductId: "target-product-id"
    });

    const trackWithBothIds = useMixpanelTrackingFunction({
        productId: "scoped-product-id",
        targetProductId: "target-product-id"
    });

    const handleTrackWithProductId = useCallback(() => {
        trackWithProductId("event", {});
    }, [trackWithProductId]);

    const handleTrackWithTargetProductId = useCallback(() => {
        trackWithTargetProductId("event", {})
    }, [trackWithTargetProductId]);

    const handleTrackWithBothIds = useCallback(() => {
        trackWithBothIds("event", {});
    }, [trackWithBothIds]);

    return (
        <>
            <button type="button" onClick={handleTrackWithProductId}>Track with a scoped product id</button>
            <br />
            <button type="button" onClick={handleTrackWithTargetProductId}>Track with a target product id</button>
            <br />
            <button type="button" onClick={handleTrackWithBothIds}>Track with both ids</button>
            <br />
            <AdditionalMixpanelPropertiesProvider value={FooProp}>
                <NestedTrack buttonLabel="Track with Foo" />
                <br />
                <AdditionalMixpanelPropertiesProvider value={JohnProp}>
                    <NestedTrack buttonLabel="Track with Foo & John" />
                </AdditionalMixpanelPropertiesProvider>
            </AdditionalMixpanelPropertiesProvider>
        </>
    );
}
