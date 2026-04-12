import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginAdmin } from "../../utils/authStorage";
export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) return setError("Email and password required.");

    setLoading(true);
    const result = await loginAdmin(email, password);
    setLoading(false);

    if (!result.success) return setError(result.error);

    login(result.user);
    navigate("/admin_dashboard", { replace: true });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 36px",
          width: 380,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <i
            className="fa-solid fa-shield-halved"
            style={{ fontSize: 36, color: "#1a237e" }}
          />
          <h2
            style={{
              margin: "12px 0 4px",
              fontFamily: "Space Grotesk,sans-serif",
            }}
          >
            Admin Panel
          </h2>
          <p style={{ color: "#888", fontSize: 13 }}>
            KrishiBondhu Administration
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fdecea",
              border: "1px solid #f5c6cb",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              fontSize: 13,
              color: "#c0392b",
            }}
          >
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              display: "block",
              marginBottom: 6,
            }}
          >
            Admin Email
          </label>
          <input
            type="email"
            placeholder="admin@krishibondhu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              display: "block",
              marginBottom: 6,
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 14,
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg,#1a237e,#283593)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Signing in…
            </>
          ) : (
            <>
              <i className="fa-solid fa-right-to-bracket" /> Sign In as Admin
            </>
          )}
        </button>
      </div>
    </div>
  );
}
