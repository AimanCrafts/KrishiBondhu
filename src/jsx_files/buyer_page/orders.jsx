import { useState, useEffect, useRef } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import "../../css_files/buyer_page/orders.css";

const ALL_ORDERS = [
  { id: "ORD-4821", crop: "Rice (Boro)",   qty: "5,000 kg",  qtyKg: 5000,  pricePerKg: 48,  total: "৳2,40,000",  totalNum: 240000,  farmer: "Rahim Uddin",   farmerLoc: "Gazipur",     status: "delivered",  date: "Jun 12, 2025", deliveryDate: "Jun 18, 2025", paymentStatus: "paid",    note: "" },
  { id: "ORD-4820", crop: "Red Lentil",    qty: "2,200 kg",  qtyKg: 2200,  pricePerKg: 110, total: "৳2,42,000",  totalNum: 242000,  farmer: "Karim Sheikh",  farmerLoc: "Comilla",     status: "in_transit", date: "Jun 14, 2025", deliveryDate: "Jun 20, 2025", paymentStatus: "paid",    note: "Handle with care" },
  { id: "ORD-4819", crop: "Potato",         qty: "8,000 kg",  qtyKg: 8000,  pricePerKg: 32,  total: "৳2,56,000",  totalNum: 256000,  farmer: "Fatema Begum",  farmerLoc: "Munshiganj",  status: "confirmed",  date: "Jun 15, 2025", deliveryDate: "Jun 22, 2025", paymentStatus: "pending", note: "" },
  { id: "ORD-4818", crop: "Mustard",        qty: "1,500 kg",  qtyKg: 1500,  pricePerKg: 92,  total: "৳1,38,000",  totalNum: 138000,  farmer: "Jalal Ahmed",   farmerLoc: "Jamalpur",    status: "pending",    date: "Jun 16, 2025", deliveryDate: "—",            paymentStatus: "pending", note: "Need Grade A quality" },
  { id: "ORD-4817", crop: "Wheat",          qty: "10,000 kg", qtyKg: 10000, pricePerKg: 38,  total: "৳3,80,000",  totalNum: 380000,  farmer: "Nurul Islam",   farmerLoc: "Rangpur",     status: "delivered",  date: "Jun 03, 2025", deliveryDate: "Jun 09, 2025", paymentStatus: "paid",    note: "" },
  { id: "ORD-4816", crop: "Mango",          qty: "2,500 kg",  qtyKg: 2500,  pricePerKg: 65,  total: "৳1,62,500",  totalNum: 162500,  farmer: "Selim Hossain", farmerLoc: "Rajshahi",    status: "delivered",  date: "May 28, 2025", deliveryDate: "Jun 04, 2025", paymentStatus: "paid",    note: "" },
  { id: "ORD-4815", crop: "Onion",          qty: "4,000 kg",  qtyKg: 4000,  pricePerKg: 80,  total: "৳3,20,000",  totalNum: 320000,  farmer: "Sohag Mia",     farmerLoc: "Faridpur",    status: "cancelled",  date: "May 20, 2025", deliveryDate: "—",            paymentStatus: "refunded", note: "Cancelled — quality issue" },
  { id: "ORD-4814", crop: "Tomato",         qty: "3,000 kg",  qtyKg: 3000,  pricePerKg: 55,  total: "৳1,65,000",  totalNum: 165000,  farmer: "Amina Khatun",  farmerLoc: "Jessore",     status: "delivered",  date: "May 15, 2025", deliveryDate: "May 21, 2025", paymentStatus: "paid",    note: "" },
];

const STATUS_META = {
  delivered:  { label: "Delivered",  cls: "bo-s-delivered",  icon: "fa-circle-check" },
  in_transit: { label: "In Transit", cls: "bo-s-transit",    icon: "fa-truck" },
  confirmed:  { label: "Confirmed",  cls: "bo-s-confirmed",  icon: "fa-clipboard-check" },
  pending:    { label: "Pending",    cls: "bo-s-pending",    icon: "fa-clock" },
  cancelled:  { label: "Cancelled",  cls: "bo-s-cancelled",  icon: "fa-ban" },
};

