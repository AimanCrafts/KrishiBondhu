import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css_files/farmerDashboard_page/crop_detail.css";

const API = "http://localhost:5000/api";

const typeIcon = {
  grain: "fa-wheat-awn",
  vegetable: "fa-carrot",
  fruit: "fa-apple-whole",
  cash: "fa-money-bill-trend-up",
  pulse: "fa-circle-dot",
};

const seasonLabel = (s) => {
  if (s === "yearround") return "Year Round";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const seasonIcon = {
  kharif: "fa-cloud-rain",
  rabi: "fa-snowflake",
  yearround: "fa-arrows-rotate",
};

export default function CropDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const res = await fetch(`${API}/admin/crops`);
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        const found = (data.crops || []).find((c) => c._id === id);
        if (!found) throw new Error("Crop পাওয়া যায়নি।");
        setCrop(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCrop();
  }, [id]);

  if (loading) {
    return (
      <div className="crop-loading">
        <div className="crop-loading-spinner">
          <i className="fa-solid fa-spinner fa-spin" />
        </div>
        <p>Loading crop details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crop-error">
        <i className="fa-solid fa-triangle-exclamation" />
        <h3>{error}</h3>
        <button className="crop-back-btn" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="crop-root">
      {/* ── HERO IMAGE ── */}
      <div className="crop-hero">
        <img
          src={crop.img || "https://via.placeholder.com/1200x500?text=No+Image"}
          alt={crop.name}
          className="crop-hero-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1200x500?text=No+Image";
          }}
        />
        <div className="crop-hero-overlay" />

        {/* Back button */}
        <button className="crop-back-btn-hero" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left" /> Back
        </button>

        {/* Hero content */}
        <div className="crop-hero-content">
          <div className="crop-hero-badges">
            <span className="crop-type-badge">
              <i
                className={`fa-solid ${typeIcon[crop.type] || "fa-seedling"}`}
              />
              {crop.type}
            </span>
            <span className={`crop-season-badge crop-season-${crop.season}`}>
              <i
                className={`fa-solid ${seasonIcon[crop.season] || "fa-sun"}`}
              />
              {seasonLabel(crop.season)}
            </span>
          </div>
          <h1 className="crop-hero-title">{crop.name}</h1>
          {crop.region && (
            <div className="crop-hero-region">
              <i className="fa-solid fa-location-dot" /> {crop.region}
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="crop-body">
        {/* ── INFO CARDS ROW ── */}
        <div className="crop-info-row">
          {crop.period && (
            <div className="crop-info-card">
              <div className="crop-info-icon">
                <i className="fa-regular fa-clock" />
              </div>
              <div>
                <div className="crop-info-label">Growing Period</div>
                <div className="crop-info-value">{crop.period}</div>
              </div>
            </div>
          )}
          <div className="crop-info-card">
            <div className="crop-info-icon">
              <i
                className={`fa-solid ${seasonIcon[crop.season] || "fa-sun"}`}
              />
            </div>
            <div>
              <div className="crop-info-label">Season</div>
              <div className="crop-info-value">{seasonLabel(crop.season)}</div>
            </div>
          </div>
          <div className="crop-info-card">
            <div className="crop-info-icon">
              <i
                className={`fa-solid ${typeIcon[crop.type] || "fa-seedling"}`}
              />
            </div>
            <div>
              <div className="crop-info-label">Crop Type</div>
              <div
                className="crop-info-value"
                style={{ textTransform: "capitalize" }}
              >
                {crop.type}
              </div>
            </div>
          </div>
          {crop.region && (
            <div className="crop-info-card">
              <div className="crop-info-icon">
                <i className="fa-solid fa-map-location-dot" />
              </div>
              <div>
                <div className="crop-info-label">Region</div>
                <div className="crop-info-value">{crop.region}</div>
              </div>
            </div>
          )}
        </div>

        {/* ── DESCRIPTION ── */}
        {crop.desc && (
          <div className="crop-section">
            <div className="crop-section-title">
              <i className="fa-solid fa-circle-info" /> About this Crop
            </div>
            <p className="crop-desc">{crop.desc}</p>
          </div>
        )}

        {/* ── TAGS ── */}
        {crop.tags && crop.tags.length > 0 && (
          <div className="crop-section">
            <div className="crop-section-title">
              <i className="fa-solid fa-tags" /> Tags
            </div>
            <div className="crop-tags-wrap">
              {crop.tags.map((t) => (
                <span key={t} className="crop-tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── BACK BUTTON ── */}
        <div className="crop-footer-actions">
          <button className="crop-btn-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left" /> Back to Crop Library
          </button>
        </div>
      </div>
    </div>
  );
}
