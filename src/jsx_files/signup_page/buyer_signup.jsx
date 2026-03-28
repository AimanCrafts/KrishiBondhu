// src/jsx_files/signup_page/buyer_signup.jsx
import { useState, useRef } from "react";
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
const BUSINESS_TYPES = [
  "Food Processing Company",
  "Restaurant / Food Service",
  "Catering Service",
  "Agro-based Industry",
  "Wholesale Food Distributor",
  "Supermarket / Retail Chain",
  "Export-Oriented Food Business",
  "Other Food-Related Business",
];
const STEPS = [
  { icon: "fa-building", label: "Company" },
  { icon: "fa-address-card", label: "Contact" },
  { icon: "fa-file-shield", label: "Documents" },
];

function BusinessForm({ onSubmit }) {
  const [wizardStep, setWizardStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    businessType: "",
    tradeLicense: "",
    tin: "",
    employeeCount: "",
    annualTurnover: "",
    contactPerson: "",
    phone: "",
    email: "",
    division: "",
    district: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [licenseFile, setLicenseFile] = useState(null);
  const [tinFile, setTinFile] = useState(null);
  const [extraFile, setExtraFile] = useState(null);
  const licenseRef = useRef();
  const tinRef = useRef();
  const extraRef = useRef();

  const update = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  const handleFile = (e, setter) => {
    const f = e.target.files[0];
    if (f) setter(f);
  };

  const UploadZone = ({
    file,
    inputRef,
    onChangeSetter,
    label,
    hint,
    emptyLabel,
    emptyHint,
  }) => (
    <div className="su-form-group">
      <label>
        {label}
        <span className="label-hint">{hint}</span>
      </label>
      <div
        className={`upload-zone ${file ? "has-file" : ""}`}
        onClick={() => inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e, onChangeSetter)}
        />
        <div className="upload-icon">
          {file ? (
            <i className="fa-solid fa-circle-check" />
          ) : (
            <i className="fa-solid fa-cloud-arrow-up" />
          )}
        </div>
        {file ? (
          <p className="upload-filename">{file.name}</p>
        ) : (
          <>
            <p>{emptyLabel}</p>
            <span>{emptyHint}</span>
          </>
        )}
      </div>
    </div>
  );

  const WizardProgress = () => (
    <div className="wizard-progress">
      {STEPS.map((s, i) => (
        <div
          key={i}
          className={`wizard-step-pill ${i < wizardStep ? "done" : i === wizardStep ? "active" : ""}`}
          onClick={() => i < wizardStep && setWizardStep(i)}
          style={{ cursor: i < wizardStep ? "pointer" : "default" }}
        >
          <span className="wizard-pill-icon">
            {i < wizardStep ? (
              <i className="fa-solid fa-check" />
            ) : (
              <i className={`fa-solid ${s.icon}`} />
            )}
          </span>
          <span className="wizard-pill-label">{s.label}</span>
        </div>
      ))}
    </div>
  );

  const NavButtons = ({
    onNext,
    nextLabel = "Continue",
    nextIcon = "fa-arrow-right",
  }) => (
    <div className="wizard-nav-row">
      {wizardStep > 0 && (
        <button
          className="wizard-back-btn"
          onClick={() => {
            setError("");
            setWizardStep((s) => s - 1);
          }}
        >
          <i className="fa-solid fa-arrow-left" /> Back
        </button>
      )}
      <button
        className={`signup-submit-btn business-btn ${wizardStep === 0 ? "wizard-solo-btn" : ""}`}
        style={{ flex: 1 }}
        onClick={onNext}
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin" /> Please wait…
          </>
        ) : (
          <>
            <i className={`fa-solid ${nextIcon}`} /> {nextLabel}
          </>
        )}
      </button>
    </div>
  );

  const v0 = () => {
    if (!form.companyName.trim()) return "Please enter your company name.";
    if (!form.businessType) return "Please select your business type.";
    if (!form.tradeLicense.trim())
      return "Please enter your trade license number.";
    if (form.tin.length < 12) return "TIN must be 12 digits.";
    return null;
  };
  const v1 = () => {
    if (!form.contactPerson.trim())
      return "Please enter the contact person name.";
    if (form.phone.length < 9) return "Please enter a valid phone number.";
    if (!form.email.includes("@")) return "Please enter a valid email.";
    if (!form.division) return "Please select your division.";
    if (!form.district.trim()) return "Please enter your district.";
    return null;
  };

  const handleFinalSubmit = async () => {
    setError("");
    if (!form.password || form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    await onSubmit("business", form);
    setLoading(false);
  };

  // ── STEP 0 ──
  if (wizardStep === 0)
    return (
      <div className="signup-form-section">
        <div className="verification-notice">
          <i className="fa-solid fa-shield-halved" />
          <p>
            <strong>Verified accounts only.</strong> Approval typically takes{" "}
            <strong>1–3 business days</strong> after document review.
          </p>
        </div>
        <WizardProgress />
        {error && (
          <div className="auth-error-banner">
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </div>
        )}
        <p className="form-section-title">Company Information</p>
        <div className="su-form-group">
          <label>Company / Business Name</label>
          <div className="su-input-wrap">
            <i className="fa-solid fa-building" />
            <input
              type="text"
              placeholder="Registered company name"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </div>
        </div>
        <div className="su-form-group">
          <label>Business Type</label>
          <div className="su-input-wrap">
            <i className="fa-solid fa-briefcase" />
            <select
              value={form.businessType}
              onChange={(e) => update("businessType", e.target.value)}
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <i className="fa-solid fa-chevron-down select-arrow" />
          </div>
        </div>
        <div className="form-row">
          <div className="su-form-group">
            <label>
              Trade License No.{" "}
              <span className="label-hint">(RJSC / City Corp)</span>
            </label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-file-contract" />
              <input
                type="text"
                placeholder="TL-XXXXXXXXXX"
                value={form.tradeLicense}
                onChange={(e) => update("tradeLicense", e.target.value)}
              />
            </div>
          </div>
          <div className="su-form-group">
            <label>TIN Number</label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-receipt" />
              <input
                type="text"
                placeholder="12-digit TIN"
                maxLength={12}
                value={form.tin}
                onChange={(e) =>
                  update("tin", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="su-form-group">
            <label>
              No. of Employees <span className="label-hint">(approx.)</span>
            </label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-users" />
              <input
                type="number"
                placeholder="e.g. 50"
                min="1"
                value={form.employeeCount}
                onChange={(e) => update("employeeCount", e.target.value)}
              />
            </div>
          </div>
          <div className="su-form-group">
            <label>
              Annual Turnover <span className="label-hint">(BDT, approx.)</span>
            </label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-chart-line" />
              <input
                type="text"
                placeholder="e.g. 50,00,000"
                value={form.annualTurnover}
                onChange={(e) => update("annualTurnover", e.target.value)}
              />
            </div>
          </div>
        </div>
        <NavButtons
          onNext={() => {
            const e = v0();
            if (e) {
              setError(e);
            } else {
              setError("");
              setWizardStep(1);
            }
          }}
          nextLabel="Next: Contact Details"
        />
      </div>
    );

  // ── STEP 1 ──
  if (wizardStep === 1)
    return (
      <div className="signup-form-section">
        <WizardProgress />
        {error && (
          <div className="auth-error-banner">
            <i className="fa-solid fa-circle-exclamation" /> {error}
          </div>
        )}
        <p className="form-section-title">Contact Details</p>
        <div className="su-form-group">
          <label>Contact Person (Authorised Representative)</label>
          <div className="su-input-wrap">
            <i className="fa-solid fa-user-tie" />
            <input
              type="text"
              placeholder="Full name of contact person"
              value={form.contactPerson}
              onChange={(e) => update("contactPerson", e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="su-form-group">
            <label>Business Phone</label>
            <div className="phone-prefix-wrap">
              <div className="phone-prefix">+880</div>
              <div className="su-input-wrap">
                <i className="fa-solid fa-phone" />
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
            <label>Business Email</label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-envelope" />
              <input
                type="email"
                placeholder="company@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <div className="su-form-group">
            <label>Division</label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-map" />
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
              <i className="fa-solid fa-chevron-down select-arrow" />
            </div>
          </div>
          <div className="su-form-group">
            <label>District</label>
            <div className="su-input-wrap">
              <i className="fa-solid fa-location-dot" />
              <input
                type="text"
                placeholder="District"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="su-form-group">
          <label>Business Address</label>
          <textarea
            placeholder="Full street address, area, city..."
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        <NavButtons
          onNext={() => {
            const e = v1();
            if (e) {
              setError(e);
            } else {
              setError("");
              setWizardStep(2);
            }
          }}
          nextLabel="Next: Documents"
        />
      </div>
    );

  // ── STEP 2 ──
  return (
    <div className="signup-form-section">
      <WizardProgress />
      {error && (
        <div className="auth-error-banner">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </div>
      )}
      <p className="form-section-title">Verification Documents</p>
      <UploadZone
        file={licenseFile}
        inputRef={licenseRef}
        onChangeSetter={setLicenseFile}
        label="Trade License"
        hint="(PDF, JPG or PNG · max 5MB)"
        emptyLabel="Click to upload Trade License"
        emptyHint="Issued by City Corporation, Paurashava or RJSC"
      />
      <UploadZone
        file={tinFile}
        inputRef={tinRef}
        onChangeSetter={setTinFile}
        label="TIN Certificate"
        hint="(PDF, JPG or PNG · max 5MB)"
        emptyLabel="Click to upload TIN Certificate"
        emptyHint="Issued by the National Board of Revenue (NBR)"
      />
      <div className="su-form-group">
        <label>
          Additional Document <span className="label-hint">(optional)</span>
        </label>
        <div
          className={`upload-zone ${extraFile ? "has-file" : ""}`}
          onClick={() => extraRef.current.click()}
        >
          <input
            ref={extraRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e, setExtraFile)}
          />
          <div className="upload-icon">
            {extraFile ? (
              <i className="fa-solid fa-circle-check" />
            ) : (
              <i className="fa-solid fa-file-circle-plus" />
            )}
          </div>
          {extraFile ? (
            <p className="upload-filename">{extraFile.name}</p>
          ) : (
            <>
              <p>Upload any supporting document</p>
              <span>IRC, VAT registration, MoA, or other credentials</span>
            </>
          )}
        </div>
      </div>
      <hr className="form-divider" />
      <p className="form-section-title">Set Password</p>
      <div className="su-form-group">
        <label>
          Password <span className="label-hint">(min. 6 characters)</span>
        </label>
        <div className="su-input-wrap">
          <i className="fa-solid fa-lock" />
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
          <i className="fa-solid fa-lock" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
          />
        </div>
      </div>
      <NavButtons
        onNext={handleFinalSubmit}
        nextLabel="Submit for Verification"
        nextIcon="fa-paper-plane"
      />
    </div>
  );
}

export default BusinessForm;