const PAY_META = {
  paid:     { label: "Paid",     cls: "bo-pay-paid" },
  pending:  { label: "Pending",  cls: "bo-pay-pending" },
  refunded: { label: "Refunded", cls: "bo-pay-refunded" },
};

const STATUS_TABS = [
  { id: "all",        label: "All Orders" },
  { id: "pending",    label: "Pending" },
  { id: "confirmed",  label: "Confirmed" },
  { id: "in_transit", label: "In Transit" },
  { id: "delivered",  label: "Delivered" },
  { id: "cancelled",  label: "Cancelled" },
];

/* ── ORDER DETAIL PANEL ── */
function OrderDetailPanel({ order, onClose }) {
  const { label, cls, icon } = STATUS_META[order.status];
  const { label: payLabel, cls: payCls } = PAY_META[order.paymentStatus];

  const TIMELINE = {
    pending:    ["Order Placed", "Awaiting Farmer Confirmation", null,           null],
    confirmed:  ["Order Placed", "Farmer Confirmed",             null,           null],
    in_transit: ["Order Placed", "Farmer Confirmed",             "Dispatched",   null],
    delivered:  ["Order Placed", "Farmer Confirmed",             "Dispatched",   "Delivered"],
    cancelled:  ["Order Placed", "Cancelled",                    null,           null],
  };

  const steps = TIMELINE[order.status] || [];
  const doneCount = steps.filter(Boolean).length;

  return (
    <div className="bo-panel-overlay" onClick={onClose}>
      <div className="bo-panel" onClick={e => e.stopPropagation()}>
        <div className="bo-panel-header">
          <div>
            <div className="bo-panel-order-id">{order.id}</div>
            <div className="bo-panel-crop">{order.crop}</div>
          </div>
          <button className="bo-panel-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>

        {/* STATUS TIMELINE */}
        <div className="bo-timeline">
          {steps.filter(Boolean).map((step, i) => (
            <div key={step} className={`bo-tl-step ${i < doneCount ? "done" : ""}`}>
              <div className="bo-tl-dot"><i className="fa-solid fa-check" /></div>
              <div className="bo-tl-label">{step}</div>
              {i < steps.filter(Boolean).length - 1 && <div className="bo-tl-line" />}
            </div>
          ))}
        </div>

        <div className="bo-panel-body">
          {/* Info grid */}
          <div className="bo-info-grid">
            {[
              { label: "Farmer",       value: order.farmer },
              { label: "Location",     value: order.farmerLoc },
              { label: "Order Date",   value: order.date },
              { label: "Delivery",     value: order.deliveryDate },
              { label: "Quantity",     value: order.qty },
              { label: "Price / kg",   value: `৳${order.pricePerKg}` },
              { label: "Total Amount", value: order.total, strong: true },
              { label: "Payment",      value: payLabel, payClass: payCls },
            ].map(row => (
              <div key={row.label} className="bo-info-row">
                <span className="bo-info-label">{row.label}</span>
                <span className={`bo-info-val${row.strong ? " bo-info-strong" : ""} ${row.payClass || ""}`}>{row.value}</span>
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
            <button className="bo-panel-action bo-action-cancel" onClick={() => alert("Cancel order: Connect to backend")}>
              <i className="fa-solid fa-ban" /> Cancel Order
            </button>
          )}
          <button className="bo-panel-action bo-action-invoice" onClick={() => alert("Download invoice: Connect to backend")}>
            <i className="fa-solid fa-file-invoice" /> Invoice
          </button>
          <button className="bo-panel-action bo-action-reorder" onClick={() => alert("Reorder: Connect to backend")}>
            <i className="fa-solid fa-rotate-right" /> Reorder
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function Orders() {
  const [activeTab, setActiveTab]     = useState("all");
  const [search, setSearch]           = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("bo-vis"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const filtered = ALL_ORDERS.filter(o => {
    const matchTab    = activeTab === "all" || o.status === activeTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                        o.crop.toLowerCase().includes(search.toLowerCase()) ||
                        o.farmer.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  /* KPI calculations */
  const totalSpend = ALL_ORDERS.reduce((s, o) => s + (o.status !== "cancelled" ? o.totalNum : 0), 0);
  const counts = {
    pending:    ALL_ORDERS.filter(o => o.status === "pending").length,
    in_transit: ALL_ORDERS.filter(o => o.status === "in_transit").length,
    delivered:  ALL_ORDERS.filter(o => o.status === "delivered").length,
    cancelled:  ALL_ORDERS.filter(o => o.status === "cancelled").length,
  };

  const exportCSV = () => {
    const cols = ["Order ID","Crop","Quantity","Price/kg","Total","Farmer","Date","Status","Payment"];
    const rows = filtered.map(o => [o.id, o.crop, o.qty, `৳${o.pricePerKg}`, o.total, o.farmer, o.date, STATUS_META[o.status].label, PAY_META[o.paymentStatus].label]);
    const csv = [cols, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "krishibondhu_orders.csv";
    a.click();
  };

  return (
    <BuyerLayout activeNav="orders">
      <div className="bo-page">

        {/* PAGE HEADER */}
        <div className="bo-page-header bo-reveal" ref={addRef}>
          <div>
            <div className="bo-page-eyebrow">Procurement</div>
            <h1 className="bo-page-title">My Orders</h1>
            <p className="bo-page-sub">Track, manage, and export all your procurement orders.</p>
          </div>
          <button className="bo-export-btn" onClick={exportCSV}>
            <i className="fa-solid fa-file-export" /> Export CSV
          </button>
        </div>

        {/* KPI ROW */}
        <div className="bo-kpi-row bo-reveal" ref={addRef}>
          {[
            { icon: "fa-box-open",               label: "Total Orders",   val: ALL_ORDERS.length,           cls: "bo-kpi-blue" },
            { icon: "fa-bangladeshi-taka-sign",  label: "Total Spend",    val: `৳${(totalSpend/100000).toFixed(1)}L`, cls: "bo-kpi-green" },
            { icon: "fa-truck",                  label: "In Transit",     val: counts.in_transit,           cls: "bo-kpi-amber" },
            { icon: "fa-circle-check",           label: "Delivered",      val: counts.delivered,            cls: "bo-kpi-emerald" },
          ].map(k => (
            <div key={k.label} className={`bo-kpi-card ${k.cls}`}>
              <div className="bo-kpi-icon"><i className={`fa-solid ${k.icon}`} /></div>
              <div className="bo-kpi-val">{k.val}</div>
              <div className="bo-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="bo-controls bo-reveal" ref={addRef}>
          <div className="bo-tabs">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.id}
                className={`bo-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                <span className="bo-tab-count">
                  {tab.id === "all" ? ALL_ORDERS.length : ALL_ORDERS.filter(o => o.status === tab.id).length}
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
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bo-table-section bo-reveal" ref={addRef}>
          {filtered.length === 0 ? (
            <div className="bo-empty">
              <span>📦</span>
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="bo-table-wrap">
              <table className="bo-table">
                <thead>
                  <tr>
                    {["Order ID","Crop","Quantity","Price/kg","Total","Farmer","Date","Delivery","Status","Payment"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => {
                    const { label, cls, icon } = STATUS_META[o.status];
                    const { label: payLabel, cls: payCls } = PAY_META[o.paymentStatus];
                    return (
                      <tr key={o.id} className="bo-table-row" onClick={() => setSelectedOrder(o)}>
                        <td className="bo-td-id">{o.id}</td>
                        <td className="bo-td-crop">{o.crop}</td>
                        <td>{o.qty}</td>
                        <td>৳{o.pricePerKg}</td>
                        <td className="bo-td-total">{o.total}</td>
                        <td>{o.farmer}</td>
                        <td className="bo-td-date">{o.date}</td>
                        <td className="bo-td-date">{o.deliveryDate}</td>
                        <td>
                          <span className={`bo-status-badge ${cls}`}>
                            <i className={`fa-solid ${icon}`} /> {label}
                          </span>
                        </td>
                        <td>
                          <span className={`bo-pay-badge ${payCls}`}>{payLabel}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="bo-table-footer">
            Showing {filtered.length} of {ALL_ORDERS.length} orders — click any row for details
          </div>
        </div>

      </div>

      {/* DETAIL PANEL */}
      {selectedOrder && <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </BuyerLayout>
  );
}
