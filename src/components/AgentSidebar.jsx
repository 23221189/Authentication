import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardCheck,
  FaBuilding,
  FaHistory,
  FaSignOutAlt,
  FaHeadset,
  FaTimes,
  FaCreditCard,
} from "react-icons/fa";
import pg from "../assets/pg.jpeg";
import pg2 from "../assets/pg2.jpeg";
import { useTheme } from "../context/ThemeContext.jsx";

function AgentSidebar({ onClose, pendingCount = 0 }) {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";
  const logo = isOffWhite ? pg2 : pg;

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
      isActive
        ? "bg-[var(--theme-accent)] !text-[var(--theme-button-text)] border border-[var(--theme-accent-hover)] shadow-[0_6px_18px_rgba(var(--theme-accent-rgb),0.18)]"
        : "text-[var(--theme-muted-light)] border border-transparent bg-[var(--theme-surface)] hover:bg-[var(--theme-bg)] hover:text-[var(--theme-accent)] hover:border-[var(--theme-border)]"
    }`;

  const navItems = [
    {
      path: "/agent/dashboard",
      icon: FaHome,
      label: "Dashboard",
    },
    {
      path: "/agentproperties",
      icon: FaBuilding,
      label: "Assigned Properties",
    },
    {
      path: "/agentpropertyverification",
      icon: FaClipboardCheck,
      label: "Property Verification",
      badge: pendingCount,
    },
    {
      path: "/agenthistory",
      icon: FaHistory,
      label: "Assigned History",
    },
    {
      path: "/agentpayments",
      icon: FaCreditCard,
      label: "Payment",
    },
  ];

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        html[data-theme="offwhite"] .agent-sidebar-nav:not([aria-current="page"]):hover,
        html[data-theme="offwhite"] .agent-sidebar-nav:not([aria-current="page"]):hover > div,
        html[data-theme="offwhite"] .agent-sidebar-nav:not([aria-current="page"]):hover span,
        html[data-theme="offwhite"] .agent-sidebar-nav:not([aria-current="page"]):hover svg {
          color: var(--theme-accent) !important;
          -webkit-text-fill-color: var(--theme-accent) !important;
        }

        html[data-theme="offwhite"] .agent-sidebar-nav[aria-current="page"],
        html[data-theme="offwhite"] .agent-sidebar-nav[aria-current="page"] > div,
        html[data-theme="offwhite"] .agent-sidebar-nav[aria-current="page"] span,
        html[data-theme="offwhite"] .agent-sidebar-nav[aria-current="page"] svg {
          color: var(--theme-button-text) !important;
          -webkit-text-fill-color: var(--theme-button-text) !important;
        }

        html[data-theme="offwhite"] .agent-sidebar-nav:focus,
        html[data-theme="offwhite"] .agent-sidebar-nav:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }

        html[data-theme="offwhite"] .agent-sidebar-nav::selection,
        html[data-theme="offwhite"] .agent-sidebar-nav *::selection {
          background: rgba(var(--theme-accent-rgb), 0.12) !important;
          color: var(--theme-text) !important;
        }
      `}</style>

      <div className="h-full w-full overflow-hidden border-r border-[var(--theme-accent)]/25 bg-[var(--theme-surface)] text-[var(--theme-text)] shadow-[8px_0_35px_rgba(0,0,0,0.18)] flex flex-col transition-colors duration-300">

        <div className="shrink-0 flex items-center justify-between px-4 py-5 border-b border-[var(--theme-accent)]/20 bg-[var(--theme-surface)] shadow-[0_6px_22px_rgba(0,0,0,0.10)]">

          <div className="flex items-center gap-3">

            <div
              className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden"
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

            <div>
              <h1
                className="text-xl font-extrabold tracking-tight"
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
                Agent Panel
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            type="button"
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--theme-bg)] text-[var(--theme-muted-dark)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-card)] hover:border hover:border-[var(--theme-border)] hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.12)] transition-all duration-300 cursor-pointer"
          >
            <FaTimes />
          </button>

        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1.5 bg-[var(--theme-surface)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={(state) =>
                `${linkClass(state)} agent-sidebar-nav`
              }
            >
              <div className="flex items-center gap-4 min-w-0 text-inherit">

                <item.icon className="text-lg shrink-0 transition-all duration-300 text-inherit" />

                <span className="truncate">
                  {item.label}
                </span>

              </div>

              {item.badge > 0 && (
                <span className="bg-[var(--theme-accent)] text-[var(--theme-button-text)] text-[10px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.25)] transition-all duration-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

        </div>

        <div className="shrink-0 p-3 border-t border-[var(--theme-accent)]/20 bg-[var(--theme-surface)] shadow-[0_-8px_28px_rgba(0,0,0,0.12)]">

          <div className="bg-[var(--theme-bg)] border border-[var(--theme-accent)]/25 rounded-2xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/55">

            <div className="flex items-center gap-2 mb-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--theme-accent)]/25 bg-[var(--theme-surface)] text-[var(--theme-accent)] shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.12)] transition-all duration-300 hover:-translate-y-0.5">
                <FaHeadset className="text-sm" />
              </div>

              <h3 className="font-extrabold text-[var(--theme-text)] text-sm">
                Need Help?
              </h3>

            </div>

            <p className="text-[var(--theme-muted-dark)] text-[11px] mt-1.5 leading-snug font-medium">
              Reach out if you're unsure about a verification.
            </p>

            <Link
              to="/contact"
              onClick={handleLinkClick}
              className="mt-3 flex items-center justify-center gap-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] py-2.5 rounded-lg font-bold text-xs shadow-[0_7px_22px_rgba(var(--theme-accent-rgb),0.20)] hover:shadow-[0_10px_28px_rgba(var(--theme-accent-rgb),0.30)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <FaHeadset className="text-[10px]" />
              Contact Admin
            </Link>

          </div>

          <Link
            to="/agentlogout"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--theme-bg)] text-[var(--theme-muted-light)] hover:bg-[var(--theme-surface)] hover:border-[var(--theme-accent)]/30 hover:text-[var(--theme-accent)] hover:shadow-[0_5px_18px_rgba(var(--theme-accent-rgb),0.10)] font-bold text-sm transition-all duration-300 mt-2 border border-transparent"
          >
            <FaSignOutAlt className="text-lg text-[var(--theme-accent)]" />
            <span>Logout</span>
          </Link>

        </div>

      </div>
    </>
  );
}

export default AgentSidebar;