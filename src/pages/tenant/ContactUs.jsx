import React, { useEffect, useState } from "react";
import { submitComplaint } from "../../api/complaintApi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  FaHeadset,
  FaEnvelope,
  FaClock,
  FaSpinner,
  FaChevronDown,
} from "react-icons/fa";
import { SITE_CONTACT_EMAIL } from "../../config/siteConfig.js";

const ContactUs = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const [fullname, setFullName] = useState(user?.fullname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".category-dropdown")) {
        setCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (
      !fullname ||
      !email ||
      !category ||
      !subject.trim() ||
      !message.trim()
    ) {
      setFormError("Please fill all fields.");
      return;
    }

    if (!email.includes("@")) {
      setFormError("Please enter a valid email.");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await submitComplaint({
        fullname,
        email,
        category,
        subject: subject.trim(),
        message: message.trim(),
      });

      setFormSuccess(
        data?.message || "Your message has been sent to Admin successfully."
      );

      setCategory("");
      setSubject("");
      setMessage("");

      if (!user) {
        setFullName("");
        setEmail("");
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputBase =
    "w-full border rounded-xl p-3 mt-2 outline-none text-sm text-[var(--theme-text)] bg-[var(--theme-surface)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed";

  const inputNormal =
    "border-[var(--theme-border)] focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20";

  const labelBase =
    "block font-bold text-[var(--theme-text)] text-sm";

  const categoryOptions = [
    "Booking Issue",
    "Payment Issue",
    "Account Issue",
    "Technical Issue",
    "Other",
  ];

  const isBlue = theme === "blue";
  const isOffWhite = theme === "offwhite";
  const isBlack = theme === "black";

  const pageBackground =
    isBlue
      ? "linear-gradient(rgba(7, 28, 58, 0.88), rgba(7, 28, 58, 0.94)), url('/src/assets/About.jpeg')"
      : isOffWhite
      ? "linear-gradient(rgba(247, 241, 231, 0.91), rgba(247, 241, 231, 0.96)), url('/src/assets/About1.jpeg')"
      : "none";

  const cardBorder = isBlue
    ? "rgba(220, 235, 255, 0.42)"
    : isOffWhite
    ? "rgba(139, 90, 43, 0.35)"
    : "var(--theme-border)";

  const cardShadow = isBlue
    ? "0 0 28px rgba(180, 215, 255, 0.12)"
    : isOffWhite
    ? "0 0 28px rgba(139, 90, 43, 0.12)"
    : "0 0 20px rgba(0, 0, 0, 0.30)";

  const hoverShadow = isBlue
    ? "0 0 34px rgba(190, 220, 255, 0.22)"
    : isOffWhite
    ? "0 0 34px rgba(139, 90, 43, 0.20)"
    : "0 0 30px rgba(0, 0, 0, 0.42)";

  const iconBorder = isBlue
    ? "rgba(220, 235, 255, 0.38)"
    : isOffWhite
    ? "rgba(139, 90, 43, 0.30)"
    : "var(--theme-accent)";

  const iconBackground = isBlue
    ? "rgba(210, 230, 255, 0.10)"
    : isOffWhite
    ? "rgba(139, 90, 43, 0.08)"
    : "rgba(201, 164, 92, 0.10)";

  return (
    <main
      className="min-h-screen text-[var(--theme-text)] font-sans px-4 md:px-6 lg:px-8 py-8 md:py-10 transition-all duration-500 relative"
      style={{
        backgroundColor: "var(--theme-bg)",
        backgroundImage: pageBackground,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
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

        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px var(--theme-surface) inset !important;
          box-shadow: 0 0 0 1000px var(--theme-surface) inset !important;
          -webkit-text-fill-color: var(--theme-text) !important;
          caret-color: var(--theme-text) !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        input::selection,
        textarea::selection {
          background: var(--theme-accent);
          color: var(--theme-button-text);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--theme-text)]">
            Contact{" "}
            <span className="text-[var(--theme-accent)]">
              Admin
            </span>
          </h1>

          <p className="text-sm text-[var(--theme-muted)] mt-2 font-medium">
            Have an issue or need help? Send us a message and our support team
            will assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div
            className="lg:col-span-2 rounded-2xl p-5 md:p-7 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1"
            style={{
              backgroundColor: isBlue
                ? "rgba(12, 39, 76, 0.91)"
                : isOffWhite
                ? "rgba(255, 253, 248, 0.94)"
                : "rgba(5, 5, 5, 0.96)",
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = hoverShadow;
              e.currentTarget.style.borderColor = isBlue
                ? "rgba(225, 238, 255, 0.70)"
                : isOffWhite
                ? "rgba(139, 90, 43, 0.60)"
                : "var(--theme-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = cardShadow;
              e.currentTarget.style.borderColor = cardBorder;
            }}
          >
            <div className="mb-6">
              <h2 className="text-lg md:text-xl font-extrabold text-[var(--theme-text)] tracking-tight">
                Send a Message
              </h2>

              <p className="text-sm text-[var(--theme-muted)] mt-1 font-medium">
                Provide clear information so Admin can resolve your issue
                quickly.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              autoComplete="on"
            >
              {formError && (
                <div
                  className="text-sm rounded-xl px-4 py-3 font-medium"
                  style={{
                    backgroundColor: isBlue
                      ? "rgba(190, 220, 255, 0.10)"
                      : isOffWhite
                      ? "rgba(139, 90, 43, 0.08)"
                      : "rgba(201, 164, 92, 0.10)",
                    border: `1px solid ${
                      isBlue
                        ? "rgba(220, 235, 255, 0.35)"
                        : isOffWhite
                        ? "rgba(139, 90, 43, 0.30)"
                        : "rgba(201, 164, 92, 0.30)"
                    }`,
                    color: isBlue
                      ? "#dcecff"
                      : isOffWhite
                      ? "#7a4b22"
                      : "var(--theme-accent-hover)",
                  }}
                >
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div
                  className="text-sm rounded-xl px-4 py-3 font-bold"
                  style={{
                    backgroundColor: isBlue
                      ? "rgba(190, 220, 255, 0.10)"
                      : isOffWhite
                      ? "rgba(139, 90, 43, 0.08)"
                      : "rgba(201, 164, 92, 0.10)",
                    border: `1px solid ${
                      isBlue
                        ? "rgba(220, 235, 255, 0.35)"
                        : isOffWhite
                        ? "rgba(139, 90, 43, 0.30)"
                        : "rgba(201, 164, 92, 0.30)"
                    }`,
                    color: isBlue
                      ? "#dcecff"
                      : isOffWhite
                      ? "#7a4b22"
                      : "var(--theme-accent)",
                  }}
                >
                  ✓ {formSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className={labelBase}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullname"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={submitting}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`${inputBase} ${inputNormal}`}
                  />
                </div>

                <div>
                  <label className={labelBase}>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`${inputBase} ${inputNormal}`}
                  />
                </div>

              </div>

              <div className="relative category-dropdown">

                <label className={labelBase}>
                  Category
                </label>

                <div
                  onClick={() =>
                    !submitting &&
                    setCategoryDropdown(!categoryDropdown)
                  }
                  className={`${inputBase} ${inputNormal} flex items-center justify-between cursor-pointer`}
                >
                  <span
                    className={
                      category
                        ? "text-[var(--theme-text)]"
                        : "text-[var(--theme-muted-dark)]"
                    }
                  >
                    {category || "Select a category"}
                  </span>

                  <FaChevronDown
                    className={`text-[var(--theme-accent)] text-xs transition-transform duration-200 ${
                      categoryDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {categoryDropdown && (
                  <div
                    className="absolute left-0 right-0 top-[76px] z-50 overflow-hidden rounded-xl backdrop-blur-md"
                    style={{
                      backgroundColor: isBlue
                        ? "rgba(10, 35, 70, 0.98)"
                        : isOffWhite
                        ? "rgba(255, 253, 248, 0.99)"
                        : "rgba(5, 5, 5, 0.99)",
                      border: `1px solid ${cardBorder}`,
                      boxShadow: hoverShadow,
                    }}
                  >
                    {categoryOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => {
                          setCategory(option);
                          setCategoryDropdown(false);
                        }}
                        className="px-4 py-3 text-sm cursor-pointer text-[var(--theme-text)] hover:text-[var(--theme-accent)] transition-colors duration-200"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}

              </div>

              <div>
                <label className={labelBase}>
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="Briefly describe your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={submitting}
                  maxLength={100}
                  autoComplete="off"
                  className={`${inputBase} ${inputNormal}`}
                />
              </div>

              <div>
                <label className={labelBase}>
                  Message
                </label>

                <textarea
                  name="message"
                  id="message"
                  rows="7"
                  placeholder="Explain your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  maxLength={1000}
                  autoComplete="off"
                  className={`${inputBase} ${inputNormal} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] py-3.5 rounded-xl h-14 font-bold text-base hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  boxShadow: isBlue
                    ? "0 0 24px rgba(190, 220, 255, 0.16)"
                    : isOffWhite
                    ? "0 0 24px rgba(139, 90, 43, 0.14)"
                    : "0 0 20px rgba(0, 0, 0, 0.30)",
                }}
              >
                {submitting && (
                  <FaSpinner className="animate-spin" />
                )}

                {submitting
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-6">

            <div
              className="rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-1"
              style={{
                backgroundColor: isBlue
                  ? "rgba(12, 39, 76, 0.91)"
                  : isOffWhite
                  ? "rgba(255, 253, 248, 0.94)"
                  : "rgba(5, 5, 5, 0.96)",
                border: `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
              }}
            >
              <h2 className="text-lg font-extrabold text-[var(--theme-text)] mb-5 tracking-tight">
                Contact Details
              </h2>

              <div className="space-y-5">

                <div className="flex items-start gap-3 text-sm text-[var(--theme-muted-light)]">

                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: iconBackground,
                      border: `1px solid ${iconBorder}`,
                    }}
                  >
                    <FaEnvelope className="text-[var(--theme-accent)]" />
                  </div>

                  <div>
                    <p className="font-bold text-[var(--theme-text)]">
                      Email
                    </p>

                    <p className="mt-1 break-all font-medium">
                      {SITE_CONTACT_EMAIL}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3 text-sm text-[var(--theme-muted-light)]">

                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: iconBackground,
                      border: `1px solid ${iconBorder}`,
                    }}
                  >
                    <FaClock className="text-[var(--theme-accent)]" />
                  </div>

                  <div>
                    <p className="font-bold text-[var(--theme-text)]">
                      Support Hours
                    </p>

                    <p className="mt-1 font-medium">
                      Mon - Sat, 9 AM - 6 PM
                    </p>
                  </div>

                </div>

              </div>
            </div>

            <div
              className="rounded-2xl p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: isBlue
                  ? "rgba(12, 39, 76, 0.91)"
                  : isOffWhite
                  ? "rgba(255, 253, 248, 0.94)"
                  : "rgba(5, 5, 5, 0.96)",
                border: `1px solid ${
                  isBlue
                    ? "rgba(220, 235, 255, 0.50)"
                    : isOffWhite
                    ? "rgba(139, 90, 43, 0.42)"
                    : "rgba(201, 164, 92, 0.30)"
                }`,
                boxShadow: isBlue
                  ? "0 0 28px rgba(190, 220, 255, 0.14)"
                  : isOffWhite
                  ? "0 0 28px rgba(139, 90, 43, 0.13)"
                  : "0 0 20px rgba(0, 0, 0, 0.30)",
              }}
            >
              <div className="flex items-center gap-3 mb-3">

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: iconBackground,
                    border: `1px solid ${iconBorder}`,
                  }}
                >
                  <FaHeadset className="text-[var(--theme-accent)] text-lg" />
                </div>

                <h2 className="text-lg font-extrabold text-[var(--theme-accent)]">
                  Quick Response
                </h2>

              </div>

              <p className="text-sm text-[var(--theme-muted-light)] leading-relaxed font-medium">
                Most queries are answered within 24 hours. For urgent booking
                issues, mention the property and issue clearly in your message.
              </p>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
};

export default ContactUs;