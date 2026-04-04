import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/buyer_page/buyer_dashboard.css";

/* ══════════════════════════════════
   STATIC DATA
══════════════════════════════════ */
const RECENT_ORDERS = [
  {
    id: "ORD-4821",
    crop: "Rice (Boro)",
    qty: "5,000 kg",
    price: "৳48/kg",
    total: "৳2,40,000",
    status: "delivered",
    farmer: "Rahim Uddin",
    date: "Jun 12",
  },
  {
    id: "ORD-4820",
    crop: "Red Lentil",
    qty: "2,200 kg",
    price: "৳110/kg",
    total: "৳2,42,000",
    status: "in_transit",
    farmer: "Karim Sheikh",
    date: "Jun 14",
  },
  {
    id: "ORD-4819",
    crop: "Potato",
    qty: "8,000 kg",
    price: "৳32/kg",
    total: "৳2,56,000",
    status: "confirmed",
    farmer: "Fatema Begum",
    date: "Jun 15",
  },
  {
    id: "ORD-4818",
    crop: "Mustard",
    qty: "1,500 kg",
    price: "৳92/kg",
    total: "৳1,38,000",
    status: "pending",
    farmer: "Jalal Ahmed",
    date: "Jun 16",
  },
];

const MARKET_LISTINGS = [
  {
    crop: "Rice (Boro)",
    farmer: "Rahim Uddin",
    location: "Gazipur",
    qty: "12T avail.",
    price: 48,
    change: "+2.1%",
    up: true,
    img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    crop: "Red Lentil",
    farmer: "Karim Sheikh",
    location: "Comilla",
    qty: "3T avail.",
    price: 110,
    change: "+3.2%",
    up: true,
    img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80",
  },
  {
    crop: "Potato",
    farmer: "Fatema Begum",
    location: "Munshiganj",
    qty: "22T avail.",
    price: 32,
    change: "−1.4%",
    up: false,
    img: "https://images.unsplash.com/photo-1553978297-833b17d9f0e0?auto=format&fit=crop&w=600&q=80",
  },
  {
    crop: "Mustard",
    farmer: "Jalal Ahmed",
    location: "Jamalpur",
    qty: "5T avail.",
    price: 92,
    change: "+0.8%",
    up: true,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
  },
];

const SPEND_BARS = [
  { month: "Jan", val: 65 },
  { month: "Feb", val: 82 },
  { month: "Mar", val: 54 },
  { month: "Apr", val: 91 },
  { month: "May", val: 78 },
  { month: "Jun", val: 100 },
];

