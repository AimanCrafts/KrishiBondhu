import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

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
import CropDetail from "./jsx_files/farmerDashboard_page/crop_detail";
import CropDisease from "./jsx_files/farmerDashboard_page/crop_disease";
import DiseaseDetail from "./jsx_files/farmerDashboard_page/disease_detail";
import Settings from "./jsx_files/farmerDashboard_page/settings";
import TermsAndConditions from "./jsx_files/legal_page/terms_and_conditions";
import PrivacyPolicy from "./jsx_files/legal_page/privacy_policy";

function HomePage() {
  return (
    <>
      <Header />
      <Body />
      <Footer />
    </>
  );
}

// ← REMOVED the two floating <Route> lines that were here

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ── */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <HomePage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/admin_login"
            element={
              <PublicOnlyRoute>
                <AdminLogin />
              </PublicOnlyRoute>
            }
          />

          {/* ── Legal (open to all) ── */}
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* ── Farmer ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer_dashboard"
            element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop_library"
            element={
              <ProtectedRoute allowedRole="farmer">
                <CropManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop_detail/:id"
            element={
              <ProtectedRoute allowedRole="farmer">
                <CropDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop_disease"
            element={
              <ProtectedRoute allowedRole="farmer">
                <CropDisease />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disease_detail/:id"
            element={
              <ProtectedRoute allowedRole="farmer">
                <DiseaseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRole="farmer">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ── Buyer ── */}
          <Route
            path="/buyer_dashboard"
            element={
              <ProtectedRoute allowedRole="business">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/marketplace"
            element={
              <ProtectedRoute allowedRole="business">
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRole="business">
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/farmers"
            element={
              <ProtectedRoute allowedRole="business">
                <FarmerDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/profile"
            element={
              <ProtectedRoute allowedRole="business">
                <BuyerProfile />
              </ProtectedRoute>
            }
          />

          {/* ── Admin ── */}
          <Route
            path="/admin_dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
