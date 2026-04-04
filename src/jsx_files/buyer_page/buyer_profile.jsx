// src/jsx_files/buyer_page/buyer_profile.jsx
// Buyer profile + settings — admin can push buyer_alert to this page via Content blocks
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import BuyerLayout from "../../components/BuyerLayout";
import "../../css_files/buyer_page/buyer_profile.css";

const DIVISIONS = ["Dhaka","Chittagong","Rajshahi","Khulna","Mymensingh","Rangpur","Sylhet","Barishal"];
const BUSINESS_TYPES = ["Food Processor","Restaurant / Hotel","Wholesaler","Retailer","Export Company","NGO / Government","Other"];
const CROP_INTERESTS = ["Rice","Wheat","Potato","Onion","Mango","Lentil","Mustard","Sugarcane","Jute","Tomato","Maize","Banana"];

export default function BuyerProfile() {
  const { user, logout } = useAuth();

  /* ── form state pulled from auth context ── */
  const [form, setForm] = useState({
    companyName:    user?.profile?.companyName    || user?.name || "",
    contactPerson:  user?.profile?.contactPerson  || user?.name || "",
    email:          user?.email || "",
    phone:          user?.phone || "",
    businessType:   user?.profile?.businessType   || "",
    division:       user?.division || "",
    district:       user?.district || "",
    address:        user?.profile?.address        || "",
    bio:            user?.profile?.bio            || "",
    cropInterests:  user?.profile?.cropInterests  || [],
  });

  const [adminAlert, setAdminAlert] = useState("");
  const [saved, setSaved]           = useState(false);
  const [activeTab, setActiveTab]   = useState("profile");
  const [pwForm, setPwForm]         = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError]       = useState("");
  const revealRefs = useRef([]);

  useEffect(() => {
    // Fetch admin-controlled buyer alert
    fetch("/api/buyer/content/buyer_alert")
      .then(r => r.json())
      .then(d => { if (d.value) setAdminAlert(d.value); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("bp-vis"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const set = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const toggleCrop = crop => {
    setForm(p => ({
      ...p,
      cropInterests: p.cropInterests.includes(crop)
        ? p.cropInterests.filter(c => c !== crop)
        : [...p.cropInterests, crop],
    }));
  };

  const handleSave = async e => {
    e.preventDefault();
    // TODO: PUT /api/buyer/profile with form data
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = e => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    if (pwForm.next.length < 8)         { setPwError("Password must be at least 8 characters."); return; }
    setPwError("");
    alert("Password updated! (Connect to backend /api/buyer/change-password)");
    setPwForm({ current: "", next: "", confirm: "" });
  };

  const firstLetter = (form.contactPerson[0] || "B").toUpperCase();
  const AVATAR_COLORS = ["#4f46e5","#0891b2","#059669"];
  const avatarColor = AVATAR_COLORS[form.companyName.length % AVATAR_COLORS.length];

  return (
    <BuyerLayout activeNav="profile">
      <div className="bp-page">

        {/* ADMIN ALERT (set from admin dashboard → Content Blocks) */}
        {adminAlert && (
          <div className="bp-admin-alert">
            <i className="fa-solid fa-circle-exclamation" />
            <div><strong>Admin Notice:</strong> {adminAlert}</div>
          </div>
        )}

        {/* PAGE HEADER */}
        <div className="bp-page-header bp-reveal" ref={addRef}>
          <div className="bp-header-avatar" style={{ background: avatarColor }}>
            {firstLetter}
          </div>
          <div className="bp-header-info">
            <div className="bp-header-company">{form.companyName || "Your Company"}</div>
            <div className="bp-header-role">
              <i className="fa-solid fa-building" /> {form.businessType || "Food Business"}
              {form.division && <span className="bp-header-sep">·</span>}
              {form.division && <><i className="fa-solid fa-location-dot" /> {form.district && `${form.district}, `}{form.division}</>}
            </div>
            <div className="bp-header-badges">
              <span className="bp-badge bp-badge-verified"><i className="fa-solid fa-shield-halved" /> Verified Business</span>
              <span className="bp-badge bp-badge-active"><i className="fa-solid fa-circle" /> Active</span>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bp-tabs bp-reveal" ref={addRef}>
          {[
            { id: "profile",      label: "Company Profile",         icon: "fa-building" },
            { id: "preferences",  label: "Procurement Preferences", icon: "fa-sliders" },
            { id: "security",     label: "Security",                icon: "fa-lock" },
          ].map(tab => (
            <button
              key={tab.id}
              className={`bp-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fa-solid ${tab.icon}`} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: PROFILE ── */}
        {activeTab === "profile" && (
          <form className="bp-form-section bp-reveal" ref={addRef} onSubmit={handleSave}>
            <div className="bp-form-card">
              <div className="bp-form-card-header">
                <i className="fa-solid fa-building" />
                <div>
                  <div className="bp-card-title">Company Information</div>
                  <div className="bp-card-sub">Edit your business details. These are visible to farmers you connect with.</div>
                </div>
              </div>

              <div className="bp-form-grid">
                <div className="bp-field">
                  <label>Company Name</label>
                  <input value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="e.g. Rahman Food Industries" />
                </div>
                <div className="bp-field">
                  <label>Business Type</label>
                  <select value={form.businessType} onChange={e => set("businessType", e.target.value)}>
                    <option value="">Select type…</option>
                    {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="bp-field">
                  <label>Contact Person</label>
                  <input value={form.contactPerson} onChange={e => set("contactPerson", e.target.value)} placeholder="Full name" />
                </div>
                <div className="bp-field">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com" />
                </div>
                <div className="bp-field">
                  <label>Phone Number</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+880 1XXX-XXXXXX" />
                </div>
                <div className="bp-field">
                  <label>Division</label>
                  <select value={form.division} onChange={e => set("division", e.target.value)}>
                    <option value="">Select division…</option>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="bp-field">
                  <label>District</label>
                  <input value={form.district} onChange={e => set("district", e.target.value)} placeholder="e.g. Dhaka, Gazipur" />
                </div>
                <div className="bp-field bp-field-full">
                  <label>Business Address</label>
                  <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Full address" />
                </div>
                <div className="bp-field bp-field-full">
                  <label>About Your Business</label>
                  <textarea
                    value={form.bio}
                    onChange={e => set("bio", e.target.value)}
                    placeholder="Describe your business, procurement volumes, and what you're looking for…"
                    rows={4}
                  />
                </div>
              </div>

              <div className="bp-form-actions">
                {saved && (
                  <div className="bp-save-success">
                    <i className="fa-solid fa-circle-check" /> Changes saved!
                  </div>
                )}
                <button type="submit" className="bp-save-btn">
                  <i className="fa-solid fa-floppy-disk" /> Save Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── TAB: PREFERENCES ── */}
        {activeTab === "preferences" && (
          <div className="bp-form-section bp-reveal" ref={addRef}>
            <div className="bp-form-card">
              <div className="bp-form-card-header">
                <i className="fa-solid fa-sliders" />
                <div>
                  <div className="bp-card-title">Procurement Preferences</div>
                  <div className="bp-card-sub">Tell us what crops you buy — we'll surface matching farmer listings and price alerts.</div>
                </div>
              </div>

              <div className="bp-pref-section">
                <div className="bp-pref-label">Crops I Procure Regularly</div>
                <div className="bp-crop-grid">
                  {CROP_INTERESTS.map(crop => (
                    <button
                      key={crop}
                      type="button"
                      className={`bp-crop-chip ${form.cropInterests.includes(crop) ? "active" : ""}`}
                      onClick={() => toggleCrop(crop)}
                    >
                      {form.cropInterests.includes(crop) && <i className="fa-solid fa-check" />}
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bp-pref-section">
                <div className="bp-pref-label">Notification Preferences</div>
                <div className="bp-notif-list">
                  {[
                    { id: "price_alert",   label: "Price Alerts",     desc: "Notify me when my preferred crops change in price by 3%+" },
                    { id: "new_listing",   label: "New Listings",     desc: "Notify me when new farmers list my preferred crops" },
                    { id: "order_update",  label: "Order Updates",    desc: "Notify me on order status changes" },
                    { id: "weekly_digest", label: "Weekly Digest",    desc: "Weekly market summary and procurement tips" },
                  ].map(pref => (
                    <label key={pref.id} className="bp-notif-row">
                      <div className="bp-notif-text">
                        <div className="bp-notif-label">{pref.label}</div>
                        <div className="bp-notif-desc">{pref.desc}</div>
                      </div>
                      <div className="fd-toggle on" onClick={() => {}}>
                        <div className="fd-toggle-knob" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bp-form-actions">
                <button type="button" className="bp-save-btn" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
                  <i className="fa-solid fa-floppy-disk" /> Save Preferences
                </button>
                {saved && <div className="bp-save-success"><i className="fa-solid fa-circle-check" /> Saved!</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SECURITY ── */}
        {activeTab === "security" && (
          <div className="bp-form-section bp-reveal" ref={addRef}>
            <div className="bp-form-card">
              <div className="bp-form-card-header">
                <i className="fa-solid fa-lock" />
                <div>
                  <div className="bp-card-title">Security Settings</div>
                  <div className="bp-card-sub">Change your password and manage account access.</div>
                </div>
              </div>

              <form onSubmit={handlePasswordChange}>
                <div className="bp-form-grid">
                  <div className="bp-field bp-field-full">
                    <label>Current Password</label>
                    <input type="password" value={pwForm.current} onChange={e => setPwForm(p => ({...p, current: e.target.value}))} placeholder="Enter current password" />
                  </div>
                  <div className="bp-field">
                    <label>New Password</label>
                    <input type="password" value={pwForm.next} onChange={e => setPwForm(p => ({...p, next: e.target.value}))} placeholder="At least 8 characters" />
                  </div>
                  <div className="bp-field">
                    <label>Confirm New Password</label>
                    <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({...p, confirm: e.target.value}))} placeholder="Repeat new password" />
                  </div>
                </div>
                {pwError && <div className="bp-pw-error"><i className="fa-solid fa-triangle-exclamation" /> {pwError}</div>}
                <div className="bp-form-actions">
                  <button type="submit" className="bp-save-btn">
                    <i className="fa-solid fa-key" /> Update Password
                  </button>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="bp-danger-zone">
                <div className="bp-danger-header">
                  <i className="fa-solid fa-triangle-exclamation" /> Danger Zone
                </div>
                <div className="bp-danger-row">
                  <div>
                    <div className="bp-danger-label">Deactivate Account</div>
                    <div className="bp-danger-desc">Your account will be suspended. Contact admin to reactivate.</div>
                  </div>
                  <button className="bp-danger-btn" onClick={() => alert("Contact admin@krishibondhu.com to deactivate.")}>
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACCOUNT META */}
        <div className="bp-account-meta bp-reveal" ref={addRef}>
          <div className="bp-meta-item"><i className="fa-solid fa-calendar" /> Member since January 2024</div>
          <div className="bp-meta-item"><i className="fa-solid fa-id-badge" /> Buyer ID: {user?._id || "BUY-00001"}</div>
          <div className="bp-meta-item"><i className="fa-solid fa-shield-halved" /> Account status: <strong>Active</strong></div>
        </div>

      </div>
    </BuyerLayout>
  );
}
