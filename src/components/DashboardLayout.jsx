import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  MdDashboard,
  MdOutlineHome,
  MdOutlineBookOnline,
  MdOutlinePayments,
  MdOutlineRateReview,
  MdOutlineNotifications,
  MdOutlinePeopleAlt,
  MdOutlineVerified,
  MdOutlineSupportAgent,
  MdOutlinePersonOutline,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";

const NAV_BY_ROLE = {
  tenant: [
    { label: "Dashboard", to: "/tenant/dashboard", icon: MdDashboard },
    { label: "My Bookings", to: "/mybooking", icon: MdOutlineBookOnline },
    { label: "Payments", icon: MdOutlinePayments, comingSoon: true },
    { label: "Reviews", icon: MdOutlineRateReview, comingSoon: true },
    { label: "Notifications", icon: MdOutlineNotifications, comingSoon: true },
    { label: "Profile", icon: MdOutlinePersonOutline, comingSoon: true },
  ],
  owner: [
    { label: "Dashboard", to: "/owner/dashboard", icon: MdDashboard },
    { label: "My Properties", icon: MdOutlineHome, comingSoon: true },
    { label: "Bookings", icon: MdOutlineBookOnline, comingSoon: true },
    { label: "Payments", icon: MdOutlinePayments, comingSoon: true },
    { label: "Reviews", icon: MdOutlineRateReview, comingSoon: true },
    { label: "Notifications", icon: MdOutlineNotifications, comingSoon: true },
    { label: "Profile", icon: MdOutlinePersonOutline, comingSoon: true },
  ],
  agent: [
    { label: "Dashboard", to: "/agent/dashboard", icon: MdDashboard },
    {
      label: "Verification Requests",
      icon: MdOutlineVerified,
      comingSoon: true,
    },
    { label: "Payments", icon: MdOutlinePayments, comingSoon: true },
    {
      label: "Notifications",
      icon: MdOutlineNotifications,
      comingSoon: true,
    },
    {
      label: "Profile",
      icon: MdOutlinePersonOutline,
      comingSoon: true,
    },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: MdDashboard },
    {
      label: "Manage Agents",
      to: "/admin/agents",
      icon: MdOutlineSupportAgent,
    },
    {
      label: "Property Verification",
      to: "/admin/verify-properties",
      icon: MdOutlineVerified,
    },
    {
      label: "Manage Users",
      icon: MdOutlinePeopleAlt,
      comingSoon: true,
    },
    {
      label: "Complaints & Support",
      icon: MdOutlineSupportAgent,
      comingSoon: true,
    },
    {
      label: "Notifications",
      icon: MdOutlineNotifications,
      comingSoon: true,
    },
  ],
};

