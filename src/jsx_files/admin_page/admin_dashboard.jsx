import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, approveUser } from "../../utils/authStorage";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  const handleApprove = (userId) => {
    approveUser(userId);
    setUsers(getAllUsers());
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const farmers = users.filter((u) => u.role === "farmer");
  const buyers = users.filter((u) => u.role === "business");
  const pending = users.filter((u) => u.status === "pending");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f5",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Top bar */}
      <nav
        style={{
          background: "#1a2e1b",
          color: "#fff",
          padding: "0 5%",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          <i
            className="fa-solid fa-leaf"
            style={{ color: "#4caf50", marginRight: 8 }}
          />
          KrishiBondhu <span style={{ color: "#4caf50" }}>Admin</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          <i
            className="fa-solid fa-right-from-bracket"
            style={{ marginRight: 6 }}
          />
          Log Out
        </button>
      </nav>

      <div style={{ padding: "40px 5%" }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            color: "#1a2e1b",
            marginBottom: 8,
          }}
        >
          Dashboard Overview
        </h1>
        <p style={{ color: "#666", marginBottom: 32 }}>
          Manage all registered users and pending verifications.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {[
            {
              label: "Total Users",
              value: users.length,
              icon: "fa-users",
              color: "#2e7d32",
            },
            {
              label: "Farmers",
              value: farmers.length,
              icon: "fa-tractor",
              color: "#1565c0",
            },
            {
              label: "Buyers",
              value: buyers.length,
              icon: "fa-building",
              color: "#6a1b9a",
            },
            {
              label: "Pending Approval",
              value: pending.length,
              icon: "fa-clock",
              color: "#e65100",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                borderLeft: `4px solid ${s.color}`,
              }}
            >
              <i
                className={`fa-solid ${s.icon}`}
                style={{
                  fontSize: 22,
                  color: s.color,
                  marginBottom: 10,
                  display: "block",
                }}
              />
              <div
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#1a2e1b",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee" }}>
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: 18,
                color: "#1a2e1b",
                margin: 0,
              }}
            >
              All Registered Users
            </h2>
          </div>
          {users.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#999" }}>
              <i
                className="fa-solid fa-users"
                style={{ fontSize: 40, marginBottom: 12, display: "block" }}
              />
              No users registered yet.
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ background: "#f8faf8" }}>
                  {[
                    "User ID",
                    "Name",
                    "Role",
                    "Phone",
                    "Email",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        color: "#555",
                        fontWeight: 600,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{
                      borderTop: "1px solid #f0f0f0",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#2e7d32",
                        fontWeight: 600,
                      }}
                    >
                      {u.id}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        color: "#1a2e1b",
                        fontWeight: 500,
                      }}
                    >
                      {u.name || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background:
                            u.role === "farmer" ? "#e8f5e9" : "#f3e5f5",
                          color: u.role === "farmer" ? "#2e7d32" : "#6a1b9a",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          textTransform: "capitalize",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {u.phone ? `+880 ${u.phone}` : "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#555" }}>
                      {u.email || "—"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          background:
                            u.status === "active" ? "#e8f5e9" : "#fff3e0",
                          color: u.status === "active" ? "#2e7d32" : "#e65100",
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {u.status === "pending" ? (
                        <button
                          onClick={() => handleApprove(u.id)}
                          style={{
                            background: "#2e7d32",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 14px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Approve
                        </button>
                      ) : (
                        <span style={{ color: "#ccc", fontSize: 12 }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
