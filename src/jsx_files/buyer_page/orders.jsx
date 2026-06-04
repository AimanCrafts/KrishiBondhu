// src/jsx_files/buyer_page/orders.jsx
import { useState, useEffect, useRef } from "react";

import "../../css_files/buyer_page/orders.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STATUS_META = {
  delivered: {
    label: "Delivered",
    cls: "bo-s-delivered",
    icon: "fa-circle-check",
  },
  in_transit: { label: "In Transit", cls: "bo-s-transit", icon: "fa-truck" },
  confirmed: {
    label: "Confirmed",
    cls: "bo-s-confirmed",
    icon: "fa-clipboard-check",
  },
  pending: { label: "Pending", cls: "bo-s-pending", icon: "fa-clock" },
  cancelled: { label: "Cancelled", cls: "bo-s-cancelled", icon: "fa-ban" },
};

const PAY_META = {
  paid: { label: "Paid", cls: "bo-pay-paid" },
  pending: { label: "Pending", cls: "bo-pay-pending" },
  refunded: { label: "Refunded", cls: "bo-pay-refunded" },
};

const STATUS_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "in_transit", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

/* ── ORDER DETAIL PANEL ── */
function OrderDetailPanel({ order, onClose, onCancel }) {
  const { label, cls, icon } = STATUS_META[order.status] || {
    label: order.status,
    cls: "",
    icon: "fa-circle",
  };
  const { label: payLabel, cls: payCls } = PAY_META[order.paymentStatus] || {
    label: order.paymentStatus,
    cls: "",
  };

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const TIMELINE = {
    pending: ["Order Placed", "Awaiting Farmer Confirmation", null, null],
    confirmed: ["Order Placed", "Farmer Confirmed", null, null],
    in_transit: ["Order Placed", "Farmer Confirmed", "Dispatched", null],
    delivered: ["Order Placed", "Farmer Confirmed", "Dispatched", "Delivered"],
    cancelled: ["Order Placed", "Cancelled", null, null],
  };

  const steps = (TIMELINE[order.status] || []).filter(Boolean);

  return (
    <div className="bo-panel-overlay" onClick={onClose}>
      <div className="bo-panel" onClick={(e) => e.stopPropagation()}>
        <div className="bo-panel-header">
          <div>
            <div className="bo-panel-order-id">{order.orderNumber}</div>
            <div className="bo-panel-crop">{order.crop}</div>
          </div>
          <button className="bo-panel-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* STATUS TIMELINE */}
        <div className="bo-timeline">
          {steps.map((step, i) => (
            <div key={step} className="bo-tl-step done">
              <div className="bo-tl-dot">
                <i className="fa-solid fa-check" />
              </div>
              <div className="bo-tl-label">{step}</div>
              {i < steps.length - 1 && <div className="bo-tl-line" />}
            </div>
          ))}
        </div>

        <div className="bo-panel-body">
          <div className="bo-info-grid">
            {[
              { label: "Farmer", value: order.farmerName || "—" },
              { label: "Location", value: order.farmerLocation || "—" },
              { label: "Order Date", value: orderDate },
              { label: "Delivery", value: deliveryDate },
              {
                label: "Quantity",
                value: `${order.qtyKg?.toLocaleString()} kg`,
              },
              { label: "Price / kg", value: `৳${order.pricePerKg}` },
              {
                label: "Total Amount",
                value: `৳${order.totalAmount?.toLocaleString()}`,
                strong: true,
              },
              { label: "Payment", value: payLabel, payClass: payCls },
            ].map((row) => (
              <div key={row.label} className="bo-info-row">
                <span className="bo-info-label">{row.label}</span>
                <span
                  className={`bo-info-val${row.strong ? " bo-info-strong" : ""} ${row.payClass || ""}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {order.note && (
            <div className="bo-panel-note">
              <i className="fa-solid fa-note-sticky" /> {order.note}
            </div>
          )}

          <div className="bo-panel-status-badge-row">
            <span className={`bo-status-badge ${cls}`}>
              <i className={`fa-solid ${icon}`} /> {label}
            </span>
          </div>
        </div>

        <div className="bo-panel-footer">
          {order.status === "pending" && (
            <button
              className="bo-panel-action bo-action-cancel"
              onClick={() => onCancel(order._id)}
            >
              <i className="fa-solid fa-ban" /> Cancel Order
            </button>
          )}
          <button
            className="bo-panel-action bo-action-invoice"
            onClick={() => alert("Invoice download coming soon")}
          >
            <i className="fa-solid fa-file-invoice" /> Invoice
          </button>
          <button
            className="bo-panel-action bo-action-reorder"
            onClick={() => alert("Reorder coming soon")}
          >
            <i className="fa-solid fa-rotate-right" /> Reorder
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const revealRefs = useRef([]);

  /* ── Fetch orders from API ── */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("kb_token");
        const res = await fetch(`${API_BASE}/api/buyer/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setAllOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  /* ── Cancel order ── */
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("kb_token");
      const res = await fetch(
        `${API_BASE}/api/buyer/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Cancel failed");
      setAllOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o,
        ),
      );
      setSelectedOrder((prev) =>
        prev && prev._id === orderId ? { ...prev, status: "cancelled" } : prev,
      );
    } catch (err) {
      alert("Could not cancel order: " + err.message);
    }
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("bo-vis");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [loading]);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const filtered = allOrders.filter((o) => {
    const matchTab = activeTab === "all" || o.status === activeTab;
    const matchSearch =
      (o.orderNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.crop || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.farmerName || "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  /* KPI calculations */
  const totalSpend = allOrders.reduce(
    (s, o) => s + (o.status !== "cancelled" ? o.totalAmount || 0 : 0),
    0,
  );
  const counts = {
    pending: allOrders.filter((o) => o.status === "pending").length,
    in_transit: allOrders.filter((o) => o.status === "in_transit").length,
    delivered: allOrders.filter((o) => o.status === "delivered").length,
    cancelled: allOrders.filter((o) => o.status === "cancelled").length,
  };

  const exportCSV = () => {
    const cols = [
      "Order ID",
      "Crop",
      "Quantity (kg)",
      "Price/kg",
      "Total",
      "Farmer",
      "Date",
      "Status",
      "Payment",
    ];
    const rows = filtered.map((o) => [
      o.orderNumber,
      o.crop,
      o.qtyKg,
      `৳${o.pricePerKg}`,
      `৳${o.totalAmount}`,
      o.farmerName || "—",
      new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      STATUS_META[o.status]?.label || o.status,
      PAY_META[o.paymentStatus]?.label || o.paymentStatus,
    ]);
    const csv = [cols, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "krishibondhu_orders.csv";
    a.click();
  };

  /* ── Loading / Error states ── */
  if (loading)
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <nav className="fd-topbar">
          <a className="fd-brand" href="/buyer_dashboard">
            <i className="fa-solid fa-leaf" />
            <span className="fd-brand-krishi">Krishi</span>Bondhu
          </a>
        </nav>
        <div className="bo-page">
          <div className="bo-empty">
            <span>
              <i className="fa-solid fa-spinner fa-spin" />
            </span>
            <h3>Loading orders…</h3>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <nav className="fd-topbar">
          <a className="fd-brand" href="/buyer_dashboard">
            <i className="fa-solid fa-leaf" />
            <span className="fd-brand-krishi">Krishi</span>Bondhu
          </a>
        </nav>
        <div className="bo-page">
          <div className="bo-empty">
            <span>⚠️</span>
            <h3>Could not load orders</h3>
            <p>{error}</p>
          </div>
        </div>
      </>
    );

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <nav className="fd-topbar">
        <a className="fd-brand" href="/buyer_dashboard">
          <i className="fa-solid fa-leaf" />
          <span className="fd-brand-krishi">Krishi</span>Bondhu
        </a>
      </nav>
      <div className="bo-page">
        {/* PAGE HEADER */}
        <div className="bo-page-header bo-reveal" ref={addRef}>
          <div>
            <div className="bo-page-eyebrow">Procurement</div>
            <h1 className="bo-page-title">My Orders</h1>
            <p className="bo-page-sub">
              Track, manage, and export all your procurement orders.
            </p>
          </div>
          <button
            className="bo-export-btn"
            onClick={exportCSV}
            disabled={allOrders.length === 0}
          >
            <i className="fa-solid fa-file-export" /> Export CSV
          </button>
        </div>

        {/* KPI ROW */}
        <div className="bo-kpi-row bo-reveal" ref={addRef}>
          {[
            {
              icon: "fa-box-open",
              label: "Total Orders",
              val: allOrders.length,
              cls: "bo-kpi-blue",
            },
            {
              icon: "fa-bangladeshi-taka-sign",
              label: "Total Spend",
              val: `৳${(totalSpend / 100000).toFixed(1)}L`,
              cls: "bo-kpi-green",
            },
            {
              icon: "fa-truck",
              label: "In Transit",
              val: counts.in_transit,
              cls: "bo-kpi-amber",
            },
            {
              icon: "fa-circle-check",
              label: "Delivered",
              val: counts.delivered,
              cls: "bo-kpi-emerald",
            },
          ].map((k) => (
            <div key={k.label} className={`bo-kpi-card ${k.cls}`}>
              <div className="bo-kpi-icon">
                <i className={`fa-solid ${k.icon}`} />
              </div>
              <div className="bo-kpi-val">{k.val}</div>
              <div className="bo-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="bo-controls bo-reveal" ref={addRef}>
          <div className="bo-tabs">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`bo-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <span className="bo-tab-count">
                  {tab.id === "all"
                    ? allOrders.length
                    : allOrders.filter((o) => o.status === tab.id).length}
                </span>
              </button>
            ))}
          </div>
          <div className="bo-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search order ID, crop, farmer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bo-table-section bo-reveal" ref={addRef}>
          {allOrders.length === 0 ? (
            <div className="bo-empty">
              <span>📦</span>
              <h3>No orders yet</h3>
              <p>
                Place your first order from the{" "}
                <a href="/buyer/marketplace" style={{ color: "green" }}>
                  Marketplace
                </a>
                .
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bo-empty">
              <span>🔍</span>
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="bo-table-wrap">
              <table className="bo-table">
                <thead>
                  <tr>
                    {[
                      "Order ID",
                      "Crop",
                      "Quantity",
                      "Price/kg",
                      "Total",
                      "Farmer",
                      "Date",
                      "Delivery",
                      "Status",
                      "Payment",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const { label, cls, icon } = STATUS_META[o.status] || {
                      label: o.status,
                      cls: "",
                      icon: "fa-circle",
                    };
                    const { label: payLabel, cls: payCls } = PAY_META[
                      o.paymentStatus
                    ] || { label: o.paymentStatus, cls: "" };
                    const orderDate = new Date(o.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    );
                    const deliveryDate = o.deliveryDate
                      ? new Date(o.deliveryDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";
                    return (
                      <tr
                        key={o._id}
                        className="bo-table-row"
                        onClick={() => setSelectedOrder(o)}
                      >
                        <td className="bo-td-id">{o.orderNumber}</td>
                        <td className="bo-td-crop">{o.crop}</td>
                        <td>{o.qtyKg?.toLocaleString()} kg</td>
                        <td>৳{o.pricePerKg}</td>
                        <td className="bo-td-total">
                          ৳{o.totalAmount?.toLocaleString()}
                        </td>
                        <td>{o.farmerName || "—"}</td>
                        <td className="bo-td-date">{orderDate}</td>
                        <td className="bo-td-date">{deliveryDate}</td>
                        <td>
                          <span className={`bo-status-badge ${cls}`}>
                            <i className={`fa-solid ${icon}`} /> {label}
                          </span>
                        </td>
                        <td>
                          <span className={`bo-pay-badge ${payCls}`}>
                            {payLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {allOrders.length > 0 && (
            <div className="bo-table-footer">
              Showing {filtered.length} of {allOrders.length} orders — click any
              row for details
            </div>
          )}
        </div>
      </div>

      {/* DETAIL PANEL */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
