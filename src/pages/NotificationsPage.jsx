import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheck,
  FaTrashAlt,
  FaCheckDouble,
  FaFilter,
  FaArrowLeft,
  FaBookmark,
  FaCreditCard,
  FaBuilding,
  FaStar,
  FaUserCog,
  FaInfoCircle,
} from "react-icons/fa";

import {
  getNotificationApi,
  markAsReadApi,
  markAllReadApi,
  deleteNotificationApi,
  clearAllNotificationsApi,
} from "../api/notificationApi.js";

import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { getNotificationLink } from "../utils/notificationLink.js";

const getNotificationIcon = (type) => {
  switch (type) {
    case "Booking":
      return (
        <FaBookmark
          className="text-[var(--theme-accent)] text-lg sm:text-xl"
        />
      );

    case "Payment":
      return (
        <FaCreditCard
          className="text-[var(--theme-accent)] text-lg sm:text-xl"
        />
      );

    case "New_Listing":
    case "Verification_Request":
    case "Inspection_Submitted":
      return (
        <FaBuilding
          className="text-[var(--theme-accent)] text-lg sm:text-xl"
        />
      );

    case "Review":
      return (
        <FaStar
          className="text-[var(--theme-accent)] text-lg sm:text-xl"
        />
      );

    case "Agent_Request":
      return (
        <FaUserCog
          className="text-[var(--theme-accent)] text-lg sm:text-xl"
        />
      );

    default:
      return (
        <FaInfoCircle
          className="text-[var(--theme-accent)] text-lg sm:text-xl"
        />
      );
  }
};

export const NotificationsPage = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async () => {
    setLoading(true);

    try {
      const data = await getNotificationApi();

      if (data.success) {
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsReadApi(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadApi();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationApi(id);

      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all notifications?"
      )
    ) {
      return;
    }

    try {
      await clearAllNotificationsApi();
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      try {
        await markAsReadApi(n._id);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === n._id
              ? { ...item, isRead: true }
              : item
          )
        );
      } catch (err) {
        console.error(err);
      }
    }

    navigate(getNotificationLink(n, user));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const getDashboardBackLink = () => {
    if (!user) return "/";

    switch (user.role) {
      case "owner":
        return "/owner/dashboard";

      case "admin":
        return "/admin/dashboard";

      case "agent":
        return "/agent/dashboard";

      default:
        return "/mybooking";
    }
  };

  const isOffWhite = theme === "offwhite";

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] py-4 px-3 sm:py-8 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      <div className="max-w-4xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:gap-4 sm:mb-6">

          <div className="flex items-center gap-3">
            <Link
              to={getDashboardBackLink()}
              className="p-2.5 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] text-[var(--theme-muted-light)] hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]/60 transition-all shadow-sm no-underline"
              title="Back to Dashboard"
            >
              <FaArrowLeft />
            </Link>

            <div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[var(--theme-text)] tracking-tight flex items-center gap-2">
                <span>
                  Notifications{" "}
                  <span className="text-[var(--theme-accent)]">
                    Center
                  </span>
                </span>

                <FaBell className="text-[var(--theme-accent)] text-lg sm:text-xl" />
              </h1>

              <p className="text-xs text-[var(--theme-muted)] mt-1 font-medium">
                Stay informed about updates, requests, bookings & payments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="px-2.5 py-1.5 text-[11px] sm:px-3.5 sm:py-2 sm:text-xs font-bold bg-transparent border border-[var(--theme-accent)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FaCheckDouble />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1.5 text-[11px] sm:px-3.5 sm:py-2 sm:text-xs font-bold bg-transparent border border-[var(--theme-accent)] text-[var(--theme-accent)] hover:bg-[var(--theme-accent)] hover:text-[var(--theme-button-text)] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FaTrashAlt />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-2 mb-4 sm:p-3 sm:mb-6 flex flex-wrap items-center gap-2 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60">
          <div className="flex items-center gap-1.5 px-1 sm:gap-2 sm:px-2">
            <FaFilter className="text-[var(--theme-accent)]" />

            <span className="text-xs font-bold text-[var(--theme-muted)] uppercase tracking-wider">
              Filter:
            </span>
          </div>

          {["all", "unread", "read"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] sm:px-4 sm:py-1.5 sm:text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === f
                  ? "bg-[var(--theme-accent)] text-[var(--theme-button-text)] shadow-sm"
                  : "bg-[var(--theme-card)] text-[var(--theme-muted-light)] border border-[var(--theme-border)] hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]/50"
              }`}
            >
              {f} (
              {
                notifications.filter((n) =>
                  f === "unread"
                    ? !n.isRead
                    : f === "read"
                    ? n.isRead
                    : true
                ).length
              }
              )
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-7 sm:p-12 text-center transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60">
            <div className="animate-spin w-8 h-8 sm:w-10 sm:h-10 border-4 border-[var(--theme-accent)] border-t-transparent rounded-full mx-auto mb-4"></div>

            <p className="text-[var(--theme-muted)] font-medium">
              Loading notifications...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-7 sm:p-12 text-center transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60">
            <div className="w-20 h-20 rounded-full bg-[var(--theme-card)] border border-[var(--theme-accent)]/30 flex items-center justify-center mx-auto mb-4">
              <FaBell className="text-3xl text-[var(--theme-accent)]" />
            </div>

            <h3 className="text-lg font-extrabold text-[var(--theme-text)]">
              No Notifications Found
            </h3>

            <p className="text-sm text-[var(--theme-muted)] mt-1 font-medium">
              {filter === "all"
                ? "You have no notifications in your inbox."
                : `No ${filter} notifications.`}
            </p>
          </div>
        ) : (
          <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] divide-y divide-[var(--theme-border)] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[var(--theme-accent)]/60">

            {filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 sm:p-5 transition-all duration-300 flex items-start gap-2.5 sm:gap-4 cursor-pointer ${
                  !n.isRead
                    ? "bg-[var(--theme-card)] hover:bg-[var(--theme-surface)] hover:border-l-2 hover:border-l-[var(--theme-accent)]"
                    : "bg-[var(--theme-surface)] hover:bg-[var(--theme-card)] hover:border-l-2 hover:border-l-[var(--theme-accent)]"
                }`}
              >
                <div className="p-2 sm:p-3 rounded-lg bg-[var(--theme-card)] border border-[var(--theme-accent)]/30 shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-[var(--theme-text)] flex items-center gap-2 min-w-0">
                      <span className="truncate">
                        {n.title || "Notification"}
                      </span>

                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[var(--theme-accent)] inline-block shadow-sm shrink-0"></span>
                      )}
                    </h3>

                    <span className="text-[10px] sm:text-xs text-[var(--theme-muted)] whitespace-nowrap font-medium">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--theme-muted-light)] mt-1 leading-relaxed font-medium">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(n._id);
                      }}
                      className="p-1.5 sm:p-2 text-[var(--theme-muted)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-card)] rounded-lg transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <FaCheck />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(n._id);
                    }}
                    className="p-1.5 sm:p-2 text-[var(--theme-muted)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-card)] rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;