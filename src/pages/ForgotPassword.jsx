import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { forgotPassword } from "../api/authApi";
import { useTheme } from "../context/ThemeContext.jsx";

import cozyHomeBg from "../assets/images/cozy-home-bg.jpeg";
import cozyHomeBgOffWhite from "../assets/images/cozy-home-bg2.jpeg";

const ForgotPassword = () => {
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

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
    theme === "blue"
      ? "rgba(16, 40, 70, 0.96)"
      : theme === "offwhite"
        ? "rgba(255, 253, 248, 0.96)"
        : "rgba(5, 5, 5, 0.96)";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const { data } = await forgotPassword(email);

      setStatus("sent");
      setMessage(
        data.message ||
          "If an account exists for this email, a reset link has been sent."
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Account does not exist. Please try again."
      );
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
      `}</style>

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
        className="relative z-10 w-full max-w-md backdrop-blur-md rounded-xl sm:rounded-2xl p-5 sm:p-8 transition-all duration-500 ease-out hover:-translate-y-3 hover:scale-[1.015]"
        style={{
          backgroundColor: cardBackground,
          border:
            "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
          boxShadow:
            theme === "offwhite"
              ? "0 15px 45px rgba(43,33,24,0.18)"
              : "0 15px 45px rgba(0,0,0,0.55)",
        }}
      >
        <div className="flex justify-center mb-6 sm:mb-7">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: "var(--theme-surface)",
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 50%, transparent)",
              boxShadow:
                "0 0 25px color-mix(in srgb, var(--theme-accent) 18%, transparent)",
            }}
          >
            <FaPaperPlane
              className="text-xl sm:text-2xl"
              style={{
                color: "var(--theme-accent)",
              }}
            />
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-7">
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight"
            style={{
              color: "var(--theme-text)",
            }}
          >
            FORGOT{" "}
            <span
              style={{
                color: "var(--theme-accent)",
              }}
            >
              PASSWORD
            </span>
          </h2>

          <p
            className="text-xs sm:text-sm mt-2 font-medium leading-relaxed"
            style={{
              color: "var(--theme-muted)",
            }}
          >
            Enter your registered email and we'll send you a link to reset
            your password.
          </p>
        </div>

        {message && (
          <div
            className="text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-3 mb-5 border flex items-start gap-2 font-medium"
            style={{
              color:
                status === "sent"
                  ? "var(--theme-success-text)"
                  : "var(--theme-danger-text)",
              backgroundColor:
                status === "sent"
                  ? "color-mix(in srgb, var(--theme-success) 10%, transparent)"
                  : "color-mix(in srgb, var(--theme-danger) 10%, transparent)",
              borderColor:
                status === "sent"
                  ? "color-mix(in srgb, var(--theme-success) 30%, transparent)"
                  : "color-mix(in srgb, var(--theme-danger) 30%, transparent)",
            }}
          >
            {status === "sent" && (
              <FaCheckCircle
                className="mt-0.5 shrink-0"
                style={{
                  color: "var(--theme-success)",
                }}
              />
            )}

            <span>{message}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div
            className="flex items-center rounded-lg px-3 sm:px-4 h-12 sm:h-14 transition-all duration-300 hover:-translate-y-0.5 focus-within:ring-2"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
          >
            <MdOutlineEmail
              className="w-5 h-5 mr-3 shrink-0"
              style={{
                color: "var(--theme-accent)",
              }}
            />

            <input
              type="email"
              placeholder="Registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-sm font-medium"
              style={{
                color: "var(--theme-text)",
              }}
              disabled={
                status === "sending" ||
                status === "sent"
              }
              autoComplete="email"
            />
          </div>

          <button
            type="submit"
            disabled={
              status === "sending" ||
              status === "sent"
            }
            className="h-12 sm:h-14 rounded-lg font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              boxShadow:
                "0 10px 25px color-mix(in srgb, var(--theme-accent) 20%, transparent)",
            }}
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
                ? "Link Sent"
                : "Send Reset Link"}
          </button>
        </form>

        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 w-full mt-5 text-sm font-bold hover:underline transition-colors cursor-pointer"
          style={{
            color: "var(--theme-accent)",
          }}
        >
          <FaArrowLeft className="text-xs" />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;