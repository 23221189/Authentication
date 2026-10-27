import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  loginUser,
  loginAdmin,
  logoutUser,
  getCurrentUser,
  registerUser,
  switchAccountApi,
} from "../api/authApi";
import {
  getOwnerProperties,
  getOwnerBookings,
  getDashboardSummary,
  updateBookingStatusApi,
  getOwnerReview,
  getOwnerPayment,
} from "../api/dashboardApi";
import { deletePropertyById } from "../api/PropertyApi";

const AuthContext = createContext(null);

const DASHBOARD_BY_ROLE = {
  tenant: "/",
  owner: "/podashboard",
  agent: "/agent/dashboard",
  admin: "/admin/dashboard",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeRole, setActiveRole] = useState(
    sessionStorage.getItem("activeRole") || null
  );

  const [ownerBookings, setOwnerBookings] = useState([]);
  const [ownerProperties, setOwnerProperties] = useState([]);
  const [ownerStats, setOwnerStats] = useState(null);
  const [ownerReview, setOwnerReview] = useState([]);
  const [ownerPayment, setOwnerPayment] = useState([]);
  const [ownerDashboardLoading, setOwnerDashboardLoading] = useState(false);
  const [ownerDashboardError, setOwnerDashboardError] = useState(null);

  const ownerSession = activeRole === "owner" ? user : null;

  const fetchOwnerDashboard = useCallback(async () => {
    setOwnerDashboardLoading(true);
    setOwnerDashboardError(null);
    try {
      const [summaryRes, propertiesRes, bookingsRes, reviewRes, paymentRes] =
        await Promise.allSettled([
          getDashboardSummary(),
          getOwnerProperties(),
          getOwnerBookings(),
          getOwnerReview(),
          getOwnerPayment(),
        ]);

      if (summaryRes.status === "fulfilled") {
        setOwnerStats(summaryRes.value.data?.stats || null);
      }

      if (propertiesRes.status === "fulfilled") {
        const rawProperties = propertiesRes.value.data?.properties || [];
        const mapped = rawProperties.map((p) => ({
          _id: p._id,
          id: p._id,
          name: p.title,
          propertyName: p.title,
          location:
            [p.address?.area, p.address?.city].filter(Boolean).join(", ") ||
            p.address?.street ||
            "Location not available",
          address: [p.address?.street, p.address?.area, p.address?.city]
            .filter(Boolean)
            .join(", "),
          rooms: p.totalRooms || 0,
          availableRooms: p.availableRooms || 0,
          maxGuests: p.maxGuests || 0,
          rent: p.pricing?.monthlyRent || 0,
          dailyRent: p.pricing?.dailyRent || 0,
          status:
            p.status === "published"
              ? "Active"
              : p.status === "pending"
              ? "Pending Approval"
              : p.status,
          earnings: 0,
          bookingsCount: 0,
          images: p.images || [],
          facilities: p.facilities || [],
        }));
        setOwnerProperties(mapped);
      }

      if (bookingsRes.status === "fulfilled") {
        const rawBookings = bookingsRes.value.data?.bookings || [];
        const mapped = rawBookings.map((b) => ({
          _id: b._id,
          id: b._id,
          tenant: b.tenant?.fullname || "Unknown Tenant",
          tenantName: b.tenant?.fullname || "Unknown Tenant",
          tenantEmail: b.tenant?.email || "",
          property: b.property?.title || "Property",
          propertyName: b.property?.title || "Property",
          propertyId: b.property?._id || "",
          status: b.status
            ? b.status.charAt(0).toUpperCase() + b.status.slice(1)
            : "Pending",
          checkIn: b.checkInDate
            ? new Date(b.checkInDate).toLocaleDateString("en-PK")
            : "-",
          checkOut: b.checkOutDate
            ? new Date(b.checkOutDate).toLocaleDateString("en-PK")
            : "-",
          totalAmount: b.totalAmount || 0,
          roomId: b.room || "",
          roomNumber: b.roomNumber ?? null,
          roomAcType: b.roomAcType || "",
          roomCategory: b.roomCategory || "",
          room:
            b.roomNumber != null
              ? `Room ${b.roomNumber}${
                  b.roomAcType || b.roomCategory
                    ? ` (${[b.roomAcType, b.roomCategory]
                        .filter(Boolean)
                        .join(" • ")})`
                    : ""
                }`
              : "Room",
          guests: b.guests || 1,
          createdAt: b.createdAt,
        }));
        setOwnerBookings(mapped);

        if (propertiesRes.status === "fulfilled") {
          setOwnerProperties((prev) => {
            const bookingsByProperty = {};
            const earningsByProperty = {};
            rawBookings.forEach((b) => {
              const pId = b.property?._id;
              if (pId) {
                bookingsByProperty[pId] = (bookingsByProperty[pId] || 0) + 1;
                if (["confirmed", "approved"].includes(b.status)) {
                  earningsByProperty[pId] =
                    (earningsByProperty[pId] || 0) + (b.totalAmount || 0);
                }
              }
            });
            return prev.map((p) => ({
              ...p,
              bookingsCount: bookingsByProperty[p._id] || 0,
              earnings: earningsByProperty[p._id] || 0,
            }));
          });
        }
      }

      if (reviewRes.status === "fulfilled") {
        const review = reviewRes.value.data?.reviews || [];
        const mappedReview = review.map((r) => ({
          id: r._id,
          tenantName: r.user?.fullname || "Tenant",
          propertyName: r.property?.title || "Property",
          rating: r.rating,
          comment: r.comment,
          text: r.comment,
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-PK")
            : "Date not available",
          createdAt: r.createdAt,
        }));
        setOwnerReview(mappedReview);
      }

      if (paymentRes.status === "fulfilled") {
        const payment = paymentRes.value.data?.payment || [];
        const mappedPayment = payment.map((p) => ({
          _id: p._id,
          id: p._id,
          bookingId: p.booking?._id || p.booking,
          tenantName: p.tenant?.fullname || "Tenant",
          propertyName: p.property?.title || "Property",
          room: p.booking?.room || "Room",
          amount: p.amount,
          rent: p.amount,
          source: p.method === "online" ? "Online" : "Arrival",
          status:
            p.status === "paid"
              ? "Paid"
              : p.status === "refunded"
              ? "Refunded"
              : p.status === "partially_refund"
              ? "Partially Refunded"
              : "Pending",
          transfer: p.transferredToOwner,
          date: p.paidAt
            ? new Date(p.paidAt).toLocaleDateString("en-PK")
            : p.createdAt
            ? new Date(p.createdAt).toLocaleDateString("en-PK")
            : "Date not available",
          createdAt: p.createdAt,
        }));
        setOwnerPayment(mappedPayment);
      }

      const allFailed = [
        summaryRes,
        propertiesRes,
        bookingsRes,
        reviewRes,
        paymentRes,
      ].every((r) => r.status === "rejected");
      if (allFailed) {
        setOwnerDashboardError(
          "Dashboard data load nahi ho saka. Please refresh karein."
        );
      }
    } catch (err) {
      console.error("Owner dashboard fetch error:", err);
      setOwnerDashboardError(
        "Dashboard data load nahi ho saka. Please refresh karein."
      );
    } finally {
      setOwnerDashboardLoading(false);
    }
  }, []);

  const updateOwnerBooking = useCallback(async (bookingId, status) => {
    if (!bookingId) return;
    try {
      await updateBookingStatusApi(bookingId, status.toLowerCase());
      setOwnerBookings((current) =>
        current.map((booking) =>
          (booking.id || booking._id) === bookingId
            ? {
                ...booking,
                status: status.charAt(0).toUpperCase() + status.slice(1),
              }
            : booking
        )
      );
    } catch (err) {
      console.error("Booking status update failed:", err);
      throw err;
    }
  }, []);

  const deleteOwnerProperty = useCallback(async (propertyId) => {
    try {
      await deletePropertyById(propertyId);
      setOwnerProperties((prev) =>
        prev.filter((p) => (p._id || p.id) !== propertyId)
      );
      return { success: true };
    } catch (err) {
      console.error("Delete property failed:", err);
      throw err;
    }
  }, []);

  const switchRole = useCallback(
    async (newRole) => {
      if (!newRole) return;

      const userRoles = user?.roles?.length
        ? [...new Set([...user.roles, user.role])]
        : [user?.role].filter(Boolean);

      if (!userRoles.includes(newRole)) {
        alert(
          `You don't have ${newRole} access. Please register as ${newRole} first.`
        );
        return;
      }

      try {
        const { data } = await switchAccountApi(newRole);
        if (data.token) sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("activeRole", newRole);
        sessionStorage.setItem("pg_has_account", newRole);
        setActiveRole(newRole);
        setUser(data.user);

        window.dispatchEvent(
          new CustomEvent("role-switched", { detail: newRole })
        );
        window.location.href = DASHBOARD_BY_ROLE[newRole] || "/";
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Could not switch account. Please try again."
        );
      }
    },
    [user]
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data.user);

        const storedRole = sessionStorage.getItem("activeRole");

        const userRoles = data.user?.roles?.length
          ? [...new Set([...data.user.roles, data.user.role])]
          : [data.user?.role].filter(Boolean);

        if (storedRole && userRoles.includes(storedRole)) {
          setActiveRole(storedRole);
        } else {
          const fallback = data.user?.role || "tenant";
          setActiveRole(fallback);
          sessionStorage.setItem("activeRole", fallback);
        }
      } catch {
        setUser(null);
        setActiveRole(null);
        sessionStorage.removeItem("activeRole");
        sessionStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (user && activeRole === "owner") {
      fetchOwnerDashboard();
    } else {
      setOwnerProperties([]);
      setOwnerBookings([]);
      setOwnerStats(null);
      setOwnerReview([]);
      setOwnerPayment([]);
    }
  }, [user, activeRole, fetchOwnerDashboard]);

  const login = useCallback(async ({ email, password, role }) => {
    setError(null);
    try {
      const { data } = await loginUser({ email, password, role });
      if (data.token) sessionStorage.setItem("token", data.token);

      const chosenRole = role || data.user?.role || "tenant";
      sessionStorage.setItem("activeRole", chosenRole);
      sessionStorage.setItem("pg_has_account", chosenRole);

      setActiveRole(chosenRole);
      setUser(data.user);

      return { ...data.user, activeRole: chosenRole };
    } catch (err) {
      const message =
        err.response?.data?.message || "login failed. please try again.";
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loginAsAdmin = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const { data } = await loginAdmin({ email, password });
      if (data.token) sessionStorage.setItem("token", data.token);

      sessionStorage.setItem("activeRole", "admin");
      setActiveRole("admin");

      setUser(data.user);
      return { ...data.user, activeRole: "admin" };
    } catch (err) {
      const message =
        err.response?.data?.message || "login failed. Please try again.";
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (FormData) => {
    setError(null);
    try {
      const { data } = await registerUser(FormData);

      if (data.token) {
        sessionStorage.setItem("token", data.token);
        setUser(data.user);
      }
      return data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
      throw new Error(message);
    }
  }, []);

  const handleLogout = async (redirectPath = "/") => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("activeRole");
    sessionStorage.removeItem("pg_has_account");
    sessionStorage.clear();

    setUser(null);
    setActiveRole(null);

    try {
      await Promise.race([
        logoutUser(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Logout timeout")), 2000)
        ),
      ]);
    } catch (err) {
      console.warn("Backend logout warning:", err.message);
    }
    window.location.replace(redirectPath);
  };

  const value = {
    user,
    loading,
    error,
    activeRole,
    switchRole,
    login,
    loginAsAdmin,
    register,
    handleLogout,
    setUser,
    ownerSession,
    ownerProperties,
    setOwnerProperties,
    ownerBookings,
    setOwnerBookings,
    ownerStats,
    ownerReview,
    ownerPayment,
    ownerDashboardLoading,
    ownerDashboardError,
    updateOwnerBooking,
    fetchOwnerDashboard,
    deleteOwnerProperty,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};