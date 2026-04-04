import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    const ROLE_PATHS = {
      farmer: "/farmer_dashboard",
      business: "/buyer_dashboard",
      admin: "/admin_dashboard",
    };
    const userHome = ROLE_PATHS[user.role] || "/";
    return <Navigate to={userHome} replace />;
  }

  return children;
}
