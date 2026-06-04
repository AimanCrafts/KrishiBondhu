import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithOtp } from "../../utils/authStorage";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/login_page/login.css";

function dashboardPath(role) {
  if (role === "farmer") return "/farmer_dashboard";
  if (role === "business") return "/buyer_dashboard";
  if (role === "admin") return "/admin_dashboard";
  return "/";
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
   FARMER LOGIN FORM
══════════════════════════════════ */
function FarmerLoginForm({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (phone.length < 9)
      return setError("Please enter a valid 10-digit mobile number.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    const result = await loginUser(phone, password);
    setLoading(false);

    if (!result.success) return setError(result.error);

    if (result.user.role !== "farmer") {
      return setError(
        "This phone number is registered as a Buyer account. Please use the Buyer Login tab.",
      );
    }
    onLogin(result.user);
  };

  return (
    <div className="login-form-body">
      {/* Farmer identity badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background:
            "linear-gradient(135deg,rgba(76,175,80,.12),rgba(46,125,50,.06))",
          border: "1px solid rgba(76,175,80,.3)",
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 20,
        }}
      >
        <i
          className="fa-solid fa-tractor"
          style={{ color: "#2e7d32", fontSize: 18 }}
        />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#1a2e1b",
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            Farmer Login
          </div>
          <div style={{ fontSize: 11, color: "#4d6e50" }}>
            Sign in with your registered mobile number
          </div>
        </div>
      </div>

      {error && (
        <div className="auth-error-banner">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </div>
      )}

      {/* Phone */}
      <div className="su-form-group" style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#2e4d30",
            marginBottom: 6,
            display: "block",
          }}
        >
          Mobile Number
        </label>
        <div className="phone-prefix-wrap">
          <div className="phone-prefix">+880</div>
          <div className="su-input-wrap" style={{ flex: 1 }}>
            <i className="fa-solid fa-phone" />
            <input
              type="tel"
              placeholder="1XXXXXXXXX"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="su-form-group" style={{ marginBottom: 20 }}>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#2e4d30",
            marginBottom: 6,
            display: "block",
          }}
        >
          Password
        </label>
        <div className="su-input-wrap" style={{ position: "relative" }}>
          <i className="fa-solid fa-lock" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{ paddingRight: 40 }}
          />
          <i
            className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPw((p) => !p)}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8aaa8c",
              cursor: "pointer",
              fontSize: 13,
              zIndex: 3,
            }}
          />
        </div>
      </div>

      <button className="login-btn" onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" /> Signing in…
          </>
        ) : (
          <>
            <i className="fa-solid fa-tractor" /> Sign In as Farmer
          </>
        )}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 14,
          fontSize: 12,
          color: "#8aaa8c",
        }}
      >
        <a href="#" style={{ color: "#4caf50", fontWeight: 600 }}>
          Forgot password?
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   BUYER LOGIN FORM
══════════════════════════════════ */
function BuyerLoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.includes("@"))
      return setError("Please enter a valid business email address.");
    if (!password) return setError("Please enter your password.");

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (!result.success) return setError(result.error);

    if (result.user.role !== "business") {
      return setError(
        "This email is not registered as a Buyer account. Are you a Farmer? Use the Farmer Login tab.",
      );
    }
    onLogin(result.user);
  };

  return (
    <div className="login-form-body">
      {/* Buyer identity badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background:
            "linear-gradient(135deg,rgba(106,27,154,.1),rgba(74,20,106,.05))",
          border: "1px solid rgba(106,27,154,.25)",
          borderRadius: 12,
          padding: "10px 14px",
          marginBottom: 20,
        }}
      >
        <i
          className="fa-solid fa-building"
          style={{ color: "#6a1b9a", fontSize: 18 }}
        />
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#1a2e1b",
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            Buyer / Business Login
          </div>
          <div style={{ fontSize: 11, color: "#4d4d6e" }}>
            Sign in with your registered business email
          </div>
        </div>
      </div>

      {error && (
        <div className="auth-error-banner">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </div>
      )}

      {/* Email */}
      <div className="su-form-group" style={{ marginBottom: 16 }}>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#2e4d30",
            marginBottom: 6,
            display: "block",
          }}
        >
          Business Email
        </label>
        <div className="su-input-wrap">
          <i className="fa-solid fa-envelope" />
          <input
            type="email"
            placeholder="company@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
      </div>

      {/* Password */}
      <div className="su-form-group" style={{ marginBottom: 20 }}>
        <label
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#2e4d30",
            marginBottom: 6,
            display: "block",
          }}
        >
          Password
        </label>
        <div className="su-input-wrap" style={{ position: "relative" }}>
          <i className="fa-solid fa-lock" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{ paddingRight: 40 }}
          />
          <i
            className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPw((p) => !p)}
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8aaa8c",
              cursor: "pointer",
              fontSize: 13,
              zIndex: 3,
            }}
          />
        </div>
      </div>

      <div
        style={{
          background: "rgba(106,27,154,.06)",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 16,
          fontSize: 12,
          color: "#6a1b9a",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <i className="fa-solid fa-circle-info" />
        <span>Use the email address you registered your company with.</span>
      </div>

      <button
        className="login-btn"
        onClick={handleSubmit}
        disabled={loading}
        style={{ background: "linear-gradient(135deg,#6a1b9a,#4a148c)" }}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" /> Signing in…
          </>
        ) : (
          <>
            <i className="fa-solid fa-building" /> Sign In as Buyer
          </>
        )}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 14,
          fontSize: 12,
          color: "#8aaa8c",
        }}
      >
        <a href="#" style={{ color: "#6a1b9a", fontWeight: 600 }}>
          Forgot password?
        </a>
      </div>
    </div>
  );
}