const STATUS_META = {
  delivered: { label: "Delivered", cls: "bd-status-delivered" },
  in_transit: { label: "In Transit", cls: "bd-status-transit" },
  confirmed: { label: "Confirmed", cls: "bd-status-confirmed" },
  pending: { label: "Pending", cls: "bd-status-pending" },
};

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
  const [todayDate, setTodayDate] = useState("");
  const [barsAnimated, setBarsAnimated] = useState(false);
  const revealRefs = useRef([]);

  const companyName =
    user?.profile?.companyName || user?.name || "Your Company";
  const contactPerson = user?.profile?.contactPerson || user?.name || "User";
  const firstLetter = (contactPerson[0] || "B").toUpperCase();
  const businessType = user?.profile?.businessType || "Food Business";
  const location =
    [user?.profile?.district, user?.profile?.division]
      .filter(Boolean)
      .join(", ") || "Dhaka";

  useEffect(() => {
    const d = new Date();
    setTodayDate(
      d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setBarsAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("bd-vis");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <div className="bd-root">
        {/* ── TOPBAR ── */}
        <nav className="bd-topbar">
          <a className="bd-brand" href="#">
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
            <div
              className="bd-avatar-wrap"
              onClick={() => navigate("/buyer/profile")}
              style={{ cursor: "pointer" }}
            >
              <div className="bd-avatar">{firstLetter}</div>
              <div>
                <div className="bd-avatar-name">{contactPerson}</div>
                <div className="bd-avatar-role">{location}</div>
              </div>
            </div>
            <button
              className="bd-menu-btn"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </nav>

        {/* ── OVERLAY ── */}
        <div
          className={`bd-overlay${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── SIDEBAR ── */}
        <nav className={`bd-sidebar${sidebarOpen ? " open" : ""}`}>
          <span className="bd-sidebar-label">Navigation</span>
          <a
            href="#"
            className={activeNav === "overview" ? "active" : ""}
            onClick={() => {
              setActiveNav("overview");
              setSidebarOpen(false);
            }}
          >
            <i className="fa-solid fa-house" /> Overview
          </a>
          <a
            href="#"
            className={activeNav === "marketplace" ? "active" : ""}
            onClick={() => {
              setActiveNav("marketplace");
              setSidebarOpen(false);
              navigate("/buyer/marketplace");
            }}
          >
            <i className="fa-solid fa-store" /> Marketplace
          </a>
          <a
            href="#"
            className={activeNav === "orders" ? "active" : ""}
            onClick={() => {
              setActiveNav("orders");
              setSidebarOpen(false);
              navigate("/buyer/orders");
            }}
          >
            <i className="fa-solid fa-box" /> My Orders
          </a>
          <a
            href="#"
            className={activeNav === "farmers" ? "active" : ""}
            onClick={() => {
              setActiveNav("farmers");
              setSidebarOpen(false);
              navigate("/buyer/farmers");
            }}
          >
            <i className="fa-solid fa-tractor" /> Farmer Directory
          </a>
          <a href="#" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-chart-pie" /> Analytics
          </a>

          <span className="bd-sidebar-label">Tools</span>
          <a href="#" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-file-invoice-dollar" /> Invoices
          </a>
          <a href="#" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-truck" /> Logistics
          </a>
          <a href="#" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-comments" /> Messages
          </a>
          <a href="#" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-gear" /> Settings
          </a>
          <a href="#" onClick={handleLogout} className="bd-sidebar-logout">
            <i className="fa-solid fa-right-from-bracket" /> Log Out
          </a>
        </nav>

        {/* ── MAIN ── */}
        <main className="bd-main">
          {/* ══ HERO ══ */}
          <section className="bd-hero-strip">
            {/* LEFT */}
            <div className="bd-hero-left">
              <div className="bd-hero-eyebrow">
                <span className="bd-pulse-dot" />
                Verified Business · {businessType}
              </div>
              <h1 className="bd-hero-greeting">
                Good
                <br />
                Morning,
                <br />
                <span>{contactPerson.split(" ")[0]}.</span>
              </h1>
              <p className="bd-hero-sub">
                {companyName} has 2 active orders and 4 new listings matching
                your procurement preferences today.
              </p>
              <div className="bd-hero-stats-row">
                <div className="bd-hstat">
                  <div className="bd-hstat-val bd-val-blue">4</div>
                  <div className="bd-hstat-label">Active Orders</div>
                </div>
                <div className="bd-hstat">
                  <div className="bd-hstat-val">৳8.76L</div>
                  <div className="bd-hstat-label">This Month</div>
                </div>
                <div className="bd-hstat">
                  <div className="bd-hstat-val bd-val-green">23</div>
                  <div className="bd-hstat-label">Farmers Linked</div>
                </div>
              </div>
            </div>

            {/* RIGHT — hero image + status pills */}
            <div className="bd-hero-right">
              <img
                className="bd-hero-img"
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80"
                alt="Market"
              />
              <div className="bd-hero-img-overlay" />
              <div className="bd-hero-right-content">
                <div className="bd-status-pills">
                  <div className="bd-status-pill">
                    <div className="bd-pill-icon bd-pi-ok">
                      <i className="fa-solid fa-truck" />
                    </div>
                    <div className="bd-pill-text">
                      <strong>Order ORD-4820 In Transit</strong>
                      <span>Red Lentil · 2,200 kg · ETA Jun 17</span>
                    </div>
                  </div>
                  <div className="bd-status-pill">
                    <div className="bd-pill-icon bd-pi-warn">
                      <i className="fa-solid fa-triangle-exclamation" />
                    </div>
                    <div className="bd-pill-text">
                      <strong>Price Alert: Potato −1.4%</strong>
                      <span>Good time to place bulk order</span>
                    </div>
                  </div>
                  <div className="bd-status-pill">
                    <div className="bd-pill-icon bd-pi-info">
                      <i className="fa-solid fa-star" />
                    </div>
                    <div className="bd-pill-text">
                      <strong>3 New Farmer Listings</strong>
                      <span>Match your procurement criteria</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ ALERT BANNER ══ */}
          {alertVisible && (
            <div className="bd-alert-banner">
              <i className="fa-solid fa-circle-info bd-alert-icon" />
              <div className="bd-alert-text">
                <strong>Market Notice:</strong> Rice (Boro) prices expected to
                rise 3–5% next week due to Aman season shortfall. Consider
                locking in bulk pricing with verified farmers now.
              </div>
              <button
                className="bd-alert-dismiss"
                onClick={() => setAlertVisible(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          )}

          {/* ══ SPEND ANALYTICS ══ */}
          <section className="bd-analytics-section bd-reveal" ref={addRef}>
            <div className="bd-analytics-inner">
              {/* Spend chart */}
              <div className="bd-spend-card">
                <div className="bd-section-eyebrow">Procurement Analytics</div>
                <h2 className="bd-section-title">Monthly Spend</h2>
                <div className="bd-chart-wrap">
                  {SPEND_BARS.map((b, i) => (
                    <div key={b.month} className="bd-bar-col">
                      <div className="bd-bar-track">
                        <div
                          className="bd-bar-fill"
                          style={{
                            height: barsAnimated ? `${b.val}%` : "0%",
                            transitionDelay: `${i * 0.07}s`,
                          }}
                        />
                      </div>
                      <div className="bd-bar-label">{b.month}</div>
                    </div>
                  ))}
                </div>
                <div className="bd-chart-legend">
                  <span className="bd-legend-dot" /> Monthly Procurement (Lakh
                  BDT)
                </div>
              </div>

              {/* KPI cards */}
              <div className="bd-kpi-grid">
                {[
                  {
                    icon: "fa-box-open",
                    label: "Total Orders",
                    val: "47",
                    sub: "+12 this month",
                    color: "blue",
                  },
                  {
                    icon: "fa-bangladeshi-taka-sign",
                    label: "Total Spend",
                    val: "৳42.3L",
                    sub: "FY 2025–26",
                    color: "green",
                  },
                  {
                    icon: "fa-tractor",
                    label: "Active Farmers",
                    val: "23",
                    sub: "Across 6 districts",
                    color: "teal",
                  },
                  {
                    icon: "fa-star",
                    label: "Avg. Rating",
                    val: "4.7",
                    sub: "From 47 orders",
                    color: "amber",
                  },
                ].map((k) => (
                  <div
                    key={k.label}
                    className={`bd-kpi-card bd-kpi-${k.color}`}
                  >
                    <div className="bd-kpi-icon-wrap">
                      <i className={`fa-solid ${k.icon}`} />
                    </div>
                    <div className="bd-kpi-val">{k.val}</div>
                    <div className="bd-kpi-label">{k.label}</div>
                    <div className="bd-kpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ RECENT ORDERS ══ */}
          <section className="bd-orders-section bd-reveal" ref={addRef}>
            <div className="bd-section-header">
              <div>
                <div className="bd-section-eyebrow">Procurement</div>
                <h2 className="bd-section-title">Recent Orders</h2>
              </div>
              <a href="#" className="bd-btn-outline">
                <i className="fa-solid fa-list" /> View All
              </a>
            </div>

            <div className="bd-orders-table-wrap">
              <table className="bd-orders-table">
                <thead>
                  <tr>
                    {[
                      "Order ID",
                      "Crop",
                      "Qty",
                      "Price",
                      "Total",
                      "Farmer",
                      "Date",
                      "Status",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ORDERS.map((o) => {
                    const { label, cls } = STATUS_META[o.status];
                    return (
                      <tr key={o.id}>
                        <td className="bd-order-id">{o.id}</td>
                        <td className="bd-order-crop">{o.crop}</td>
                        <td>{o.qty}</td>
                        <td>{o.price}</td>
                        <td className="bd-order-total">{o.total}</td>
                        <td>{o.farmer}</td>
                        <td className="bd-order-date">{o.date}</td>
                        <td>
                          <span className={`bd-status-badge ${cls}`}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ══ MARKETPLACE LISTINGS ══ */}
          <section className="bd-market-section bd-reveal" ref={addRef}>
            <div className="bd-section-header">
              <div>
                <div className="bd-section-eyebrow">Live Marketplace</div>
                <h2 className="bd-section-title">Available Listings</h2>
              </div>
              <a href="#" className="bd-btn-primary">
                <i className="fa-solid fa-magnifying-glass" /> Browse All
              </a>
            </div>

            <div className="bd-listings-grid">
              {MARKET_LISTINGS.map((l, i) => (
                <div key={i} className="bd-listing-card">
                  <div className="bd-listing-img-wrap">
                    <img src={l.img} alt={l.crop} />
                    <div className="bd-listing-img-overlay" />
                    <div className="bd-listing-location">
                      <i className="fa-solid fa-location-dot" /> {l.location}
                    </div>
                  </div>
                  <div className="bd-listing-body">
                    <div className="bd-listing-crop">{l.crop}</div>
                    <div className="bd-listing-farmer">
                      <i className="fa-solid fa-user-circle" /> {l.farmer}
                    </div>
                    <div className="bd-listing-meta-row">
                      <div className="bd-listing-price">
                        ৳{l.price}
                        <span>/kg</span>
                      </div>
                      <div
                        className={`bd-listing-change ${l.up ? "bd-up" : "bd-down"}`}
                      >
                        <i
                          className={`fa-solid fa-arrow-trend-${l.up ? "up" : "down"}`}
                        />
                        {l.change}
                      </div>
                    </div>
                    <div className="bd-listing-qty">{l.qty}</div>
                    <button className="bd-listing-btn">
                      <i className="fa-solid fa-cart-shopping" /> Place Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ ADVISORY / ACTION PLAN ══ */}
          <section className="bd-advisory-section bd-reveal" ref={addRef}>
            <div className="bd-advisory-layout">
              <div className="bd-advisory-heading">
                <div className="bd-section-eyebrow">
                  Procurement Intelligence
                </div>
                <h2 className="bd-section-title">
                  What to Do
                  <br />
                  This Week
                </h2>
                <p className="bd-advisory-sub">
                  Personalized recommendations based on your order history,
                  price trends, and supply availability. Updated daily.
                </p>
                <div className="bd-advisory-cta">
                  <a href="#" className="bd-btn-primary">
                    <i className="fa-solid fa-phone" /> Call Support
                  </a>
                  <a href="#" className="bd-btn-outline">
                    <i className="fa-solid fa-comment" /> Chat Now
                  </a>
                </div>
              </div>

              <div className="bd-adv-list">
                {[
                  {
                    num: "01",
                    icon: "fa-cart-shopping",
                    iconCls: "bd-ai-ok",
                    title: "Lock in Potato Bulk Price",
                    desc: "Potato prices are down 1.4%. Fatema Begum has 22T available. Locking in today could save ৳1,120 per ton versus projected July pricing.",
                    priority: "Urgent",
                    pcls: "bd-high",
                  },
                  {
                    num: "02",
                    icon: "fa-handshake",
                    iconCls: "bd-ai-info",
                    title: "Connect with 3 New Farmers",
                    desc: "3 rice farmers in Gazipur and Mymensingh have joined matching your rice procurement requirements for Q3.",
                    priority: "This Week",
                    pcls: "bd-med",
                  },
                  {
                    num: "03",
                    icon: "fa-file-invoice-dollar",
                    iconCls: "bd-ai-ok",
                    title: "Renew Contract with Rahim Uddin",
                    desc: "Your 6-month supply agreement with Rahim Uddin expires in 14 days. Renewing early secures the ৳48/kg rate before the Aman season price adjustment.",
                    priority: "This Week",
                    pcls: "bd-med",
                  },
                  {
                    num: "04",
                    icon: "fa-chart-line",
                    iconCls: "bd-ai-warn",
                    title: "Review Q2 Spend Report",
                    desc: "Q2 procurement data is ready. Total spend: ৳18.4L across 4 crop types. Download your breakdown for finance reporting.",
                    priority: "Routine",
                    pcls: "bd-low",
                  },
                ].map((a) => (
                  <div key={a.num} className="bd-adv-item">
                    <div className="bd-adv-num">{a.num}</div>
                    <div className={`bd-adv-icon-wrap ${a.iconCls}`}>
                      <i className={`fa-solid ${a.icon}`} />
                    </div>
                    <div className="bd-adv-body">
                      <div className="bd-adv-title">{a.title}</div>
                      <div className="bd-adv-desc">{a.desc}</div>
                    </div>
                    <div className={`bd-adv-priority ${a.pcls}`}>
                      {a.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ FARMER DIRECTORY PREVIEW ══ */}
          <section className="bd-farmers-section bd-reveal" ref={addRef}>
            <div className="bd-section-header">
              <div>
                <div className="bd-section-eyebrow">Network</div>
                <h2 className="bd-section-title">Your Farmer Network</h2>
              </div>
              <a href="#" className="bd-btn-outline">
                <i className="fa-solid fa-users" /> All Farmers
              </a>
            </div>

            <div className="bd-farmers-grid">
              {[
                {
                  name: "Rahim Uddin",
                  loc: "Gazipur, Dhaka",
                  crops: "Rice, Mustard",
                  orders: 12,
                  rating: 4.9,
                  letter: "R",
                },
                {
                  name: "Karim Sheikh",
                  loc: "Comilla",
                  crops: "Lentil, Chickpea",
                  orders: 8,
                  rating: 4.7,
                  letter: "K",
                },
                {
                  name: "Fatema Begum",
                  loc: "Munshiganj",
                  crops: "Potato, Onion",
                  orders: 15,
                  rating: 4.8,
                  letter: "F",
                },
                {
                  name: "Jalal Ahmed",
                  loc: "Jamalpur",
                  crops: "Mustard, Wheat",
                  orders: 6,
                  rating: 4.6,
                  letter: "J",
                },
              ].map((f) => (
                <div key={f.name} className="bd-farmer-card">
                  <div className="bd-fc-avatar">{f.letter}</div>
                  <div className="bd-fc-name">{f.name}</div>
                  <div className="bd-fc-loc">
                    <i className="fa-solid fa-location-dot" /> {f.loc}
                  </div>
                  <div className="bd-fc-crops">{f.crops}</div>
                  <div className="bd-fc-stats">
                    <div className="bd-fc-stat">
                      <div className="bd-fc-stat-val">{f.orders}</div>
                      <div className="bd-fc-stat-lbl">Orders</div>
                    </div>
                    <div className="bd-fc-stat">
                      <div className="bd-fc-stat-val">★ {f.rating}</div>
                      <div className="bd-fc-stat-lbl">Rating</div>
                    </div>
                  </div>
                  <button className="bd-fc-btn">
                    <i className="fa-solid fa-comment-dots" /> Contact
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
