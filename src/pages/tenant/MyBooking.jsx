import React, { useState, useEffect, useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  getMyBookings,
  updateBookingStatus,
  modifyBooking,
  cancelBooking,
} from "../../api/bookingApi.js";
import { getMyPayment } from "../../api/paymentApi.js";

const ACTIVE_STATUSES = [
  "pending",
  "confirmed",
  "approved",
];

const STATUS_STYLES = {
  pending: "status-pending",
  approved: "status-confirmed",
  confirmed: "status-confirmed",
  rejected: "status-cancelled",
  cancelled: "status-cancelled",
};

const getTodayLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDisplayStatus = (status) => {
  const normalizedStatus = String(status || "").toLowerCase();

  if (
    normalizedStatus === "confirmed" ||
    normalizedStatus === "approved"
  ) {
    return "Confirmed";
  }

  if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "rejected"
  ) {
    return "Cancelled";
  }

  return "Pending";
};

const MyBooking = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [payingId, setPayingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingFilter, setBookingFilter] = useState("recent");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const mobileFilterRef = useRef(null);

  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [modifyMoveIn, setModifyMoveIn] = useState("");
  const [modifyMoveOut, setModifyMoveOut] = useState("");
  const [modifySubmitting, setModifySubmitting] = useState(false);
  const [modifyError, setModifyError] = useState("");

  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const [bookingRes, paymentRes] = await Promise.allSettled([
        getMyBookings(),
        getMyPayment(),
      ]);

      setBookings(
        bookingRes.status === "fulfilled"
          ? bookingRes.value.data?.bookings || []
          : []
      );

      setPayments(
        paymentRes.status === "fulfilled"
          ? paymentRes.value.data?.payment || []
          : []
      );
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileFilterRef.current &&
        !mobileFilterRef.current.contains(event.target)
      ) {
        setMobileFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (user && user.role === "tenant") {
      fetchBookings();
    } else {
      setLoading(false);
      setBookings([]);
      setPayments([]);
    }
  }, [user]);

  const sortedBookings = [...bookings].sort(
    (a, b) =>
      new Date(b.createdAt || b.created_at || 0) -
      new Date(a.createdAt || a.created_at || 0)
  );

  const visibleBookings = sortedBookings.filter((bookingItem) => {
    const status = String(bookingItem.status || "").toLowerCase();

    if (bookingFilter === "recent") {
      return true;
    }

    if (bookingFilter === "confirmed") {
      return status === "confirmed" || status === "approved";
    }

    if (bookingFilter === "cancelled") {
      return status === "cancelled" || status === "rejected";
    }

    return status === bookingFilter;
  });

  const selectedPayment = selectedBooking
    ? payments.find(
        (p) =>
          (p.booking?._id || p.booking) === selectedBooking._id
      )
    : null;

  function handlePayOnline(bookingItem) {
    if (!bookingItem) return;

    setPayingId(bookingItem._id);
    navigate(`/payment/${bookingItem._id}`);
  }

  function openModifyPopup(bookingItem) {
    if (!bookingItem) return;

    setSelectedBooking(bookingItem);

    setModifyMoveIn(
      bookingItem.checkInDate
        ? new Date(bookingItem.checkInDate)
            .toISOString()
            .slice(0, 10)
        : ""
    );

    setModifyMoveOut(
      bookingItem.checkOutDate
        ? new Date(bookingItem.checkOutDate)
            .toISOString()
            .slice(0, 10)
        : ""
    );

    setModifyError("");
    setShowModifyPopup(true);
  }

  async function handleConfirmModify() {
    if (!selectedBooking) return;

    if (!modifyMoveIn && !modifyMoveOut) {
      setModifyError(
        "Please provide at least a new check-in or check-out date."
      );
      return;
    }

    const today = getTodayLocal();

    if (modifyMoveIn && modifyMoveIn < today) {
      setModifyError("Check-in date cannot be in the past.");
      return;
    }

    if (modifyMoveOut && modifyMoveOut < today) {
      setModifyError("Check-out date cannot be in the past.");
      return;
    }

    if (
      modifyMoveIn &&
      modifyMoveOut &&
      modifyMoveOut < modifyMoveIn
    ) {
      setModifyError(
        "Check-out date cannot be earlier than the check-in date."
      );
      return;
    }

    setModifySubmitting(true);
    setModifyError("");

    try {
      await modifyBooking(selectedBooking._id, {
        moveInDate: modifyMoveIn || undefined,
        moveOutDate: modifyMoveOut || undefined,
      });

      setShowModifyPopup(false);
      setSelectedBooking(null);

      await fetchBookings();

      alert(
        "Booking updated successfully. It has been moved back to pending for owner approval."
      );
    } catch (err) {
      setModifyError(
        err.response?.data?.message ||
          "Failed to modify booking."
      );
    } finally {
      setModifySubmitting(false);
    }
  }

  function openCancelPopup(bookingItem) {
    if (!bookingItem) return;

    setSelectedBooking(bookingItem);
    setShowCancelPopup(true);
  }

  async function handleConfirmCancel() {
    if (!selectedBooking) return;

    setCancelSubmitting(true);

    try {
      const { data } = await cancelBooking(selectedBooking._id);

      setShowCancelPopup(false);
      setSelectedBooking(null);

      await fetchBookings();

      alert(
        data?.message ||
          "Booking cancelled successfully."
      );
    } catch (err) {
      console.error("Cancel booking error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans transition-colors duration-300">
      <div className="w-full max-w-[1450px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
          <main className="flex-1 min-w-0 w-full">

            <div className="relative w-full border border-[var(--theme-border)] rounded-xl px-3 sm:px-5 py-5 sm:py-7">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-center text-[var(--theme-accent)] tracking-tight">
                My Booking
              </h1>

              <p className="text-center text-[var(--theme-accent)] font-medium mt-2 sm:mt-3 text-xs sm:text-base">
                View your current booking details here.
              </p>
            </div>

            <div className="mt-4 sm:mt-5 bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-accent)]/25 p-2.5 sm:p-4">
              <div className="flex items-center justify-center gap-3">

                <div
                  ref={mobileFilterRef}
                  className="sm:hidden relative w-full"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setMobileFilterOpen((prev) => !prev)
                    }
                    className={`w-full h-10 sm:h-11 px-3 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-accent)]/60 text-[var(--theme-accent)] flex items-center justify-between text-xs sm:text-sm font-bold cursor-pointer transition-all duration-300 ${
                      mobileFilterOpen
                        ? "border-[var(--theme-accent)] shadow-[0_0_20px_rgba(0,0,0,0.16)]"
                        : "hover:border-[var(--theme-accent)] hover:shadow-[0_0_18px_rgba(201,164,92,0.16)]"
                    }`}
                  >
                    <span>
                      {{
                        recent: "Recent",
                        pending: "Pending",
                        confirmed: "Confirmed",
                        cancelled: "Cancelled",
                      }[bookingFilter]}
                    </span>

                    <span
                      className={`text-[var(--theme-accent)] text-sm transition-transform duration-300 ${
                        mobileFilterOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {mobileFilterOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-accent)]/60 shadow-[0_10px_30px_rgba(0,0,0,0.75)]">
                      {[
                        ["recent", "Recent"],
                        ["pending", "Pending"],
                        ["confirmed", "Confirmed"],
                        ["cancelled", "Cancelled"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setBookingFilter(value);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                            bookingFilter === value
                              ? "bg-[var(--theme-accent)] text-[var(--theme-surface)] shadow-[0_0_16px_rgba(0,0,0,0.14)]"
                              : "bg-[var(--theme-surface)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent-hover)] hover:pl-5"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden sm:flex flex-wrap gap-2">
                  {[
                    ["recent", "Recent"],
                    ["pending", "Pending"],
                    ["confirmed", "Confirmed"],
                    ["cancelled", "Cancelled"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setBookingFilter(value)}
                      className={`px-3 py-1.5 rounded-lg text-sm sm:text-base font-bold capitalize transition-all duration-300 ease-out cursor-pointer ${
                        bookingFilter === value
                          ? "bg-[var(--theme-accent)] text-[var(--theme-bg)] shadow-[0_0_14px_rgba(201,164,92,0.16)] hover:bg-[var(--theme-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,0,0,0.18)]"
                          : "bg-[var(--theme-surface)] text-[var(--theme-accent)] border border-[var(--theme-accent)]/25 hover:border-[var(--theme-accent)]/70 hover:text-[var(--theme-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(0,0,0,0.14)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-[var(--theme-surface)] rounded-xl shadow-[0_0_18px_rgba(201,164,92,0.06)] border border-[var(--theme-accent)]/25 p-8 sm:p-14 mt-5 sm:mt-6 text-center text-[var(--theme-muted-light)]">
                <div className="animate-spin w-9 h-9 sm:w-10 sm:h-10 border-4 border-[var(--theme-accent)]/25 border-t-[var(--theme-accent)] rounded-full mx-auto mb-4" />
                <p className="font-medium text-sm sm:text-base">
                  Loading your bookings...
                </p>
              </div>
            ) : visibleBookings.length > 0 ? (
              <div className="space-y-4 mt-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[var(--theme-text)]">
                      Your Bookings
                    </h2>

                    <p className="text-[var(--theme-muted-light)] text-xs sm:text-sm mt-1">
                      {bookingFilter === "recent"
                        ? `${visibleBookings.length} recent booking${visibleBookings.length !== 1 ? "s" : ""} found.`
                        : bookingFilter === "confirmed"
                        ? `${visibleBookings.length} active booking${visibleBookings.length !== 1 ? "s" : ""} found.`
                        : bookingFilter === "pending"
                        ? `${visibleBookings.length} pending booking${visibleBookings.length !== 1 ? "s" : ""} found.`
                        : `${visibleBookings.length} cancelled booking${visibleBookings.length !== 1 ? "s" : ""} found.`}
                    </p>
                  </div>
                </div>

                {visibleBookings.map((bookingItem) => {
                  const normalizedStatus = String(
                    bookingItem.status || "pending"
                  ).toLowerCase();

                  const itemPayment =
                    payments.find(
                      (p) =>
                        (p.booking?._id || p.booking) ===
                        bookingItem._id
                    ) || null;

                  const itemIsPaid =
                    itemPayment?.status === "paid";

                  const itemCanPay =
                    ["confirmed", "approved"].includes(
                      normalizedStatus
                    ) && !itemIsPaid;

                  const itemCanModify =
                    ACTIVE_STATUSES.includes(
                      normalizedStatus
                    );

                  const itemCanCancel =
                    ACTIVE_STATUSES.includes(
                      normalizedStatus
                    );

                  const itemProperty =
                    bookingItem.property || {};

                  const itemRoom =
                    bookingItem.room ||
                    bookingItem.roomDetails ||
                    bookingItem.selectedRoom ||
                    (Array.isArray(itemProperty.rooms)
                      ? itemProperty.rooms.find(
                          (room) =>
                            String(
                              room?._id || room?.id || ""
                            ) ===
                            String(
                              bookingItem.roomId ||
                                bookingItem.room?._id ||
                                bookingItem.selectedRoomId ||
                                ""
                            )
                        )
                      : null) ||
                    {};

                  const itemRoomId =
                    bookingItem.roomId ||
                    bookingItem.selectedRoomId ||
                    itemRoom._id ||
                    itemRoom.id ||
                    "Not provided";

                  const itemRoomName =
                    itemRoom.name ||
                    itemRoom.roomName ||
                    bookingItem.roomName ||
                    itemRoom.category ||
                    "Room";

                  const itemRoomImage =
                    itemRoom.image ||
                    itemRoom.imageUrl ||
                    itemRoom.images?.[0] ||
                    bookingItem.roomImage ||
                    itemProperty.images?.[0] ||
                    itemProperty.image ||
                    "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=700&q=80";

                  const itemPropertyName =
                    itemProperty.title ||
                    itemProperty.name ||
                    bookingItem.propertyName ||
                    bookingItem.property?.title ||
                    bookingItem.property?.name ||
                    "Not provided";

                  const itemFacilities =
                    itemRoom.facilities?.length
                      ? itemRoom.facilities
                      : bookingItem.facilities?.length
                      ? bookingItem.facilities
                      : itemProperty.facilities || [];

                  const itemLocation =
                    itemProperty.address?.fullAddress ||
                    itemProperty.address?.street ||
                    itemProperty.address?.address ||
                    [
                      itemProperty.address?.area,
                      itemProperty.address?.city,
                    ]
                      .filter(Boolean)
                      .join(", ") ||
                    itemProperty.location ||
                    bookingItem.location ||
                    "Location not provided";

                  const itemRent =
                    itemProperty.pricing?.monthlyRent ??
                    bookingItem.totalAmount ??
                    0;

                  const itemTotal =
                    bookingItem.totalAmount ??
                    itemRent;

                  return (
                    <div
                      key={bookingItem._id}
                      className="bg-[var(--theme-surface)] rounded-xl shadow-[0_0_18px_rgba(201,164,92,0.06)] border border-[var(--theme-accent)]/25 p-2.5 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                        <span className="text-xs sm:text-base font-extrabold text-[var(--theme-accent)] bg-[var(--theme-surface)] border border-[var(--theme-accent)]/30 px-2.5 sm:px-3 py-1.5 rounded-md break-all">
                          Booking ID:{" "}
                          {bookingItem._id || "Not provided"}
                        </span>

                        <span
                          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-extrabold capitalize text-xs sm:text-sm whitespace-nowrap ${
                            STATUS_STYLES[normalizedStatus] ||
                            "status-pending"
                          }`}
                        >
                          {getDisplayStatus(
                            normalizedStatus
                          )}
                        </span>
                      </div>

                      <div className="mt-3 sm:mt-4 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-3 sm:gap-4 p-2.5 sm:p-4 rounded-xl border border-[var(--theme-accent)]/25 bg-[var(--theme-surface)]">
                        <div className="relative h-36 sm:h-44 md:h-full min-h-[150px] sm:min-h-[190px] rounded-lg overflow-hidden border border-[var(--theme-accent)]/20 bg-[var(--theme-surface)]">
                          <img
                            src={itemRoomImage}
                            alt={itemPropertyName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex flex-col gap-3">
                          <div>
                            <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider">
                              Property Type
                            </p>

                            <p className="text-base sm:text-xl font-extrabold text-[var(--theme-text)] mt-1 capitalize">
                              {itemPropertyName}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider">
                              Location
                            </p>

                            <p className="text-sm sm:text-lg font-bold text-[var(--theme-text)] mt-1 flex items-start gap-2 break-words">
                              <FaMapMarkerAlt className="text-[var(--theme-accent)] shrink-0 mt-1" />
                              {itemLocation}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider mb-2">
                              Facilities
                            </p>

                            <div className="flex flex-wrap gap-1.5">
                              {itemFacilities.length > 0 ? (
                                itemFacilities.map(
                                  (facility, facilityIndex) => (
                                    <span
                                      key={`${facility}-${facilityIndex}`}
                                      className="text-[11px] sm:text-sm font-bold text-[var(--theme-accent)] border border-[var(--theme-accent)]/25 bg-[var(--theme-surface)] px-2 sm:px-2.5 py-1 rounded-md"
                                    >
                                      {facility}
                                    </span>
                                  )
                                )
                              ) : (
                                <span className="text-xs sm:text-sm text-[var(--theme-muted-dark)]">
                                  No facilities provided
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div className="bg-[var(--theme-surface)] p-2 sm:p-2.5 rounded-lg border border-[var(--theme-accent)]/25">
                              <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider mb-1">
                                Check In
                              </p>

                              <p className="text-sm sm:text-base font-extrabold text-[var(--theme-text)]">
                                {bookingItem.checkInDate
                                  ? new Date(
                                      bookingItem.checkInDate
                                    ).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>

                            <div className="bg-[var(--theme-surface)] p-2 sm:p-2.5 rounded-lg border border-[var(--theme-accent)]/25">
                              <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider mb-1">
                                Check Out
                              </p>

                              <p className="text-sm sm:text-base font-extrabold text-[var(--theme-text)]">
                                {bookingItem.checkOutDate
                                  ? new Date(
                                      bookingItem.checkOutDate
                                    ).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="my-3 sm:my-4 border-[var(--theme-accent)]/25" />

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2.5">
                        <div className="bg-[var(--theme-surface)] p-2 sm:p-3 rounded-lg border border-[var(--theme-accent)]/25 transition-all duration-300 hover:border-[var(--theme-accent)]/55 hover:-translate-y-0.5">
                          <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider mb-1.5">
                            Monthly Rent
                          </p>

                          <p className="text-[var(--theme-accent)] font-extrabold text-xs sm:text-base">
                            PKR {Number(itemRent).toLocaleString()}
                          </p>
                        </div>

                        <div className="bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/25 rounded-lg p-2 sm:p-3 transition-all duration-300 hover:border-[var(--theme-accent)]/55 hover:-translate-y-0.5">
                          <p className="text-[11px] sm:text-sm font-bold text-[var(--theme-muted-light)] uppercase tracking-wider mb-1.5">
                            Total Amount
                          </p>

                          <p className="text-base sm:text-xl font-black text-[var(--theme-accent)]">
                            PKR {Number(itemTotal).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row flex-wrap justify-end gap-2 mt-3">
                        {itemIsPaid ? (
                          <span className="w-full sm:w-auto bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/25 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold flex items-center justify-center text-xs sm:text-sm">
                            Paid (
                            {itemPayment.method === "cash"
                              ? "by hand"
                              : "online"}
                            )
                          </span>
                        ) : itemCanPay ? (
                          <button
                            onClick={() =>
                              handlePayOnline(
                                bookingItem
                              )
                            }
                            disabled={
                              payingId ===
                              bookingItem._id
                            }
                            className="w-full sm:w-auto bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-5 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-[0_0_18px_rgba(201,164,92,0.16)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 cursor-pointer"
                          >
                            {payingId ===
                            bookingItem._id
                              ? "Redirecting..."
                              : "Proceed to Payment"}
                          </button>
                        ) : null}

                        {itemCanModify && (
                          <button
                            onClick={() =>
                              openModifyPopup(
                                bookingItem
                              )
                            }
                            className="w-full sm:w-auto border border-[var(--theme-accent)] text-[var(--theme-accent)] px-4 sm:px-5 py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-[var(--theme-surface)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                          >
                            Modify Booking
                          </button>
                        )}

                        {itemCanCancel && (
                          <button
                            onClick={() =>
                              openCancelPopup(
                                bookingItem
                              )
                            }
                            className="w-full sm:w-auto booking-cancel-btn px-4 sm:px-5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[var(--theme-surface)] rounded-xl shadow-[0_0_18px_rgba(201,164,92,0.06)] border border-[var(--theme-accent)]/25 p-8 sm:p-14 mt-5 sm:mt-6 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center mx-auto mb-5 sm:mb-6">
                  <FaCalendarAlt className="text-2xl sm:text-3xl text-[var(--theme-accent)]" />
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--theme-text)]">
                  No Booking Yet
                </h2>

                <p className="text-sm sm:text-base text-[var(--theme-muted-light)] mt-3 sm:mt-4 font-medium leading-relaxed max-w-md mx-auto">
                  {user ? (
                    <>
                      You haven't booked any property yet.
                      <br />
                      Explore available properties and make your first booking.
                    </>
                  ) : (
                    <>
                      You're not logged in yet.
                      <br />
                      Login to your tenant account to see your bookings here.
                    </>
                  )}
                </p>

                <div className="flex justify-center mt-6 sm:mt-8">
                  <Link
                    to="/"
                    className="inline-block bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-6 sm:px-10 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base shadow-[0_0_18px_rgba(201,164,92,0.16)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Browse Properties
                  </Link>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showModifyPopup && (
        <div className="fixed inset-0 bg-[var(--theme-overlay)] flex justify-center items-center z-50 p-2 sm:p-4">
          <div className="bg-[var(--theme-surface)] rounded-xl max-w-2xl w-full p-4 sm:p-8 shadow-[0_0_28px_rgba(0,0,0,0.16)] border border-[var(--theme-accent)]/30 relative max-h-[88vh] sm:max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--theme-text)]">
              Modify{" "}
              <span className="text-[var(--theme-accent)]">
                Booking
              </span>
            </h2>

            <p className="mt-3 sm:mt-5 text-[var(--theme-muted-light)] leading-6 sm:leading-7 text-xs sm:text-sm">
              You are about to modify your booking.
              <br />
              <br />
              The system will check room availability for your new selected dates.
              <br />
              <br />

              <span className="inline-flex items-start gap-2">
                <span className="text-[var(--theme-accent)] font-bold shrink-0">
                  ✓
                </span>
                <span>
                  If the room is available, your booking will be updated.
                </span>
              </span>

              <br />

              <span className="inline-flex items-start gap-2">
                <span className="text-[var(--theme-accent)] font-bold shrink-0">
                  ✓
                </span>
                <span>
                  If the room is not available, your booking cannot be modified and you will be asked to select different dates.
                </span>
              </span>
            </p>

            {modifyError && (
              <div className="bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 text-[var(--theme-accent-hover)] text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 mt-4 sm:mt-5 font-medium">
                {modifyError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 mt-4 sm:mt-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--theme-muted-light)] mb-1.5 sm:mb-2">
                  New Check-In
                </label>

                <input
                  type="date"
                  min={getTodayLocal()}
                  value={modifyMoveIn}
                  onChange={(e) =>
                    setModifyMoveIn(e.target.value)
                  }
                  disabled={modifySubmitting}
                  className="w-full border border-[var(--theme-accent)]/25 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 bg-[var(--theme-surface)] disabled:bg-[var(--theme-surface)]/60 text-[var(--theme-text)] text-xs sm:text-sm font-medium transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--theme-muted-light)] mb-1.5 sm:mb-2">
                  New Check-Out
                </label>

                <input
                  type="date"
                  min={
                    modifyMoveIn &&
                    modifyMoveIn > getTodayLocal()
                      ? modifyMoveIn
                      : getTodayLocal()
                  }
                  value={modifyMoveOut}
                  onChange={(e) =>
                    setModifyMoveOut(e.target.value)
                  }
                  disabled={modifySubmitting}
                  className="w-full border border-[var(--theme-accent)]/25 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 outline-none focus:border-[var(--theme-accent)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 bg-[var(--theme-surface)] disabled:bg-[var(--theme-surface)]/60 text-[var(--theme-text)] text-xs sm:text-sm font-medium transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-10">
              <button
                onClick={() => {
                  setShowModifyPopup(false);
                  setSelectedBooking(null);
                }}
                disabled={modifySubmitting}
                className="w-full sm:w-auto border border-[var(--theme-accent)]/25 text-[var(--theme-muted-light)] px-4 sm:px-5 py-2 rounded-lg font-bold text-sm hover:bg-[var(--theme-surface)] hover:text-[var(--theme-text)] disabled:opacity-60 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmModify}
                disabled={modifySubmitting}
                className="w-full sm:w-auto bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-bg)] px-4 sm:px-5 py-2 rounded-lg font-bold text-sm shadow-[0_0_18px_rgba(201,164,92,0.16)] disabled:opacity-60 transition-all active:scale-[0.98] cursor-pointer"
              >
                {modifySubmitting
                  ? "Saving..."
                  : "Confirm Modify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelPopup && (
        <div className="fixed inset-0 bg-[var(--theme-overlay)] flex justify-center items-center z-50 p-2 sm:p-4">
          <div className="bg-[var(--theme-surface)] rounded-xl max-w-2xl w-full p-4 sm:p-8 shadow-[0_0_28px_rgba(0,0,0,0.16)] border border-[var(--theme-accent)]/25 relative max-h-[88vh] sm:max-h-[90vh] overflow-y-auto">

            <h2 className="text-xl sm:text-2xl text-[var(--theme-accent)] md:text-3xl font-extrabold">
              Cancel Booking
            </h2>

            <p className="mt-3 sm:mt-5 text-[var(--theme-muted-light)] leading-6 sm:leading-7 text-xs sm:text-sm">
              Are you sure you want to cancel your booking?
              <br />
              <br />

              <span className="font-bold text-[var(--theme-text)]">
                Refund Policy
              </span>

              <br />
              <br />

              <span className="inline-flex items-start gap-2">
                <span className="text-[var(--theme-accent)] font-bold shrink-0">
                  ✓
                </span>
                <span>
                  90% refund if booking is cancelled before 24 hours.
                </span>
              </span>

              <br />

              <span className="inline-flex items-start gap-2">
                <span className="text-[var(--theme-accent)] font-bold shrink-0">
                  ✓
                </span>
                <span>
                  50% refund if booking is cancelled within the last 11 hours before check-in.
                </span>
              </span>

              <br />
              <br />

              <span className="text-[var(--theme-muted-light)] font-medium">
                If payment has not been completed, no refund will be applied.
              </span>
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-10">
              <button
                onClick={() => {
                  setShowCancelPopup(false);
                  setSelectedBooking(null);
                }}
                disabled={cancelSubmitting}
                className="w-full sm:w-auto border border-[var(--theme-accent)] text-[var(--theme-accent)] px-4 sm:px-5 py-2 rounded-lg font-bold text-sm hover:bg-[var(--theme-surface)] disabled:opacity-60 transition-colors cursor-pointer"
              >
                Keep Booking
              </button>

              <button
                onClick={handleConfirmCancel}
                disabled={cancelSubmitting}
                className="w-full sm:w-auto booking-cancel-confirm-btn px-4 sm:px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-60 transition-all active:scale-[0.98] cursor-pointer"
              >
                {cancelSubmitting
                  ? "Cancelling..."
                  : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooking;