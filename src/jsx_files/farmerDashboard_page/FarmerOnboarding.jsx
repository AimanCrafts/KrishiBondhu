import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/farmerDashboard_page/farmerOnboarding.css";

const API = "http://localhost:5000/api";

// Helper to call the API with auth token
async function apiPost(path, body) {
  const token = localStorage.getItem("kb_token");
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}

// ─── Dropdown options ────────────────────────────────────────
const CROP_OPTIONS = [
  "Rice",
  "Wheat",
  "Jute",
  "Potato",
  "Mustard",
  "Maize",
  "Sugarcane",
  "Lentil",
  "Onion",
  "Garlic",
  "Tomato",
  "Brinjal",
  "Chili",
  "Cucumber",
  "Other",
];

const SOIL_OPTIONS = [
  "Clay",
  "Clay-Loam",
  "Loam",
  "Sandy-Loam",
  "Sandy",
  "Silt",
];

const IRRIGATION_OPTIONS = ["Tubewell", "Canal", "River", "Rain-fed", "Pond"];
// ─────────────────────────────────────────────────────────────

export default function FarmerOnboarding() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1); // 1 = field info, 2 = current crop, 3 = planned crop
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // All form values in one object
  const [form, setForm] = useState({
    // Step 1 — field info
    totalAcres: "",
    soilType: "",
    irrigation: "",
    // Step 2 — current crop
    currentCropName: "",
    currentCropVariety: "",
    plantedOn: "",
    areaAcres: "",
    fieldName: "",
    // Step 3 — planned crop
    plannedCropName: "",
    plannedSowOn: "",
  });

  const upd = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  // ── Step validation before moving forward ──────────────────
  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (!form.totalAcres || Number(form.totalAcres) <= 0)
        return (setError("Please enter total land area."), false);
      if (!form.soilType) return (setError("Please select soil type."), false);
    }
    if (step === 2) {
      if (!form.currentCropName)
        return (setError("Please select your current crop."), false);
      if (!form.plantedOn)
        return (setError("Please enter when you planted the crop."), false);
      if (!form.areaAcres || Number(form.areaAcres) <= 0)
        return (setError("Please enter the crop area."), false);
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  // ── Final submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const result = await apiPost("/user/farm-data", form);

      // Update AuthContext with the fresh user data from server
      // so dashboard immediately sees the new farmData
      login(result.user);

      // Also update localStorage session
      const session = JSON.parse(localStorage.getItem("kb_session") || "{}");
      localStorage.setItem(
        "kb_session",
        JSON.stringify({ ...session, farmData: result.user.farmData }),
      );

      navigate("/farmer_dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Skip onboarding (farmer can fill later from Settings) ──
  const handleSkip = () => navigate("/farmer_dashboard", { replace: true });

  // ─────────────────────────────────────────────────────────
  return (
    <div className="ob-root">
      {/* Header */}
      <div className="ob-header">
        <div className="ob-brand">
          <i className="fa-solid fa-leaf" />
          <span className="k">Krishi</span>
          <span className="b">Bondhu</span>
        </div>
        <p className="ob-tagline">Let us personalize your dashboard</p>
      </div>

      {/* Step indicator */}
      <div className="ob-steps">
        {["Your Land", "Current Crop", "Next Plan"].map((label, i) => (
          <div
            key={i}
            className={`ob-step ${step === i + 1 ? "active" : ""} ${step > i + 1 ? "done" : ""}`}
          >
            <div className="ob-step-circle">{step > i + 1 ? "✓" : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="ob-card">
        {/* ── STEP 1: Field info ── */}
        {step === 1 && (
          <>
            <h2 className="ob-title">Tell us about your land</h2>
            <p className="ob-desc">
              This helps us show the right crop advice for your field.
            </p>

            <label className="ob-label">Total land area (acres) *</label>
            <input
              className="ob-input"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="e.g. 2.5"
              value={form.totalAcres}
              onChange={(e) => upd("totalAcres", e.target.value)}
            />

            <label className="ob-label">Soil type *</label>
            <select
              className="ob-select"
              value={form.soilType}
              onChange={(e) => upd("soilType", e.target.value)}
            >
              <option value="">-- Select soil type --</option>
              {SOIL_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <label className="ob-label">Irrigation source</label>
            <select
              className="ob-select"
              value={form.irrigation}
              onChange={(e) => upd("irrigation", e.target.value)}
            >
              <option value="">-- Select irrigation --</option>
              {IRRIGATION_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </>
        )}

        {/* ── STEP 2: Current crop ── */}
        {step === 2 && (
          <>
            <h2 className="ob-title">What are you growing now?</h2>
            <p className="ob-desc">
              We will track growth stage and give timely advice.
            </p>

            <label className="ob-label">Crop name *</label>
            <select
              className="ob-select"
              value={form.currentCropName}
              onChange={(e) => upd("currentCropName", e.target.value)}
            >
              <option value="">-- Select crop --</option>
              {CROP_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <label className="ob-label">Variety / season (optional)</label>
            <input
              className="ob-input"
              type="text"
              placeholder="e.g. Boro, BRRI-28"
              value={form.currentCropVariety}
              onChange={(e) => upd("currentCropVariety", e.target.value)}
            />

            <label className="ob-label">Date planted / transplanted *</label>
            <input
              className="ob-input"
              type="date"
              value={form.plantedOn}
              onChange={(e) => upd("plantedOn", e.target.value)}
            />

            <label className="ob-label">Area for this crop (acres) *</label>
            <input
              className="ob-input"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="e.g. 1.5"
              value={form.areaAcres}
              onChange={(e) => upd("areaAcres", e.target.value)}
            />

            <label className="ob-label">Field name (optional)</label>
            <input
              className="ob-input"
              type="text"
              placeholder='e.g. "North Field" or "Field A"'
              value={form.fieldName}
              onChange={(e) => upd("fieldName", e.target.value)}
            />
          </>
        )}

        {/* ── STEP 3: Planned crop ── */}
        {step === 3 && (
          <>
            <h2 className="ob-title">What will you grow next?</h2>
            <p className="ob-desc">
              This shows as "Planned Next" on your dashboard. You can change it
              anytime.
            </p>

            <label className="ob-label">Next crop (optional)</label>
            <select
              className="ob-select"
              value={form.plannedCropName}
              onChange={(e) => upd("plannedCropName", e.target.value)}
            >
              <option value="">-- Not decided yet --</option>
              {CROP_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <label className="ob-label">Planned sowing date (optional)</label>
            <input
              className="ob-input"
              type="date"
              value={form.plannedSowOn}
              onChange={(e) => upd("plannedSowOn", e.target.value)}
            />

            <p className="ob-note">
              <i className="fa-solid fa-circle-info" /> You can update your
              planned crop anytime from your dashboard or Settings.
            </p>
          </>
        )}

        {/* Error message */}
        {error && (
          <p className="ob-error">
            <i className="fa-solid fa-triangle-exclamation" /> {error}
          </p>
        )}

        {/* Navigation buttons */}
        <div className="ob-btn-row">
          {step > 1 && (
            <button
              className="ob-btn-back"
              onClick={() => setStep((s) => s - 1)}
            >
              ← Back
            </button>
          )}

          {step < 3 && (
            <button className="ob-btn-next" onClick={goNext}>
              Next →
            </button>
          )}

          {step === 3 && (
            <button
              className="ob-btn-submit"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving…" : "Go to Dashboard →"}
            </button>
          )}
        </div>

        {/* Skip link — always visible */}
        <button className="ob-skip" onClick={handleSkip}>
          Skip for now (fill later from Settings)
        </button>
      </div>

      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </div>
  );
}
