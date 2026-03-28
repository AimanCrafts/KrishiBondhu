import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    if (user.role === "farmer") return <Navigate to="/dashboard" replace />;
    if (user.role === "business")
      return <Navigate to="/buyer_dashboard" replace />;
    if (user.role === "admin")
      return <Navigate to="/admin_dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
