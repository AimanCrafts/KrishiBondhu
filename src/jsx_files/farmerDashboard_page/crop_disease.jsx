// src/jsx_files/farmerDashboard_page/crop_disease.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/farmerDashboard_page/crop_disease.css";

const API = "http://localhost:5000/api";

const CROP_ICON = {
  rice: "fa-wheat-awn",
  wheat: "fa-seedling",
  potato: "fa-circle",
  maize: "fa-leaf",
  jute: "fa-spa",
  other: "fa-virus",
};

function SkeletonCard() {
  return (
    <div className="cd-card cd-card-skeleton">
      <div className="cd-skeleton-img" />
      <div className="cd-skeleton-body">
        <div className="cd-skeleton-line cd-sk-title" />
        <div className="cd-skeleton-line cd-sk-sub" />
        <div className="cd-skeleton-tags">
          <div className="cd-skeleton-tag" />
          <div className="cd-skeleton-tag" />
        </div>
      </div>
    </div>
  );
}

export default function CropDisease() {
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const res = await fetch(`${API}/admin/diseases`);
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setDiseases(data.diseases || []);
      } catch {
        setError("Backend connect করা যাচ্ছে না।");
      } finally {
        setLoading(false);
      }
    };
    fetchDiseases();
  }, []);

  // Dynamic crop filters from fetched data
  const cropTypes = ["all", ...new Set(diseases.map((d) => d.crop))];

  const filtered = diseases.filter(
    (d) =>
      (activeFilter === "all" || d.crop === activeFilter) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.crop.toLowerCase().includes(search.toLowerCase()) ||
        (d.symptoms || []).some((s) =>
          s.toLowerCase().includes(search.toLowerCase()),
        )),
  );

  return (
    <div className="cd-root">
      {/* ── HERO ── */}
      <div className="cd-hero">
        <div className="cd-hero-bg" />
        <div className="cd-hero-content">
          <div className="cd-hero-badge">
            <i className="fa-solid fa-virus" /> KrishiBondhu — Disease Library
          </div>
          <h1 className="cd-hero-title">
            Crop Disease <span>Explorer</span>
          </h1>
          <p className="cd-hero-sub">
            Search, filter and explore common crop diseases with severity
            levels, symptoms, and expert guidance.
          </p>
          <div className="cd-hero-stats">
            <div className="cd-hero-stat">
              <div className="cd-hero-stat-icon">
                <i className="fa-solid fa-virus" />
              </div>
              <span>
                {loading ? "..." : `${diseases.length} Diseases Listed`}
              </span>
            </div>
            <div className="cd-hero-stat">
              <div className="cd-hero-stat-icon">
                <i className="fa-solid fa-wheat-awn" />
              </div>
              <span>
                {loading
                  ? "..."
                  : `${new Set(diseases.map((d) => d.crop)).size} Crop Types`}
              </span>
            </div>
            <div className="cd-hero-stat">
              <div className="cd-hero-stat-icon">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <span>Prevention Tips</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="cd-main">
        {/* Error */}
        {error && (
          <div className="cd-error-box">
            <i className="fa-solid fa-triangle-exclamation" /> {error}
          </div>
        )}

        {!error && (
          <>
            {/* Controls */}
            <div className="cd-controls">
              <div className="cd-search-wrap">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  type="text"
                  placeholder="Search disease or crop name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="cd-search-clear"
                    onClick={() => setSearch("")}
                  >
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>
              <div className="cd-filter-pills">
                {cropTypes.map((c) => (
                  <button
                    key={c}
                    className={`cd-pill ${activeFilter === c ? "active" : ""}`}
                    onClick={() => setActiveFilter(c)}
                  >
                    {c === "all"
                      ? "All"
                      : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <p className="cd-results-meta">
              {loading ? (
                "Loading diseases..."
              ) : (
                <>
                  {" "}
                  Showing <span>{filtered.length}</span> diseases{" "}
                </>
              )}
            </p>
          </>
        )}

        {/* Grid */}
        <div className="cd-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? null : filtered.length === 0 ? (
            <div className="cd-empty">
              <span>🌱</span>
              <h3>No diseases found</h3>
              <p>Try a different search term or filter.</p>
            </div>
          ) : (
            filtered.map((d, idx) => (
              <div
                key={d._id}
                className="cd-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
                onClick={() => navigate(`/disease_detail/${d._id}`)}
              >
                <img
                  className="cd-card-img"
                  src={
                    d.img || "https://via.placeholder.com/800x400?text=No+Image"
                  }
                  alt={d.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
                <div className="cd-card-grad" />

                {/* Crop tag */}
                <span className="cd-crop-tag">
                  <i
                    className={`fa-solid ${CROP_ICON[d.crop] || "fa-seedling"}`}
                  />
                  {d.crop}
                </span>

                {/* Severity badge */}
                <span className={`cd-sev-badge cd-sev-${d.severity}`}>
                  ● {d.severity}
                </span>

                <div className="cd-card-body">
                  <div className="cd-card-title">{d.name}</div>
                  {d.desc && <div className="cd-card-desc">{d.desc}</div>}
                  {d.symptoms && d.symptoms.length > 0 && (
                    <div className="cd-symptoms">
                      {d.symptoms.slice(0, 3).map((s) => (
                        <span key={s} className="cd-sym-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="cd-card-arrow">
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
