import React, { useState } from "react";
import { FaLocationDot, FaStar } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const PropertyHeader = ({
  property,
  city,
  locationLabel,
  ratingScore,
  reviewsCount,
}) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("photos");

  const isOffWhite = theme === "offwhite";

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const tabs = [
    {
      id: "photos",
      label: "Photos",
      href: "#photos",
    },
    {
      id: "amenities",
      label: "Amenities",
      href: "#amenities",
    },
    {
      id: "owner-info",
      label: "Host",
      href: "#owner-info",
    },
    {
      id: "rules",
      label: "House Rules & Refund",
      href: "#rules",
    },
    {
      id: "reviews",
      label: `Guest Reviews (${reviewsCount})`,
      href: "#reviews",
    },
    {
      id: "location-section",
      label: "Location",
      href: "#location-section",
    },
  ];

  return (
    <>
      <div
        className="border-b mb-4 overflow-x-auto scrollbar-hide"
        style={{
          borderColor: "var(--theme-border)",
          backgroundColor: "var(--theme-surface)",
          boxShadow: cardShadow,
        }}
      >
        <div className="flex items-center justify-center gap-5 sm:gap-8 md:gap-10 min-w-max px-4">
          {tabs.map((tab) => (
            <a
  key={tab.id}
  href={tab.href}
  onClick={() => setActiveTab(tab.id)}
  className="py-3 border-b-2 border-transparent whitespace-nowrap text-xs sm:text-sm font-bold"
  style={{
    color:
      activeTab === tab.id
        ? "var(--theme-accent)"
        : "var(--theme-text)",
    borderColor: "transparent",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor =
      "var(--theme-accent)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor =
      "transparent";
  }}
>
  {tab.label}
</a>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5 rounded-xl p-4 sm:p-5"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow: cardShadow,
        }}
      >
        <div className="min-w-0 w-full">
          {ratingScore > 0 && (
            <div
              className="flex items-center gap-1 text-xs mb-2"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />
              <FaStar className="text-sm" />

              <span
                className="ml-1.5 px-2 py-0.5 text-[10px] font-extrabold rounded-md"
                style={{
                  color: "var(--theme-button-text)",
                  backgroundColor: "var(--theme-accent)",
                  boxShadow: isOffWhite
                    ? "0 0 12px rgba(139,90,43,0.14)"
                    : "0 0 12px rgba(201,164,92,0.14)",
                }}
              >
                {ratingScore}
              </span>
            </div>
          )}

          <h1
            className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight"
            style={{
              color: "var(--theme-text)",
            }}
          >
            {property.title}
          </h1>

          <p
            className="text-xs mt-2 flex items-center gap-1.5 flex-wrap font-medium"
            style={{
              color: "var(--theme-muted-light)",
            }}
          >
            <FaLocationDot
              className="text-sm"
              style={{
                color: "var(--theme-accent)",
              }}
            />

            <span>{locationLabel}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default PropertyHeader;