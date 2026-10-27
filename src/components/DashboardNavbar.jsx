import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { MdLogout } from "react-icons/md";
import NotificationBell from "./NotificationBell.jsx";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, changeTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      className="h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 font-sans transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderBottom:
          "1px solid var(--theme-border)",
        boxShadow:
          theme === "offwhite"
            ? "0 0 18px rgba(139,90,43,0.06)"
            : "0 0 18px rgba(201,164,92,0.06)",
      }}
    >
      <Link
        to="/"
        className="flex items-center gap-3 group cursor-pointer no-underline"
      >
        <img
          src="/src/assets/logo.jpg"
          alt="logo"
          className="w-9 h-9 rounded-lg object-cover transition-all duration-300"
          style={{
            border:
              "1px solid var(--theme-accent)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-accent-hover)";
            e.currentTarget.style.boxShadow =
              theme === "offwhite"
                ? "0 0 14px rgba(139,90,43,0.15)"
                : "0 0 14px rgba(201,164,92,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-accent)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        />

        <span
          className="font-extrabold text-sm sm:text-base tracking-wide transition-colors"
          style={{
            color: "var(--theme-text)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color =
              "var(--theme-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color =
              "var(--theme-text)";
          }}
        >
          PAYING GUEST
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-4">
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

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                border:
                  "1px solid color-mix(in srgb, var(--theme-accent) 60%, transparent)",
                backgroundColor:
                  "var(--theme-card)",
                color: "var(--theme-accent)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 12px rgba(139,90,43,0.06)"
                    : "0 0 12px rgba(201,164,92,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 18px rgba(139,90,43,0.14)"
                    : "0 0 18px rgba(201,164,92,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--theme-accent) 60%, transparent)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 12px rgba(139,90,43,0.06)"
                    : "0 0 12px rgba(201,164,92,0.06)";
              }}
            >
              <NotificationBell />
            </div>

            <Link
              to="/profile"
              className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 no-underline cursor-pointer"
            >
              {user.profilePhoto ? (
                <img
                  src={
                    user.profilePhoto.startsWith("http")
                      ? user.profilePhoto
                      : `${SERVER_ORIGIN}${user.profilePhoto}`
                  }
                  alt={user.fullname}
                  className="w-8 h-8 rounded-lg object-cover transition-all duration-300"
                  style={{
                    border:
                      "1px solid var(--theme-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--theme-accent)";
                    e.currentTarget.style.boxShadow =
                      theme === "offwhite"
                        ? "0 0 14px rgba(139,90,43,0.12)"
                        : "0 0 14px rgba(201,164,92,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--theme-border)";
                    e.currentTarget.style.boxShadow =
                      "none";
                  }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300"
                  style={{
                    backgroundColor:
                      "var(--theme-card)",
                    border:
                      "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
                    color:
                      "var(--theme-accent)",
                    boxShadow:
                      theme === "offwhite"
                        ? "0 0 12px rgba(139,90,43,0.06)"
                        : "0 0 12px rgba(201,164,92,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--theme-accent)";
                    e.currentTarget.style.boxShadow =
                      theme === "offwhite"
                        ? "0 0 16px rgba(139,90,43,0.12)"
                        : "0 0 16px rgba(201,164,92,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, var(--theme-accent) 40%, transparent)";
                    e.currentTarget.style.boxShadow =
                      theme === "offwhite"
                        ? "0 0 12px rgba(139,90,43,0.06)"
                        : "0 0 12px rgba(201,164,92,0.06)";
                  }}
                >
                  {user.fullname
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>
              )}

              <span
                className="text-xs font-bold hidden sm:inline transition-colors"
                style={{
                  color: "var(--theme-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color =
                    "var(--theme-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    "var(--theme-text)";
                }}
              >
                {user.fullname}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-extrabold px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer"
              style={{
                color: "var(--theme-accent)",
                border:
                  "1px solid color-mix(in srgb, var(--theme-accent) 60%, transparent)",
                backgroundColor:
                  "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-button-text)";
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent)";
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.transform =
                  "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 18px rgba(139,90,43,0.20)"
                    : "0 0 18px rgba(201,164,92,0.20)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
                e.currentTarget.style.backgroundColor =
                  "transparent";
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--theme-accent) 60%, transparent)";
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              <MdLogout className="text-sm" />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-2 rounded-lg transition-all duration-300 no-underline"
              style={{
                color:
                  "var(--theme-muted-light)",
                border:
                  "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--theme-accent) 40%, transparent)";
                e.currentTarget.style.backgroundColor =
                  "var(--theme-card)";
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
                e.currentTarget.style.backgroundColor =
                  "transparent";
                e.currentTarget.style.boxShadow =
                  "none";
              }}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-xs font-extrabold px-3.5 py-2 rounded-lg transition-all duration-300 no-underline"
              style={{
                color:
                  "var(--theme-button-text)",
                backgroundColor:
                  "var(--theme-accent)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.15)"
                    : "0 0 16px rgba(201,164,92,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent-hover)";
                e.currentTarget.style.transform =
                  "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 22px rgba(139,90,43,0.25)"
                    : "0 0 22px rgba(201,164,92,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent)";
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  theme === "offwhite"
                    ? "0 0 16px rgba(139,90,43,0.15)"
                    : "0 0 16px rgba(201,164,92,0.15)";
              }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;