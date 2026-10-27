import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const RootLayout = () => {
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      <Navbar />

      <main
        className="min-h-[calc(100vh-80px)] transition-colors duration-300"
        style={{
          backgroundColor: "var(--theme-bg)",
          color: "var(--theme-text)",
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;