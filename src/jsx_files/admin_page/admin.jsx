import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/admin_page/admin.css";
import { loginAdmin } from "../../utils/authStorage";
import { useAuth } from "../../context/AuthContext";

export default function Admin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleLogin = () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = loginAdmin(form.email.trim(), form.password);
      setLoading(false);
      if (result.success) {
        login(result.user);
        navigate("/admin_dashboard");
      } else {
        setError(result.error);
      }
    }, 400);
  };

  return (
    <div className="admin-bg">
      <div className="admin-card">
        <div className="admin-brand">
          <i className="fa-solid fa-leaf"></i>
          Krishi<span>Bondhu</span>
        </div>

        <h2>Admin Control</h2>
        <p>KrishiBondhu Management Panel</p>

        {error && (
          <div className="auth-error-banner" style={{ marginBottom: 16 }}>
            <i className="fa-solid fa-circle-exclamation" />
            {error}
          </div>
        )}

        <div className="input-group">
          <i className="fa-solid fa-envelope"></i>
          <input
            type="email"
            placeholder="admin@krishibondhu.com"
            value={form.email}
            onChange={(e) => upd("email", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            required
          />
        </div>

        <div className="input-group" style={{ position: "relative" }}>
          <i className="fa-solid fa-lock"></i>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => upd("password", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            required
          />
          <i
            className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPw((p) => !p)}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8aaa8c",
              cursor: "pointer",
              fontSize: 13,
            }}
          />
        </div>

        <div className="admin-options">
          <div></div>
          <a href="#">Forgot password?</a>
        </div>

        <button className="admin-btn" onClick={handleLogin} disabled={loading}>
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Authenticating…
            </>
          ) : (
            "Secure Login"
          )}
        </button>

        <div className="admin-footer">
          Authorized personnel only • Secure Access
        </div>
      </div>
    </div>
  );
}
