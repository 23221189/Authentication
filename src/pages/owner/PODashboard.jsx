import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaHome,
    FaCalendarCheck,
    FaCreditCard,
    FaBuilding,
    FaArrowUp,
    FaArrowRight,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaSync,
    FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

function PODashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const {
        user,
        ownerSession,
        ownerProperties: properties = [],
        ownerBookings: bookings = [],
        ownerDashboardLoading,
        ownerDashboardError,
        updateOwnerBooking,
        fetchOwnerDashboard,
    } = useAuth();

    const session = ownerSession || user || {};

    useEffect(() => {
        if (typeof fetchOwnerDashboard !== "function") return;

        fetchOwnerDashboard();
    }, [fetchOwnerDashboard]);

    const pendingRequests = bookings.filter(
        (booking) =>
            booking.status === "Pending" ||
            booking.status === "pending"
    );

    const totalProperties = properties.length;
    const totalBookings = bookings.length;

    const totalEarnings = bookings
        .filter((b) =>
            ["Confirmed", "Approved", "confirmed", "approved"].includes(
                b.status
            )
        )
        .reduce(
            (sum, b) => sum + (Number(b.totalAmount) || 0),
            0
        );

    const propertyEarnings = properties.reduce(
        (sum, item) => sum + (Number(item.earnings) || 0),
        0
    );

    const finalEarnings =
        totalEarnings > 0 ? totalEarnings : propertyEarnings;

    const averageEarnings =
        finalEarnings > 0 ? Math.round(finalEarnings / 12) : 0;

    const thisMonthEarnings = averageEarnings;

    async function handleConfirmRequest(id) {
        const request = pendingRequests.find(
            (item) => (item.id || item._id) === id
        );

        if (!request) return;

        setActionLoading(id);

        try {
            if (typeof updateOwnerBooking === "function") {
                await updateOwnerBooking(id, "Confirmed");
            }
        } catch (err) {
            alert("Booking could not be confirmed. Please try again");
        } finally {
            setActionLoading(null);
        }
    }

    async function handleRejectRequest(id) {
        setActionLoading(id);

        try {
            if (typeof updateOwnerBooking === "function") {
                await updateOwnerBooking(id, "Rejected");
            }
        } catch (err) {
            alert("Booking could not be rejected. Please try again");
        } finally {
            setActionLoading(null);
        }
    }

    const getPropertyName = (item) =>
        item.name ||
        item.propertyName ||
        item.title ||
        "Unnamed Property";

    const getPropertyLocation = (item) =>
        item.location ||
        item.address ||
        "Location not available";

    const getBookingTenant = (booking) =>
        booking.tenant ||
        booking.tenantName ||
        "Unknown Tenant";

    const getBookingProperty = (booking) =>
        booking.property ||
        booking.propertyName ||
        "Property";

    const getStatusClass = (status) => {
        const s = status?.toLowerCase();

        if (
            s === "active" ||
            s === "confirmed" ||
            s === "approved"
        ) {
            return "bg-green-100 text-green-700 border border-green-300";
        }

        if (
            s === "pending" ||
            s === "pending approval"
        ) {
            return "bg-orange-100 text-orange-700 border border-orange-300";
        }

        if (
            s === "rejected" ||
            s === "cancelled" ||
            s === "inactive"
        ) {
            return "bg-red-100 text-red-700 border border-red-300";
        }

        return "bg-[var(--theme-surface)] text-[var(--theme-text)] border border-[var(--theme-border)]";
    };

    if (ownerDashboardLoading) {
        return (
            <div className="min-h-screen w-full overflow-x-hidden bg-[var(--theme-bg)] flex relative">
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col items-center justify-center py-32 px-5">
                        <div className="w-16 h-16 rounded-full bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center animate-pulse">
                            <FaSync className="text-[var(--theme-accent)] text-2xl animate-spin" />
                        </div>

                        <h3 className="font-bold text-[var(--theme-text)] mt-5 text-lg">
                            Loading Dashboard...
                        </h3>

                        <p className="text-sm text-[var(--theme-muted-dark)] mt-2">
                            Your dashboard data is being loaded.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (ownerDashboardError) {
        return (
            <div className="min-h-screen w-full overflow-x-hidden bg-[var(--theme-bg)] flex relative">
                <div className="flex-1 min-w-0 w-full">

                    <div className="flex flex-col items-center justify-center py-32 px-5">
                        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                            <FaExclamationTriangle className="text-red-500 text-2xl" />
                        </div>

                        <h3 className="font-bold text-[var(--theme-text)] mt-5 text-lg">
                            Unable to Load Dashboard
                        </h3>

                        <p className="text-sm text-[var(--theme-muted-dark)] mt-2 text-center max-w-md">
                            {ownerDashboardError}
                        </p>

                        <button
                            onClick={() => fetchOwnerDashboard()}
                            className="mt-5 inline-flex items-center gap-2 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-button-text)] px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer"
                        >
                            <FaSync />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[var(--theme-bg)] text-[var(--theme-text)] flex relative transition-colors duration-300">
            <div
                className={`fixed lg:relative z-30 transition-transform duration-300 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
            </div>

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 z-20 lg:hidden"
                />
            )}

            <div className="flex-1 min-w-0 w-full">
                <main className="w-full px-3 sm:px-5 lg:px-8 py-5 sm:py-7">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--theme-text)]">
                                    Welcome Back,{" "}
                                    {session?.fullname ||
                                        session?.name ||
                                        "Property Owner"}
                                    !
                                </h1>

                                <p className="text-[var(--theme-muted-dark)] mt-1 text-sm sm:text-base leading-relaxed">
                                    Here's what's happening with your properties today.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() =>
                                        fetchOwnerDashboard()
                                    }
                                    className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg px-4 py-3 flex items-center gap-2 shadow-sm hover:bg-[var(--theme-bg)] transition cursor-pointer"
                                    title="Refresh dashboard data"
                                >
                                    <FaSync className="text-[var(--theme-accent)] text-sm" />
                                </button>

                                <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg px-5 py-3 flex items-center gap-3 shadow-sm w-fit">
                                    <FaCalendarAlt className="text-[var(--theme-accent)]" />

                                    <span className="text-sm font-semibold text-[var(--theme-text)]">
                                        {new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                            <div className="bg-[var(--theme-surface)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--theme-border)] flex items-center gap-4 transition-colors duration-300">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] flex items-center justify-center shrink-0">
                                    <FaHome className="text-[var(--theme-accent)] text-xl sm:text-2xl" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm text-[var(--theme-muted-dark)]">
                                        Total Properties
                                    </p>

                                    <h2 className="text-2xl font-extrabold text-[var(--theme-text)] mt-1">
                                        {totalProperties}
                                    </h2>

                                    <p className="text-xs text-[var(--theme-accent)] mt-1 font-semibold">
                                        Active Listings
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[var(--theme-surface)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--theme-border)] flex items-center gap-4 transition-colors duration-300">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] flex items-center justify-center shrink-0">
                                    <FaCalendarCheck className="text-[var(--theme-accent)] text-xl sm:text-2xl" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm text-[var(--theme-muted-dark)]">
                                        Total Bookings
                                    </p>

                                    <h2 className="text-2xl font-extrabold text-[var(--theme-text)] mt-1">
                                        {totalBookings}
                                    </h2>

                                    <p className="text-xs text-[var(--theme-accent)] mt-1 font-semibold">
                                        All Time
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[var(--theme-surface)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--theme-border)] flex items-center gap-4 transition-colors duration-300">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                                    <FaCreditCard className="text-green-600 text-xl sm:text-2xl" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm text-[var(--theme-muted-dark)]">
                                        Total Earnings
                                    </p>

                                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--theme-text)] mt-1">
                                        PKR {finalEarnings.toLocaleString()}
                                    </h2>

                                    <p className="text-xs text-green-600 mt-1 font-semibold">
                                        Lifetime Revenue
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[var(--theme-surface)] rounded-2xl p-5 sm:p-6 shadow-sm border border-[var(--theme-border)] flex items-center gap-4 transition-colors duration-300">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                                    <FaClock className="text-orange-600 text-xl sm:text-2xl" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm text-[var(--theme-muted-dark)]">
                                        Pending Requests
                                    </p>

                                    <h2 className="text-2xl font-extrabold text-[var(--theme-text)] mt-1">
                                        {pendingRequests.length}
                                    </h2>

                                    <p className="text-xs text-orange-600 mt-1 font-semibold">
                                        Need Confirmation
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--theme-surface)] rounded-2xl shadow-sm border border-[var(--theme-border)] mt-6 sm:mt-8 overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-[var(--theme-border)]">
                                <div>
                                    <h2 className="text-lg font-extrabold text-[var(--theme-text)]">
                                        My Properties
                                    </h2>

                                    <p className="text-sm text-[var(--theme-muted-dark)] mt-1">
                                        Overview of your listed properties
                                    </p>
                                </div>

                                <Link
                                    to="/myproperties"
                                    className="inline-flex items-center justify-center gap-2 border border-[var(--theme-accent)] text-[var(--theme-accent)] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] transition w-full sm:w-auto"
                                >
                                    View All Properties
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>

                            {properties.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-14 sm:py-16 px-5 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[var(--theme-bg)] border border-[var(--theme-border)] flex items-center justify-center">
                                        <FaHome className="text-[var(--theme-accent)] text-2xl" />
                                    </div>

                                    <h3 className="font-bold text-[var(--theme-text)] mt-4">
                                        No Properties Listed Yet
                                    </h3>

                                    <p className="text-sm text-[var(--theme-muted-dark)] mt-2 text-center max-w-sm leading-relaxed">
                                        You haven't listed any property yet. Add your first property to start receiving bookings.
                                    </p>

                                    <Link
                                        to="/addproperty"
                                        className="mt-5 inline-flex items-center gap-2 bg-[var(--theme-accent)] text-[var(--theme-button-text)] px-6 py-2.5 rounded-lg text-sm font-bold transition"
                                    >
                                        <FaHome />
                                        Add Property
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-[var(--theme-border)]">
                                    {properties
                                        .slice(0, 5)
                                        .map((item) => {
                                            const propertyId =
                                                item.id || item._id;

                                            const propertyName =
                                                getPropertyName(item);

                                            const propertyLocation =
                                                getPropertyLocation(item);

                                            const rawPropertyStatus = String(
                                                item.status || "pending"
                                            ).trim().toLowerCase();

                                            const propertyStatusMap = {
                                                pending: "Pending",
                                                assigned: "Pending",
                                                verified: "Pending",
                                                under_admin_review: "Pending",
                                                "under admin review": "Pending",
                                                approved: "Active",
                                                published: "Active",
                                                active: "Active",
                                                rejected: "Rejected",
                                                inactive: "Inactive",
                                            };

                                            const propertyStatus =
                                                propertyStatusMap[rawPropertyStatus] ||
                                                "Pending";

                                            const rooms =
                                                Number(item.rooms) || 0;

                                            const rent =
                                                Number(item.rent) || 0;

                                            const bookingsCount =
                                                Number(
                                                    item.bookingsCount
                                                ) || 0;

                                            const earnings =
                                                Number(item.earnings) || 0;

                                            return (
                                                <div
                                                    key={propertyId}
                                                    className="p-4 sm:p-5 hover:bg-[var(--theme-bg)] transition"
                                                >
                                                    <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                                            <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] flex items-center justify-center shrink-0 overflow-hidden">
                                                                {item.images &&
                                                                item.images.length >
                                                                    0 ? (
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .images[0]
                                                                        }
                                                                        alt={
                                                                            propertyName
                                                                        }
                                                                        className="w-full h-full object-cover rounded-xl"
                                                                    />
                                                                ) : (
                                                                    <FaHome className="text-[var(--theme-accent)] text-2xl sm:text-3xl" />
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <h3 className="font-extrabold text-[var(--theme-text)] text-base sm:text-lg truncate">
                                                                    {
                                                                        propertyName
                                                                    }
                                                                </h3>

                                                                <p className="text-sm text-[var(--theme-muted-dark)] mt-1 truncate">
                                                                    {
                                                                        propertyLocation
                                                                    }
                                                                </p>

                                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                                    <span className="text-xs text-[var(--theme-muted-dark)] flex items-center gap-1">
                                                                        <FaBuilding />
                                                                        {rooms}{" "}
                                                                        Rooms
                                                                    </span>

                                                                    <span className="text-sm text-[var(--theme-accent)] font-bold">
                                                                        PKR{" "}
                                                                        {rent.toLocaleString()}{" "}
                                                                        / month
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 xl:gap-6">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusClass(
                                                                    propertyStatus
                                                                )}`}
                                                            >
                                                                {propertyStatus ===
                                                                    "Active" ||
                                                                propertyStatus ===
                                                                    "Approved" ? (
                                                                    <FaCheckCircle />
                                                                ) : propertyStatus ===
                                                                  "Pending" ? (
                                                                    <FaClock />
                                                                ) : propertyStatus ===
                                                                      "Rejected" ||
                                                                  propertyStatus ===
                                                                      "Inactive" ? (
                                                                    <FaTimesCircle />
                                                                ) : (
                                                                    <FaClock />
                                                                )}

                                                                {
                                                                    propertyStatus
                                                                }
                                                            </span>

                                                            <div className="min-w-[75px]">
                                                                <p className="text-xs text-[var(--theme-muted-dark)]">
                                                                    Bookings
                                                                </p>

                                                                <p className="text-lg font-bold text-[var(--theme-text)] mt-1">
                                                                    {
                                                                        bookingsCount
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="min-w-[100px]">
                                                                <p className="text-xs text-[var(--theme-muted-dark)]">
                                                                    Earnings
                                                                </p>

                                                                <p className="text-sm font-bold text-[var(--theme-text)] mt-1">
                                                                    PKR{" "}
                                                                    {earnings.toLocaleString()}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2 w-full sm:w-auto">
                                                                <Link
                                                                    to={`/propertyownerdetails/${propertyId}`}
                                                                    className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg border border-[var(--theme-accent)] text-[var(--theme-accent)] text-sm font-bold hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] transition"
                                                                >
                                                                    View
                                                                </Link>

                                                                <Link
                                                                    to={`/manageproperty/${propertyId}`}
                                                                    className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg border border-[var(--theme-accent)] text-[var(--theme-accent)] text-sm font-bold hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] transition"
                                                                >
                                                                    Manage
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mt-6">
                            <div className="bg-[var(--theme-surface)] rounded-2xl shadow-sm border border-[var(--theme-border)] overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border)]">
                                    <div>
                                        <h2 className="text-lg font-extrabold text-[var(--theme-text)]">
                                            Recent Bookings
                                        </h2>

                                        <p className="text-sm text-[var(--theme-muted-dark)] mt-1">
                                            Latest bookings for your properties
                                        </p>
                                    </div>

                                    <Link
                                        to="/pobookings"
                                        className="inline-flex items-center gap-1 text-sm text-[var(--theme-accent)] font-bold hover:text-[var(--theme-accent-hover)]"
                                    >
                                        View All
                                        <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>

                                {bookings.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-5">
                                        <div className="w-14 h-14 rounded-full bg-[var(--theme-bg)] border border-[var(--theme-border)] flex items-center justify-center">
                                            <FaCalendarCheck className="text-[var(--theme-accent)] text-xl" />
                                        </div>

                                        <h3 className="font-bold text-[var(--theme-text)] mt-4">
                                            No Recent Bookings
                                        </h3>

                                        <p className="text-sm text-[var(--theme-muted-dark)] mt-2 text-center">
                                            Your recent bookings will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[var(--theme-border)]">
                                        {bookings
                                            .slice(0, 4)
                                            .map((booking) => {
                                                const bookingId =
                                                    booking.id ||
                                                    booking._id;

                                                return (
                                                    <div
                                                        key={bookingId}
                                                        className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-[var(--theme-bg)] transition"
                                                    >
                                                        <div className="min-w-0">
                                                            <h3 className="font-bold text-[var(--theme-text)] truncate">
                                                                {getBookingTenant(
                                                                    booking
                                                                )}
                                                            </h3>

                                                            <p className="text-xs text-[var(--theme-muted-dark)] mt-1 truncate">
                                                                {getBookingProperty(
                                                                    booking
                                                                )}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold ${getStatusClass(
                                                                booking.status ||
                                                                    "Pending"
                                                            )}`}
                                                        >
                                                            {booking.status ||
                                                                "Pending"}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>

                            <div className="bg-[var(--theme-surface)] rounded-2xl shadow-sm border border-[var(--theme-border)] overflow-hidden">
                                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-accent)]">
                                    <div>
                                        <h2 className="text-lg font-extrabold text-white">
                                            Pending Booking Requests
                                        </h2>

                                        <p className="text-sm text-[var(--theme-muted-dark)] mt-1">
                                            Requests waiting for your confirmation
                                        </p>
                                    </div>

                                    <span className="shrink-0 bg-orange-100 text-orange-700 border border-orange-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                                        {pendingRequests.length} Pending
                                    </span>
                                </div>

                                {pendingRequests.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-5">
                                        <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
                                            <FaCalendarAlt className="text-orange-500 text-xl" />
                                        </div>

                                        <h3 className="font-bold text-[var(--theme-text)] mt-4">
                                            No Pending Requests
                                        </h3>

                                        <p className="text-sm text-[var(--theme-muted-dark)] mt-2 text-center">
                                            New booking requests will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-[var(--theme-border)]">
                                        {pendingRequests
                                            .slice(0, 4)
                                            .map((request) => {
                                                const requestId =
                                                    request.id ||
                                                    request._id;

                                                const isActing =
                                                    actionLoading ===
                                                    requestId;

                                                return (
                                                    <div
                                                        key={requestId}
                                                        className="px-5 py-5"
                                                    >
                                                        <div className="flex items-center justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <h3 className="font-bold text-[var(--theme-text)] truncate">
                                                                    {getBookingTenant(
                                                                        request
                                                                    )}
                                                                </h3>

                                                                <p className="text-xs text-[var(--theme-muted-dark)] mt-1 truncate">
                                                                    {getBookingProperty(
                                                                        request
                                                                    )}
                                                                </p>

                                                                <p className="text-xs text-[var(--theme-muted-dark)] mt-1">
                                                                    Check-in:{" "}
                                                                    {request.checkIn ||
                                                                        "-"}
                                                                </p>
                                                            </div>

                                                            <span className="shrink-0 bg-orange-100 text-orange-700 border border-orange-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                                                                Pending
                                                            </span>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isActing
                                                                }
                                                                onClick={() =>
                                                                    handleConfirmRequest(
                                                                        requestId
                                                                    )
                                                                }
                                                                className={`flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-5 rounded-lg text-sm font-bold shadow-sm transition-all duration-200 ${
                                                                    isActing
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : "cursor-pointer hover:-translate-y-0.5"
                                                                }`}
                                                            >
                                                                {isActing ? (
                                                                    <FaSync className="animate-spin" />
                                                                ) : (
                                                                    <FaCheckCircle />
                                                                )}

                                                                {isActing
                                                                    ? "Processing..."
                                                                    : "Confirm"}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isActing
                                                                }
                                                                onClick={() =>
                                                                    handleRejectRequest(
                                                                        requestId
                                                                    )
                                                                }
                                                                className={`flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 px-5 rounded-lg text-sm font-bold shadow-sm transition-all duration-200 ${
                                                                    isActing
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : "cursor-pointer hover:-translate-y-0.5"
                                                                }`}
                                                            >
                                                                {isActing ? (
                                                                    <FaSync className="animate-spin" />
                                                                ) : (
                                                                    <FaTimesCircle />
                                                                )}

                                                                {isActing
                                                                    ? "Processing..."
                                                                    : "Reject"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[var(--theme-surface)] rounded-2xl shadow-sm border border-[var(--theme-border)] p-5 sm:p-6 mt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                                <div>
                                    <h2 className="text-xl font-extrabold text-[var(--theme-text)]">
                                        Earnings Overview
                                    </h2>

                                    <p className="text-sm text-[var(--theme-muted-dark)] mt-1">
                                        Your monthly earnings performance
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg w-fit">
                                    <FaArrowUp />
                                    Earnings Summary
                                </div>
                            </div>

                            <div className="relative w-full h-[300px] sm:h-[330px]">
                                <div className="absolute left-0 top-0 h-[230px] sm:h-[260px] flex flex-col justify-between text-xs text-[var(--theme-muted-dark)]">
                                    <span>80K</span>
                                    <span>60K</span>
                                    <span>40K</span>
                                    <span>20K</span>
                                    <span>0</span>
                                </div>

                                <div className="ml-10 h-[230px] sm:h-[260px] relative">
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        <div className="border-t border-[var(--theme-border)]"></div>
                                        <div className="border-t border-[var(--theme-border)]"></div>
                                        <div className="border-t border-[var(--theme-border)]"></div>
                                        <div className="border-t border-[var(--theme-border)]"></div>
                                        <div className="border-t border-[var(--theme-border)]"></div>
                                    </div>

                                    {finalEarnings > 0 ? (
                                        <svg
                                            className="absolute inset-0 w-full h-full pointer-events-none"
                                            viewBox="0 0 1000 260"
                                            preserveAspectRatio="none"
                                        >
                                            <polyline
                                                points="0,260 91,230 182,200 273,170 364,210 455,140 546,180 637,100 728,150 819,90 910,120 1000,70"
                                                fill="none"
                                                stroke="#8B5A2B"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <FaCreditCard className="text-[var(--theme-border)] text-3xl mx-auto" />

                                                <p className="text-sm text-[var(--theme-muted-dark)] mt-2">
                                                    Earnings data will appear here
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="ml-10 flex justify-between text-xs text-[var(--theme-muted-dark)] mt-4 overflow-hidden">
                                    {[
                                        "Jan",
                                        "Feb",
                                        "Mar",
                                        "Apr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Aug",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dec",
                                    ].map((m) => (
                                        <span key={m}>{m}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-[var(--theme-border)] mt-6 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <p className="text-xs text-[var(--theme-muted-dark)]">
                                        Total Earnings
                                    </p>

                                    <p className="text-xl font-extrabold text-[var(--theme-text)] mt-1">
                                        PKR{" "}
                                        {finalEarnings.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-[var(--theme-muted-dark)]">
                                        Average Monthly Earnings
                                    </p>

                                    <p className="text-xl font-extrabold text-[var(--theme-text)] mt-1">
                                        PKR{" "}
                                        {averageEarnings.toLocaleString()}
                                    </p>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-xs text-[var(--theme-muted-dark)]">
                                        This Month
                                    </p>

                                    <p className="text-xl font-extrabold text-[var(--theme-accent)] mt-1">
                                        PKR{" "}
                                        {thisMonthEarnings.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default PODashboard;