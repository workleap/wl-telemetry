import { useSuspenseQuery } from "@tanstack/react-query";
import { useMixpanelTrackingFunction } from "@workleap/telemetry/react";
import { fetchJson } from "./api.ts";

interface Movie {
    id: string;
    name: string;
    episode: string;
}

export function MoviesPage() {
    const { data: movies } = useSuspenseQuery({ queryKey: ["api/movies"], queryFn: () => {
        return fetchJson("http://localhost:1234/api/movies");
    } });

    const track = useMixpanelTrackingFunction();

    track("Page View", {
        "Page": "Movies Page"
    });

    return (
        <>
            <h1>Movies</h1>
            <div>
                {movies.map((x: Movie) => {
                    return (
                        <div key={x.id}>
                            <span>Id: {x.id}</span>
                            <span> - </span>
                            <span>Name: {x.name}</span>
                            <span> - </span>
                            <span>Episode: {x.episode}</span>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
