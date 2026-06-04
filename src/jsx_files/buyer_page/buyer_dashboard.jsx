import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/buyer_page/buyer_dashboard.css";
import { useBuyerAlert } from "../../hooks/useBuyerAlert";
import { useMarketListings } from "../../hooks/useMarketListings";
import NotificationBell from "../../components/NotificationBell";


const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
  const [todayDate, setTodayDate] = useState("");
  const [barsAnimated, setBarsAnimated] = useState(false);
  const { alertText, alertLoading } = useBuyerAlert();
  const { listings, listingsLoading, listingsError } = useMarketListings({
    limit: 4,
  });

  /* ── Recent Orders from API ── */
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("kb_token");
        const res = await fetch(`${API_BASE}/api/buyer/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        // Take only the 3 most recent orders (already sorted by createdAt desc from API)
        setRecentOrders((data.orders || []).slice(0, 3));
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (user) fetchRecentOrders();
  }, [user]);

  const revealRefs = useRef([]);

  /* Derive user info from auth context */
  const companyName =
    user?.profile?.companyName || user?.name || "Your Company";
  const contactPerson = user?.profile?.contactPerson || user?.name || "User";
  const firstLetter = (contactPerson[0] || "B").toUpperCase();
  const businessType = user?.profile?.businessType || "Food Business";
  const location =
    [user?.profile?.district, user?.profile?.division]
      .filter(Boolean)
      .join(", ") || "Dhaka";

  /* ── Farmer Network from API ── */
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const token = localStorage.getItem("kb_token");
        const res = await fetch(`${API_BASE}/api/buyer/farmers?limit=4`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setFarmers((data.farmers || []).slice(0, 4));
      } catch {
        // silently fail — section just won't show
      }
    };
    if (user) fetchFarmers();
  }, [user]);

  /* ── Hero stat calculations ── */
  const activeOrderCount = recentOrders.filter((o) =>
    ["pending", "confirmed", "in_transit"].includes(o.status),
  ).length;

  const thisMonthSpend = (() => {
    const now = new Date();
    const total = recentOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear() &&
          o.status !== "cancelled"
        );
      })
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    if (total === 0) return "০";
    return `${(total / 100000).toFixed(1)}L`;
  })();

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
    authLogout();
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
            <NotificationBell />
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
                {companyName} has {activeOrderCount} active order
                {activeOrderCount !== 1 ? "s" : ""} and {listings.length} new
                listing{listings.length !== 1 ? "s" : ""} matching your
                procurement preferences today.
              </p>
              <div className="bd-hero-stats-row">
                <div className="bd-hstat">
                  <div className="bd-hstat-val bd-val-blue">
                    {activeOrderCount}
                  </div>
                  <div className="bd-hstat-label">Active Orders</div>
                </div>
                <div className="bd-hstat">
                  <div className="bd-hstat-val">৳{thisMonthSpend}</div>
                  <div className="bd-hstat-label">This Month</div>
                </div>
                <div className="bd-hstat">
                  <div className="bd-hstat-val bd-val-green">
                    {farmers.length}
                  </div>
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
                  {/* Pill 1 — most recent in-transit order */}
                  {recentOrders.find((o) => o.status === "in_transit") ? (
                    (() => {
                      const o = recentOrders.find(
                        (o) => o.status === "in_transit",
                      );
                      return (
                        <div className="bd-status-pill">
                          <div className="bd-pill-icon bd-pi-ok">
                            <i className="fa-solid fa-truck" />
                          </div>
                          <div className="bd-pill-text">
                            <strong>Order {o.orderNumber} In Transit</strong>
                            <span>
                              {o.crop} · {o.qtyKg?.toLocaleString()} kg
                            </span>
                          </div>
                        </div>
                      );
                    })()
                  ) : recentOrders.length > 0 ? (
                    <div className="bd-status-pill">
                      <div className="bd-pill-icon bd-pi-ok">
                        <i className="fa-solid fa-box" />
                      </div>
                      <div className="bd-pill-text">
                        <strong>No orders in transit</strong>
                        <span>All orders up to date</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Pill 2 — listings count */}
                  {listings.length > 0 && (
                    <div className="bd-status-pill">
                      <div className="bd-pill-icon bd-pi-info">
                        <i className="fa-solid fa-star" />
                      </div>
                      <div className="bd-pill-text">
                        <strong>
                          {listings.length} New Farmer Listing
                          {listings.length !== 1 ? "s" : ""}
                        </strong>
                        <span>Available in the marketplace</span>
                      </div>
                    </div>
                  )}

                  {/* Pill 3 — pending orders nudge */}
                  {recentOrders.filter((o) => o.status === "pending").length >
                    0 && (
                    <div className="bd-status-pill">
                      <div className="bd-pill-icon bd-pi-warn">
                        <i className="fa-solid fa-clock" />
                      </div>
                      <div className="bd-pill-text">
                        <strong>
                          {
                            recentOrders.filter((o) => o.status === "pending")
                              .length
                          }{" "}
                          Order
                          {recentOrders.filter((o) => o.status === "pending")
                            .length !== 1
                            ? "s"
                            : ""}{" "}
                          Awaiting Confirmation
                        </strong>
                        <span>Farmer yet to confirm</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ══ ALERT BANNER ══ */}
          {!alertLoading && alertText && alertVisible && (
            <div className="bd-alert-banner">
              <i className="fa-solid fa-circle-info bd-alert-icon" />
              <div className="bd-alert-text">
                <strong>Market Notice:</strong> {alertText}
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
                    val: recentOrders.length,
                    sub: `${activeOrderCount} active`,
                    color: "blue",
                  },
                  {
                    icon: "fa-bangladeshi-taka-sign",
                    label: "Total Spend",
                    val: `৳${(recentOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.totalAmount || 0), 0) / 100000).toFixed(1)}L`,
                    sub: "From your orders",
                    color: "green",
                  },
                  {
                    icon: "fa-tractor",
                    label: "Active Farmers",
                    val: farmers.length,
                    sub: "In the network",
                    color: "teal",
                  },
                  {
                    icon: "fa-store",
                    label: "Live Listings",
                    val: listings.length,
                    sub: "In marketplace",
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
              <a
                href="#"
                className="bd-btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/buyer/orders");
                }}
              >
                <i className="fa-solid fa-list" /> View All
              </a>
            </div>

            {ordersLoading && (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-spinner fa-spin" /> Loading orders…
              </div>
            )}

            {!ordersLoading && ordersError && (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-triangle-exclamation" /> Could not
                load orders.
              </div>
            )}

            {!ordersLoading && !ordersError && recentOrders.length === 0 && (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-box-open" /> No orders yet. Place your
                first order from the{" "}
                <a
                  href="/buyer/marketplace"
                  style={{
                    color: "var(--bd-green)",
                    textDecoration: "underline",
                  }}
                >
                  Marketplace
                </a>
                .
              </div>
            )}

            {!ordersLoading && !ordersError && recentOrders.length > 0 && (
              <div className="bd-orders-table-wrap">
                <table className="bd-orders-table">
                  <thead>
                    <tr>
                      {[
                        "Order ID",
                        "Crop",
                        "Qty (kg)",
                        "Price/kg",
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
                    {recentOrders.map((o) => {
                      const meta = STATUS_META[o.status] || {
                        label: o.status,
                        cls: "",
                      };
                      const orderDate = new Date(
                        o.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      return (
                        <tr key={o._id}>
                          <td className="bd-order-id">{o.orderNumber}</td>
                          <td className="bd-order-crop">{o.crop}</td>
                          <td>{o.qtyKg.toLocaleString()}</td>
                          <td>৳{o.pricePerKg}</td>
                          <td className="bd-order-total">
                            ৳{o.totalAmount.toLocaleString()}
                          </td>
                          <td>{o.farmerName || "—"}</td>
                          <td className="bd-order-date">{orderDate}</td>
                          <td>
                            <span className={`bd-status-badge ${meta.cls}`}>
                              {meta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ══ MARKETPLACE LISTINGS ══ */}
          <section className="bd-market-section bd-reveal" ref={addRef}>
            <div className="bd-section-header">
              <div>
                <div className="bd-section-eyebrow">Live Marketplace</div>
                <h2 className="bd-section-title">Available Listings</h2>
              </div>
              <a href="/buyer/marketplace" className="bd-btn-primary">
                <i className="fa-solid fa-magnifying-glass" /> Browse All
              </a>
            </div>

            {listingsLoading && (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-spinner fa-spin" /> Loading listings…
              </div>
            )}

            {!listingsLoading && listingsError && (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-triangle-exclamation" /> Could not
                load listings.
              </div>
            )}

            {!listingsLoading && !listingsError && listings.length === 0 && (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-box-open" /> No active listings right
                now.
              </div>
            )}

            {!listingsLoading && !listingsError && listings.length > 0 && (
              <div className="bd-listings-grid">
                {listings.map((l) => (
                  <div key={l._id} className="bd-listing-card">
                    <div className="bd-listing-img-wrap">
                      {l.img ? (
                        <img src={l.img} alt={l.crop} />
                      ) : (
                        <div className="bd-listing-img-placeholder">
                          <i className="fa-solid fa-seedling" />
                        </div>
                      )}
                      <div className="bd-listing-img-overlay" />
                      {l.location && (
                        <div className="bd-listing-location">
                          <i className="fa-solid fa-location-dot" />{" "}
                          {l.location}
                        </div>
                      )}
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
                        {l.featured && (
                          <div className="bd-listing-change bd-up">
                            <i className="fa-solid fa-star" /> Featured
                          </div>
                        )}
                      </div>
                      {l.qty && <div className="bd-listing-qty">{l.qty}</div>}
                      <button
                        className="bd-listing-btn"
                        onClick={() => navigate("/buyer/marketplace")}
                      >
                        <i className="fa-solid fa-cart-shopping" /> Place Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <a
                href="#"
                className="bd-btn-outline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/buyer/farmers");
                }}
              >
                <i className="fa-solid fa-users" /> All Farmers
              </a>
            </div>

            {farmers.length === 0 ? (
              <div className="bd-listings-empty">
                <i className="fa-solid fa-tractor" /> No farmers in the network
                yet.
              </div>
            ) : (
              <div className="bd-farmers-grid">
                {farmers.map((f) => {
                  const displayName = f.name || "Farmer";
                  const letter = displayName[0].toUpperCase();
                  const loc =
                    [f.district, f.division].filter(Boolean).join(", ") ||
                    "Bangladesh";
                  const crops =
                    f.farmData?.cropTypes?.join(", ") ||
                    f.farmData?.mainCrop ||
                    "—";
                  return (
                    <div key={f._id} className="bd-farmer-card">
                      <div className="bd-fc-avatar">{letter}</div>
                      <div className="bd-fc-name">{displayName}</div>
                      <div className="bd-fc-loc">
                        <i className="fa-solid fa-location-dot" /> {loc}
                      </div>
                      <div className="bd-fc-crops">{crops}</div>
                      <div className="bd-fc-stats">
                        <div className="bd-fc-stat">
                          <div className="bd-fc-stat-val">
                            {f.farmData?.landAcres
                              ? `${f.farmData.landAcres} ac`
                              : "—"}
                          </div>
                          <div className="bd-fc-stat-lbl">Land</div>
                        </div>
                        <div className="bd-fc-stat">
                          <div className="bd-fc-stat-val">
                            {f.farmData?.experience
                              ? `${f.farmData.experience}y`
                              : "—"}
                          </div>
                          <div className="bd-fc-stat-lbl">Exp.</div>
                        </div>
                      </div>
                      <button
                        className="bd-fc-btn"
                        onClick={() => navigate("/buyer/farmers")}
                      >
                        <i className="fa-solid fa-comment-dots" /> Contact
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
