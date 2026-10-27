import { Link, NavLink } from "react-router-dom";
import {
    FaHome,
    FaBuilding,
    FaCalendarAlt,
    FaCreditCard,
    FaSignOutAlt,
    FaPlus,
    FaStar,
    FaTimes,
} from "react-icons/fa";
import pg from "../assets/pg.jpeg";
import pg2 from "../assets/pg2.jpeg";
import { useTheme } from "../context/ThemeContext.jsx";

function POSideBar({ isOpen, onClose }) {
    const { theme } = useTheme();

    const isOffWhite = theme === "offwhite";

    const logo = isOffWhite ? pg2 : pg;

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
            isActive
                ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)] shadow-[0_0_22px_rgba(201,164,92,0.38)] border border-[var(--theme-accent-hover)]"
                : "text-[var(--theme-muted-light)] border border-transparent hover:text-[var(--theme-accent)] hover:bg-[var(--theme-card)] hover:border-[var(--theme-accent)]/70 hover:shadow-[0_0_20px_rgba(201,164,92,0.28)] hover:-translate-y-0.5"
        }`;

    const handleNavClick = () => {
        if (window.innerWidth < 1024 && onClose) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 backdrop-blur-[3px] lg:hidden"
                    style={{
                        backgroundColor:
                            "var(--theme-overlay)",
                    }}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen w-64 flex flex-col z-50 overflow-hidden overscroll-contain transition-transform duration-300 ease-in-out ${
                    isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
                style={{
                    backgroundColor:
                        "var(--theme-surface)",
                    borderRight:
                        "1px solid var(--theme-border)",
                    boxShadow: isOffWhite
                        ? "8px 0 30px rgba(43,33,24,0.14)"
                        : "8px 0 30px rgba(0,0,0,0.75)",
                }}
            >
                <div
                    className="shrink-0 flex items-center justify-between px-4 py-5"
                    style={{
                        borderBottom:
                            "1px solid var(--theme-border)",
                        backgroundColor:
                            "var(--theme-surface)",
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden"
                            style={{
                                border:
                                    "1px solid var(--theme-border)",
                                boxShadow: isOffWhite
                                    ? "0 0 16px rgba(139,90,43,0.15)"
                                    : "0 0 16px rgba(201,164,92,0.20)",
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
                                    color:
                                        "var(--theme-text)",
                                }}
                            >
                                PAYING GUEST
                            </h1>

                            <p
                                className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
                                style={{
                                    color:
                                        "var(--theme-accent)",
                                }}
                            >
                                Owner Panel
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="lg:hidden text-xl p-1.5 rounded-lg transition-all duration-300 cursor-pointer"
                        style={{
                            color:
                                "var(--theme-muted-dark)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                                "var(--theme-accent)";
                            e.currentTarget.style.backgroundColor =
                                "var(--theme-card)";
                            e.currentTarget.style.boxShadow =
                                isOffWhite
                                    ? "0 0 18px rgba(139,90,43,0.18)"
                                    : "0 0 18px rgba(201,164,92,0.30)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                                "var(--theme-muted-dark)";
                            e.currentTarget.style.backgroundColor =
                                "transparent";
                            e.currentTarget.style.boxShadow =
                                "none";
                        }}
                    >
                        <FaTimes />
                    </button>
                </div>

                <div
                    className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 flex flex-col gap-1.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full"
                    style={{
                        backgroundColor:
                            "var(--theme-surface)",
                        scrollbarColor:
                            "var(--theme-border) transparent",
                    }}
                >
                    <NavLink
                        to="/podashboard"
                        onClick={handleNavClick}
                        className={navLinkClasses}
                    >
                        <FaHome className="text-lg transition-all duration-300" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/myproperties"
                        onClick={handleNavClick}
                        className={navLinkClasses}
                    >
                        <FaBuilding className="text-lg transition-all duration-300" />
                        <span>My Properties</span>
                    </NavLink>

                    <NavLink
                        to="/pobookings"
                        onClick={handleNavClick}
                        className={navLinkClasses}
                    >
                        <FaCalendarAlt className="text-lg transition-all duration-300" />
                        <span>Bookings</span>
                    </NavLink>

                    <NavLink
                        to="/popayments"
                        onClick={handleNavClick}
                        className={navLinkClasses}
                    >
                        <FaCreditCard className="text-lg transition-all duration-300" />
                        <span>Payments</span>
                    </NavLink>

                    <NavLink
                        to="/poreviews"
                        onClick={handleNavClick}
                        className={navLinkClasses}
                    >
                        <FaStar className="text-lg transition-all duration-300" />
                        <span>Reviews</span>
                    </NavLink>
                </div>

                <div
                    className="shrink-0 p-3"
                    style={{
                        borderTop:
                            "1px solid var(--theme-border)",
                        backgroundColor:
                            "var(--theme-surface)",
                    }}
                >
                    <div
                        className="rounded-2xl p-3.5 transition-all duration-300"
                        style={{
                            backgroundColor:
                                "var(--theme-card)",
                            border:
                                "1px solid var(--theme-border)",
                            boxShadow: isOffWhite
                                ? "0 8px 28px rgba(43,33,24,0.10)"
                                : "0 8px 28px rgba(0,0,0,0.65)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor =
                                "var(--theme-accent)";
                            e.currentTarget.style.boxShadow =
                                isOffWhite
                                    ? "0 0 26px rgba(139,90,43,0.18)"
                                    : "0 0 26px rgba(201,164,92,0.30)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                                "var(--theme-border)";
                            e.currentTarget.style.boxShadow =
                                isOffWhite
                                    ? "0 8px 28px rgba(43,33,24,0.10)"
                                    : "0 8px 28px rgba(0,0,0,0.65)";
                        }}
                    >
                        <h3
                            className="font-extrabold text-sm"
                            style={{
                                color:
                                    "var(--theme-text)",
                            }}
                        >
                            List More, Earn More!
                        </h3>

                        <p
                            className="text-[11px] mt-1.5 leading-snug font-medium"
                            style={{
                                color:
                                    "var(--theme-muted-light)",
                            }}
                        >
                            Add more properties to reach more tenants.
                        </p>

                        <Link
                            to="/createlisting"
                            onClick={handleNavClick}
                            className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-xs transition-all duration-300 active:scale-95"
                            style={{
                                backgroundColor:
                                    "var(--theme-accent)",
                                color:
                                    "var(--theme-button-text)",
                                boxShadow: isOffWhite
                                    ? "0 0 18px rgba(139,90,43,0.20)"
                                    : "0 0 18px rgba(201,164,92,0.30)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "var(--theme-accent-hover)";
                                e.currentTarget.style.boxShadow =
                                    isOffWhite
                                        ? "0 0 28px rgba(139,90,43,0.30)"
                                        : "0 0 28px rgba(201,164,92,0.48)";
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "var(--theme-accent)";
                                e.currentTarget.style.boxShadow =
                                    isOffWhite
                                        ? "0 0 18px rgba(139,90,43,0.20)"
                                        : "0 0 18px rgba(201,164,92,0.30)";
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >
                            <FaPlus className="text-[10px]" />
                            Create Listing
                        </Link>
                    </div>

                    <Link
                        to="/pologout"
                        onClick={handleNavClick}
                        className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                        style={{
                            backgroundColor:
                                "var(--theme-surface)",
                            color:
                                "var(--theme-muted-light)",
                            border:
                                "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--theme-card)";
                            e.currentTarget.style.color =
                                "var(--theme-accent)";
                            e.currentTarget.style.borderColor =
                                "var(--theme-border)";
                            e.currentTarget.style.boxShadow =
                                isOffWhite
                                    ? "0 0 20px rgba(139,90,43,0.16)"
                                    : "0 0 20px rgba(201,164,92,0.25)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--theme-surface)";
                            e.currentTarget.style.color =
                                "var(--theme-muted-light)";
                            e.currentTarget.style.borderColor =
                                "transparent";
                            e.currentTarget.style.boxShadow =
                                "none";
                        }}
                    >
                        <FaSignOutAlt
                            className="text-lg"
                            style={{
                                color:
                                    "var(--theme-accent)",
                            }}
                        />
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}

export default POSideBar;