// src/jsx_files/buyer_page/farmer_directory.jsx
import { useState, useEffect, useRef } from "react";

import "../../css_files/buyer_page/farmer_directory.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DIVISIONS = [
  "all",
  "dhaka",
  "chittagong",
  "rajshahi",
  "khulna",
  "mymensingh",
  "rangpur",
  "sylhet",
  "barishal",
];
const AVATAR_COLORS = [
  "#4f46e5",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#db2777",
  "#0d9488",
];

/* ── Contact Modal ── */
function ContactModal({ farmer, onClose }) {
  const letter = farmer.name?.charAt(0).toUpperCase() || "F";
  const colorIdx = (farmer.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const district = farmer.profile?.district || farmer.district || "—";
  const division = farmer.profile?.division || farmer.division || "—";
  const cropName = farmer.farmData?.currentCrop?.name || null;

  return (
    <div className="fd-modal-overlay" onClick={onClose}>
      <div className="fd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fd-modal-header">
          <div
            className="fd-modal-avatar"
            style={{ background: AVATAR_COLORS[colorIdx] }}
          >
            {letter}
          </div>
          <div className="fd-modal-info">
            <div className="fd-modal-name">{farmer.name}</div>
            <div className="fd-modal-loc">
              <i className="fa-solid fa-location-dot" /> {district},{" "}
              {division.charAt(0).toUpperCase() + division.slice(1)}
            </div>
          </div>
          <button className="fd-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="fd-modal-body">
          {farmer.profile?.bio && (
            <p className="fd-modal-specialty">{farmer.profile.bio}</p>
          )}
          {cropName && (
            <div className="fd-modal-detail-row">
              <i className="fa-solid fa-seedling" />{" "}
              <strong>Current Crop:</strong> {cropName}
            </div>
          )}
          {farmer.profile?.farmSize && (
            <div className="fd-modal-detail-row">
              <i className="fa-solid fa-land-mine-on" />{" "}
              <strong>Farm Size:</strong> {farmer.profile.farmSize} acres
            </div>
          )}
          <div className="fd-modal-detail-row">
            <i className="fa-solid fa-calendar" />{" "}
            <strong>Member since:</strong>{" "}
            {new Date(farmer.createdAt).toLocaleDateString("en-BD", {
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="fd-modal-actions">
          {farmer.phone && (
            <a
              href={`tel:${farmer.phone}`}
              className="fd-modal-btn fd-btn-call"
            >
              <i className="fa-solid fa-phone" /> Call Farmer
            </a>
          )}
          <button
            className="fd-modal-btn fd-btn-msg"
            onClick={() => alert("Messaging feature আসছে শীঘ্রই!")}
          >
            <i className="fa-solid fa-comment-dots" /> Send Message
          </button>
          <button
            className="fd-modal-btn fd-btn-order"
            onClick={() => alert("Supply request feature আসছে শীঘ্রই!")}
          >
            <i className="fa-solid fa-cart-shopping" /> Request Supply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function FarmerDirectory() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [divFilter, setDivFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const revealRefs = useRef([]);

  // ── Fetch real farmers from backend ─────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("kb_token");
    const params = new URLSearchParams();
    if (divFilter !== "all") params.set("division", divFilter);
    if (search) params.set("search", search);

    setLoading(true);
    fetch(`${API_BASE}/api/buyer/farmers?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((data) => {
        setFarmers(data.farmers || []);
        setError("");
      })
      .catch(() => setError("Could not load farmer list. Please try again."))
      .finally(() => setLoading(false));
  }, [divFilter, search]);

  // ── Scroll reveal ────────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("fd-vis");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [farmers]);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // ── Client-side sort ─────────────────────────────────────────
  const sorted = [...farmers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // ── Stats derived from real data ─────────────────────────────
  const divisions = [
    ...new Set(
      farmers.map((f) => f.profile?.division || f.division).filter(Boolean),
    ),
  ];
  const stats = {
    total: farmers.length,
    divisions: divisions.length,
  };

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
      <div className="fd-page">
        {/* HERO */}
        <section className="fd-hero">
          <div className="fd-hero-bg" />
          <div className="fd-hero-content">
            <div className="fd-hero-badge">
              <i className="fa-solid fa-tractor" /> Farmer Network
            </div>
            <h1 className="fd-hero-title">
              Your Farmer <span>Directory</span>
            </h1>
            <p className="fd-hero-sub">
              Connect directly with verified farmers across Bangladesh. Filter
              by region and crop to find your ideal supply partner.
            </p>
            <div className="fd-hero-stats">
              {[
                {
                  label: "Active Farmers",
                  val: loading ? "…" : stats.total,
                  icon: "fa-users",
                },
                {
                  label: "Divisions",
                  val: loading ? "…" : stats.divisions,
                  icon: "fa-map-location-dot",
                },
                { label: "Verified", val: "✓", icon: "fa-shield-halved" },
              ].map((s) => (
                <div key={s.label} className="fd-hstat">
                  <div className="fd-hstat-icon">
                    <i className={`fa-solid ${s.icon}`} />
                  </div>
                  <div className="fd-hstat-val">{s.val}</div>
                  <div className="fd-hstat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <div className="fd-controls fd-reveal" ref={addRef}>
          <div className="fd-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search by name, district or crop…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="fd-search-clear">
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>
          <div className="fd-filter-row">
            <select
              className="fd-select"
              value={divFilter}
              onChange={(e) => setDivFilter(e.target.value)}
            >
              <option value="all">All Divisions</option>
              {DIVISIONS.slice(1).map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="fd-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort: Name</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>

        <div className="fd-meta fd-reveal" ref={addRef}>
          {loading ? (
            "Loading..."
          ) : (
            <>
              Found <strong>{sorted.length}</strong> farmers
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              padding: "16px 20px",
              borderRadius: 10,
              margin: "16px 0",
            }}
          >
            <i
              className="fa-solid fa-triangle-exclamation"
              style={{ marginRight: 8 }}
            />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="fd-grid fd-reveal" ref={addRef}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="fd-card"
                style={{ opacity: 0.5, pointerEvents: "none" }}
              >
                <div
                  style={{
                    height: 60,
                    background: "#e5e7eb",
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                />
                <div
                  style={{
                    height: 18,
                    background: "#e5e7eb",
                    borderRadius: 6,
                    marginBottom: 8,
                    width: "60%",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    background: "#e5e7eb",
                    borderRadius: 6,
                    width: "40%",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* GRID */}
        {!loading && (
          <div className="fd-grid fd-reveal" ref={addRef}>
            {sorted.length === 0 ? (
              <div className="fd-empty">
                <span>🌾</span>
                <h3>No farmers found</h3>
                <p>Try changing the filter or search term.</p>
              </div>
            ) : (
              sorted.map((f, i) => {
                const letter = f.name?.charAt(0).toUpperCase() || "F";
                const colorIdx =
                  (f.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
                const district = f.profile?.district || f.district || "—";
                const division = f.profile?.division || f.division || "—";
                const cropName = f.farmData?.currentCrop?.name;
                const farmSize = f.profile?.farmSize;

                return (
                  <div
                    key={f._id}
                    className="fd-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="fd-card-top">
                      <div
                        className="fd-card-avatar"
                        style={{ background: AVATAR_COLORS[colorIdx] }}
                      >
                        {letter}
                      </div>
                      {/* Admin approved মানেই verified */}
                      <div
                        className="fd-verified-badge"
                        title="Verified Farmer"
                      >
                        <i className="fa-solid fa-shield-halved" /> Verified
                      </div>
                    </div>

                    <div className="fd-card-name">{f.name}</div>
                    <div className="fd-card-loc">
                      <i className="fa-solid fa-location-dot" /> {district},{" "}
                      {division.charAt(0).toUpperCase() + division.slice(1)}
                    </div>

                    {/* Current crop as tag */}
                    {cropName && (
                      <div className="fd-card-crops">
                        <span className="fd-crop-tag">{cropName}</span>
                      </div>
                    )}

                    {/* Bio if available */}
                    {f.profile?.bio && (
                      <div className="fd-card-specialty">{f.profile.bio}</div>
                    )}

                    <div className="fd-card-stats">
                      <div className="fd-stat">
                        <div className="fd-stat-val">✓</div>
                        <div className="fd-stat-lbl">Active</div>
                      </div>
                      {farmSize && (
                        <>
                          <div className="fd-stat-div" />
                          <div className="fd-stat">
                            <div className="fd-stat-val">{farmSize}</div>
                            <div className="fd-stat-lbl">Acres</div>
                          </div>
                        </>
                      )}
                      <div className="fd-stat-div" />
                      <div className="fd-stat">
                        <div className="fd-stat-val">
                          {new Date(f.createdAt).getFullYear()}
                        </div>
                        <div className="fd-stat-lbl">Joined</div>
                      </div>
                    </div>

                    <button
                      className="fd-card-btn"
                      onClick={() => setSelectedFarmer(f)}
                    >
                      <i className="fa-solid fa-comment-dots" /> Connect
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedFarmer && (
        <ContactModal
          farmer={selectedFarmer}
          onClose={() => setSelectedFarmer(null)}
        />
      )}
    </>
  );
}
