import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { FailingPage } from "./FailingPage.tsx";
import { HomePage } from "./HomePage.tsx";
import { IdentifyPage } from "./IdentifyPage.tsx";
import { Layout } from "./Layout.tsx";
import { LogRocketLoggerPage } from "./LogRocketLoggerPage.tsx";
import { MixpanelPage } from "./MixpanelPage.tsx";
import { MoviesPage } from "./MoviesPage.tsx";
import { SubscriptionPage } from "./SubscriptionPage.tsx";
import { ThrowingPage } from "./ThrowingPage.tsx";

const queryClient = new QueryClient();

export function App() {
    return (
        <RouterProvider
            router={createBrowserRouter([
                {
                    element: <Layout />,
                    children: [
                        {
                            errorElement: <ErrorBoundary />,
                            children: [
                                {
                                    index: true,
                                    element: (
                                        <QueryClientProvider client={queryClient}>
                                            <HomePage />
                                        </QueryClientProvider>
                                    )
                                },
                                {
                                    path: "movies",
                                    element: (
                                        <QueryClientProvider client={queryClient}>
                                            <MoviesPage />
                                        </QueryClientProvider>
                                    )
                                },
                                {
                                    path: "subscription",
                                    element: (
                                        <QueryClientProvider client={queryClient}>
                                            <SubscriptionPage />
                                        </QueryClientProvider>
                                    )
                                },
                                {
                                    path: "identify",
                                    element: (
                                        <IdentifyPage />
                                    )
                                },
                                {
                                    path: "mixpanel",
                                    element: (
                                        <MixpanelPage />
                                    )
                                },
                                {
                                    path: "failing",
                                    element: (
                                        <QueryClientProvider client={queryClient}>
                                            <FailingPage />
                                        </QueryClientProvider>
                                    )
                                },
                                {
                                    path: "throwing",
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    element: <ThrowingPage />
                                },
                                {
                                    path: "logrocket-logger",
                                    element: (
                                        <LogRocketLoggerPage />
                                    )
                                }
                            ]
                        }
                    ]
                }
            ])}
        />
    );
}
