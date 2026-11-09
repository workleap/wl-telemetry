import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchJson } from "./api.ts";

export function FailingPage() {
    useSuspenseQuery({
        queryKey: ["api/failing"],
        queryFn: () => {
            return fetchJson("http://localhost:1234/api/failing");
        }
    });

    return <div>Should have failed!</div>;
}
