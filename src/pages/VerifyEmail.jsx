import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { verifyEmail, resendVerification } from "../api/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const executedTokens = new Set();

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setUser, loading } = useAuth();
  const { theme } = useTheme();

  const [status, setStatus] = useState("verifying");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("idle");

  useEffect(() => {
    if (loading) return;
    if (!token || executedTokens.has(token)) return;

    executedTokens.add(token);

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        const data = res?.data || res;

        setStatus("success");

        if (data?.user) {
          setUser(data.user);
        }

        if (data?.token) {
          sessionStorage.setItem("token", data.token);
        }

        if (data?.user) {
          setUser(data.user);
        }

        setTimeout(() => {
          if (data?.user?.role === "owner") {
            navigate("/podashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1800);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate, setUser, loading]);

  const handleResend = async (e) => {
    e.preventDefault();

    if (!resendEmail) return;

    setResendStatus("sending");

    try {
      await resendVerification(resendEmail);
      setResendStatus("sent");
    } catch (err) {
      console.error("Resend error:", err);
      setResendStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)] text-[var(--theme-text)] p-4 font-sans transition-colors duration-500">

      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--theme-card) inset !important;
          box-shadow: 0 0 0 1000px var(--theme-card) inset !important;
          -webkit-text-fill-color: var(--theme-text) !important;
          caret-color: var(--theme-text) !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        input::selection {
          background: var(--theme-accent);
          color: var(--theme-button-text);
        }

        select option {
          background: var(--theme-card);
          color: var(--theme-accent);
        }
      `}</style>

      <div className="w-full max-w-md bg-[var(--theme-surface)] rounded-xl p-6 sm:p-8 border border-[var(--theme-accent)]/40 shadow-xl transition-all duration-500 ease-out hover:border-[var(--theme-accent)]/70 hover:-translate-y-1">

        {status === "verifying" && (
          <div className="text-center py-4">

            <div className="w-16 h-16 rounded-xl bg-[var(--theme-card)] border border-[var(--theme-accent)]/30 flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:border-[var(--theme-accent)] hover:-translate-y-0.5">
              <FaEnvelope className="text-[var(--theme-accent)] text-2xl" />
            </div>

            <div className="animate-spin w-10 h-10 border-4 border-[var(--theme-border)] border-t-[var(--theme-accent)] rounded-full mx-auto mb-5"></div>

            <h2 className="text-xl font-extrabold text-[var(--theme-text)] tracking-tight">
              Verifying your email...
            </h2>

            <p className="text-sm text-[var(--theme-muted)] mt-2 font-medium">
              Please wait while we confirm your account.
            </p>

          </div>
        )}

        {status === "success" && (
          <div className="text-center py-2">

            <div className="w-20 h-20 rounded-full bg-[var(--theme-card)] border-2 border-[var(--theme-accent)]/30 flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:border-[var(--theme-accent)]">
              <TiTick className="text-5xl text-[var(--theme-accent)]" />
            </div>

            <h2 className="text-2xl font-extrabold text-[var(--theme-text)] tracking-tight mb-2">
              Your email has been{" "}
              <span className="text-[var(--theme-accent)]">
                verified!
              </span>
            </h2>

            <p className="text-sm text-[var(--theme-muted)] font-medium">
              Taking you to your dashboard...
            </p>

            <div className="mt-6 h-1.5 bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--theme-accent)] rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>

          </div>
        )}

        {status === "error" && (
          <div className="text-center py-2">

            <div className="w-20 h-20 rounded-full bg-[var(--theme-card)] border-2 border-[var(--theme-danger)]/30 flex items-center justify-center mx-auto mb-6 transition-all duration-300 hover:border-[var(--theme-danger)]">
              <RxCross2 className="text-4xl text-[var(--theme-danger)]" />
            </div>

            <h2 className="text-2xl font-extrabold text-[var(--theme-text)] tracking-tight mb-3">
              Verification{" "}
              <span className="text-[var(--theme-danger-text)]">
                Failed
              </span>
            </h2>

            <div className="text-xs text-[var(--theme-muted)] bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg px-4 py-3 mb-6 text-left font-medium leading-relaxed">
              This link is invalid, expired, or was already used. This can
              happen if you clicked an older email by mistake — request a
              fresh one below.
            </div>

            {resendStatus === "sent" ? (
              <div className="text-xs text-[var(--theme-success-text)] bg-[var(--theme-card)] border border-[var(--theme-success)]/30 rounded-lg px-4 py-3 text-left font-bold leading-relaxed">
                A new verification link has been sent to{" "}
                <span className="break-all">{resendEmail}</span>. Please check
                your inbox (it will be the newest email) and click that link
                only.
              </div>
            ) : (
              <form onSubmit={handleResend} className="text-left">

                <label className="text-xs font-bold text-[var(--theme-muted)] uppercase tracking-wider block mb-2">
                  Resend verification link to:
                </label>

                <div className="flex items-center bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-lg px-4 h-12 transition-all duration-300 hover:border-[var(--theme-accent)] hover:-translate-y-0.5 focus-within:border-[var(--theme-accent)] focus-within:ring-2 focus-within:ring-[var(--theme-accent)]/15 mb-3">

                  <FaEnvelope className="w-4 h-4 text-[var(--theme-accent)] mr-3 shrink-0" />

                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-muted)] font-medium"
                  />

                </div>

                {resendStatus === "error" && (
                  <p className="text-xs text-[var(--theme-danger-text)] bg-[var(--theme-card)] border border-[var(--theme-danger)]/30 rounded-lg px-3 py-2 mb-3 font-medium">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={resendStatus === "sending"}
                  className="w-full bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] text-sm font-bold py-3.5 rounded-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaPaperPlane />

                  {resendStatus === "sending"
                    ? "Sending..."
                    : "Resend Verification Email"}
                </button>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmail;