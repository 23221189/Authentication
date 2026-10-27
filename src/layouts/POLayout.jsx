import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import POSideBar from "../components/POSideBar";
import PODashboardNavbar from "../components/PODashboardNavbar";

function POLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(
        typeof window !== "undefined"
            ? window.innerWidth >= 1024
            : true
    );

    const handleMenuClick = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] flex font-sans text-[#f5efe3] overflow-x-hidden">

            <POSideBar
                isOpen={sidebarOpen}
                onClose={handleSidebarClose}
            />

            <div
                className={`min-h-screen min-w-0 flex-1 bg-[#050505] transition-all duration-300 ${
                    sidebarOpen ? "lg:ml-64" : "lg:ml-0"
                }`}
            >
                <div className="relative z-30 w-full bg-[#050505]">
                    <PODashboardNavbar
                        onMenuClick={handleMenuClick}
                    />
                </div>

                <main className="w-full min-h-screen bg-[#050505] px-3 sm:px-5 lg:px-8 pt-1 sm:pt-2 pb-5 sm:pb-7">
                    <div className="max-w-7xl mx-auto w-full bg-[#050505]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default POLayout;