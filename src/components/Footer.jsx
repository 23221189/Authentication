import React from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext.jsx";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import pg from "../assets/pg.jpeg";
import pg2 from "../assets/pg2.jpeg";

const Footer = () => {
  const { handleLogout, user } = useAuth();
  const { theme } = useTheme();

  const logo = theme === "offwhite" ? pg2 : pg;

  const handleNavigation = (path) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    window.location.href = path;
  };

  const handleLogin = async () => {
    if (user) {
      await handleLogout("/login");
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });

      window.location.href = "/login";
    }
  };

  return (
    <footer
      className="mt-0 font-sans transition-colors duration-300"
      style={{
        backgroundColor: "var(--theme-surface)",
        color: "var(--theme-text)",
        borderTop:
          "1px solid color-mix(in srgb, var(--theme-accent) 50%, transparent)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">

        <div className="col-span-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-3 sm:mb-5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
              <img
                src={logo}
                alt="PG Stay Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover transition-all duration-300"
                style={{
                  border:
                    "1px solid var(--theme-accent)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 14px rgba(139,90,43,0.10)"
                      : "0 0 14px rgba(201,164,92,0.10)",
                }}
              />
            </div>

            <h1
              className="text-lg sm:text-2xl font-extrabold tracking-tight"
              style={{
                color: "var(--theme-text)",
              }}
            >
              PAYING{" "}
              <span
                style={{
                 
                color: "var(--theme-text)",
                }}
              >
                GUEST
              </span>
            </h1>
          </div>

          <p
            className="leading-5 sm:leading-7 text-xs sm:text-sm font-medium max-w-md"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            Find verified Paying Guest accommodations with comfort,
            affordability and security. Your trusted partner for finding
            the perfect stay.
          </p>
        </div>

        <div>
          <h2
            className="text-sm sm:text-lg font-extrabold mb-3 sm:mb-4 tracking-tight relative inline-block"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Quick Links

            <span
              className="absolute -bottom-1 left-0 w-8 sm:w-10 h-0.5"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
              }}
            />
          </h2>

          <div className="flex flex-col gap-2 sm:gap-2.5 mt-3 sm:mt-4">
            <button
              type="button"
              onClick={() => handleNavigation("/")}
              className="text-xs sm:text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block text-left cursor-pointer"
              style={{
                color: "var(--theme-muted-light)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-light)";
              }}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleNavigation("/aboutus")}
              className="text-xs sm:text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block text-left cursor-pointer"
              style={{
                color: "var(--theme-muted-light)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-light)";
              }}
            >
              About Us
            </button>

            <button
              type="button"
              onClick={() => handleNavigation("/contactus")}
              className="text-xs sm:text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block text-left cursor-pointer"
              style={{
                color: "var(--theme-muted-light)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-light)";
              }}
            >
              Contact Us
            </button>

            <button
              type="button"
              onClick={handleLogin}
              className="text-xs sm:text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block text-left cursor-pointer"
              style={{
                color: "var(--theme-muted-light)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-light)";
              }}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => handleNavigation("/signup")}
              className="text-xs sm:text-sm font-medium transition-all duration-300 hover:translate-x-1 inline-block text-left cursor-pointer"
              style={{
                color: "var(--theme-muted-light)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  "var(--theme-muted-light)";
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div>
          <h2
            className="text-sm sm:text-lg font-extrabold mb-3 sm:mb-4 tracking-tight relative inline-block"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Contact

            <span
              className="absolute -bottom-1 left-0 w-8 sm:w-10 h-0.5"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
              }}
            />
          </h2>

          <div className="space-y-2.5 sm:space-y-3.5 mt-3 sm:mt-4">
            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    "var(--theme-surface)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 14px rgba(139,90,43,0.06)"
                      : "0 0 14px rgba(201,164,92,0.06)",
                }}
              >
                <FaEnvelope
                  className="text-xs sm:text-sm"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </div>

              <p
                className="text-[11px] sm:text-sm font-medium whitespace-nowrap pt-1 min-w-0"
                style={{
                  color:
                    "var(--theme-muted-light)",
                }}
              >
                fariharafique12@gmail.com
              </p>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    "var(--theme-surface)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 14px rgba(139,90,43,0.06)"
                      : "0 0 14px rgba(201,164,92,0.06)",
                }}
              >
                <FaEnvelope
                  className="text-xs sm:text-sm"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </div>

              <p
                className="text-[11px] sm:text-sm font-medium whitespace-nowrap pt-1 min-w-0"
                style={{
                  color:
                    "var(--theme-muted-light)",
                }}
              >
                alishbaafzal772@gmail.com
              </p>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    "var(--theme-surface)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                  boxShadow:
                    theme === "offwhite"
                      ? "0 0 14px rgba(139,90,43,0.06)"
                      : "0 0 14px rgba(201,164,92,0.06)",
                }}
              >
                <FaMapMarkerAlt
                  className="text-xs sm:text-sm"
                  style={{
                    color:
                      "var(--theme-accent)",
                  }}
                />
              </div>

              <p
                className="text-xs sm:text-sm font-medium pt-1"
                style={{
                  color:
                    "var(--theme-muted-light)",
                }}
              >
                Sheikhupura, Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col items-center text-center">
          <h2
            className="text-sm sm:text-lg font-extrabold mb-3 sm:mb-4 tracking-tight relative inline-block"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Get Started

            <span
              className="absolute -bottom-1 left-0 w-8 sm:w-10 h-0.5"
              style={{
                backgroundColor:
                  "var(--theme-accent)",
              }}
            />
          </h2>

          <p
            className="text-xs sm:text-sm font-medium leading-5 sm:leading-6 mt-3 sm:mt-4 max-w-sm"
            style={{
              color:
                "var(--theme-muted-light)",
            }}
          >
            Ready to find your perfect stay or list your property?
          </p>

          <button
            type="button"
            onClick={() =>
              handleNavigation("/list-your-property")
            }
            className="inline-flex items-center justify-center w-full mt-3 sm:mt-5 py-2.5 sm:py-3 rounded-lg font-bold text-xs sm:text-sm hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer"
            style={{
              backgroundColor:
                "var(--theme-accent)",
              color:
                "var(--theme-button-text)",
              boxShadow:
                theme === "offwhite"
                  ? "0 0 18px rgba(139,90,43,0.18)"
                  : "0 0 18px rgba(201,164,92,0.18)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-accent-hover)";
              e.currentTarget.style.boxShadow =
                theme === "offwhite"
                  ? "0 0 24px rgba(139,90,43,0.28)"
                  : "0 0 24px rgba(201,164,92,0.28)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-accent)";
              e.currentTarget.style.boxShadow =
                theme === "offwhite"
                  ? "0 0 18px rgba(139,90,43,0.18)"
                  : "0 0 18px rgba(201,164,164,0.18)";
            }}
          >
            List Your Property
          </button>
        </div>
      </div>

      <hr
        style={{
          borderColor: "var(--theme-border)",
        }}
      />

      <div
        className="py-3.5 sm:py-5 text-center text-[10px] sm:text-sm font-medium px-4 leading-4 sm:leading-5"
        style={{
          color: "var(--theme-muted-light)",
        }}
      >
        © 2026{" "}
        <span
          className="font-bold"
          style={{
            color: "var(--theme-accent)",
          }}
        >
          PG Stay
        </span>
        . All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;