import React, { useState, useEffect, useMemo } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const ReservationCard = ({
  monthlyRent,
  dailyRent,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guestsCount,
  setGuestsCount,
  maxGuests = 1,
  nights,
  grandTotal,
  onBookNow,
  selectedImages = [],
  selectedFacilities = [],
  onRemoveImage,
  onCancelSelection,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const minCheckOutDate = useMemo(()=>{
    if(!checkInDate) return today;
    const nextDay = new Date(checkInDate);
    nextDay.setDate(nextDay.getDate()+1);
    return nextDay.toISOString().split("T")[0];
  },[checkInDate, today]);

  function handleCheckInChange(e){
    const newCheckIn = e.target.value;
    if(newCheckIn < today){
      alert("Please choose a valid check-in date (today or future).");
      return;
    }
    setCheckInDate(newCheckIn);
    if(checkOutDate && checkOutDate <= newCheckIn){
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate()+1);
      setCheckOutDate(nextDay.toISOString().split("T")[0]);
    }
  }
  function handleCheckOutChange(e){
    const newCheckOut = e.target.value;
    if(newCheckOut <=checkInDate){
      alert("Check-out date must be after check-in date.");
      return;
    }
    setCheckOutDate(newCheckOut);
  }

  const { theme } = useTheme();

  const isOffWhite = theme === "offwhite";

  const hasSelection = selectedImages.length > 0;

  const [showAllFacilities, setShowAllFacilities] = useState(false);

  const visibleFacilities = showAllFacilities
    ? selectedFacilities
    : selectedFacilities.slice(0, 6);

  const extraCount = selectedFacilities.length - 6;

 
  useEffect(() => {
    const n = Number(guestsCount);
    if (!Number.isNaN(n) && n > maxGuests) {
      setGuestsCount(String(maxGuests));
    }
  }, [maxGuests]); 

  const cardShadow = isOffWhite
    ? "0 0 18px rgba(43,33,24,0.08)"
    : "0 0 18px rgba(0,0,0,0.25)";

  const hoverShadow = isOffWhite
    ? "0 0 28px rgba(139,90,43,0.14)"
    : "0 0 28px rgba(0,0,0,0.35)";

  const accentBorder20 = isOffWhite
    ? "rgba(139,90,43,0.20)"
    : "rgba(201,164,92,0.20)";

  const accentBorder25 = isOffWhite
    ? "rgba(139,90,43,0.25)"
    : "rgba(201,164,92,0.25)";

  const accentBorder30 = isOffWhite
    ? "rgba(139,90,43,0.30)"
    : "rgba(201,164,92,0.30)";

  const accentBorder40 = isOffWhite
    ? "rgba(139,90,43,0.40)"
    : "rgba(201,164,92,0.40)";

  const accentBorder60 = isOffWhite
    ? "rgba(139,90,43,0.60)"
    : "rgba(201,164,92,0.60)";

  const accentGlow7 = isOffWhite
    ? "0 0 16px rgba(139,90,43,0.07)"
    : "0 0 16px rgba(201,164,92,0.07)";

  const accentGlow12 = isOffWhite
    ? "0 0 14px rgba(139,90,43,0.12)"
    : "0 0 14px rgba(201,164,92,0.12)";

  const buttonShadow = isOffWhite
    ? "0 0 18px rgba(139,90,43,0.18)"
    : "0 0 18px rgba(201,164,92,0.18)";

  const buttonHoverShadow = isOffWhite
    ? "0 0 26px rgba(139,90,43,0.30)"
    : "0 0 26px rgba(201,164,92,0.30)";

  return (
    <div
      className="sticky top-28 rounded-xl transition-all duration-500 p-4 sm:p-6 flex flex-col font-sans"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
        boxShadow: cardShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accentBorder60;
        e.currentTarget.style.boxShadow = hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--theme-border)";
        e.currentTarget.style.boxShadow = cardShadow;
      }}
    >
      <style>{`
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 1;
        }

        input[type="date"] {
          color-scheme: ${isOffWhite ? "light" : "dark"};
        }

        /*  Hide any native number spinners (just in case) */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>

      {hasSelection && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: "var(--theme-accent)" }}
            >
              Selected Rooms ({selectedImages.length})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {selectedImages.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden"
                style={{
                  border: `1px solid ${accentBorder40}`,
                  backgroundColor: "var(--theme-bg)",
                  boxShadow: accentGlow12,
                }}
              >
                <img
                  src={img}
                  alt={`Selected room ${idx + 1}`}
                  className="w-full h-24 object-cover"
                />

                <button
                  type="button"
                  onClick={() => onRemoveImage(img)}
                  title="Remove this image"
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: "var(--theme-bg)",
                    color: "var(--theme-accent)",
                    border: `1px solid ${accentBorder60}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--theme-accent)";
                    e.currentTarget.style.color = "var(--theme-button-text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--theme-bg)";
                    e.currentTarget.style.color = "var(--theme-accent)";
                  }}
                >
                  <FaXmark className="text-[10px]" />
                </button>

                <div
                  className="absolute top-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5"
                  style={{
                    backgroundColor: "var(--theme-accent)",
                    color: "var(--theme-button-text)",
                  }}
                >
                  <FaCheck className="text-[8px]" />
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSelection && selectedFacilities?.length > 0 && (
        <div
          className="mb-5 pb-4"
          style={{ borderBottom: "1px solid var(--theme-border)" }}
        >
          <span
            className="text-[10px] font-bold uppercase tracking-wider block mb-2"
            style={{ color: "var(--theme-muted-dark)" }}
          >
            Included Facilities ({selectedFacilities.length})
          </span>

          <div className="flex flex-wrap gap-1.5">
            {visibleFacilities.map((fac, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-1 rounded-md font-bold"
                style={{
                  backgroundColor: isOffWhite
                    ? "rgba(139,90,43,0.10)"
                    : "rgba(201,164,92,0.10)",
                  color: "var(--theme-accent)",
                  border: `1px solid ${accentBorder25}`,
                }}
              >
                {fac}
              </span>
            ))}

            {!showAllFacilities && extraCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllFacilities(true)}
                className="text-[10px] px-2 py-1 rounded-md font-bold transition-all cursor-pointer"
                style={{
                  color: "var(--theme-accent)",
                  backgroundColor: isOffWhite
                    ? "rgba(139,90,43,0.10)"
                    : "rgba(201,164,92,0.10)",
                  border: `1px solid ${accentBorder40}`,
                }}
              >
                +{extraCount} more
              </button>
            )}

            {showAllFacilities && extraCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllFacilities(false)}
                className="text-[10px] px-2 py-1 rounded-md font-bold transition-all cursor-pointer"
                style={{
                  color: "var(--theme-muted-dark)",
                  backgroundColor: "var(--theme-bg)",
                  border: "1px solid var(--theme-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--theme-accent)";
                  e.currentTarget.style.borderColor = accentBorder40;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--theme-muted-dark)";
                  e.currentTarget.style.borderColor = "var(--theme-border)";
                }}
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-3 pb-4 mb-5"
        style={{ borderBottom: "1px solid var(--theme-border)" }}
      >
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider block"
            style={{ color: "var(--theme-muted-dark)" }}
          >
            Monthly Rent
          </span>

          <span
            className="text-sm font-extrabold"
            style={{ color: "var(--theme-text)" }}
          >
            PKR {monthlyRent.toLocaleString()}{" "}
            <span
              className="text-xs font-medium"
              style={{ color: "var(--theme-muted-dark)" }}
            >
              /month
            </span>
          </span>
        </div>

        <div className="text-left sm:text-right">
          <span
            className="text-[10px] font-bold uppercase tracking-wider block mb-1"
            style={{ color: "var(--theme-muted-dark)" }}
          >
            Daily Rent
          </span>

          <span
            className="text-sm font-extrabold"
            style={{ color: "var(--theme-text)" }}
          >
            PKR {dailyRent.toLocaleString()}{" "}
            <span
              className="text-xs font-normal"
              style={{ color: "var(--theme-muted-dark)" }}
            >
              /night
            </span>
          </span>
        </div>
      </div>

      <div
        className="rounded-lg overflow-hidden mb-5"
        style={{
          border: "1px solid var(--theme-border)",
          backgroundColor: "var(--theme-bg)",
          boxShadow: isOffWhite
            ? "0 0 16px rgba(43,33,24,0.08)"
            : "0 0 16px rgba(0,0,0,0.08)",
        }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x"
          style={{ borderBottom: "1px solid var(--theme-border)" }}
        >
          <div className="p-3.5">
            <label
              className="block text-[10px] font-extrabold uppercase mb-1 tracking-wider"
              style={{ color: "var(--theme-accent)" }}
            >
              Check-in
            </label>

            <input
              type="date"
              value={checkInDate}
              onChange={handleCheckInChange}
              className="w-full text-xs font-semibold outline-none cursor-pointer"
              style={{
                color: "var(--theme-text)",
                backgroundColor: "var(--theme-bg)",
                accentColor: "var(--theme-accent)",
              }}
            />
          </div>

          <div className="p-3.5">
            <label
              className="block text-[10px] font-extrabold uppercase mb-1 tracking-wider"
              style={{ color: "var(--theme-accent)" }}
            >
              Check-out
            </label>

            <input
              type="date"
              value={checkOutDate}
              min={minCheckOutDate}
              onChange={handleCheckOutChange}
              className="w-full text-xs font-semibold outline-none cursor-pointer"
              style={{
                color: "var(--theme-text)",
                backgroundColor: "var(--theme-bg)",
                accentColor: "var(--theme-accent)",
              }}
            />
          </div>
        </div>
        <div className="p-3.5 flex flex-col xs:flex-row sm:flex-row justify-between items-start xs:items-center sm:items-center gap-3">
          <div>
            <label
              className="block text-[10px] font-extrabold uppercase tracking-wider"
              style={{ color: "var(--theme-accent)" }}
            >
              Guests
            </label>

            <span
              className="text-xs font-bold mt-0.5 block"
              style={{ color: "var(--theme-text)" }}
            >
              {Number(guestsCount) || 1} Guest
              {(Number(guestsCount) || 1) > 1 ? "s" : ""}
            </span>

            <p
              className="text-[10px] mt-0.5 font-medium"
              style={{ color: "var(--theme-muted-dark)" }}
            >
              Max {maxGuests} allowed
            </p>
          </div>

          <div
            className="flex items-center gap-2 rounded-lg px-2 py-1"
            style={{
              border: "1px solid var(--theme-border)",
              backgroundColor: "var(--theme-surface)",
            }}
          >
    
            <button
              type="button"
              onClick={() =>
                setGuestsCount(
                  String(Math.max(1, (Number(guestsCount) || 1) - 1))
                )
              }
              disabled={(Number(guestsCount) || 1) <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              style={{ color: "var(--theme-muted-light)" }}
              onMouseEnter={(e) => {
                if ((Number(guestsCount) || 1) > 1) {
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.color = "var(--theme-button-text)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--theme-muted-light)";
              }}
            >
              −
            </button>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={guestsCount}
              onChange={(e) => {
                // Only digits
                const raw = e.target.value.replace(/\D/g, "");

                if (raw === "") {
                  setGuestsCount("");
                  return;
                }
                const num = Number(raw);

                if (num > maxGuests) {
                  setGuestsCount(String(maxGuests));
                } else {
                  setGuestsCount(String(num));
                }
              }}
              onFocus={(e) => {
                e.target.select();
                e.target.style.borderColor = "var(--theme-accent)";
                e.target.style.backgroundColor = "var(--theme-bg)";
                e.target.style.boxShadow =
                  "0 0 0 2px rgba(201,164,92,0.20)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--theme-border)";
                e.target.style.backgroundColor = "transparent";
                e.target.style.boxShadow = "none";

                const n = Number(guestsCount);
                if (!n || n < 1) {
                  setGuestsCount("1");
                }
              }}
              className="w-14 h-8 text-center text-sm font-extrabold rounded-md outline-none transition-all cursor-text"
              style={{
                color: "var(--theme-text)",
                backgroundColor: "transparent",
                border: "1px solid var(--theme-border)",
                MozAppearance: "textfield",
              }}
              aria-label="Number of guests"/>
            <button
              type="button"
              onClick={() =>
                setGuestsCount(
                  String(
                    Math.min(maxGuests, (Number(guestsCount) || 0) + 1)
                  )
                )
              }
              disabled={(Number(guestsCount) || 0) >= maxGuests}
              className="w-8 h-8 flex items-center justify-center rounded-md font-bold text-sm cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ color: "var(--theme-muted-light)" }}
              onMouseEnter={(e) => {
                if ((Number(guestsCount) || 0) < maxGuests) {
                  e.currentTarget.style.backgroundColor =
                    "var(--theme-accent)";
                  e.currentTarget.style.color = "var(--theme-button-text)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--theme-muted-light)";
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div
        className="p-3.5 sm:p-4 rounded-lg mb-5"
        style={{
          backgroundColor: "var(--theme-bg)",
          border: `1px solid ${accentBorder30}`,
          boxShadow: accentGlow7,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline flex-wrap gap-1">
          <span
            className="text-xl sm:text-2xl font-black"
            style={{ color: "var(--theme-accent)" }}
          >
            PKR {grandTotal.toLocaleString()}
          </span>

          <span
            className="text-xs sm:text-sm font-medium sm:ml-3"
            style={{ color: "var(--theme-muted-light)" }}
          >
            Total for {nights} {nights === 1 ? "Night" : "Nights"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onBookNow}
        disabled={!hasSelection}
        className="w-full font-extrabold py-3.5 sm:py-4 rounded-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] cursor-pointer text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{
          backgroundColor: "var(--theme-accent)",
          color: "var(--theme-button-text)",
          boxShadow: buttonShadow,
        }}
        onMouseEnter={(e) => {
          if (hasSelection) {
            e.currentTarget.style.backgroundColor =
              "var(--theme-accent-hover)";
            e.currentTarget.style.boxShadow = buttonHoverShadow;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--theme-accent)";
          e.currentTarget.style.boxShadow = buttonShadow;
        }}
      >
        {hasSelection ? "Reserve Room" : "Select a Room First"}
      </button>

      {!hasSelection && (
        <p
          className="mt-3 text-[11px] text-center font-medium"
          style={{ color: "var(--theme-muted-dark)" }}
        >
          Hover over a photo and click{" "}
          <span
            className="font-bold"
            style={{ color: "var(--theme-accent)" }}
          >
            Reserve Now
          </span>{" "}
          to select a room.
        </p>
      )}

      {hasSelection && (
        <button
          type="button"
          onClick={onCancelSelection}
          className="w-full mt-2.5 py-2.5 rounded-lg font-bold text-xs transition-all duration-300 cursor-pointer"
          style={{
            border: "1px solid var(--theme-border)",
            color: "var(--theme-muted-light)",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--theme-text)";
            e.currentTarget.style.borderColor = accentBorder60;
            e.currentTarget.style.backgroundColor = "var(--theme-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--theme-muted-light)";
            e.currentTarget.style.borderColor = "var(--theme-border)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          Cancel All Selection
        </button>
      )}
    </div>
  );
};

export default ReservationCard;