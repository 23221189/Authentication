import React from "react";
import { FaXmark } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext.jsx";

const BookingCard = ({
  propertyTitle,
  selectedImages = [],
  selectedFacilities = [],
  checkInDate,
  checkOutDate,
  guestsCount,
  nights,
  grandTotal,
  bookingLoading,
  bookingError,
  bookingSuccess,
  onConfirm,
  onClose,
}) => {
  const { theme } = useTheme();

  const overlayColor =
    theme === "offwhite"
      ? "rgba(255, 253, 248, 0.88)"
      : "rgba(5, 5, 5, 0.88)";

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans transition-colors duration-300"
      style={{
        backgroundColor: overlayColor,
      }}
    >
      <style>{`
        .booking-card-scroll::-webkit-scrollbar {
          display: none;
        }

        .booking-card-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div
        className="rounded-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto booking-card-scroll transition-all duration-300"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-accent)",
          boxShadow:
            theme === "offwhite"
              ? "0 20px 60px rgba(43,33,24,0.20)"
              : "0 20px 60px rgba(0,0,0,0.55)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full transition-all duration-300 cursor-pointer z-10"
          style={{
            color: "var(--theme-muted-dark)",
            backgroundColor: "var(--theme-card)",
            border: "1px solid var(--theme-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--theme-accent)";
            e.currentTarget.style.borderColor = "var(--theme-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--theme-muted-dark)";
            e.currentTarget.style.borderColor = "var(--theme-border)";
          }}
        >
          <FaXmark className="text-lg" />
        </button>

        <div className="mb-6 pr-10">
          <h3
            className="text-xl sm:text-2xl font-extrabold mb-1 tracking-tight"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Confirm Booking Request
          </h3>

          <p
            className="text-sm font-semibold"
            style={{
              color: "var(--theme-accent)",
            }}
          >
            {propertyTitle}
          </p>
        </div>

        {bookingError && (
          <p
            className="text-xs rounded-lg px-4 py-3 mb-5 text-center font-medium"
            style={{
              color: "var(--theme-danger-text)",
              backgroundColor:
                "color-mix(in srgb, var(--theme-danger) 10%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--theme-danger) 30%, transparent)",
            }}
          >
            {bookingError}
          </p>
        )}

        {bookingSuccess && (
          <p
            className="text-xs rounded-lg px-4 py-3 mb-5 text-center font-medium"
            style={{
              color: "var(--theme-success-text)",
              backgroundColor:
                "color-mix(in srgb, var(--theme-success) 10%, transparent)",
              border:
                "1px solid color-mix(in srgb, var(--theme-success) 30%, transparent)",
            }}
          >
            {bookingSuccess}
          </p>
        )}

        {selectedImages?.length > 0 && (
          <div className="mb-5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider block mb-2"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Selected Rooms ({selectedImages.length})
            </span>

            <div className="grid grid-cols-2 gap-2">
              {selectedImages.map((img, i) => (
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    border:
                      "1px solid color-mix(in srgb, var(--theme-accent) 45%, transparent)",
                  }}
                >
                  <img
                    src={img}
                    alt={`Room ${i + 1}`}
                    className="w-full h-28 object-cover"
                  />

                  <div
                    className="absolute top-1.5 left-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: "var(--theme-accent)",
                      color: "var(--theme-button-text)",
                    }}
                  >
                    #{i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFacilities?.length > 0 && (
          <div className="mb-5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider block mb-2"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Facilities Included
            </span>

            <div className="flex flex-wrap gap-1.5">
              {selectedFacilities.map((fac, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-md font-bold"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--theme-accent) 10%, transparent)",
                    color: "var(--theme-accent)",
                    border:
                      "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
                  }}
                >
                  {fac}
                </span>
              ))}
            </div>
          </div>
        )}

        <div
          className="p-5 rounded-xl text-sm mb-6 space-y-3"
          style={{
            backgroundColor: "var(--theme-card)",
            border: "1px solid var(--theme-border)",
          }}
        >
          <div className="flex justify-between items-center gap-4">
            <span
              className="font-medium"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Check-in:
            </span>

            <span
              className="font-bold text-right"
              style={{
                color: "var(--theme-text)",
              }}
            >
              {checkInDate}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span
              className="font-medium"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Check-out:
            </span>

            <span
              className="font-bold text-right"
              style={{
                color: "var(--theme-text)",
              }}
            >
              {checkOutDate}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span
              className="font-medium"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Guests:
            </span>

            <span
              className="font-bold text-right"
              style={{
                color: "var(--theme-text)",
              }}
            >
              {guestsCount} Guest
              {guestsCount > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex justify-between items-center gap-4">
            <span
              className="font-medium"
              style={{
                color: "var(--theme-muted-dark)",
              }}
            >
              Duration:
            </span>

            <span
              className="font-bold text-right"
              style={{
                color: "var(--theme-text)",
              }}
            >
              {nights} Night
              {nights > 1 ? "s" : ""}
            </span>
          </div>

          <div
            className="flex justify-between items-center gap-4 pt-3"
            style={{
              borderTop: "1px solid var(--theme-border)",
            }}
          >
            <span
              className="font-bold"
              style={{
                color: "var(--theme-text)",
              }}
            >
              Total Rent:
            </span>

            <span
              className="font-extrabold text-lg text-right"
              style={{
                color: "var(--theme-accent)",
              }}
            >
              PKR {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: "var(--theme-card)",
              border: "1px solid var(--theme-border)",
              color: "var(--theme-muted-light)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--theme-text)";
              e.currentTarget.style.borderColor = "var(--theme-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--theme-muted-light)";
              e.currentTarget.style.borderColor = "var(--theme-border)";
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={bookingLoading}
            className="flex-1 py-3.5 text-sm font-extrabold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              boxShadow:
                "0 0 18px color-mix(in srgb, var(--theme-accent) 18%, transparent)",
            }}
          >
            {bookingLoading
              ? "Submitting..."
              : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;