/* ═════════════════
   OTP LOGIN FORM
════════════════════*/
function OtpLoginForm({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleOtpKey = (i, e) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 4) refs[i + 1].current.focus();
  };

  const handleOtpBackspace = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs[i - 1].current.focus();
    }
  };

  const handleSend = () => {
    setError("");
    if (phone.length < 9)
      return setError("Please enter a valid 10-digit number.");
    setSent(true);
  };

  const handleVerify = () => {
    setError("");
    const code = otp.join("");
    if (code.length !== 5)
      return setError("Please enter the complete 5-digit OTP.");

    setLoading(true);
    setTimeout(() => {
      const result = loginWithOtp(phone, code);
      setLoading(false);
      if (!result.success) return setError(result.error);
      onLogin(result.user);
    }, 400);
  };

  return (
    <div className="login-form-body">
      {!sent ? (
        <>
          <div
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontSize: 13,
              color: "#4d6e50",
            }}
          >
            Enter your registered mobile number to receive a one-time code.
            <br />
            <span
              style={{
                fontSize: 11,
                color: "#999",
                marginTop: 4,
                display: "block",
              }}
            >
              (Demo: any 5-digit code will work)
            </span>
          </div>

          {error && (
            <div className="auth-error-banner">
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </div>
          )}

          <div className="su-form-group" style={{ marginBottom: 16 }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#2e4d30",
                marginBottom: 6,
                display: "block",
              }}
            >
              Mobile Number
            </label>
            <div className="phone-prefix-wrap">
              <div className="phone-prefix">+880</div>
              <div className="su-input-wrap" style={{ flex: 1 }}>
                <i className="fa-solid fa-phone" />
                <input
                  type="tel"
                  placeholder="1XXXXXXXXX"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
            </div>
          </div>

          <button className="otp-send-btn" onClick={handleSend}>
            <i className="fa-solid fa-paper-plane" /> Send OTP
          </button>
        </>
      ) : (
        <>
          <p
            style={{
              fontSize: 13,
              color: "#4d6e50",
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Enter the 5-digit code sent to{" "}
            <strong style={{ color: "#2e7d32" }}>+880 {phone}</strong>
          </p>

          {error && (
            <div className="auth-error-banner">
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </div>
          )}

          <div className="otp-boxes" style={{ margin: "16px 0" }}>
            {otp.map((v, i) => (
              <input
                key={i}
                ref={refs[i]}
                className="otp-box"
                maxLength={1}
                value={v}
                onChange={(e) => handleOtpKey(i, e)}
                onKeyDown={(e) => handleOtpBackspace(i, e)}
              />
            ))}
          </div>

          <button
            className="login-btn"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Verifying…
              </>
            ) : (
              <>
                <i className="fa-solid fa-check" /> Verify & Sign In
              </>
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 12,
              color: "#8aaa8c",
            }}
          >
            Didn't receive it?{" "}
            <a
              onClick={() => {
                setSent(false);
                setOtp(["", "", "", "", ""]);
              }}
              style={{ color: "#4caf50", fontWeight: 600, cursor: "pointer" }}
            >
              Resend
            </a>
          </p>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   MAIN LOGIN COMPONENT
══════════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState("farmer");

  const handleLogin = (userData) => {
    login(userData);
    navigate(dashboardPath(userData.role));
  };

  const TABS = [
    { id: "farmer", icon: "fa-tractor", label: "Farmer" },
    { id: "buyer", icon: "fa-building", label: "Buyer" },
    { id: "otp", icon: "fa-mobile-screen-button", label: "OTP" },
  ];

  return (
    <div className="login-bg">
      <div className="login-hero">
        {/* ── LEFT: Login Card ── */}
        <div className="login-left">
          <div className="login-card">
            <div className="login-avatar">
              <i className="fa-solid fa-leaf" />
            </div>

            <div className="login-card-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your KrishiBondhu account</p>
            </div>

            {/* Three-tab switcher */}
            <div
              className="login-tabs"
              style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`login-tab ${tab === t.id ? "active" : ""}`}
                  onClick={() => setTab(t.id)}
                >
                  <i
                    className={`fa-solid ${t.icon}`}
                    style={{ marginRight: 5 }}
                  />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Form content */}
            {tab === "farmer" && <FarmerLoginForm onLogin={handleLogin} />}
            {tab === "buyer" && <BuyerLoginForm onLogin={handleLogin} />}
            {tab === "otp" && <OtpLoginForm onLogin={handleLogin} />}

            <div className="login-divider">or</div>

            <div className="login-footer">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("/signup")}
                style={{ cursor: "pointer" }}
              >
                Create one →
              </a>
            </div>

            <div className="login-trust">
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
          </div>
        </div>

        {/* ── RIGHT: Info panel ── */}
        <div className="login-right">
          <div className="login-info">
            <h1 className="login-h1">
              Your Farm,
              <br />
              <em>Smarter</em> Every
              <br />
              Season
            </h1>
            <p className="login-p">
              Access real-time weather intelligence, crop advisory, disease
              detection, and direct buyer connections — all from one dashboard.
            </p>
            <div className="login-chips">
              <div className="login-chip">
                <div className="login-chip-icon green">
                  <i className="fa-solid fa-cloud-sun-rain" />
                </div>
                <div>
                  <h5>Live Weather Intelligence</h5>
                  <p>Rainfall alerts, storm warnings and seasonal forecasts</p>
                </div>
              </div>
              <div className="login-chip">
                <div className="login-chip-icon gold">
                  <i className="fa-solid fa-store" />
                </div>
                <div>
                  <h5>Direct Buyer Marketplace</h5>
                  <p>Sell crops at fair prices to verified bulk buyers</p>
                </div>
              </div>
              <div className="login-chip">
                <div className="login-chip-icon teal">
                  <i className="fa-solid fa-microscope" />
                </div>
                <div>
                  <h5>AI Disease Detection</h5>
                  <p>Upload crop photos for instant diagnosis and guidance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FarmLandscape />
    </div>
  );
}
