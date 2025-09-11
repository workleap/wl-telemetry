import { getTelemetryContext } from "@workleap/telemetry";
import { isDefined } from "./assertions.ts";

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface LogRocketIdentification {
    userId: string;
    organizationId: string;
    organizationName: string;
    isMigratedToWorkleap: boolean;
    isAdmin: boolean;
    isOrganizationCreator?: boolean;
    isExecutive?: {
        wov?: boolean;
        lms?: boolean;
        onb?: boolean;
        sks?: boolean;
        wpm?: boolean;
        pbd?: boolean;
        cmp?: boolean;
    };
    isCollaborator?: {
        wov?: boolean;
        lms?: boolean;
        onb?: boolean;
        sks?: boolean;
        wpm?: boolean;
        pbd?: boolean;
        cmp?: boolean;
    };
    isReportingManager?: boolean;
    isTeamManager?: boolean;
    planCode?: {
        wov?: string;
        lms?: string;
        onb?: string;
        sks?: string;
        wpm?: string;
        pbd?: string;
        cmp?: string;
    };
}

/**
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export interface LogRocketUserTraits extends Record<string, unknown> {
    "User Id": string;
    "Organization Id": string;
    "Organization Name": string;
    "Is Migrated To Workleap": boolean;
    "Is Admin": boolean;
    "Device Id": string;
    "Telemetry Id": string;
    "Is Organization Creator"?: boolean;
    "Is Executive"?: boolean;
    "Is Executive - Officevibe"?: boolean;
    "Is Executive - LMS"?: boolean;
    "Is Executive - Onboarding"?: boolean;
    "Is Executive - Skills"?: boolean;
    "Is Executive - Performance"?: boolean;
    "Is Executive - Pingboard"?: boolean;
    "Is Collaborator"?: boolean;
    "Is Collaborator - Officevibe"?: boolean;
    "Is Collaborator - LMS"?: boolean;
    "Is Collaborator - Onboarding"?: boolean;
    "Is Collaborator - Skills"?: boolean;
    "Is Collaborator - Performance"?: boolean;
    "Is Collaborator - Pingboard"?: boolean;
    "Is Reporting Manager"?: boolean;
    "Is Team Manager"?: boolean;
    "Plan Code - Officevibe"?: string;
    "Plan Code - LMS"?: string;
    "Plan Code - Onboarding"?: string;
    "Plan Code - Skills"?: string;
    "Plan Code - Performance"?: string;
    "Plan Code - Pingboard"?: string;
}

export const DeviceIdTrait = "Device Id";
export const TelemetryIdTrait = "Telemetry Id";

/**
 * Create the default user traits for a WLP user.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export function createDefaultUserTraits(identification: LogRocketIdentification) {
    const {
        userId,
        organizationId,
        organizationName,
        isMigratedToWorkleap,
        isOrganizationCreator,
        isAdmin,
        isExecutive,
        isCollaborator,
        isReportingManager,
        isTeamManager,
        planCode
    } = identification;

    const isExecutiveInAnyProduct = Boolean(
        isExecutive?.wov ||
        isExecutive?.lms ||
        isExecutive?.onb ||
        isExecutive?.sks ||
        isExecutive?.wpm ||
        isExecutive?.pbd ||
        isExecutive?.cmp
    );

    const isCollaboratorInAnyProduct = Boolean(
        isCollaborator?.wov ||
        isCollaborator?.lms ||
        isCollaborator?.onb ||
        isCollaborator?.sks ||
        isCollaborator?.wpm ||
        isCollaborator?.pbd ||
        isCollaborator?.cmp
    );

    const telemetryContext = getTelemetryContext();

    return {
        "User Id": userId,
        "Organization Id": organizationId,
        "Organization Name": organizationName,
        "Is Migrated To Workleap": isMigratedToWorkleap,
        "Is Admin": isAdmin,
        [DeviceIdTrait]: telemetryContext ? telemetryContext.deviceId : "N/A",
        [TelemetryIdTrait]: telemetryContext ? telemetryContext.telemetryId : "N/A",
        ...(isDefined(isOrganizationCreator) && { "Is Organization Creator": isOrganizationCreator }),
        ...(isExecutiveInAnyProduct && { "Is Executive": true }),
        ...(isDefined(isExecutive?.wov) && { "Is Executive - Officevibe": isExecutive.wov }),
        ...(isDefined(isExecutive?.lms) && { "Is Executive - LMS": isExecutive.lms }),
        ...(isDefined(isExecutive?.onb) && { "Is Executive - Onboarding": isExecutive.onb }),
        ...(isDefined(isExecutive?.sks) && { "Is Executive - Skills": isExecutive.sks }),
        ...(isDefined(isExecutive?.wpm) && { "Is Executive - Performance": isExecutive.wpm }),
        ...(isDefined(isExecutive?.pbd) && { "Is Executive - Pingboard": isExecutive.pbd }),
        ...(isDefined(isExecutive?.cmp) && { "Is Executive - Compensation": isExecutive.cmp }),
        ...(isCollaboratorInAnyProduct && { "Is Collaborator": isCollaboratorInAnyProduct }),
        ...(isDefined(isCollaborator?.wov) && { "Is Collaborator - Officevibe": isCollaborator.wov }),
        ...(isDefined(isCollaborator?.lms) && { "Is Collaborator - LMS": isCollaborator.lms }),
        ...(isDefined(isCollaborator?.onb) && { "Is Collaborator - Onboarding": isCollaborator.onb }),
        ...(isDefined(isCollaborator?.sks) && { "Is Collaborator - Skills": isCollaborator.sks }),
        ...(isDefined(isCollaborator?.wpm) && { "Is Collaborator - Performance": isCollaborator.wpm }),
        ...(isDefined(isCollaborator?.pbd) && { "Is Collaborator - Pingboard": isCollaborator.pbd }),
        ...(isDefined(isCollaborator?.cmp) && { "Is Collaborator - Compensation": isCollaborator.cmp }),
        ...(isDefined(isReportingManager) && { "Is Reporting Manager": isReportingManager }),
        ...(isDefined(isTeamManager) && { "Is Team Manager": isTeamManager }),
        ...(isDefined(planCode?.wov) && { "Plan Code - Officevibe": planCode.wov }),
        ...(isDefined(planCode?.lms) && { "Plan Code - LMS": planCode.lms }),
        ...(isDefined(planCode?.onb) && { "Plan Code - Onboarding": planCode.onb }),
        ...(isDefined(planCode?.sks) && { "Plan Code - Skills": planCode.sks }),
        ...(isDefined(planCode?.wpm) && { "Plan Code - Performance": planCode.wpm }),
        ...(isDefined(planCode?.pbd) && { "Plan Code - Pingboard": planCode.pbd }),
        ...(isDefined(planCode?.cmp) && { "Plan Code - Compensation": planCode.cmp })
    } satisfies LogRocketUserTraits;
}
