import { useState, useMemo, useEffect, useRef } from "react";
import axiosClient from "../../api/axiosClient";
import {
  FaCalendarAlt,
  FaUser,
  FaHome,
  FaEye,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { recordCashPayment } from "../../api/paymentApi";

const Filterbuttons = [
  "All",
  "Pending",
  "Confirmed",
  "Approved",
  "Rejected",
  "Cancelled",
];

const filterlabels = {
  All: "All Bookings",
  Pending: "Pending Requests",
};

const POBooking = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [actionLoading, setActionLoading] = useState(null);
  const [cashLoadingId, setCashLoadingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const {
    ownerBookings: bookings = [],
    ownerPayment: contextPayments = [],
    updateOwnerBooking,
    fetchOwnerDashboard,
    ownerDashboardLoading,
    ownerDashboardError,
  } = useAuth();

  const [paymentsList, setPaymentsList] = useState(contextPayments || []);

  const fetchPayments = async () => {
    try {
      const res = await axiosClient.get("/payment/owner/mine");
      const data = res.data?.payments || res.data?.payment || [];
      setPaymentsList(data);
    } catch (err) {
      console.error("Failed to load owner payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
        setFilterDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  async function confirmBooking(id) {
    setActionLoading(id);

    try {
      if (typeof updateOwnerBooking === "function") {
        await updateOwnerBooking(id, "Confirmed");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Booking could not confirmed. Please try again"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectBooking(id) {
    setActionLoading(id);

    try {
      if (typeof updateOwnerBooking === "function") {
        await updateOwnerBooking(id, "Rejected");
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Booking could not rejected. Please try again"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMarkCashPaid(bookingId) {
    setCashLoadingId(bookingId);

    try {
      await recordCashPayment(bookingId);

      if (typeof fetchOwnerDashboard === "function") {
        await fetchOwnerDashboard();
      }

      await fetchPayments();

      alert("Payment recorded successfully.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Could not record this payment. Please try again."
      );
    } finally {
      setCashLoadingId(null);
    }
  }

  function getPaymentForBooking(bookingId) {
    if (!bookingId) return null;

    const bId = String(bookingId);

    return paymentsList.find((p) => {
      const ref = p.booking?._id || p.booking || p.bookingId;
      return ref && String(ref) === bId;
    });
  }

  function handleViewDetails(booking) {
    setSelectedBooking(booking);
  }

  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;

    return bookings.filter((booking) => booking.status === activeFilter);
  }, [bookings, activeFilter]);

  const formatBookingDate = (value) => {
    if (!value || value === "-") return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-GB");
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();

    if (s === "confirmed" || s === "approved") {
      return "bg-[#16a34a]/15 text-[#22c55e] border border-[#16a34a]/40";
    }

    if (s === "pending") {
      return "bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/40";
    }

    if (s === "rejected" || s === "cancelled") {
      return "bg-[#dc2626]/15 text-[#ef4444] border border-[#dc2626]/40";
    }

    return "bg-[#0b0b0b] text-[#777066] border border-[#242424]";
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans">
      <main className="w-full px-2.5 sm:px-5 lg:px-8 pt-1 sm:pt-2 pb-5 sm:pb-7">
        <div className="max-w-7xl mx-auto w-full">

          <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)]">
                Booking Management
              </h1>

              <p className="text-[var(--theme-muted-dark)] mt-2 text-sm sm:text-base leading-relaxed">
                Manage your property booking requests
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                fetchOwnerDashboard?.();
                fetchPayments();
              }}
              className="self-start text-[11px] sm:text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer transition-none"
              style={{
                backgroundColor: "var(--theme-accent)",
                color: "var(--theme-button-text)",
              }}
            >
              Refresh
            </button>
          </div>

          <div
            className="w-full rounded-xl sm:rounded-2xl p-2 sm:p-1 mb-4 sm:mb-6"
            style={{
              backgroundColor: "var(--theme-surface)",
              border: "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
            }}
          >
            <div
              ref={filterDropdownRef}
              className="sm:hidden relative"
            >
              <button
                type="button"
                onClick={() =>
                  setFilterDropdownOpen((prev) => !prev)
                }
                className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-bold outline-none cursor-pointer transition-none"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  border: "1px solid color-mix(in srgb, var(--theme-accent) 45%, transparent)",
                  color: "var(--theme-accent)",
                }}
              >
                <span>
                  {filterlabels[activeFilter] || activeFilter}
                </span>

                <span
                  className={`text-[11px] ${
                    filterDropdownOpen ? "rotate-180" : ""
                  }`}
                  style={{
                    color: "var(--theme-accent)",
                  }}
                >
                  ▾
                </span>
              </button>

              {filterDropdownOpen && (
                <div
                  className="absolute left-0 w-[92%] sm:w-full top-full mt-1 z-[80] overflow-hidden rounded-lg"
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    border:
                      "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
                  }}
                >
                  {Filterbuttons.map((filter) => (
                    <button
                      type="button"
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setFilterDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[10px] sm:text-[11px] font-bold cursor-pointer transition-none"
                      style={{
                        backgroundColor:
                          activeFilter === filter
                            ? "var(--theme-accent)"
                            : "transparent",
                        color:
                          activeFilter === filter
                            ? "var(--theme-button-text)"
                            : "var(--theme-muted-light)",
                      }}
                    >
                      {filterlabels[filter] || filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:flex w-full gap-1">
              {Filterbuttons.map((filter) => (
                <button
                  type="button"
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="flex-1 px-3 sm:px-5 py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-none"
                  style={{
                    backgroundColor:
                      activeFilter === filter
                        ? "var(--theme-accent)"
                        : "transparent",
                    color:
                      activeFilter === filter
                        ? "var(--theme-button-text)"
                        : "var(--theme-muted-light)",
                  }}
                >
                  {filterlabels[filter] || filter}
                </button>
              ))}
            </div>
          </div>

          {selectedBooking && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-[2px] p-2 sm:p-5"
              onClick={() => setSelectedBooking(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-details-title"
                onClick={(event) => event.stopPropagation()}
                className="relative w-[88%] max-w-[330px] sm:w-full sm:max-w-lg max-h-[82vh] sm:max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-3xl p-3 sm:p-6"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 45%, transparent)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  aria-label="Close booking details"
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-none"
                  style={{
                    backgroundColor: "var(--theme-surface)",
                    border:
                      "1px solid color-mix(in srgb, var(--theme-accent) 35%, transparent)",
                    color: "var(--theme-accent)",
                  }}
                >
                  <FaTimes className="text-xs sm:text-sm" />
                </button>

                <div className="pr-8 sm:pr-12">
                  <p
                    className="text-[10px] sm:text-xs uppercase tracking-[0.18em] font-bold"
                    style={{
                      color: "var(--theme-accent)",
                    }}
                  >
                    Booking Details
                  </p>

                  <h2
                    id="booking-details-title"
                    className="mt-0.5 text-[15px] sm:text-2xl font-extrabold"
                    style={{
                      color: "var(--theme-text)",
                    }}
                  >
                    Booking Information
                  </h2>

                  <p
                    className="mt-0.5 text-[9px] sm:text-sm"
                    style={{
                      color: "var(--theme-muted-dark)",
                    }}
                  >
                    Complete details of this booking request.
                  </p>
                </div>

                <div className="mt-3 sm:mt-6 space-y-1.5 sm:space-y-3">
                  {[
                    [
                      "Tenant",
                      selectedBooking.tenantName ||
                        selectedBooking.tenant?.fullname ||
                        selectedBooking.tenant ||
                        "Tenant",
                    ],
                    [
                      "Property",
                      selectedBooking.propertyName ||
                        selectedBooking.property?.title ||
                        selectedBooking.property ||
                        "Property",
                    ],
                    [
                      "Room",
                      selectedBooking.room ||
                        selectedBooking.roomType ||
                        "Room",
                    ],
                    [
                      "Check In",
                      selectedBooking.checkIn ||
                        selectedBooking.checkInDate ||
                        "-",
                    ],
                    [
                      "Check Out",
                      selectedBooking.checkOut ||
                        selectedBooking.checkOutDate ||
                        "-",
                    ],
                    ["Guests", selectedBooking.guests || 1],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-2 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-3"
                      style={{
                        backgroundColor: "var(--theme-surface)",
                        border: "1px solid var(--theme-border)",
                      }}
                    >
                      <span
                        className="text-[8px] sm:text-xs font-bold uppercase tracking-wide"
                        style={{
                          color: "var(--theme-muted-dark)",
                        }}
                      >
                        {label}
                      </span>

                      <span
                        className="max-w-[62%] text-right text-[9px] sm:text-sm font-semibold break-words"
                        style={{
                          color: "var(--theme-text)",
                        }}
                      >
                        {label === "Check In" || label === "Check Out"
                          ? formatBookingDate(value)
                          : value}
                      </span>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-3 pt-0.5">
                    <div
                      className="rounded-lg sm:rounded-xl px-2.5 py-2 sm:px-4 sm:py-3.5"
                      style={{
                        backgroundColor: "var(--theme-surface)",
                        border:
                          "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
                      }}
                    >
                      <p
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          color: "var(--theme-muted-dark)",
                        }}
                      >
                        Amount
                      </p>

                      <p
                        className="mt-0.5 text-[11px] sm:text-lg font-extrabold break-words"
                        style={{
                          color: "var(--theme-accent)",
                        }}
                      >
                        PKR{" "}
                        {Number(
                          selectedBooking.amount ||
                            selectedBooking.totalAmount ||
                            0
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div
                      className="rounded-xl px-3 py-3 sm:px-4 sm:py-3.5"
                      style={{
                        backgroundColor: "var(--theme-surface)",
                        border: "1px solid var(--theme-border)",
                      }}
                    >
                      <p
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          color: "var(--theme-muted-dark)",
                        }}
                      >
                        Status
                      </p>

                      <span
                        className={`inline-flex mt-0.5 px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-bold ${getStatusStyle(
                          selectedBooking.status || "Pending"
                        )}`}
                      >
                        {selectedBooking.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="w-full mt-3 sm:mt-6 rounded-lg sm:rounded-xl py-2 sm:py-3 text-[10px] sm:text-sm font-extrabold cursor-pointer transition-none"
                  style={{
                    backgroundColor: "var(--theme-accent)",
                    color: "var(--theme-button-text)",
                    border:
                      "1px solid color-mix(in srgb, var(--theme-accent) 45%, transparent)",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {ownerDashboardError && !ownerDashboardLoading && (
            <div
              className="text-xs sm:text-sm font-medium rounded-xl p-3 sm:p-4 mb-4 sm:mb-6"
              style={{
                backgroundColor: "var(--theme-surface)",
                border: "1px solid var(--theme-border)",
                color: "var(--theme-accent)",
              }}
            >
              {ownerDashboardError}
            </div>
          )}

          {ownerDashboardLoading ? (
            <div
              className="rounded-2xl min-h-[360px] sm:min-h-95 flex flex-col items-center justify-center py-12 px-5 text-center"
              style={{
                backgroundColor: "var(--theme-surface)",
                border:
                  "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
              }}
            >
              <div
                className="animate-spin w-10 h-10 border-4 border-t-transparent rounded-full mb-4"
                style={{
                  borderColor: "var(--theme-accent)",
                  borderTopColor: "transparent",
                }}
              />

              <p
                className="text-sm font-medium"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                Loading booking requests...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div
              className="rounded-2xl min-h-[360px] sm:min-h-95 flex flex-col items-center justify-center py-12 px-5 text-center"
              style={{
                backgroundColor: "var(--theme-surface)",
                border:
                  "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
              }}
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--theme-surface)",
                  border: "1px solid var(--theme-border)",
                }}
              >
                <FaCalendarAlt
                  className="text-2xl sm:text-3xl"
                  style={{
                    color: "var(--theme-accent)",
                  }}
                />
              </div>

              <h3
                className="font-extrabold mt-5 text-lg sm:text-xl"
                style={{
                  color: "var(--theme-text)",
                }}
              >
                No Bookings Found
              </h3>

              <p
                className="text-sm mt-2 text-center max-w-sm leading-relaxed font-medium"
                style={{
                  color: "var(--theme-muted-dark)",
                }}
              >
                There are no bookings under this filter right now.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                const bookingId = booking.id || booking._id;

                const tenantName =
                  booking.tenantName ||
                  booking.tenant?.fullname ||
                  "Tenant";

                const propertyName =
                  booking.propertyName ||
                  booking.property?.title ||
                  "Property";

                const roomName =
                  booking.room ||
                  booking.roomType ||
                  "Room";

                const guestCount = booking.guests || 1;

                const checkIn =
                  booking.checkIn || booking.checkInDate
                    ? new Date(
                        booking.checkIn || booking.checkInDate
                      ).toLocaleDateString()
                    : "-";

                const checkOut =
                  booking.checkOut || booking.checkOutDate
                    ? new Date(
                        booking.checkOut || booking.checkOutDate
                      ).toLocaleDateString()
                    : "-";

                const amount = Number(
                  booking.totalAmount || booking.amount || 0
                );

                const status = booking.status || "Pending";
                const isBusy = actionLoading === bookingId;

                return (
                  <div
                    key={bookingId}
                    className="group rounded-2xl p-3 sm:p-5 lg:p-6"
                    style={{
                      backgroundColor: "var(--theme-surface)",
                      border:
                        "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                    }}
                  >
                    <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-x-3 gap-y-4 sm:gap-5">

                      <div className="flex items-center gap-2 sm:gap-4 lg:w-[210px] min-w-0">
                        <div
                          className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: "var(--theme-surface)",
                            border: "1px solid var(--theme-border)",
                          }}
                        >
                          <FaUser
                            className="text-xs sm:text-base"
                            style={{
                              color: "var(--theme-accent)",
                            }}
                          />
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="font-bold text-[11px] sm:text-base truncate"
                            style={{
                              color: "var(--theme-text)",
                            }}
                          >
                            {tenantName}
                          </h3>

                          <p
                            className="text-[9px] sm:text-xs mt-0.5 font-medium"
                            style={{
                              color: "var(--theme-muted-dark)",
                            }}
                          >
                            Tenant
                          </p>
                        </div>
                      </div>

                      <div className="lg:w-[210px] min-w-0">
                        <div
                          className="flex items-start gap-2"
                          style={{
                            color: "var(--theme-text)",
                          }}
                        >
                          <FaHome
                            className="mt-1 shrink-0"
                            style={{
                              color: "var(--theme-accent)",
                            }}
                          />

                          <span className="font-bold text-[11px] sm:text-base leading-tight break-words">
                            {propertyName}
                          </span>
                        </div>

                        <p
                          className="text-[9px] sm:text-xs mt-1 ml-5 sm:ml-6 font-medium leading-tight"
                          style={{
                            color: "var(--theme-muted-dark)",
                          }}
                        >
                          {roomName} &middot; {guestCount} guest
                          {guestCount > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="lg:w-[180px]">
                        <div
                          className="flex items-center gap-2"
                          style={{
                            color: "var(--theme-text)",
                          }}
                        >
                          <FaCalendarAlt
                            className="shrink-0"
                            style={{
                              color: "var(--theme-muted-dark)",
                            }}
                          />

                          <span className="text-[10px] sm:text-sm font-semibold leading-tight">
                            {checkIn}
                          </span>
                        </div>

                        <p
                          className="text-[9px] sm:text-xs mt-1 ml-5 sm:ml-6 font-medium leading-tight"
                          style={{
                            color: "var(--theme-muted-dark)",
                          }}
                        >
                          Check-out: {checkOut}
                        </p>
                      </div>

                      <div className="lg:w-[125px]">
                        <p
                          className="text-[9px] sm:text-xs font-bold uppercase tracking-wider"
                          style={{
                            color: "var(--theme-muted-dark)",
                          }}
                        >
                          Amount
                        </p>

                        <p
                          className="font-extrabold mt-1 text-[11px] sm:text-base"
                          style={{
                            color: "var(--theme-accent)",
                          }}
                        >
                          PKR {amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <span
                          className={`inline-flex px-2 sm:px-3 py-1.5 rounded-lg text-[9px] sm:text-xs font-bold ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 sm:flex sm:flex-row items-stretch sm:items-center gap-2 lg:ml-auto w-full lg:w-auto">

                        <button
                          type="button"
                          onClick={() => handleViewDetails(booking)}
                          className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer transition-none"
                          style={{
                            border:
                              "1px solid color-mix(in srgb, var(--theme-accent) 60%, transparent)",
                            color: "var(--theme-accent)",
                            backgroundColor: "transparent",
                          }}
                        >
                          <FaEye />
                          View
                        </button>

                        {status === "Pending" && (
                          <>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => confirmBooking(bookingId)}
                              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white text-[11px] sm:text-sm font-extrabold flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                              style={{
                                backgroundColor: "#16a34a",
                              }}
                            >
                              <FaCheck />

                              {isBusy ? "..." : "Confirm"}
                            </button>

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => rejectBooking(bookingId)}
                              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white text-[11px] sm:text-sm font-extrabold flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                              style={{
                                backgroundColor: "#dc2626",
                              }}
                            >
                              <FaTimes />

                              {isBusy ? "..." : "Reject"}
                            </button>
                          </>
                        )}

                        {(status === "Confirmed" ||
                          status === "Approved") &&
                          (() => {
                            const payment =
                              getPaymentForBooking(bookingId);

                            const isPaid =
                              (payment?.status || "").toLowerCase() ===
                                "paid" ||
                              (booking?.paymentStatus || "").toLowerCase() ===
                                "paid" ||
                              booking?.isPaid === true;

                            const method = (
                              payment?.method ||
                              payment?.gateway ||
                              payment?.source ||
                              ""
                            ).toLowerCase();

                            const isCashOnArrival =
                              method === "cash" ||
                              method === "arrival";

                            const isCashLoading =
                              cashLoadingId === bookingId;

                            if (isPaid) {
                              return (
                                <span
                                  className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                                  style={{
                                    backgroundColor:
                                      "var(--theme-surface)",
                                    border:
                                      "1px solid rgba(22,163,74,0.35)",
                                    color: "#22c55e",
                                  }}
                                >
                                  <FaMoneyBillWave />

                                  Paid (
                                  {method === "cash"
                                    ? "by hand"
                                    : "online"}
                                  )
                                </span>
                              );
                            }

                            if (!isCashOnArrival) {
                              return (
                                <span
                                  className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-medium flex items-center justify-center gap-1.5 sm:gap-2"
                                  style={{
                                    backgroundColor:
                                      "var(--theme-surface)",
                                    border:
                                      "1px solid var(--theme-border)",
                                    color: "var(--theme-muted-dark)",
                                  }}
                                >
                                  <FaMoneyBillWave
                                    style={{
                                      color: "var(--theme-muted-dark)",
                                    }}
                                  />

                                  {payment
                                    ? "Awaiting online payment"
                                    : "Awaiting tenant payment"}
                                </span>
                              );
                            }

                            return (
                              <button
                                type="button"
                                disabled={isCashLoading}
                                onClick={() =>
                                  handleMarkCashPaid(bookingId)
                                }
                                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-none"
                                style={{
                                  backgroundColor:
                                    "var(--theme-accent)",
                                  color:
                                    "var(--theme-button-text)",
                                }}
                              >
                                <FaMoneyBillWave />

                                {isCashLoading
                                  ? "Saving..."
                                  : "Mark Cash Paid"}
                              </button>
                            );
                          })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default POBooking;