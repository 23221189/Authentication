import React, { useMemo, useEffect, useState } from "react";
import { getAllTenants, updateUserAccountStatus } from "../../api/adminApi";
import { useTheme } from "../../context/ThemeContext.jsx";
import {
  FaSearch,
  FaUsers,
  FaTimes,
  FaFilter,
  FaFileAlt,
  FaCheck,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaVenusMars,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";

function AdminTenants() {
  const { theme } = useTheme();
  const isOffWhite = theme === "offwhite";

  const themeVars = isOffWhite
    ? {
        "--theme-bg": "#F7F1E7",
        "--theme-surface": "#FFFFFF",
        "--theme-card": "#FFFFFF",
        "--theme-text": "#552C06",
        "--theme-muted": "#765337",
        "--theme-muted-light": "#6F4B2D",
        "--theme-muted-dark": "#8A6A4D",
        "--theme-border": "#D8B995",
        "--theme-accent": "#552C06",
        "--theme-accent-hover": "#6B3A0A",
        "--theme-button-text": "#FFFFFF",
        "--theme-accent-rgb": "85,44,6",
      }
    : {};
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState("");
  const [loadError, setLoadError] = useState("");

  const capitalize = (value) =>
    value ? value.charAt(0).toLowerCase() + value.slice(1) : value;

  const formatTForDisplay = (user) => ({
    id: user._id,
    name: user.fullname || "Tenant",
    email: user.email || "Not provided",
    cnic: user.cnic || "Not provided",
    gender: capitalize(user.gender) || "Not provided",
    status: user.status === "blocked" ? "Blocked" : "Active",
    createdAt: user.createdAt,
    cnicFront:
      user.cnicFrontImage ||
      user.cnicFront ||
      user.cnicImage?.front ||
      user.cnicImage?.cnicFront ||
      "",
    cnicBack:
      user.cnicBackImage ||
      user.cnicBack ||
      user.cnicImage?.back ||
      user.cnicImage?.cnicBack ||
      "",
  });

  const loadTenants = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const res = await getAllTenants();
      setTenants((res.data?.tenants || []).map(formatTForDisplay));
    } catch (err) {
      setLoadError(
        err.response?.data?.message || "Could not load tenants."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [documentsTenant, setDocumentsTenant] = useState(null);

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        tenant.name.toLowerCase().includes(search) ||
        tenant.email.toLowerCase().includes(search) ||
        tenant.cnic.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        tenant.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [tenants, searchQuery, statusFilter]);

  const totalTenants = tenants.length;

  const activeTenants = tenants.filter(
    (t) => t.status === "Active"
  ).length;

  const blockedTenants = tenants.filter(
    (t) => t.status === "Blocked"
  ).length;

  const handleAccept = async (id) => {
    try {
      await updateUserAccountStatus(id, "active");
      await loadTenants();
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not activate this tenant."
      );
    } finally {
      setSelectedTenant(null);
      setDocumentsTenant(null);
    }
  };

  const handleReject = async (id) => {
    try {
      await updateUserAccountStatus(id, "blocked");
      await loadTenants();
    } catch (err) {
      setLoadError(
        err.response?.data?.message ||
          "Could not block this tenant."
      );
    } finally {
      setSelectedTenant(null);
      setDocumentsTenant(null);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    if (status === "Blocked") {
      return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
    }

    return "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const cardBase =
    "bg-[var(--theme-bg)] rounded-2xl border border-[var(--theme-border)] shadow-[0_0_28px_rgba(85,44,6,0.14)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-bg)] hover:shadow-[0_12px_40px_rgba(85,44,6,0.25)]";

  return (
    <>
      <div className="w-full text-[var(--theme-text)] min-w-0 text-xs sm:text-sm" style={themeVars}>

        <div className="mb-4 sm:mb-8">
          <h1 className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Tenant{" "}
            <span className="text-[var(--theme-accent)]">
              Management
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-8">

          <div
            className={`${cardBase} p-2.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-center sm:text-left hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_34px_rgba(85,44,6,0.24)] hover:-translate-y-1 transition-all duration-300`}
          >
            <div>
              <p className="text-[9px] sm:text-sm font-bold text-[var(--theme-muted)] leading-tight">
                Total Tenants
              </p>

              <h3 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-[var(--theme-text)]">
                {totalTenants}
              </h3>

              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-[var(--theme-muted-dark)] leading-tight">
                Registered tenants
              </p>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0">
              <FaUsers className="text-[var(--theme-accent)] text-xl" />
            </div>
          </div>

          <div
            className={`${cardBase} p-2.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 text-center sm:text-left hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_34px_rgba(85,44,6,0.24)] hover:-translate-y-1 transition-all duration-300`}
          >
            <div>
              <p className="text-[9px] sm:text-sm font-bold text-[var(--theme-muted)] leading-tight">
                Active Tenants
              </p>

              <h3 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-[var(--theme-text)]">
                {activeTenants}
              </h3>

              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-[var(--theme-muted-dark)] leading-tight">
                Approved tenants
              </p>
            </div>

            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--theme-accent)]/10 flex items-center justify-center shrink-0">
              <FaCheck className="text-[var(--theme-accent)] text-xl" />
            </div>
          </div>

          <div
            className={`${cardBase} p-5 flex items-center justify-between hover:border-[var(--theme-accent)]/40 hover:shadow-[0_10px_34px_rgba(85,44,6,0.24)] hover:-translate-y-1 transition-all duration-300 lg:col-span-1`}
          >
            <div>
              <p className="text-[9px] sm:text-sm font-bold text-[var(--theme-muted)] leading-tight">
                Blocked Tenants
              </p>

              <h3 className="mt-1 sm:mt-2 text-xl sm:text-3xl font-extrabold text-[var(--theme-text)]">
                {blockedTenants}
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
          <div className="mb-6 flex items-center gap-2 sm:gap-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] px-4 py-3 text-sm font-medium text-[var(--theme-muted)]">
            <div className="animate-spin w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full"></div>
            Loading tenants...
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
                placeholder="Search tenant by name, email or CNIC..."
                className="w-full rounded-lg sm:rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] py-2.5 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm font-medium text-[var(--theme-muted-light)] outline-none transition-all placeholder:text-[var(--theme-muted-dark)] focus:border-[var(--theme-accent)] focus:bg-[var(--theme-bg)] focus:ring-2 focus:ring-[var(--theme-accent)]/20"
              />

            </div>

            <div className="relative w-full sm:w-48 shrink-0">

              <button
                type="button"
                onClick={() =>
                  setStatusOpen((prev) => !prev)
                }
                className={`w-full rounded-lg border bg-[var(--theme-bg)] py-2 px-2.5 sm:py-2.5 sm:px-3 text-[10px] sm:text-xs font-semibold flex items-center justify-between gap-1.5 sm:gap-2 cursor-pointer transition-all ${
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
                <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-lg border border-[var(--theme-border)] bg-[var(--theme-bg)] shadow-[0_10px_28px_rgba(85,44,6,0.20)]">

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

          <div className="flex flex-col gap-2 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/50 p-3 sm:p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h3 className="text-sm sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                Tenant Registration Requests
              </h3>

              <p className="mt-0.5 text-[10px] sm:text-sm text-[var(--theme-muted)] font-medium">
                Review and manage tenant registrations
              </p>

            </div>

            <div className="w-fit rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold">
              {filteredTenants.length} Records
            </div>

          </div>

          {filteredTenants.length === 0 ? (

            <div className="px-5 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--theme-accent)]/10 text-2xl text-[var(--theme-accent)]">
                <FaUsers />
              </div>

              <h4 className="mt-5 text-base font-extrabold text-[var(--theme-text)]">
                No Tenants Found
              </h4>

              <p className="mt-2 text-sm text-[var(--theme-muted-dark)] font-medium">
                No tenant matches your current search or filter.
              </p>

            </div>

          ) : (
            <>
              <div className="md:hidden p-2.5 space-y-2.5">

                {filteredTenants.map((tenant) => (

                  <div
                    key={tenant.id}
                    className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3 shadow-[0_0_18px_rgba(85,44,6,0.10)]"
                  >

                    <div className="flex items-center justify-between gap-2">

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 text-xs font-extrabold text-[var(--theme-accent)]">
                          {tenant.name.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-[var(--theme-text)]">
                            {tenant.name}
                          </p>

                          <p className="text-[9px] text-[var(--theme-muted-dark)]">
                            Tenant
                          </p>
                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-bold ${getStatusStyle(
                          tenant.status
                        )}`}
                      >
                        {tenant.status}
                      </span>

                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-1.5">

                      <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">
                          Email
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-semibold text-[var(--theme-muted-light)]">
                          {tenant.email}
                        </p>
                      </div>

                      <div className="rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">
                          CNIC
                        </p>

                        <p className="mt-0.5 truncate text-[9px] font-semibold text-[var(--theme-muted-light)]">
                          {tenant.cnic}
                        </p>
                      </div>

                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">

                      <p className="text-[9px] text-[var(--theme-muted-dark)]">
                        Registered:{" "}
                        <span className="text-[var(--theme-muted)]">
                          {formatDate(tenant.createdAt)}
                        </span>
                      </p>

                      <button
                        onClick={() => setSelectedTenant(tenant)}
                        title="View Details"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--theme-accent)] px-2.5 py-1.5 text-[9px] font-bold text-[var(--theme-accent)] shadow-[0_0_12px_rgba(85,44,6,0.10)] cursor-pointer"
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
                    <tr className="border-b border-[var(--theme-border)] bg-[var(--theme-bg)]">

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">
                        Tenant
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

                    {filteredTenants.map((tenant) => (

                      <tr
                        key={tenant.id}
                        className="transition-all duration-300 hover:bg-[var(--theme-bg)] hover:shadow-[inset_4px_0_0_rgba(201,164,92,0.55)]"
                      >

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2 sm:gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 text-base font-extrabold text-[var(--theme-accent)]">
                              {tenant.name.charAt(0)}
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[var(--theme-text)]">
                                {tenant.name}
                              </p>

                              <p className="mt-1 text-xs text-[var(--theme-muted-dark)] font-medium">
                                Tenant
                              </p>
                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <FaEnvelope className="text-xs text-[var(--theme-accent)]" />

                            <p className="text-sm font-semibold text-[var(--theme-muted-light)]">
                              {tenant.email}
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2">

                            <FaIdCard className="text-xs text-[var(--theme-accent)]" />

                            <p className="text-sm font-semibold text-[var(--theme-muted-light)]">
                              {tenant.cnic}
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <span
                            className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                              tenant.status
                            )}`}
                          >
                            {tenant.status}
                          </span>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center gap-2 text-sm text-[var(--theme-muted)] font-medium">

                            <FaCalendarAlt className="text-[var(--theme-muted-dark)]" />

                            {formatDate(tenant.createdAt)}

                          </div>

                        </td>

                        <td className="px-5 py-5">

                          <div className="flex items-center justify-end">

                            <button
                              onClick={() =>
                                setSelectedTenant(tenant)
                              }
                              title="View Details"
                              className="inline-flex items-center gap-2 rounded-xl border-2 border-[var(--theme-accent)] bg-[var(--theme-bg)] px-4 py-2.5 text-xs font-bold text-[var(--theme-accent)] transition-all duration-300 hover:bg-[var(--theme-accent)]/10 hover:shadow-[0_4px_12px_rgba(85,44,6,0.12)] cursor-pointer"
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

      {selectedTenant && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--theme-overlay)] p-2 sm:p-4 backdrop-blur-md">
          <div className="relative max-h-[82vh] w-[92%] max-w-md overflow-y-auto rounded-2xl sm:rounded-3xl bg-[var(--theme-bg)] shadow-[0_14px_45px_rgba(85,44,6,0.20)] border border-[var(--theme-border)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[var(--theme-bg)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">

            <div
              className="sticky top-0 z-10 flex items-center justify-between border-b border-[#a56d37] bg-linear-to-r from-[#8b5a2b] via-[#9a642f] to-[#8b5a2b] px-4 py-3 sm:px-5 sm:py-4"
            >
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Tenant Request Details
                </h3>
                <p className="mt-0.5 text-[10px] sm:text-xs text-white/85 font-medium">
                  Complete registration information
                </p>
              </div>

              <button
                onClick={() => setSelectedTenant(null)}
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/15 text-white transition-all hover:bg-white/25 hover:scale-105 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-3 rounded-xl sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3 sm:p-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-accent)] text-lg sm:text-xl font-extrabold text-[var(--theme-button-text)] shadow-[0_0_20px_rgba(201,164,92,0.18)]">
                  {selectedTenant.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-base sm:text-lg font-extrabold text-[var(--theme-text)]">
                    {selectedTenant.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-[var(--theme-muted)] font-medium">
                    Tenant Application
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3">
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Full Name
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--theme-text)] break-words">
                    {selectedTenant.name}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3">
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Email Address
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--theme-text)] break-all">
                    {selectedTenant.email}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3">
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    CNIC
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--theme-text)] break-words">
                    {selectedTenant.cnic}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3">
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Gender
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--theme-text)]">
                    {selectedTenant.gender}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3">
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                    Registered Date
                  </p>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--theme-text)]">
                    {formatDate(selectedTenant.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg)] p-3">
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                  Current Status
                </p>
                <span className={`mt-1.5 inline-flex rounded-md px-2.5 py-1 text-[10px] sm:text-xs font-bold ${getStatusStyle(selectedTenant.status)}`}>
                  {selectedTenant.status}
                </span>
              </div>

              <button
                onClick={() => {
                  setDocumentsTenant(selectedTenant);
                  setSelectedTenant(null);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(85,44,6,0.22)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <FaFileAlt />
                View Documents
              </button>

              {selectedTenant.status === "Active" ? (
                <button
                  onClick={() => handleReject(selectedTenant.id)}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--theme-accent)]/40 text-[var(--theme-accent)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-300 hover:bg-[var(--theme-accent)]/10 cursor-pointer"
                >
                  <FaTimesCircle />
                  Block This Tenant
                </button>
              ) : (
                <button
                  onClick={() => handleAccept(selectedTenant.id)}
                  className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--theme-button-text)] transition-all duration-300 cursor-pointer"
                >
                  <FaCheck />
                  Unblock This Tenant
                </button>
              )}

              <button
                onClick={() => setSelectedTenant(null)}
                className="mt-2.5 w-full flex items-center justify-center rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-bg)] py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--theme-muted-light)] transition-all duration-300 hover:bg-[var(--theme-accent)]/10 hover:border-[var(--theme-accent)]/40 hover:text-[var(--theme-accent)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {documentsTenant && (

        <div className="fixed inset-0 z-70 flex items-center justify-center bg-[var(--theme-overlay)] p-2 sm:p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-[360px] sm:max-w-4xl overflow-y-auto rounded-xl sm:rounded-3xl bg-[var(--theme-bg)] shadow-[0_14px_45px_rgba(85,44,6,0.20)] border border-[var(--theme-border)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[var(--theme-bg)] [&::-webkit-scrollbar-thumb]:bg-[var(--theme-border)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-[var(--theme-accent)]">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#8b5a2b] bg-linear-to-r from-[#8b5a2b] via-[#9a642f] to-[#8b5a2b] px-3 py-2.5 sm:px-7 sm:py-5">

              <div className="flex items-center gap-2">

                <button
                  onClick={() => {
                    setDocumentsTenant(null);
                    setSelectedTenant(documentsTenant);
                  }}
                  className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/15 text-white transition-colors hover:bg-white/25 hover:text-white cursor-pointer"
                  title="Back to Details"
                >
                  <FaArrowLeft className="text-[10px] sm:text-base" />
                </button>

                <div>

                  <h3 className="text-xs sm:text-xl font-extrabold text-white tracking-tight">
                    Tenant Documents
                  </h3>

                  <p className="mt-0.5 text-[8px] sm:text-sm text-white/85 font-medium">
                    CNIC verification documents
                  </p>

                </div>

              </div>

              <button
                onClick={() => setDocumentsTenant(null)}
                className="flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-white/15 text-white transition-colors hover:bg-white/25 hover:text-white cursor-pointer"
              >
                <FaTimes className="text-[10px] sm:text-base" />
              </button>

            </div>

            <div className="p-2.5 sm:p-7">

              <div className="grid grid-cols-1 gap-2.5 sm:gap-5 md:grid-cols-2">

                <div className="overflow-hidden rounded-lg sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] shadow-[0_0_18px_rgba(85,44,6,0.10)]">

                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/50 px-2.5 py-2 sm:px-5 sm:py-4">

                    <div>

                      <h5 className="text-[10px] sm:text-sm font-extrabold text-[var(--theme-text)]">
                        CNIC Front
                      </h5>

                      <p className="mt-0.5 text-[7px] sm:text-xs text-[var(--theme-muted)] font-medium">
                        Front side of identity card
                      </p>

                    </div>

                    <FaImage className="text-sm sm:text-lg text-[var(--theme-accent)]" />

                  </div>

                  <div className="flex h-36 sm:h-72 items-center justify-center bg-[var(--theme-bg)] p-2 sm:p-4">

                    {documentsTenant.cnicFront ? (

                      <img
                        src={documentsTenant.cnicFront}
                        alt="CNIC Front"
                        className="h-full w-full rounded-lg sm:rounded-xl object-contain"
                      />

                    ) : (

                      <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--theme-bg)] text-lg sm:text-2xl text-[var(--theme-muted-dark)] shadow-[0_0_18px_rgba(85,44,6,0.10)] border border-[var(--theme-border)]">
                          <FaImage />
                        </div>

                        <p className="mt-2 sm:mt-4 text-[9px] sm:text-sm font-bold text-[var(--theme-muted-dark)]">
                          CNIC Front Image
                        </p>

                        <p className="mt-0.5 text-[7px] sm:text-xs text-[var(--theme-muted-dark)] font-medium">
                          Image will appear here
                        </p>

                      </div>

                    )}

                  </div>

                </div>

                <div className="overflow-hidden rounded-lg sm:rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] shadow-[0_0_18px_rgba(85,44,6,0.10)]">

                  <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-bg)]/50 px-2.5 py-2 sm:px-5 sm:py-4">

                    <div>

                      <h5 className="text-[10px] sm:text-sm font-extrabold text-[var(--theme-text)]">
                        CNIC Back
                      </h5>

                      <p className="mt-0.5 text-[7px] sm:text-xs text-[var(--theme-muted)] font-medium">
                        Back side of identity card
                      </p>

                    </div>

                    <FaImage className="text-sm sm:text-lg text-[var(--theme-accent)]" />

                  </div>

                  <div className="flex h-36 sm:h-72 items-center justify-center bg-[var(--theme-bg)] p-2 sm:p-4">

                    {documentsTenant.cnicBack ? (

                      <img
                        src={documentsTenant.cnicBack}
                        alt="CNIC Back"
                        className="h-full w-full rounded-lg sm:rounded-xl object-contain"
                      />

                    ) : (

                      <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--theme-bg)] text-lg sm:text-2xl text-[var(--theme-muted-dark)] shadow-[0_0_18px_rgba(85,44,6,0.10)] border border-[var(--theme-border)]">
                          <FaImage />
                        </div>

                        <p className="mt-2 sm:mt-4 text-[9px] sm:text-sm font-bold text-[var(--theme-muted-dark)]">
                          CNIC Back Image
                        </p>

                        <p className="mt-0.5 text-[7px] sm:text-xs text-[var(--theme-muted-dark)] font-medium">
                          Image will appear here
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>
              <button
                onClick={() => setDocumentsTenant(null)}
                className="mt-2 sm:mt-3 w-full rounded-lg sm:rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-bg)] py-2 sm:py-3 text-[10px] sm:text-sm font-bold text-[var(--theme-muted-light)] transition-colors hover:bg-[var(--theme-bg)] cursor-pointer"
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

export default AdminTenants;