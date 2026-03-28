import { useState } from "react";
import "../../css_files/signup_page/signup.css";

const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];
const LAND_UNITS = ["Bigha", "Acre", "Decimal", "Katha"];

function FarmerForm({ onSubmit }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    nid: "",
    division: "",
    district: "",
    landSize: "",
    landUnit: "Bigha",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!form.fullName.trim()) return setError("Please enter your full name.");
    if (form.phone.length < 9)
      return setError("Please enter a valid 10-digit mobile number.");
    if (form.nid.length < 10) return setError("NID must be 10 or 17 digits.");
    if (!form.division) return setError("Please select your division.");
    if (!form.district.trim()) return setError("Please enter your district.");
    if (!form.password || form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    await onSubmit("farmer", form);
    setLoading(false);
  };

  return (
    <div className="signup-form-section">
      <div className="farmer-notice">
        <i className="fa-solid fa-circle-check"></i>
        <p>
          Simple &amp; quick registration — we only ask for what's needed to
          verify your identity and confirm your land.
        </p>
      </div>

      {error && (
        <div className="auth-error-banner">
          <i className="fa-solid fa-circle-exclamation" />
          {error}
        </div>
      )}

      <p className="form-section-title">Personal Information</p>

      <div className="su-form-group">
        <label>Full Name</label>
        <div className="su-input-wrap">
          <i className="fa-solid fa-user"></i>
          <input
            type="text"
            placeholder="Your full name"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </div>
      </div>

      <div className="su-form-group">
        <label>
          Mobile Number <span className="label-hint">(used for login)</span>
        </label>
        <div className="phone-prefix-wrap">
          <div className="phone-prefix">+880</div>
          <div className="su-input-wrap">
            <i className="fa-solid fa-phone"></i>
            <input
              type="tel"
              placeholder="1XXXXXXXXX"
              maxLength={10}
              value={form.phone}
              onChange={(e) =>
                update("phone", e.target.value.replace(/\D/g, ""))
              }
            />
          </div>
        </div>
      </div>

      <div className="su-form-group">
        <label>
          National ID (NID){" "}
          <span className="label-hint">(10 or 17 digits)</span>
        </label>
        <div className="su-input-wrap">
          <i className="fa-solid fa-id-card"></i>
          <input
            type="text"
            placeholder="Your NID number"
            maxLength={17}
            value={form.nid}
            onChange={(e) => update("nid", e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </div>

      <hr className="form-divider" />
      <p className="form-section-title">Farm Location</p>

      <div className="form-row">
        <div className="su-form-group">
          <label>Division</label>
          <div className="su-input-wrap">
            <i className="fa-solid fa-map"></i>
            <select
              value={form.division}
              onChange={(e) => update("division", e.target.value)}
            >
              <option value="">Select Division</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down select-arrow"></i>
          </div>
        </div>
        <div className="su-form-group">
          <label>District</label>
          <div className="su-input-wrap">
            <i className="fa-solid fa-location-dot"></i>
            <input
              type="text"
              placeholder="Your district"
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="su-form-group">
        <label>Approximate Land Size</label>
        <div className="form-row">
          <div className="su-input-wrap">
            <i className="fa-solid fa-ruler-combined"></i>
            <input
              type="number"
              placeholder="e.g. 3.5"
              min="0"
              step="0.1"
              value={form.landSize}
              onChange={(e) => update("landSize", e.target.value)}
            />
          </div>
          <div className="su-input-wrap">
            <i className="fa-solid fa-layer-group"></i>
            <select
              value={form.landUnit}
              onChange={(e) => update("landUnit", e.target.value)}
            >
              {LAND_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down select-arrow"></i>
          </div>
        </div>
      </div>

      <hr className="form-divider" />
      <p className="form-section-title">Set Password</p>

      <div className="su-form-group">
        <label>
          Password <span className="label-hint">(min. 6 characters)</span>
        </label>
        <div className="su-input-wrap">
          <i className="fa-solid fa-lock"></i>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            style={{ paddingRight: 40 }}
          />
          <i
            className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPw((p) => !p)}
            style={{
              position: "absolute",
              top: "50%",
              right: 13,
              transform: "translateY(-50%)",
              color: "#8aaa8c",
              cursor: "pointer",
              fontSize: 13,
              zIndex: 3,
            }}
          />
        </div>
      </div>

      <div className="su-form-group">
        <label>Confirm Password</label>
        <div className="su-input-wrap">
          <i className="fa-solid fa-lock"></i>
          <input
            type={showPw ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
          />
        </div>
      </div>

      <button
        className="signup-submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" /> Creating account…
          </>
        ) : (
          <>
            <i className="fa-solid fa-seedling"></i> Create Farmer Account
          </>
        )}
      </button>
    </div>
  );
}

export default FarmerForm;
