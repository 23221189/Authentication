import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaBars,
    FaUser,
    FaChevronDown,
    FaUserCircle,
    FaSignOutAlt,
} from "react-icons/fa";
import { MdSwitchAccount } from "react-icons/md";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

function PODashboardNavbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { theme, changeTheme } = useTheme();

    const {
        user,
        ownerSession,
        ownerBookings = [],
        handleLogout,
        switchRole,
        activeRole,
    } = useAuth();

    const session = ownerSession || user || {};

    const profileImage =
        user?.profileImage ||
        ownerSession?.profileImage ||
        null;

    const userRoles = user
        ? [
              ...new Set(
                  [
                      ...(Array.isArray(user.roles)
                          ? user.roles
                          : []),
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

    const [showProfileMenu, setShowProfileMenu] =
        useState(false);

    const [showRoleMenu, setShowRoleMenu] =
        useState(false);

    const profileRef = useRef(null);
    const roleMenuRef = useRef(null);

    function handleProfileClick() {
        setShowProfileMenu(!showProfileMenu);
        setShowRoleMenu(false);
    }

    function handleSwitchRole(newRole) {
        setShowProfileMenu(false);
        setShowRoleMenu(false);

        if (typeof switchRole === "function") {
            switchRole(newRole);
        }
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
                !roleMenuRef.current.contains(
                    event.target
                ) &&
                !event.target.closest(
                    "[data-owner-role-toggle]"
                )
            ) {
                setShowRoleMenu(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const isOffWhite = theme === "offwhite";

    return (
        <header className="relative z-[60] w-full px-2 sm:px-3 md:px-4 pt-2 sm:pt-3 font-sans">
            <div
                className="min-h-[62px] sm:min-h-[68px] rounded-xl flex items-center px-2.5 sm:px-3 md:px-5 transition-all duration-300"
                style={{
                    backgroundColor:
                        "var(--theme-surface)",
                    border:
                        "1px solid var(--theme-border)",
                    boxShadow: isOffWhite
                        ? "0 8px 28px rgba(43,33,24,0.12)"
                        : "0 8px 28px rgba(0,0,0,0.70)",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                        "var(--theme-accent)";
                    e.currentTarget.style.boxShadow =
                        isOffWhite
                            ? "0 0 28px rgba(139,90,43,0.16)"
                            : "0 0 28px rgba(201,164,92,0.22)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                        "var(--theme-border)";
                    e.currentTarget.style.boxShadow =
                        isOffWhite
                            ? "0 8px 28px rgba(43,33,24,0.12)"
                            : "0 8px 28px rgba(0,0,0,0.70)";
                }}
            >
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="text-lg sm:text-xl mr-2 sm:mr-3 md:mr-8 p-1.5 sm:p-2 rounded-lg transition-all duration-300 shrink-0 cursor-pointer"
                    style={{
                        color:
                            "var(--theme-muted-light)",
                        backgroundColor:
                            "var(--theme-surface)",
                        border:
                            "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color =
                            "var(--theme-accent)";
                        e.currentTarget.style.borderColor =
                            "var(--theme-accent)";
                        e.currentTarget.style.boxShadow =
                            isOffWhite
                                ? "0 0 20px rgba(139,90,43,0.20)"
                                : "0 0 20px rgba(201,164,92,0.30)";
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
                    <FaBars />
                </button>

                <div className="flex flex-col justify-center min-w-0">
                    <p
                        className="text-xs sm:text-sm md:text-lg font-extrabold truncate"
                        style={{
                            color:
                                "var(--theme-text)",
                        }}
                    >
                        Welcome,{" "}
                        <span
                            style={{
                                color:
                                    "var(--theme-accent)",
                            }}
                        >
                            {session?.fullname ||
                                "Property Owner"}
                        </span>
                    </p>
                </div>

                <div className="ml-auto flex items-center gap-1 md:gap-2">
                    <NotificationBell />

                    <div
                        className="h-8 sm:h-9 w-px mx-1.5 sm:mx-2 md:mx-5"
                        style={{
                            backgroundColor:
                                "var(--theme-border)",
                        }}
                    />

                    <div
                        className="relative"
                        ref={profileRef}
                    >
                        <button
                            type="button"
                            onClick={handleProfileClick}
                            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 rounded-xl px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 transition-all duration-300 cursor-pointer"
                            style={{
                                backgroundColor:
                                    "var(--theme-surface)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                    isOffWhite
                                        ? "0 0 22px rgba(139,90,43,0.18)"
                                        : "0 0 22px rgba(201,164,92,0.24)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow =
                                    "none";
                            }}
                        >
                            <div
                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden transition-all duration-300"
                                style={{
                                    backgroundColor:
                                        "var(--theme-card)",
                                    color:
                                        "var(--theme-accent)",
                                    border:
                                        "1px solid var(--theme-border)",
                                    boxShadow:
                                        isOffWhite
                                            ? "0 0 16px rgba(139,90,43,0.12)"
                                            : "0 0 16px rgba(201,164,92,0.18)",
                                }}
                            >
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-base sm:text-lg md:text-xl" />
                                )}
                            </div>

                            <div className="text-left leading-tight hidden md:block">
                                <p
                                    className="font-bold text-sm"
                                    style={{
                                        color:
                                            "var(--theme-text)",
                                    }}
                                >
                                    {session?.fullname ||
                                        "Property Owner"}
                                </p>

                                <p
                                    className="text-xs mt-1 font-semibold"
                                    style={{
                                        color:
                                            "var(--theme-accent)",
                                    }}
                                >
                                    {activeRole
                                        ? activeRole
                                              .charAt(0)
                                              .toUpperCase() +
                                          activeRole.slice(1)
                                        : "Owner"}
                                </p>
                            </div>

                            <FaChevronDown
                                className={`text-xs sm:text-sm ml-1 md:ml-3 hidden sm:block transition-all duration-300 ${
                                    showProfileMenu
                                        ? "rotate-180"
                                        : ""
                                }`}
                                style={{
                                    color:
                                        showProfileMenu
                                            ? "var(--theme-accent)"
                                            : "var(--theme-muted-dark)",
                                }}
                            />
                        </button>

                        {showProfileMenu && (
                            <div
                                className="absolute right-0 mt-3 w-64 rounded-2xl z-50 animate-fadeDown overflow-hidden"
                                style={{
                                    backgroundColor:
                                        "var(--theme-surface)",
                                    border:
                                        "1px solid var(--theme-border)",
                                    boxShadow:
                                        isOffWhite
                                            ? "0 12px 35px rgba(43,33,24,0.18)"
                                            : "0 12px 35px rgba(0,0,0,0.80)",
                                }}
                            >
                                <Link
                                    to="/poprofile"
                                    className="flex items-center gap-3 px-5 py-4 transition-all duration-300 rounded-t-2xl"
                                    style={{
                                        backgroundColor:
                                            "var(--theme-surface)",
                                        color:
                                            "var(--theme-muted-light)",
                                    }}
                                    onClick={() =>
                                        setShowProfileMenu(
                                            false
                                        )
                                    }
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color =
                                            "var(--theme-accent)";
                                        e.currentTarget.style.backgroundColor =
                                            "var(--theme-card)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color =
                                            "var(--theme-muted-light)";
                                        e.currentTarget.style.backgroundColor =
                                            "var(--theme-surface)";
                                    }}
                                >
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-7 h-7 rounded-full object-cover"
                                            style={{
                                                border:
                                                    "1px solid var(--theme-border)",
                                            }}
                                        />
                                    ) : (
                                        <FaUserCircle className="text-lg" />
                                    )}

                                    <span className="font-bold text-sm">
                                        My Profile
                                    </span>
                                </Link>

                                <div
                                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                                    style={{
                                        backgroundColor: "var(--theme-surface)",
                                        color: "var(--theme-text)",
                                        borderTop: "1px solid var(--theme-border)",
                                    }}
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span
                                            className="text-sm font-bold"
                                            style={{ color: "var(--theme-text)" }}
                                        >
                                            Theme Mode
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeTheme(
                                                theme === "offwhite"
                                                    ? "black"
                                                    : "offwhite"
                                            )
                                        }
                                        title={
                                            theme === "offwhite"
                                                ? "Switch to Black Theme"
                                                : "Switch to Off-White Theme"
                                        }
                                        aria-label={
                                            theme === "offwhite"
                                                ? "Switch to Black Theme"
                                                : "Switch to Off-White Theme"
                                        }
                                        className="relative h-8 w-14 shrink-0 rounded-full border transition-all duration-300 cursor-pointer"
                                        style={{
                                            backgroundColor:
                                                theme === "offwhite"
                                                    ? "var(--theme-accent)"
                                                    : "var(--theme-border)",
                                            borderColor:
                                                theme === "offwhite"
                                                    ? "var(--theme-accent)"
                                                    : "var(--theme-border)",
                                        }}
                                    >
                                        <span
                                            className="absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border shadow-sm transition-all duration-300"
                                            style={{
                                                left:
                                                    theme === "offwhite"
                                                        ? "calc(100% - 1.75rem)"
                                                        : "0.2rem",
                                                backgroundColor:
                                                    "var(--theme-surface)",
                                                borderColor:
                                                    "var(--theme-border)",
                                            }}
                                        />
                                    </button>
                                </div>

                                <div
                                    className="relative"
                                    ref={roleMenuRef}
                                >
                                    <button
                                        type="button"
                                        data-owner-role-toggle
                                        onClick={() =>
                                            setShowRoleMenu(
                                                !showRoleMenu
                                            )
                                        }
                                        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-all duration-300 cursor-pointer"
                                        style={{
                                            backgroundColor:
                                                "var(--theme-surface)",
                                            color:
                                                "var(--theme-muted-light)",
                                            borderTop:
                                                "1px solid var(--theme-border)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color =
                                                "var(--theme-accent)";
                                            e.currentTarget.style.backgroundColor =
                                                "var(--theme-card)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color =
                                                "var(--theme-muted-light)";
                                            e.currentTarget.style.backgroundColor =
                                                "var(--theme-surface)";
                                        }}
                                    >
                                        <MdSwitchAccount
                                            className="text-lg"
                                            style={{
                                                color:
                                                    "var(--theme-accent)",
                                            }}
                                        />

                                        <span className="font-bold text-sm">
                                            {userRoles.length > 1
                                                ? "Switch Account"
                                                : "Manage Account"}
                                        </span>
                                    </button>

                                    {showRoleMenu && (
                                        <div
                                            className="absolute right-0 top-full mt-1 w-full rounded-xl z-[60] py-1.5 animate-fadeDown"
                                            style={{
                                                backgroundColor:
                                                    "var(--theme-surface)",
                                                border:
                                                    "1px solid var(--theme-border)",
                                                boxShadow:
                                                    isOffWhite
                                                        ? "0 8px 28px rgba(43,33,24,0.16)"
                                                        : "0 8px 28px rgba(0,0,0,0.80)",
                                            }}
                                        >
                                            {userRoles.map(
                                                (role) => (
                                                    <button
                                                        key={role}
                                                        type="button"
                                                        onClick={() =>
                                                            handleSwitchRole(
                                                                role
                                                            )
                                                        }
                                                        className="w-full text-left px-5 py-2.5 text-xs font-semibold transition-colors cursor-pointer capitalize"
                                                        style={{
                                                            backgroundColor:
                                                                activeRole ===
                                                                role
                                                                    ? "var(--theme-accent)"
                                                                    : "transparent",
                                                            color:
                                                                activeRole ===
                                                                role
                                                                    ? "var(--theme-button-text)"
                                                                    : "var(--theme-text)",
                                                        }}
                                                        onMouseEnter={(
                                                            e
                                                        ) => {
                                                            if (
                                                                activeRole !==
                                                                role
                                                            ) {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "var(--theme-card)";
                                                                e.currentTarget.style.color =
                                                                    "var(--theme-accent)";
                                                            }
                                                        }}
                                                        onMouseLeave={(
                                                            e
                                                        ) => {
                                                            if (
                                                                activeRole !==
                                                                role
                                                            ) {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "transparent";
                                                                e.currentTarget.style.color =
                                                                    "var(--theme-text)";
                                                            }
                                                        }}
                                                    >
                                                        {role}
                                                    </button>
                                                )
                                            )}

                                            {missingRoles.length >
                                                0 && (
                                                <>
                                                    <div
                                                        className="border-t my-1"
                                                        style={{
                                                            borderColor:
                                                                "var(--theme-border)",
                                                        }}
                                                    />

                                                    {missingRoles.map(
                                                        (
                                                            target
                                                        ) => (
                                                            <button
                                                                key={
                                                                    target.label
                                                                }
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowProfileMenu(
                                                                        false
                                                                    );
                                                                    setShowRoleMenu(
                                                                        false
                                                                    );
                                                                    navigate(
                                                                        target.path
                                                                    );
                                                                }}
                                                                className="w-full text-left px-5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2"
                                                                style={{
                                                                    color:
                                                                        "var(--theme-accent)",
                                                                }}
                                                                onMouseEnter={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "var(--theme-card)";
                                                                }}
                                                                onMouseLeave={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "transparent";
                                                                }}
                                                            >
                                                                <span className="text-sm">
                                                                    {target.icon}
                                                                </span>

                                                                <span>
                                                                    +
                                                                    Add{" "}
                                                                    {
                                                                        target.label
                                                                    }{" "}
                                                                    Access
                                                                </span>
                                                            </button>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <Link
                                    to="/pologout"
                                    className="flex items-center gap-3 px-5 py-4 transition-all duration-300 rounded-b-2xl"
                                    style={{
                                        backgroundColor:
                                            "var(--theme-surface)",
                                        color:
                                            "var(--theme-muted-light)",
                                        borderTop:
                                            "1px solid var(--theme-border)",
                                    }}
                                    onClick={() =>
                                        setShowProfileMenu(
                                            false
                                        )
                                    }
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color =
                                            "var(--theme-accent)";
                                        e.currentTarget.style.backgroundColor =
                                            "var(--theme-card)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color =
                                            "var(--theme-muted-light)";
                                        e.currentTarget.style.backgroundColor =
                                            "var(--theme-surface)";
                                    }}
                                >
                                    <FaSignOutAlt
                                        className="text-lg"
                                        style={{
                                            color:
                                                "var(--theme-accent)",
                                        }}
                                    />

                                    <span className="font-bold text-sm">
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

export default PODashboardNavbar;