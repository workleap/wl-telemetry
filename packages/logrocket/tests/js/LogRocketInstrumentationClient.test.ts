import { TelemetryContext } from "@workleap/telemetry";
import { describe, test } from "vitest";
import { LogRocketInstrumentationClient } from "../../src/js/LogRocketInstrumentationClient.ts";

describe("createWorkleapPlatformDefaultUserTraits", () => {
    test.concurrent("required user traits are returned", ({ expect }) => {
        const identification = {
            userId: "123",
            organizationId: "456",
            organizationName: "Test Organization",
            isMigratedToWorkleap: true,
            isOrganizationCreator: false,
            isAdmin: false
        };

        const telemetryContext = new TelemetryContext("789", "device-1");
        const client = new LogRocketInstrumentationClient(telemetryContext);

        const result = client.createWorkleapPlatformDefaultUserTraits(identification);

        expect(result["User Id"]).toEqual(identification.userId);
        expect(result["Organization Id"]).toEqual(identification.organizationId);
        expect(result["Organization Name"]).toEqual(identification.organizationName);
        expect(result["Is Migrated To Workleap"]).toEqual(identification.isMigratedToWorkleap);
        expect(result["Is Admin"]).toEqual(identification.isAdmin);
    });

    test.concurrent("optional user traits with no value provided are skipped", ({ expect }) => {
        const identification = {
            userId: "123",
            organizationId: "456",
            organizationName: "Test Organization",
            isMigratedToWorkleap: true,
            isAdmin: false
        };

        const telemetryContext = new TelemetryContext("789", "device-1");
        const client = new LogRocketInstrumentationClient(telemetryContext);

        const result = client.createWorkleapPlatformDefaultUserTraits(identification);

        expect(Object.keys(result)).not.toContain(["Is Organization Creator", "Is Executive", "Is Collaborator", "Is Reporting Manager", "Is Team Manager"]);
        expect(Object.keys(result)).not.toContain(["Is Executive - Officevibe", "Is Executive - LMS", "Is Executive - Onboarding", "Is Executive - Skills", "Is Executive - Performance", "Is Executive - Pingboard"]);
        expect(Object.keys(result)).not.toContain(["Is Collaborator - Officevibe", "Is Collaborator - LMS", "Is Collaborator - Onboarding", "Is Collaborator - Skills", "Is Collaborator - Performance", "Is Collaborator - Pingboard"]);
        expect(Object.keys(result)).not.toContain(["Plan Code - Officevibe", "Plan Code - LMS", "Plan Code - Onboarding", "Plan Code - Skills", "Plan Code - Performance", "Plan Code - Pingboard"]);
    });

    test.concurrent("optional user traits with values provided are returned", ({ expect }) => {
        const identification = {
            userId: "123",
            organizationId: "456",
            organizationName: "Test Organization",
            isMigratedToWorkleap: true,
            isOrganizationCreator: false,
            isAdmin: false,
            isExecutive: {
                wov: true,
                cmp: true
            },
            isCollaborator: {
                wov: true,
                cmp: true
            },
            isReportingManager: false,
            isTeamManager: false,
            planCode: {
                wov: "123",
                cmp: "123"
            }
        };

        const telemetryContext = new TelemetryContext("789", "device-1");
        const client = new LogRocketInstrumentationClient(telemetryContext);

        const result = client.createWorkleapPlatformDefaultUserTraits(identification);

        expect(result["Is Organization Creator"]).toEqual(identification.isOrganizationCreator);
        expect(result["Is Executive"]).toEqual(true);
        expect(result["Is Executive - Officevibe"]).toEqual(identification.isExecutive.wov);
        expect(result["Is Collaborator"]).toEqual(true);
        expect(result["Is Collaborator - Officevibe"]).toEqual(identification.isCollaborator.wov);
        expect(result["Is Team Manager"]).toEqual(identification.isTeamManager);
        expect(result["Is Reporting Manager"]).toEqual(identification.isReportingManager);
        expect(result["Plan Code - Officevibe"]).toEqual(identification.planCode.wov);

        expect(result["Is Executive - Compensation"]).toEqual(identification.isExecutive.cmp);
        expect(result["Is Collaborator - Compensation"]).toEqual(identification.isCollaborator.cmp);
        expect(result["Plan Code - Compensation"]).toEqual(identification.planCode.cmp);

        expect(Object.keys(result)).not.toContain(["Is Executive - LMS", "Is Executive - Onboarding", "Is Executive - Skills", "Is Executive - Performance", "Is Executive - Pingboard"]);
        expect(Object.keys(result)).not.toContain(["Is Collaborator - LMS", "Is Collaborator - Onboarding", "Is Collaborator - Skills", "Is Collaborator - Performance", "Is Collaborator - Pingboard"]);
        expect(Object.keys(result)).not.toContain(["Plan Code - LMS", "Plan Code - Onboarding", "Plan Code - Skills", "Plan Code - Performance", "Plan Code - Pingboard"]);
    });

    test.concurrent("when a telemetry context is available, telemetry user traits are returned", ({ expect }) => {
        const identification = {
            userId: "123",
            organizationId: "456",
            organizationName: "Test Organization",
            isMigratedToWorkleap: true,
            isOrganizationCreator: false,
            isAdmin: false
        };

        const telemetryContext = new TelemetryContext("789", "device-1");
        const client = new LogRocketInstrumentationClient(telemetryContext);

        const result = client.createWorkleapPlatformDefaultUserTraits(identification);

        expect(result["User Id"]).toEqual(identification.userId);
        expect(result["Organization Id"]).toEqual(identification.organizationId);
        expect(result["Organization Name"]).toEqual(identification.organizationName);
        expect(result["Is Migrated To Workleap"]).toEqual(identification.isMigratedToWorkleap);
        expect(result["Is Admin"]).toEqual(identification.isAdmin);
        expect(result["Device Id"]).toEqual(telemetryContext.deviceId);
        expect(result["Telemetry Id"]).toEqual(telemetryContext.telemetryId);
    });
});
