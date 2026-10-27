import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSwitchAccount } from "react-icons/md";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

function AgentNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, handleLogout, switchRole, activeRole } = useAuth();
  const { theme, changeTheme } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const profileRef = useRef(null);
  const roleMenuRef = useRef(null);

  const profileImage = user?.profileImage || null;

  const userRoles = user
    ? [
        ...new Set(
          [
            ...(Array.isArray(user.roles) ? user.roles : []),
            user.role,
          ].filter(Boolean)
        ),
      ]
    : [];

  const getMissingRoles = () => {
    const missing = [];

    const hasTenant = userRoles.includes("tenant");
    const hasOwner = userRoles.includes("owner");
    const hasAgent = userRoles.includes("agent");

    if ((hasTenant || hasAgent) && !hasOwner) {
      missing.push({
        label: "Owner",
        path: "/ownersignup",
      });
    }

    if ((hasOwner || hasAgent) && !hasTenant) {
      missing.push({
        label: "Tenant",
        path: "/signup",
      });
    }

    if ((hasTenant || hasOwner) && !hasAgent) {
      missing.push({
        label: "Agent",
        path: "/apply-agent-form",
      });
    }

    return missing;
  };

  const missingRoles = getMissingRoles();

  function handleProfileClick() {
    setShowProfileMenu((prev) => !prev);
    setShowRoleMenu(false);
  }

  function handleSwitchRole(newRole) {
    setShowProfileMenu(false);
    setShowRoleMenu(false);

    if (typeof switchRole === "function") {
      switchRole(newRole);
    }
  }

  async function handleSwitchAccount() {
    const currentRole = user?.role;

    setShowProfileMenu(false);

    await handleLogout(
      `/login?switchAccount=true&fromRole=${currentRole || ""}`
    );
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
        setShowRoleMenu(false);
      } else if (
        roleMenuRef.current &&
        !roleMenuRef.current.contains(event.target) &&
        !event.target.closest("[data-agent-role-toggle]")
      ) {
        setShowRoleMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full bg-[var(--theme-bg)] px-3 pt-3 font-sans transition-colors duration-300 sm:px-4 lg:px-6">
      <div className="flex min-h-[72px] items-center rounded-2xl border border-[var(--theme-accent)]/30 bg-[var(--theme-surface)] px-4 shadow-[0_10px_35px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-[var(--theme-accent)]/50 sm:px-5 lg:px-6">

        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--theme-accent)]/30 bg-[var(--theme-bg)] text-[var(--theme-muted-light)] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] hover:shadow-[0_0_22px_rgba(201,164,92,0.25)] active:scale-95 cursor-pointer"
        >
          <FaBars className="text-xl transition-transform duration-300" />
        </button>

        <div className="ml-3 sm:ml-5">
          <p className="text-base font-extrabold tracking-tight text-[var(--theme-text)] sm:text-lg">
            {user?.fullname || "Agent"}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">

          <NotificationBell />

          <div className="mx-2 hidden h-9 w-px bg-[var(--theme-border)] sm:block lg:mx-4" />

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              className="flex items-center gap-2 rounded-xl bg-[var(--theme-surface)] px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(201,164,92,0.12)] sm:gap-3 sm:px-3 cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--theme-accent)]/40 bg-[var(--theme-bg)] text-[var(--theme-accent)] shadow-[0_0_20px_rgba(201,164,92,0.20)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:border-[var(--theme-accent)] sm:h-11 sm:w-11">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Agent Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-2xl transition-transform duration-300 sm:text-3xl" />
                )}
              </div>

              <div className="hidden text-left md:block">
                <p className="text-sm font-bold text-[var(--theme-text)] sm:text-base">
                  {user?.fullname || "Agent"}
                </p>

                <p className="mt-0.5 text-xs font-semibold text-[var(--theme-accent)] sm:text-sm">
                  {activeRole
                    ? activeRole.charAt(0).toUpperCase() +
                      activeRole.slice(1)
                    : "Agent"}
                </p>
              </div>

              <FaChevronDown
                className={`ml-1 hidden text-sm text-[var(--theme-muted-dark)] transition-all duration-300 sm:block ${
                  showProfileMenu
                    ? "rotate-180 text-[var(--theme-accent)]"
                    : ""
                }`}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-[var(--theme-accent)]/35 bg-[var(--theme-surface)] shadow-[0_18px_45px_rgba(0,0,0,0.45)] transition-all duration-300">

                <Link
                  to="/agentprofile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 bg-[var(--theme-surface)] px-5 py-4 text-[var(--theme-muted-light)] transition-all duration-300 hover:bg-[var(--theme-bg)] hover:text-[var(--theme-accent)] hover:pl-6"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--theme-accent)]/30">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-lg text-[var(--theme-accent)]" />
                    )}
                  </div>

                  <span className="text-sm font-bold">
                    My Profile
                  </span>
                </Link>

                <div
                  className="flex items-center justify-between gap-3 border-t border-[var(--theme-border)] border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                      Theme Mode
                    </p>
                    <p className="mt-0.5 text-[10px] text-[var(--theme-muted)]">
                      {theme === "black" ? "Black" : "Off-White"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeTheme(theme === "black" ? "offwhite" : "black")
                    }
                    title={`Current theme: ${
                      theme === "black" ? "Black" : "Off-White"
                    }. Click to change theme.`}
                    aria-label={`Current theme: ${
                      theme === "black" ? "Black" : "Off-White"
                    }. Click to change theme.`}
                    className="relative h-8 w-14 shrink-0 cursor-pointer rounded-full border border-[var(--theme-accent)]/50 bg-[var(--theme-accent)]/25 shadow-inner transition-all duration-300 hover:bg-[var(--theme-accent)]/35"
                  >
                    <span
                      className={`absolute left-[3px] top-[3px] flex h-6 w-6 items-center justify-center rounded-full border border-[var(--theme-accent)] bg-[var(--theme-card)] text-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-out ${
                        theme === "offwhite"
                          ? "translate-x-[26px]"
                          : "translate-x-0"
                      }`}
                    >
                    </span>
                  </button>
                </div>

                <div className="relative" ref={roleMenuRef}>
                  <button
                    type="button"
                    data-agent-role-toggle
                    onClick={() =>
                      setShowRoleMenu(!showRoleMenu)
                    }
                    className="flex w-full items-center gap-3 border-t border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4 text-left text-[var(--theme-muted-light)] transition-all duration-300 hover:bg-[var(--theme-bg)] hover:text-[var(--theme-accent)] hover:pl-6 cursor-pointer"
                  >
                    <MdSwitchAccount className="text-lg text-[var(--theme-accent)]" />

                    <span className="text-sm font-bold">
                      {userRoles.length > 1
                        ? "Switch Account"
                        : "Manage Account"}
                    </span>
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 top-full z-[60] mt-1 w-full rounded-xl border border-[var(--theme-accent)]/40 bg-[var(--theme-surface)] py-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.45)]">

                      {userRoles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() =>
                            handleSwitchRole(role)
                          }
                          className={`w-full cursor-pointer px-5 py-2.5 text-left text-xs font-semibold capitalize transition-colors ${
                            activeRole === role
                              ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                              : "text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                          }`}
                        >
                          {role}
                        </button>
                      ))}

                      {missingRoles.length > 0 && (
                        <>
                          <div className="my-1 border-t border-[var(--theme-accent)]/15" />

                          {missingRoles.map((target) => (
                            <button
                              key={target.label}
                              type="button"
                              onClick={() => {
                                setShowProfileMenu(false);
                                setShowRoleMenu(false);
                                navigate(target.path);
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 px-5 py-2.5 text-left text-xs font-bold text-[var(--theme-accent)] transition-all duration-200 hover:bg-[var(--theme-accent)]/10"
                            >
                              <span>
                                + Add {target.label} Access
                              </span>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to="/agentlogout"
                  onClick={() =>
                    setShowProfileMenu(false)
                  }
                  className="flex items-center gap-3 rounded-b-2xl border-t border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4 text-[var(--theme-muted-light)] transition-all duration-300 hover:bg-[var(--theme-bg)] hover:text-[var(--theme-accent)] hover:pl-6"
                >
                  <FaSignOutAlt className="text-lg text-[var(--theme-accent)]" />

                  <span className="text-sm font-bold">
                    Logout
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AgentNavbar;