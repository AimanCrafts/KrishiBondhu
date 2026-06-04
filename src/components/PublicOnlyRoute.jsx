import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARD = {
  farmer: "/farmer_dashboard",
  business: "/buyer_dashboard",
  admin: "/admin_dashboard",
};

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Already logged in → go to your dashboard
  if (user) {
    return <Navigate to={ROLE_DASHBOARD[user.role] || "/"} replace />;
  }

  return children;
}