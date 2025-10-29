import { test } from "vitest";
import { removeIdsFromUrl } from "../../src/js/removeIdsFromUrl.ts";

test.concurrent("case 1", ({ expect }) => {
    const result = removeIdsFromUrl("https://api.performance.workleap.com/app/getManagerReview?reviewCycleId=681bde2d32652ec23d59ea24&revieweeId=186bc69e-9545-4713-96f2-d9d4ca848ab1");

    expect(result).toBe("https://api.performance.workleap.com/app/getManagerReview?reviewCycleId={shortid}&revieweeId={guid}");
});

test.concurrent("case 2", ({ expect }) => {
    const result = removeIdsFromUrl("https://api.officevibe.workleap.com/custompolls/api/custom-polls/templates/officevibe/recurrent?templateIds=68472b1d537193e7b394ac08&templateIds=60da073879acd1558cf0fb0d");

    expect(result).toBe("https://api.officevibe.workleap.com/custompolls/api/custom-polls/templates/officevibe/recurrent?templateIds={shortid}&templateIds={shortid}");
});

test.concurrent("case 3", ({ expect }) => {
    const result = removeIdsFromUrl("https://officevibe.workleap.com/portal/api/teams-and-segments/recent?recentTeamIds[]=048b2d9b-4481-41fb-b9c3-b7bc5102eb24&recentTeamIds[]=e4208b62-0f35-47a6-a5dc-b4594d207449&recentTeamIds[]=e5c88e7c-2ab7-4f80-8785-0664e9b999d2&recentTeamIds[]=f9282a7b-32fd-4e7f-8880-ce4e4f7cf777&recentTeamIds[]=cf8b9440-51af-4ccf-be68-1c1f753d4891&recentTeamIds[]=d563a72a-1298-428c-9a20-e40b7e78fec7&recentTeamIds[]=a2530fb6-3798-45ed-8328-3dab4ef25253");

    expect(result).toBe("https://officevibe.workleap.com/portal/api/teams-and-segments/recent?recentTeamIds[]={guid}&recentTeamIds[]={guid}&recentTeamIds[]={guid}&recentTeamIds[]={guid}&recentTeamIds[]={guid}&recentTeamIds[]={guid}&recentTeamIds[]={guid}");
});

test.concurrent("case 4", ({ expect }) => {
    const result = removeIdsFromUrl("https://api.officevibe.workleap.com/engagement/api/pulse-survey/summary/beba4f37-9ceb-456d-815e-978d98136523?timePeriod=30&startDate=null&endDate=null");

    expect(result).toBe("https://api.officevibe.workleap.com/engagement/api/pulse-survey/summary/{guid}?timePeriod=30&startDate=null&endDate=null");
});

test.concurrent("case 5", ({ expect }) => {
    const result = removeIdsFromUrl("https://api.officevibe.workleap.com/engagement/api/pulse-survey/summary/00000000-0000-0000-0000-000000000000?timePeriod=30&startDate=null&endDate=null");

    expect(result).toBe("https://api.officevibe.workleap.com/engagement/api/pulse-survey/summary/{guid}?timePeriod=30&startDate=null&endDate=null");
});

