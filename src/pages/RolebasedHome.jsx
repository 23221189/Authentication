import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Home from "./Home";

const RoleBasedHome = () => {
  const { user, activeRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex items-center justify-center transition-colors duration-300">
        <div className="w-12 h-12 border-4 border-[var(--theme-border)] border-t-[var(--theme-accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  const userRoles = user?.roles?.length
    ? [...new Set([...user.roles, user.role])]
    : [user?.role].filter(Boolean);

  const effectiveRole =
    activeRole && userRoles.includes(activeRole)
      ? activeRole
      : user?.role;

  if (effectiveRole === "owner") {
    return <Navigate to="/podashboard" replace />;
  }

  if (effectiveRole === "agent") {
    return <Navigate to="/agent/dashboard" replace />;
  }

  if (effectiveRole === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Home />;
};

export default RoleBasedHome;