import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext.jsx";

const SERVER_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

const NotificationBell = () => {
  const { theme } = useTheme();
  const { activeRole } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [liveNotification, setLiveNotification] = useState(null);

  const dropdownRef = useRef(null);
  const previousNotificationsRef = useRef([]);
  const firstNotificationLoadRef = useRef(true);
  const socketRef = useRef(null);
  const liveTimerRef = useRef(null);

  const isOffWhite = theme === "offwhite";

  const dropdownShadow = isOffWhite
    ? "0 10px 40px rgba(43,33,24,0.18)"
    : "0 10px 40px rgba(0,0,0,0.55)";

  const liveShadow = isOffWhite
    ? "0 10px 40px rgba(43,33,24,0.20)"
    : "0 10px 40px rgba(0,0,0,0.45)";

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const getStoredUser = () => {
    try {
      const possibleKeys = [
        "user",
        "currentUser",
        "authUser",
        "loggedInUser",
      ];

      for (const key of possibleKeys) {
        const value = sessionStorage.getItem(key);
        if (!value) continue;

        const parsed = JSON.parse(value);
        if (parsed?._id || parsed?.id || parsed?.user?._id) {
          return parsed.user || parsed;
        }
      }
      return null;
    } catch (error) {
      console.error("User session read error:", error);
      return null;
    }
  };

  const getUserId = () => {
    const user = getStoredUser();
    return user?._id || user?.id || null;
  };

  // ============================================================
  // ✅ Font Awesome icon by notification type
  // ============================================================
  const getNotificationIconClass = (type) => {
    switch (type) {
      case "Review_Reminder":
        return "fa-solid fa-star";
      case "Booking":
        return "fa-solid fa-calendar-check";
      case "Property_Approved":
        return "fa-solid fa-circle-check";
      case "Property_Rejected":
        return "fa-solid fa-circle-xmark";
      case "Inspection_Approved":
        return "fa-solid fa-clipboard-check";
      case "Inspection_Rejected":
        return "fa-solid fa-clipboard-xmark";
      case "Inspection_Submitted":
        return "fa-solid fa-clipboard-list";
      case "Verification_Request":
        return "fa-solid fa-user-shield";
      case "New_Listing":
        return "fa-solid fa-house-circle-check";
      case "Payment":
        return "fa-solid fa-money-bill-wave";
      case "System":
        return "fa-solid fa-gear";
      default:
        return "fa-solid fa-bell";
    }
  };

  const showLiveNotification = useCallback((notification) => {
    if (!notification) return;

    setLiveNotification({
      _id: notification._id || `live-${Date.now()}`,
      title: notification.title || "New Notification",
      message:
        notification.message ||
        notification.body ||
        "You have a new notification.",
      type: notification.type || "System",
      isRead: false,
      createdAt: notification.createdAt || new Date().toISOString(),
    });

    if (liveTimerRef.current) {
      clearTimeout(liveTimerRef.current);
    }

    liveTimerRef.current = setTimeout(() => {
      setLiveNotification(null);
    }, 6000);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = sessionStorage.getItem("token");

      if (!token) {
        setNotifications([]);
        previousNotificationsRef.current = [];
        firstNotificationLoadRef.current = true;
        return;
      }

      const res = await fetch(`${SERVER_ORIGIN}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-active-role": activeRole || "tenant",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Notification request failed:", res.status);
        return;
      }

      const data = await res.json();

      const notificationList = Array.isArray(data)
        ? data
        : Array.isArray(data.notifications)
        ? data.notifications
        : [];

      const previousNotifications = previousNotificationsRef.current;

      if (!firstNotificationLoadRef.current) {
        const newNotification = notificationList.find(
          (notification) =>
            !previousNotifications.some(
              (oldNotification) => oldNotification._id === notification._id
            )
        );

        if (newNotification) {
          showLiveNotification(newNotification);
        }
      }

      previousNotificationsRef.current = notificationList;
      firstNotificationLoadRef.current = false;
      setNotifications(notificationList);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  }, [activeRole, showLiveNotification]);

  useEffect(() => {
    firstNotificationLoadRef.current = true;
    previousNotificationsRef.current = [];
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userId = getUserId();

    if (!token || !userId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(SERVER_ORIGIN, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Notification Socket connected:", socket.id);
      socket.emit("authenticate", String(userId));
    });

    socket.on("new-notification", (payload) => {
      console.log("New notification received:", payload);

      const incomingNotification = {
        _id: payload?._id || `live-${Date.now()}`,
        title: payload?.title || "New Notification",
        message: payload?.message || "You have a new notification.",
        type: payload?.type || "System",
        url: payload?.url || "/notifications",
        propertyId: payload?.propertyId || null,
        bookingId: payload?.bookingId || null,
        createdAt: payload?.createdAt || new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => {
        const exists = prev.some(
          (notification) => notification._id === incomingNotification._id
        );
        if (exists) return prev;
        return [incomingNotification, ...prev];
      });

      previousNotificationsRef.current = [
        incomingNotification,
        ...previousNotificationsRef.current.filter(
          (notification) =>
            notification._id !== incomingNotification._id
        ),
      ];

      showLiveNotification(incomingNotification);
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    });

    socket.on("connect_error", (error) => {
      console.error("Notification Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Notification Socket disconnected:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("new-notification");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [activeRole, showLiveNotification]);

  useEffect(() => {
    const handleNewNotification = (event) => {
      const payload = event.detail || {};
      if (payload.title || payload.message) {
        showLiveNotification(payload);
      }
      fetchNotifications();
    };

    window.addEventListener("new-notification", handleNewNotification);
    return () => {
      window.removeEventListener("new-notification", handleNewNotification);
    };
  }, [fetchNotifications, showLiveNotification]);

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      fetchNotifications();
    };

    window.addEventListener("notifications-updated", handleNotificationsUpdated);
    return () => {
      window.removeEventListener(
        "notifications-updated",
        handleNotificationsUpdated
      );
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleRoleSwitch = () => {
      firstNotificationLoadRef.current = true;
      previousNotificationsRef.current = [];
      fetchNotifications();
    };

    window.addEventListener("role-switched", handleRoleSwitch);
    return () => {
      window.removeEventListener("role-switched", handleRoleSwitch);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications();
      }
    };

    const handleWindowFocus = () => {
      fetchNotifications();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    return () => {
      if (liveTimerRef.current) {
        clearTimeout(liveTimerRef.current);
      }
    };
  }, []);

  const handleBellClick = () => {
    setIsOpen((prev) => !prev);
    fetchNotifications();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${SERVER_ORIGIN}/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole || "tenant",
          },
        }
      );

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${SERVER_ORIGIN}/api/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-active-role": activeRole || "tenant",
          },
        }
      );

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }

    setIsOpen(false);

    const type = notif.type || "System";

    switch (type) {
      case "Review_Reminder":
        if (notif.propertyId) {
          navigate(`/property/${notif.propertyId}#reviews`);
        } else {
          navigate("/mybooking");
        }
        break;

      case "Booking":
        navigate("/mybooking");
        break;

      case "Property_Approved":
      case "Property_Rejected":
      case "Inspection_Approved":
      case "Inspection_Rejected":
      case "Verification_Request":
      case "New_Listing":
        if (notif.propertyId) {
          navigate(`/property/${notif.propertyId}`);
        } else {
          navigate("/notifications");
        }
        break;

      case "Payment":
        navigate("/mybooking");
        break;

      default:
        navigate("/notifications");
    }
  };

  return (
    <>
      {liveNotification && (
        <div className="fixed top-5 right-5 z-[99999] w-[360px] max-w-[calc(100vw-24px)]">
          <div
            className="relative rounded-xl p-4 transition-all duration-300"
            style={{
              backgroundColor: "var(--theme-surface)",
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 40%, transparent)",
              boxShadow: liveShadow,
            }}
          >
            <button
              type="button"
              onClick={() => setLiveNotification(null)}
              className="absolute top-2 right-3 text-lg font-bold cursor-pointer transition-colors duration-200"
              style={{ color: "var(--theme-accent)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--theme-accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--theme-accent)";
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-start gap-3 pr-5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--theme-accent) 15%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
                }}
              >
                <i
                  className={`${getNotificationIconClass(
                    liveNotification.type
                  )} text-sm`}
                  style={{ color: "var(--theme-accent)" }}
                ></i>
              </div>

              <div className="min-w-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--theme-accent)" }}
                >
                  {liveNotification.title || "New Notification"}
                </p>

                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: "var(--theme-muted-light)" }}
                >
                  {liveNotification.message || "You have a new notification."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleBellClick}
          className="relative p-2 rounded-full transition-all duration-300 cursor-pointer"
          style={{ color: "var(--theme-accent)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--theme-accent-hover)";
            e.currentTarget.style.backgroundColor =
              "color-mix(in srgb, var(--theme-accent) 10%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--theme-accent)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <FaBell className="text-xl" />

          {unreadCount > 0 && (
            <span
              className="absolute top-0 right-0 text-[var(--theme-button-text)] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--theme-danger)" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div
            className="
              fixed top-[70px] right-2
              w-72 max-w-[calc(100vw-1rem)]
              sm:absolute sm:top-auto sm:left-auto sm:right-0
              sm:mt-3 sm:w-80 sm:max-w-[calc(100vw-1rem)]
              rounded-xl
              z-[9999]
              overflow-hidden
              animate-fadeDown
            "
            style={{
              backgroundColor: "var(--theme-surface)",
              border:
                "1px solid color-mix(in srgb, var(--theme-accent) 30%, transparent)",
              boxShadow: dropdownShadow,
            }}
          >
            <div
              className="px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center gap-2"
              style={{ borderBottom: "1px solid var(--theme-border)" }}
            >
              <h3
                className="text-xs sm:text-sm font-bold"
                style={{ color: "var(--theme-text)" }}
              >
                Notifications
              </h3>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] sm:text-xs cursor-pointer hover:underline whitespace-nowrap transition-colors duration-200"
                  style={{ color: "var(--theme-accent)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--theme-accent-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--theme-accent)";
                  }}
                >
                  <i className="fa-solid fa-check-double mr-1"></i>
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[45vh] sm:max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: !notif.isRead
                        ? "var(--theme-card)"
                        : "transparent",
                      borderBottom: "1px solid var(--theme-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--theme-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = !notif.isRead
                        ? "var(--theme-card)"
                        : "transparent";
                    }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--theme-accent) 12%, transparent)",
                            border:
                              "1px solid color-mix(in srgb, var(--theme-accent) 25%, transparent)",
                          }}
                        >
                          <i
                            className={`${getNotificationIconClass(
                              notif.type
                            )} text-[10px]`}
                            style={{ color: "var(--theme-accent)" }}
                          ></i>
                        </div>

                        <p
                          className="text-xs sm:text-sm font-bold min-w-0 break-words"
                          style={{
                            color: !notif.isRead
                              ? "var(--theme-text)"
                              : "var(--theme-muted-dark)",
                          }}
                        >
                          {notif.title}
                        </p>
                      </div>

                      <span
                        className="text-[9px] sm:text-[10px] whitespace-nowrap shrink-0"
                        style={{ color: "var(--theme-muted-dark)" }}
                      >
                        {notif.createdAt
                          ? new Date(notif.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <p
                      className="text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed pl-10"
                      style={{ color: "var(--theme-muted-light)" }}
                    >
                      {notif.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <i
                    className="fa-regular fa-bell-slash text-2xl mb-2"
                    style={{ color: "var(--theme-muted-dark)" }}
                  ></i>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--theme-muted-dark)" }}
                  >
                    No new notifications
                  </p>
                </div>
              )}
            </div>

            <div
              className="px-3 sm:px-4 py-2.5 sm:py-2 text-center"
              style={{ borderTop: "1px solid var(--theme-border)" }}
            >
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-[11px] sm:text-xs font-bold transition-colors duration-200"
                style={{ color: "var(--theme-accent)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--theme-accent-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--theme-accent)";
                }}
              >
                View All Notifications
                <i className="fa-solid fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;