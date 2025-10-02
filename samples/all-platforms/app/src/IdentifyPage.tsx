import { useCommonRoomInstrumentationClient } from "@workleap/common-room/react";
import {
    useHoneycombInstrumentationClient,
    useLogRocketInstrumentationClient,
    useMixpanelClient,
    useMixpanelTrackingFunction,
    type LogRocketWorkleapPlatformIdentification
} from "@workleap/telemetry/react";
import LogRocket from "logrocket";
import { useState, type ChangeEvent, type FormEvent } from "react";

export function IdentifyPage() {
    const [form, setForm] = useState<LogRocketWorkleapPlatformIdentification>({
        userId: crypto.randomUUID(),
        organizationId: crypto.randomUUID(),
        organizationName: "Contoso",
        isMigratedToWorkleap: true,
        isAdmin: true,
        isOrganizationCreator: false,
        isExecutive: {
            wov: true,
            lms: true,
            onb: false,
            sks: true,
            wpm: true,
            pbd: false,
            cmp: false
        },
        isCollaborator: {
            wov: true,
            lms: false,
            onb: false,
            sks: false,
            wpm: true,
            pbd: false,
            cmp: false
        },
        isReportingManager: true,
        isTeamManager: false,
        planCode: {
            wov: "123",
            lms: "123",
            onb: "123",
            sks: "123",
            wpm: "123",
            pbd: "123",
            cmp: "123"
        }
    });

    const track = useMixpanelTrackingFunction();

    track("Page View", {
        "Page": "Identify Page"
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const logRocketClient = useLogRocketInstrumentationClient();
    const honeycombClient = useHoneycombInstrumentationClient();
    const mixpanelClient = useMixpanelClient();
    const commonRoomClient = useCommonRoomInstrumentationClient();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        console.log("Form submitted to identify the user with telemetry platforms", form);

        LogRocket.identify(form.userId, {
            ...logRocketClient.createWorkleapPlatformDefaultUserTraits(form),
            "Custom Trait": "Toto"
        });

        honeycombClient.setGlobalSpanAttribute("app.user", JSON.stringify(form));
        mixpanelClient.setGlobalEventProperty("User", JSON.stringify(form));
        commonRoomClient.identify("pat-2025-08-05-v10@gmail.com");
    };

    return (
        <>
            <h1>Identify</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: "flex" }}>
                    <label htmlFor="userId" style={{ marginRight: "0.5rem" }}>User ID</label>
                    <input name="userId" type="text" value={form.userId} onChange={handleChange} />
                </div>
                <div style={{ display: "flex" }}>
                    <label htmlFor="organizationId" style={{ marginRight: "0.5rem" }}>Organization ID</label>
                    <input name="organizationId" type="text" value={form.organizationId} onChange={handleChange} />
                </div>
                <div style={{ display: "flex" }}>
                    <label htmlFor="organizationName" style={{ marginRight: "0.5rem" }}>Organization Name</label>
                    <input name="organizationName" type="text" value={form.organizationName} onChange={handleChange} />
                </div>
                <div style={{ display: "flex" }}>
                    <label htmlFor="isMigratedToWorkleap" style={{ marginRight: "0.5rem" }}>Is Migrated to Workleap?</label>
                    <input name="isMigratedToWorkleap" type="checkbox" checked={form.isMigratedToWorkleap} onChange={handleChange} />
                </div>
                <div style={{ display: "flex" }}>
                    <label htmlFor="isAdmin" style={{ marginRight: "0.5rem" }}>Is Admin?</label>
                    <input name="isAdmin" type="checkbox" checked={form.isAdmin} onChange={handleChange} />
                </div>
                <div style={{ display: "flex" }}>
                    <label htmlFor="isOrganizationCreator" style={{ marginRight: "0.5rem" }}>Is Organization Creator?</label>
                    <input name="isOrganizationCreator" type="checkbox" checked={form.isOrganizationCreator} onChange={handleChange} />
                </div>
                <button type="submit">Identify</button>
            </form>
        </>
    );
}
