import { useEffect, useRef, useState } from "react";
import "../../css_files/home_page/Body.css";

/* ══════════════════════════════════
   DATA
══════════════════════════════════ */
const slides = [
  {
    bg: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&ixlib=rb-4.0.3",
    title: "Empowering Farmers",
    desc: "Smart decisions, modern technology, and real-time insights helping farmers achieve higher yield and better income.",
    btnText: "Explore Farming",
    btnHref: "#",
  },
  {
    bg: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1920&ixlib=rb-4.0.3",
    title: "From Field to Market",
    desc: "Connecting farmers directly with consumers, ensuring transparency, trust, and fair pricing.",
    btnText: "View Marketplace",
    btnHref: "#",
  },
  {
    bg: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1920&ixlib=rb-4.0.3",
    title: "AI-Powered Smart Agriculture",
    desc: "Real-time crop insights, satellite weather intelligence, and expert guidance — all in one digital platform.",
    btnText: "Explore Technology",
    btnHref: "#",
  },
];

const stats = [
  { icon: "fa-solid fa-building", target: 125, label: "Registered Companies" },
  { icon: "fa-solid fa-tractor", target: 70, label: "Farmers Enrolled" },
  { icon: "fa-solid fa-seedling", target: 200, label: "Crops Inserted" },
];

const weatherAnims = [
  "/lottie/Weather-sunny.json",
  "/lottie/Clouds.json",
  "/lottie/Weather-storm.json",
];

const workflowSteps = [
  {
    number: "01",
    title: "Register",
    desc: "Create your farmer or buyer account securely.",
  },
  {
    number: "02",
    title: "Monitor",
    desc: "Track real-time weather and crop insights.",
  },
  {
    number: "03",
    title: "Detect",
    desc: "Upload crop images for AI-powered disease detection.",
  },
  {
    number: "04",
    title: "Connect",
    desc: "Sell crops and connect directly with buyers.",
  },
];

const roles = [
  {
    icon: "fa-solid fa-tractor",
    title: "Farmers",
    desc: "Weather, advisory, disease detection, and marketplace tools.",
  },
  {
    icon: "fa-solid fa-store",
    title: "Buyers",
    desc: "Purchase crops directly from verified farmers.",
  },
  {
    icon: "fa-solid fa-user-doctor",
    title: "Experts",
    desc: "Provide consultation and agricultural guidance.",
  },
  {
    icon: "fa-solid fa-user-shield",
    title: "Admin",
    desc: "Manage platform security and operations.",
  },
];

/* ══════════════════════════════════
   DIVISION FARMER DATA
   (পরে real API দিয়ে replace করুন)
══════════════════════════════════ */
const divisionData = {
  Barishal: { bangla: "Barishal", farmers: 6 },
  Chittagong: { bangla: "Chittagong", farmers: 14 },
  Dhaka: { bangla: "Dhaka", farmers: 18 },
  Khulna: { bangla: "Khulna", farmers: 9 },
  Mymensingh: { bangla: "Mymensingh", farmers: 7 },
  Rajshahi: { bangla: "Rajshahi", farmers: 8 },
  Rangpur: { bangla: "Rangpur", farmers: 5 },
  Sylhet: { bangla: "Sylhet", farmers: 3 },
};

/* ══════════════════════════════════
   HERO SLIDER
══════════════════════════════════ */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (index) => setCurrent((index + slides.length) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      5000,
    );
    return () => clearInterval(timerRef.current);
  }, []);

  const handleDot = (i) => {
    clearInterval(timerRef.current);
    goTo(i);
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % slides.length),
      5000,
    );
  };

  return (
    <div className="hero-slider">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`hero-slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url("${slide.bg}")` }}
        >
          <div className="slide-overlay" />
          <div className="slide-content">
            <h1>{slide.title}</h1>
            <p>{slide.desc}</p>
            <a href={slide.btnHref} className="slide-btn">
              {slide.btnText}
            </a>
          </div>
        </div>
      ))}
      <div className="slider-pagination">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => handleDot(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   STAT BOX
══════════════════════════════════ */
function StatBox({ icon, target, label }) {
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let count = 0;
          const step = () => {
            if (count <= target) {
              countRef.current.innerText = count++;
              setTimeout(step, target > 5000 ? 3 : 25);
            }
          };
          step();
        }
      },
      { threshold: 0.4 },
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="stat-box">
      <i className={icon}></i>
      <h3 className="counter" ref={countRef}>
        0
      </h3>
      <p>{label}</p>
    </div>
  );
}

