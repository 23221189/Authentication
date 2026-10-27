import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";

const Adminlogin = () => {
  const { loginAsAdmin } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const isOffWhite = theme === "offwhite";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      await loginAsAdmin({ email, password });
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message || "Invalid admin credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center p-4 font-sans transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px ${
            isOffWhite ? "#f7f1e7" : "#171717"
          } inset !important;
          box-shadow: 0 0 0 1000px ${
            isOffWhite ? "#f7f1e7" : "#171717"
          } inset !important;
          -webkit-text-fill-color: ${
            isOffWhite ? "#2b2118" : "#f5efe3"
          } !important;
          caret-color: ${
            isOffWhite ? "#2b2118" : "#f5efe3"
          } !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      <div
        className="w-full max-w-md rounded-3xl border p-6 transition-all duration-300 ease-out hover:-translate-y-1 sm:p-8"
        style={{
          backgroundColor: "var(--theme-card)",
          borderColor: "var(--theme-border)",
          boxShadow: isOffWhite
            ? "0 12px 35px rgba(43,33,24,0.10)"
            : "0 12px 35px rgba(0,0,0,0.50)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-accent)";
          e.currentTarget.style.boxShadow = isOffWhite
            ? "0 12px 35px rgba(139,90,43,0.18)"
            : "0 12px 35px rgba(201,164,92,0.18)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--theme-border)";
          e.currentTarget.style.boxShadow = isOffWhite
            ? "0 12px 35px rgba(43,33,24,0.10)"
            : "0 12px 35px rgba(0,0,0,0.50)";
        }}
      >
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{
              borderColor: "var(--theme-accent)",
              backgroundColor: isOffWhite
                ? "rgba(139,90,43,0.10)"
                : "rgba(201,164,92,0.10)",
              color: "var(--theme-accent)",
              boxShadow: isOffWhite
                ? "0 0 22px rgba(139,90,43,0.12)"
                : "0 0 22px rgba(201,164,92,0.12)",
            }}
          >
            <FaLock className="text-2xl" />
          </div>

          <h2
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
            style={{ color: "var(--theme-text)" }}
          >
            ADMIN{" "}
            <span style={{ color: "var(--theme-accent)" }}>
              PORTAL
            </span>
          </h2>

          <p
            className="mt-2 text-sm font-medium"
            style={{ color: "var(--theme-muted-dark)" }}
          >
            Sign in with administrator credentials
          </p>
        </div>

        {formError && (
          <div
            className="mb-5 rounded-xl border px-4 py-3 text-center text-xs font-medium transition-all duration-300 hover:-translate-y-0.5"
            style={{
              borderColor: isOffWhite
                ? "rgba(139,90,43,0.25)"
                : "rgba(201,164,92,0.25)",
              backgroundColor: isOffWhite
                ? "rgba(139,90,43,0.10)"
                : "rgba(201,164,92,0.10)",
              color: "var(--theme-accent-hover)",
              boxShadow: isOffWhite
                ? "0 5px 18px rgba(139,90,43,0.08)"
                : "0 5px 18px rgba(201,164,92,0.08)",
            }}
          >
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div
            className="flex h-14 flex-row items-center rounded-xl border px-4 transition-all duration-300 focus-within:ring-2 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--theme-bg)",
              borderColor: "var(--theme-border)",
              "--tw-ring-color": isOffWhite
                ? "rgba(139,90,43,0.20)"
                : "rgba(201,164,92,0.20)",
            }}
          >
            <MdEmail
              className="mr-3 h-5 w-5 shrink-0"
              style={{ color: "var(--theme-accent)" }}
            />

            <input
              type="email"
              name="email"
              placeholder="Admin Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:opacity-70"
              style={{
                color: "var(--theme-text)",
                caretColor: "var(--theme-accent)",
              }}
            />
          </div>

          <div
            className="flex h-14 flex-row items-center rounded-xl border px-4 transition-all duration-300 focus-within:ring-2 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--theme-bg)",
              borderColor: "var(--theme-border)",
              "--tw-ring-color": isOffWhite
                ? "rgba(139,90,43,0.20)"
                : "rgba(201,164,92,0.20)",
            }}
          >
            <FaLock
              className="mr-3 h-4 w-4 shrink-0"
              style={{ color: "var(--theme-accent)" }}
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:opacity-70"
              style={{
                color: "var(--theme-text)",
                caretColor: "var(--theme-accent)",
              }}
            />

            {password && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-3 flex shrink-0 cursor-pointer items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                style={{ color: "var(--theme-muted-dark)" }}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-lg" />
                ) : (
                  <FaEye className="text-lg" />
                )}
              </button>
            )}
          </div>

          <div className="flex items-center justify-end text-sm">
            <Link
              to="/forgot-password"
              className="font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:underline"
              style={{ color: "var(--theme-accent)" }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 h-14 w-full cursor-pointer rounded-xl text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              boxShadow: isOffWhite
                ? "0 8px 24px rgba(139,90,43,0.20)"
                : "0 8px 24px rgba(201,164,92,0.20)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-accent-hover)";
              e.currentTarget.style.boxShadow = isOffWhite
                ? "0 8px 24px rgba(139,90,43,0.30)"
                : "0 8px 24px rgba(201,164,92,0.30)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow = isOffWhite
                ? "0 8px 24px rgba(139,90,43,0.20)"
                : "0 8px 24px rgba(201,164,92,0.20)";
            }}
          >
            {submitting ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>

        <div
          className="mt-7 border-t pt-5 text-center"
          style={{ borderColor: "var(--theme-border)" }}
        >
          <p
            className="text-xs font-medium"
            style={{ color: "var(--theme-muted-dark)" }}
          >
            Restricted access · Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Adminlogin;
