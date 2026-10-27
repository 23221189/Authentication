import React from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

const AuthLayout = () => {
  const { theme } = useTheme();

  return (
    <div
      className="flex justify-center items-center min-h-screen w-full transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      <Outlet />
    </div>
  );
};

export default AuthLayout;