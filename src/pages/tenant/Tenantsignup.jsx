import React, { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { LuIdCard } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import CnicUpload from "../../components/CnicUpload";
import cozyHomeBg from "../../assets/images/cozy-home-bg.jpeg";
import cozyHomeBgOffWhite from "../../assets/images/cozy-home-bg2.jpeg";

const DASHBOARD_BY_ROLE = {
  tenant: "/",
  owner: "/podashboard",
  agent: "/agent/dashboard",
};

const Tenantsignup = () => {
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [state, setState] = useState("SIGN UP");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "",
    role: "tenant",
  });

  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [genderDropdown, setGenderDropdown] = useState(false);

  const [cnic, setCnic] = useState("");

  const backgroundImage =
    theme === "blue"
      ? cozyHomeBgBlue
      : theme === "offwhite"
        ? cozyHomeBgOffWhite
        : cozyHomeBg;

  const overlayColor =
    theme === "blue"
      ? "rgba(16, 40, 70, 0.65)"
      : theme === "offwhite"
        ? "rgba(255, 253, 248, 0.65)"
        : "rgba(5, 5, 5, 0.65)";

  const cardBackground =
    theme === "offwhite"
      ? "rgba(255, 253, 248, 0.90)"
      : theme === "blue"
        ? "rgba(16, 40, 70, 0.90)"
        : "rgba(5, 5, 5, 0.90)";

  const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 5) return digits;

    if (digits.length <= 12) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".gender-dropdown")) {
        setGenderDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const change = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const switchMode = (nextMode) => {
    setState(nextMode);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const isPasswordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/.test(
      formData.password
    );

  const isFormValid =
    state === "SIGN UP"
      ? formData.fullname.trim() !== "" &&
        formData.email.trim() !== "" &&
        isPasswordValid &&
        cnic.trim() !== "" &&
        formData.gender !== "" &&
        !!cnicFrontFile &&
        !!cnicBackFile
      : formData.email.trim() !== "" &&
        formData.password.trim() !== "";

  const submit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (state === "SIGN UP") {
      if (
        !formData.fullname ||
        !formData.email ||
        !formData.password ||
        !cnic ||
        !formData.gender
      ) {
        setErrorMsg("Please fill in all required fields.");
        return;
      }

      if (cnic.length !== 15) {
        alert("Please enter a complete CNIC number");
        return;
      }

      console.log("CNIC:", cnic);

      if (!cnicFrontFile || !cnicBackFile) {
        setErrorMsg("Please select both CNIC Front and Back images.");
        return;
      }

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/.test(
          formData.password
        )
      ) {
        setErrorMsg(
          "Password must be 8-16 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
        );
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setErrorMsg("Please enter both email and password.");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (state === "SIGN UP") {
        const dataToSend = new FormData();

        dataToSend.append("fullname", formData.fullname);
        dataToSend.append("email", formData.email);
        dataToSend.append("password", formData.password);
        dataToSend.append("cnic", cnic);
        dataToSend.append("gender", formData.gender.toLowerCase());
        dataToSend.append("role", "tenant");
        dataToSend.append("cnicFront", cnicFrontFile);
        dataToSend.append("cnicBack", cnicBackFile);

        const res = await register(dataToSend);

        setSuccessMsg(
          res?.message ||
            "Tenant account setup successful! You can now log in."
        );
      } else {
        const user = await login({
          email: formData.email,
          password: formData.password,
          Role: "chooseRole",
        });

        const targetRole = user?.activeRole || "tenant";

        navigate(DASHBOARD_BY_ROLE[targetRole] || "/", {
          replace: true,
        });
      }
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-8 sm:py-10 bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans overflow-hidden transition-colors duration-300"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: overlayColor,
        }}
      />

      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background:
            theme === "blue"
              ? "radial-gradient(circle at center, rgba(111,168,232,0.10), transparent 55%)"
              : theme === "offwhite"
                ? "radial-gradient(circle at center, rgba(139,90,43,0.08), transparent 55%)"
                : "radial-gradient(circle at center, rgba(201,164,92,0.08), transparent 55%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-md backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all duration-300 hover:-translate-y-1"
        style={{
          backgroundColor: cardBackground,
          border: "1px solid var(--theme-accent)",
          boxShadow:
            theme === "offwhite"
              ? "0 20px 60px rgba(43,33,24,0.18)"
              : "0 20px 60px rgba(0,0,0,0.55)",
        }}
      >
        <div className="flex flex-col justify-center items-center mb-7 sm:mb-8 text-center">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-surface)",
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
              boxShadow:
                "0 8px 24px color-mix(in srgb, var(--theme-accent) 12%, transparent)",
            }}
          >
            <BiUser
              className="text-3xl sm:text-4xl"
              style={{ color: "var(--theme-accent)" }}
            />
          </div>

          <h3
            className="font-extrabold text-2xl md:text-3xl tracking-tight"
            style={{ color: "var(--theme-text)" }}
          >
            {state === "SIGN UP" ? (
              <>
                SECURE{" "}
                <span style={{ color: "var(--theme-accent)" }}>
                  REGISTER
                </span>
              </>
            ) : (
              <>
                SECURE{" "}
                <span style={{ color: "var(--theme-accent)" }}>
                  LOGIN
                </span>
              </>
            )}
          </h3>

          <p
            className="text-xs sm:text-sm mt-2 font-medium"
            style={{ color: "var(--theme-muted)" }}
          >
            {state === "SIGN UP"
              ? "Create your account to book accommodation"
              : "Sign in to access your dashboard"}
          </p>
        </div>

        {errorMsg && (
          <p
            className="text-xs sm:text-sm rounded-xl px-4 py-3 mb-5 text-center font-medium"
            style={{
              color: "var(--theme-danger-text)",
              backgroundColor:
                "color-mix(in srgb, var(--theme-danger) 10%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--theme-danger) 25%, transparent)",
            }}
          >
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p
            className="text-xs sm:text-sm rounded-xl px-4 py-3 mb-5 text-center font-bold"
            style={{
              color: "var(--theme-success-text)",
              backgroundColor:
                "color-mix(in srgb, var(--theme-success) 10%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--theme-success) 25%, transparent)",
            }}
          >
            {successMsg}
          </p>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4 w-full">
          {state === "SIGN UP" && (
            <div
              className="flex items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 transition-all duration-300"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-border)",
              }}
            >
              <BiUser
                className="w-5 h-5 mr-3 shrink-0"
                style={{ color: "var(--theme-accent)" }}
              />

              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={change}
                className="w-full bg-transparent outline-none text-sm font-medium"
                style={{
                  color: "var(--theme-text)",
                }}
                required
                autoComplete="name"
              />
            </div>
          )}

          <div
            className="flex items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
          >
            <MdOutlineEmail
              className="w-5 h-5 mr-3 shrink-0"
              style={{ color: "var(--theme-accent)" }}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="email"
              value={formData.email}
              onChange={change}
              className="w-full bg-transparent outline-none text-sm font-medium"
              style={{
                color: "var(--theme-text)",
              }}
              required
            />
          </div>

          <div
            className="flex items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
          >
            <FiLock
              className="w-5 h-5 mr-3 shrink-0"
              style={{ color: "var(--theme-accent)" }}
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoComplete="new-password"
              value={formData.password}
              onChange={change}
              className="w-full bg-transparent outline-none text-sm font-medium"
              style={{
                color: "var(--theme-text)",
              }}
              required
            />

            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 transition-colors cursor-pointer shrink-0"
                style={{ color: "var(--theme-muted)" }}
              >
                {showPassword ? (
                  <FiEyeOff className="text-lg" />
                ) : (
                  <FiEye className="text-lg" />
                )}
              </button>
            )}
          </div>

          {state === "SIGN UP" && (
            <>
              <div
                className="flex items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 transition-all duration-300"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  border: "1px solid var(--theme-border)",
                }}
              >
                <LuIdCard
                  className="w-5 h-5 mr-3 shrink-0"
                  style={{ color: "var(--theme-accent)" }}
                />

                <input
                  type="text"
                  placeholder="xxxxx-xxxxxxx-x"
                  name="cnic"
                  value={cnic}
                  onChange={(e) =>
                    setCnic(formatCNIC(e.target.value))
                  }
                  maxLength={15}
                  className="w-full bg-transparent outline-none text-sm font-medium"
                  style={{
                    color: "var(--theme-text)",
                  }}
                  required
                />
              </div>

              <div className="relative w-full gender-dropdown">
                <div
                  onClick={() =>
                    setGenderDropdown(!genderDropdown)
                  }
                  className="flex items-center rounded-xl px-3 sm:px-4 h-12 sm:h-14 cursor-pointer transition-all duration-300"
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    border: "1px solid var(--theme-border)",
                  }}
                >
                  <GoPerson
                    className="w-5 h-5 mr-3 shrink-0"
                    style={{ color: "var(--theme-accent)" }}
                  />

                  <span
                    className="w-full text-sm font-medium"
                    style={{
                      color: formData.gender
                        ? "var(--theme-text)"
                        : "var(--theme-muted)",
                    }}
                  >
                    {formData.gender
                      ? formData.gender.charAt(0).toUpperCase() +
                        formData.gender.slice(1)
                      : "Select Gender"}
                  </span>

                  <FiChevronDown
                    className={`transition-transform ${
                      genderDropdown ? "rotate-180" : ""
                    }`}
                    style={{
                      color: genderDropdown
                        ? "var(--theme-accent)"
                        : "var(--theme-muted)",
                    }}
                  />
                </div>

                {genderDropdown && (
                  <div
                    className="absolute left-0 right-0 top-[60px] z-50 overflow-hidden rounded-xl shadow-2xl"
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      border: "1px solid var(--theme-border)",
                    }}
                  >
                    {[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            gender: option.value,
                          }));
                          setGenderDropdown(false);
                        }}
                        className="px-4 py-3 text-sm cursor-pointer transition-colors duration-200"
                        style={{
                          backgroundColor:
                            formData.gender === option.value
                              ? "var(--theme-accent)"
                              : "var(--theme-surface)",
                          color:
                            formData.gender === option.value
                              ? "var(--theme-button-text)"
                              : "var(--theme-text)",
                          fontWeight:
                            formData.gender === option.value
                              ? 700
                              : 500,
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-1">
                <CnicUpload
                  onFrontChange={(file) => setCnicFrontFile(file)}
                  onBackChange={(file) => setCnicBackFile(file)}
                />
              </div>
            </>
          )}

          {state === "LOG IN" && (
            <div className="w-full text-right">
              <Link
                to="/forgot-password"
                className="font-semibold text-sm hover:underline transition-colors"
                style={{ color: "var(--theme-accent)" }}
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !isFormValid}
            className="mt-2 text-sm w-full h-12 sm:h-14 font-extrabold rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              boxShadow:
                "0 10px 25px color-mix(in srgb, var(--theme-accent) 20%, transparent)",
            }}
          >
            {submitting
              ? state === "SIGN UP"
                ? "Creating account..."
                : "Logging in..."
              : state}
          </button>
        </form>

        <div className="mt-6 text-center">
          {state === "SIGN UP" ? (
            <p
              className="text-sm font-medium"
              style={{ color: "var(--theme-muted)" }}
            >
              Already have an account?

              <span
                onClick={() => navigate("/login")}
                className="font-bold ml-1 cursor-pointer hover:underline transition-colors"
                style={{ color: "var(--theme-accent)" }}
              >
                LOGIN
              </span>
            </p>
          ) : (
            <p
              className="text-sm font-medium"
              style={{ color: "var(--theme-muted)" }}
            >
              Don't have an account?

              <span
                onClick={() => switchMode("SIGN UP")}
                className="ml-1 font-bold cursor-pointer hover:underline transition-colors"
                style={{ color: "var(--theme-accent)" }}
              >
                REGISTER
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tenantsignup;