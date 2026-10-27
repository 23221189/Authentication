import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { MdLogout, MdSwitchAccount } from "react-icons/md";
import { FaUserCircle, FaUser } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import NotificationBell from "./NotificationBell.jsx";

import pg from "../assets/pg.jpeg";
import pg2 from "../assets/pg2.jpeg";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const Navbar = () => {
  const {
    user,
    activeRole,
    switchRole,
    loading,
  } = useAuth();

  const { theme, changeTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const profileRef = useRef(null);
  const roleMenuRef = useRef(null);

  const isSimple = location.pathname === "/list-your-property";

  const logo = theme === "offwhite" ? pg2 : pg;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
        setRoleMenuOpen(false);
      }

      if (
        roleMenuRef.current &&
        !roleMenuRef.current.contains(e.target) &&
        e.target.closest("[data-role-toggle]") === null
      ) {
        setRoleMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setRoleMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `relative font-bold text-sm tracking-wide pb-1 transition-all duration-300 ease-out
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
     after:bg-[var(--theme-accent)]
     after:rounded-full after:transition-all after:duration-300 ${
       isActive
         ? "text-[var(--theme-accent)] after:w-full"
         : "text-[var(--theme-text)] after:w-0 hover:text-[var(--theme-accent)] hover:after:w-full"
     }`;

  const getLogoutPath = () => {
    if (activeRole === "owner") return "/pologout";
    if (activeRole === "agent") return "/agentlogout";
    if (activeRole === "admin") return "/admin/logout";
    return "/logout";
  };

  const onLogoutClick = () => {
    setProfileOpen(false);
    setRoleMenuOpen(false);
    setMobileOpen(false);
    navigate(getLogoutPath());
  };

  const handleSwitchRole = (newRole) => {
    setProfileOpen(false);
    setRoleMenuOpen(false);
    setMobileOpen(false);
    switchRole(newRole);
  };

  const handleMobileNavigation = () => {
    setMobileOpen(false);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  };

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const getThemeLabel = () => {
    if (theme === "offwhite") return "Off-White";
    return "Black";
  };

  const cycleTheme = () => {
    if (theme === "black") {
      changeTheme("offwhite");
      return;
    }

    changeTheme("black");
  };

  const isRegularUser = !!user && user.role !== "admin";

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
    const added = new Set();

    const pushRole = (role) => {
      if (!added.has(role.label)) {
        missing.push(role);
        added.add(role.label);
      }
    };

    if (userRoles.includes("tenant")) {
      if (!userRoles.includes("owner")) {
        pushRole({
          label: "Owner",
          path: "/ownersignup",
          icon: "🏠",
        });
      }

      if (!userRoles.includes("agent")) {
        pushRole({
          label: "Agent",
          path: "/apply-agent-form",
          icon: "🔑",
        });
      }
    }

    if (userRoles.includes("owner")) {
      if (!userRoles.includes("tenant")) {
        pushRole({
          label: "Tenant",
          path: "/signup",
          icon: "🎓",
        });
      }

      if (!userRoles.includes("agent")) {
        pushRole({
          label: "Agent",
          path: "/apply-agent-form",
          icon: "🔑",
        });
      }
    }

    if (userRoles.includes("agent")) {
      if (!userRoles.includes("tenant")) {
        pushRole({
          label: "Tenant",
          path: "/signup",
          icon: "🎓",
        });
      }

      if (!userRoles.includes("owner")) {
        pushRole({
          label: "Owner",
          path: "/ownersignup",
          icon: "🏠",
        });
      }
    }

    return missing;
  };

  const missingRoles = getMissingRoles();

  if (loading) {
    return (
      <header className="sticky top-0 z-50">
        <nav className="flex flex-wrap justify-between items-center w-full bg-[var(--theme-surface)] border-b border-[var(--theme-border)] px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-10 rounded-lg bg-[var(--theme-card)] animate-pulse" />
            <div className="w-32 h-5 rounded bg-[var(--theme-card)] animate-pulse" />
          </div>

          <div className="hidden lg:flex gap-6 xl:gap-8">
            <div className="w-14 h-4 rounded bg-[var(--theme-card)] animate-pulse" />
            <div className="w-24 h-4 rounded bg-[var(--theme-card)] animate-pulse" />
            <div className="w-16 h-4 rounded bg-[var(--theme-card)] animate-pulse" />
            <div className="w-14 h-4 rounded bg-[var(--theme-card)] animate-pulse" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--theme-card)] animate-pulse" />
            <div className="w-32 h-9 rounded-lg bg-[var(--theme-card)] animate-pulse" />
          </div>
        </nav>
      </header>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .animate-fadeDown {
          animation: fadeDown .22s ease-out both;
        }

        .animate-slideIn {
          animation: slideInRight .3s ease-out both;
        }

        .animate-logoFloat {
          animation: logoFloat 3s ease-in-out infinite;
        }
      `}</style>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "shadow-[0_0_18px_rgba(201,164,92,0.08)]"
            : "shadow-[0_0_14px_rgba(201,164,92,0.06)]"
        }`}
      >
        <nav className="flex flex-wrap justify-between items-center w-full bg-[var(--theme-surface)] border-b border-[var(--theme-border)] px-4 sm:px-6 py-3">
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group relative"
          >
            <img
              src={logo}
              alt="PG Stay Logo"
              className="w-11 h-10 rounded-lg object-cover border border-[var(--theme-accent)] transition-transform duration-300 group-hover:scale-[1.02] animate-logoFloat"
            />

            <span className="absolute -inset-1 rounded-lg bg-[var(--theme-accent)] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 pointer-events-none" />

              <h1
              className="text-lg sm:text-2xl font-extrabold tracking-tight"
              style={{
                color: "var(--theme-text)",
              }}
            >
              PAYING{" "}
              <span
                style={{
                  color: "var(--theme-accent)",
                }}
              >
                GUEST
              </span>
            </h1>
          </Link>

          {!isSimple && (
            <ul className="hidden lg:flex flex-wrap items-center gap-6 xl:gap-8">
              <li>
                <NavLink to="/" className={navLinkClass}>
                  HOME
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/mybooking"
                  className={navLinkClass}
                >
                  MY BOOKING
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contactus"
                  className={navLinkClass}
                >
                  CONTACT
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/aboutus"
                  className={navLinkClass}
                >
                  ABOUT
                </NavLink>
              </li>
            </ul>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {isRegularUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 hover:border-[var(--theme-accent)] transition-all duration-200">
                  <NotificationBell />
                </div>

                <div
                  className="hidden md:block relative"
                  ref={profileRef}
                >
                  <button
                    onClick={() => {
                      setProfileOpen(!profileOpen);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1 cursor-pointer rounded-lg hover:bg-[var(--theme-accent)]/10 transition-colors duration-200 ring-1 ring-transparent hover:ring-[var(--theme-accent)]/30"
                  >
                    {user.profileImage ? (
                      <img
                        src={
                          user.profileImage.startsWith("http")
                            ? user.profileImage
                            : `${SERVER_ORIGIN}${user.profileImage}`
                        }
                        alt={user.fullname || "Profile"}
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-[var(--theme-accent)]/50 shrink-0 transition-transform duration-300 hover:scale-[1.02]"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl text-[var(--theme-accent)] shrink-0 transition-transform duration-300 hover:scale-[1.02]" />
                    )}

                    <div className="hidden sm:flex flex-col items-start leading-tight">
                      <span className="text-xs font-bold text-[var(--theme-text)]">
                        {user.fullname || "User"}
                      </span>

                      <span className="text-[10px] font-medium text-[var(--theme-accent)] capitalize">
                        {activeRole || user.role || "Tenant"}
                      </span>
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 rounded-xl shadow-[0_0_24px_rgba(0,0,0,0.4)] py-2 z-50 animate-fadeDown origin-top-right">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] hover:pl-5 transition-all duration-200"
                      >
                        <FaUser className="text-sm text-[var(--theme-accent)]" />
                        My Profile
                      </Link>

                      <div
                        className="flex items-center justify-between gap-3 px-4 py-3"
                        style={{
                          borderTop: "1px solid color-mix(in srgb, var(--theme-accent) 15%, transparent)",
                          borderBottom: "1px solid color-mix(in srgb, var(--theme-accent) 15%, transparent)",
                        }}
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                            Theme Mode
                          </p>
                          <p className="text-[10px] text-[var(--theme-muted)] mt-0.5">
                            {getThemeLabel()}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={cycleTheme}
                          title={`Current theme: ${getThemeLabel()}. Click to change theme.`}
                          aria-label={`Current theme: ${getThemeLabel()}. Click to change theme.`}
                          className="relative w-[58px] h-8 shrink-0 rounded-full bg-[var(--theme-accent)]/25 border border-[var(--theme-accent)]/50 shadow-inner transition-all duration-300 hover:bg-[var(--theme-accent)]/35 cursor-pointer"
                        >
                          <span
                            className={`absolute left-[3px] top-[3px] w-6 h-6 rounded-full bg-[var(--theme-card)] border border-[var(--theme-accent)] shadow-[0_2px_8px_rgba(0,0,0,0.22)] flex items-center justify-center text-[10px] transition-transform duration-300 ease-out ${
                              theme === "offwhite"
                                ? "translate-x-[26px]"
                                : "translate-x-0"
                            }`}
                          >
                          </span>
                        </button>
                      </div>

                      <div
                        className="relative"
                        ref={roleMenuRef}
                      >
                        <button
                          data-role-toggle
                          onClick={() =>
                            setRoleMenuOpen(!roleMenuOpen)
                          }
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] hover:pl-5 transition-all duration-200 cursor-pointer"
                        >
                          <MdSwitchAccount className="text-base text-[var(--theme-accent)]" />

                          {userRoles.length > 1
                            ? "Switch Account"
                            : "Manage Account"}
                        </button>

                        {roleMenuOpen && (
                          <div className="absolute left-0 top-full w-full bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-1.5 z-[60] animate-fadeDown">
                            {userRoles.map((role) => (
                              <button
                                key={role}
                                onClick={() =>
                                  handleSwitchRole(role)
                                }
                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer capitalize ${
                                  activeRole === role
                                    ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                                    : "text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                                }`}
                              >
                                {role}
                                {activeRole === role && " ✓"}
                              </button>
                            ))}

                            {missingRoles.length > 0 && (
                              <>
                                <div className="border-t border-[var(--theme-accent)]/15 my-1" />

                                {missingRoles.map((target) => (
                                  <button
                                    key={target.label}
                                    onClick={() => {
                                      setProfileOpen(false);
                                      setRoleMenuOpen(false);
                                      navigate(target.path);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 transition-all duration-200 cursor-pointer flex items-center gap-2"
                                  >
                                    <span className="text-sm">
                                      {target.icon}
                                    </span>

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

                      <button
                        onClick={onLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:pl-5 transition-all duration-200 cursor-pointer"
                      >
                        <MdLogout className="text-base" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-2xl text-[var(--theme-text)] p-2 rounded-lg hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <HiX /> : <HiMenu />}
                </button>
              </div>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-3">
                 <NavLink
  to="/login"
  className="px-4 py-1.5 text-center bg-transparent font-bold text-xs border border-[var(--theme-accent)] text-[var(--theme-accent)] rounded-lg hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                      >
  LOGIN
</NavLink>

                  {!isSimple && (
                    <>
                      <NavLink
                        to="/signup"
                        className="px-4 py-1.5 text-center bg-transparent font-bold text-xs border border-[var(--theme-accent)] text-[var(--theme-accent)] rounded-lg hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                      >
                        SIGN UP
                      </NavLink>

                      <NavLink
                        to="/apply-agent-form"
                        className="px-4 py-1.5 text-center bg-transparent font-bold text-xs border border-[var(--theme-accent)] text-[var(--theme-accent)] rounded-lg hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                      >
                        APPLY FOR AGENT
                      </NavLink>

                      <NavLink
                        to="/list-your-property"
                       className="px-4 py-1.5 text-center bg-transparent font-bold text-xs border border-[var(--theme-accent)] text-[var(--theme-accent)] rounded-lg hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                      >
                        LIST YOUR PROPERTY
                      </NavLink>
                    </>
                  )}
                </div>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="md:hidden text-2xl text-[var(--theme-text)] p-2 rounded-lg hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <HiX /> : <HiMenu />}
                </button>
              </>
            )}
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden absolute right-2 top-full w-[calc(100vw-1rem)] max-w-[280px] bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 shadow-[0_0_28px_rgba(0,0,0,0.5)] rounded-xl mt-2 py-3 px-2 animate-slideIn">
            {isRegularUser ? (
              <>
                <NavLink
                  to="/"
                  onClick={handleMobileNavigation}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all duration-200"
                >
                  Home
                </NavLink>

                <NavLink
                  to="/mybooking"
                  onClick={handleMobileNavigation}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all duration-200"
                >
                  My Booking
                </NavLink>

                <NavLink
                  to="/contactus"
                  onClick={handleMobileNavigation}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all duration-200"
                >
                  Contact Us
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={handleMobileNavigation}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all duration-200"
                >
                  My Profile
                </NavLink>

                <NavLink
                  to="/aboutus"
                  onClick={handleMobileNavigation}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all duration-200"
                >
                  About
                </NavLink>

                <div className="border-t border-[var(--theme-accent)]/20 my-2" />

                <div className="px-2 py-2">
                  <div className="flex items-center justify-between px-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-accent)]">
                        Theme Mode
                      </p>

                      <p className="text-[10px] text-[var(--theme-muted)] mt-0.5">
                        {getThemeLabel()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={cycleTheme}
                      title={`Current theme: ${getThemeLabel()}. Click to change theme.`}
                      aria-label={`Current theme: ${getThemeLabel()}. Click to change theme.`}
                      className="relative w-[58px] h-8 rounded-full bg-[var(--theme-accent)]/25 border border-[var(--theme-accent)]/50 shadow-inner transition-all duration-300 hover:bg-[var(--theme-accent)]/35 cursor-pointer shrink-0"
                    >
                      <span
                        className={`absolute left-[3px] top-[3px] w-6 h-6 rounded-full bg-[var(--theme-card)] border border-[var(--theme-accent)] shadow-[0_2px_8px_rgba(0,0,0,0.22)] flex items-center justify-center text-[10px] transition-transform duration-300 ease-out ${
                          theme === "offwhite"
                            ? "translate-x-[26px]"
                            : "translate-x-0"
                        }`}
                      >
                      </span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-[var(--theme-accent)]/20 my-2" />

                <button
                  type="button"
                  onClick={onLogoutClick}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] transition-all duration-200"
                >
                  <MdLogout className="text-lg mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={handleMobileNavigation}
                  className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] transition-all duration-200"
                >
                  LOGIN
                </NavLink>

                {!isSimple && (
                  <>
                    <NavLink
                      to="/signup"
                      onClick={handleMobileNavigation}
                      className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 transition-all duration-200"
                    >
                      SIGN UP
                    </NavLink>

                    <NavLink
                      to="/apply-agent-form"
                      onClick={handleMobileNavigation}
                      className="flex items-center px-4 py-3 rounded-lg text-sm font-bold text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 transition-all duration-200"
                    >
                      APPLY FOR AGENT
                    </NavLink>

                    <NavLink
                      to="/list-your-property"
                      onClick={handleMobileNavigation}
                      className="flex items-center justify-center px-4 py-3 mt-1 rounded-lg text-xs bg-[var(--theme-accent)] text-[var(--theme-button-text)] font-bold hover:bg-[var(--theme-accent-hover)] transition-all duration-200"
                    >
                      LIST YOUR PROPERTY
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;