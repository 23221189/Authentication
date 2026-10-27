import { useMemo, useState } from "react";
import {
  FaUsers,
  FaUser,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext.jsx";

const POTenants = () => {
  const { ownerBookings: bookings = [] } = useAuth();
  const { theme } = useTheme();
  const isBlack = theme === "black";

  const themeVars = {
    "--tenant-bg": isBlack ? "#050505" : "#F7F1E7",
    "--tenant-surface": isBlack ? "#11100e" : "#FFFFFF",
    "--tenant-card": isBlack ? "#171512" : "#FFFFFF",
    "--tenant-text": isBlack ? "#f5efe3" : "#552C06",
    "--tenant-muted": isBlack ? "#bdb6aa" : "#765337",
    "--tenant-muted-light": isBlack ? "#9f988d" : "#6F4B2D",
    "--tenant-muted-dark": isBlack ? "#777066" : "#8A6A4D",
    "--tenant-border": isBlack ? "#3a3328" : "#D8B995",
    "--tenant-accent": isBlack ? "#c9a45c" : "#552C06",
    "--tenant-accent-hover": isBlack ? "#dfbf7b" : "#6B3A0A",
    "--tenant-button-text": isBlack ? "#171717" : "#FFFFFF",
    "--tenant-shadow": isBlack
      ? "rgba(0,0,0,0.70)"
      : "rgba(85,44,6,0.12)",
    "--tenant-glow": isBlack
      ? "rgba(201,164,92,0.20)"
      : "rgba(85,44,6,0.12)",
  };


  const [search, setSearch] = useState("");
  const [selectedTenant, setSelectedTenant] = useState(null);

  const tenants = useMemo(() => {
    const tenantMap = new Map();

    bookings.forEach((booking) => {
      const tenant = booking.tenant || {};

      const tenantId =
        tenant?._id ||
        tenant?.id ||
        booking.tenantId ||
        booking.tenantEmail ||
        booking.tenantName;

      if (!tenantId) return;

      const existing = tenantMap.get(String(tenantId));

      const tenantData = {
        id: tenantId,
        name:
          booking.tenantName ||
          tenant.fullname ||
          tenant.name ||
          "Tenant",
        email:
          booking.tenantEmail ||
          tenant.email ||
          "Not available",
        phone:
          booking.tenantPhone ||
          tenant.phone ||
          "Not available",
        property:
          booking.propertyName ||
          booking.property?.title ||
          booking.property?.name ||
          "Property",
        room:
          booking.room ||
          booking.roomType ||
          "Room",
        checkIn: booking.checkIn || booking.checkInDate || "-",
        checkOut: booking.checkOut || booking.checkOutDate || "-",
        status: booking.status || "Pending",
        amount: Number(
          booking.totalAmount || booking.amount || 0
        ),
      };

      if (!existing) {
        tenantMap.set(String(tenantId), tenantData);
      } else {
        tenantMap.set(String(tenantId), {
          ...existing,
          property: tenantData.property,
          room: tenantData.room,
          checkIn: tenantData.checkIn,
          checkOut: tenantData.checkOut,
          status: tenantData.status,
          amount: tenantData.amount,
        });
      }
    });

    return Array.from(tenantMap.values());
  }, [bookings]);

  const filteredTenants = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return tenants;

    return tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(value) ||
        tenant.email.toLowerCase().includes(value) ||
        tenant.property.toLowerCase().includes(value) ||
        tenant.room.toLowerCase().includes(value)
    );
  }, [tenants, search]);

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "confirmed" || value === "approved") {
      return "bg-[color:var(--tenant-accent)]/10 text-[color:var(--tenant-accent)] border-[color:var(--tenant-border)]";
    }

    if (value === "pending") {
      return "bg-[color:var(--tenant-accent)]/10 text-[color:var(--tenant-accent)] border-[color:var(--tenant-border)]";
    }

    if (value === "rejected" || value === "cancelled") {
      return "bg-[color:var(--tenant-card)] text-[color:var(--tenant-muted)] border-[color:var(--tenant-border)]";
    }

    return "bg-[color:var(--tenant-card)] text-[color:var(--tenant-muted)] border-[color:var(--tenant-border)]";
  };

  return (
    <div style={themeVars} className="min-h-screen w-full bg-[var(--tenant-bg)] text-[var(--tenant-text)] px-2.5 sm:px-5 lg:px-8 pt-1.5 sm:pt-2 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto w-full">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-5 mb-4 sm:mb-7">

          <div>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/35 flex items-center justify-center shadow-[0_0_18px_var(--tenant-glow)] shrink-0">
                <FaUsers className="text-[var(--tenant-text)] text-base sm:text-xl" />
              </div>

              <div>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--tenant-text)]">
                  My Tenants
                </h1>

                <p className="text-[11px] sm:text-sm text-[var(--tenant-muted-dark)] mt-0.5 sm:mt-1">
                  View tenants associated with your properties
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--tenant-surface)] border border-[var(--tenant-text)]/30 rounded-lg sm:rounded-xl px-3 sm:px-5 py-2 sm:py-3 shadow-[0_6px_18px_var(--tenant-shadow)]">
            <p className="text-[9px] sm:text-xs text-[var(--tenant-muted-dark)] font-semibold">
              Total Tenants
            </p>

            <p className="text-base sm:text-xl font-extrabold text-[var(--tenant-text)]">
              {tenants.length}
            </p>
          </div>

        </div>

        <div className="bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/30 rounded-xl sm:rounded-2xl p-2 sm:p-4 mb-4 sm:mb-6 shadow-[0_8px_24px_var(--tenant-shadow)]">
          <div className="relative">

            <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--tenant-muted-dark)] text-xs sm:text-base" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tenant, email, property or room..."
              className="w-full bg-[var(--tenant-surface)] border border-[var(--tenant-border)] rounded-lg sm:rounded-xl pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-xs sm:text-sm text-[var(--tenant-text)] placeholder:text-[var(--tenant-muted-dark)] outline-none focus:border-[var(--tenant-text)]/70 focus:ring-1 focus:ring-[var(--tenant-text)]/30 transition-all"
            />

          </div>
        </div>

        {filteredTenants.length === 0 ? (
          <div className="min-h-64 sm:min-h-80 bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/30 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center px-3 sm:px-5 shadow-[0_8px_24px_var(--tenant-shadow)]">

            <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[var(--tenant-surface)] border border-[var(--tenant-text)]/30 flex items-center justify-center mb-3 sm:mb-4">
              <FaUsers className="text-[var(--tenant-text)] text-base sm:text-2xl" />
            </div>

            <h2 className="text-sm sm:text-xl font-extrabold text-[var(--tenant-text)]">
              No Tenants Found
            </h2>

            <p className="text-[11px] sm:text-sm text-[var(--tenant-muted-dark)] mt-1.5 sm:mt-2 max-w-md">
              {search
                ? "No tenant matches your search."
                : "You currently have no tenants associated with your bookings."}
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">

            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="group bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 shadow-[0_8px_24px_var(--tenant-shadow)] hover:border-[var(--tenant-text)]/70 hover:-translate-y-1 hover:shadow-[0_14px_38px_var(--tenant-glow)] transition-all duration-300"
              >

                <div className="flex items-center justify-between gap-1.5 sm:gap-3 mb-3 sm:mb-5">

                  <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">

                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/35 flex items-center justify-center shrink-0 shadow-[0_0_12px_var(--tenant-glow)]">
                      <FaUser className="text-[var(--tenant-text)] text-sm sm:text-lg" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-extrabold text-[var(--tenant-text)] text-[11px] sm:text-sm lg:text-base truncate">
                        {tenant.name}
                      </h2>

                      <p className="text-[9px] sm:text-xs text-[var(--tenant-muted-dark)] mt-0.5 sm:mt-1">
                        Tenant
                      </p>
                    </div>

                  </div>

                  <span
                    className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border text-[8px] sm:text-xs font-bold whitespace-nowrap ${getStatusStyle(
                      tenant.status
                    )}`}
                  >
                    {tenant.status}
                  </span>

                </div>

                <div className="space-y-1.5 sm:space-y-3">

                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <FaEnvelope className="text-[var(--tenant-text)] shrink-0" />

                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted)] truncate">
                      {tenant.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <FaPhone className="text-[var(--tenant-text)] shrink-0" />

                    <span className="text-sm text-[var(--tenant-muted)]">
                      {tenant.phone}
                    </span>
                  </div>

                  <div className="border-t border-[var(--tenant-border)] pt-2 sm:pt-3 mt-2 sm:mt-3">

                    <div className="flex items-start gap-1.5 sm:gap-3">
                      <FaHome className="text-[var(--tenant-text)] mt-1 shrink-0" />

                      <div className="min-w-0">
                        <p className="text-[8px] sm:text-xs text-[var(--tenant-muted-dark)]">
                          Property
                        </p>

                        <p className="text-[10px] sm:text-sm font-bold text-[var(--tenant-text)] truncate">
                          {tenant.property}
                        </p>

                        <p className="text-[9px] sm:text-xs text-[var(--tenant-muted-dark)] mt-0.5 sm:mt-1">
                          {tenant.room}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTenant(tenant)}
                  className="w-full mt-3 sm:mt-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-[var(--tenant-text)]/60 text-[var(--tenant-text)] font-bold text-[10px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[var(--tenant-text)]/10 hover:border-[var(--tenant-text)] transition-all cursor-pointer"
                >
                  <FaEye />
                  View Details
                </button>

              </div>
            ))}

          </div>
        )}

        {selectedTenant && (
          <div
            className="fixed inset-0 z-[9999] bg-[rgba(247,241,231,0.92)] backdrop-blur-sm flex items-center justify-center px-2 sm:px-4 py-2 sm:py-3"
            onClick={() => setSelectedTenant(null)}
          >

            <div
              className="w-[calc(100vw-1rem)] sm:w-full max-w-lg max-h-[86vh] sm:max-h-[92vh] overflow-y-auto bg-[var(--tenant-surface)] border border-[var(--tenant-text)]/60 rounded-lg sm:rounded-2xl shadow-[0_0_28px_var(--tenant-glow),0_0_18px_var(--tenant-glow)]"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="flex items-center justify-between px-2.5 sm:px-5 py-2.5 sm:py-4 border-b border-[var(--tenant-border)]">

                <div className="flex items-center gap-1.5 sm:gap-3">

                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/40 flex items-center justify-center shrink-0">
                    <FaUser className="text-[var(--tenant-text)] text-xs sm:text-base" />
                  </div>

                  <div>
                    <h2 className="font-extrabold text-xs sm:text-lg text-[var(--tenant-text)]">
                      Tenant Details
                    </h2>

                    <p className="text-[9px] sm:text-xs text-[var(--tenant-muted-dark)]">
                      Complete tenant information
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTenant(null)}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/40 text-[var(--tenant-text)] flex items-center justify-center hover:bg-[var(--tenant-text)] hover:text-[var(--tenant-text)] transition-all cursor-pointer shrink-0"
                >
                  <FaTimes />
                </button>

              </div>

              <div className="px-2.5 sm:px-5 py-2.5 sm:py-4">

                <div className="flex items-center gap-2 sm:gap-4 pb-2.5 sm:pb-4 border-b border-[var(--tenant-border)]">

                  <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[var(--tenant-bg)] border border-[var(--tenant-text)]/40 flex items-center justify-center shrink-0">
                    <FaUser className="text-[var(--tenant-text)] text-base sm:text-2xl" />
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-xl font-extrabold text-[var(--tenant-text)]">
                      {selectedTenant.name}
                    </h3>

                    <span
                      className={`inline-flex mt-1 sm:mt-2 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg border text-[8px] sm:text-xs font-bold ${getStatusStyle(
                        selectedTenant.status
                      )}`}
                    >
                      {selectedTenant.status}
                    </span>
                  </div>

                </div>

                <div className="space-y-1.5 sm:space-y-3 py-2.5 sm:py-4">

                  <div className="flex justify-between gap-2 sm:gap-4 items-start">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Email
                    </span>

                    <span className="text-[9px] sm:text-sm font-semibold text-[var(--tenant-text)] text-right break-all max-w-[65%]">
                      {selectedTenant.email}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4 items-start">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Phone
                    </span>

                    <span className="text-[9px] sm:text-sm font-semibold text-[var(--tenant-text)] text-right break-all max-w-[65%]">
                      {selectedTenant.phone}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4 items-start">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Property
                    </span>

                    <span className="text-[9px] sm:text-sm font-semibold text-[var(--tenant-text)] text-right break-all max-w-[65%]">
                      {selectedTenant.property}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4 items-start">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Room
                    </span>

                    <span className="text-[9px] sm:text-sm font-semibold text-[var(--tenant-text)] text-right break-all max-w-[65%]">
                      {selectedTenant.room}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4 items-start">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Check In
                    </span>

                    <span className="text-[9px] sm:text-sm font-semibold text-[var(--tenant-text)] text-right break-all max-w-[65%]">
                      {selectedTenant.checkIn}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4 items-start">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Check Out
                    </span>

                    <span className="text-[9px] sm:text-sm font-semibold text-[var(--tenant-text)] text-right break-all max-w-[65%]">
                      {selectedTenant.checkOut}
                    </span>
                  </div>

                  <div className="flex justify-between gap-2 sm:gap-4 pt-2 sm:pt-3 border-t border-[var(--tenant-border)]">
                    <span className="text-[9px] sm:text-sm text-[var(--tenant-muted-dark)]">
                      Booking Amount
                    </span>

                    <span className="text-xs sm:text-base font-extrabold text-[var(--tenant-text)]">
                      PKR {selectedTenant.amount.toLocaleString()}
                    </span>
                  </div>

                </div>

              </div>

              <div className="px-2.5 sm:px-5 py-2.5 sm:py-4 border-t border-[var(--tenant-border)] flex justify-end">

                <button
                  type="button"
                  onClick={() => setSelectedTenant(null)}
                  className="px-3.5 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-[var(--tenant-text)] hover:bg-[#6B3A0A] text-[var(--tenant-text)] font-bold text-[10px] sm:text-sm transition-all cursor-pointer"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default POTenants;