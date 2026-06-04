import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/farmerDashboard_page/farmerDashboard.css";
import NotificationBell from "../../components/NotificationBell";

const API = "http://localhost:5000/api";

// ─── Helper: fetch fresh farmData from the backend ───────────
// We call this on mount so the dashboard always shows current
// data even if the user updated their farm info from Settings.
async function fetchFarmData() {
  const token = localStorage.getItem("kb_token");
  if (!token) return null;
  try {
    const res = await fetch(`${API}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.user?.farmData || null;
  } catch {
    return null;
  }
}

// ─── Helper: calculate days since a given date ───────────────
function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// ─── Helper: estimate progress % and stage name ──────────────
// Uses days-since-planting and a rough 120-day crop cycle.
// In a real system you would look up the crop's actual duration.
function getCropProgress(plantedOn) {
  const days = daysSince(plantedOn);
  if (days === null) return { pct: 0, stage: "Unknown" };

  // Very rough 120-day cycle split into 4 stages
  const stages = [
    { upTo: 20, label: "Germination / Seedling" },
    { upTo: 50, label: "Vegetative Growth" },
    { upTo: 85, label: "Flowering / Tillering" },
    { upTo: 120, label: "Ripening / Maturation" },
  ];
  const pct = Math.min(100, Math.round((days / 120) * 100));
  const stage = stages.find((s) => days <= s.upTo)?.label || "Ready to Harvest";
  return { pct, stage };
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  // Farm data loaded from backend (replaces hardcoded values)
  const [farmData, setFarmData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [todayDate, setTodayDate] = useState("");
  const [cropProgWidth, setCropProgWidth] = useState("0%");
  const revealRefs = useRef([]);

  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [marketLoading, setMarketLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // Set today's date string
  useEffect(() => {
    setTodayDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  // ── Fetch fresh farmData from backend on mount ─────────────
  useEffect(() => {
    fetchFarmData().then((data) => {
      setFarmData(data);
      setDataLoading(false);

      // Animate crop progress bar using real % after data loads
      if (data?.currentCrop?.plantedOn) {
        const { pct } = getCropProgress(data.currentCrop.plantedOn);
        setTimeout(() => setCropProgWidth(`${pct}%`), 400);
      } else {
        // No onboarding done — still animate to 0 so bar shows
        setTimeout(() => setCropProgWidth("0%"), 400);
      }
    });
  }, []);

  // ── Scroll reveal animation ────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // ── Weather: live from OpenWeather ────────────────────────
  useEffect(() => {
    if (!user) return;
    const district = user.profile?.district || "Dhaka";
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${district},BD&appid=${API_KEY}&units=metric`,
    )
      .then((r) => r.json())
      .then(setCurrentWeather);

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${district},BD&appid=${API_KEY}&units=metric`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (!data.list) return;
        const daily = data.list
          .filter((_, i) => i % 8 === 0)
          .slice(0, 7)
          .map((item) => ({
            day: new Date(item.dt_txt).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            icon: getWeatherIcon(item.weather[0].main),
            hi: Math.round(item.main.temp_max),
            lo: Math.round(item.main.temp_min),
            rain: item.pop ? `${Math.round(item.pop * 100)}%` : "0%",
          }));
        setForecast(daily);
      });
  }, [user]);

  // Fetch market prices from admin
  useEffect(() => {
    fetch(`${API}/admin/market-prices`)
      .then((r) => r.json())
      .then((data) => {
        const active = (data.prices || []).filter((p) => p.active);
        setMarketPrices(active);
      })
      .catch(() => setMarketPrices([]))
      .finally(() => setMarketLoading(false));
  }, []);

  const getWeatherIcon = (main) =>
    ({
      Clear: "☀️",
      Clouds: "⛅",
      Rain: "🌧",
      Drizzle: "🌦",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
    })[main] || "🌤️";

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  // ── Derive display values from real farmData ───────────────
  const firstName = user?.name ? user.name.split(" ")[0] : "Farmer";
  const locationStr = user?.profile
    ? `${user.profile.district || ""}, ${user.profile.division || ""}`
    : "Bangladesh";
  const avatarLetter = firstName.charAt(0).toUpperCase();

  const hasOnboarding = farmData?.onboardingDone;
  const currentCrop = farmData?.currentCrop;
  const plannedCrop = farmData?.plannedCrop;
  const fieldInfo = farmData?.field;

  // Crop progress (real calculation if planted date exists)
  const { pct: progressPct, stage: cropStage } = currentCrop?.plantedOn
    ? getCropProgress(currentCrop.plantedOn)
    : { pct: 0, stage: "Not set" };

  // Days until harvest (rough: 120 days total cycle)
  const daysGrown = daysSince(currentCrop?.plantedOn);
  const daysToHarvest =
    daysGrown !== null ? Math.max(0, 120 - daysGrown) : null;

  // Planned sowing date formatted
  const plannedSowFormatted = plannedCrop?.plannedSowOn
    ? new Date(plannedCrop.plannedSowOn).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // ─────────────────────────────────────────────────────────
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <div className="dashboard-root">
        {/* ── TOPBAR ─────────────────────────────────────────── */}
        <nav className="dashboard-topbar">
          <a className="dashboard-brand" href="#">
            <i className="fa-solid fa-leaf" />
            <span className="k">Krishi</span>
            <span className="b">Bondhu</span>
          </a>
          <div className="dashboard-top-center">
            <i className="fa-regular fa-calendar" />
            <span>{todayDate || "Loading…"}</span>
          </div>
          <div className="dashboard-top-right">
            <NotificationBell />
            <div className="dashboard-avatar-wrap">
              <div className="dashboard-avatar">{avatarLetter}</div>
              <div>
                <div className="dashboard-avatar-name">
                  {user.name || "Farmer"}
                </div>
                <div className="dashboard-avatar-role">{locationStr}</div>
              </div>
            </div>
            <button className="dashboard-menu-btn" onClick={toggleSidebar}>
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </nav>

        {/* ── SIDEBAR OVERLAY ────────────────────────────────── */}
        <div
          className={`dashboard-sidebar-overlay${sidebarOpen ? " open" : ""}`}
          onClick={toggleSidebar}
        />

        {/* ── SIDEBAR ────────────────────────────────────────── */}
        <nav className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}>
          <span className="dashboard-sidebar-section-label">Navigation</span>
          <a href="#" className="active">
            <i className="fa-solid fa-house" /> Dashboard
          </a>
          <a
            onClick={() => navigate("/my-listings")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-store" /> My Listings
          </a>
          <a
            onClick={() => navigate("/crop_library")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-seedling" /> Crop Library
          </a>
          <a
            onClick={() => navigate("/crop_disease")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-bug" /> Pest &amp; Disease
          </a>
          <span className="dashboard-sidebar-section-label">Tools</span>

          <a
            onClick={() => navigate("/consult-expert")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-user-pen" /> Consult Expert
          </a>
          <a
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-gear" /> Settings
          </a>
          <div className="dashboard-sidebar-section-label">Account</div>
          <a
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "#e53935" }}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ color: "#e53935" }}
            />{" "}
            Logout
          </a>
        </nav>

        {/* ── MAIN ───────────────────────────────────────────── */}
        <main className="dashboard-main">
          {/* ── ONBOARDING PROMPT (shown if user skipped or is new) ── */}
          {!dataLoading && !hasOnboarding && (
            <div
              className="dashboard-alert-banner"
              style={{ background: "#e8f5e9", borderColor: "#a5d6a7" }}
            >
              <i
                className="fa-solid fa-seedling dashboard-alert-icon"
                style={{ color: "#2e7d32" }}
              />
              <div
                className="dashboard-alert-text"
                style={{ color: "#1b5e20" }}
              >
                <strong>Set up your farm profile</strong> — Fill in your land
                and crop details to see personalized advice on this dashboard.
              </div>
              <button
                className="dashboard-alert-dismiss"
                style={{
                  background: "#2e7d32",
                  color: "#fff",
                  borderRadius: "6px",
                  padding: "4px 12px",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/onboarding")}
              >
                Start →
              </button>
            </div>
          )}

          {/* ── HERO STRIP ─────────────────────────────────────── */}
          <section className="dashboard-hero-strip">
            <div className="dashboard-hero-left">
              <div className="dashboard-hero-eyebrow">
                <span className="dashboard-pulse-dot" />
                {/* Show real crop name if available, else generic label */}
                {hasOnboarding && currentCrop?.name
                  ? `Active · ${currentCrop.name} Season`
                  : "Live · KrishiBondhu Dashboard"}
              </div>
              <h1 className="dashboard-hero-greeting">
                Good
                <br />
                Morning,
                <br />
                <span>{firstName}.</span>
              </h1>
              <p className="dashboard-hero-subtext">
                {hasOnboarding && currentCrop?.name
                  ? `Your ${currentCrop.name} field is being tracked. Check today's advice below.`
                  : "Complete your farm profile to get personalized crop advice and field tracking."}
              </p>
              <div className="dashboard-hero-stats-row">
                <div className="dashboard-hstat">
                  {/* Real area from onboarding, else dash */}
                  <div className="dashboard-hstat-val g">
                    {currentCrop?.areaAcres || fieldInfo?.totalAcres || "—"}
                  </div>
                  <div className="dashboard-hstat-label">Acres Active</div>
                </div>
                <div className="dashboard-hstat">
                  <div className="dashboard-hstat-val">
                    {daysToHarvest !== null ? daysToHarvest : "—"}
                    {daysToHarvest !== null && (
                      <span
                        style={{
                          fontSize: "0.45em",
                          fontWeight: 400,
                          color: "var(--muted)",
                        }}
                      >
                        days
                      </span>
                    )}
                  </div>
                  <div className="dashboard-hstat-label">To Harvest</div>
                </div>
                <div className="dashboard-hstat">
                  {/* Market price is still hardcoded — needs market API */}
                  <div className="dashboard-hstat-val a">৳48</div>
                  <div className="dashboard-hstat-label">Market / kg</div>
                </div>
              </div>
            </div>

            <div className="dashboard-hero-right">
              <img
                className="dashboard-hero-img"
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
                alt="Field"
              />
              <div className="dashboard-hero-img-overlay" />
              <div className="dashboard-hero-right-content">
                <div className="dashboard-status-pills">
                  {/* These 3 pills are still static — they need a real advisory engine */}
                  <div className="dashboard-status-pill">
                    <div className="dashboard-pill-icon ok">
                      <i className="fa-solid fa-droplet" />
                    </div>
                    <div className="dashboard-pill-text">
                      <strong>No Irrigation Needed</strong>
                      <span>Soil moisture 78% · Next check tomorrow</span>
                    </div>
                  </div>
                  <div className="dashboard-status-pill">
                    <div className="dashboard-pill-icon warn">
                      <i className="fa-solid fa-bug" />
                    </div>
                    <div className="dashboard-pill-text">
                      <strong>Pest Alert: Stem Borer</strong>
                      <span>Low risk · Monitor weekly</span>
                    </div>
                  </div>
                  <div className="dashboard-status-pill">
                    <div className="dashboard-pill-icon info">
                      <i className="fa-solid fa-seedling" />
                    </div>
                    <div className="dashboard-pill-text">
                      {/* Show real stage if known, else generic */}
                      <strong>Growth Stage: {cropStage}</strong>
                      <span>
                        {hasOnboarding && currentCrop?.name
                          ? `Tracking your ${currentCrop.name}`
                          : "Fill farm profile to track growth"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── ALERT BANNER ───────────────────────────────────── */}
          {alertVisible && (
            <div className="dashboard-alert-banner">
              <i className="fa-solid fa-triangle-exclamation dashboard-alert-icon" />
              <div className="dashboard-alert-text">
                <strong>Warning:</strong> Stem borer activity reported in nearby
                Gazipur fields. Inspect crop edges and apply chlorpyrifos if
                infestation exceeds 5% of plants.
              </div>
              <button
                className="dashboard-alert-dismiss"
                onClick={() => setAlertVisible(false)}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          )}

          {/* ── WEATHER (fully real — unchanged) ───────────────── */}
          <section className="dashboard-weather-section">
            <div className="dashboard-weather-inner">
              <div className="dashboard-weather-today">
                <div>
                  <div className="dashboard-weather-location">
                    <i className="fa-solid fa-location-dot" />
                    {locationStr} Division
                  </div>
                  <div className="dashboard-weather-desc">
                    {currentWeather?.weather?.[0]?.description}
                  </div>
                  <div className="dashboard-weather-meta">
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-droplet" />
                      Humidity {currentWeather?.main?.humidity}%
                    </div>
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-wind" />
                      Wind{" "}
                      {Math.round(
                        (currentWeather?.wind?.speed || 0) * 3.6,
                      )}{" "}
                      km/h
                    </div>
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-eye" />
                      Visibility 8 km
                    </div>
                  </div>
                </div>
                <div>
                  <div className="dashboard-weather-temp-big">
                    {Math.round(currentWeather?.main?.temp || 0)}
                    <sup>°C</sup>
                  </div>
                  <div className="dashboard-weather-feel">
                    Feels like{" "}
                    {Math.round(currentWeather?.main?.feels_like || 0)}°C
                  </div>
                </div>
              </div>
              <div className="dashboard-forecast-strip">
                <div className="dashboard-forecast-label">7-Day Forecast</div>
                <div className="dashboard-forecast-days">
                  {forecast.map((f, i) => (
                    <div
                      key={i}
                      className={`dashboard-f-day${i === 0 ? " today" : ""}`}
                    >
                      <div className="dashboard-f-day-name">{f.day}</div>
                      <div className="dashboard-f-day-icon">{f.icon}</div>
                      <div className="dashboard-f-day-temp">{f.hi}°</div>
                      <div className="dashboard-f-day-lo">{f.lo}°</div>
                      <div className="dashboard-f-day-rain">{f.rain}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── CROP & FIELD SECTION ────────────────────────────── */}
          <section
            className="dashboard-crop-field-section reveal"
            ref={addRevealRef}
          >
            <p className="dashboard-section-eyebrow">Crop Intelligence</p>
            <h2 className="dashboard-section-title">Your Fields &amp; Crops</h2>

            <div className="dashboard-crop-bento">
              {/* ── Current crop card ── */}
              <div className="dashboard-crop-main">
                <img
                  className="dashboard-crop-main-img"
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=900&q=80"
                  alt="Crop"
                />
                <div className="dashboard-crop-main-grad" />
                <div className="dashboard-crop-main-content">
                  <div className="dashboard-crop-badge">
                    <i className="fa-solid fa-circle-check" /> Currently Growing
                  </div>

                  {/* Real crop name or prompt */}
                  <div className="dashboard-crop-name">
                    {currentCrop?.name || "Not set"}
                  </div>
                  <div className="dashboard-crop-sub">
                    {currentCrop?.variety ? `${currentCrop.variety} · ` : ""}
                    {currentCrop?.fieldName || "Field A"}
                  </div>

                  {/* Progress bar — driven by real planted date */}
                  <div className="dashboard-crop-progress-wrap">
                    <div className="dashboard-crop-progress-label">
                      <span>{cropStage}</span>
                      <strong>{progressPct}% complete</strong>
                    </div>
                    <div className="dashboard-crop-progress-bar">
                      <div
                        className="dashboard-crop-progress-fill"
                        style={{ width: cropProgWidth }}
                      />
                    </div>
                  </div>

                  <div className="dashboard-crop-stats-mini">
                    <div className="dashboard-csm">
                      <div className="dashboard-csm-val">
                        {daysToHarvest !== null ? daysToHarvest : "—"}
                      </div>
                      <div className="dashboard-csm-lbl">Days Left</div>
                    </div>
                    <div className="dashboard-csm">
                      {/* Expected yield — still static, needs crop-specific logic */}
                      <div className="dashboard-csm-val">4–6T</div>
                      <div className="dashboard-csm-lbl">Exp. Yield</div>
                    </div>
                    <div className="dashboard-csm">
                      <div className="dashboard-csm-val">
                        {currentCrop?.areaAcres
                          ? `${currentCrop.areaAcres}ac`
                          : "—"}
                      </div>
                      <div className="dashboard-csm-lbl">Area</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Planned next crop card ── */}
              <div className="dashboard-crop-planned">
                <div className="dashboard-planned-tag">
                  <i className="fa-regular fa-clock" /> Planned Next
                </div>

                {plannedCrop?.name ? (
                  <>
                    {/* User has set a planned crop — show it */}
                    <div className="dashboard-planned-name">
                      {plannedCrop.name}
                    </div>
                    <div className="dashboard-planned-sub">
                      {currentCrop?.fieldName || "Field A"} · After{" "}
                      {currentCrop?.name || "current"} harvest
                    </div>
                    <div className="dashboard-planned-reason">
                      You have selected <strong>{plannedCrop.name}</strong> as
                      your next crop. You can change this anytime from your
                      dashboard or Settings.
                    </div>
                    {plannedSowFormatted && (
                      <div className="dashboard-planned-timeline">
                        <i className="fa-regular fa-calendar" />
                        <span>
                          Planned sowing: <strong>{plannedSowFormatted}</strong>
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* User hasn't picked a planned crop yet */}
                    <div
                      className="dashboard-planned-name"
                      style={{ opacity: 0.4 }}
                    >
                      Not set
                    </div>
                    <div className="dashboard-planned-reason">
                      You haven't selected a next crop yet.
                    </div>
                    <div className="dashboard-planned-timeline">
                      <i className="fa-regular fa-calendar" />
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#2e7d32",
                          textDecoration: "underline",
                        }}
                        onClick={() => navigate("/settings")}
                      >
                        Set planned crop in Settings →
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* ── Field overview card ── */}
              <div className="dashboard-field-info">
                <div className="dashboard-field-label">
                  Field Overview · {currentCrop?.fieldName || "Field A"}
                </div>
                <div className="dashboard-field-grid">
                  <div className="dashboard-field-item">
                    <div className="dashboard-field-item-val">
                      {fieldInfo?.totalAcres
                        ? `${fieldInfo.totalAcres} ac`
                        : "—"}
                    </div>
                    <div className="dashboard-field-item-lbl">Total Area</div>
                  </div>
                  <div className="dashboard-field-item">
                    {/* Soil type — from onboarding or profile */}
                    <div className="dashboard-field-item-val">
                      {fieldInfo?.soilType || user?.profile?.soilType || "—"}
                    </div>
                    <div className="dashboard-field-item-lbl">Soil Type</div>
                  </div>
                  <div className="dashboard-field-item">
                    {/* pH — still static, would need soil test data */}
                    <div className="dashboard-field-item-val">—</div>
                    <div className="dashboard-field-item-lbl">Soil pH</div>
                  </div>
                  <div className="dashboard-field-item">
                    <div className="dashboard-field-item-val">
                      {fieldInfo?.irrigation || "—"}
                    </div>
                    <div className="dashboard-field-item-lbl">Irrigation</div>
                  </div>
                </div>
                <div className="dashboard-field-divider" />
                <div className="dashboard-field-label">Soil Health Score</div>
                <div className="dashboard-field-health">
                  <div className="dashboard-health-bar-wrap">
                    <div className="dashboard-health-bar" />
                  </div>
                  {/* Soil health needs sensor/test data — removed fake 78% */}
                  <div className="dashboard-health-val">—</div>
                  <div className="dashboard-health-lbl">
                    {fieldInfo?.soilType
                      ? "Fill soil test to score"
                      : "Not available"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CROP SUGGESTIONS ────────────────────────────────── */}
          {/* These are still static — a real match % needs backend logic */}
          <section
            className="dashboard-suggestion-section reveal"
            ref={addRevealRef}
          >
            <p className="dashboard-section-eyebrow">AI Recommendations</p>
            <h2 className="dashboard-section-title">
              Crops That Suit Your Field
            </h2>
            <div className="dashboard-suggestion-grid">
              {[
                {
                  name: "Red Lentil",
                  pct: "92%",
                  season: "Rabi · Nov–Feb",
                  desc: "Excellent nitrogen fixer for post-rice rotation. Low water demand.",
                  tags: ["Low Water", "High Profit", "N-Fixer"],
                  img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Potato",
                  pct: "85%",
                  season: "Rabi · Oct–Jan",
                  desc: "High-value cash crop. Strong year-round demand.",
                  tags: ["Cash Crop", "High Demand"],
                  img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80",
                },
                {
                  name: "Wheat",
                  pct: "79%",
                  season: "Rabi · Nov–Mar",
                  desc: "Reliable staple with stable government MSP pricing.",
                  tags: ["Stable Price", "Low Risk"],
                  img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80",
                },
              ].map((c) => (
                <div key={c.name} className="dashboard-sug-card">
                  <div className="dashboard-sug-img-wrap">
                    <img src={c.img} alt={c.name} />
                    <div className="dashboard-sug-img-overlay" />
                    <div className="dashboard-sug-compat">{c.pct} Match</div>
                  </div>
                  <div className="dashboard-sug-body">
                    <div className="dashboard-sug-season">{c.season}</div>
                    <div className="dashboard-sug-crop-name">{c.name}</div>
                    <div className="dashboard-sug-desc">{c.desc}</div>
                    <div className="dashboard-sug-tags">
                      {c.tags.map((t) => (
                        <span key={t} className="dashboard-sug-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── ADVISORY / ACTION PLAN ──────────────────────────── */}
          {/* Still static — needs a real advisory engine tied to crop + weather */}
          <section
            className="dashboard-advisory-section reveal"
            ref={addRevealRef}
          >
            <div className="dashboard-advisory-layout">
              <div className="dashboard-advisory-heading">
                <p className="dashboard-section-eyebrow">Today's Action Plan</p>
                <h2
                  className="dashboard-section-title"
                  style={{ marginBottom: "16px" }}
                >
                  What to Do
                  <br />
                  in Your Field
                </h2>
                <p>
                  {hasOnboarding
                    ? `Recommendations for your ${currentCrop?.name || "crop"} based on current weather.`
                    : "Complete your farm profile to get personalized daily advice."}
                </p>
                <div className="dashboard-advisory-cta">
                  <a href="#" className="dashboard-btn-primary">
                    <i className="fa-solid fa-phone" /> Call Expert
                  </a>
                  <a href="#" className="dashboard-btn-outline">
                    <i className="fa-solid fa-comment" /> Ask AI
                  </a>
                </div>
              </div>
              <div className="dashboard-advisory-list">
                {[
                  {
                    num: "01",
                    icon: "fa-seedling",
                    iconClass: "ok",
                    title: `Fertilize Your ${currentCrop?.name || "Crop"} This Week`,
                    priority: "Urgent",
                    desc: `Apply 20 kg urea per bigha for maximum yield. Best time: early morning.`,
                  },
                  {
                    num: "02",
                    icon: "fa-bug",
                    iconClass: "warn",
                    title: "Inspect Crop Edges for Pest Activity",
                    priority: "This Week",
                    desc: `Check ${currentCrop?.fieldName || "your field"} edges. Apply treatment if infestation exceeds 5%.`,
                  },
                  {
                    num: "03",
                    icon: "fa-droplet",
                    iconClass: "ok",
                    title: "Skip Irrigation Today",
                    priority: "Routine",
                    desc: `Rain forecasted near ${user?.profile?.district || "your area"} in 3 days. Saves ~800 L per bigha.`,
                  },
                  {
                    num: "04",
                    icon: "fa-clipboard-list",
                    iconClass: "info",
                    title: `Plan ${plannedCrop?.name || "Next Crop"} Seed Purchase`,
                    priority: "Plan Ahead",
                    desc: `Harvest is ${daysToHarvest ?? "—"} days away. Pre-order seeds early for best price.`,
                  },
                ].map((a) => (
                  <div key={a.num} className="dashboard-adv-item">
                    <div className="dashboard-adv-num">{a.num}</div>
                    <div className={`dashboard-adv-icon-wrap ${a.iconClass}`}>
                      <i className={`fa-solid ${a.icon}`} />
                    </div>
                    <div className="dashboard-adv-body">
                      <div className="dashboard-adv-title">{a.title}</div>
                      <div className="dashboard-adv-desc">{a.desc}</div>
                    </div>
                    <div
                      className={`dashboard-adv-priority ${a.priority === "Urgent" ? "high" : a.priority === "This Week" ? "medium" : "low"}`}
                    >
                      {a.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── MARKET PRICES ────────────────────────────────────── */}
          <section
            className="dashboard-market-section reveal"
            ref={addRevealRef}
          >
            <p className="dashboard-section-eyebrow">Market Intelligence</p>
            <h2 className="dashboard-section-title">Today's Market Prices</h2>

            {marketLoading && (
              <div className="dashboard-market-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="dashboard-market-row dashboard-market-skeleton"
                  >
                    <div className="dm-sk-line dm-sk-name" />
                    <div className="dm-sk-line dm-sk-price" />
                    <div className="dm-sk-line dm-sk-change" />
                  </div>
                ))}
              </div>
            )}

            {!marketLoading && marketPrices.length === 0 && (
              <div className="dashboard-market-empty">
                <i className="fa-solid fa-tag" />
                <p>No market prices have been added yet.</p>
              </div>
            )}

            {!marketLoading && marketPrices.length > 0 && (
              <div className="dashboard-market-grid">
                {marketPrices.map((m) => (
                  <div key={m._id} className="dashboard-market-row">
                    <div className="dashboard-market-crop-name">
                      {m.cropName}
                    </div>
                    <div className="dashboard-market-price">৳{m.price}</div>
                    <div className="dashboard-market-unit">per {m.unit}</div>
                    {m.change ? (
                      <div
                        className={`dashboard-market-change ${m.up ? "up" : "down"}`}
                      >
                        <i
                          className={`fa-solid fa-arrow-trend-${m.up ? "up" : "down"}`}
                        />{" "}
                        {m.change}
                      </div>
                    ) : (
                      <div className="dashboard-market-change neutral">—</div>
                    )}
                    <div className="dashboard-market-mkt">{m.market || ""}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
