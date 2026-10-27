import { useState, useEffect, useRef } from "react";
import { FaBars, FaUserCircle, FaChevronDown, FaCog, FaSignOutAlt } from "react-icons/fa";
import NotificationBell from "./NotificationBell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

function AdminNavbar({ onMenuClick, sidebarOpen }) {
  const { user } = useAuth();
  const { theme, changeTheme } = useTheme();

  const notificationRef = useRef(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const adminName = user?.fullname || "Admin";
  const profileImage = user?.profileImage || null;
  const isOffWhite = theme === "offwhite";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setProfileOpen(false);
    navigate("/admin/logout");
  };

  return (
    <>
      <header
      className="fixed top-0 right-0 z-auto font-sans transition-all duration-300"
      style={{
        left: sidebarOpen ? "16rem" : "0",
        width: sidebarOpen ? "calc(100% - 16rem)" : "100%",
        backgroundColor: theme === "black" ? "#000000" : "var(--theme-bg)",
      }}
    >
      <div className="px-2 pt-2 sm:px-4 sm:pt-3">
        <div
          className="flex h-14 sm:h-[68px] items-center rounded-xl px-2.5 sm:px-3 md:px-5 transition-all duration-300"
          style={{
            backgroundColor: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            color: "var(--theme-text)",
            boxShadow: isOffWhite
              ? "0 6px 20px rgba(43,33,24,0.08)"
              : "0 6px 20px rgba(0,0,0,0.25)",
          }}
        >
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="mr-2 shrink-0 rounded-lg p-2 text-lg sm:mr-3 sm:text-xl md:mr-5 transition-all duration-200 cursor-pointer"
            style={{
              color: "var(--theme-text)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--theme-accent)";
              e.currentTarget.style.backgroundColor =
                "var(--theme-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--theme-text)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <FaBars />
          </button>

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-[11px] font-extrabold tracking-tight sm:text-sm md:text-base"
              style={{ color: "var(--theme-text)" }}
            >
              Welcome Back,{" "}
              <span style={{ color: "var(--theme-accent)" }}>
                Admin!
              </span>
            </p>
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-2">
            <div ref={notificationRef}>
              <NotificationBell
                isOpen={notificationOpen}
                onToggle={() => {
                  setNotificationOpen((prev) => !prev);
                  setProfileOpen(false);
                }}
              />
            </div>

            <div
              className="mx-1.5 h-7 w-px sm:mx-2 sm:h-9"
              style={{ backgroundColor: "var(--theme-border)" }}
            />

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-1.5 rounded-lg p-1.5 sm:gap-2 sm:rounded-xl sm:px-2 sm:py-2 md:gap-3 md:px-3 transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: profileOpen
                    ? "var(--theme-bg)"
                    : "transparent",
                }}
              >
                <div
                  className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:rounded-xl"
                  style={{
                    backgroundColor: "var(--theme-bg)",
                    border: "1px solid var(--theme-border)",
                    color: "var(--theme-accent)",
                  }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Admin Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-lg sm:text-xl md:text-2xl" />
                  )}
                </div>

                <div className="hidden text-left sm:block min-w-0">
                  <p
                    className="truncate text-xs font-bold sm:text-sm"
                    style={{ color: "var(--theme-text)" }}
                  >
                    {adminName}
                  </p>
                  <p
                    className="truncate text-[10px] font-medium sm:text-xs"
                    style={{ color: "var(--theme-accent)" }}
                  >
                    Admin
                  </p>
                </div>

                <FaChevronDown
                  className={`text-xs sm:text-sm transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  style={{ color: "var(--theme-accent)" }}
                />
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 z-[100] w-56 overflow-hidden rounded-xl sm:rounded-2xl"
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    border: "1px solid var(--theme-border)",
                    boxShadow: isOffWhite
                      ? "0 12px 30px rgba(43,33,24,0.12)"
                      : "0 12px 30px rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "1px solid var(--theme-border)" }}
                  >
                    <p
                      className="text-sm font-extrabold"
                      style={{ color: "var(--theme-text)" }}
                    >
                      Theme Mode
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--theme-muted-dark)" }}
                      >
                        {theme === "black" ? "Dark Mode" : "Off-White Mode"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          changeTheme(theme === "black" ? "offwhite" : "black")
                        }
                        aria-label="Toggle theme"
                        className="relative flex h-9 w-[82px] items-center rounded-full border p-1 transition-all duration-300 cursor-pointer"
                        style={{
                          backgroundColor:
                            theme === "black" ? "#050505" : "#f7f1e7",
                          borderColor: "var(--theme-border)",
                        }}
                      >
                        <span
                          className="relative z-10 h-7 w-7 rounded-full transition-transform duration-300"
                          style={{
                            transform:
                              theme === "black"
                                ? "translateX(0)"
                                : "translateX(44px)",
                            backgroundColor:
                              theme === "black" ? "#171717" : "#ffffff",
                            border: "1px solid var(--theme-border)",
                            boxShadow:
                              theme === "black"
                                ? "0 0 8px rgba(201,164,92,0.25)"
                                : "0 0 8px rgba(139,90,43,0.20)",
                          }}
                        />
                      </button>
                    </div>
                  </div>

                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors"
                    style={{ color: "var(--theme-text)" }}
                  >
                    <FaCog style={{ color: "var(--theme-accent)" }} />
                    <span>Settings</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors text-left"
                    style={{
                      color: "var(--theme-text)",
                      borderTop: "1px solid var(--theme-border)",
                    }}
                  >
                    <FaSignOutAlt style={{ color: "var(--theme-accent)" }} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </header>
    </>
  );
}

export default AdminNavbar;
