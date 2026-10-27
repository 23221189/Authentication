import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";
import { FiLock } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext.jsx";

const Resetpassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Reset link is invalid or has expired."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputWrapper =
    "flex items-center bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-xl px-4 h-14 transition-all duration-300 hover:border-[var(--theme-accent)] hover:-translate-y-0.5 focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] p-4 font-sans transition-colors duration-500">
      <div className="w-full max-w-md bg-[var(--theme-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--theme-accent)]/30 text-center transition-all duration-500 ease-out hover:border-[var(--theme-accent)]/70 hover:-translate-y-1 shadow-xl">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--theme-card)] border border-[var(--theme-accent)]/40 flex items-center justify-center transition-all duration-300 hover:border-[var(--theme-accent)] hover:-translate-y-0.5">
            <FiLock className="text-[var(--theme-accent)] text-3xl" />
          </div>
        </div>

        <h2 className="font-extrabold text-2xl text-[var(--theme-text)] tracking-tight">
          SET A NEW{" "}
          <span className="text-[var(--theme-accent)]">
            PASSWORD
          </span>
        </h2>

        {success ? (
          <div className="mt-8">
            <div className="w-16 h-16 bg-[var(--theme-card)] border border-[var(--theme-accent)]/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <TiTick className="text-3xl text-[var(--theme-accent)]" />
            </div>

            <p className="text-[var(--theme-accent)] bg-[var(--theme-card)] border border-[var(--theme-accent)]/25 rounded-xl px-4 py-3 mb-6 text-sm font-bold">
              ✓ Password updated successfully!
            </p>

            <button
              onClick={() => navigate("/login")}
              className="h-14 w-full rounded-xl font-bold text-[var(--theme-button-text)] bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {formError && (
              <p className="text-xs text-[var(--theme-danger-text)] bg-[var(--theme-card)] border border-[var(--theme-danger)]/30 rounded-xl px-4 py-3 mt-5 text-center font-medium">
                {formError}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col mt-8 gap-4"
            >
              <div className={inputWrapper}>
                <FiLock className="w-5 h-5 text-[var(--theme-accent)] mr-3 shrink-0" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-muted)] font-medium"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-[var(--theme-muted)] hover:text-[var(--theme-accent)] hover:scale-105 transition-all duration-300 cursor-pointer p-1 shrink-0"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className={inputWrapper}>
                <FiLock className="w-5 h-5 text-[var(--theme-accent)] mr-3 shrink-0" />

                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-muted)] font-medium"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="text-[var(--theme-muted)] hover:text-[var(--theme-accent)] hover:scale-105 transition-all duration-300 cursor-pointer p-1 shrink-0"
                >
                  {showConfirm ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="h-14 rounded-xl font-bold text-[var(--theme-button-text)] bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Updating..." : "Update Password"}
              </button>
            </form>

            <div className="mt-6 bg-[var(--theme-card)] border border-[var(--theme-accent)]/20 rounded-xl px-4 py-3 text-left transition-all duration-300 hover:border-[var(--theme-accent)]/45">
              <p className="text-xs text-[var(--theme-muted-light)] font-medium leading-relaxed">
                <span className="font-extrabold text-[var(--theme-accent)]">
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
          </>
        )}
      </div>
    </div>
  );
};

export default Resetpassword;