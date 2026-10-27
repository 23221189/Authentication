import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { getDashboardSummary } from "../../api/dashboardApi";
import { getMyBookings } from "../../api/bookingApi";
import {
  getAdminProperties,
} from "../../api/adminApi";
import {
  FaUsers,
  FaBuilding,
  FaClipboardCheck,
  FaCalendarAlt,
  FaCreditCard,
  FaArrowUp,
  FaEye,
  FaClock,
  FaUserTie,
  FaChartLine,
  FaMapMarkerAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isOffWhite = theme === "offwhite";
  const accentRgb = isOffWhite ? "139,90,43" : "201,164,92";

  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    pendingVerifications: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const statusMap = {
    pending: "Pending",
    assigned: "Pending",
    under_admin_review: "Pending",
    verified: "Approved",
    published: "Approved",
    approved: "Approved",
    rejected: "Rejected",
    inactive: "Inactive",
  };

  const formatPropertyForDisplay = (property) => {
    const rawStatus = String(property?.status || "")
      .trim()
      .toLowerCase();

    return {
      ...property,
      propertyName:
        property?.title ||
        property?.propertyName ||
        property?.name ||
        "Property",
      propertyType:
        property?.propertyType ||
        property?.type ||
        property?.property?.propertyType ||
        property?.property?.type ||
        "",
      location:
        [
          property?.address?.area,
          property?.address?.city,
          property?.address?.province,
        ]
          .filter(Boolean)
          .join(", ") ||
        property?.location ||
        property?.city ||
        "Location not available",
      ownerName:
        property?.ownerName ||
        property?.owner?.fullname ||
        property?.owner?.fullName ||
        property?.owner?.name ||
        property?.owner?.email ||
        "Property Owner",
      status: statusMap[rawStatus] || "Pending",
    };
  };

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const [summaryRes, bookingsRes, propertiesRes] =
          await Promise.all([
            getDashboardSummary(),
            getMyBookings().catch(() => null),
            getAdminProperties(),
          ]);

        if (!isMounted) return;

        const summary = summaryRes.data;

        setStats({
          totalUsers: summary?.stats?.totalUsers || 0,
          totalProperties: summary?.stats?.totalProperties || 0,
          pendingVerifications:
            summary?.stats?.pendingPropertyVerifications || 0,
          totalBookings: summary?.stats?.totalBookings || 0,
          totalRevenue: 0,
        });

        setUsers(summary?.recentUsers || []);
        setBookings(bookingsRes?.data?.bookings || []);

        const allProperties = propertiesRes?.data?.properties || [];

        const verificationStatuses = new Set([
          "pending",
          "assigned",
          "under_admin_review",
        ]);

        const verificationProperties = allProperties.filter((property, index, array) => {
          const propertyId = String(property?._id || property?.id || "");
          const status = String(property?.status || "")
            .trim()
            .toLowerCase();

          if (!propertyId || !verificationStatuses.has(status)) return false;

          return (
            index ===
            array.findIndex(
              (item) => String(item?._id || item?.id || "") === propertyId
            )
          );
        });

        setVerificationRequests(
          verificationProperties.map(formatPropertyForDisplay)
        );
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err.response?.data?.message ||
            "Could not load dashboard data."
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const monthlyRevenue = useMemo(
    () => [
      { month: "Jan", amount: 0 },
      { month: "Feb", amount: 0 },
      { month: "Mar", amount: 0 },
      { month: "Apr", amount: 0 },
      { month: "May", amount: 0 },
      { month: "Jun", amount: 0 },
      { month: "Jul", amount: 0 },
      { month: "Aug", amount: 0 },
      { month: "Sep", amount: 0 },
      { month: "Oct", amount: 0 },
      { month: "Nov", amount: 0 },
      { month: "Dec", amount: 0 },
    ],
    []
  );

  const maxRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.amount),
    1
  );

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  const getId = (item) => item?.id || item?._id;

  const getPropertyName = (item) =>
    item?.propertyName ||
    item?.title ||
    item?.name ||
    item?.property?.propertyName ||
    item?.property?.name ||
    "Property";

  const getOwnerName = (item) =>
    item?.ownerName ||
    item?.owner?.name ||
    item?.owner?.fullName ||
    "Property Owner";

  const getLocation = (item) =>
    item?.location ||
    item?.address ||
    item?.city ||
    item?.property?.location ||
    item?.property?.address ||
    "Location not available";

  const getTenantName = (item) =>
    item?.tenantName ||
    item?.tenant?.name ||
    item?.tenant?.fullName ||
    "Tenant";

  const getUserName = (user) =>
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";

  const getUserEmail = (user) =>
    user?.email || "Email not available";

  const getUserRole = (user) => user?.role || "User";

  const getUserStatus = (user) => {
    const role = String(user?.role || "").toLowerCase();
    const verificationStatus = String(user?.verificationStatus || "").toLowerCase();

    if (user?.status === "blocked" || user?.isActive === false) {
      if (role !== "agent" || verificationStatus !== "approved") {
        return "Blocked";
      }
    }

    if (role === "agent") {
      if (verificationStatus === "rejected") {
        return "Rejected";
      }

      if (
        verificationStatus === "approved" ||
        user?.isVerified === true ||
        user?.isActive === true
      ) {
        return "Active";
      }

      return "Pending Verification";
    }

    return "Active";
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "No data",
      icon: <FaUsers />,
      iconBg: "bg-[var(--theme-accent)]/10",
      iconColor: "text-[var(--theme-accent)]",
    },
    {
      title: "Total Properties",
      value: stats.totalProperties.toLocaleString(),
      change: "No data",
      icon: <FaBuilding />,
      iconBg: "bg-[var(--theme-accent)]/10",
      iconColor: "text-[var(--theme-accent)]",
    },
    {
      title: "Pending Verification",
      value: stats.pendingVerifications.toLocaleString(),
      change: "No data",
      icon: <FaClipboardCheck />,
      iconBg: "bg-[var(--theme-accent)]/10",
      iconColor: "text-[var(--theme-accent)]",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      change: "View only",
      icon: <FaCalendarAlt />,
      iconBg: "bg-[var(--theme-accent)]/10",
      iconColor: "text-[var(--theme-accent)]",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "No data",
      icon: <FaCreditCard />,
      iconBg: "bg-[var(--theme-accent)]/10",
      iconColor: "text-[var(--theme-accent)]",
    },
  ];

  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    weekday: "long",
  });

  const cardBase =
    "bg-[var(--theme-surface)] rounded-xl sm:rounded-2xl border border-[var(--theme-border)] shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.12)] sm:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.12)] hover:border-[var(--theme-accent)]/40 hover:shadow-[0_0_32px_rgba(var(--theme-accent-rgb),0.22)] active:shadow-[0_0_34px_rgba(var(--theme-accent-rgb),0.30)]";

  const iconHover =
    " hover:border-[var(--theme-accent)]/40 hover:bg-[var(--theme-accent)]/15 hover:shadow-[0_0_26px_rgba(var(--theme-accent-rgb),0.28)]";

  const rowHover =
    " hover:bg-[var(--theme-surface)] hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.16)]";

  const buttonHover =
    " hover:shadow-[0_0_26px_rgba(var(--theme-accent-rgb),0.32)] ";

  return (
    <div className="w-full min-w-0 overflow-x-hidden text-[var(--theme-text)]" style={{ "--theme-accent-rgb": accentRgb }}>
      <div className="mb-4 sm:mb-7 flex flex-col justify-between gap-2.5 sm:gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)] tracking-tight">
            Welcome Back, <span className="text-[var(--theme-accent)]">Admin</span>
          </h1>
        </div>

        <div
          className={`${cardBase} flex items-center gap-2 px-2.5 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-[var(--theme-muted-light)] w-fit shrink-0 cursor-pointer`}
        >
          <FaCalendarAlt className="text-[var(--theme-accent)]" />
          <span>{currentDate}</span>
        </div>
      </div>

      {loadError && (
        <div
          className={`${cardBase} mb-5 px-3 py-2.5 text-xs sm:text-sm font-medium text-[var(--theme-accent)]`}
        >
          {loadError}
        </div>
      )}

      {loading && (
        <div
          className={`${cardBase} mb-5 flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-medium text-[var(--theme-muted-dark)]`}
        >
          <div className=" w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full"></div>
          Loading dashboard data...
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`${cardBase} p-2.5 sm:p-4 cursor-pointer`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className={`flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor} text-xs sm:text-lg border border-[var(--theme-accent)]/15 ${iconHover}`}
              >
                {card.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] sm:text-xs font-semibold text-[var(--theme-muted-dark)]">
                  {card.title}
                </p>

                <h3 className="mt-0.5 truncate text-sm sm:text-xl font-extrabold text-[var(--theme-text)]">
                  {card.value}
                </h3>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[var(--theme-muted-dark)]">
              {card.title === "Total Bookings" ? <FaEye /> : <FaArrowUp />}
              <span>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 sm:mt-5 grid grid-cols-1 gap-3 sm:gap-5 xl:grid-cols-3">
        <div className={`${cardBase} p-3 sm:p-5 xl:col-span-2`}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                Revenue Overview
              </h3>

              <p className="mt-1 text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
                Monthly platform revenue performance
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-[var(--theme-muted-dark)] bg-[var(--theme-surface)] border border-[var(--theme-border)] px-2 py-1 sm:px-3 sm:py-1.5 rounded-full w-fit cursor-pointer hover:border-[var(--theme-accent)]/30 hover:text-[var(--theme-accent)] hover:shadow-[0_0_22px_rgba(var(--theme-accent-rgb),0.18)]">
              <FaChartLine />
              No revenue data
            </div>
          </div>

          <div className="flex h-44 sm:h-64 items-end gap-1.5 sm:gap-3 overflow-x-auto pb-2">
            {monthlyRevenue.map((item) => {
              const height =
                item.amount === 0
                  ? 5
                  : Math.max(12, (item.amount / maxRevenue) * 100);

              return (
                <div
                  key={item.month}
                  className="flex min-w-6 sm:min-w-9 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="hidden text-[10px] font-semibold text-[var(--theme-muted-dark)] sm:block">
                    {item.amount > 0
                      ? `${Math.round(item.amount / 1000)}k`
                      : "0"}
                  </span>

                  <div className="flex h-32 sm:h-48 w-full items-end justify-center rounded-t-lg bg-[var(--theme-surface)] cursor-pointer hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.18)]">
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full max-w-10 rounded-t-lg bg-linear-to-t from-[var(--theme-accent)] to-[var(--theme-accent-hover)] hover:shadow-[0_0_26px_rgba(var(--theme-accent-rgb),0.32)]"
                    ></div>
                  </div>

                  <span className="text-[10px] sm:text-xs font-bold text-[var(--theme-muted-dark)]">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${cardBase} p-4 sm:p-5`}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                Platform Overview
              </h3>

              <p className="mt-1 text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
                Current platform activity
              </p>
            </div>

            <div
              className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
            >
              <FaChartLine />
            </div>
          </div>

          <div className="space-y-5">
            <div className="cursor-pointer rounded-xl p-2 -m-2 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.12)]">
              <div className="mb-2 flex justify-between text-xs sm:text-sm">
                <span className="font-bold text-[var(--theme-muted-light)]">Active Users</span>

                <span className="font-extrabold text-[var(--theme-text)]">
                  {stats.totalUsers > 0 ? "Active" : "0%"}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--theme-border)]">
                <div
                  className="h-full rounded-full bg-[var(--theme-accent)] shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.35)]"
                  style={{
                    width: stats.totalUsers > 0 ? "82%" : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div className="cursor-pointer rounded-xl p-2 -m-2 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.12)]">
              <div className="mb-2 flex justify-between text-xs sm:text-sm">
                <span className="font-bold text-[var(--theme-muted-light)]">
                  Verified Properties
                </span>

                <span className="font-extrabold text-[var(--theme-text)]">
                  {stats.totalProperties > 0 ? "Available" : "0%"}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--theme-border)]">
                <div
                  className="h-full rounded-full bg-[var(--theme-accent)] shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.35)]"
                  style={{
                    width: stats.totalProperties > 0 ? "74%" : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div className="cursor-pointer rounded-xl p-2 -m-2 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.12)]">
              <div className="mb-2 flex justify-between text-xs sm:text-sm">
                <span className="font-bold text-[var(--theme-muted-light)]">
                  Booking Activity
                </span>

                <span className="font-extrabold text-[var(--theme-text)]">
                  {stats.totalBookings > 0 ? "Available" : "0%"}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--theme-border)]">
                <div
                  className="h-full rounded-full bg-[var(--theme-accent)] shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.35)]"
                  style={{
                    width: stats.totalBookings > 0 ? "91%" : "0%",
                  }}
                ></div>
              </div>
            </div>

            <div className="cursor-pointer rounded-xl p-2 -m-2 hover:bg-[var(--theme-surface)] hover:shadow-[0_0_20px_rgba(var(--theme-accent-rgb),0.12)]">
              <div className="mb-2 flex justify-between text-xs sm:text-sm">
                <span className="font-bold text-[var(--theme-muted-light)]">
                  Payment Activity
                </span>

                <span className="font-extrabold text-[var(--theme-text)]">
                  {stats.totalRevenue > 0 ? "Available" : "0%"}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[var(--theme-border)]">
                <div
                  className="h-full rounded-full bg-[var(--theme-accent)] shadow-[0_0_14px_rgba(var(--theme-accent-rgb),0.35)]"
                  style={{
                    width: stats.totalRevenue > 0 ? "87%" : "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-5 grid grid-cols-1 gap-3 sm:gap-5 xl:grid-cols-2">
        <div className={`${cardBase} overflow-hidden flex flex-col`}>
          <div className="flex flex-col justify-between gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-5 sm:flex-row sm:items-center shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                Property Verification
              </h3>

              <p className="mt-1 text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
                PO listings waiting for verification
              </p>
            </div>

            <Link
              to="/admin/verify-properties"
              className="text-xs sm:text-sm font-bold text-[var(--theme-accent)] hover:text-[var(--theme-accent-hover)] hover:underline hover:drop-shadow-[0_0_8px_rgba(var(--theme-accent-rgb),0.4)]"
            >
              View All →
            </Link>
          </div>

          {verificationRequests.length === 0 ? (
            <div className="px-4 py-8 sm:py-12 text-center flex-1 flex flex-col items-center justify-center">
              <div
                className={`mx-auto flex h-10 w-10 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-2xl bg-[var(--theme-accent)]/10 text-lg sm:text-xl text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
              >
                <FaClipboardCheck />
              </div>

              <h4 className="mt-3 text-xs sm:text-sm font-bold text-[var(--theme-text)]">
                No Verification Requests
              </h4>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--theme-muted-dark)] font-medium">
                When a Property Owner submits a listing, the verification
                request will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--theme-border)] flex-1 overflow-y-auto">
              {verificationRequests.slice(0, 4).map((item) => {
                const id = getId(item);
                const status = item.status || "Pending";

                return (
                  <div
                    key={id}
                    onClick={() => navigate("/admin/verify-properties")}
                    className={`p-3 sm:p-5 cursor-pointer ${rowHover}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
                        >
                          <FaBuilding />
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-bold text-[var(--theme-text)]">
                            {getPropertyName(item)}
                          </h4>

                          <p className="mt-1 text-xs text-[var(--theme-muted-dark)] font-medium">
                            Owner: {getOwnerName(item)}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2 text-[10px] sm:text-xs text-[var(--theme-muted-dark)] font-medium">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt />
                              {getLocation(item)}
                            </span>

                            {item.propertyType && (
                              <>
                                <span>•</span>
                                <span>{item.propertyType}</span>
                              </>
                            )}

                            {item.createdAt && (
                              <>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate("/admin/verify-properties");
                        }}
                        className={`flex shrink-0 items-center gap-2 rounded-lg bg-[var(--theme-surface)] px-3 py-2 text-[10px] sm:text-xs font-bold text-[var(--theme-accent)] border border-[var(--theme-accent)] ${buttonHover} hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] cursor-pointer`}
                      >
                        <FaEye />
                        Inspect & Verify
                      </button> </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`${cardBase} overflow-hidden flex flex-col`}>
          <div className="flex flex-col justify-between gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-5 sm:flex-row sm:items-center shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
                Recent Bookings
              </h3>

              <p className="mt-1 text-[10px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
                Booking activity overview
              </p>
            </div>

            <button
              type="button"
              title="View Bookings"
              className={`flex items-center justify-center gap-1.5 rounded-lg bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-3 py-1.5 text-[10px] sm:text-xs font-bold w-fit ${buttonHover} hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:border-[var(--theme-accent)] cursor-pointer`}
            >
              <FaEye />
              View
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="px-4 py-8 sm:py-12 text-center flex-1 flex flex-col items-center justify-center">
              <div
                className={`mx-auto flex h-10 w-10 sm:h-14 sm:w-14 cursor-pointer items-center justify-center rounded-2xl bg-[var(--theme-accent)]/10 text-lg sm:text-xl text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
              >
                <FaCalendarAlt />
              </div>

              <h4 className="mt-3 text-xs sm:text-sm font-bold text-[var(--theme-text)]">
                No Bookings Yet
              </h4>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--theme-muted-dark)] font-medium">
                Booking information will appear here when tenants start
                making bookings.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--theme-border)] flex-1 overflow-y-auto">
              {bookings.slice(0, 4).map((booking) => {
                const id = getId(booking);

                const amount =
                  booking.amount ||
                  booking.rent ||
                  booking.totalAmount ||
                  0;

                return (
                  <div
                    key={id}
                    className={`p-3 sm:p-5 cursor-pointer ${rowHover}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--theme-accent)]/10 font-bold text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
                        >
                          {getTenantName(booking).charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-bold text-[var(--theme-text)]">
                            {getTenantName(booking)}
                          </h4>

                          <p className="truncate text-xs text-[var(--theme-muted-dark)] font-medium">
                            {getPropertyName(booking)}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-[10px] sm:text-xs text-[var(--theme-muted-dark)] font-medium">
                            <FaClock />
                            {booking.createdAt
                              ? new Date(
                                booking.createdAt
                              ).toLocaleDateString()
                              : "Date not available"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs sm:text-sm font-extrabold text-[var(--theme-text)]">
                          {formatCurrency(amount)}
                        </p>

                        <span className="mt-1 inline-block rounded-full bg-[var(--theme-border)] border border-[var(--theme-border)] px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-bold text-[var(--theme-muted-light)] hover:shadow-[0_0_16px_rgba(var(--theme-accent-rgb),0.16)]">
                          {booking.status || "View Only"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={`${cardBase} overflow-hidden mt-5`}>
        <div className="flex flex-col justify-between gap-2.5 border-b border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 sm:p-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-lg font-extrabold text-[var(--theme-text)] tracking-tight">
              Recent Users
            </h3>

            <p className="mt-1 text-[9px] sm:text-sm text-[var(--theme-muted-dark)] font-medium">
              Recently registered users on PG Stay
            </p>
          </div>

          <span className="flex items-center gap-1.5 rounded-full bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20 px-2.5 py-1.5 text-[9px] sm:text-xs font-bold w-fit">
            <FaUsers />
            {users.length} Users
          </span>
        </div>

        {users.length === 0 ? (
          <div className="px-4 py-8 sm:py-12 text-center">
            <div
              className={`mx-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[var(--theme-accent)]/10 text-lg sm:text-xl text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
            >
              <FaUsers />
            </div>

            <h4 className="mt-3 text-xs sm:text-sm font-bold text-[var(--theme-text)]">
              No Users Yet
            </h4>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[var(--theme-muted-dark)] font-medium">
              Registered tenants, Property Owners and other users will appear
              here once they join the platform.
            </p>
          </div>
        ) : (
          <>
            <div className="md:hidden w-full max-w-full p-2.5 space-y-2 overflow-hidden">
              {users.slice(0, 5).map((user) => {
                const id = getId(user);
                const name = getUserName(user);
                const email = getUserEmail(user);
                const role = getUserRole(user);
                const status = getUserStatus(user);

                let statusColor =
                  "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/20";

                if (status === "Rejected" || status === "Blocked") {
                  statusColor =
                    "bg-[var(--theme-border)] text-[var(--theme-muted-light)] border-[var(--theme-border)]";
                }

                return (
                  <div
                    key={id}
                    className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 font-bold text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
                      >
                        {name.charAt(0)}
                      </div>

                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="truncate text-xs font-bold text-[var(--theme-text)]">
                          {name}
                        </p>

                        <p className="truncate text-[9px] text-[var(--theme-muted-dark)] font-medium">
                          {email}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        title="View Detail"
                        className={`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 bg-[var(--theme-surface)] border border-[var(--theme-accent)] text-[var(--theme-accent)] text-[10px] sm:text-xs font-bold ${buttonHover} hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:border-[var(--theme-accent)] cursor-pointer`}
                      >
                        <FaEye className="text-[10px]" />
                        <span>View Detail</span>
                      </button>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      <div className="min-w-0 overflow-hidden rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">
                          Role
                        </p>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1">
                          {role === "Property Owner" ? (
                            <FaUserTie className="shrink-0 text-[9px] text-[var(--theme-accent)]" />
                          ) : (
                            <FaUsers className="shrink-0 text-[9px] text-[var(--theme-accent)]" />
                          )}

                          <p className="truncate text-[9px] font-bold text-[var(--theme-muted-light)]">
                            {role}
                          </p>
                        </div>
                      </div>

                      <div className="min-w-0 overflow-hidden rounded-lg border border-[var(--theme-border)] px-2 py-1.5">
                        <p className="text-[8px] uppercase tracking-wide text-[var(--theme-muted-dark)]">
                          Status
                        </p>

                        <span
                          className={`mt-0.5 inline-flex max-w-full truncate rounded-full border px-2 py-0.5 text-[8px] font-bold ${statusColor}`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">
                    <th className="px-3 sm:px-5 py-2.5 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      User
                    </th>

                    <th className="px-3 sm:px-5 py-2.5 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Role
                    </th>

                    <th className="px-3 sm:px-5 py-2.5 sm:py-4 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Status
                    </th>

                    <th className="px-3 sm:px-5 py-2.5 sm:py-4 text-right text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--theme-muted-dark)]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--theme-border)]">
                  {users.slice(0, 5).map((user) => {
                    const id = getId(user);
                    const name = getUserName(user);
                    const email = getUserEmail(user);
                    const role = getUserRole(user);
                    const status = getUserStatus(user);

                    let statusColor =
                      "bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border-[var(--theme-accent)]/20";

                    if (status === "Rejected" || status === "Blocked") {
                      statusColor =
                        "bg-[var(--theme-border)] text-[var(--theme-muted-light)] border-[var(--theme-border)]";
                    }

                    return (
                      <tr key={id} className={`${rowHover} cursor-pointer`}>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-accent)]/10 font-bold text-[var(--theme-accent)] border border-[var(--theme-accent)]/15 ${iconHover}`}
                            >
                              {name.charAt(0)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs sm:text-sm font-bold text-[var(--theme-text)]">
                                {name}
                              </p>

                              <p className="truncate text-[10px] sm:text-xs text-[var(--theme-muted-dark)] font-medium">
                                {email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 sm:px-5 py-2.5 sm:py-4">
                          <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--theme-muted-light)] hover:text-[var(--theme-accent)]">
                            {role === "Property Owner" ? (
                              <FaUserTie className="text-[var(--theme-accent)]" />
                            ) : (
                              <FaUsers className="text-[var(--theme-accent)]" />
                            )}

                            {role}
                          </span>
                        </td>

                        <td className="px-3 sm:px-5 py-2.5 sm:py-4">
                          <span
                            className={`rounded-full border px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold hover:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.18)] ${statusColor}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-3 sm:px-5 py-2.5 sm:py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            title="View Detail"
                            className={`inline-flex h-8 sm:h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 sm:px-3 bg-[var(--theme-surface)] border border-[var(--theme-accent)] text-[var(--theme-accent)] text-[10px] sm:text-xs font-bold ${buttonHover} hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] hover:border-[var(--theme-accent)] cursor-pointer`}
                          >
                            <FaEye />
                            <span>View Detail</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>


    </div>
  );
}

export default AdminDashboard;