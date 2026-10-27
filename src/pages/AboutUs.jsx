import React from "react";
import {
  FaShieldHeart,
  FaHouseCircleCheck,
  FaUsers,
  FaHandshakeAngle,
  FaArrowRight,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import AboutUsImage from "../assets/images/AboutUs.jpeg";
import AboutOffWhiteImage from "../assets/images/About1.jpeg";

const AboutUs = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const getBackgroundImage = () => {
    if (theme === "blue") return AboutBlueImage;
    if (theme === "offwhite") return AboutOffWhiteImage;
    return AboutUsImage;
  };

  const isBlue = theme === "blue";
  const isOffWhite = theme === "offwhite";

  const cardBackground = isBlue
    ? "#0b274c"
    : isOffWhite
      ? "#fffdf8"
      : "#050505";

  const cardBorder = isBlue
    ? "rgba(225, 238, 255, 0.42)"
    : isOffWhite
      ? "rgba(139, 90, 43, 0.34)"
      : "var(--theme-border)";

  const cardShadow = isBlue
    ? "0 0 26px rgba(190, 220, 255, 0.12)"
    : isOffWhite
      ? "0 0 26px rgba(139, 90, 43, 0.11)"
      : "0 0 20px rgba(0, 0, 0, 0.35)";

  const hoverShadow = isBlue
    ? "0 0 34px rgba(205, 230, 255, 0.22)"
    : isOffWhite
      ? "0 0 34px rgba(139, 90, 43, 0.20)"
      : "0 0 30px rgba(0, 0, 0, 0.48)";

  const iconBackground = isBlue
    ? "rgba(215, 232, 255, 0.09)"
    : isOffWhite
      ? "rgba(139, 90, 43, 0.07)"
      : "rgba(0, 0, 0, 0.45)";

  const iconBorder = isBlue
    ? "rgba(225, 238, 255, 0.42)"
    : isOffWhite
      ? "rgba(139, 90, 43, 0.32)"
      : "rgba(201, 164, 92, 0.30)";

  return (
    <div className="bg-[var(--theme-bg)] min-h-screen font-sans text-[var(--theme-text)] transition-colors duration-500">
      <section
        className="relative min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden border-b transition-colors duration-500"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderColor: cardBorder,
        }}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20">
          <div className="max-w-xl text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--theme-text)] tracking-tight leading-tight">
              About{" "}
              <span className="text-[var(--theme-accent)]">
                Paying Guest
              </span>
            </h1>

            <h2 className="text-lg md:text-2xl font-bold italic text-[var(--theme-accent)] mt-3">
              Verified. Affordable. Yours.
            </h2>

            <p className="mt-6 text-sm sm:text-base md:text-lg text-[var(--theme-text)]/90 font-medium max-w-xl leading-relaxed">
              We are dedicated to revolutionizing the rental and paying guest
              accommodation experience across Pakistan, making finding and
              listing safe stays effortless and transparent.
            </p>

            <button
              onClick={() => navigate("/properties")}
              className="mt-7 inline-flex items-center gap-3 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] font-extrabold text-sm sm:text-base px-6 py-3 rounded-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              style={{
                boxShadow: isBlue
                  ? "0 0 24px rgba(200, 225, 255, 0.18)"
                  : isOffWhite
                    ? "0 0 24px rgba(139, 90, 43, 0.16)"
                    : "0 0 20px rgba(0, 0, 0, 0.35)",
              }}
            >
              Find Your Stay
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-[var(--theme-text)] mb-3 tracking-tight">
          Why Choose Our Platform?
        </h2>

        <p className="text-center text-[var(--theme-muted)] font-medium mb-10 md:mb-12 max-w-xl mx-auto text-sm md:text-base">
          Four reasons that make us Pakistan's most trusted PG platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          <div
            className="p-6 rounded-2xl text-center transition-all duration-500 ease-out hover:-translate-y-1"
            style={{
              backgroundColor: cardBackground,
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = hoverShadow;
              e.currentTarget.style.borderColor = isBlue
                ? "rgba(235, 245, 255, 0.72)"
                : isOffWhite
                  ? "rgba(139, 90, 43, 0.58)"
                  : "var(--theme-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = cardShadow;
              e.currentTarget.style.borderColor = cardBorder;
            }}
          >
            <div
              className="w-14 h-14 text-[var(--theme-accent)] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{
                backgroundColor: iconBackground,
                border: `1px solid ${iconBorder}`,
              }}
            >
              <FaHouseCircleCheck />
            </div>

            <h3 className="font-extrabold text-[var(--theme-text)] text-base mb-2">
              Verified Listings
            </h3>

            <p className="text-xs text-[var(--theme-muted)] leading-relaxed font-medium">
              Every property is thoroughly inspected by authorized agents and
              validated by administrators before publishing.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl text-center transition-all duration-500 ease-out hover:-translate-y-1"
            style={{
              backgroundColor: cardBackground,
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = hoverShadow;
              e.currentTarget.style.borderColor = isBlue
                ? "rgba(235, 245, 255, 0.72)"
                : isOffWhite
                  ? "rgba(139, 90, 43, 0.58)"
                  : "var(--theme-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = cardShadow;
              e.currentTarget.style.borderColor = cardBorder;
            }}
          >
            <div
              className="w-14 h-14 text-[var(--theme-accent)] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{
                backgroundColor: iconBackground,
                border: `1px solid ${iconBorder}`,
              }}
            >
              <FaShieldHeart />
            </div>

            <h3 className="font-extrabold text-[var(--theme-text)] text-base mb-2">
              Secure & Safe
            </h3>

            <p className="text-xs text-[var(--theme-muted)] leading-relaxed font-medium">
              CNIC and identity verification ensure peace of mind for both
              tenants and property owners.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl text-center transition-all duration-500 ease-out hover:-translate-y-1"
            style={{
              backgroundColor: cardBackground,
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = hoverShadow;
              e.currentTarget.style.borderColor = isBlue
                ? "rgba(235, 245, 255, 0.72)"
                : isOffWhite
                  ? "rgba(139, 90, 43, 0.58)"
                  : "var(--theme-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = cardShadow;
              e.currentTarget.style.borderColor = cardBorder;
            }}
          >
            <div
              className="w-14 h-14 text-[var(--theme-accent)] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{
                backgroundColor: iconBackground,
                border: `1px solid ${iconBorder}`,
              }}
            >
              <FaUsers />
            </div>

            <h3 className="font-extrabold text-[var(--theme-text)] text-base mb-2">
              Community Driven
            </h3>

            <p className="text-xs text-[var(--theme-muted)] leading-relaxed font-medium">
              Designed specifically for students, job seekers, travelers, and
              working professionals across major cities.
            </p>
          </div>

          <div
            className="p-6 rounded-2xl text-center transition-all duration-500 ease-out hover:-translate-y-1"
            style={{
              backgroundColor: cardBackground,
              border: `1px solid ${cardBorder}`,
              boxShadow: cardShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = hoverShadow;
              e.currentTarget.style.borderColor = isBlue
                ? "rgba(235, 245, 255, 0.72)"
                : isOffWhite
                  ? "rgba(139, 90, 43, 0.58)"
                  : "var(--theme-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = cardShadow;
              e.currentTarget.style.borderColor = cardBorder;
            }}
          >
            <div
              className="w-14 h-14 text-[var(--theme-accent)] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
              style={{
                backgroundColor: iconBackground,
                border: `1px solid ${iconBorder}`,
              }}
            >
              <FaHandshakeAngle />
            </div>

            <h3 className="font-extrabold text-[var(--theme-text)] text-base mb-2">
              Zero Hassle Bookings
            </h3>

            <p className="text-xs text-[var(--theme-muted)] leading-relaxed font-medium">
              Direct booking requests, real-time availability updates, and
              transparent rental pricing without hidden agent charges.
            </p>
          </div>
        </div>
      </section>

      <section
        className="border-y py-10 md:py-12 px-4 sm:px-6 transition-colors duration-500"
        style={{
          backgroundColor: isBlue
            ? "#102846"
            : isOffWhite
              ? "#f7f1e7"
              : "#050505",
          borderColor: cardBorder,
        }}
      >
        <div
          className="max-w-4xl mx-auto rounded-2xl px-6 sm:px-10 py-8 md:py-10 text-center transition-all duration-500 ease-out hover:-translate-y-1"
          style={{
            backgroundColor: cardBackground,
            border: `1px solid ${cardBorder}`,
            boxShadow: cardShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = hoverShadow;
            e.currentTarget.style.borderColor = isBlue
              ? "rgba(235, 245, 255, 0.72)"
              : isOffWhite
                ? "rgba(139, 90, 43, 0.58)"
                : "var(--theme-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = cardShadow;
            e.currentTarget.style.borderColor = cardBorder;
          }}
        >
          <div className="inline-flex items-center gap-3 text-[var(--theme-accent)] font-bold text-xs sm:text-sm uppercase tracking-widest">
            <span className="w-8 h-px bg-[var(--theme-accent)]"></span>
            <span>Our Mission</span>
            <span className="w-8 h-px bg-[var(--theme-accent)]"></span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--theme-text)] tracking-tight mt-5">
            Building Trust,{" "}
            <span className="text-[var(--theme-accent)]">
              One Stay at a Time
            </span>
          </h2>

          <p className="text-[var(--theme-muted-light)] text-sm md:text-base leading-relaxed font-medium max-w-3xl mx-auto mt-4">
            To provide a trustworthy, automated, and comprehensive digital
            ecosystem connecting property owners and tenants with verified
            property listings, transparent pricing, and robust fraud
            prevention.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;