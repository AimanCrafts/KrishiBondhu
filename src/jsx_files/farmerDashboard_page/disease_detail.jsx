// src/jsx_files/farmerDashboard_page/disease_detail.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css_files/farmerDashboard_page/disease_detail.css";

const API = "http://localhost:5000/api";

const SEV_MAP = {
  high: { label: "High", cls: "dd-sev-high", icon: "fa-triangle-exclamation" },
  medium: {
    label: "Medium",
    cls: "dd-sev-medium",
    icon: "fa-circle-exclamation",
  },
  low: { label: "Low", cls: "dd-sev-low", icon: "fa-circle-check" },
};

const CROP_ICON = {
  rice: "fa-wheat-awn",
  wheat: "fa-seedling",
  potato: "fa-circle",
  maize: "fa-leaf",
  jute: "fa-spa",
  other: "fa-virus",
};

export default function DiseaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API}/admin/diseases`);
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        const found = (data.diseases || []).find((d) => d._id === id);
        if (!found) throw new Error("Disease পাওয়া যায়নি।");
        setDisease(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  if (loading) {
    return (
      <div className="dd-loading">
        <div className="dd-loading-spinner">
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
        <p>Loading disease details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dd-error">
        <i className="fa-solid fa-triangle-exclamation" />
        <h3>{error}</h3>
        <button className="dd-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" /> Go Back
        </button>
      </div>
    );
  }

  const sev = SEV_MAP[disease.severity] || SEV_MAP.medium;

  return (
    <div className="dd-root">
      {/* ── Hero ── */}
      <div className="dd-hero">
        <img
          src={
            disease.img || "https://via.placeholder.com/1200x500?text=No+Image"
          }
          alt={disease.name}
          className="dd-hero-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1200x500?text=No+Image";
          }}
        />
        <div className="dd-hero-overlay" />

        <button className="dd-back-btn-hero" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" /> Back
        </button>

        <div className="dd-hero-content">
          <div className="dd-hero-badges">
            <span className="dd-crop-badge">
              <i
                className={`fa-solid ${CROP_ICON[disease.crop] || "fa-seedling"}`}
              />
              {disease.crop}
            </span>
            <span className={`dd-sev-badge ${sev.cls}`}>
              <i className={`fa-solid ${sev.icon}`} />
              {sev.label} Severity
            </span>
          </div>
          <h1 className="dd-hero-title">{disease.name}</h1>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="dd-body">
        {/* Info cards */}
        <div className="dd-info-row">
          <div className="dd-info-card">
            <div className={`dd-info-icon dd-icon-${disease.severity}`}>
              <i className={`fa-solid ${sev.icon}`} />
            </div>
            <div>
              <div className="dd-info-label">Severity</div>
              <div
                className="dd-info-value"
                style={{ textTransform: "capitalize" }}
              >
                {disease.severity}
              </div>
            </div>
          </div>
          <div className="dd-info-card">
            <div className="dd-info-icon">
              <i
                className={`fa-solid ${CROP_ICON[disease.crop] || "fa-seedling"}`}
              />
            </div>
            <div>
              <div className="dd-info-label">Affected Crop</div>
              <div
                className="dd-info-value"
                style={{ textTransform: "capitalize" }}
              >
                {disease.crop}
              </div>
            </div>
          </div>
          {disease.symptoms && disease.symptoms.length > 0 && (
            <div className="dd-info-card">
              <div className="dd-info-icon">
                <i className="fa-solid fa-list-check" />
              </div>
              <div>
                <div className="dd-info-label">Symptoms Count</div>
                <div className="dd-info-value">
                  {disease.symptoms.length} symptoms
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {disease.desc && (
          <div className="dd-section">
            <div className="dd-section-title">
              <i className="fa-solid fa-circle-info" /> About this Disease
            </div>
            <p className="dd-desc">{disease.desc}</p>
          </div>
        )}

        {/* Symptoms */}
        {disease.symptoms && disease.symptoms.length > 0 && (
          <div className="dd-section">
            <div className="dd-section-title">
              <i className="fa-solid fa-virus" /> Symptoms
            </div>
            <div className="dd-symptoms-list">
              {disease.symptoms.map((s, i) => (
                <div key={i} className="dd-symptom-item">
                  <div className="dd-symptom-dot" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treatment */}
        {disease.treatment && (
          <div className="dd-section dd-section-treatment">
            <div className="dd-section-title">
              <i className="fa-solid fa-kit-medical" /> Treatment
            </div>
            <p className="dd-desc">{disease.treatment}</p>
          </div>
        )}

        {/* Prevention */}
        {disease.prevention && (
          <div className="dd-section dd-section-prevention">
            <div className="dd-section-title">
              <i className="fa-solid fa-shield-halved" /> Prevention
            </div>
            <p className="dd-desc">{disease.prevention}</p>
          </div>
        )}

        {/* Back */}
        <div className="dd-footer-actions">
          <button className="dd-btn-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" /> Back to Disease Library
          </button>
        </div>
      </div>
    </div>
  );
}
