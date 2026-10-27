import React from "react";
import { FaShieldHalved } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const HostInfo = ({
  owner,
  reviewsCount,
  ratingScore,
}) => {
  const { theme } = useTheme();

  if (!owner?.fullname) return null;

  const isOffWhite = theme === "offwhite";

  const cardShadow = isOffWhite
    ? "0 4px 18px rgba(43,33,24,0.07)"
    : "0 4px 18px rgba(0,0,0,0.22)";

  const hoverShadow = isOffWhite
    ? "0 8px 25px rgba(139,90,43,0.12)"
    : "0 8px 25px rgba(0,0,0,0.30)";

  return (
    <section
      id="owner-info"
      className="pt-4 sm:pt-5 pb-7 sm:pb-9 scroll-mt-20"
      style={{
        borderTop: "1px solid var(--theme-border)",
      }}
    >
<div className="mb-5 sm:mb-6">
  <h2
    className="inline-block text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight pb-2 border-b-2"
    style={{
      color: "var(--theme-text)",
      borderColor: "var(--theme-accent)",
    }}
  >
    Meet your Host
  </h2>
</div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] gap-5 sm:gap-7 items-start">

        <div
          className="rounded-xl p-4 sm:p-5 flex flex-col items-center text-center"
          style={{
            backgroundColor: "var(--theme-surface)",
            border: "1px solid var(--theme-border)",
            boxShadow: cardShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-accent)";
            e.currentTarget.style.boxShadow =
              hoverShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor =
              "var(--theme-border)";
            e.currentTarget.style.boxShadow =
              cardShadow;
          }}
        >
          <div className="relative mb-3">
            <div
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full flex items-center justify-center font-extrabold text-2xl sm:text-3xl"
              style={{
                backgroundColor: "var(--theme-card)",
                border:
                  "2px solid color-mix(in srgb, var(--theme-accent) 55%, transparent)",
                color: "var(--theme-accent)",
                boxShadow:
                  "0 0 18px color-mix(in srgb, var(--theme-accent) 12%, transparent)",
              }}
            >
              {owner.fullname?.charAt(0)?.toUpperCase() || "H"}
            </div>

            <div
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] border-2"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-button-text)",
                borderColor: "var(--theme-surface)",
              }}
              title="Identity Verified"
            >
              <FaShieldHalved />
            </div>
          </div>

          <h3
            className="text-lg sm:text-xl font-extrabold break-words max-w-full"
            style={{
              color: "var(--theme-text)",
            }}
          >
            {owner.fullname}
          </h3>

          <p
            className="text-[10px] sm:text-xs font-bold mt-1 uppercase tracking-wider"
            style={{
              color: "var(--theme-accent)",
            }}
          >
            Property Owner
          </p>

          <div
            className="flex items-center justify-center gap-8 my-5 w-full py-3"
            style={{
              borderTop: "1px solid var(--theme-border)",
              borderBottom: "1px solid var(--theme-border)",
            }}
          >
            <div>
              <span
                className="font-extrabold text-sm sm:text-base block"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {reviewsCount}
              </span>

              <span
                className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                Reviews
              </span>
            </div>

            <div
              className="w-px h-8"
              style={{
                backgroundColor: "var(--theme-border)",
              }}
            />

            <div>
              <span
                className="font-extrabold text-sm sm:text-base block"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {ratingScore > 0 ? `${ratingScore} ★` : "N/A"}
              </span>

              <span
                className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                Rating
              </span>
            </div>
          </div>
        </div>

        <div
          className="space-y-4 sm:space-y-5 text-sm"
          style={{
            color: "var(--theme-muted-light)",
          }}
        >
          <div
            className="rounded-xl p-4 sm:p-5"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
              boxShadow: cardShadow,
            }}
          >
            <h4
              className="font-extrabold text-base sm:text-lg mb-2 tracking-tight"
              style={{
                color: "var(--theme-text)",
              }}
            >
              Host Information & Safety
            </h4>

            <p
              className="leading-relaxed text-xs sm:text-sm font-medium"
              style={{
                color: "var(--theme-muted-light)",
              }}
            >
              <span
                className="font-bold"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                {owner.fullname}
              </span>{" "}
              manages this property to maintain high cleanliness,
              security, and comfortable stays for guests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div
              className="flex items-start gap-3 rounded-xl p-3.5 sm:p-4"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-border)",
                boxShadow: cardShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  hoverShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  cardShadow;
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--theme-card)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
                }}
              >
                <FaShieldHalved
                  className="text-sm"
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1"
                  style={{
                    color: "var(--theme-text)",
                  }}
                >
                  Identity Verified
                </p>

                <p
                  className="text-[10px] sm:text-xs leading-relaxed font-medium"
                  style={{
                    color: "var(--theme-muted-dark)",
                  }}
                >
                  CNIC verified before listing is approved.
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 rounded-xl p-3.5 sm:p-4"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-border)",
                boxShadow: cardShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-accent)";
                e.currentTarget.style.boxShadow =
                  hoverShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--theme-border)";
                e.currentTarget.style.boxShadow =
                  cardShadow;
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--theme-card)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
                }}
              >
                <FaShieldHalved
                  className="text-sm"
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
              </div>

              <div className="min-w-0">
                <p
                  className="font-bold text-[10px] sm:text-xs uppercase tracking-wider mb-1"
                  style={{
                    color: "var(--theme-text)",
                  }}
                >
                  Trusted Host
                </p>

                <p
                  className="text-[10px] sm:text-xs leading-relaxed font-medium"
                  style={{
                    color: "var(--theme-muted-dark)",
                  }}
                >
                  Actively managed property with verified reviews.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HostInfo;