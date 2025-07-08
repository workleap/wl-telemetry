import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div style={{ margin: "20px" }}>
            <ul style={{ display: "flex", gap: "10px", padding: 0, listStyleType: "none" }}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/movies">Movies</Link>
                </li>
                <li>
                    <Link to="/subscription">Subscription</Link>
                </li>
                <li>
                    <Link to="/failing">Failing</Link>
                </li>
                <li>
                    <Link to="/throwing">Throwing</Link>
                </li>
            </ul>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
}