const ROLE_TITLE = {
  tenant: "Tenant",
  owner: "Property Owner",
  agent: "Agent",
  admin: "Admin",
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, changeTheme } = useTheme();

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className="min-h-screen flex transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      <aside
        className={`fixed md:sticky top-0 left-0 z-30 h-screen w-64 flex flex-col justify-between transform transition-all duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } md:translate-x-0`}
        style={{
          backgroundColor: "var(--theme-surface)",
          borderRight:
            "1px solid var(--theme-border)",
          boxShadow:
            theme === "offwhite"
              ? "0 0 22px rgba(139,90,43,0.06)"
              : "0 0 22px rgba(201,164,92,0.06)",
        }}
      >
        <div
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{
            scrollbarColor:
              "var(--theme-border) var(--theme-surface)",
          }}
        >
          <div
            className="flex items-center gap-3 px-5 py-5"
            style={{
              borderBottom:
                "1px solid var(--theme-border)",
              backgroundColor:
                "var(--theme-surface)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full overflow-hidden shrink-0"
              style={{
                border:
                  "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 14px rgba(139,90,43,0.10)"
                    : "0 0 14px rgba(201,164,92,0.10)",
              }}
            >
              <img
                src="/src/assets/logo.jpg"
                alt="logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div>
              <span
                className="block font-extrabold text-sm tracking-tight"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                PAYING GUEST
              </span>

              <span
                className="block text-[9px] font-bold uppercase tracking-wider mt-0.5"
                style={{
                  color: "var(--theme-accent)",
                }}
              >
                Dashboard Panel
              </span>
            </div>

            <button
              className="ml-auto md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 cursor-pointer"
              style={{
                color: "var(--theme-muted-dark)",
                border:
                  "1px solid transparent",
                backgroundColor:
                  "var(--theme-card)",
              }}
              onClick={() => setSidebarOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-dark)";
                e.currentTarget.style.borderColor =
                  "transparent";
              }}
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <nav className="px-3 py-4 flex flex-col gap-1.5">
            {navItems.map((item) =>
              item.comingSoon ? (
                <div
                  key={item.label}
                  title="Coming soon"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold cursor-not-allowed select-none"
                  style={{
                    color: "var(--theme-muted-dark)",
                    backgroundColor:
                      "var(--theme-surface)",
                  }}
                >
                  <item.icon className="w-5 h-5 shrink-0" />

                  <span>{item.label}</span>

                  <span
                    className="ml-auto text-[9px] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        "var(--theme-card)",
                      color:
                        "var(--theme-muted-dark)",
                      border:
                        "1px solid var(--theme-border)",
                    }}
                  >
                    Soon
                  </span>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300"
                  style={({ isActive }) => ({
                    backgroundColor: isActive
                      ? "var(--theme-accent)"
                      : "var(--theme-surface)",
                    color: isActive
                      ? "var(--theme-button-text)"
                      : "var(--theme-muted-light)",
                    boxShadow: isActive
                      ? theme === "offwhite"
                        ? "0 0 18px rgba(139,90,43,0.18)"
                        : "0 0 18px rgba(201,164,92,0.18)"
                      : "none",
                  })}
                  onMouseEnter={(e) => {
                    const isActive =
                      e.currentTarget.getAttribute(
                        "aria-current"
                      ) === "page";

                    if (!isActive) {
                      e.currentTarget.style.color =
                        "var(--theme-accent)";
                      e.currentTarget.style.borderColor =
                        "var(--theme-accent)";
                      e.currentTarget.style.boxShadow =
                        theme === "offwhite"
                          ? "0 0 14px rgba(139,90,43,0.08)"
                          : "0 0 14px rgba(201,164,92,0.08)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    const isActive =
                      e.currentTarget.getAttribute(
                        "aria-current"
                      ) === "page";

                    if (!isActive) {
                      e.currentTarget.style.color =
                        "var(--theme-muted-light)";
                      e.currentTarget.style.borderColor =
                        "transparent";
                      e.currentTarget.style.boxShadow =
                        "none";
                    }
                  }}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            )}
          </nav>
        </div>

        <div
          className="p-3"
          style={{
            borderTop:
              "1px solid var(--theme-border)",
            backgroundColor:
              "var(--theme-surface)",
          }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer"
            style={{
              color: "var(--theme-muted-light)",
              backgroundColor:
                "var(--theme-surface)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color =
                "var(--theme-accent)";
              e.currentTarget.style.borderColor =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow =
                theme === "offwhite"
                  ? "0 0 14px rgba(139,90,43,0.08)"
                  : "0 0 14px rgba(201,164,92,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                "var(--theme-muted-light)";
              e.currentTarget.style.borderColor =
                "transparent";
              e.currentTarget.style.boxShadow =
                "none";
            }}
          >
            <MdLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-20 md:hidden"
          style={{
            backgroundColor:
              theme === "offwhite"
                ? "rgba(255,253,248,0.80)"
                : "rgba(5,5,5,0.80)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className="flex-1 min-w-0 transition-colors duration-300"
        style={{
          backgroundColor: "var(--theme-bg)",
        }}
      >
        <header
          className="flex items-center justify-between px-4 py-4 sm:px-6 transition-colors duration-300"
          style={{
            backgroundColor:
              "var(--theme-surface)",
            borderBottom:
              "1px solid var(--theme-border)",
            boxShadow:
              theme === "offwhite"
                ? "0 0 18px rgba(139,90,43,0.06)"
                : "0 0 18px rgba(201,164,92,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 cursor-pointer"
              style={{
                border:
                  "1px solid var(--theme-border)",
                backgroundColor:
                  "var(--theme-card)",
                color:
                  "var(--theme-muted-light)",
              }}
              onClick={() => setSidebarOpen(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.10)"
                    : "0 0 16px rgba(201,164,92,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-light)";
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              <MdMenu className="w-6 h-6" />
            </button>

            <div>
              <h1
                className="font-extrabold text-lg tracking-tight"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {ROLE_TITLE[user?.role] || ""} Dashboard
              </h1>

              <p
                className="text-xs font-medium mt-0.5"
                style={{
                  color:
                    "var(--theme-muted-dark)",
                }}
              >
                Welcome back, {user?.fullname}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => changeTheme("black")}
                title="Black Theme"
                className={`h-5 w-5 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                  theme === "black"
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: "#171717",
                  borderColor:
                    theme === "black"
                      ? "var(--theme-accent)"
                      : "var(--theme-border)",
                  boxShadow:
                    theme === "black"
                      ? "0 0 10px rgba(201,164,92,0.35)"
                      : "none",
                }}
              />

              <button
                type="button"
                onClick={() => changeTheme("offwhite")}
                title="Off-White Theme"
                className={`h-5 w-5 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                  theme === "offwhite"
                    ? "scale-110"
                    : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: "#f7f1e7",
                  borderColor:
                    theme === "offwhite"
                      ? "var(--theme-accent)"
                      : "var(--theme-border)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 10px rgba(139,90,43,0.25)"
                      : "none",
                }}
              />
            </div>

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm transition-all duration-300"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
                color:
                  "var(--theme-button-text)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 18px rgba(139,90,43,0.18)"
                    : "0 0 18px rgba(201,164,92,0.18)",
                border:
                  "1px solid var(--theme-accent-hover)",
              }}
            >
              {user?.fullname
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <main
          className="p-4 sm:p-6 transition-colors duration-300"
          style={{
            backgroundColor:
              "var(--theme-bg)",
          }}
        >
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;