import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useTheme } from "../context/ThemeContext.jsx";

const BookingForm = ({
  propertyId,
  roomId,
  rentperNight,
}) => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    stayType: "Short-Term",
    paymentMethod: "Online",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      return 0;
    }

    const start = new Date(formData.checkInDate);
    const end = new Date(formData.checkOutDate);

    const days =
      (end - start) / (1000 * 3600 * 24);

    return days > 0 ? days * rentperNight : 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const totalAmount = calculateTotal();

    if (totalAmount <= 0) {
      setMessage(
        "Please select valid check-in and check-out dates."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post(
        "/bookings",
        {
          ...formData,
          propertyId,
          roomId,
          totalAmount,
        }
      );

      setMessage(
        response.data.message ||
          "Booking request submitted successfully."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "The Booking request failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .booking-form-input::-webkit-calendar-picker-indicator {
          filter: ${
            theme === "offwhite"
              ? "invert(20%) sepia(30%) saturate(900%) hue-rotate(345deg)"
              : "invert(75%) sepia(35%) saturate(500%) hue-rotate(5deg)"
          };
          cursor: pointer;
        }

        .booking-form-select {
          color-scheme: ${
            theme === "offwhite"
              ? "light"
              : "dark"
          };
        }

        .booking-form-select option {
          background-color: ${
            theme === "offwhite"
              ? "#fffdf8"
              : "#050505"
          };

          color: ${
            theme === "offwhite"
              ? "#2b2118"
              : "#f5efe3"
          };
        }

        .booking-form-select option:checked {
          background-color: ${
            theme === "offwhite"
              ? "#8b5a2b"
              : "#c9a45c"
          };

          color: #ffffff;
        }
      `}</style>

      <div
        className="max-w-md mx-auto p-5 sm:p-6 rounded-xl mt-6 transition-all duration-300"
        style={{
          backgroundColor: "var(--theme-surface)",
          border: "1px solid var(--theme-border)",
          boxShadow:
            theme === "offwhite"
              ? "0 10px 30px rgba(43,33,24,0.10)"
              : "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h2
          className="text-2xl font-bold mb-4"
          style={{
            color: "var(--theme-text)",
          }}
        >
          Book Room
        </h2>

        {message && (
          <div
            className="p-3 mb-4 text-sm rounded-lg font-medium"
            style={{
              color:
                message.toLowerCase().includes("success")
                  ? "var(--theme-success-text)"
                  : "var(--theme-danger-text)",

              backgroundColor:
                message.toLowerCase().includes("success")
                  ? "color-mix(in srgb, var(--theme-success) 10%, transparent)"
                  : "color-mix(in srgb, var(--theme-danger) 10%, transparent)",

              border:
                message.toLowerCase().includes("success")
                  ? "1px solid color-mix(in srgb, var(--theme-success) 25%, transparent)"
                  : "1px solid color-mix(in srgb, var(--theme-danger) 25%, transparent)",
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div>
            <label
              className="block text-sm font-medium"
              style={{
                color: "var(--theme-muted-light)",
              }}
            >
              Check-In Date
            </label>

            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={change}
              required
              className="booking-form-input w-full mt-1 p-3 rounded-md outline-none transition-all duration-200"
              style={{
                backgroundColor: "var(--theme-card)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium"
              style={{
                color: "var(--theme-muted-light)",
              }}
            >
              Check-Out Date
            </label>

            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={change}
              required
              className="booking-form-input w-full mt-1 p-3 rounded-md outline-none transition-all duration-200"
              style={{
                backgroundColor: "var(--theme-card)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium"
              style={{
                color: "var(--theme-muted-light)",
              }}
            >
              Stay Type
            </label>

            <select
              name="stayType"
              value={formData.stayType}
              onChange={change}
              className="booking-form-select w-full mt-1 p-3 rounded-md outline-none cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "var(--theme-card)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)",
              }}
            >
              <option value="Short-Term">
                Short-Term
              </option>

              <option value="Long-Term">
                Long-Term
              </option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium"
              style={{
                color: "var(--theme-muted-light)",
              }}
            >
              Payment Option
            </label>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={change}
              className="booking-form-select w-full mt-1 p-3 rounded-md outline-none cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: "var(--theme-card)",
                color: "var(--theme-text)",
                border: "1px solid var(--theme-border)",
              }}
            >
              <option value="Online">
                Online (Card / Wallet)
              </option>

              <option value="ByHand">
                By Hand (Cash)
              </option>
            </select>
          </div>

          <div
            className="pt-2 text-lg font-semibold"
            style={{
              color: "var(--theme-text)",
            }}
          >
            Total Rent:{" "}
            <span
              style={{
                color: "var(--theme-accent)",
              }}
            >
              Rs. {calculateTotal().toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: "var(--theme-accent)",
              color: "var(--theme-button-text)",
              boxShadow:
                "0 8px 20px color-mix(in srgb, var(--theme-accent) 18%, transparent)",
            }}
          >
            {loading
              ? "Processing..."
              : "Confirm Booking Request"}
          </button>
        </form>
      </div>
    </>
  );
};

export default BookingForm;