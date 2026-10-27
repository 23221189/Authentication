import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--theme-bg)] text-center gap-3 px-4 font-sans text-[var(--theme-text)] transition-colors duration-500">

      <div className="transition-all duration-500 hover:-translate-y-1 hover:drop-shadow-[0_0_18px_rgba(0,0,0,0.2)]">

        <h1 className="text-4xl font-black text-[var(--theme-accent)]">
          403
        </h1>

        <p className="text-[var(--theme-muted-light)] text-sm mt-1">
          You don't have permission to access this page.
        </p>

        <Link
          to="/"
          className="inline-flex mt-4 px-5 py-2.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] text-sm font-bold rounded-lg border border-[var(--theme-accent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,0,0,0.22)] cursor-pointer"
        >
          Back to Home
        </Link>

      </div>

    </div>
  );
};

export default Unauthorized;