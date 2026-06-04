import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/farmerDashboard_page/farmerDashboard.css";
import NotificationBell from "../../components/NotificationBell";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const firstName = user?.name ? user.name.split(" ")[0] : "Farmer";
  const location = user?.profile
    ? `${user.profile.district || ""}, ${user.profile.division || ""}`
    : "Bangladesh";
  const avatarLetter = firstName.charAt(0).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [todayDate, setTodayDate] = useState("");
  const [cropProgWidth, setCropProgWidth] = useState("0%");
  const revealRefs = useRef([]);

  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    const d = new Date();
    setTodayDate(
      d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCropProgWidth("58%");
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!user) return;
    const district = user.profile?.district || "Dhaka";
    console.log("District:", district);
    console.log("User:", user);
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

    // Current Weather
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${district},BD&appid=${API_KEY}&units=metric`,
    )
      .then((res) => res.json())
      .then((data) => setCurrentWeather(data));

    // 7-day Forecast
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${district},BD&appid=${API_KEY}&units=metric`,
    )
      .then((res) => res.json())
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

  const getWeatherIcon = (main) => {
    const icons = {
      Clear: "☀️",
      Clouds: "⛅",
      Rain: "🌧",
      Drizzle: "🌦",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
    };
    return icons[main] || "🌤️";
  };

  const addRevealRef = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <>
      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <div className="dashboard-root">
        {/* TOPBAR */}
        <nav className="dashboard-topbar">
          <a className="dashboard-brand" href="#">
            <i className="fa-solid fa-leaf"></i>
            <span className="k">Krishi</span>
            <span className="b">Bondhu</span>
          </a>
          <div className="dashboard-top-center">
            <i className="fa-regular fa-calendar"></i>
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
                <div className="dashboard-avatar-role">{location}</div>
              </div>
            </div>
            <button
              className="dashboard-menu-btn"
              id="menuBtn"
              onClick={toggleSidebar}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </nav>

        {/* SIDEBAR OVERLAY */}
        <div
          className={`dashboard-sidebar-overlay${sidebarOpen ? " open" : ""}`}
          id="overlay"
          onClick={toggleSidebar}
        ></div>

        {/* SIDEBAR */}
        <nav
          className={`dashboard-sidebar${sidebarOpen ? " open" : ""}`}
          id="sidebar"
        >
          <span className="dashboard-sidebar-section-label">Navigation</span>
          <a href="#" className="active">
            <i className="fa-solid fa-house"></i> Dashboard
          </a>
          <a
            onClick={() => navigate("/crop_library")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-seedling"></i> Crop Library
          </a>
          <a
            onClick={() => navigate("/crop_disease")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-bug"></i> Pest &amp; Disease
          </a>
          <span className="dashboard-sidebar-section-label">Tools</span>
          <a href="#">
            <i className="fa-solid fa-chart-line"></i> Market Prices
          </a>
          <a href="#">
            <i className="fa-solid fa-file-alt"></i> Crop History
          </a>
          <a href="#">
            <i className="fa-solid fa-user-pen"></i> Consult Expert
          </a>
          <a
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-gear"></i> Settings
          </a>
          <div className="dashboard-sidebar-section-label">Account</div>
          <a
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "#e53935" }}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ color: "#e53935" }}
            ></i>{" "}
            Logout
          </a>
        </nav>

        {/* MAIN */}
        <main className="dashboard-main">
          {/* HERO STRIP */}
          <section className="dashboard-hero-strip">
            <div className="dashboard-hero-left">
              <div className="dashboard-hero-eyebrow">
                <span className="dashboard-pulse-dot"></span>Live · Kharif
                Season 2025
              </div>
              <h1 className="dashboard-hero-greeting">
                Good
                <br />
                Morning,
                <br />
                <span>{firstName}.</span>
              </h1>
              <p className="dashboard-hero-subtext">
                Your fields are in great shape today. Weather is favorable for
                rice and no urgent action is needed right now.
              </p>
              <div className="dashboard-hero-stats-row">
                <div className="dashboard-hstat">
                  <div className="dashboard-hstat-val g">2.5</div>
                  <div className="dashboard-hstat-label">Acres Active</div>
                </div>
                <div className="dashboard-hstat">
                  <div className="dashboard-hstat-val">
                    72
                    <span
                      style={{
                        fontSize: "0.45em",
                        fontWeight: 400,
                        color: "var(--muted)",
                      }}
                    >
                      days
                    </span>
                  </div>
                  <div className="dashboard-hstat-label">To Harvest</div>
                </div>
                <div className="dashboard-hstat">
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
              <div className="dashboard-hero-img-overlay"></div>
              <div className="dashboard-hero-right-content">
                <div className="dashboard-status-pills">
                  <div className="dashboard-status-pill">
                    <div className="dashboard-pill-icon ok">
                      <i className="fa-solid fa-droplet"></i>
                    </div>
                    <div className="dashboard-pill-text">
                      <strong>No Irrigation Needed</strong>
                      <span>Soil moisture 78% · Next check tomorrow</span>
                    </div>
                  </div>
                  <div className="dashboard-status-pill">
                    <div className="dashboard-pill-icon warn">
                      <i className="fa-solid fa-bug"></i>
                    </div>
                    <div className="dashboard-pill-text">
                      <strong>Pest Alert: Stem Borer</strong>
                      <span>Low risk · Monitor weekly</span>
                    </div>
                  </div>
                  <div className="dashboard-status-pill">
                    <div className="dashboard-pill-icon info">
                      <i className="fa-solid fa-seedling"></i>
                    </div>
                    <div className="dashboard-pill-text">
                      <strong>Growth Stage: Tillering</strong>
                      <span>Apply urea this week for best yield</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ALERT BANNER */}
          {alertVisible && (
            <div className="dashboard-alert-banner">
              <i className="fa-solid fa-triangle-exclamation dashboard-alert-icon"></i>
              <div className="dashboard-alert-text">
                <strong>Warning:</strong> Stem borer activity reported in nearby
                Gazipur fields. Inspect crop edges and apply chlorpyrifos if
                infestation exceeds 5% of plants.
              </div>
              <button
                className="dashboard-alert-dismiss"
                onClick={() => setAlertVisible(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* WEATHER SECTION */}
          <section className="dashboard-weather-section">
            <div className="dashboard-weather-inner">
              <div className="dashboard-weather-today">
                <div>
                  <div className="dashboard-weather-location">
                    <i className="fa-solid fa-location-dot"></i>
                    {location}
                    Division
                  </div>
                  <div className="dashboard-weather-desc">
                    {currentWeather?.weather?.[0]?.description}
                  </div>
                  <div className="dashboard-weather-meta">
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-droplet"></i>Humidity{" "}
                      {currentWeather?.main?.humidity}%
                    </div>
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-wind"></i>Wind{" "}
                      {Math.round(currentWeather?.wind?.speed * 3.6)} km/h
                    </div>
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-eye"></i>Visibility 8 km
                    </div>
                    <div className="dashboard-weather-meta-item">
                      <i className="fa-solid fa-cloud-rain"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="dashboard-weather-temp-big">
                    {Math.round(currentWeather?.main?.temp)}
                    <sup>°C</sup>
                  </div>
                  <div className="dashboard-weather-feel">
                    Feels like {Math.round(currentWeather?.main?.feels_like)}°C
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

          {/* CROP & FIELD SECTION */}
          <section
            className="dashboard-crop-field-section reveal"
            ref={addRevealRef}
          >
            <p className="dashboard-section-eyebrow">Crop Intelligence</p>
            <h2 className="dashboard-section-title">Your Fields &amp; Crops</h2>
            <div className="dashboard-crop-bento">
              <div className="dashboard-crop-main">
                <img
                  className="dashboard-crop-main-img"
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=900&q=80"
                  alt="Rice"
                />
                <div className="dashboard-crop-main-grad"></div>
                <div className="dashboard-crop-main-content">
                  <div className="dashboard-crop-badge">
                    <i className="fa-solid fa-circle-check"></i> Currently
                    Growing
                  </div>
                  <div className="dashboard-crop-name">Rice</div>
                  <div className="dashboard-crop-sub">
                    Boro Season · Transplanted · Field A
                  </div>
                  <div className="dashboard-crop-progress-wrap">
                    <div className="dashboard-crop-progress-label">
                      <span>Tillering Stage</span>
                      <strong>58% complete</strong>
                    </div>
                    <div className="dashboard-crop-progress-bar">
                      <div
                        className="dashboard-crop-progress-fill"
                        id="cropProg"
                        style={{ width: cropProgWidth }}
                      ></div>
                    </div>
                  </div>
                  <div className="dashboard-crop-stats-mini">
                    <div className="dashboard-csm">
                      <div className="dashboard-csm-val">72</div>
                      <div className="dashboard-csm-lbl">Days Left</div>
                    </div>
                    <div className="dashboard-csm">
                      <div className="dashboard-csm-val">4–6T</div>
                      <div className="dashboard-csm-lbl">Exp. Yield</div>
                    </div>
                    <div className="dashboard-csm">
                      <div className="dashboard-csm-val">2.5ac</div>
                      <div className="dashboard-csm-lbl">Area</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-crop-planned">
                <div className="dashboard-planned-tag">
                  <i className="fa-regular fa-clock"></i> Planned Next
                </div>
                <div className="dashboard-planned-name">Mustard</div>
                <div className="dashboard-planned-sub">
                  Rabi Season · Field A · After Boro harvest
                </div>
                <div className="dashboard-planned-reason">
                  Mustard fits your clay-loam field perfectly after rice.
                  Nitrogen fixing residue from rice stubble reduces fertilizer
                  costs by ~30%. Market demand is strong November–January.
                </div>
                <div className="dashboard-planned-timeline">
                  <i className="fa-regular fa-calendar"></i>
                  <span>
                    Sowing window: <strong>Nov 15 – Dec 5</strong>
                  </span>
                </div>
              </div>
              <div className="dashboard-field-info">
                <div className="dashboard-field-label">
                  Field Overview · Field A
                </div>
                <div className="dashboard-field-grid">
                  <div className="dashboard-field-item">
                    <div className="dashboard-field-item-val">2.5 ac</div>
                    <div className="dashboard-field-item-lbl">Total Area</div>
                  </div>
                  <div className="dashboard-field-item">
                    <div className="dashboard-field-item-val">Clay-Loam</div>
                    <div className="dashboard-field-item-lbl">Soil Type</div>
                  </div>
                  <div className="dashboard-field-item">
                    <div className="dashboard-field-item-val">6.2 pH</div>
                    <div className="dashboard-field-item-lbl">Soil pH</div>
                  </div>
                  <div className="dashboard-field-item">
                    <div className="dashboard-field-item-val">Canal</div>
                    <div className="dashboard-field-item-lbl">Irrigation</div>
                  </div>
                </div>
                <div className="dashboard-field-divider"></div>
                <div className="dashboard-field-label">Soil Health Score</div>
                <div className="dashboard-field-health">
                  <div className="dashboard-health-bar-wrap">
                    <div className="dashboard-health-bar"></div>
                  </div>
                  <div className="dashboard-health-val">78%</div>
                  <div className="dashboard-health-lbl">Good</div>
                </div>
              </div>
            </div>
          </section>

          {/* SUGGESTION SECTION */}
          <section
            className="dashboard-suggestion-section reveal"
            ref={addRevealRef}
          >
            <p className="dashboard-section-eyebrow">AI Recommendations</p>
            <h2 className="dashboard-section-title">
              Crops That Suit Your Field
            </h2>
            <div className="dashboard-suggestion-grid">
              <div className="dashboard-sug-card">
                <div className="dashboard-sug-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80"
                    alt="Lentil"
                  />
                  <div className="dashboard-sug-img-overlay"></div>
                  <div className="dashboard-sug-compat">92% Match</div>
                </div>
                <div className="dashboard-sug-body">
                  <div className="dashboard-sug-season">Rabi · Nov–Feb</div>
                  <div className="dashboard-sug-crop-name">Red Lentil</div>
                  <div className="dashboard-sug-desc">
                    Excellent nitrogen fixer for post-rice rotation. Thrives in
                    clay-loam and tolerates mild drought. Low water demand saves
                    irrigation costs.
                  </div>
                  <div className="dashboard-sug-tags">
                    <span className="dashboard-sug-tag">Low Water</span>
                    <span className="dashboard-sug-tag">High Profit</span>
                    <span className="dashboard-sug-tag">N-Fixer</span>
                  </div>
                </div>
              </div>
              <div className="dashboard-sug-card">
                <div className="dashboard-sug-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80"
                    alt="Potato"
                  />
                  <div className="dashboard-sug-img-overlay"></div>
                  <div className="dashboard-sug-compat">85% Match</div>
                </div>
                <div className="dashboard-sug-body">
                  <div className="dashboard-sug-season">Rabi · Oct–Jan</div>
                  <div className="dashboard-sug-crop-name">Potato</div>
                  <div className="dashboard-sug-desc">
                    High-value cash crop with strong year-round demand. Your
                    field pH 6.2 is ideal. Great follow-up after rice puddling
                    breaks.
                  </div>
                  <div className="dashboard-sug-tags">
                    <span className="dashboard-sug-tag">Cash Crop</span>
                    <span className="dashboard-sug-tag">High Demand</span>
                    <span className="dashboard-sug-tag">pH Ideal</span>
                  </div>
                </div>
              </div>
              <div className="dashboard-sug-card">
                <div className="dashboard-sug-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80"
                    alt="Wheat"
                  />
                  <div className="dashboard-sug-img-overlay"></div>
                  <div className="dashboard-sug-compat">79% Match</div>
                </div>
                <div className="dashboard-sug-body">
                  <div className="dashboard-sug-season">Rabi · Nov–Mar</div>
                  <div className="dashboard-sug-crop-name">Wheat</div>
                  <div className="dashboard-sug-desc">
                    Reliable staple with stable government MSP pricing. Suits
                    clay-loam well. Moderate water needs and strong resistance
                    to common pests.
                  </div>
                  <div className="dashboard-sug-tags">
                    <span className="dashboard-sug-tag">Stable Price</span>
                    <span className="dashboard-sug-tag">Govt. Support</span>
                    <span className="dashboard-sug-tag">Low Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ADVISORY SECTION */}
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
                  Personalized recommendations based on your crop stage, local
                  weather, and soil conditions. Updated daily at 6:00 AM.
                </p>
                <div className="dashboard-advisory-cta">
                  <a href="#" className="dashboard-btn-primary">
                    <i className="fa-solid fa-phone"></i> Call Expert
                  </a>
                  <a href="#" className="dashboard-btn-outline">
                    <i className="fa-solid fa-comment"></i> Ask AI
                  </a>
                </div>
              </div>
              <div className="dashboard-advisory-list">
                <div className="dashboard-adv-item">
                  <div className="dashboard-adv-num">01</div>
                  <div className="dashboard-adv-icon-wrap ok">
                    <i className="fa-solid fa-seedling"></i>
                  </div>
                  <div className="dashboard-adv-body">
                    <div className="dashboard-adv-title">
                      Apply Urea Fertilizer (Top-dressing)
                    </div>
                    <div className="dashboard-adv-desc">
                      Rice is in tillering stage. Apply 20 kg urea per bigha
                      this week for maximum tiller production. Best done early
                      morning.
                    </div>
                  </div>
                  <div className="dashboard-adv-priority high">Urgent</div>
                </div>
                <div className="dashboard-adv-item">
                  <div className="dashboard-adv-num">02</div>
                  <div className="dashboard-adv-icon-wrap warn">
                    <i className="fa-solid fa-bug"></i>
                  </div>
                  <div className="dashboard-adv-body">
                    <div className="dashboard-adv-title">
                      Inspect Crop Edges for Stem Borer
                    </div>
                    <div className="dashboard-adv-desc">
                      Stem borer activity 3 km away. Look for "dead heart"
                      symptoms. Apply chlorpyrifos only if infestation exceeds
                      5%.
                    </div>
                  </div>
                  <div className="dashboard-adv-priority medium">This Week</div>
                </div>
                <div className="dashboard-adv-item">
                  <div className="dashboard-adv-num">03</div>
                  <div className="dashboard-adv-icon-wrap ok">
                    <i className="fa-solid fa-droplet"></i>
                  </div>
                  <div className="dashboard-adv-body">
                    <div className="dashboard-adv-title">
                      Skip Irrigation Today
                    </div>
                    <div className="dashboard-adv-desc">
                      Soil moisture at 78%. Rain forecasted in 3 days. Skipping
                      saves ~800 L water per bigha this week.
                    </div>
                  </div>
                  <div className="dashboard-adv-priority low">Routine</div>
                </div>
                <div className="dashboard-adv-item">
                  <div className="dashboard-adv-num">04</div>
                  <div className="dashboard-adv-icon-wrap info">
                    <i className="fa-solid fa-clipboard-list"></i>
                  </div>
                  <div className="dashboard-adv-body">
                    <div className="dashboard-adv-title">
                      Plan Mustard Seed Purchase
                    </div>
                    <div className="dashboard-adv-desc">
                      Harvest is 72 days away. Mustard seed peaks in September.
                      Pre-ordering from cooperative can save 12–15% on seed
                      cost.
                    </div>
                  </div>
                  <div className="dashboard-adv-priority low">Plan Ahead</div>
                </div>
              </div>
            </div>
          </section>

          {/* MARKET SECTION */}
          <section
            className="dashboard-market-section reveal"
            ref={addRevealRef}
          >
            <p className="dashboard-section-eyebrow">Market Intelligence</p>
            <h2 className="dashboard-section-title">Today's Market Prices</h2>
            <div className="dashboard-market-grid">
              <div className="dashboard-market-row">
                <div className="dashboard-market-crop-name">Rice (Boro)</div>
                <div className="dashboard-market-price">৳48</div>
                <div className="dashboard-market-unit">per kg</div>
                <div className="dashboard-market-change up">
                  <i className="fa-solid fa-arrow-trend-up"></i> +2.1%
                </div>
                <div className="dashboard-market-mkt">Tongi Market</div>
              </div>
              <div className="dashboard-market-row">
                <div className="dashboard-market-crop-name">Mustard</div>
                <div className="dashboard-market-price">৳92</div>
                <div className="dashboard-market-unit">per kg</div>
                <div className="dashboard-market-change up">
                  <i className="fa-solid fa-arrow-trend-up"></i> +0.8%
                </div>
                <div className="dashboard-market-mkt">Karwan Bazar</div>
              </div>
              <div className="dashboard-market-row">
                <div className="dashboard-market-crop-name">Potato</div>
                <div className="dashboard-market-price">৳32</div>
                <div className="dashboard-market-unit">per kg</div>
                <div className="dashboard-market-change down">
                  <i className="fa-solid fa-arrow-trend-down"></i> −1.4%
                </div>
                <div className="dashboard-market-mkt">Karwan Bazar</div>
              </div>
              <div className="dashboard-market-row">
                <div className="dashboard-market-crop-name">Red Lentil</div>
                <div className="dashboard-market-price">৳110</div>
                <div className="dashboard-market-unit">per kg</div>
                <div className="dashboard-market-change up">
                  <i className="fa-solid fa-arrow-trend-up"></i> +3.2%
                </div>
                <div className="dashboard-market-mkt">Shyambazar</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
