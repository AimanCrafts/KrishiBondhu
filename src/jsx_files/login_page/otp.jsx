// src/jsx_files/login_page/otp.jsx

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginWithOtp } from "../../utils/authStorage";
import { useAuth } from "../../context/AuthContext";

export default function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // phone passed from login page
  const phone = location.state?.phone || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyOtp = () => {
    setError("");

    if (otp.length !== 5) {
      return setError("OTP must be 5 digits.");
    }

    setLoading(true);

    setTimeout(() => {
      const result = loginWithOtp(phone, otp);
      setLoading(false);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // ✅ Save user in context
      login(result.user);

      // ✅ Redirect based on role
      if (result.user.role === "farmer") {
        navigate("/dashboard");
      } else if (result.user.role === "business") {
        navigate("/buyer_dashboard");
      } else if (result.user.role === "admin") {
        navigate("/admin_dashboard");
      } else {
        navigate("/");
      }
    }, 400);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2>Enter OTP</h2>

        <p style={{ fontSize: "13px", marginBottom: "12px" }}>
          OTP sent to +880 {phone}
        </p>

        {error && <div className="auth-error-banner">{error}</div>}

        <input
          type="text"
          placeholder="Enter 5 digit OTP"
          maxLength={5}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <button onClick={verifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
