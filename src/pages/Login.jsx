import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiChevronDown, FiEye, FiEyeOff } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { useTheme } from "../context/ThemeContext.jsx";

import cozyHomeBg from "../assets/images/cozy-home-bg.jpeg";
import cozyHomeBgOffWhite from "../assets/images/cozy-home-bg2.jpeg";

const DASHBOARD_BY_ROLE = {
  tenant: "/",
  owner: "/podashboard",
  agent: "/agent/dashboard",
  admin: "/admin/dashboard",
};

const SIGNUP_BY_ROLE = {
  tenant: "/signup",
  owner: "/ownersignup",
  agent: "/apply-agent-form",
};

const ROLE_OPTIONS = [
  { value: "tenant", label: "Tenant" },
  { value: "owner", label: "Property Owner" },
  { value: "agent", label: "Agent" },
];

const Login = () => {
  const { user, activeRole, loading, login } = useAuth();
  const { theme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [roleDropdown, setRoleDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid =
    email.trim() !== "" && password.trim() !== "";

  const selectedRole =
    ROLE_OPTIONS.find((item) => item.value === role) ||
    ROLE_OPTIONS[0];

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setRoleDropdown(false);
  };

  const backgroundImage =
    theme === "blue"
      ? cozyHomeBgBlue
      : theme === "offwhite"
        ? cozyHomeBgOffWhite
        : cozyHomeBg;

  const overlayColor =
    theme === "blue"
      ? "rgba(16, 40, 70, 0.80)"
      : theme === "offwhite"
        ? "rgba(255, 253, 248, 0.80)"
        : "rgba(5, 5, 5, 0.80)";

  const cardBackground =
    theme === "blue"
      ? "rgba(16, 40, 70, 0.96)"
      : theme === "offwhite"
        ? "rgba(255, 253, 248, 0.96)"
        : "rgba(5, 5, 5, 0.96)";

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    const effectiveRole =
      activeRole || user.accountType || user.role;

    const dashboardPath =
      DASHBOARD_BY_ROLE[effectiveRole] || "/";

    const fromPath = location.state?.from?.pathname;

    const hasReturnPath =
      fromPath &&
      fromPath !== "/" &&
      fromPath !== "/login";

    if (effectiveRole === "tenant" && hasReturnPath) {
      navigate(
        `${fromPath}${location.state?.from?.search || ""}${
          location.state?.from?.hash || ""
        }`,
        { replace: true }
      );
      return;
    }

    navigate(dashboardPath, { replace: true });
  }, [
    user,
    activeRole,
    loading,
    navigate,
    location.state,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setSubmitting(true);

    try {
      const loggedInUser = await login({
        email,
        password,
        role,
      });

      const fromPath = location.state?.from?.pathname;
      const fromSearch =
        location.state?.from?.search || "";
      const fromHash =
        location.state?.from?.hash || "";

      const inSpecificPath =
        fromPath &&
        fromPath !== "/" &&
        fromPath !== "/login";

      const userRole =
        loggedInUser.accountType ||
        loggedInUser.role;

      if (userRole === "tenant" && inSpecificPath) {
        navigate(
          `${fromPath}${fromSearch}${fromHash}`,
          { replace: true }
        );
        return;
      }

      navigate(
        DASHBOARD_BY_ROLE[userRole] || "/",
        { replace: true }
      );
    } catch (err) {
      setFormError(
        err.message || "Invalid credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--theme-surface) inset !important;
          box-shadow: 0 0 0 1000px var(--theme-surface) inset !important;
          -webkit-text-fill-color: var(--theme-text) !important;
          caret-color: var(--theme-text) !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        input::selection {
          background: var(--theme-accent);
          color: var(--theme-button-text);
        }

        input::placeholder {
          color: var(--theme-muted);
          opacity: 1;
        }
      `}</style>

      <div
        className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 sm:py-10 font-sans overflow-hidden transition-colors duration-300"
        style={{
          backgroundColor: "var(--theme-bg)",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              theme === "blue"
                ? "radial-gradient(circle at center, rgba(111,168,232,0.10), transparent 60%)"
                : theme === "offwhite"
                  ? "radial-gradient(circle at center, rgba(139,90,43,0.08), transparent 60%)"
                  : "radial-gradient(circle at center, rgba(201,164,92,0.08), transparent 60%)",
          }}
        />

        <div
          className="relative z-10 w-full max-w-md backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.015]"
          style={{
            backgroundColor: cardBackground,
            border: "1px solid var(--theme-border)",
            boxShadow:
              theme === "offwhite"
                ? "0 16px 45px rgba(43,33,24,0.18)"
                : "0 16px 45px rgba(0,0,0,0.50)",
          }}
        >
          <div className="flex flex-col justify-center items-center mb-7 sm:mb-8 text-center">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-border)",
                boxShadow:
                  theme === "offwhite"
                    ? "0 0 20px rgba(139,90,43,0.12)"
                    : "0 0 20px rgba(201,164,92,0.12)",
              }}
            >
              <BiUser
                className="text-3xl sm:text-4xl"
                style={{
                  color: "var(--theme-accent)",
                }}
              />
            </div>

            <h3
              className="font-extrabold text-2xl sm:text-3xl tracking-tight text-center"
              style={{
                color: "var(--theme-text)",
              }}
            >
              SECURE{" "}
              <span
                style={{
                  color: "var(--theme-accent)",
                }}
              >
                LOGIN
              </span>
            </h3>

            <p
              className="text-xs sm:text-sm mt-2 font-medium text-center"
              style={{
                color: "var(--theme-muted)",
              }}
            >
              Sign in to access your dashboard
            </p>
          </div>

          {formError && (
            <p
              className="text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-3 mb-5 text-center font-medium"
              style={{
                color: "var(--theme-danger-text)",
                backgroundColor: "rgba(239,68,68,0.10)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              {formError}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-5"
          >
            <div
              className="relative"
              tabIndex={-1}
              onBlur={(e) => {
                if (
                  !e.currentTarget.contains(
                    e.relatedTarget
                  )
                ) {
                  setRoleDropdown(false);
                }
              }}
            >
              <div
                onClick={() =>
                  setRoleDropdown((prev) => !prev)
                }
                className="flex flex-row items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor:
                    "var(--theme-surface)",
                  border:
                    roleDropdown
                      ? "1px solid var(--theme-accent)"
                      : "1px solid var(--theme-border)",
                  boxShadow: roleDropdown
                    ? "0 0 0 2px rgba(201,164,92,0.10)"
                    : "none",
                }}
              >
                <BiUser
                  className="w-5 h-5 shrink-0"
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />

                <span
                  className="text-sm font-medium ml-3 flex-1"
                  style={{
                    color: "var(--theme-text)",
                  }}
                >
                  {selectedRole.label}
                </span>

                <FiChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    roleDropdown ? "rotate-180" : ""
                  }`}
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
              </div>

              {roleDropdown && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor:
                      "var(--theme-surface)",
                    border:
                      "1px solid var(--theme-accent)",
                  }}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      onClick={() =>
                        handleRoleChange(option.value)
                      }
                      className="px-4 py-3.5 text-sm cursor-pointer transition-colors"
                      style={{
                        backgroundColor:
                          role === option.value
                            ? "var(--theme-accent)"
                            : "var(--theme-surface)",
                        color:
                          role === option.value
                            ? "var(--theme-button-text)"
                            : "var(--theme-text)",
                        fontWeight:
                          role === option.value
                            ? 700
                            : 500,
                      }}
                      onMouseEnter={(e) => {
                        if (
                          role !== option.value
                        ) {
                          e.currentTarget.style.backgroundColor =
                            "var(--theme-card)";
                          e.currentTarget.style.color =
                            "var(--theme-accent)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (
                          role !== option.value
                        ) {
                          e.currentTarget.style.backgroundColor =
                            "var(--theme-surface)";
                          e.currentTarget.style.color =
                            "var(--theme-text)";
                        }
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="flex flex-row items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 transition-all"
              style={{
                backgroundColor:
                  "var(--theme-surface)",
                border:
                  "1px solid var(--theme-border)",
              }}
            >
              <MdOutlineEmail
                className="w-5 h-5 shrink-0"
                style={{
                  color: "var(--theme-accent)",
                }}
              />

              <input
                type="email"
                placeholder="Email address"
                autoComplete="off"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-transparent outline-none text-sm ml-3"
                style={{
                  color: "var(--theme-text)",
                }}
                required
              />
            </div>

            <div
              className="flex flex-row items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 transition-all"
              style={{
                backgroundColor:
                  "var(--theme-surface)",
                border:
                  "1px solid var(--theme-border)",
              }}
            >
              <FiLock
                className="w-5 h-5 shrink-0"
                style={{
                  color: "var(--theme-accent)",
                }}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-transparent outline-none text-sm ml-3"
                style={{
                  color: "var(--theme-text)",
                }}
                required
              />

              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="transition-colors ml-2 shrink-0 cursor-pointer"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5" />
                  ) : (
                    <FiEye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>

            <div className="flex justify-end items-center text-xs sm:text-sm">
              <Link
                to="/forgot-password"
                className="font-semibold hover:underline transition-colors cursor-pointer"
                style={{
                  color: "var(--theme-accent)",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={
                submitting || !isFormValid
              }
              className="mt-1 sm:mt-2 text-sm w-full h-12 sm:h-14 font-extrabold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
                color:
                  "var(--theme-button-text)",
                cursor:
                  submitting || !isFormValid
                    ? "not-allowed"
                    : "pointer",
                boxShadow:
                  theme === "offwhite"
                    ? "0 10px 25px rgba(139,90,43,0.18)"
                    : "0 10px 25px rgba(201,164,92,0.20)",
              }}
            >
              {submitting
                ? "Logging in..."
                : "LOG IN"}
            </button>
          </form>

          <div
            className="text-xs sm:text-sm text-center mt-5 sm:mt-6 font-medium leading-6"
            style={{
              color: "var(--theme-muted)",
            }}
          >
            <span>
              Don't have a{" "}
              {role === "owner"
                ? "Property Owner"
                : role === "agent"
                  ? "Agent"
                  : "Tenant"}{" "}
              account?
            </span>

            <Link
              to={SIGNUP_BY_ROLE[role]}
              className="font-bold hover:underline transition-colors ml-1 cursor-pointer"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;