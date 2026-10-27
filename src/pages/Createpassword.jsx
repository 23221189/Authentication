import React, { useState } from "react";
import { CiLock } from "react-icons/ci";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useTheme } from "../../context/ThemeContext.jsx";

import cozyHomeBg from "../../assets/images/cozy-home-bg.jpeg";
import cozyHomeBgBlue from "../../assets/images/cozy-home-bg1.jpeg";
import cozyHomeBgOffWhite from "../../assets/images/cozy-home-bg2.jpeg";

const Createpassword = () => {
  const { theme } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const backgroundImage =
    theme === "blue"
      ? cozyHomeBgBlue
      : theme === "offwhite"
        ? cozyHomeBgOffWhite
        : cozyHomeBg;

  const overlayColor =
    theme === "blue"
      ? "rgba(16, 40, 70, 0.92)"
      : theme === "offwhite"
        ? "rgba(255, 253, 248, 0.92)"
        : "rgba(5, 5, 5, 0.92)";

  const cardBackground =
    theme === "offwhite"
      ? "rgba(255, 253, 248, 0.96)"
      : theme === "blue"
        ? "rgba(16, 40, 70, 0.96)"
        : "rgba(5, 5, 5, 0.96)";

  const inputWrapper =
    "flex flex-row items-center rounded-xl px-4 h-14 w-full transition-all duration-300 hover:-translate-y-0.5 focus-within:ring-2";

  return (
    <div
      className="relative min-h-[calc(100vh-4.5rem)] flex justify-center items-center p-4 font-sans overflow-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-300"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: overlayColor,
        }}
      />

      <div
        className="absolute inset-0"
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
        className="relative z-10 w-full max-w-md rounded-3xl p-5 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.01]"
        style={{
          backgroundColor: cardBackground,
          border: "1px solid var(--theme-accent)",
          boxShadow:
            theme === "offwhite"
              ? "0 20px 60px rgba(43,33,24,0.18)"
              : "0 20px 60px rgba(0,0,0,0.65)",
        }}
      >
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: "var(--theme-surface)",
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 50%, transparent)",
              boxShadow:
                "0 0 22px color-mix(in srgb, var(--theme-accent) 16%, transparent)",
            }}
          >
            <CiLock
              className="text-3xl"
              style={{
                color: "var(--theme-accent)",
              }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Create New{" "}
            <span
              style={{
                color: "var(--theme-accent)",
              }}
            >
              Password
            </span>
          </h2>

          <p
            className="text-sm mt-2 font-medium leading-relaxed"
            style={{
              color: "var(--theme-muted)",
            }}
          >
            Your identity has been verified. Please enter a strong new
            password.
          </p>
        </div>

        <form className="flex flex-col gap-4 w-full">
          <div
            className={inputWrapper}
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
          >
            <CiLock
              className="w-5 h-5 mr-3 shrink-0"
              style={{
                color: "var(--theme-accent)",
              }}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              style={{
                color: "var(--theme-text)",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="transition-all duration-300 cursor-pointer p-1 shrink-0 hover:scale-110"
              style={{
                color: "var(--theme-muted)",
              }}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>

          <div
            className={inputWrapper}
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
          >
            <CiLock
              className="w-5 h-5 mr-3 shrink-0"
              style={{
                color: "var(--theme-accent)",
              }}
            />

            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              style={{
                color: "var(--theme-text)",
              }}
            />

            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="transition-all duration-300 cursor-pointer p-1 shrink-0 hover:scale-110"
              style={{
                color: "var(--theme-muted)",
              }}
            >
              {showConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-2 text-sm w-full h-14 font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              boxShadow:
                "0 10px 25px color-mix(in srgb, var(--theme-accent) 20%, transparent)",
            }}
          >
            Update Password
          </button>
        </form>

        <div
          className="mt-6 rounded-xl px-4 py-3 transition-all duration-300"
          style={{
            backgroundColor: "var(--theme-surface)",
            border:
              "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
            boxShadow:
              theme === "offwhite"
                ? "0 8px 22px rgba(43,33,24,0.10)"
                : "0 8px 22px rgba(0,0,0,0.45)",
          }}
        >
          <p
            className="text-xs font-medium leading-relaxed"
            style={{
              color: "var(--theme-muted)",
            }}
          >
            <span
              className="font-extrabold"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              💡 Password must contain:
            </span>

            <br />

            • At least 8 characters long
            <br />

            • At least one uppercase & one lowercase letter
            <br />

            • At least one number
          </p>
        </div>
      </div>
    </div>
  );
};

export default Createpassword;