import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSpinner } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const DASHBOARD_BY_ROLE = {
  admin: "/admin/dashboard",
  owner: "/owner/dashboard",
  agent: "/agent/dashboard",
  tenant: "/",
};

const AFTER_LOGOUT_BY_ROLE = {
  admin: "/admin/login",
  owner: "/",
  agent: "/",
  tenant: "/",
};

const Logout = () => {
  const { user, handleLogout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const cancelPath = DASHBOARD_BY_ROLE[user?.role] || "/";
  const afterLogoutPath = AFTER_LOGOUT_BY_ROLE[user?.role] || "/";

  const onCancel = () => {
    navigate(cancelPath);
  };

  const onConfirm = async () => {
    setIsLoggingOut(true);
    await handleLogout(afterLogoutPath);
  };

  const isOffWhite = theme === "offwhite";

  const cardShadow = isOffWhite
    ? "0 0 24px rgba(43,33,24,0.10)"
    : "0 0 24px rgba(0,0,0,0.28)";

  const hoverShadow = isOffWhite
    ? "0 0 32px rgba(139,90,43,0.18)"
    : "0 0 32px rgba(201,164,92,0.16)";

  const iconShadow = isOffWhite
    ? "0 0 20px rgba(139,90,43,0.16)"
    : "0 0 20px rgba(201,164,92,0.16)";

  const buttonShadow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.18)"
    : "0 0 18px rgba(201,164,92,0.18)";

  const buttonHoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.30)"
    : "0 0 28px rgba(201,164,92,0.30)";

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10 font-sans transition-colors duration-500"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-5 sm:p-10 text-center transition-all duration-500 ease-out hover:-translate-y-1"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-accent)",
          boxShadow: cardShadow,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-accent-hover)";
          e.currentTarget.style.boxShadow = hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-accent)";
          e.currentTarget.style.boxShadow = cardShadow;
        }}
      >
        <div className="flex justify-center">
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-card)",
              border: "1px solid var(--theme-accent)",
              boxShadow: iconShadow,
            }}
          >
            <FaSignOutAlt
              className="text-3xl sm:text-5xl"
              style={{ color: "var(--theme-accent)" }}
            />
          </div>
        </div>

        <h1
          className="text-xl sm:text-3xl font-extrabold mt-5 sm:mt-6 tracking-tight"
          style={{ color: "var(--theme-text)" }}
        >
          Logout
        </h1>

        <div className="flex justify-center mt-3 sm:mt-4">
          <div
            className="w-20 sm:w-48 h-0.5 sm:h-1 rounded-full"
            style={{
              backgroundColor: "var(--theme-accent)",
              boxShadow: "0 0 14px rgba(139,90,43,0.20)",
            }}
          />
        </div>

        <p
          className="text-sm sm:text-base mt-5 sm:mt-6 leading-6 sm:leading-7 font-medium"
          style={{ color: "var(--theme-muted-light)" }}
        >
          Are you sure you want to logout
          {user?.fullname ? `, ${user.fullname}` : ""}?
          <br />
          <span
            className="text-xs sm:text-sm"
            style={{ color: "var(--theme-muted-dark)" }}
          >
            You will need to login again to access your account.
          </span>
        </p>

        <div className="flex flex-row justify-center gap-2.5 sm:gap-4 mt-6 sm:mt-9">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="flex-1 sm:flex-none font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: "var(--theme-surface)",
              color: "var(--theme-accent)",
              border: "1px solid var(--theme-accent)",
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.backgroundColor = "var(--theme-card)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(139,90,43,0.20)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--theme-surface)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1 sm:flex-none font-bold px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              border: "1px solid var(--theme-accent)",
              boxShadow: buttonShadow,
            }}
            onMouseEnter={(e) => {
              if (!isLoggingOut) {
                e.currentTarget.style.backgroundColor = "var(--theme-accent-hover)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = buttonHoverShadow;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--theme-accent)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = buttonShadow;
            }}
          >
            {isLoggingOut && <FaSpinner className="animate-spin text-sm" />}
            {isLoggingOut ? "Logging out..." : "Confirm Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
