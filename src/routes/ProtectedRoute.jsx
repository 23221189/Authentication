import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export const DASHBOARD_BY_ROLE = {
  tenant: "/mybooking",
  owner: "/podashboard",
  agent: "/agent/dashboard",
  admin: "/admin/dashboard",
};

const ProtectedRoute = ({ roles, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p>Loading..</p>;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallback = DASHBOARD_BY_ROLE[user.role] || "/";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
