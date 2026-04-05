import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/farmerDashboard_page/crop_management.css";

const crops = [
  {
    name: "Rice",
    type: "grain",
    season: "kharif",
    region: "All Divisions",
    period: "120–150 days",
    desc: "Bangladesh's staple food crop, grown across all divisions with high water requirements.",
    tags: ["Staple", "High Yield", "Monsoon"],
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Wheat",
    type: "grain",
    season: "rabi",
    region: "Rajshahi, Rangpur",
    period: "100–120 days",
    desc: "Major winter grain crop grown in cooler northern regions with moderate water needs.",
    tags: ["Winter", "Cool Climate", "Dry"],
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Maize",
    type: "grain",
    season: "rabi",
    region: "Rangpur, Dinajpur",
    period: "90–110 days",
    desc: "Fast-growing grain with excellent feed and food value, widely cultivated in northern BD.",
    tags: ["Feed Crop", "High Protein", "Versatile"],
    img: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Potato",
    type: "vegetable",
    season: "rabi",
    region: "Munshiganj, Bogura",
    period: "70–90 days",
    desc: "Most important vegetable crop in Bangladesh with very high yield potential per acre.",
    tags: ["High Yield", "Cool Season", "Export"],
    img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Tomato",
    type: "vegetable",
    season: "rabi",
    region: "Jessore, Bogura",
    period: "60–80 days",
    desc: "Highly profitable vegetable crop grown in cool dry season with good market demand.",
    tags: ["High Value", "Market Crop", "Nutritious"],
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Brinjal",
    type: "vegetable",
    season: "yearround",
    region: "All Divisions",
    period: "55–65 days",
    desc: "Year-round vegetable with multiple harvests per season, very popular in local markets.",
    tags: ["Year Round", "Multiple Harvest", "Popular"],
    img: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mango",
    type: "fruit",
    season: "kharif",
    region: "Rajshahi, Chapai",
    period: "4–5 months",
    desc: "King of fruits — Bangladesh produces world-class mangoes especially in Rajshahi division.",
    tags: ["Premium", "Export Quality", "Seasonal"],
    img: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Banana",
    type: "fruit",
    season: "yearround",
    region: "All Divisions",
    period: "9–12 months",
    desc: "Year-round fruit crop with consistent market demand and excellent nutritional value.",
    tags: ["Year Round", "Nutritious", "High Demand"],
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Jute",
    type: "cash",
    season: "kharif",
    region: "Faridpur, Tangail",
    period: "100–120 days",
    desc: "Golden fibre of Bangladesh — world's leading jute producer with massive export value.",
    tags: ["Export", "Golden Fibre", "Eco-friendly"],
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sugarcane",
    type: "cash",
    season: "yearround",
    region: "Rajshahi, Natore",
    period: "12–14 months",
    desc: "Long duration cash crop used for sugar production, highly profitable with good management.",
    tags: ["Long Duration", "Sugar", "High Return"],
    img: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Lentil",
    type: "pulse",
    season: "rabi",
    region: "Kushtia, Pabna",
    period: "80–100 days",
    desc: "Most important pulse crop in Bangladesh, rich in protein and nitrogen-fixing for soil.",
    tags: ["Protein Rich", "Soil Fixing", "Winter"],
    img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Mustard",
    type: "cash",
    season: "rabi",
    region: "Sirajganj, Pabna",
    period: "75–90 days",
    desc: "Primary oilseed crop of Bangladesh, used for cooking oil production and livestock feed.",
    tags: ["Oilseed", "Short Duration", "High Value"],
    img: "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?auto=format&fit=crop&w=800&q=80",
  },
];

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

export default function CropManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All" },
    { id: "grain", label: "🌾 Grain" },
    { id: "vegetable", label: "🥦 Vegetable" },
    { id: "fruit", label: "🍎 Fruit" },
    { id: "cash", label: "💰 Cash Crop" },
    { id: "pulse", label: "🫘 Pulse" },
  ];

  const filtered = crops.filter(
    (c) =>
      (activeFilter === "all" || c.type === activeFilter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.type.includes(search.toLowerCase())),
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
              <span>12 Crops Listed</span>
            </div>
            <div className="cm-hero-stat">
              <div className="cm-hero-stat-icon">
                <i className="fa-solid fa-sun" />
              </div>
              <span>4 Seasons</span>
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
        {/* CONTROLS */}
        <div className="cm-controls">
          <div className="cm-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search crop name or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
          Showing <span>{filtered.length}</span> crops
        </p>

        {/* GRID */}
        <div className="cm-grid">
          {filtered.length === 0 ? (
            <div className="cm-empty">
              <span>🌱</span>
              <h3>No crops found</h3>
              <p>Try a different search term or filter.</p>
            </div>
          ) : (
            filtered.map((crop, idx) => (
              <div
                key={crop.name}
                className="cm-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
                onClick={() => navigate("/crop_detail")}
              >
                <img
                  className="cm-card-img"
                  src={crop.img}
                  alt={crop.name}
                  loading="lazy"
                />
                <div className="cm-card-grad" />

                <span className="cm-type-tag">
                  <i className={`fa-solid ${typeIcon[crop.type]}`} />
                  {crop.type}
                </span>

                <span className={`cm-season-badge ${crop.season}`}>
                  {seasonLabel(crop.season)}
                </span>

                <div className="cm-card-body">
                  <div className="cm-card-title">{crop.name}</div>
                  <div className="cm-card-region">
                    <i className="fa-solid fa-location-dot" />
                    {crop.region}
                  </div>
                  <div className="cm-card-desc">{crop.desc}</div>
                  <div className="cm-card-tags">
                    {crop.tags.map((t) => (
                      <span key={t} className="cm-card-tag">
                        {t}
                      </span>
                    ))}
                  </div>
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
