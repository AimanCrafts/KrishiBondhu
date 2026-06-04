// src/jsx_files/farmerDashboard_page/consult_expert.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/farmerDashboard_page/consult_expert.css";

const API = "http://localhost:5000/api";

function SkeletonCard() {
  return (
    <div className="ce-card ce-card-skeleton">
      <div className="ce-skeleton-avatar" />
      <div className="ce-skeleton-body">
        <div className="ce-skeleton-line ce-sk-name" />
        <div className="ce-skeleton-line ce-sk-spec" />
        <div className="ce-skeleton-line ce-sk-inst" />
        <div className="ce-skeleton-line ce-sk-bio" />
      </div>
    </div>
  );
}

function ExpertCard({ expert }) {
  const initials = expert.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`ce-card ${!expert.available ? "ce-card-unavailable" : ""}`}
    >
      <div className="ce-card-header">
        <div className="ce-avatar">
          {expert.img ? (
            <img src={expert.img} alt={expert.name} className="ce-avatar-img" />
          ) : (
            <span className="ce-avatar-initials">{initials}</span>
          )}
          <span
            className={`ce-avail-dot ${expert.available ? "available" : "unavailable"}`}
          />
        </div>
        <div className="ce-card-meta">
          <div className="ce-name">{expert.name}</div>
          <div className="ce-specialty">
            <i className="fa-solid fa-microscope" /> {expert.specialty}
          </div>
          {expert.institution && (
            <div className="ce-institution">
              <i className="fa-solid fa-building-columns" />{" "}
              {expert.institution}
            </div>
          )}
          {expert.experience && (
            <div className="ce-experience">
              <i className="fa-solid fa-clock" /> {expert.experience} experience
            </div>
          )}
        </div>
      </div>

      {expert.bio && <p className="ce-bio">{expert.bio}</p>}

      <div className="ce-availability-badge">
        <i
          className={`fa-solid ${expert.available ? "fa-circle-check" : "fa-circle-xmark"}`}
        />
        {expert.available
          ? "Available for Consultation"
          : "Currently Unavailable"}
      </div>

      <div className="ce-card-actions">
        {expert.phone && (
          <a href={`tel:${expert.phone}`} className="ce-btn ce-btn-call">
            <i className="fa-solid fa-phone" /> Call
          </a>
        )}
        {expert.email && (
          <a href={`mailto:${expert.email}`} className="ce-btn ce-btn-email">
            <i className="fa-solid fa-envelope" /> Email
          </a>
        )}
        {!expert.phone && !expert.email && (
          <span className="ce-no-contact">No contact information</span>
        )}
      </div>
    </div>
  );
}

export default function ConsultExpert() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterAvail, setFilterAvail] = useState("all");

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch(`${API}/admin/experts`);
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        setExperts(data.experts || []);
      } catch {
        setError("Unable to connect to server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filtered = experts.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.specialty.toLowerCase().includes(search.toLowerCase()) ||
      (e.institution || "").toLowerCase().includes(search.toLowerCase());
    const matchAvail =
      filterAvail === "all" ||
      (filterAvail === "available" && e.available) ||
      (filterAvail === "unavailable" && !e.available);
    return matchSearch && matchAvail;
  });

  const availableCount = experts.filter((e) => e.available).length;

  return (
    <div className="ce-root">
      {/* ── TOPBAR ── */}
      <nav className="ce-topbar">
        <div className="ce-topbar-brand">
          <i className="fa-solid fa-leaf" />
          <span className="ce-logo-text">
            <span className="ce-krishi">Krishi</span>Bondhu
          </span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="ce-hero">
        <div className="ce-hero-bg" />
        <div className="ce-hero-content">
          <div className="ce-hero-badge">
            <i className="fa-solid fa-user-graduate" /> Expert Consultation
          </div>
          <h1 className="ce-hero-title">
            Talk to Agricultural <span>Experts</span>
          </h1>
          <p className="ce-hero-sub">
            Get direct advice from experienced agronomists and researchers.
            Crops, pests &amp; diseases, fertilizers — get help with any
            problem.
          </p>
          <div className="ce-hero-stats">
            <div className="ce-hstat">
              <i className="fa-solid fa-users" />
              <strong>{experts.length}</strong>
              <span>Experts</span>
            </div>
            <div className="ce-hstat">
              <i className="fa-solid fa-circle-check" />
              <strong>{availableCount}</strong>
              <span>Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTROLS ── */}
      <div className="ce-controls">
        <div className="ce-search-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search by name, specialty or institution…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ce-search-clear" onClick={() => setSearch("")}>
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
        <div className="ce-filter-tabs">
          {[
            { id: "all", label: "All" },
            { id: "available", label: "Available" },
            { id: "unavailable", label: "Unavailable" },
          ].map((f) => (
            <button
              key={f.id}
              className={`ce-filter-tab ${filterAvail === f.id ? "active" : ""}`}
              onClick={() => setFilterAvail(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main className="ce-main">
        {loading && (
          <div className="ce-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="ce-error-state">
            <i className="fa-solid fa-triangle-exclamation" />
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="ce-retry-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="ce-empty-state">
            <i className="fa-solid fa-user-graduate" />
            <p>
              {search || filterAvail !== "all"
                ? "No experts found."
                : "No experts have been added yet."}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="ce-result-count">
              {filtered.length} expert{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="ce-grid">
              {filtered.map((e) => (
                <ExpertCard key={e._id} expert={e} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
