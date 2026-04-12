// src/components/BuyerLayout.jsx
// Shared shell for all buyer/business pages — topbar + sidebar + main slot
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css_files/buyer_page/buyer_dashboard.css"; // shared topbar/sidebar styles

const NAV_ITEMS = [
  { id: "overview",     icon: "fa-house",                label: "Overview",         path: "/buyer_dashboard" },
  { id: "marketplace",  icon: "fa-store",                label: "Marketplace",      path: "/buyer/marketplace" },
  { id: "orders",       icon: "fa-box",                  label: "My Orders",        path: "/buyer/orders" },
  { id: "farmers",      icon: "fa-tractor",              label: "Farmer Directory", path: "/buyer/farmers" },
  { id: "analytics",   icon: "fa-chart-pie",            label: "Analytics",        path: "/buyer/analytics" },
];

const TOOL_ITEMS = [
  { id: "invoices",    icon: "fa-file-invoice-dollar",  label: "Invoices",         path: "/buyer/invoices" },
  { id: "profile",     icon: "fa-user-circle",          label: "My Profile",       path: "/buyer/profile" },
  { id: "settings",    icon: "fa-gear",                 label: "Settings",         path: "/buyer/profile#settings" },
];

export default function BuyerLayout({ children, activeNav = "overview" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todayDate, setTodayDate] = useState("");

  const contactPerson = user?.profile?.contactPerson || user?.name || "User";
  const firstLetter   = (contactPerson[0] || "B").toUpperCase();
  const location      = [user?.district, user?.division].filter(Boolean).join(", ") || "Dhaka";

  useEffect(() => {
    const d = new Date();
    setTodayDate(d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  const handleLogout = () => { logout(); navigate("/login"); };
  const go = (path) => { navigate(path); setSidebarOpen(false); };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <div className="bd-root">

        {/* ── TOPBAR ── */}
        <nav className="bd-topbar">
          <a className="bd-brand" onClick={() => go("/buyer_dashboard")} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-leaf" />
            <span className="bd-brand-k">Krishi</span>
            <span className="bd-brand-b">Bondhu</span>
          </a>
          <div className="bd-top-center">
            <i className="fa-regular fa-calendar" />
            <span>{todayDate || "Loading…"}</span>
          </div>
          <div className="bd-top-right">
            <button className="bd-notif-btn" title="Notifications">
              <i className="fa-regular fa-bell" />
              <span className="bd-notif-dot" />
            </button>
            <div className="bd-avatar-wrap">
              <div className="bd-avatar">{firstLetter}</div>
              <div>
                <div className="bd-avatar-name">{contactPerson}</div>
                <div className="bd-avatar-role">{location}</div>
              </div>
            </div>
            <button className="bd-menu-btn" onClick={() => setSidebarOpen(p => !p)}>
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </nav>

        {/* ── OVERLAY ── */}
        <div className={`bd-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

        {/* ── SIDEBAR ── */}
        <nav className={`bd-sidebar${sidebarOpen ? " open" : ""}`}>
          <span className="bd-sidebar-label">Navigation</span>
          {NAV_ITEMS.map(item => (
            <a
              key={item.id}
              className={activeNav === item.id ? "active" : ""}
              onClick={() => go(item.path)}
              style={{ cursor: "pointer" }}
            >
              <i className={`fa-solid ${item.icon}`} /> {item.label}
            </a>
          ))}

          <span className="bd-sidebar-label">Tools</span>
          {TOOL_ITEMS.map(item => (
            <a
              key={item.id}
              className={activeNav === item.id ? "active" : ""}
              onClick={() => go(item.path)}
              style={{ cursor: "pointer" }}
            >
              <i className={`fa-solid ${item.icon}`} /> {item.label}
            </a>
          ))}

          <a onClick={handleLogout} className="bd-sidebar-logout" style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-right-from-bracket" /> Log Out
          </a>
        </nav>

        {/* ── PAGE CONTENT ── */}
        <main className="bd-main">
          {children}
        </main>

      </div>
    </>
  );
}
