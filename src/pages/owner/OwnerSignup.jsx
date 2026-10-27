import React, { useEffect, useState } from "react";
import { BiUser, BiStore } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { LuIdCard } from "react-icons/lu";
import { GoPerson } from "react-icons/go";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import CnicUpload from "../../components/CnicUpload";

const DASHBOARD_BY_ROLE = {
  owner: "/podashboard",
};

const OwnerSignup = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [state, setState] = useState("SIGN UP");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    cnic: "", // Ab yahi state use hogi
    gender: "",
    merchantId: "",
  });

  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [genderDropdown, setGenderDropdown] = useState(false);

  // Format CNIC function
  const formatCNIC = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 5) return digits;
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
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

  const handleChange = (e) => {
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
    setGenderDropdown(false);
  };

  // Validation logic (Ab formData.cnic use ho raha hai)
  const isFormValid =
    state === "SIGN UP"
      ? formData.fullname.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.cnic.trim() !== "" &&
        formData.gender !== "" &&
        formData.merchantId.trim() !== "" &&
        !!cnicFrontFile &&
        !!cnicBackFile
      : formData.email.trim() !== "" && formData.password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (state === "SIGN UP") {
      if (
        !formData.fullname ||
        !formData.email ||
        !formData.password ||
        !formData.cnic ||
        !formData.gender ||
        !formData.merchantId
      ) {
        setErrorMsg(
          "Please fill in all required fields, including your Safepay Merchant ID.",
        );
        return;
      }
      if (formData.cnic.length !== 15) {
        alert("Please enter a complete CNIC number");
        return;
      }
      console.log("CNIC:", formData.cnic);

      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/.test(
          formData.password,
        )
      ) {
        setErrorMsg(
          "Password must be 8-16 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
        );
        return;
      }

      if (!cnicFrontFile || !cnicBackFile) {
        setErrorMsg("Please select both CNIC Front and Back images.");
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
        dataToSend.append("cnic", formData.cnic); // Yeh sahi hai
        dataToSend.append("gender", formData.gender.toLowerCase());
        dataToSend.append("role", "owner");
        dataToSend.append("merchantId", formData.merchantId);
        dataToSend.append("cnicFront", cnicFrontFile);
        dataToSend.append("cnicBack", cnicBackFile);

        const res = await register(dataToSend);

        setSuccessMsg(
          res?.message ||
            "Registration successful! Please check your email to verify your account before logging in.",
        );
      } else {
        const user = await login({
          email: formData.email,
          password: formData.password,
          role: "owner",
        });

        navigate(DASHBOARD_BY_ROLE[user.role] || "/owner/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputWrapper =
    "flex items-center bg-[#11100e] border border-[#c9a45c]/30 rounded-xl px-4 h-14 w-full shadow-[0_6px_20px_rgba(0,0,0,0.60)] focus-within:border-[#c9a45c] focus-within:ring-2 focus-within:ring-[#c9a45c]/20 focus-within:shadow-[0_0_26px_rgba(201,164,92,0.30)] transition-all duration-300 hover:border-[#c9a45c]/60 hover:bg-[#171717] hover:shadow-[0_8px_26px_rgba(201,164,92,0.16)]";

  const iconClass = "w-5 h-5 text-[#c9a45c] mr-3 shrink-0 drop-shadow-[0_0_8px_rgba(201,164,92,0.45)] transition-all duration-300";

  const inputClass =
    "w-full bg-transparent outline-none text-sm text-[#f5efe3] placeholder:text-[#8f897f] font-medium";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0d0d] px-4 py-8 sm:py-10 font-sans text-[#f5efe3]">
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #11100e inset !important;
          box-shadow: 0 0 0 1000px #11100e inset !important;
          -webkit-text-fill-color: #f5efe3 !important;
          caret-color: #f5efe3 !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        input::selection {
          background: #c9a45c;
          color: #171717;
        }
      `}</style>

      <div className="w-full max-w-md bg-[#0d0d0d] rounded-2xl p-5 sm:p-8 border border-[#c9a45c]/35 shadow-[0_15px_45px_rgba(0,0,0,0.78)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a45c]/70 hover:bg-[#11100e] hover:shadow-[0_18px_52px_rgba(201,164,92,0.24)]">
        <div className="flex flex-col justify-center items-center mb-7 text-center">
          <div className="w-14 h-14 rounded-xl bg-[#11100e] border border-[#c9a45c]/40 flex items-center justify-center mb-4 shadow-[0_0_18px_rgba(201,164,92,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#171717] hover:border-[#c9a45c]/70 hover:shadow-[0_0_28px_rgba(201,164,92,0.40)]">
            {state === "SIGN UP" ? (
              <BiUser className="text-[#c9a45c] text-2xl drop-shadow-[0_0_9px_rgba(201,164,92,0.55)]" />
            ) : (
              <BiStore className="text-[#c9a45c] text-2xl drop-shadow-[0_0_9px_rgba(201,164,92,0.55)]" />
            )}
          </div>

          <h3 className="font-extrabold text-2xl md:text-3xl tracking-tight text-[#f5efe3]">
            {state === "SIGN UP" ? (
              <>
                SECURE <span className="text-[#c9a45c]">REGISTER</span>
              </>
            ) : (
              <>
                SECURE <span className="text-[#c9a45c]">LOGIN</span>
              </>
            )}
          </h3>

          <p className="text-sm text-[#bdb6aa] mt-2 font-medium">
            {state === "SIGN UP"
              ? "Create your Property Owner account to list stays"
              : "Sign in to manage your listings and bookings"}
          </p>
        </div>

        {errorMsg && (
          <p className="text-xs text-[#dfbf7b] bg-[#c9a45c]/10 border border-[#c9a45c]/20 rounded-xl px-4 py-3 mb-5 text-center font-medium">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="text-xs text-[#c9a45c] bg-[#c9a45c]/10 border border-[#c9a45c]/30 rounded-xl px-4 py-3 mb-5 text-center font-bold">
          {successMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {state === "SIGN UP" && (
            <div className={inputWrapper}>
              <BiUser className={iconClass} />

              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          )}

          <div className={inputWrapper}>
            <MdOutlineEmail className={iconClass} />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className={inputWrapper}>
            <FiLock className={iconClass} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={inputClass}
            />

            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#c9a45c] hover:text-[#dfbf7b] hover:drop-shadow-[0_0_10px_rgba(201,164,92,0.60)] transition-all duration-200 cursor-pointer shrink-0"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {state === "SIGN UP" && (
            <>
              <div className={inputWrapper}>
                <LuIdCard className={iconClass} />

                <input
                  type="text"
                  placeholder="xxxxx-xxxxxxx-x"
                  name="cnic"
                  value={formData.cnic} 
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cnic: formatCNIC(e.target.value), 
                    }))
                  }
                  maxLength={15}
                  className="w-full bg-transparent outline-none text-sm text-[#f5efe3] placeholder:text-[#8f897f] font-medium"
                  required 
                />
              </div>
              
              <div className="relative w-full gender-dropdown">
                <div
                  onClick={() => setGenderDropdown(!genderDropdown)}
                  className={`${inputWrapper} cursor-pointer`}
                >
                  <GoPerson className={iconClass} />

                  <span
                    className={`flex-1 text-sm font-medium ${
                      formData.gender ? "text-[#f5efe3]" : "text-[#8f897f]"
                    }`}
                  >
                    {formData.gender
                      ? formData.gender.charAt(0).toUpperCase() +
                        formData.gender.slice(1)
                      : "Select Gender"}
                  </span>

                  <FiChevronDown
                    className={`text-[#c9a45c] transition-transform duration-200 ${
                      genderDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {genderDropdown && (
                  <div className="absolute left-0 right-0 top-[60px] z-50 overflow-hidden rounded-xl border border-[#c9a45c]/35 bg-[#11100e] shadow-[0_14px_35px_rgba(0,0,0,0.75)] shadow-[#c9a45c]/15">
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
                        className="px-4 py-3 text-sm cursor-pointer bg-[#11100e] text-[#f5efe3] hover:bg-[#171717] hover:text-[#c9a45c] hover:shadow-[inset_0_0_18px_rgba(201,164,92,0.10)] transition-all duration-200"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={inputWrapper}>
                <BiStore className={iconClass} />

                <input
                  type="text"
                  name="merchantId"
                  placeholder="Safepay Merchant ID (e.g. sec_...)"
                  value={formData.merchantId}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
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
                className="text-[#c9a45c] font-semibold text-sm hover:text-[#dfbf7b] hover:underline transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !isFormValid}
            className="mt-2 bg-[#c9a45c] hover:bg-[#dfbf7b] text-[#171717] text-sm w-full h-14 font-bold rounded-xl transition-all duration-300 shadow-[0_8px_24px_rgba(201,164,92,0.28)] hover:shadow-[0_12px_32px_rgba(201,164,92,0.42)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-[0_0_28px_rgba(201,164,92,0.40)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
            <p className="text-sm text-[#bdb6aa] font-medium">
              Already have an account?
              <span
                onClick={()=>navigate('/login')}
                className="text-[#c9a45c] font-bold ml-1 cursor-pointer hover:text-[#dfbf7b] hover:underline transition-colors"
              >
                LOGIN
              </span>
            </p>
          ) : (
            <p className="text-sm text-[#bdb6aa] font-medium">
              Don't have an owner account?
              <span
                onClick={() => switchMode("SIGN UP")}
                className="text-[#c9a45c] ml-1 font-bold cursor-pointer hover:text-[#dfbf7b] hover:underline transition-colors"
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

export default OwnerSignup;