import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUser,
  FaBuilding,
  FaUserTie,
  FaSignOutAlt,
  FaChevronDown,
  FaTimes,
  FaCalendarAlt,
  FaCreditCard,
  FaHeadset,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import pg from "../assets/pg.jpeg";
import pg2 from "../assets/pg2.jpeg";

function AdminSidebar({ isOpen, onClose }) {
  const { handleLogout } = useAuth();
  const { theme } = useTheme();

  const location = useLocation();
  const navigate = useNavigate();

  const isOffWhite = theme === "offwhite";
  const logo = isOffWhite ? pg2 : pg;

  // Off-White colors = same as PO sidebar:
  // dark brown text, brown borders, solid brown active item with white text
  const restText = isOffWhite
    ? "var(--theme-text)"
    : "var(--theme-muted-light)";
  const idleBorder = isOffWhite ? "var(--theme-border)" : "transparent";

  const [usersOpen, setUsersOpen] = useState(
    location.pathname.startsWith("/admin/tenants") ||
      location.pathname.startsWith("/admin/property-owners") ||
      location.pathname.startsWith("/admin/propertyowners") ||
      location.pathname.startsWith("/admin/agents")
  );

  useEffect(() => {
    if (
      location.pathname.startsWith("/admin/tenants") ||
      location.pathname.startsWith("/admin/property-owners") ||
      location.pathname.startsWith("/admin/propertyowners") ||
      location.pathname.startsWith("/admin/agents")
    ) {
      setUsersOpen(true);
    }
  }, [location.pathname]);

  const closeOnMobile = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const logout = () => {
    if (typeof handleLogout === "function") {
      handleLogout();
    }

    navigate("/admin/logout");
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
      isActive
        ? isOffWhite
          ? "bg-[var(--theme-accent)] text-white border border-[var(--theme-accent)]"
          : "bg-[var(--theme-accent)] text-[var(--theme-button-text)] border border-[var(--theme-accent-hover)] shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.25)]"
        : isOffWhite
          ? "text-[var(--theme-text)] border border-[var(--theme-border)] hover:bg-[var(--theme-card)]"
          : "text-[var(--theme-muted-light)] border border-transparent hover:text-[var(--theme-accent)] hover:bg-[var(--theme-card)] hover:border-[var(--theme-border)] hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.12)] hover:-translate-y-0.5"
    }`;

  const childNavClasses = ({ isActive }) =>
    `flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-300 ${
      isActive
        ? isOffWhite
          ? "bg-[var(--theme-accent)] text-white"
          : "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
        : isOffWhite
          ? "text-[var(--theme-text)] hover:bg-[var(--theme-card)]"
          : "text-[var(--theme-muted-light)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-card)]"
    }`;

  const usersRestColor = usersOpen ? "var(--theme-accent)" : restText;

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 backdrop-blur-[3px] lg:hidden"
          style={{
            backgroundColor: isOffWhite
              ? "rgba(247,241,231,0.72)"
              : "rgba(0,0,0,0.55)",
          }}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col z-50 overflow-hidden overscroll-contain transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--theme-surface)",
          color: "var(--theme-text)",
          borderRight: "1px solid var(--theme-border)",
          boxShadow: isOffWhite
            ? "8px 0 30px rgba(85,44,6,0.12)"
            : "8px 0 30px rgba(0,0,0,0.55)",
        }}
      >
        <div
          className="shrink-0 flex items-center justify-between px-4 py-5"
          style={{
            borderBottom: "1px solid var(--theme-border)",
            backgroundColor: "var(--theme-surface)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden shrink-0"
              style={{
                border: "1px solid var(--theme-border)",
                boxShadow: isOffWhite
                  ? "0 0 16px rgba(var(--theme-accent-rgb),0.15)"
                  : "0 0 16px rgba(var(--theme-accent-rgb),0.20)",
              }}
            >
              <img
                src={logo}
                alt="logo"
                className="rounded-full h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <h1
                className="text-xl font-extrabold tracking-tight truncate"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                PAYING GUEST
              </h1>

              <p
                className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                style={{
                  color: "var(--theme-accent)",
                }}
              >
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-xl p-1.5 rounded-lg transition-all duration-300 cursor-pointer"
            style={{
              color: "var(--theme-muted-dark)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--theme-accent)";
              e.currentTarget.style.backgroundColor = "var(--theme-card)";
              e.currentTarget.style.boxShadow = isOffWhite
                ? "0 0 18px rgba(var(--theme-accent-rgb),0.18)"
                : "0 0 18px rgba(85,44,6,0.30)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--theme-muted-dark)";
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 flex flex-col gap-1.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{
            backgroundColor: "var(--theme-surface)",
            scrollbarColor: "var(--theme-border) transparent",
          }}
        >
          <nav className="flex flex-col gap-1.5">

            <NavLink
              to="/admin/dashboard"
              onClick={closeOnMobile}
              className={navLinkClasses}
            >
              <FaTachometerAlt className="text-lg shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <div>
              <button
                type="button"
                onClick={() => setUsersOpen((value) => !value)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer"
                style={{
                  color: usersRestColor,
                  backgroundColor: "transparent",
                  border: `1px solid ${idleBorder}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isOffWhite
                    ? usersRestColor
                    : "var(--theme-accent)";
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-card)";
                  e.currentTarget.style.borderColor =
                    "var(--theme-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = usersRestColor;
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = idleBorder;
                }}
              >
                <FaUsers className="text-lg shrink-0" />

                <span className="flex-1 text-left">
                  Users
                </span>

                <FaChevronDown
                  className={`text-xs transition-transform duration-300 ${
                    usersOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {usersOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <NavLink
                    to="/admin/tenants"
                    onClick={closeOnMobile}
                    className={childNavClasses}
                  >
                    <FaUser className="text-sm shrink-0" />
                    <span>Tenants</span>
                  </NavLink>

                  <NavLink
                    to="/admin/propertyowners"
                    onClick={closeOnMobile}
                    className={childNavClasses}
                  >
                    <FaBuilding className="text-sm shrink-0" />
                    <span>Property Owners</span>
                  </NavLink>

                  <NavLink
                    to="/admin/agents"
                    onClick={closeOnMobile}
                    className={childNavClasses}
                  >
                    <FaUserTie className="text-sm shrink-0" />
                    <span>Agents</span>
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink
              to="/admin/properties"
              onClick={closeOnMobile}
              className={navLinkClasses}
            >
              <FaBuilding className="text-lg shrink-0" />
              <span>Properties</span>
            </NavLink>

            <NavLink
              to="/admin/bookings"
              onClick={closeOnMobile}
              className={navLinkClasses}
            >
              <FaCalendarAlt className="text-lg shrink-0" />
              <span>Bookings</span>
            </NavLink>

            <NavLink
              to="/admin/payments"
              onClick={closeOnMobile}
              className={navLinkClasses}
            >
              <FaCreditCard className="text-lg shrink-0" />
              <span>Payments</span>
            </NavLink>

            <NavLink
              to="/admin/support"
              onClick={closeOnMobile}
              className={navLinkClasses}
            >
              <FaHeadset className="text-lg shrink-0" />
              <span>Complaints &amp; Support</span>
            </NavLink>
          </nav>
        </div>

        <div
          className="shrink-0 p-3"
          style={{
            borderTop: "1px solid var(--theme-border)",
            backgroundColor: "var(--theme-surface)",
          }}
        >
          <div
            className="rounded-2xl p-3.5 transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-card)",
              border: "1px solid var(--theme-border)",
              boxShadow: isOffWhite
                ? "0 8px 28px rgba(85,44,6,0.10)"
                : "0 8px 28px rgba(0,0,0,0.65)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow = isOffWhite
                ? "0 0 26px rgba(85,44,6,0.18)"
                : "0 0 26px rgba(85,44,6,0.30)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "var(--theme-border)";
              e.currentTarget.style.boxShadow = isOffWhite
                ? "0 8px 28px rgba(85,44,6,0.10)"
                : "0 8px 28px rgba(0,0,0,0.65)";
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: "var(--theme-bg)",
                  color: "var(--theme-accent)",
                  border: "1px solid var(--theme-border)",
                }}
              >
                <FaHeadset className="text-sm" />
              </div>

              <h3
                className="font-extrabold text-sm"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                Admin Support
              </h3>
            </div>

            <p
              className="text-[11px] mt-1.5 leading-snug font-medium"
              style={{
                color: restText,
              }}
            >
              Manage users, properties and platform activities.
            </p>

            <NavLink
              to="/admin/support"
              onClick={closeOnMobile}
              className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition-all duration-300 active:scale-95"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-button-text)",
                boxShadow: isOffWhite
                  ? "0 0 18px rgba(85,44,6,0.20)"
                  : "0 0 18px rgba(85,44,6,0.30)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent-hover)";
                e.currentTarget.style.boxShadow = isOffWhite
                  ? "0 0 28px rgba(var(--theme-accent-rgb),0.30)"
                  : "0 0 28px rgba(85,44,6,0.48)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow = isOffWhite
                  ? "0 0 18px rgba(85,44,6,0.20)"
                  : "0 0 18px rgba(85,44,6,0.30)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <FaHeadset className="text-[10px]" />
              Open Support
            </NavLink>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: "var(--theme-surface)",
              color: restText,
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-card)";
              e.currentTarget.style.color = isOffWhite
                ? restText
                : "var(--theme-accent)";
              e.currentTarget.style.borderColor =
                "var(--theme-border)";
              e.currentTarget.style.boxShadow = isOffWhite
                ? "0 0 20px rgba(85,44,6,0.16)"
                : "0 0 20px rgba(85,44,6,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-surface)";
              e.currentTarget.style.color = restText;
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FaSignOutAlt
              className="text-lg"
              style={{
                color: "var(--theme-accent)",
              }}
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
