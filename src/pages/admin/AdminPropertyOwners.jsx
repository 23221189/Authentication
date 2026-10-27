import React, { useMemo, useState, useEffect } from "react";
import {
  useTheme } from "../../context/ThemeContext.jsx";
import { getAllPropertyOwners,
  updateUserAccountStatus } from "../../api/adminApi";
import {
  FaSearch,
  FaFilter,
  FaUserTie,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFileAlt,
  FaTimes,
  FaCheck,
  FaTimesCircle,
  FaIdCard,
  FaVenusMars,
  FaUniversity,
  FaCalendarAlt,
  FaEnvelope,
} from "react-icons/fa";

function AdminPropertyOwners() {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";
  const accentRgb = isOffWhite ? "139,90,43" : "201,164,92";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [documentOwner, setDocumentOwner] = useState(null);

  const [propertyOwners, setPropertyOwners] = useState([]);
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

  const getImageUrl = (...values) => {
    for (const value of values) {
      if (!value) continue;

      if (typeof value === "string" && value.trim()) {
        return value;
      }

      if (typeof value === "object") {
        const url =
          value.url ||
          value.secure_url ||
          value.path ||
          value.src ||
          value.imageUrl ||
          value.location;

        if (typeof url === "string" && url.trim()) {
          return url;
        }
      }
    }

    return "https://placehold.co/1000x620?text=No+CNIC+Image";
  };

  const formatOwnerForDisplay = (user) => ({
    id: user._id,
    name: user.fullname || user.fullName || "Property Owner",
    email: user.email || "Not provided",
    cnic: user.cnic || user.cnicNumber || "Not provided",
    accountNumber: user.accountNumber || "Not provided",
    gender: capitalize(user.gender) || "Not provided",
    status: user.status === "blocked" ? "Blocked" : "Active",
    registeredDate: formatDate(user.createdAt),
    cnicFront: user.cnicFrontImage || "",
    cnicBack: user.cnicBackImage || "",
  });

  const loadOwners = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getAllPropertyOwners();
      setPropertyOwners(
        (res.data?.owners || []).map(formatOwnerForDisplay)
      );
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not load property owners."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const filteredOwners = useMemo(() => {
    return propertyOwners.filter((owner) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        owner.name.toLowerCase().includes(query) ||
        owner.email.toLowerCase().includes(query) ||
        owner.cnic.includes(searchQuery);

      const matchesStatus =
        statusFilter === "All" || owner.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [propertyOwners, searchQuery, statusFilter]);

  const totalOwners = propertyOwners.length;

  const activeOwners = propertyOwners.filter(
    (o) => o.status === "Active"
  ).length;

  const blockedOwners = propertyOwners.filter(
    (o) => o.status === "Blocked"
  ).length;

  const updateStatus = async (id, status) => {
    try {
      await updateUserAccountStatus(
        id,
        status === "Active" ? "active" : "blocked"
      );

      await loadOwners();
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not update this owner's status."
      );
    } finally {
      setSelectedOwner(null);
      setDocumentOwner(null);
    }
  };

  const getStatusStyle = (status) => {
    return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
  };

  const cardBase =
    "bg-[var(--theme-card)] rounded-2xl border border-[var(--theme-border)] shadow-[0_0_28px_rgba(201,164,92,0.14)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-card)] hover:shadow-[0_12px_40px_rgba(201,164,92,0.25)]";

  return (
    <>
      <div className="w-full text-[var(--theme-text)] min-w-0 text-xs sm:text-sm">

        <div className="mb-4 sm:mb-8">
          <h1 className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Property Owner{" "}
            <span className="text-[var(--theme-accent)]">
              Management
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-8">

          <div
            className={`${cardBase} p-2.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-center sm:text-left hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_34px_rgba(201,164,92,0.24)] hover:-translate-y-1 transition-all duration-300`}
          >
            <div>
              <p className="text-[9px] sm:text-sm font-bold text-[var(--theme-muted)] leading-tight">
                Total Property Owners
              </p>

              <h3 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-[var(--theme-text)]">
                {totalOwners}
              </h3>

              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-[var(--theme-muted-dark)] leading-tight">
                Registered property owners
              </p>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0">
              <FaUsers className="text-[var(--theme-accent)] text-xl" />
            </div>
          </div>

          <div
            className={`${cardBase} p-2.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-center sm:text-left hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_34px_rgba(201,164,92,0.24)] hover:-translate-y-1 transition-all duration-300`}
          >
            <div>
              <p className="text-[9px] sm:text-sm font-bold text-[var(--theme-muted)] leading-tight">
                Active Property Owners
              </p>

              <h3 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-[var(--theme-text)]">
                {activeOwners}
              </h3>

              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-[var(--theme-muted-dark)] leading-tight">
                Approved property owners
              </p>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0">
              <FaCheckCircle className="text-[var(--theme-accent)] text-xl" />
            </div>
          </div>

          <div
            className={`${cardBase} p-5 flex items-center justify-between hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_34px_rgba(201,164,92,0.24)] hover:-translate-y-1 transition-all duration-300 lg:col-span-1`}
          >
            <div>
              <p className="text-[9px] sm:text-sm font-bold text-[var(--theme-muted)] leading-tight">
                Blocked Property Owners
              </p>

              <h3 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-[var(--theme-text)]">
                {blockedOwners}
              </h3>

              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-[var(--theme-muted-dark)] leading-tight">
                Restricted accounts
              </p>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0">
              <FaTimesCircle className="text-[var(--theme-accent)] text-xl" />
            </div>
          </div>

        </div>

        {loading && (
          <div className="mb-6 flex items-center gap-2 sm:gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] px-4 py-3 text-sm font-medium text-[var(--theme-muted)]">
            <div className="animate-spin w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full"></div>
            Loading owners...
          </div>
        )}

        {loadError && (
          <div className="mb-6 rounded-xl border border-[var(--theme-accent)]/20 bg-[var(--theme-accent)]/10 px-4 py-3 text-sm font-medium text-[var(--theme-accent)]">
            {loadError}
          </div>
        )}

        <div className={`${cardBase} p-2 sm:p-4 mb-4 sm:mb-6`}>

          <div className="flex flex-col gap-2.5 sm:gap-3 xl:flex-row xl:items-center xl:justify-between">

            <div className="relative w-full xl:max-w-md">

              <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[var(--theme-muted-dark)] text-xs sm:text-base" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search property owner by name, email or CNIC..."
                className="w-full rounded-lg sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm font-medium text-[var(--theme-muted-light)] outline-none transition-all placeholder:text-[var(--theme-muted-dark)] focus:border-[var(--theme-accent)] focus:bg-[var(--theme-card)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
              />

            </div>

            <div className="relative w-full sm:w-48 shrink-0">

              <button
                type="button"
                onClick={() =>
                  setStatusOpen((prev) => !prev)
                }
                className={`w-full rounded-lg border bg-[var(--theme-card)] py-2 px-2.5 sm:py-2.5 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center justify-between gap-1.5 sm:gap-2 cursor-pointer transition-all ${
                  statusOpen
                    ? "border-[var(--theme-accent)] ring-2 ring-[var(--theme-accent)]/20"
                    : "border-[var(--theme-border)]"
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">

                  <FaFilter className="text-[9px] sm:text-[10px] text-[var(--theme-accent)]" />

                  <span className="text-[var(--theme-accent)]">
                    {statusFilter === "All"
                      ? "All Status"
                      : statusFilter}
                  </span>

                </div>

                <span
                  className={`text-[var(--theme-accent)] text-lg leading-none transition-transform duration-200 ${
                    statusOpen ? "rotate-180" : ""
                  }`}
                >
                  ⌄
                </span>

              </button>

              {statusOpen && (
                <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_10px_28px_rgba(201,164,92,0.20)]">

                  {[
                    {
                      value: "All",
                      label: "All Status",
                    },
                    {
                      value: "Active",
                      label: "Active",
                    },
                    {
                      value: "Blocked",
                      label: "Blocked",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setStatusOpen(false);
                      }}
                      className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer ${
                        statusFilter === option.value
                          ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)]"
                          : "text-[var(--theme-text)] hover:bg-[var(--theme-accent)]/10 hover:text-[var(--theme-accent)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                </div>
              )}

            </div>

          </div>
        </div>

        <div className={`${cardBase} overflow-hidden`}>

          <div className="flex flex-col gap-2 border-b border-[var(--theme-border)] bg-[var(--theme-card)]/50 p-3 sm:p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="text-sm sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                Property Owner Registration Requests
              </h3>

              <p className="mt-0.5 text-[10px] sm:text-sm text-[var(--theme-muted)] font-medium">
                Review and manage property owner registrations
              </p>

            </div>

            <div className="w-fit rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold">
              {filteredOwners.length} Records
            </div>

          </div>

          {filteredOwners.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--theme-accent)]/10 text-2xl text-[var(--theme-accent)]">
                <FaUsers />
              </div>

              <h4 className="mt-5 text-base font-extrabold text-[var(--theme-text)]">
                No Property Owners Found
              </h4>

              <p className="mt-2 text-sm text-[var(--theme-muted-dark)] font-medium">
                No property owner matches your current search or filter.
              </p>

            </div>

          ) : (
            <>
              <div className="md:hidden p-2.5 space-y-2.5">

                {filteredOwners.map((owner) => (

                  <div
                    key={owner.id}
                    className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-3 shadow-[0_0_18px_rgba(201,164,92,0.10)]"
                  >

                    <div className="flex items-center justify-between gap-2">

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 text-xs font-extrabold text-[var(--theme-accent)]">
                          {owner.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-[var(--theme-text)]">
                            {owner.name}
                          </p>

                          <p className="text-[9px] text-[var(--theme-muted-dark)]">
                            Property Owner
                          </p>
                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-bold ${getStatusStyle(
                          owner.status
                        )}`}
                      >
                        {owner.status}
                      </span>

                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-1.5">

                      <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">
                          Email
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-semibold text-[var(--theme-muted-light)]">
                          {owner.email}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">
                          CNIC
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-semibold text-[var(--theme-muted-light)]">
                          {owner.cnic}
                        </p>
                      </div>

                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">

                      <p className="text-[9px] text-[var(--theme-muted-dark)]">
                        Registered:{" "}
                        <span className="text-[var(--theme-muted)]">
                          {owner.registeredDate}
                        </span>
                      </p>

                      <button
                        onClick={() => setSelectedOwner(owner)}
                        title="View Details"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--theme-accent)] px-2.5 py-1.5 text-[9px] font-bold text-[var(--theme-accent)] shadow-[0_0_12px_rgba(201,164,92,0.10)] cursor-pointer"
                      >
                        <FaFileAlt className="text-[9px]" />
                        View Details
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full min-w-225">

                  <thead>
                    <tr className="border-b border-[var(--theme-border)] bg-[var(--theme-card)]">

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        Property Owner
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        CNIC
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        Registered
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[var(--theme-border)]">

                    {filteredOwners.map((owner) => (

                      <tr
                        key={owner.id}
                        className="transition-all duration-300 hover:bg-[var(--theme-card)] hover:shadow-[inset_4px_0_0_rgba(201,164,92,0.55)]"
                      >

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2 sm:gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 text-base font-extrabold text-[var(--theme-accent)]">
                              {owner.name.charAt(0)}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[var(--theme-text)]">
                                {owner.name}
                              </p>

                              <p className="mt-1 text-xs text-[var(--theme-muted-dark)] font-medium">
                                Property Owner
                              </p>
                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <FaEnvelope className="text-xs text-[var(--theme-accent)]" />

                            <p className="text-sm font-semibold text-[var(--theme-muted-light)]">
                              {owner.email}
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <FaIdCard className="text-xs text-[var(--theme-accent)]" />

                            <p className="text-sm font-semibold text-[var(--theme-muted-light)]">
                              {owner.cnic}
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                              owner.status
                            )}`}
                          >
                            {owner.status}
                          </span>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2 text-sm text-[var(--theme-muted)] font-medium">

                            <FaCalendarAlt className="text-[var(--theme-muted-dark)]" />

                            {owner.registeredDate}

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center justify-end">

                            <button
                              onClick={() =>
                                setSelectedOwner(owner)
                              }
                              title="View Details"
                              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--theme-accent)] bg-[var(--theme-card)] px-4 py-2.5 text-xs font-bold text-[var(--theme-accent)] transition-all duration-300 hover:bg-[var(--theme-accent)]/10 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,164,92,0.18)] cursor-pointer"
                            >
                              <FaFileAlt />
                              View Details
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            </>
          )}

        </div>

      </div>

      {selectedOwner && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-hidden" style={{ backgroundColor: isOffWhite ? "rgba(255,253,248,0.82)" : "rgba(5,5,5,0.82)" }}>

          <div className="max-h-[88vh] w-full max-w-[360px] sm:max-w-2xl overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)] rounded-2xl bg-[var(--theme-surface)] shadow-2xl border border-[var(--theme-border)]">

            <div className="flex items-center justify-between bg-linear-to-r from-[#c9a45c] via-[#9f7f42] to-[#dfbf7b] px-3.5 py-3.5 sm:px-6 sm:py-5 text-[var(--theme-button-text)] sticky top-0 z-10">

              <div>

                <h2 className="text-sm sm:text-xl font-extrabold tracking-tight">
                  Property Owner Details
                </h2>

                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-[var(--theme-button-text)]/70 font-medium">
                  Complete registration information
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedOwner(null)
                }
                className="rounded-lg bg-[var(--theme-surface)]/20 p-2 transition-colors hover:bg-[var(--theme-surface)]/30 cursor-pointer"
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-3 sm:p-6">

              <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">

                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--theme-accent)] text-lg sm:text-2xl font-extrabold text-[var(--theme-button-text)] shadow-[0_0_26px_rgba(201,164,92,0.28)]">
                  {selectedOwner.name.charAt(0)}
                </div>

                <div>

                  <h3 className="text-sm sm:text-xl font-extrabold text-[var(--theme-text)]">
                    {selectedOwner.name}
                  </h3>

                  <span
                    className={`mt-1 inline-flex rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-bold ${getStatusStyle(
                      selectedOwner.status
                    )}`}
                  >
                    {selectedOwner.status}
                  </span>

                </div>

              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)]">

                  <p className="mb-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Full Name
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[var(--theme-text)]">
                    {selectedOwner.name}
                  </p>

                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)]">

                  <p className="mb-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Email Address
                  </p>

                  <p className="break-all text-sm sm:text-base font-bold text-[var(--theme-text)]">
                    {selectedOwner.email}
                  </p>

                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)]">

                  <p className="mb-1 flex items-center gap-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    CNIC
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[var(--theme-text)]">
                    {selectedOwner.cnic}
                  </p>

                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)]">

                  <p className="mb-1 flex items-center gap-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Account Number
                  </p>

                  <p className="break-all text-sm sm:text-base font-bold text-[var(--theme-text)]">
                    {selectedOwner.accountNumber}
                  </p>

                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)]">

                  <p className="mb-1 flex items-center gap-2 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Gender
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[var(--theme-text)]">
                    {selectedOwner.gender}
                  </p>

                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--theme-accent)]/30 hover:shadow-[0_0_24px_rgba(201,164,92,0.16)]">

                  <p className="mb-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Registered Date
                  </p>

                  <p className="text-sm sm:text-base font-bold text-[var(--theme-text)]">
                    {selectedOwner.registeredDate}
                  </p>

                </div>

              </div>

              <button
                onClick={() => {
                  setDocumentOwner(selectedOwner);
                  setSelectedOwner(null);
                }}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] px-3 font-bold transition-all shadow-[0_0_26px_rgba(201,164,92,0.28)] active:scale-95 cursor-pointer"
              >
                <FaFileAlt />
                View Documents
              </button>

              {selectedOwner.status === "Active" ? (

                <div className="mt-4 sm:mt-5">

                  <button
                    onClick={() =>
                      updateStatus(
                        selectedOwner.id,
                        "Blocked"
                      )
                    }
                    className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--theme-accent)]/40 text-[var(--theme-accent)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-300 hover:bg-[var(--theme-accent)]/10 cursor-pointer"
                  >
                    <FaTimesCircle />
                    Block This Owner
                  </button>

                </div>

              ) : (

                <div className="mt-4 sm:mt-5">

                  <button
                    onClick={() =>
                      updateStatus(
                        selectedOwner.id,
                        "Active"
                      )
                    }
                    className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--theme-button-text)] transition-all duration-300 cursor-pointer"
                  >
                    <FaCheck />
                    Unblock This Owner
                  </button>

                </div>

              )}

              <button
                onClick={() =>
                  setSelectedOwner(null)
                }
                className="mt-2.5 w-full flex items-center justify-center rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-card)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--theme-muted-light)] transition-all duration-300 hover:bg-[var(--theme-accent)]/10 hover:border-[var(--theme-accent)]/40 hover:text-[var(--theme-accent)] cursor-pointer"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {documentOwner && (

        <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-hidden" style={{ backgroundColor: isOffWhite ? "rgba(255,253,248,0.82)" : "rgba(5,5,5,0.82)" }}>

          <div className="max-h-[88vh] w-full max-w-[360px] sm:max-w-5xl overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[var(--theme-surface)] [&::-webkit-scrollbar-thumb]:bg-[#3a3328] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)] rounded-2xl bg-[var(--theme-surface)] shadow-2xl border border-[var(--theme-border)]">

            <div className="flex items-center justify-between bg-linear-to-r from-[#c9a45c] via-[#9f7f42] to-[#dfbf7b] px-3.5 py-3.5 sm:px-6 sm:py-5 text-[var(--theme-button-text)] sticky top-0 z-10">

              <div>

                <h2 className="text-sm sm:text-xl font-extrabold tracking-tight">
                  Verification Documents
                </h2>

                <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-[var(--theme-button-text)]/70 font-medium">
                  Review submitted CNIC documents
                </p>

              </div>

              <button
                onClick={() =>
                  setDocumentOwner(null)
                }
                className="rounded-lg bg-[var(--theme-surface)]/20 p-2 transition-colors hover:bg-[var(--theme-surface)]/30 cursor-pointer"
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-3 sm:p-6">

              <div className="grid grid-cols-2 gap-2.5 sm:gap-5">

                <div>

                  <div className="mb-2 flex items-center justify-between gap-1">

                    <h3 className="text-xs sm:text-base font-extrabold text-[var(--theme-text)]">
                      CNIC Front
                    </h3>

                    <span className="rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-2 py-0.5 text-[8px] sm:text-xs font-bold">
                      Front
                    </span>

                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)]">

                    <img
                      src={documentOwner.cnicFront}
                      alt="CNIC Front"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/1000x620?text=No+CNIC+Image";
                      }}
                      className="h-28 sm:h-64 w-full object-contain bg-[var(--theme-surface)]"
                    />

                  </div>

                </div>

                <div>

                  <div className="mb-2 flex items-center justify-between gap-1">

                    <h3 className="text-xs sm:text-base font-extrabold text-[var(--theme-text)]">
                      CNIC Back
                    </h3>

                    <span className="rounded-full bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] border border-[var(--theme-accent)]/30 px-2 py-0.5 text-[8px] sm:text-xs font-bold">
                      Back
                    </span>

                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)]">

                    <img
                      src={documentOwner.cnicBack}
                      alt="CNIC Back"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://placehold.co/1000x620?text=No+CNIC+Image";
                      }}
                      className="h-28 sm:h-64 w-full object-contain bg-[var(--theme-surface)]"
                    />

                  </div>

                </div>

              </div>

              <button
                onClick={() => {
                  setDocumentOwner(null);
                  setSelectedOwner(documentOwner);
                }}
                className="mt-3 sm:mt-5 w-full rounded-xl border-2 border-[var(--theme-border)] py-2.5 sm:py-3 text-sm sm:text-base font-bold text-[var(--theme-muted-light)] transition-colors hover:bg-[var(--theme-surface)] cursor-pointer"
              >
                Back to Details
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default AdminPropertyOwners;