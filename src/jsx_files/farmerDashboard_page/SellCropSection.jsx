// src/jsx_files/farmerDashboard_page/SellCropSection.jsx
//
// Usage in farmer_dashboard.jsx:
//   import SellCropSection from "./SellCropSection";
//   ... Market Prices section এর পরে, </main> এর আগে:
//   <div style={{ padding: "0 4px" }}>
//     <SellCropSection />
//   </div>
//
// NOTE: কোনো prop লাগবে না। Component নিজেই backend থেকে
// fresh status fetch করে — তাই logout/login ছাড়াই
// admin approval সাথে সাথে দেখা যাবে।

import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function SellCropSection() {
  const [farmerStatus, setFarmerStatus] = useState(null); // null = loading
  const [myListings, setMyListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const [form, setForm] = useState({ crop: "", qty: "", price: "", img: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const token = localStorage.getItem("kb_token");

  // ── Fresh status fetch from backend (not from cached kb_session) ──
  const fetchStatus = () => {
    if (!token) return;
    setFarmerStatus(null); // show loading
    fetch(`${API}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setFarmerStatus(data.user?.status || "pending"))
      .catch(() => setFarmerStatus("pending"));
  };

  useEffect(() => {
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMyListings = () => {
    setListingsLoading(true);
    fetch(`${API}/api/user/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setMyListings(data.listings || []))
      .catch(() => setMyListings([]))
      .finally(() => setListingsLoading(false));
  };

  useEffect(() => {
    if (farmerStatus === "active") loadMyListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerStatus]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!form.crop.trim()) return setFormError("ফসলের নাম দিতে হবে।");
    if (!form.price || Number(form.price) <= 0)
      return setFormError("সঠিক মূল্য দিতে হবে।");

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/user/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          crop: form.crop,
          qty: form.qty,
          price: Number(form.price),
          img: form.img,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "সমস্যা হয়েছে।");
      setFormSuccess("✅ আপনার ফসল Marketplace এ পাঠানো হয়েছে!");
      setForm({ crop: "", qty: "", price: "", img: "" });
      loadMyListings();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই listing টি মুছে ফেলবেন?")) return;
    try {
      const res = await fetch(`${API}/api/user/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      loadMyListings();
    } catch (err) {
      alert("মুছতে সমস্যা: " + err.message);
    }
  };

  // ── Loading ──────────────────────────────────────────────────
  if (farmerStatus === null) {
    return (
      <section style={sectionWrap}>
        <div style={{ padding: "32px 28px", color: "#6b7280" }}>
          <i
            className="fa-solid fa-spinner fa-spin"
            style={{ marginRight: 8 }}
          />
          অ্যাকাউন্টের তথ্য লোড হচ্ছে...
        </div>
      </section>
    );
  }

  // ── Blocked statuses ─────────────────────────────────────────
  if (farmerStatus !== "active") {
    const msgMap = {
      pending: {
        icon: "fa-clock",
        color: "#d97706",
        bg: "#fffbeb",
        border: "#fcd34d",
        title: "অনুমোদনের অপেক্ষায় আছেন",
        body: "আপনার একাউন্ট এখনো Admin দ্বারা Approve করা হয়নি। Approve হলেই Marketplace এ ফসল বিক্রির সুযোগ পাবেন।",
      },
      suspended: {
        icon: "fa-ban",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fca5a5",
        title: "একাউন্ট সাসপেন্ড",
        body: "আপনার একাউন্ট সাসপেন্ড করা হয়েছে। Marketplace access বন্ধ আছে। Admin এর সাথে যোগাযোগ করুন।",
      },
      rejected: {
        icon: "fa-circle-xmark",
        color: "#dc2626",
        bg: "#fef2f2",
        border: "#fca5a5",
        title: "একাউন্ট প্রত্যাখ্যাত",
        body: "দুঃখজনকভাবে আপনার একাউন্ট Reject করা হয়েছে। Marketplace access নেই।",
      },
    };
    const info = msgMap[farmerStatus] || msgMap["pending"];

    return (
      <section
        style={{
          background: info.bg,
          border: `1.5px solid ${info.border}`,
          borderRadius: 16,
          padding: "32px 28px",
          margin: "32px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <i
          className={`fa-solid ${info.icon}`}
          style={{ fontSize: "2rem", color: info.color, marginTop: 2 }}
        />
        <div>
          <h3
            style={{
              margin: "0 0 8px",
              color: info.color,
              fontSize: "1.15rem",
            }}
          >
            {info.title}
          </h3>
          <p style={{ margin: "0 0 14px", color: "#374151", lineHeight: 1.6 }}>
            {info.body}
          </p>
          <button
            onClick={fetchStatus}
            style={{
              background: info.color,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <i className="fa-solid fa-rotate-right" /> Status Check করুন
          </button>
        </div>
      </section>
    );
  }

  // ── Active: form + listings ──────────────────────────────────
  return (
    <section style={sectionWrap}>
      <div
        style={{
          background: "linear-gradient(135deg, #166534 0%, #15803d 100%)",
          padding: "24px 28px",
          color: "#fff",
        }}
      >
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "0.78rem",
            letterSpacing: "0.1em",
            opacity: 0.8,
            textTransform: "uppercase",
          }}
        >
          Marketplace
        </p>
        <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          <i className="fa-solid fa-store" style={{ marginRight: 10 }} />
          আমার ফসল বিক্রি করুন
        </h2>
        <p style={{ margin: "8px 0 0", opacity: 0.85, fontSize: "0.92rem" }}>
          নিচের ফর্মটি পূরণ করুন — আপনার ফসল Buyer Marketplace এ দেখা যাবে।
        </p>
      </div>

      <div style={{ padding: "28px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 560,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label style={labelStyle}>ফসলের নাম *</label>
              <input
                name="crop"
                value={form.crop}
                onChange={handleChange}
                placeholder="যেমন: ধান, আলু, পেঁয়াজ"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>পরিমাণ</label>
              <input
                name="qty"
                value={form.qty}
                onChange={handleChange}
                placeholder="যেমন: 500 কেজি"
                style={inputStyle}
              />
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <div>
              <label style={labelStyle}>মূল্য (প্রতি কেজি, টাকায়) *</label>
              <input
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                placeholder="যেমন: 45"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>ছবির URL (ঐচ্ছিক)</label>
              <input
                name="img"
                value={form.img}
                onChange={handleChange}
                placeholder="https://..."
                style={inputStyle}
              />
            </div>
          </div>

          {formError && (
            <p
              style={{
                margin: 0,
                color: "#dc2626",
                fontSize: "0.88rem",
                background: "#fef2f2",
                padding: "10px 14px",
                borderRadius: 8,
              }}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ marginRight: 6 }}
              />
              {formError}
            </p>
          )}
          {formSuccess && (
            <p
              style={{
                margin: 0,
                color: "#166534",
                fontSize: "0.88rem",
                background: "#f0fdf4",
                padding: "10px 14px",
                borderRadius: 8,
              }}
            >
              {formSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: submitting ? "#9ca3af" : "#15803d",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 28px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: submitting ? "not-allowed" : "pointer",
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <i className="fa-solid fa-paper-plane" />
            {submitting ? "পাঠানো হচ্ছে..." : "Marketplace এ পাঠান"}
          </button>
        </form>

        <div style={{ marginTop: 36 }}>
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: 16,
            }}
          >
            <i
              className="fa-solid fa-list-check"
              style={{ marginRight: 8, color: "#15803d" }}
            />
            আমার সক্রিয় Listing
          </h3>
          {listingsLoading ? (
            <p style={{ color: "#6b7280" }}>লোড হচ্ছে...</p>
          ) : myListings.length === 0 ? (
            <p
              style={{
                color: "#6b7280",
                background: "#f9fafb",
                padding: "18px 20px",
                borderRadius: 10,
                border: "1px dashed #d1d5db",
              }}
            >
              এখনো কোনো listing নেই। উপরের ফর্মে ফসল যোগ করুন।
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myListings.map((l) => (
                <div
                  key={l._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 10,
                    padding: "14px 18px",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    {l.img ? (
                      <img
                        src={l.img}
                        alt={l.crop}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          background: "#dcfce7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="fa-solid fa-seedling"
                          style={{ color: "#15803d" }}
                        />
                      </div>
                    )}
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.98rem",
                          color: "#111827",
                        }}
                      >
                        {l.crop}
                      </div>
                      <div
                        style={{
                          fontSize: "0.82rem",
                          color: "#6b7280",
                          marginTop: 2,
                        }}
                      >
                        {l.qty && <span>পরিমাণ: {l.qty} &nbsp;|&nbsp;</span>}
                        মূল্য: ৳{l.price}/কেজি &nbsp;|&nbsp; {l.location || "—"}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        background:
                          l.status === "active" ? "#dcfce7" : "#fee2e2",
                        color: l.status === "active" ? "#166534" : "#991b1b",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {l.status === "active" ? "✓ সক্রিয়" : l.status}
                    </span>
                    <button
                      onClick={() => handleDelete(l._id)}
                      style={{
                        background: "#fee2e2",
                        border: "none",
                        borderRadius: 8,
                        padding: "6px 12px",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                    >
                      <i className="fa-solid fa-trash" /> মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const sectionWrap = {
  margin: "40px 0",
  background: "var(--card-bg, #fff)",
  borderRadius: 18,
  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
  overflow: "hidden",
};
const labelStyle = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};
const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 9,
  border: "1.5px solid #d1d5db",
  fontSize: "0.94rem",
  outline: "none",
  boxSizing: "border-box",
  background: "#f9fafb",
};
