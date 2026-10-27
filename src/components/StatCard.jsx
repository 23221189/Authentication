import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = "gold",
}) => {
  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.14)"
    : "0 0 28px rgba(0,0,0,0.35)";

  const accentBorder30 = isOffWhite
    ? "rgba(139,90,43,0.30)"
    : "rgba(201,164,92,0.30)";

  const accentGlow8 = isOffWhite
    ? "0 0 14px rgba(139,90,43,0.08)"
    : "0 0 14px rgba(201,164,92,0.08)";

  const accentBorder60 = isOffWhite
    ? "rgba(139,90,43,0.60)"
    : "rgba(201,164,92,0.60)";

  const accentMap = {
    purple: {
      icon: "var(--theme-accent)",
    },
    gold: {
      icon: "var(--theme-accent)",
    },
    amber: {
      icon: "var(--theme-accent)",
    },
    red: {
      icon: "var(--theme-accent)",
    },
  };

  const themeAccent =
    accentMap[accent] || accentMap.gold;

  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4 transition-all duration-500 cursor-default"
      style={{
        backgroundColor:
          "var(--theme-surface)",
        border:
          "1px solid var(--theme-border)",
        boxShadow: cardShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor =
          accentBorder60;
        e.currentTarget.style.boxShadow =
          hoverShadow;
        e.currentTarget.style.transform =
          "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor =
          "var(--theme-border)";
        e.currentTarget.style.boxShadow =
          cardShadow;
        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      <div
        className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor:
            "var(--theme-bg)",
          border:
            `1px solid ${accentBorder30}`,
          boxShadow:
            accentGlow8,
        }}
      >
        {Icon && (
          <Icon
            className="w-6 h-6"
            style={{
              color: themeAccent.icon,
            }}
          />
        )}
      </div>

      <div className="min-w-0">
        <p
          className="text-2xl font-extrabold tracking-tight truncate"
          style={{
            color: "var(--theme-text)",
          }}
        >
          {value}
        </p>

        <p
          className="text-xs font-bold uppercase tracking-wider mt-0.5 truncate"
          style={{
            color:
              "var(--theme-muted-dark)",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;