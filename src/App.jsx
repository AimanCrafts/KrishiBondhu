import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./jsx_files/home_page/header";
import Body from "./jsx_files/home_page/body";
import Footer from "./jsx_files/home_page/footer";
import Login from "./jsx_files/login_page/login";
import AdminLogin from "./jsx_files/login_page/AdminLogin";
import Signup from "./jsx_files/signup_page/signup";
import FarmerDashboard from "./jsx_files/farmerDashboard_page/farmer_dashboard";
import BuyerDashboard from "./jsx_files/buyer_page/buyer_dashboard";
import AdminDashboard from "./jsx_files/admin_page/admin_dashboard";
import CropManagement from "./jsx_files/farmerDashboard_page/crop_management";
import Marketplace from "./jsx_files/buyer_page/marketplace";
import Orders from "./jsx_files/buyer_page/orders";
import FarmerDirectory from "./jsx_files/buyer_page/farmer_directory";
import BuyerProfile from "./jsx_files/buyer_page/buyer_profile";

function HomePage() {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin_login" element={<AdminLogin />} />
          {/* Farmer dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer_dashboard"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          {/* Buyer / Business dashboard */}
          <Route
            path="/buyer_dashboard"
            element={
              <ProtectedRoute role="business">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/marketplace"
            element={
              <ProtectedRoute role="business">
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute role="business">
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/farmers"
            element={
              <ProtectedRoute role="business">
                <FarmerDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/profile"
            element={
              <ProtectedRoute role="business">
                <BuyerProfile />
              </ProtectedRoute>
            }
          />

          {/* Crop Library */}
          <Route
            path="/crop_library"
            element={
              <ProtectedRoute>
                <CropManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin dashboard */}
          <Route
            path="/admin_dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
