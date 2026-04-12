import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/farmerDashboard_page/settings.css";

const API = "http://localhost:5000/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("kb_token")}`,
});

async function apiCall(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: { ...authHeaders(), ...(opts.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
}

/* ─── Toast ─── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  if (!message) return null;
  return (
    <div className={`st-toast st-toast-${type}`}>
      <i
        className={`fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-xmark"}`}
      />
      <span>{message}</span>
      <button className="st-toast-close" onClick={onClose}>
        <i className="fa-solid fa-xmark" />
      </button>
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="st-section-header">
      <div className="st-section-icon">
        <i className={`fa-solid ${icon}`} />
      </div>
      <div>
        <h3 className="st-section-title">{title}</h3>
        {subtitle && <p className="st-section-sub">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PROFILE TAB
════════════════════════════════════════ */
function ProfileTab({ user, onUpdate, showToast }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    district: user?.profile?.district || "",
    division: user?.profile?.division || "",
    farmSize: user?.profile?.farmSize || "",
    soilType: user?.profile?.soilType || "",
    bio: user?.profile?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const DIVISIONS = [
    "Dhaka",
    "Chattogram",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ];
  const SOIL_TYPES = [
    "Clay",
    "Clay-Loam",
    "Sandy",
    "Sandy-Loam",
    "Loam",
    "Silt",
  ];

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast("Name is required.", "error");
      return;
    }
    setSaving(true);
    try {
      const data = await apiCall("/user/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      onUpdate(
        data.user || {
          ...user,
          name: form.name,
          profile: { ...user?.profile, ...form },
        },
      );
      showToast("Profile updated successfully.", "success");
    } catch {
      onUpdate({
        ...user,
        name: form.name,
        profile: { ...user?.profile, ...form },
      });
      showToast("Profile updated (demo mode).", "success");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = (form.name || "F").charAt(0).toUpperCase();

  return (
    <div className="st-tab-body">
      {/* Avatar Row */}
      <div className="st-avatar-row">
        <div className="st-avatar-circle">{avatarLetter}</div>
        <div className="st-avatar-info">
          <div className="st-avatar-name">{form.name || "Your Name"}</div>
          <div className="st-avatar-role">
            <i className="fa-solid fa-tractor" /> Farmer ·{" "}
            {form.division || "Bangladesh"}
          </div>
        </div>
      </div>

      <SectionHeader
        icon="fa-user"
        title="Personal Information"
        subtitle="Your name and contact details"
      />

      <div className="st-form-grid">
        <div className="st-form-group">
          <label>Full Name *</label>
          <div className="st-input-wrap">
            <i className="fa-solid fa-user st-input-icon" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              placeholder="e.g. Rahim Uddin"
            />
          </div>
        </div>

        <div className="st-form-group">
          <label>Phone Number</label>
          <div className="st-input-wrap">
            <i className="fa-solid fa-phone st-input-icon" />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => upd("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
            />
          </div>
        </div>

        <div className="st-form-group">
          <label>District</label>
          <div className="st-input-wrap">
            <i className="fa-solid fa-location-dot st-input-icon" />
            <input
              type="text"
              value={form.district}
              onChange={(e) => upd("district", e.target.value)}
              placeholder="e.g. Gazipur"
            />
          </div>
        </div>

        <div className="st-form-group">
          <label>Division</label>
          <div className="st-input-wrap st-select-wrap">
            <i className="fa-solid fa-map st-input-icon" />
            <select
              value={form.division}
              onChange={(e) => upd("division", e.target.value)}
            >
              <option value="">Select Division</option>
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <SectionHeader
        icon="fa-seedling"
        title="Farm Information"
        subtitle="Details about your land and soil"
      />

      <div className="st-form-grid">
        <div className="st-form-group">
          <label>Farm Size (acres)</label>
          <div className="st-input-wrap">
            <i className="fa-solid fa-expand st-input-icon" />
            <input
              type="text"
              value={form.farmSize}
              onChange={(e) => upd("farmSize", e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>
        </div>

        <div className="st-form-group">
          <label>Soil Type</label>
          <div className="st-input-wrap st-select-wrap">
            <i className="fa-solid fa-layer-group st-input-icon" />
            <select
              value={form.soilType}
              onChange={(e) => upd("soilType", e.target.value)}
            >
              <option value="">Select Soil Type</option>
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="st-form-group st-fg-full">
          <label>
            Short Bio <span className="st-label-hint">(optional)</span>
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => upd("bio", e.target.value)}
            rows={3}
            placeholder="Write something about your farm…"
          />
        </div>
      </div>

      <div className="st-form-actions">
        <button
          className="st-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PASSWORD TAB
════════════════════════════════════════ */
function PasswordTab({ showToast }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const toggleShow = (k) => setShow((p) => ({ ...p, [k]: !p[k] }));

  const strength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthClass = [
    "",
    "st-pw-weak",
    "st-pw-fair",
    "st-pw-good",
    "st-pw-strong",
  ];
  const s = strength(form.next);

  const handleSave = async () => {
    if (!form.current) {
      showToast("Enter your current password.", "error");
      return;
    }
    if (form.next.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (form.next !== form.confirm) {
      showToast("New passwords do not match.", "error");
      return;
    }
    setSaving(true);
    try {
      await apiCall("/user/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.next,
        }),
      });
      showToast("Password changed successfully.", "success");
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      showToast(err.message || "Password could not be changed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const PwField = ({ label, field, placeholder }) => (
    <div className="st-form-group st-fg-full">
      <label>{label}</label>
      <div className="st-input-wrap st-pw-wrap">
        <i className="fa-solid fa-lock st-input-icon" />
        <input
          type={show[field] ? "text" : "password"}
          value={form[field]}
          onChange={(e) => upd(field, e.target.value)}
          placeholder={placeholder}
        />
        <button
          className="st-pw-eye"
          onClick={() => toggleShow(field)}
          type="button"
        >
          <i
            className={`fa-solid ${show[field] ? "fa-eye-slash" : "fa-eye"}`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="st-tab-body">
      <SectionHeader
        icon="fa-shield-halved"
        title="Change Password"
        subtitle="Update your password regularly to keep your account secure"
      />

      <div className="st-form-grid">
        <PwField
          label="Current Password *"
          field="current"
          placeholder="Enter current password"
        />
        <PwField
          label="New Password *"
          field="next"
          placeholder="Enter new password"
        />

        {form.next && (
          <div className="st-fg-full">
            <div className="st-pw-strength-bar">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`st-pw-bar-seg ${i <= s ? strengthClass[s] : ""}`}
                />
              ))}
            </div>
            <div className={`st-pw-strength-label ${strengthClass[s]}`}>
              {strengthLabel[s]}
            </div>
          </div>
        )}

        <PwField
          label="Confirm New Password *"
          field="confirm"
          placeholder="Re-enter new password"
        />

        {form.confirm && form.next !== form.confirm && (
          <div className="st-fg-full">
            <div className="st-pw-mismatch">
              <i className="fa-solid fa-triangle-exclamation" /> Passwords do
              not match
            </div>
          </div>
        )}
      </div>

      <div className="st-pw-tips">
        <div className="st-pw-tips-title">
          <i className="fa-solid fa-lightbulb" /> Tips for a strong password
        </div>
        {[
          "Use at least 8 characters",
          "Include uppercase letters (A–Z)",
          "Add numbers (0–9)",
          "Use special characters (!@#$)",
        ].map((tip) => (
          <div key={tip} className="st-pw-tip">
            <i className="fa-solid fa-check" /> {tip}
          </div>
        ))}
      </div>

      <div className="st-form-actions">
        <button
          className="st-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Updating…
            </>
          ) : (
            <>
              <i className="fa-solid fa-key" /> Change Password
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   NOTIFICATIONS TAB
════════════════════════════════════════ */
function NotificationsTab({ showToast }) {
  const [prefs, setPrefs] = useState({
    weatherAlerts: true,
    pestAlerts: true,
    marketUpdates: true,
    expertMessages: true,
    cropReminders: true,
    weeklyReport: false,
    smsAlerts: false,
    emailDigest: false,
  });
  const [saving, setSaving] = useState(false);
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  const GROUPS = [
    {
      title: "Farm Alerts",
      icon: "fa-bell",
      items: [
        {
          key: "weatherAlerts",
          label: "Weather Alerts",
          desc: "Storm, rain, or drought forecasts",
        },
        {
          key: "pestAlerts",
          label: "Pest & Disease",
          desc: "Pest or disease reports in nearby areas",
        },
        {
          key: "cropReminders",
          label: "Crop Reminders",
          desc: "Fertilizer, irrigation, or harvest reminders",
        },
      ],
    },
    {
      title: "Market & Experts",
      icon: "fa-store",
      items: [
        {
          key: "marketUpdates",
          label: "Market Price Updates",
          desc: "Daily crop price changes",
        },
        {
          key: "expertMessages",
          label: "Expert Messages",
          desc: "Replies from agricultural consultants",
        },
        {
          key: "weeklyReport",
          label: "Weekly Report",
          desc: "Weekly farm summary digest",
        },
      ],
    },
    {
      title: "Additional Channels",
      icon: "fa-envelope",
      items: [
        {
          key: "smsAlerts",
          label: "SMS Alerts",
          desc: "Receive urgent alerts via SMS",
        },
        {
          key: "emailDigest",
          label: "Email Digest",
          desc: "Weekly summary via email",
        },
      ],
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiCall("/user/notification-prefs", {
        method: "PUT",
        body: JSON.stringify(prefs),
      });
      showToast("Notification preferences saved.", "success");
    } catch {
      showToast("Preferences saved (demo mode).", "success");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="st-tab-body">
      <SectionHeader
        icon="fa-bell"
        title="Notification Settings"
        subtitle="Control which alerts and updates you receive"
      />

      {GROUPS.map((group) => (
        <div key={group.title} className="st-notif-group">
          <div className="st-notif-group-title">
            <i className={`fa-solid ${group.icon}`} /> {group.title}
          </div>
          {group.items.map((item) => (
            <div key={item.key} className="st-notif-row">
              <div className="st-notif-info">
                <div className="st-notif-label">{item.label}</div>
                <div className="st-notif-desc">{item.desc}</div>
              </div>
              <button
                className={`st-toggle ${prefs[item.key] ? "st-toggle-on" : ""}`}
                onClick={() => toggle(item.key)}
                aria-label={item.label}
              >
                <div className="st-toggle-thumb" />
              </button>
            </div>
          ))}
        </div>
      ))}

      <div className="st-form-actions">
        <button
          className="st-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Saving…
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk" /> Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   ACCOUNT TAB
════════════════════════════════════════ */
function AccountTab({ user, showToast, onLogout }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") {
      showToast("Type DELETE to confirm.", "error");
      return;
    }
    setDeleting(true);
    try {
      await apiCall("/user/account", { method: "DELETE" });
      onLogout();
    } catch {
      showToast("Could not delete account. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="st-tab-body">
      <SectionHeader
        icon="fa-circle-info"
        title="Account Information"
        subtitle="Your account details and status"
      />

      <div className="st-account-info-card">
        <div className="st-acc-row">
          <span className="st-acc-label">
            <i className="fa-solid fa-user" /> Name
          </span>
          <span className="st-acc-val">{user?.name || "—"}</span>
        </div>
        <div className="st-acc-row">
          <span className="st-acc-label">
            <i className="fa-solid fa-phone" /> Phone
          </span>
          <span className="st-acc-val">{user?.phone || "—"}</span>
        </div>
        <div className="st-acc-row">
          <span className="st-acc-label">
            <i className="fa-solid fa-location-dot" /> District
          </span>
          <span className="st-acc-val">{user?.profile?.district || "—"}</span>
        </div>
        <div className="st-acc-row">
          <span className="st-acc-label">
            <i className="fa-solid fa-tractor" /> Role
          </span>
          <span className="st-acc-val">
            <span className="st-role-badge">Farmer</span>
          </span>
        </div>
        <div className="st-acc-row">
          <span className="st-acc-label">
            <i className="fa-solid fa-circle-check" /> Status
          </span>
          <span className="st-acc-val">
            <span className="st-status-active">
              <i className="fa-solid fa-circle" /> Active
            </span>
          </span>
        </div>
      </div>

      <div className="st-danger-zone">
        <div className="st-danger-header">
          <i className="fa-solid fa-triangle-exclamation" />
          <h3>Danger Zone</h3>
        </div>
        <div className="st-danger-body">
          <div className="st-danger-item">
            <div>
              <div className="st-danger-title">Delete Account</div>
              <div className="st-danger-desc">
                This action is irreversible. All your data, crop history, and
                records will be permanently removed.
              </div>
            </div>
            <button
              className="st-btn-danger"
              onClick={() => setConfirmDelete(true)}
            >
              <i className="fa-solid fa-trash" /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div
          className="st-modal-overlay"
          onClick={() => setConfirmDelete(false)}
        >
          <div className="st-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="st-modal-icon-wrap">
              <i className="fa-solid fa-trash st-modal-danger-icon" />
            </div>
            <h3 className="st-modal-title">Are you absolutely sure?</h3>
            <p className="st-modal-desc">
              This step is completely irreversible. Type <strong>DELETE</strong>{" "}
              below to confirm.
            </p>
            <input
              className="st-modal-confirm-input"
              type="text"
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type DELETE"
            />
            <div className="st-modal-footer">
              <button
                className="st-btn-ghost"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeleteInput("");
                }}
              >
                Cancel
              </button>
              <button
                className="st-btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteInput !== "DELETE"}
              >
                {deleting ? (
                  "Deleting…"
                ) : (
                  <>
                    <i className="fa-solid fa-trash" /> Permanently Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN SETTINGS PAGE
════════════════════════════════════════ */
const TABS = [
  { id: "profile", icon: "fa-user-pen", label: "Profile" },
  { id: "password", icon: "fa-lock", label: "Password" },
  { id: "notifications", icon: "fa-bell", label: "Notifications" },
  { id: "account", icon: "fa-shield-halved", label: "Account" },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const showToast = (message, type = "success") => setToast({ message, type });
  const clearToast = () => setToast({ message: "", type: "success" });

  const handleUpdate = (updatedUser) => {
    login(updatedUser);
    const token = localStorage.getItem("kb_token");
    localStorage.setItem("kb_user", JSON.stringify(updatedUser));
    if (token) localStorage.setItem("kb_token", token);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const tabContent = {
    profile: (
      <ProfileTab user={user} onUpdate={handleUpdate} showToast={showToast} />
    ),
    password: <PasswordTab showToast={showToast} />,
    notifications: <NotificationsTab showToast={showToast} />,
    account: (
      <AccountTab user={user} showToast={showToast} onLogout={handleLogout} />
    ),
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div className="st-root">
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />

        {/* Topbar — no back button, no user name */}
        <div className="st-topbar">
          <div className="st-topbar-title">
            <i className="fa-solid fa-gear" />
            <span>Settings</span>
          </div>
        </div>

        <div className="st-layout">
          {/* Sidebar */}
          <nav className="st-sidebar">
            <div className="st-sidebar-label">Configuration</div>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`st-tab-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={`fa-solid ${tab.icon}`} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <i className="fa-solid fa-chevron-right st-tab-arrow" />
                )}
              </button>
            ))}

            <div className="st-sidebar-divider" />
            <button className="st-tab-btn st-tab-logout" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" />
              <span>Logout</span>
            </button>
          </nav>

          {/* Content */}
          <main className="st-main">
            <div className="st-main-inner">{tabContent[activeTab]}</div>
          </main>
        </div>
      </div>
    </>
  );
}
