import Footer from "../../components/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import { getBookingById } from "../../api/bookingApi";
import {
  initiatePayment,
  getMyPayment,
  selectCashOnArrival,
} from "../../api/paymentApi";
import {
  FaWallet,
  FaMoneyBillWave,
  FaCreditCard,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCashPopup, setShowCashPopup] = useState(false);
  const [showCashSuccessPopup, setShowCashSuccessPopup] = useState(false);
  const [cashSubmitting, setCashSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [bookingRes, paymentRes] = await Promise.allSettled([
          getBookingById(bookingId),
          getMyPayment(),
        ]);
        if (bookingRes.status === "fulfilled") {
          setBooking(bookingRes.value.data?.booking || null);
        }
        if (paymentRes.status === "fulfilled") {
          const payments = paymentRes.value.data?.payment || [];
          const existing = payments.find(
            (p) => (p.booking?._id || p.booking) === bookingId
          );
          setIsPaid(existing?.status === "paid");
        }
      } catch (err) {
        console.error("Failed to load booking for payment:", err);
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) load();
    else setLoading(false);
  }, [bookingId]);

  function handlePaymentMethod(event) {
    const value = event.target.value;
    setPaymentMethod(value);
    if (value === "CashOnArrival") {
      setShowCashPopup(true);
    }
  }

  async function handleSubmit() {
    if (paymentMethod === "") {
      alert("Please select a payment method.");
      return;
    }

    if (paymentMethod === "SafePay") {
      setSubmitting(true);
      try {
        const { data } = await initiatePayment(bookingId);
        if (data?.url) {
          window.location.href = data.url;
        } else {
          alert("Could not start payment. Please try again.");
          setSubmitting(false);
        }
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Could not start payment. Please try again."
        );
        setSubmitting(false);
      }
    } else if (paymentMethod === "CashOnArrival") {
      setShowCashPopup(true);
    }
  }

  async function handleConfirmCashOnArrival() {
    setCashSubmitting(true);
    try {
      await selectCashOnArrival(bookingId);
      setShowCashPopup(false);
      setShowCashSuccessPopup(true);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Could not save your payment method. Please try again."
      );
    } finally {
      setCashSubmitting(false);
    }
  }

  function handleCancelCashPopup() {
    setShowCashPopup(false);
    setPaymentMethod("");
  }

  function handleCancel() {
    navigate("/mybooking");
  }

  const property = booking?.property || {};
  const rent = property.pricing?.monthlyRent ?? 0;
  const total = booking?.totalAmount ?? rent;
  const propertyImage =
    property.images?.[0]?.url || property.images?.[0] || null;

  // ✅ Booking ke rooms se room info nikaalo
  const roomInfo = (() => {
    if (Array.isArray(booking?.rooms) && booking.rooms.length > 0) {
      return booking.rooms
        .map((r) => {
          const parts = [];
          if (r.category) parts.push(r.category);
          if (r.acType) parts.push(r.acType);
          if (r.roomNumber) parts.unshift(`#${r.roomNumber}`);
          return parts.join(" • ");
        })
        .join(", ");
    }
    // Fallback: single room fields
    if (booking?.roomNumber != null) {
      const parts = [`#${booking.roomNumber}`];
      if (booking.roomCategory) parts.push(booking.roomCategory);
      if (booking.roomAcType) parts.push(booking.roomAcType);
      return parts.join(" • ");
    }
    return "—";
  })();

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] font-sans text-[var(--theme-text)] transition-colors duration-300">
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-8 py-2 sm:py-5 overflow-x-hidden">
        <Link
          to="/mybooking"
          className="inline-flex items-center gap-1 text-[var(--theme-accent)] font-bold hover:text-[var(--theme-accent-hover)] hover:underline transition-colors text-xs sm:text-sm"
        >
          <FaArrowLeft />
          Back to My Booking
        </Link>

        <div className="text-center mt-3 mb-6 sm:mt-5 sm:mb-8">
          <h1 className="text-2xl sm:text-5xl font-extrabold text-[var(--theme-text)] tracking-tight leading-tight">
            Complete Your{" "}
            <span className="text-[var(--theme-accent)]">Payment</span>
          </h1>

          <p className="text-[var(--theme-muted-light)] mt-2 sm:mt-3 text-sm sm:text-lg font-medium max-w-xl mx-auto">
            Choose a payment method to confirm your booking.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-20">
            <div className="animate-spin w-12 h-12 border-4 border-[var(--theme-border)] border-t-[var(--theme-accent)] rounded-full mx-auto mb-4"></div>
            <p className="text-[var(--theme-muted-dark)] font-medium">
              Loading booking details...
            </p>
          </div>
        ) : !booking ? (
          <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)]/60 transition-colors duration-300 shadow-[0_0_18px_rgba(0,0,0,0.10)] py-12 sm:py-20 px-4 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[var(--theme-accent)]/10 flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-[var(--theme-accent)] text-2xl" />
            </div>
            <p className="text-[var(--theme-muted-light)] font-extrabold text-lg">
              Booking Not Found
            </p>
            <p className="text-[var(--theme-muted-dark)] mt-2 text-sm font-medium">
              The booking you're trying to pay for doesn't exist.
            </p>
          </div>
        ) : isPaid ? (
          <div className="bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)]/60 transition-colors duration-300 shadow-[0_0_18px_rgba(0,0,0,0.10)] py-12 sm:py-20 px-4 text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[var(--theme-accent)]/10 flex items-center justify-center mx-auto mb-5">
              <FaCheckCircle className="text-[var(--theme-accent)] text-3xl" />
            </div>
            <h2 className="text-2xl font-extrabold text-[var(--theme-text)]">
              Already Paid
            </h2>
            <p className="text-[var(--theme-muted-dark)] mt-3 text-sm font-medium max-w-xs mx-auto">
              This booking has already been paid for.
            </p>
            <Link
              to="/mybooking"
              className="inline-block mt-6 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.16)] transition-all active:scale-95"
            >
              View My Booking
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full min-w-0">
            <div className="bg-[var(--theme-surface)] rounded-2xl sm:rounded-3xl shadow-[0_0_18px_rgba(0,0,0,0.10)] border border-[var(--theme-border)]/60 p-3.5 sm:p-8 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center border border-[var(--theme-accent)]/20 shrink-0">
                  <FaWallet className="text-[var(--theme-accent)]" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] tracking-tight leading-tight">
                  Booking Summary
                </h2>
              </div>

              {propertyImage && (
                <img
                  src={propertyImage}
                  alt="Room"
                  className="w-full h-40 sm:h-64 rounded-xl sm:rounded-2xl object-cover border border-[var(--theme-border)]/60"
                />
              )}

              <div className="space-y-2.5 sm:space-y-4 mt-5 sm:mt-8">
                <div className="flex justify-between items-start gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-[var(--theme-border)]/40">
                  <span className="text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-bold uppercase tracking-wider shrink-0">
                    Property
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[var(--theme-text)] text-right break-words max-w-[62%]">
                    {property.title || "—"}
                  </span>
                </div>

                {/* ✅ Room info from booking.rooms */}
                <div className="flex justify-between items-start gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-[var(--theme-border)]/40">
                  <span className="text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-bold uppercase tracking-wider shrink-0">
                    Room(s)
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[var(--theme-text)] text-right break-words max-w-[62%]">
                    {roomInfo}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-[var(--theme-border)]/40">
                  <span className="text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-bold uppercase tracking-wider shrink-0">
                    Move In
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[var(--theme-text)] text-right break-words max-w-[62%]">
                    {booking.checkInDate
                      ? new Date(booking.checkInDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-[var(--theme-border)]/40">
                  <span className="text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-bold uppercase tracking-wider shrink-0">
                    Move Out
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[var(--theme-text)] text-right break-words max-w-[62%]">
                    {booking.checkOutDate
                      ? new Date(booking.checkOutDate).toLocaleDateString()
                      : "—"}
                  </span>
                </div>

                <div className="flex justify-between items-start gap-3">
                  <span className="text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-bold uppercase tracking-wider shrink-0">
                    Monthly Rent
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[var(--theme-text)] text-right break-words max-w-[62%]">
                    PKR {Number(rent).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 mt-5 sm:mt-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-sm sm:text-lg font-bold text-[var(--theme-text)]">
                    Total Amount
                  </h3>
                  <h3 className="text-xl sm:text-3xl font-black text-[var(--theme-accent)]">
                    PKR {Number(total).toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-[var(--theme-surface)] rounded-2xl sm:rounded-3xl shadow-[0_0_18px_rgba(0,0,0,0.10)] border border-[var(--theme-border)]/60 p-3.5 sm:p-8 h-fit lg:sticky lg:top-8 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2.5 mb-5 sm:mb-8">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center border border-[var(--theme-accent)]/20 shrink-0">
                  <FaCreditCard className="text-[var(--theme-accent)]" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] tracking-tight leading-tight">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-2.5 sm:space-y-4">
                <label
                  className={`flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl p-3 sm:p-5 cursor-pointer transition-all duration-300 ease-out border-2 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(0,0,0,0.16)] ${
                    paymentMethod === "SafePay"
                      ? "border-[var(--theme-accent)] bg-[var(--theme-accent)]/5 shadow-lg shadow-[var(--theme-accent)]/10"
                      : "border-[var(--theme-border)]/60 hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-accent)]/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="SafePay"
                    checked={paymentMethod === "SafePay"}
                    onChange={handlePaymentMethod}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--theme-accent)] cursor-pointer shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--theme-accent)]/20">
                      <FaCreditCard className="text-[var(--theme-accent)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[var(--theme-text)] block text-sm sm:text-base">
                        SafePay
                      </span>
                      <span className="text-[10px] sm:text-xs text-[var(--theme-muted-dark)] font-medium leading-tight">
                        Online payment via SafePay
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl p-3 sm:p-5 cursor-pointer transition-all duration-300 ease-out border-2 hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(0,0,0,0.16)] ${
                    paymentMethod === "CashOnArrival"
                      ? "border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 shadow-[0_0_18px_rgba(0,0,0,0.14)]"
                      : "border-[var(--theme-border)]/60 hover:border-[var(--theme-accent)]/50 hover:bg-[var(--theme-accent)]/5"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="CashOnArrival"
                    checked={paymentMethod === "CashOnArrival"}
                    onChange={handlePaymentMethod}
                    className="w-4 h-4 sm:w-5 sm:h-5 accent-[var(--theme-accent)] cursor-pointer shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/15 flex items-center justify-center shrink-0 border border-[var(--theme-accent)]/30">
                      <FaMoneyBillWave className="text-[var(--theme-accent)]" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-[var(--theme-text)] block text-sm sm:text-base">
                        Cash on Arrival
                      </span>
                      <span className="text-[10px] sm:text-xs text-[var(--theme-muted-dark)] font-medium leading-tight">
                        Pay the owner directly on move-in
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full mt-5 sm:mt-8 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] py-3 sm:py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? "Redirecting..." : "Proceed to Payment"}
              </button>

              <button
                onClick={handleCancel}
                disabled={submitting}
                className="w-full mt-2.5 sm:mt-4 border-2 border-[var(--theme-border)] text-[var(--theme-muted-light)] py-3 sm:py-4 rounded-xl font-bold hover:bg-[var(--theme-surface)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showCashPopup && (
          <div className="fixed inset-0 bg-[var(--theme-overlay)] backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4 overflow-hidden">
            <div className="bg-[var(--theme-surface)] rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-[var(--theme-border)] max-h-[88vh] overflow-y-auto overflow-x-hidden">
              <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/15 flex items-center justify-center border border-[var(--theme-accent)]/30 shrink-0">
                  <FaMoneyBillWave className="text-[var(--theme-accent)] text-xl" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] tracking-tight leading-tight">
                  Confirm{" "}
                  <span className="text-[var(--theme-accent)]">
                    Cash on Arrival
                  </span>
                </h2>
              </div>

              <p className="text-[var(--theme-muted-light)] leading-6 sm:leading-7 font-medium text-xs sm:text-base">
                You're choosing to pay in cash directly to the owner.
                <br />
                <br />
                <span className="inline-flex items-start gap-2 mb-2">
                  <span className="text-[var(--theme-accent)] font-bold">
                    ✓
                  </span>
                  Please pay the owner in cash on your Move-in Date.
                </span>
                <br />
                <span className="inline-flex items-start gap-2">
                  <span className="text-[var(--theme-accent)] font-bold">
                    ✓
                  </span>
                  If you fail to arrive before 11:59 PM on your Move-in Date,
                  your booking will be cancelled automatically.
                </span>
                <br />
                <br />
                <span className="text-xs text-[var(--theme-muted-dark)]">
                  The owner and admin will be notified that this booking's
                  payment method is Cash on Arrival.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3 mt-6 sm:mt-8">
                <button
                  onClick={handleCancelCashPopup}
                  disabled={cashSubmitting}
                  className="border-2 border-[var(--theme-border)] text-[var(--theme-muted-light)] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:bg-[var(--theme-surface)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCashOnArrival}
                  disabled={cashSubmitting}
                  className="bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,0,0,0.16)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {cashSubmitting ? "Saving..." : "Confirm Cash on Arrival"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCashSuccessPopup && (
          <div className="fixed inset-0 bg-[var(--theme-overlay)] backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="w-full max-w-md bg-[var(--theme-surface)] border border-[var(--theme-accent)]/60 rounded-2xl shadow-[0_0_45px_rgba(0,0,0,0.18)] p-5 sm:p-7 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/40 flex items-center justify-center shrink-0 shadow-[0_0_22px_rgba(0,0,0,0.14)]">
                  <FaCheckCircle className="text-[var(--theme-accent)] text-2xl sm:text-3xl" />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[var(--theme-text)]">
                    Booking Confirmed!
                  </h2>

                  <p className="text-sm text-[var(--theme-accent)] font-bold mt-2">
                    You selected Cash on Arrival.
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-[var(--theme-muted-light)] leading-6">
                    <p>Please pay the owner in cash on your Move-in Date.</p>
                    <p>
                      If you fail to arrive before 11:59 PM on your Move-in
                      Date, your booking will be cancelled automatically.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowCashSuccessPopup(false);
                  navigate("/mybooking");
                }}
                className="w-full mt-6 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-surface)] py-3 rounded-xl font-bold shadow-[0_0_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Payment;