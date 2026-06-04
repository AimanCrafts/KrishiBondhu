import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARD = {
  farmer: "/farmer_dashboard",
  business: "/buyer_dashboard",
  admin: "/admin_dashboard",
};

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Not logged in → login page
  if (!user) return <Navigate to="/login" replace />;

  // Wrong role → their own dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={ROLE_DASHBOARD[user.role] || "/"} replace />;
  }

  return children;
}
