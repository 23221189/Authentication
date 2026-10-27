import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AgentSidebar from "../components/AgentSidebar";
import AgentNavbar from "../components/AgentNavbar";
import { useTheme } from "../context/ThemeContext.jsx";

function AgentLayout() {
    const { theme } = useTheme();

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div
            className="min-h-screen w-full font-sans transition-colors duration-300"
            style={{
                backgroundColor: "var(--theme-bg)",
                color: "var(--theme-text)",
            }}
        >
            <div
                className={`fixed top-0 left-0 z-50 h-screen shrink-0 transition-all duration-300 ${
                    sidebarOpen
                        ? "translate-x-0 w-64"
                        : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"
                }`}
                style={{
                    backgroundColor: "var(--theme-bg)",
                }}
            >
                <AgentSidebar
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            <div
                className={`min-h-screen min-w-0 transition-all duration-300 ${
                    sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                }`}
                style={{
                    backgroundColor: "var(--theme-bg)",
                }}
            >
                <div
                    className="w-full"
                    style={{
                        backgroundColor: "var(--theme-bg)",
                    }}
                >
                    <AgentNavbar
                        onMenuClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    />
                </div>

                <main
                    className="w-full min-h-screen px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6 transition-colors duration-300"
                    style={{
                        backgroundColor: "var(--theme-bg)",
                        color: "var(--theme-text)",
                    }}
                >
                    <div
                        className="mx-auto w-full max-w-[1500px] transition-colors duration-300"
                        style={{
                            backgroundColor: "var(--theme-bg)",
                        }}
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AgentLayout;