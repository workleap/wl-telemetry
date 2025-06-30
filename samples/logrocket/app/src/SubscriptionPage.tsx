import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchJson } from "./api.ts";

interface Subscription {
    company: string;
    contact: string;
    status: string;
}

export function SubscriptionPage() {
    const { data: subscription } = useSuspenseQuery({ queryKey: ["api/subscription"], queryFn: async () => {
        return (await fetchJson("http://localhost:1234/api/subscription")) as Subscription;
    } });

    return (
        <>
            <h1>Subscription</h1>
            <div>
                <span>Company: {subscription.company}</span>
                <span> - </span>
                <span>Contact: {subscription.contact}</span>
                <span> - </span>
                <span>Status: {subscription.status}</span>
            </div>
        </>
    );
}
