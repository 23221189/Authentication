import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaLocationDot } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const DEMO_IMAGE =
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80";

const capitalizeWords = (str) => {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const PropertyCard = ({ property, detailed }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const id = property?._id || property?.id || "demo-id";

  const title = property?.title || "Executive Room in DHA";

  // ✅ Room type — property.rooms se derive karo (agar available ho)
  const roomType = (() => {
    if (Array.isArray(property?.rooms) && property.rooms.length > 0) {
      const categories = [
        ...new Set(property.rooms.map((r) => r.category).filter(Boolean)),
      ];
      return categories.length > 0 ? categories.join(" / ") : "Room";
    }
    return "Room";
  })();

  const propertyType = property?.propertyType || "";

  const cityName = capitalizeWords(
    property?.address?.city || property?.city || "Lahore"
  );

  const areaName = capitalizeWords(
    property?.address?.area || property?.address?.street || ""
  );

  const monthlyRent =
    property?.pricing?.monthlyRent ?? property?.monthlyRent ?? null;

  // ✅ dailyRent (dailyRate nahi)
  const dailyRent = property?.pricing?.dailyRent ?? null;

  const rating = property?.averageRating ?? property?.rating ?? 0;

  const reviewCount = property?.reviewCount ?? 0;

  const facilities = Array.isArray(property?.facilities)
    ? property.facilities
    : [];

  const imageUrl =
    property?.images?.[0] &&
    typeof property.images[0] === "string" &&
    property.images[0].startsWith("http")
      ? property.images[0]
      : property.images?.[0] && typeof property.images[0] === "string"
      ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(
          /\/api\/?$/,
          ""
        )}${property.images[0]}`
      : DEMO_IMAGE;

  const cardShadow = isOffWhite
    ? "0 4px 18px rgba(85,44,6,0.14)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 6px 24px rgba(85,44,6,0.22)"
    : "0 0 28px rgba(0,0,0,0.38)";

  const cardBorder = isOffWhite ? "#552C06" : "rgba(201,164,92,0.30)";

  const hoverBorder = isOffWhite ? "#552C06" : "rgba(201,164,92,0.70)";

  const buttonShadow = isOffWhite
    ? "0 4px 14px rgba(85,44,6,0.22)"
    : "0 4px 14px rgba(201,164,92,0.28)";

  const buttonHoverShadow = isOffWhite
    ? "0 6px 20px rgba(85,44,6,0.32)"
    : "0 6px 20px rgba(201,164,92,0.42)";

  const handlePropertyClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    navigate(`/property/${id}`);
  };

  return (
    <div
      onClick={handlePropertyClick}
      className="group flex flex-col h-full rounded-xl overflow-hidden transition-all duration-500 ease-out cursor-pointer"
      style={{
        backgroundColor: "var(--theme-card)",
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.boxShadow = hoverShadow;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = cardBorder;
        e.currentTarget.style.boxShadow = cardShadow;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Link
        to={`/property/${id}`}
        onClick={(e) => e.stopPropagation()}
        className="block relative aspect-[4/3] w-full overflow-hidden"
        style={{ backgroundColor: "var(--theme-surface)" }}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEMO_IMAGE;
          }}
        />
      </Link>

      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3
            className="text-sm sm:text-base font-bold line-clamp-1 min-w-0"
            style={{ color: "var(--theme-text)" }}
          >
            {roomType} in {cityName}
          </h3>

          <div
            className="flex items-center gap-1 shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid var(--theme-border)",
            }}
          >
            <FaStar
              className="text-[10px] sm:text-[11px]"
              style={{ color: "var(--theme-accent)" }}
            />

            <span
              className="text-[10px] sm:text-xs font-bold"
              style={{ color: "var(--theme-text)" }}
            >
              {Number(rating).toFixed(1)}
            </span>

            {reviewCount > 0 && (
              <span
                className="text-[9px] sm:text-[10px] font-medium"
                style={{ color: "var(--theme-muted-dark)" }}
              >
                ({reviewCount})
              </span>
            )}
          </div>
        </div>

        <p
          className="text-xs sm:text-sm font-medium truncate"
          style={{ color: "var(--theme-muted-light)" }}
        >
          {title}
        </p>

        <p
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium truncate mt-0.5"
          style={{ color: "var(--theme-muted-light)" }}
        >
          <FaLocationDot
            className="shrink-0 text-[12px] sm:text-[13px]"
            style={{ color: "var(--theme-accent)" }}
          />

          {areaName ? `${areaName}, ${cityName}` : cityName}
        </p>

        {detailed && (
          <span
            className="inline-block w-fit max-w-full truncate text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded-md mt-1"
            style={{
              backgroundColor: "var(--theme-surface)",
              color: "var(--theme-accent)",
              border: `1px solid ${cardBorder}`,
            }}
          >
            {propertyType ? `${propertyType} · ${roomType}` : roomType}
          </span>
        )}

        {detailed && facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5 sm:mt-2">
            {facilities.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-1 rounded-md"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  color: "var(--theme-muted-light)",
                  border: "1px solid var(--theme-border)",
                }}
              >
                {f}
              </span>
            ))}

            {facilities.length > 3 && (
              <span
                className="text-[9px] sm:text-[10px] self-center font-bold"
                style={{ color: "var(--theme-muted-dark)" }}
              >
                +{facilities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-2 sm:mt-3 flex items-baseline justify-between flex-wrap gap-1.5">
          <span
            className="font-extrabold text-base sm:text-lg"
            style={{ color: "var(--theme-accent)" }}
          >
            Rs. {Number(monthlyRent || 0).toLocaleString()}
            <span
              className="font-medium text-[10px] sm:text-xs"
              style={{ color: "var(--theme-muted-dark)" }}
            >
              {" "}
              /month
            </span>
          </span>

          {detailed && dailyRent ? (
            <span
              className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-md"
              style={{
                backgroundColor: "var(--theme-surface)",
                color: "var(--theme-muted-light)",
                border: "1px solid var(--theme-border)",
              }}
            >
              Rs. {Number(dailyRent).toLocaleString()}
              <span
                className="font-medium"
                style={{ color: "var(--theme-muted-dark)" }}
              >
                {" "}
                /day
              </span>
            </span>
          ) : null}
        </div>

        {detailed && (
          <div className="mt-auto pt-3 sm:pt-4">
            <Link
              to={`/property/${id}`}
              onClick={(e) => e.stopPropagation()}
              className="block w-full text-center text-xs sm:text-sm font-extrabold py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-button-text)",
                border: "1px solid var(--theme-accent)",
                boxShadow: buttonShadow,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--theme-accent-hover)";
                e.currentTarget.style.boxShadow = buttonHoverShadow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--theme-accent)";
                e.currentTarget.style.boxShadow = buttonShadow;
              }}
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;