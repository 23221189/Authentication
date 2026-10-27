import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { useTheme } from "../context/ThemeContext.jsx";

function AdminLayout() {
    const { theme } = useTheme();

    const [sidebarOpen, setSidebarOpen] = useState(
        typeof window !== "undefined"
            ? window.innerWidth >= 1024
            : true
    );

    const handleMenuClick = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div
            className="min-h-screen w-full flex font-sans overflow-x-hidden transition-colors duration-300"
            style={{
                backgroundColor: theme === "black" ? "#000000" : "var(--theme-bg)",
                color: "var(--theme-text)",
            }}
        >
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div
                className={`min-h-screen min-w-0 flex-1 transition-all duration-300 ${
                    sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                }`}
                style={{
                    backgroundColor: theme === "black" ? "#000000" : "var(--theme-bg)",
                }}
            >
                <AdminNavbar
                    onMenuClick={handleMenuClick}
                    sidebarOpen={sidebarOpen}
                />

                <main
                    className="w-full min-h-screen px-3 sm:px-5 lg:px-8 pt-[76px] sm:pt-[86px] pb-5 sm:pb-7 transition-colors duration-300"
                    style={{
                        backgroundColor: theme === "black" ? "#000000" : "var(--theme-bg)",
                        color: "var(--theme-text)",
                    }}
                >
                    <div
                        className="max-w-7xl mx-auto w-full transition-colors duration-300"
                        style={{
                            backgroundColor: theme === "black" ? "#000000" : "var(--theme-bg)",
                        }}
                    >
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
