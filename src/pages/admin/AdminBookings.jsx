import { useEffect, useMemo, useState } from "react";
import { getMyBookings } from "../../api/bookingApi";
import { getAllPayments } from "../../api/paymentApi";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  FaSearch,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaTimes,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaEnvelope,
  FaUserTie,
  FaCreditCard,
} from "react-icons/fa";

function AdminBookings() {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const capitalize = (value) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  const formatBookingForDisplay = (booking, paymentsByBooking) => {
    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      approved: "Confirmed",
      rejected: "Cancelled",
      cancelled: "Cancelled",
    };

    const payment = paymentsByBooking.get(booking._id);

    const methodLabelMap = {
      cash: "Cash on Arrival",
      online: "Online (SafePay)",
    };

    const statusLabelMap = {
      paid: "Paid",
      pending: "Pending",
      failed: "Failed",
      refunded: "Refunded",
      partially_refunded: "Partially Refunded",
    };

    return {
      id: booking._id,
      tenant: booking.tenant?.fullname || "Tenant",
      tenantEmail: booking.tenant?.email || "Not provided",
      property: booking.property?.title || "Property",
      owner: booking.owner?.fullname || "Property Owner",
      location:
        [booking.property?.address?.area, booking.property?.address?.city]
          .filter(Boolean)
          .join(", ") || "Location not available",
      checkIn: formatDate(booking.checkInDate),
      checkOut: formatDate(booking.checkOutDate),
      guests: 1,
      amount: `Rs. ${Number(
        booking.totalAmount || 0
      ).toLocaleString()}`,
      paymentMethod: payment
        ? methodLabelMap[payment.method] || payment.method
        : "Not selected yet",
      paymentStatus: payment
        ? statusLabelMap[payment.status] || payment.status
        : "Unpaid",
      status:
        statusMap[booking.status] ||
        capitalize(booking.status) ||
        "Pending",
      bookingDate: formatDate(booking.createdAt),
    };
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest("[data-booking-status-dropdown]")) {
        setStatusOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [bookingsRes, paymentsRes] = await Promise.allSettled([
          getMyBookings(),
          getAllPayments(),
        ]);

        if (!isMounted) return;

        const rawBookings =
          bookingsRes.status === "fulfilled"
            ? bookingsRes.value.data?.bookings || []
            : [];

        const rawPayments =
          paymentsRes.status === "fulfilled"
            ? paymentsRes.value.data?.payments || []
            : [];

        const paymentsByBooking = new Map();

        rawPayments.forEach((p) => {
          const bookingId = p.booking?._id || p.booking;

          if (!bookingId) return;

          const existing = paymentsByBooking.get(bookingId);

          if (
            !existing ||
            new Date(
              p.updatedAt || p.createdAt
            ) >
              new Date(
                existing.updatedAt || existing.createdAt
              )
          ) {
            paymentsByBooking.set(bookingId, p);
          }
        });

        if (bookingsRes.status !== "fulfilled") {
          setLoadError(
            bookingsRes.reason?.response?.data?.message ||
              "Could not load bookings."
          );
        }

        setBookings(
          rawBookings.map((b) =>
            formatBookingForDisplay(b, paymentsByBooking)
          )
        );
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err.response?.data?.message ||
              "Could not load bookings."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.tenant.toLowerCase().includes(query) ||
        booking.property.toLowerCase().includes(query) ||
        booking.owner.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "Pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;

  const cancelledBookings = bookings.filter(
    (b) => b.status === "Cancelled"
  ).length;

  const getStatusStyle = (status) => {
    if (status === "Confirmed") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    if (status === "Pending") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    return "bg-[var(--theme-surface)] text-[var(--theme-muted)] border border-[var(--theme-border)]";
  };

  const getPaymentStyle = (status) => {
    if (status === "Paid") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    if (status === "Refunded") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
  };

  const cardBase =
    "bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-surface)] hover:shadow-[0_10px_30px_rgba(var(--theme-accent-rgb),0.18)] active:translate-y-0";

  const iconBase =
    "transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[var(--theme-accent)]/15 hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.28)]";

  const buttonBase =
    "transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.28)] active:translate-y-0";

  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-x-hidden text-[var(--theme-text)]" style={{ "--theme-accent-rgb": isOffWhite ? "139,90,43" : "201,164,92" }}>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Booking <span className="text-[var(--theme-accent)]">Management</span>
          </h1>

          <p className="mt-1 text-sm text-[var(--theme-muted)] font-medium">
            Monitor and manage all booking activity
          </p>
        </div>

        {loadError && (
          <div className={`${cardBase} mb-6 px-4 py-3 text-sm font-medium text-[var(--theme-accent)]`}>
            {loadError}
          </div>
        )}

        {loading && (
          <div className={`${cardBase} mb-6 flex items-center gap-3 px-4 py-3 text-sm font-medium text-[var(--theme-muted)]`}>
            <div className="animate-spin w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full"></div>
            Loading bookings...
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 xl:grid-cols-4 mb-5 sm:mb-8">

          <div className={`${cardBase} group cursor-pointer p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3`}>
            <div className={`w-8 h-8 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center ${iconBase}`}>
              <FaCalendarCheck className="text-[var(--theme-accent)] text-sm sm:text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[var(--theme-muted)] truncate">
                Total Bookings
              </p>

              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)]">
                  {totalBookings}
                </h2>

                <p className="text-[9px] sm:text-[10px] text-[var(--theme-muted-dark)] font-medium">
                  Total
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} group cursor-pointer p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3`}>
            <div className={`w-8 h-8 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center ${iconBase}`}>
              <FaClock className="text-[var(--theme-accent)] text-sm sm:text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[var(--theme-muted)] truncate">
                Pending Bookings
              </p>

              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)]">
                  {pendingBookings}
                </h2>

                <p className="text-[9px] sm:text-[10px] text-[var(--theme-muted-dark)] font-medium">
                  Waiting
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} group cursor-pointer p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3`}>
            <div className={`w-8 h-8 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center ${iconBase}`}>
              <FaCheckCircle className="text-[var(--theme-accent)] text-sm sm:text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[var(--theme-muted)] truncate">
                Confirmed Bookings
              </p>

              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)]">
                  {confirmedBookings}
                </h2>

                <p className="text-[9px] sm:text-[10px] text-[var(--theme-muted-dark)] font-medium">
                  Approved
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardBase} group cursor-pointer p-2.5 sm:p-4 flex items-center gap-2.5 sm:gap-3`}>
            <div className={`w-8 h-8 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 flex items-center justify-center ${iconBase}`}>
              <FaTimesCircle className="text-[var(--theme-accent)] text-sm sm:text-lg transition-transform duration-300 group-hover:scale-110" />
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-[var(--theme-muted)] truncate">
                Cancelled Bookings
              </p>

              <div className="flex items-baseline gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)]">
                  {cancelledBookings}
                </h2>

                <p className="text-[9px] sm:text-[10px] text-[var(--theme-muted-dark)] font-medium">
                  Cancelled
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className={`${cardBase} overflow-hidden`}>

          <div className="p-3 sm:p-5 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">

            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

              <div className="relative w-full lg:max-w-md">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-muted-dark)]" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search booking, tenant, property..."
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] outline-none focus:border-[var(--theme-accent)] focus:bg-[var(--theme-surface)] focus:ring-2 focus:ring-[var(--theme-accent)]/20 text-sm font-medium text-[var(--theme-text)] placeholder:text-[var(--theme-muted-dark)] transition-all duration-300"
                />

              </div>

              <div data-booking-status-dropdown className="relative w-full lg:w-48 min-w-0">

                <button
                  type="button"
                  onClick={() => setStatusOpen((prev) => !prev)}
                  className={`w-full px-2.5 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border bg-[var(--theme-surface)] outline-none text-xs sm:text-sm font-bold text-[var(--theme-accent)] cursor-pointer transition-all duration-300 flex items-center justify-between gap-3 ${
                    statusOpen
                      ? "border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/20 shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.15)]"
                      : "border-[var(--theme-border)] hover:border-[var(--theme-accent)]/40 hover:-translate-y-0.5"
                  }`}
                >
                  <span>
                    {statusFilter === "All"
                      ? "All Status"
                      : statusFilter}
                  </span>

                  <span className={`text-[var(--theme-accent)] text-sm sm:text-lg leading-none transition-transform duration-300 ${statusOpen ? "rotate-180" : ""}`}>
                    ⌄
                  </span>
                </button>

                {statusOpen && (
                  <div className="absolute z-50 mt-1.5 w-full max-h-40 overflow-y-auto overflow-x-hidden rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[0_10px_24px_rgba(0,0,0,0.6)] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full">

                    {[
                      { value: "All", label: "All Status" },
                      { value: "Pending", label: "Pending" },
                      { value: "Confirmed", label: "Confirmed" },
                      { value: "Cancelled", label: "Cancelled" },
                    ].map((option) => (

                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setStatusOpen(false);
                        }}
                        className={`w-full px-2.5 sm:px-4 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs font-bold leading-tight transition-all duration-200 cursor-pointer ${
                          statusFilter === option.value
                            ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                            : "bg-[var(--theme-surface)] text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)] hover:pl-3.5 sm:hover:pl-5"
                        }`}
                      >
                        {option.label}
                      </button>

                    ))}

                  </div>
                )}

              </div>

            </div>

            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/35 hover:shadow-[0_5px_18px_rgba(var(--theme-accent-rgb),0.10)]">

              <div className={`w-8 h-8 rounded-lg bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0 ${iconBase}`}>
                <FaCalendarCheck className="text-[var(--theme-accent)] text-sm" />
              </div>

              <p className="text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                Admin can monitor booking activity here. Booking approval and rejection are managed by the Property Owner.
              </p>

            </div>

          </div>

          <div className="md:hidden divide-y divide-[var(--theme-border)]">
            {loading ? (
              <div className="px-4 py-10 text-center text-[var(--theme-muted)] text-sm font-medium">
                Loading bookings...
              </div>
            ) : loadError ? (
              <div className="px-4 py-10 text-center text-[var(--theme-accent)] text-sm font-medium">
                {loadError}
              </div>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div key={booking.id} className="p-3 bg-[var(--theme-surface)] min-w-0">
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 shrink-0 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 text-[var(--theme-accent)] flex items-center justify-center font-bold text-sm">
                        {booking.tenant.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--theme-text)] truncate">
                          {booking.tenant}
                        </p>
                        <p className="text-[9px] text-[var(--theme-muted-dark)] mt-0.5 truncate">
                          {booking.id}
                        </p>
                      </div>
                    </div>

                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold ${getStatusStyle(booking.status)}`}>
                      {booking.status === "Confirmed" ? (
                        <FaCheckCircle />
                      ) : booking.status === "Pending" ? (
                        <FaClock />
                      ) : (
                        <FaTimesCircle />
                      )}
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <p className="text-[11px] font-bold text-[var(--theme-text)] truncate">
                      {booking.property}
                    </p>
                    <p className="text-[9px] text-[var(--theme-muted)] mt-0.5 flex items-center gap-1 truncate">
                      <FaMapMarkerAlt className="text-[var(--theme-accent)] shrink-0" />
                      <span className="truncate">{booking.location}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                    <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5 min-w-0">
                      <p className="text-[8px] uppercase font-bold text-[var(--theme-muted-dark)]">Check-in</p>
                      <p className="mt-0.5 text-[9px] font-bold text-[var(--theme-muted-light)] truncate">{booking.checkIn}</p>
                    </div>
                    <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5 min-w-0">
                      <p className="text-[8px] uppercase font-bold text-[var(--theme-muted-dark)]">Check-out</p>
                      <p className="mt-0.5 text-[9px] font-bold text-[var(--theme-muted-light)] truncate">{booking.checkOut}</p>
                    </div>
                    <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5 min-w-0">
                      <p className="text-[8px] uppercase font-bold text-[var(--theme-muted-dark)]">Amount</p>
                      <p className="mt-0.5 text-[9px] font-extrabold text-[var(--theme-text)] truncate">{booking.amount}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="mt-2.5 w-full max-w-[150px] mx-auto py-1.5 px-2 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border border-[var(--theme-accent)] text-[var(--theme-accent)] text-[9px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all duration-300"
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="px-4 py-10 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center mb-3">
                  <FaCalendarCheck />
                </div>
                <h3 className="text-sm font-extrabold text-[var(--theme-text)]">No Bookings Found</h3>
                <p className="text-xs text-[var(--theme-muted-dark)] mt-1">No booking matches your current filters.</p>
              </div>
            )}
          </div>

          <div className="hidden md:block w-full max-w-full overflow-hidden">
            <table className="w-full table-fixed">

              <thead className="bg-[var(--theme-surface)] border-b border-[var(--theme-border)]">

                <tr className="text-left text-xs uppercase tracking-wider text-[var(--theme-muted)]">

                  <th className="px-6 py-4 font-bold">Booking</th>
                  <th className="px-6 py-4 font-bold">Tenant</th>
                  <th className="px-6 py-4 font-bold">Property</th>
                  <th className="px-6 py-4 font-bold">Check-in</th>
                  <th className="px-6 py-4 font-bold">Check-out</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Action</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[var(--theme-border)]">

                {filteredBookings.length > 0 ? (

                  filteredBookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[var(--theme-surface)] hover:shadow-[0_5px_20px_rgba(var(--theme-accent-rgb),0.10)]"
                    >

                      <td className="px-6 py-5">

                        <p className="font-bold text-[var(--theme-text)] text-sm truncate max-w-[140px]">
                          {booking.id}
                        </p>

                        <p className="text-xs text-[var(--theme-muted-dark)] mt-1 font-medium">
                          {booking.bookingDate}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className={`w-10 h-10 rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 text-[var(--theme-accent)] flex items-center justify-center font-bold shrink-0 ${iconBase}`}>
                            {booking.tenant.charAt(0)}
                          </div>

                          <div>

                            <p className="font-bold text-[var(--theme-text)] text-sm">
                              {booking.tenant}
                            </p>

                            <p className="text-xs text-[var(--theme-muted-dark)] font-medium">
                              {booking.guests} Guest{booking.guests > 1 ? "s" : ""}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-5">

                        <p className="font-bold text-[var(--theme-text)] text-sm">
                          {booking.property}
                        </p>

                        <p className="text-xs text-[var(--theme-muted)] mt-1 flex items-center gap-1 font-medium">
                          <FaMapMarkerAlt className="text-[var(--theme-accent)]" />
                          {booking.location}
                        </p>

                      </td>

                      <td className="px-6 py-5 text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                        {booking.checkIn}
                      </td>

                      <td className="px-6 py-5 text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                        {booking.checkOut}
                      </td>

                      <td className="px-6 py-5">

                        <p className="font-extrabold text-[var(--theme-text)] text-sm">
                          {booking.amount}
                        </p>

                        <p className="text-xs text-[var(--theme-muted-dark)] mt-1 font-medium">
                          {booking.paymentMethod}
                        </p>

                      </td>

                      <td className="px-6 py-5">

                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.20)] ${getStatusStyle(booking.status)}`}>

                          {booking.status === "Confirmed" ? (
                            <FaCheckCircle />
                          ) : booking.status === "Pending" ? (
                            <FaClock />
                          ) : (
                            <FaTimesCircle />
                          )}

                          {booking.status}

                        </span>

                      </td>

                      <td className="px-6 py-5">

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className={`px-2.5 py-1.5 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border border-[var(--theme-accent)] text-[var(--theme-accent)] text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap ${buttonBase} cursor-pointer`}
                        >
                          <FaEye />
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td colSpan="8" className="px-6 py-16 text-center">

                      <div className="flex flex-col items-center justify-center">

                        <div className={`w-14 h-14 rounded-2xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center mb-4 border border-[var(--theme-accent)]/15 ${iconBase}`}>
                          <FaCalendarCheck className="text-2xl" />
                        </div>

                        <h3 className="text-lg font-extrabold text-[var(--theme-text)]">
                          No Bookings Found
                        </h3>

                        <p className="text-sm text-[var(--theme-muted-dark)] mt-1 font-medium">
                          No booking matches your current filters.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {selectedBooking && (

        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden"
          onClick={() => setSelectedBooking(null)}
        >

          <div
            className="bg-[var(--theme-surface)] w-full max-w-[360px] sm:max-w-4xl rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(var(--theme-accent-rgb),0.15)] border border-[var(--theme-border)] overflow-x-hidden overflow-y-auto max-h-[88vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="px-3.5 py-3 sm:px-6 sm:py-5 bg-linear-to-r from-[var(--theme-accent)] via-[var(--theme-accent)] to-[var(--theme-accent-hover)] text-[var(--theme-button-text)] flex items-center justify-between sticky top-0 z-10">

              <div>

                <h2 className="text-base sm:text-2xl font-extrabold tracking-tight truncate pr-2">
                  Booking Details
                </h2>

                <p className="text-[10px] sm:text-sm text-[var(--theme-button-text)]/70 mt-0.5 sm:mt-1 font-medium">
                  Complete booking information
                </p>

              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className={`p-2 rounded-lg bg-[var(--theme-surface)]/15 ${buttonBase} hover:bg-[var(--theme-surface)]/25 cursor-pointer`}
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-3 sm:p-6 min-w-0">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4 mb-4 sm:mb-6">

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Booking ID
                  </p>

                  <h3 className="text-sm sm:text-xl font-extrabold text-[var(--theme-text)] mt-1 truncate max-w-full">
                    {selectedBooking.id}
                  </h3>

                </div>

                <span className={`inline-flex self-start sm:self-auto items-center gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold shrink-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.20)] ${getStatusStyle(selectedBooking.status)}`}>

                  {selectedBooking.status === "Confirmed" ? (
                    <FaCheckCircle />
                  ) : selectedBooking.status === "Pending" ? (
                    <FaClock />
                  ) : (
                    <FaTimesCircle />
                  )}

                  {selectedBooking.status}

                </span>

              </div>

              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 sm:gap-4">

                <div className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                  <div className="flex items-center gap-3 mb-4">

                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center ${iconBase}`}>
                      <FaUser />
                    </div>

                    <h3 className="text-xs sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                      Tenant Information
                    </h3>

                  </div>

                  <div className="space-y-3">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                        Full Name
                      </p>

                      <p className="font-bold text-[var(--theme-text)] mt-1">
                        {selectedBooking.tenant}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                      <FaEnvelope className="text-[var(--theme-accent)]" />

                      <span className="break-all">
                        {selectedBooking.tenantEmail}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                      <FaUsers className="text-[var(--theme-accent)]" />
                      {selectedBooking.guests} Guest{selectedBooking.guests > 1 ? "s" : ""}
                    </div>

                  </div>

                </div>

                <div className={`p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                  <div className="flex items-center gap-3 mb-4">

                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center ${iconBase}`}>
                      <FaBuilding />
                    </div>

                    <h3 className="text-xs sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                      Property Information
                    </h3>

                  </div>

                  <div className="space-y-3">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                        Property
                      </p>

                      <p className="font-bold text-[var(--theme-text)] mt-1">
                        {selectedBooking.property}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                      <FaUserTie className="text-[var(--theme-accent)]" />
                      Owner: {selectedBooking.owner}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">
                      <FaMapMarkerAlt className="text-[var(--theme-accent)]" />
                      {selectedBooking.location}
                    </div>

                  </div>

                </div>

              </div>

              <div className={`mt-4 p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30`}>

                <h3 className="text-lg font-extrabold text-[var(--theme-text)] mb-4 tracking-tight">
                  Booking Schedule
                </h3>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">

                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-[var(--theme-accent)]" />
                      Check-in
                    </p>

                    <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                      {selectedBooking.checkIn}
                    </p>

                  </div>

                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-2">
                      <FaCalendarAlt className="text-[var(--theme-accent)]" />
                      Check-out
                    </p>

                    <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                      {selectedBooking.checkOut}
                    </p>

                  </div>

                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2">
                      Booking Date
                    </p>

                    <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                      {selectedBooking.bookingDate}
                    </p>

                  </div>

                </div>

              </div>

              <div className={`mt-4 p-2.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30`}>

                <h3 className="text-lg font-extrabold text-[var(--theme-text)] mb-4 tracking-tight">
                  Payment Information
                </h3>

                <div className="grid grid-cols-3 gap-1.5 sm:gap-3">

                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-2">
                      <FaMoneyBillWave className="text-[var(--theme-accent)]" />
                      Amount
                    </p>

                    <p className="font-extrabold text-[var(--theme-text)]">
                      {selectedBooking.amount}
                    </p>

                  </div>

                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2 flex items-center gap-2">
                      <FaCreditCard className="text-[var(--theme-accent)]" />
                      Payment Method
                    </p>

                    <p className="font-bold text-[var(--theme-text)] text-[10px] sm:text-sm break-words">
                      {selectedBooking.paymentMethod}
                    </p>

                  </div>

                  <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] ${buttonBase} hover:border-[var(--theme-accent)]/30 cursor-pointer`}>

                    <p className="text-[8px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)] mb-1 sm:mb-2">
                      Payment Status
                    </p>

                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(var(--theme-accent-rgb),0.20)] ${getPaymentStyle(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>

                  </div>

                </div>

              </div>

              <div className="mt-4 p-2 sm:p-4 rounded-lg sm:rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-accent)]/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/35 hover:shadow-[0_5px_18px_rgba(var(--theme-accent-rgb),0.10)]">

                <p className="text-[10px] sm:text-sm text-[var(--theme-muted-light)] font-medium">

                  <span className="font-extrabold text-[var(--theme-accent)]">
                    Admin Monitoring:
                  </span>{" "}
                  This booking is displayed for platform monitoring. Booking approval or rejection is handled by the Property Owner.

                </p>

              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className={`w-full mt-3 sm:mt-5 py-2 sm:py-2.5 rounded-lg bg-[var(--theme-surface)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] border border-[var(--theme-accent)] text-[var(--theme-accent)] text-xs font-bold ${buttonBase} cursor-pointer`}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default AdminBookings;