import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../utils/authStorage";

import FarmerForm from "./farmer_signup";
import BusinessForm from "./buyer_signup";
import "../../css_files/signup_page/signup.css";

/* ══════════════════════════════════
   SUCCESS SCREEN
══════════════════════════════════ */
function SuccessScreen({ type, navigate }) {
  const isFarmer = type === "farmer";
  return (
    <div
      className="signup-form-section"
      style={{ textAlign: "center", padding: "8px 0 4px" }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(46,125,50,0.08))",
          border: "2px solid rgba(76,175,80,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow:
            "0 0 0 6px rgba(76,175,80,0.1), 0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <i
          className="fa-solid fa-check"
          style={{
            fontSize: 28,
            color: "#2e7d32",
            filter: "drop-shadow(0 0 6px rgba(46,125,50,0.3))",
          }}
        />
      </div>
      <h3
        style={{
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 10,
          color: "#192e1a",
          lineHeight: 1.2,
        }}
      >
        {isFarmer ? "Welcome aboard!" : "Application submitted!"}
      </h3>
      <p
        style={{
          fontSize: 13,
          fontFamily: "'Inter', system-ui, sans-serif",
          color: "rgba(42,80,44,0.78)",
          lineHeight: 1.7,
          marginBottom: 28,
          maxWidth: 340,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {isFarmer ? (
          "Your farmer account is ready. Log in with your mobile number and start using KrishiBondhu."
        ) : (
          <>
            Your documents are under review. Expect confirmation within{" "}
            <strong style={{ color: "#8a5c00" }}>1–3 business days</strong> on
            your registered phone and email.
          </>
        )}
      </p>
      <button className="signup-submit-btn" onClick={() => navigate("/login")}>
        <i className="fa-solid fa-arrow-right-to-bracket" />
        Go to Login
      </button>
    </div>
  );
}

/* ══════════════════════════════════
   SHARED FARM LANDSCAPE
══════════════════════════════════ */
function FarmLandscape() {
  return (
    <div className="signup-landscape">
      <svg
        viewBox="0 0 1440 340"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="ll-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a9e94" stopOpacity="0" />
            <stop offset="100%" stopColor="#065a52" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="ll-g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#72c864" />
            <stop offset="100%" stopColor="#4fa040" />
          </linearGradient>
          <linearGradient id="ll-g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8a848" />
            <stop offset="100%" stopColor="#bc882e" />
          </linearGradient>
          <linearGradient id="ll-g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c47c34" />
            <stop offset="100%" stopColor="#8c5220" />
          </linearGradient>
          <radialGradient id="ll-win">
            <stop offset="0%" stopColor="#ffe9a0" stopOpacity="1" />
            <stop offset="100%" stopColor="#f5c840" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="340" fill="url(#ll-haze)" />
        <rect x="0" y="210" width="1440" height="130" fill="url(#ll-g1)" />
        <rect x="0" y="268" width="1440" height="72" fill="url(#ll-g2)" />
        <rect x="0" y="308" width="1440" height="32" fill="url(#ll-g3)" />
        {[224, 234, 244].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="1440"
            y2={y}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1.5"
          />
        ))}
        <rect
          x="0"
          y="248"
          width="1440"
          height="5"
          rx="2.5"
          fill="rgba(255,255,255,0.72)"
        />
        <rect
          x="0"
          y="258"
          width="1440"
          height="3"
          rx="1.5"
          fill="rgba(255,255,255,0.48)"
        />
        {Array.from({ length: 21 }, (_, i) => 60 + i * 68).map((x) => (
          <rect
            key={x}
            x={x}
            y="240"
            width="5"
            height="26"
            rx="2"
            fill="rgba(255,255,255,0.62)"
          />
        ))}
        <rect x="10" y="214" width="8" height="26" rx="3" fill="#6b4226" />
        <circle cx="14" cy="196" r="32" fill="#3d7a35" />
        <circle cx="14" cy="185" r="25" fill="#52a044" />
        <circle cx="26" cy="200" r="18" fill="#4a9040" />
        <rect x="68" y="112" width="132" height="118" fill="#c43428" />
        <rect x="68" y="112" width="12" height="118" fill="rgba(0,0,0,0.08)" />
        <rect x="188" y="112" width="12" height="118" fill="rgba(0,0,0,0.12)" />
        <polygon points="54,112 134,54 214,112" fill="#9a2418" />
        <rect x="110" y="164" width="44" height="66" rx="3" fill="#7a1e18" />
        <line
          x1="132"
          y1="164"
          x2="132"
          y2="230"
          stroke="#5a100e"
          strokeWidth="2.5"
        />
        <line
          x1="110"
          y1="164"
          x2="154"
          y2="230"
          stroke="#5a100e"
          strokeWidth="1.5"
        />
        <line
          x1="154"
          y1="164"
          x2="110"
          y2="230"
          stroke="#5a100e"
          strokeWidth="1.5"
        />
        <rect
          x="76"
          y="126"
          width="28"
          height="22"
          rx="4"
          fill="url(#ll-win)"
        />
        <rect
          x="176"
          y="126"
          width="28"
          height="22"
          rx="4"
          fill="url(#ll-win)"
        />
        <line
          x1="90"
          y1="126"
          x2="90"
          y2="148"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="76"
          y1="137"
          x2="104"
          y2="137"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="190"
          y1="126"
          x2="190"
          y2="148"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="176"
          y1="137"
          x2="204"
          y2="137"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <rect x="218" y="86" width="44" height="144" rx="6" fill="#d8d4c8" />
        <ellipse cx="240" cy="86" rx="22" ry="10" fill="#c4c0b4" />
        {[112, 138, 164, 190].map((y) => (
          <line
            key={y}
            x1="218"
            y1={y}
            x2="262"
            y2={y}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="1.5"
          />
        ))}
        <rect x="228" y="202" width="24" height="28" rx="3" fill="#aaa89e" />
        <rect x="272" y="108" width="36" height="122" rx="5" fill="#ccc8bc" />
        <ellipse cx="290" cy="108" rx="18" ry="8" fill="#b8b4a8" />
        <rect x="324" y="214" width="7" height="22" rx="2" fill="#6b4226" />
        <circle cx="328" cy="196" r="28" fill="#3d7a35" />
        <circle cx="328" cy="188" r="22" fill="#52a044" />
        <rect x="402" y="162" width="82" height="68" rx="3" fill="#ece4d2" />
        <rect x="480" y="162" width="10" height="68" fill="rgba(0,0,0,0.09)" />
        <polygon points="390,162 443,120 496,162" fill="#a85630" />
        <rect x="430" y="192" width="24" height="38" rx="3" fill="#7c4c28" />
        <rect
          x="406"
          y="172"
          width="22"
          height="18"
          rx="3"
          fill="url(#ll-win)"
        />
        <rect
          x="452"
          y="172"
          width="22"
          height="18"
          rx="3"
          fill="url(#ll-win)"
        />
        <rect x="462" y="118" width="12" height="24" rx="2" fill="#b06040" />
        <rect x="460" y="115" width="16" height="5" rx="2" fill="#8a4828" />
        {[526, 556, 582, 606].map((cx, i) => (
          <g key={cx}>
            <ellipse
              cx={cx}
              cy={158 + i * 4}
              rx={11 + (i % 2) * 2}
              ry={56 - i * 3}
              fill="#2c6c26"
            />
            <ellipse
              cx={cx}
              cy={148 + i * 4}
              rx={7 + (i % 2)}
              ry={46 - i * 3}
              fill="#389030"
            />
          </g>
        ))}
        <ellipse cx="642" cy="224" rx="26" ry="18" fill="#d4a840" />
        <ellipse cx="642" cy="218" rx="22" ry="13" fill="#e4b84a" />
        {[-10, 0, 10].map((dx) => (
          <line
            key={dx}
            x1={642 + dx}
            y1="206"
            x2={642 + dx}
            y2="242"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1.5"
          />
        ))}
        <ellipse cx="686" cy="228" rx="20" ry="15" fill="#c89830" />
        <ellipse cx="686" cy="223" rx="17" ry="11" fill="#d8a838" />
        <rect x="730" y="72" width="54" height="158" rx="6" fill="#c8c4b4" />
        <ellipse cx="757" cy="72" rx="27" ry="12" fill="#b4b0a4" />
        {[100, 128, 156, 184, 212].map((y) => (
          <line
            key={y}
            x1="730"
            y1={y}
            x2="784"
            y2={y}
            stroke="rgba(0,0,0,0.09)"
            strokeWidth="2"
          />
        ))}
        <rect x="743" y="198" width="26" height="32" rx="3" fill="#9c9888" />
        <rect x="818" y="124" width="114" height="106" fill="#b43020" />
        <rect x="818" y="124" width="12" height="106" fill="rgba(0,0,0,0.08)" />
        <rect x="920" y="124" width="12" height="106" fill="rgba(0,0,0,0.12)" />
        <polygon points="806,124 875,70 944,124" fill="#8c2218" />
        <rect x="854" y="170" width="34" height="60" rx="3" fill="#6c1a12" />
        <line
          x1="871"
          y1="170"
          x2="871"
          y2="230"
          stroke="#4a100e"
          strokeWidth="2.5"
        />
        <line
          x1="854"
          y1="170"
          x2="888"
          y2="230"
          stroke="#4a100e"
          strokeWidth="1.5"
        />
        <line
          x1="888"
          y1="170"
          x2="854"
          y2="230"
          stroke="#4a100e"
          strokeWidth="1.5"
        />
        <rect
          x="826"
          y="138"
          width="26"
          height="20"
          rx="4"
          fill="url(#ll-win)"
        />
        <rect
          x="904"
          y="138"
          width="26"
          height="20"
          rx="4"
          fill="url(#ll-win)"
        />
        <line
          x1="839"
          y1="138"
          x2="839"
          y2="158"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="826"
          y1="148"
          x2="852"
          y2="148"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="917"
          y1="138"
          x2="917"
          y2="158"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <line
          x1="904"
          y1="148"
          x2="930"
          y2="148"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="1.5"
        />
        <rect x="966" y="210" width="8" height="20" rx="2" fill="#6b4226" />
        <circle cx="970" cy="191" r="30" fill="#3d7a35" />
        <circle cx="970" cy="182" r="24" fill="#52a044" />
        <circle cx="985" cy="198" r="16" fill="#488c3c" />
        <rect x="1018" y="214" width="7" height="18" rx="2" fill="#6b4226" />
        <circle cx="1022" cy="197" r="24" fill="#3a7430" />
        <circle cx="1022" cy="189" r="18" fill="#4e9040" />
        <rect x="1106" y="164" width="78" height="66" rx="3" fill="#e8e0ce" />
        <rect x="1180" y="164" width="10" height="66" fill="rgba(0,0,0,0.09)" />
        <polygon points="1094,164 1145,124 1196,164" fill="#9c5228" />
        <rect x="1133" y="192" width="22" height="38" rx="3" fill="#7a3e1e" />
        <rect
          x="1110"
          y="174"
          width="20"
          height="16"
          rx="3"
          fill="url(#ll-win)"
        />
        <rect
          x="1154"
          y="174"
          width="20"
          height="16"
          rx="3"
          fill="url(#ll-win)"
        />
        <rect x="1162" y="122" width="11" height="20" rx="2" fill="#b06040" />
        <polygon points="1262,240 1274,240 1269,88 1267,88" fill="#8a8a7a" />
        <line
          x1="1262"
          y1="200"
          x2="1250"
          y2="240"
          stroke="#7a7a6a"
          strokeWidth="2"
        />
        <line
          x1="1274"
          y1="200"
          x2="1286"
          y2="240"
          stroke="#7a7a6a"
          strokeWidth="2"
        />
        <line
          x1="1262"
          y1="240"
          x2="1250"
          y2="240"
          stroke="#7a7a6a"
          strokeWidth="2.5"
        />
        <line
          x1="1274"
          y1="240"
          x2="1286"
          y2="240"
          stroke="#7a7a6a"
          strokeWidth="2.5"
        />
        <rect x="1257" y="85" width="22" height="6" rx="2" fill="#6e6e60" />
        <circle cx="1268" cy="88" r="6" fill="#555" />
        <circle cx="1268" cy="88" r="3" fill="#333" />
        {[0, 90, 180, 270].map((angle) => (
          <rect
            key={angle}
            x="-3"
            y="-50"
            width="6"
            height="48"
            rx="3"
            fill={angle % 180 === 0 ? "#9ab0c4" : "#8aa0b4"}
            transform={`translate(1268,88) rotate(${angle})`}
          />
        ))}
        <rect x="1338" y="212" width="8" height="24" rx="2" fill="#6b4226" />
        <circle cx="1342" cy="193" r="30" fill="#3d7a35" />
        <circle cx="1342" cy="184" r="22" fill="#52a044" />
        <circle cx="1432" cy="200" r="28" fill="#3d7a35" />
        <circle cx="1432" cy="192" r="22" fill="#52a044" />
        <rect x="1428" y="218" width="8" height="22" rx="2" fill="#6b4226" />
        <line
          x1="0"
          y1="316"
          x2="1440"
          y2="316"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2.5"
          strokeDasharray="42,24"
        />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════
   HERO TEXT — always right, never moves
══════════════════════════════════ */
function HeroText({ setAccountType }) {
  return (
    <div className="signup-hero-text">
      <div className="signup-eyebrow">
        <i className="fa-solid fa-seedling" />
        Smart Agriculture Platform
      </div>
      <h1 className="signup-hero-h1">
        Online Farm
        <br />
        <em>Portal</em> for
        <br />
        Bangladesh
      </h1>
      <p className="signup-hero-p">
        Connecting farmers directly with buyers, powered by real-time weather
        intelligence, AI crop advisory, and a verified marketplace.
      </p>
      <div className="signup-hero-cta">
        <button
          className="signup-cta-btn primary"
          onClick={() => setAccountType("farmer")}
        >
          <i className="fa-solid fa-tractor" style={{ marginRight: 7 }} />
          Join as Farmer
        </button>
        <button
          className="signup-cta-btn outline"
          onClick={() => setAccountType("business")}
        >
          <i className="fa-solid fa-building" style={{ marginRight: 7 }} />
          Join as Buyer
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN SIGNUP COMPONENT
══════════════════════════════════ */
export default function Signup() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (type, data) => {
    const result = await registerUser(type, data);
    if (!result.success) {
      alert(result.error);
      return;
    }
    setSubmitted(true);
  };

  const step1Done = accountType !== null;
  const step2Done = submitted;

  return (
    <div className="signup-bg">
      {/* ── Top Nav ── */}

      {/*
        ══════════════════════════════════════════════════════
        TWO-COLUMN LAYOUT
        ══════════════════════════════════════════════════════
      */}
      <div className="signup-layout">
        {/* LEFT ─ card only */}
        <div className="signup-card-col">
          <div className="signup-card">
            {/* Step indicator */}
            <div className="step-indicator">
              <div className={`step-dot ${step1Done ? "done" : "active"}`}>
                {step1Done ? (
                  <i className="fa-solid fa-check" style={{ fontSize: 10 }} />
                ) : (
                  "1"
                )}
              </div>
              <div className={`step-line ${step1Done ? "done" : ""}`} />
              <div
                className={`step-dot ${step2Done ? "done" : step1Done ? "active" : ""}`}
              >
                {step2Done ? (
                  <i className="fa-solid fa-check" style={{ fontSize: 10 }} />
                ) : (
                  "2"
                )}
              </div>
              <div className={`step-line ${step2Done ? "done" : ""}`} />
              <div className={`step-dot ${step2Done ? "active" : ""}`}>
                {step2Done ? (
                  <i className="fa-solid fa-flag" style={{ fontSize: 10 }} />
                ) : (
                  "3"
                )}
              </div>
            </div>

            {/* Card header */}
            <div className="signup-card-header">
              <h2>
                {submitted
                  ? "You're all set"
                  : accountType
                    ? accountType === "farmer"
                      ? "Farmer Registration"
                      : "Business Registration"
                    : "Create an Account"}
              </h2>
              <p>
                {submitted
                  ? ""
                  : accountType
                    ? accountType === "farmer"
                      ? "Fill in your details to join KrishiBondhu"
                      : "Complete your company profile for verification"
                    : "Choose the account type that fits you"}
              </p>
            </div>

            {/* Step 1 — account type */}
            {!accountType && !submitted && (
              <div className="account-type-section">
                <h3>I am a…</h3>
                <div className="type-grid">
                  <div
                    className={`type-card farmer ${accountType === "farmer" ? "selected" : ""}`}
                    onClick={() => setAccountType("farmer")}
                  >
                    <div className="type-card-icon">
                      <i className="fa-solid fa-tractor" />
                    </div>
                    <h4>Farmer</h4>
                    <p>I grow crops and want to sell my produce</p>
                  </div>
                  <div
                    className={`type-card business ${accountType === "business" ? "selected" : ""}`}
                    onClick={() => setAccountType("business")}
                  >
                    <div className="type-card-icon">
                      <i className="fa-solid fa-building" />
                    </div>
                    <h4>Business</h4>
                    <p>I buy fresh produce in bulk for my company</p>
                    <span className="type-badge">
                      <i
                        className="fa-solid fa-shield-halved"
                        style={{ fontSize: 8 }}
                      />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — form */}
            {accountType && !submitted && (
              <>
                <button
                  onClick={() => setAccountType(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(74,110,76,0.65)",
                    fontSize: 13,
                    cursor: "pointer",
                    padding: "0 0 16px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#2e7d32")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(74,110,76,0.65)")
                  }
                >
                  <i
                    className="fa-solid fa-arrow-left"
                    style={{ fontSize: 10 }}
                  />
                  Change account type
                </button>
                {accountType === "farmer" ? (
                  <FarmerForm onSubmit={handleSubmit} />
                ) : (
                  <BusinessForm onSubmit={handleSubmit} />
                )}
              </>
            )}

            {/* Step 3 — success */}
            {submitted && (
              <SuccessScreen type={accountType} navigate={navigate} />
            )}

            {/* Footer */}
            {!submitted && (
              <>
                <div className="signup-footer-links">
                  Already have an account?{" "}
                  <a onClick={() => navigate("/login")}>Log in</a>
                </div>
                <div className="signup-trust">
                  <span>
                    <i className="fa-solid fa-lock" /> Secure
                  </span>
                  <span>
                    <i className="fa-solid fa-flag" /> Bangladesh
                  </span>
                  <span>
                    <i className="fa-solid fa-shield-halved" /> Verified
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT ─ hero text, sticky so it never shifts */}
        <div className="signup-hero-col">
          <HeroText setAccountType={setAccountType} />
        </div>
      </div>

      {/* Farm landscape — full width below both columns */}
      <FarmLandscape />
    </div>
  );
}
