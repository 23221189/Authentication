import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const HouseRules = ({
  genderPreference,
  checkInTime = "12:00 PM onwards",
  checkOutTime = "11:30 AM",
  cancellationPolicy,
}) => {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  return (
    <div
      id="rules"
      className="mb-10 sm:mb-14 pt-5 sm:pt-6 scroll-mt-24 transition-colors duration-300"
      style={{
        borderTop: "1px solid var(--theme-border)",
      }}
    >
      <h2
        className="text-2xl sm:text-3xl font-extrabold mb-5 sm:mb-6 tracking-tight leading-tight"
        style={{
          color: "var(--theme-text)",
        }}
      >
        House Rules &{" "}
        <span
          style={{
            color: "var(--theme-accent)",
          }}
        >
          Stay Policies
        </span>
      </h2>

      <div
        className="rounded-xl divide-y text-sm overflow-hidden transition-all duration-500"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow: isOffWhite
            ? "0 0 18px rgba(43,33,24,0.08)"
            : "0 0 18px rgba(0,0,0,0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-accent)";

          e.currentTarget.style.boxShadow = isOffWhite
            ? "0 0 24px rgba(139,90,43,0.12)"
            : "0 0 24px rgba(201,164,92,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            "var(--theme-border)";

          e.currentTarget.style.boxShadow = isOffWhite
            ? "0 0 18px rgba(43,33,24,0.08)"
            : "0 0 18px rgba(0,0,0,0.25)";
        }}
      >
        <div
          className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 sm:gap-3 items-start transition-all duration-300 hover:pl-5 sm:hover:pl-6"
          style={{
            backgroundColor: "var(--theme-surface)",
          }}
        >
          <span
            className="font-bold flex items-center gap-2 text-sm"
            style={{
              color: "var(--theme-text)",
            }}
          >
            <span
              style={{
                color: "var(--theme-accent)",
              }}
            >
              ➔
            </span>
            Check-in
          </span>

          <span
            className="font-medium leading-relaxed"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            Standard from {checkInTime}
          </span>
        </div>

        <div
          className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 sm:gap-3 items-start transition-all duration-300 hover:pl-5 sm:hover:pl-6"
          style={{
            backgroundColor: "var(--theme-surface)",
          }}
        >
          <span
            className="font-bold flex items-center gap-2 text-sm"
            style={{
              color: "var(--theme-text)",
            }}
          >
            <span
              style={{
                color: "var(--theme-accent)",
              }}
            >
              ➔
            </span>
            Check-out
          </span>

          <span
            className="font-medium leading-relaxed"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            Available until {checkOutTime}
          </span>
        </div>

        <div
          className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 items-start"
          style={{
            backgroundColor: "var(--theme-surface)",
          }}
        >
          <span
            className="font-bold flex items-center gap-2 text-sm leading-relaxed"
            style={{
              color: "var(--theme-accent)",
            }}
          >
            💳 Cancellation & Refund Policy
          </span>

          <div
            className="space-y-3 text-sm"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            {cancellationPolicy ? (
              <p className="leading-relaxed font-medium">
                {cancellationPolicy}
              </p>
            ) : (
              <>
                <p className="flex items-start gap-2 leading-relaxed">
                  <span
                    className="font-bold mt-0.5 shrink-0"
                    style={{
                      color: "var(--theme-accent)",
                    }}
                  >
                    •
                  </span>

                  <span className="font-medium">
                    <span
                      className="font-bold"
                      style={{
                        color: "var(--theme-accent)",
                      }}
                    >
                      Cancelled before 24 hours:
                    </span>{" "}
                    Tenant gets{" "}
                    <strong
                      style={{
                        color: "var(--theme-text)",
                      }}
                    >
                      90% refund
                    </strong>
                    .
                  </span>
                </p>

                <p className="flex items-start gap-2 leading-relaxed">
                  <span
                    className="font-bold mt-0.5 shrink-0"
                    style={{
                      color: "var(--theme-accent)",
                    }}
                  >
                    •
                  </span>

                  <span className="font-medium">
                    <span
                      className="font-bold"
                      style={{
                        color: "var(--theme-accent)",
                      }}
                    >
                      Cancelled at last moment:
                    </span>{" "}
                    Tenant gets{" "}
                    <strong
                      style={{
                        color: "var(--theme-text)",
                      }}
                    >
                      50% refund
                    </strong>
                    .
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        <div
          className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 sm:gap-3 items-start transition-all duration-300 hover:pl-5 sm:hover:pl-6"
          style={{
            backgroundColor: "var(--theme-surface)",
          }}
        >
          <span
            className="font-bold flex items-center gap-2 text-sm"
            style={{
              color: "var(--theme-text)",
            }}
          >
            👥 Resident Policy
          </span>

          <span
            className="leading-relaxed font-medium"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            Suitable for{" "}
            <span
              className="font-bold"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              {genderPreference || "All"}
            </span>{" "}
            residents. CNIC / Passport required at check-in.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HouseRules;