/* ══════════════════════════════════
   WEATHER SECTION
══════════════════════════════════ */
function WeatherSection() {
  const [currentAnim, setCurrentAnim] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentAnim((p) => (p + 1) % weatherAnims.length),
      5000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="feature-section reveal">
      <div className="feature-text">
        <h2>Smart Weather Awareness</h2>
        <p>
          Real-time weather insights and seasonal forecasts help farmers plan
          irrigation, harvesting, and crop protection with confidence. Get ahead
          of unpredictable weather before it impacts your crops.
        </p>
        <ul>
          <li>✔ Rainfall &amp; storm alerts</li>
          <li>✔ Seasonal crop planning guidance</li>
          <li>✔ Risk reduction through early awareness</li>
        </ul>
      </div>
      <div className="weather-visual-wrapper">
        {weatherAnims.map((src, i) => (
          <lottie-player
            key={src}
            src={src}
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{
              position: "absolute",
              width: "100%",
              maxWidth: "420px",
              height: "100%",
              opacity: i === currentAnim ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   BANGLADESH MAP SECTION
   SVG → public/bd_map.svg এ রাখুন
   fetch() দিয়ে load হয়, তাই
   querySelector দিয়ে event bind করা যায়
══════════════════════════════════ */
function BangladeshMap() {
  const wrapperRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [activeDiv, setActiveDiv] = useState(null);

  /* ── Step 1: public/bd_map.svg fetch করে innerHTML-এ বসাই ── */
  useEffect(() => {
    fetch("/bd_map.svg")
      .then((res) => res.text())
      .then((svgText) => {
        if (!wrapperRef.current) return;
        wrapperRef.current.innerHTML = svgText;

        // SVG-এর className সেট করি
        const svgEl = wrapperRef.current.querySelector("svg");
        if (svgEl) {
          svgEl.classList.add("bd-map-svg");
          svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }

        /* ── Step 2: প্রতিটি division <g id="Barishal"> ইত্যাদিতে event bind ── */
        Object.keys(divisionData).forEach((name) => {
          const group = wrapperRef.current.querySelector(`#${name}`);
          if (!group) return;

          group.style.cursor = "pointer";

          group.addEventListener("mouseenter", (e) => {
            setActiveDiv(name);
            const rect = wrapperRef.current.getBoundingClientRect();
            setTooltip({
              division: name,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          });

          group.addEventListener("mousemove", (e) => {
            const rect = wrapperRef.current.getBoundingClientRect();
            setTooltip((prev) =>
              prev
                ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top }
                : null,
            );
          });

          group.addEventListener("mouseleave", () => {
            setTooltip(null);
            setActiveDiv(null);
          });
        });
      });
  }, []);

  /* ── Step 3: activeDiv বদলালে highlight/dim করি ── */
  useEffect(() => {
    if (!wrapperRef.current) return;

    Object.keys(divisionData).forEach((name) => {
      const group = wrapperRef.current.querySelector(`#${name}`);
      if (!group) return;

      group.style.transition = "filter 0.25s ease, opacity 0.25s ease";

      if (activeDiv === name) {
        group.style.filter =
          "brightness(1.35) drop-shadow(0 0 12px rgba(46,125,50,0.65))";
        group.style.opacity = "1";
      } else if (activeDiv) {
        group.style.filter = "brightness(0.72)";
        group.style.opacity = "0.65";
      } else {
        group.style.filter = "none";
        group.style.opacity = "1";
      }
    });
  }, [activeDiv]);

  /* ── Tooltip map-এর বাইরে না যায় ── */
  const tooltipStyle = () => {
    if (!tooltip || !wrapperRef.current) return {};
    const { offsetWidth: W, offsetHeight: H } = wrapperRef.current;
    const cW = 200,
      cH = 115,
      gap = 18;
    let left = tooltip.x + gap;
    let top = tooltip.y - cH / 2;
    if (left + cW > W - 8) left = tooltip.x - cW - gap;
    if (left < 8) left = 8;
    if (top < 8) top = 8;
    if (top + cH > H - 8) top = H - cH - 8;
    return { left, top };
  };

  const data = tooltip ? divisionData[tooltip.division] : null;

  return (
    <section className="map-section reveal">
      {/* ── Intro Text ── */}
      <div className="map-intro">
        <span className="map-badge">🗺️ KrishiBondhu Coverage</span>
        <h2 className="section-title map-title">
          Our Farmers Are Spread Across Bangladesh
        </h2>
        <p className="map-subtitle">
          Farmers registered on KrishiBondhu are present in every division of
          Bangladesh. Hover over any division on the map to see the number of
          registered farmers in that area.
        </p>
        <div className="map-stats-row">
          <div className="map-stat-pill">
            <i className="fa-solid fa-map-location-dot"></i>
            <span>8 Divisions</span>
          </div>
          <div className="map-stat-pill">
            <i className="fa-solid fa-tractor"></i>
            <span>70+ Registered Farmers</span>
          </div>
          <div className="map-stat-pill">
            <i className="fa-solid fa-seedling"></i>
            <span>Growing Every Day</span>
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <div className="map-wrapper">
        {/* SVG এখানে fetch করে inject হবে */}
        <div className="bd-map-container" ref={wrapperRef} />

        {/* ── Tooltip Card ── */}
        {tooltip && data && (
          <div className="division-tooltip" style={tooltipStyle()}>
            <div className="tooltip-header">
              <span className="tooltip-emoji">🌾</span>
              <div>
                <p className="tooltip-bangla">{data.bangla}</p>
                <p className="tooltip-english">{tooltip.division} Division</p>
              </div>
            </div>
            <div className="tooltip-divider" />
            <div className="tooltip-body">
              <i className="fa-solid fa-tractor tooltip-tractor"></i>
              <span className="tooltip-count">{data.farmers}</span>
              <span className="tooltip-label">Farmers Registered</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════
   MAIN BODY
══════════════════════════════════ */
export default function Body() {
  return (
    <>
      <HeroSlider />

      {/* Stats */}
      <section className="stats-section reveal">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <StatBox key={i} icon={s.icon} target={s.target} label={s.label} />
          ))}
        </div>
      </section>

      {/* Map — stats-এর ঠিক নিচে */}
      <BangladeshMap />

      {/* Feature 1: Weather */}
      <WeatherSection />

      {/* Feature 2: Crop Intelligence */}
      <section className="feature-section reverse reveal">
        <div className="feature-text">
          <h2>Seasonal Crop Intelligence</h2>
          <p>
            Make data-driven decisions on which crops to plant based on season,
            soil type, and regional suitability. Maximize your harvest by
            choosing the right crop at the right time.
          </p>
          <ul>
            <li>✔ Smart crop suggestions</li>
            <li>✔ Soil compatibility guidance</li>
            <li>✔ Higher yield recommendations</li>
          </ul>
        </div>
        <div className="feature-visual">
          <lottie-player
            src="/lottie/Agriculture based on data.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: "100%", maxWidth: "480px", height: "400px" }}
          />
        </div>
      </section>

      {/* Feature 3: Disease Detection */}
      <section className="feature-section reveal">
        <div className="feature-text">
          <h2>Early Disease Detection</h2>
          <p>
            Identify crop diseases early and receive preventive guidance to
            minimize loss and protect yield. Act fast with AI-backed insights
            before damage spreads further.
          </p>
          <ul>
            <li>✔ Symptom-based guidance</li>
            <li>✔ Preventive action steps</li>
            <li>✔ Expert consultation access</li>
          </ul>
        </div>
        <div className="feature-visual">
          <lottie-player
            src="/lottie/plantscan.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: "100%", maxWidth: "480px", height: "400px" }}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="generic-section reveal">
        <h2 className="section-title">How KrishiBondhu Works</h2>
        <div className="workflow-grid">
          {workflowSteps.map((step) => (
            <div className="workflow-card" key={step.number}>
              <span>{step.number}</span>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Built For Everyone */}
      <section className="generic-section reveal">
        <h2 className="section-title">Built For Everyone In Agriculture</h2>
        <div className="roles-grid">
          {roles.map((role) => (
            <div className="role-card" key={role.title}>
              <i className={role.icon}></i>
              <h4>{role.title}</h4>
              <p>{role.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
