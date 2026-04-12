// src/jsx_files/farmerDashboard_page/crop_management.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/farmerDashboard_page/crop_management.css";

const API = "http://localhost:5000/api";

const typeIcon = {
  grain:     "fa-wheat-awn",
  vegetable: "fa-carrot",
  fruit:     "fa-apple-whole",
  cash:      "fa-money-bill-trend-up",
  pulse:     "fa-circle-dot",
};

const seasonLabel = (s) => {
  if (s === "yearround") return "Year Round";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function SkeletonCard() {
  return (
    <div className="cm-card cm-card-skeleton">
      <div className="cm-skeleton-img" />
      <div className="cm-skeleton-body">
        <div className="cm-skeleton-line cm-sk-title" />
        <div className="cm-skeleton-line cm-sk-sub" />
        <div className="cm-skeleton-tags">
          <div className="cm-skeleton-tag" />
          <div className="cm-skeleton-tag" />
        </div>
      </div>
    </div>
  );
}

export default function CropManagement() {
  const navigate = useNavigate();
  const [crops, setCrops]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch(`${API}/admin/crops`);
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setCrops(data.crops || []);
      } catch {
        setError("Backend connect করা যাচ্ছে না। Server চালু আছে কিনা দেখো।");
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  const filters = [
    { id: "all",       label: "All" },
    { id: "grain",     label: "🌾 Grain" },
    { id: "vegetable", label: "🥦 Vegetable" },
    { id: "fruit",     label: "🍎 Fruit" },
    { id: "cash",      label: "💰 Cash Crop" },
    { id: "pulse",     label: "🫘 Pulse" },
  ];

  const filtered = crops.filter(
    (c) =>
      (activeFilter === "all" || c.type === activeFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.type || "").includes(search.toLowerCase()) ||
        (c.region || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.tags || []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        )),
  );

  return (
    <div className="cm-root">
      {/* HERO */}
      <div className="cm-hero">
        <div className="cm-hero-bg" />
        <div className="cm-hero-content">
          <div className="cm-hero-badge">
            <i className="fa-solid fa-seedling" /> KrishiBondhu — Crop Library
          </div>
          <h1 className="cm-hero-title">
            Crop <span>Explorer</span>
          </h1>
          <p className="cm-hero-sub">
            Discover crops by season, type, and region. Get full cultivation
            guides, soil requirements, and market insights.
          </p>
          <div className="cm-hero-stats">
            <div className="cm-hero-stat">
              <div className="cm-hero-stat-icon">
                <i className="fa-solid fa-seedling" />
              </div>
              <span>{loading ? "..." : `${crops.length} Crops Listed`}</span>
            </div>
            <div className="cm-hero-stat">
              <div className="cm-hero-stat-icon">
                <i className="fa-solid fa-sun" />
              </div>
              <span>3 Seasons</span>
            </div>
            <div className="cm-hero-stat">
              <div className="cm-hero-stat-icon">
                <i className="fa-solid fa-map-location-dot" />
              </div>
              <span>All Regions</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="cm-main">

        {/* Error */}
        {error && (
          <div className="cm-error-box">
            <i className="fa-solid fa-triangle-exclamation" />
            {error}
          </div>
        )}

        {/* Controls */}
        {!error && (
          <>
            <div className="cm-controls">
              <div className="cm-search-wrap">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  type="text"
                  placeholder="Search crop name, region or tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="cm-search-clear" onClick={() => setSearch("")}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>
              <div className="cm-filter-pills">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    className={`cm-pill ${activeFilter === f.id ? "active" : ""}`}
                    onClick={() => setActiveFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="cm-results-meta">
              {loading
                ? "Loading crops..."
                : <> Showing <span>{filtered.length}</span> crops </>
              }
            </p>
          </>
        )}

        {/* Grid */}
        <div className="cm-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? null : filtered.length === 0 ? (
            <div className="cm-empty">
              <span>🌱</span>
              <h3>No crops found</h3>
              <p>Admin এখনো কোনো crop add করেনি অথবা filter পরিবর্তন করো।</p>
            </div>
          ) : (
            filtered.map((crop, idx) => (
              <div
                key={crop._id}
                className="cm-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
                onClick={() => navigate(`/crop_detail/${crop._id}`)}
              >
                <img
                  className="cm-card-img"
                  src={crop.img || "https://via.placeholder.com/800x400?text=No+Image"}
                  alt={crop.name}
                  loading="lazy"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/800x400?text=No+Image"; }}
                />
                <div className="cm-card-grad" />

                <span className="cm-type-tag">
                  <i className={`fa-solid ${typeIcon[crop.type] || "fa-seedling"}`} />
                  {crop.type}
                </span>

                <span className={`cm-season-badge ${crop.season}`}>
                  {seasonLabel(crop.season)}
                </span>

                <div className="cm-card-body">
                  <div className="cm-card-title">{crop.name}</div>
                  {crop.region && (
                    <div className="cm-card-region">
                      <i className="fa-solid fa-location-dot" /> {crop.region}
                    </div>
                  )}
                  {crop.period && (
                    <div className="cm-card-region">
                      <i className="fa-regular fa-clock" /> {crop.period}
                    </div>
                  )}
                  {crop.desc && <div className="cm-card-desc">{crop.desc}</div>}
                  {crop.tags && crop.tags.length > 0 && (
                    <div className="cm-card-tags">
                      {crop.tags.slice(0, 3).map((t) => (
                        <span key={t} className="cm-card-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="cm-card-arrow">
                  <i className="fa-solid fa-arrow-right" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}