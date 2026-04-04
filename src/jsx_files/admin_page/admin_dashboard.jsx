import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../css_files/admin_page/admin_dashboard.css";

/* ══════════════════════════════════════════════════════════════
   API HELPERS
══════════════════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════════════════
   MODAL WRAPPER
══════════════════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;
  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal-header">
          <h3>{title}</h3>
          <button className="ad-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="ad-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    active: { cls: "ad-badge-active", label: "Active" },
    pending: { cls: "ad-badge-pending", label: "Pending" },
    suspended: { cls: "ad-badge-suspended", label: "Suspended" },
    rejected: { cls: "ad-badge-rejected", label: "Rejected" },
  };
  const { cls, label } = map[status] || {
    cls: "ad-badge-pending",
    label: status,
  };
  return <span className={`ad-status-badge ${cls}`}>{label}</span>;
}

/* ══════════════════════════════════════════════════════════════
   TAB 1 — OVERVIEW
══════════════════════════════════════════════════════════════ */
function OverviewTab() {
  const [stats, setStats] = useState({
    farmers: 0,
    buyers: 0,
    pending: 0,
    crops: 0,
    listings: 0,
    experts: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [s, u] = await Promise.all([
          apiCall("/admin/stats"),
          apiCall("/admin/users?limit=5&sort=createdAt:-1"),
        ]);
        setStats(s);
        setRecentUsers(u.users || []);
      } catch (e) {
        setError(e.message);
        // Fallback demo data
        setStats({
          farmers: 24,
          buyers: 11,
          pending: 3,
          crops: 12,
          listings: 47,
          experts: 8,
        });
        setRecentUsers([
          {
            _id: "1",
            name: "Rahim Uddin",
            role: "farmer",
            status: "pending",
            createdAt: "2026-06-15",
          },
          {
            _id: "2",
            name: "Agro Foods Ltd.",
            role: "business",
            status: "active",
            createdAt: "2026-06-14",
          },
          {
            _id: "3",
            name: "Karim Sheikh",
            role: "farmer",
            status: "active",
            createdAt: "2026-06-13",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const STAT_CARDS = [
    {
      icon: "fa-tractor",
      label: "Farmers",
      value: stats.farmers,
      color: "green",
    },
    {
      icon: "fa-building",
      label: "Buyers",
      value: stats.buyers,
      color: "blue",
    },
    {
      icon: "fa-clock",
      label: "Pending Approval",
      value: stats.pending,
      color: "amber",
    },
    {
      icon: "fa-seedling",
      label: "Crops in Library",
      value: stats.crops,
      color: "teal",
    },
    {
      icon: "fa-store",
      label: "Market Listings",
      value: stats.listings,
      color: "purple",
    },
    {
      icon: "fa-user-graduate",
      label: "Experts",
      value: stats.experts,
      color: "rose",
    },
  ];

  return (
    <div className="ad-tab-content">
      <div className="ad-tab-header">
        <div>
          <h2>Platform Overview</h2>
          <p>Live snapshot of KrishiBondhu activity</p>
        </div>
      </div>

      {error && (
        <div className="ad-notice ad-notice-warn">
          <i className="fa-solid fa-triangle-exclamation" />
          Backend not connected — showing demo data. Connect your server to see
          live data.
        </div>
      )}

      <div className="ad-stat-grid">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className={`ad-stat-card ad-stat-${s.color}`}>
            <div className="ad-stat-icon">
              <i className={`fa-solid ${s.icon}`} />
            </div>
            <div className="ad-stat-val">{loading ? "…" : s.value}</div>
            <div className="ad-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="ad-section-card">
        <div className="ad-section-card-header">
          <h3>
            <i className="fa-solid fa-user-clock" /> Recent Registrations
          </h3>
        </div>
        <table className="ad-table">
          <thead>
            <tr>
              {["Name", "Role", "Status", "Date"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u) => (
              <tr key={u._id}>
                <td className="ad-td-name">{u.name}</td>
                <td>
                  <span className={`ad-role-badge ad-role-${u.role}`}>
                    <i
                      className={`fa-solid ${u.role === "farmer" ? "fa-tractor" : "fa-building"}`}
                    />
                    {u.role}
                  </span>
                </td>
                <td>
                  <StatusBadge status={u.status} />
                </td>
                <td className="ad-td-muted">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-GB")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ad-quick-actions">
        <h3>Quick Actions</h3>
        <div className="ad-qa-grid">
          {[
            {
              icon: "fa-user-check",
              label: "Review Pending Users",
              color: "amber",
              tab: "users",
            },
            {
              icon: "fa-seedling",
              label: "Add New Crop",
              color: "green",
              tab: "crops",
            },
            {
              icon: "fa-user-graduate",
              label: "Add Expert Profile",
              color: "blue",
              tab: "experts",
            },
            {
              icon: "fa-pen-to-square",
              label: "Update Dashboard Content",
              color: "purple",
              tab: "content",
            },
          ].map((a) => (
            <div key={a.label} className={`ad-qa-card ad-qa-${a.color}`}>
              <i className={`fa-solid ${a.icon}`} />
              <span>{a.label}</span>
              <i className="fa-solid fa-arrow-right ad-qa-arrow" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 2 — USERS
══════════════════════════════════════════════════════════════ */
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState("");
  const [viewingDocs, setViewingDocs] = useState(null); // ← এটাই শুধু যোগ করো

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadUsers = async () => {
    try {
      const data = await apiCall("/admin/users");
      setUsers(data.users || []);
    } catch {
      // Demo users for when backend not connected
      setUsers([
        {
          _id: "1",
          name: "Rahim Uddin",
          role: "farmer",
          status: "pending",
          phone: "01712345678",
          email: null,
          division: "Dhaka",
          createdAt: "2026-06-15",
        },
        {
          _id: "2",
          name: "Agro Foods Ltd.",
          role: "business",
          status: "active",
          phone: null,
          email: "agro@foods.com",
          division: "Chattogram",
          createdAt: "2026-06-14",
        },
        {
          _id: "3",
          name: "Karim Sheikh",
          role: "farmer",
          status: "active",
          phone: "01887654321",
          email: null,
          division: "Rajshahi",
          createdAt: "2026-06-13",
        },
        {
          _id: "4",
          name: "Green Harvest Co.",
          role: "business",
          status: "pending",
          phone: null,
          email: "info@greenharvest.com",
          division: "Khulna",
          createdAt: "2026-06-12",
        },
        {
          _id: "5",
          name: "Fatema Begum",
          role: "farmer",
          status: "suspended",
          phone: "01611111111",
          email: null,
          division: "Mymensingh",
          createdAt: "2026-06-10",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAction = async (userId, action) => {
    setActionLoading(userId + action);
    try {
      await apiCall(`/admin/users/${userId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: action }),
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: action } : u)),
      );
      showToast(`User ${action} successfully.`);
    } catch {
      // Demo: update locally
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: action } : u)),
      );
      showToast(`User ${action} (demo mode).`);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").includes(search);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="ad-tab-content">
      {toast && <div className="ad-toast">{toast}</div>}
      <div className="ad-tab-header">
        <div>
          <h2>User Management</h2>
          <p>Approve, suspend, or manage all registered users</p>
        </div>
        <div className="ad-tab-header-stats">
          <span className="ad-inline-stat">
            <strong>
              {users.filter((u) => u.status === "pending").length}
            </strong>{" "}
            pending
          </span>
          <span className="ad-inline-stat">
            <strong>{users.length}</strong> total
          </span>
        </div>
      </div>

      <div className="ad-filters-bar">
        <div className="ad-search-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ad-filter-pills">
          {["all", "farmer", "business"].map((r) => (
            <button
              key={r}
              className={`ad-pill ${roleFilter === r ? "active" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r === "all"
                ? "All Roles"
                : r === "farmer"
                  ? "🌾 Farmers"
                  : "🏢 Buyers"}
            </button>
          ))}
        </div>
        <div className="ad-filter-pills">
          {["all", "active", "pending", "suspended"].map((s) => (
            <button
              key={s}
              className={`ad-pill ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all"
                ? "All Status"
                : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="ad-section-card">
        <table className="ad-table ad-table-users">
          <thead>
            <tr>
              {[
                "Name",
                "Role",
                "Contact",
                "Division",
                "Status",
                "Registered",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="ad-td-loading">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="ad-td-empty">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr
                  key={u._id}
                  className={u.status === "pending" ? "ad-row-highlight" : ""}
                >
                  <td className="ad-td-name">{u.name}</td>
                  <td>
                    <span className={`ad-role-badge ad-role-${u.role}`}>
                      <i
                        className={`fa-solid ${u.role === "farmer" ? "fa-tractor" : "fa-building"}`}
                      />
                      {u.role === "business" ? "Buyer" : "Farmer"}
                    </span>
                  </td>
                  <td className="ad-td-muted">
                    {u.phone ? `+880 ${u.phone}` : u.email || "—"}
                  </td>
                  <td className="ad-td-muted">{u.division || "—"}</td>
                  <td>
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="ad-td-muted">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-GB")
                      : "—"}
                  </td>
                  <td>
                    <div className="ad-action-row">
                      {u.role === "business" && (
                        <button
                          className="ad-btn-action"
                          style={{ background: "#6366f1", color: "white" }}
                          onClick={() => setViewingDocs(u)}
                        >
                          <i className="fa-solid fa-file-shield" /> Docs
                        </button>
                      )}

                      {u.status === "pending" && (
                        <>
                          <button
                            className="ad-btn-action ad-btn-approve"
                            onClick={() => handleAction(u._id, "active")}
                            disabled={actionLoading === u._id + "active"}
                          >
                            <i className="fa-solid fa-check" /> Approve
                          </button>
                          <button
                            className="ad-btn-action ad-btn-reject"
                            onClick={() => handleAction(u._id, "rejected")}
                            disabled={actionLoading === u._id + "rejected"}
                          >
                            <i className="fa-solid fa-xmark" /> Reject
                          </button>
                        </>
                      )}
                      {u.status === "active" && (
                        <button
                          className="ad-btn-action ad-btn-suspend"
                          onClick={() => handleAction(u._id, "suspended")}
                        >
                          <i className="fa-solid fa-ban" /> Suspend
                        </button>
                      )}
                      {(u.status === "suspended" ||
                        u.status === "rejected") && (
                        <button
                          className="ad-btn-action ad-btn-approve"
                          onClick={() => handleAction(u._id, "active")}
                        >
                          <i className="fa-solid fa-arrow-rotate-left" />{" "}
                          Reinstate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal
        open={!!viewingDocs}
        onClose={() => setViewingDocs(null)}
        title={`Documents — ${viewingDocs?.name || ""}`}
      >
        {/* Trade License */}
        {viewingDocs?.documents?.licenseFile?.url ? (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>
              <i className="fa-solid fa-file-contract" /> Trade License
            </p>
            <img
              src={viewingDocs.documents.licenseFile.url}
              alt="Trade License"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </div>
        ) : (
          <p style={{ color: "#999" }}>✗ Trade License upload হয়নি</p>
        )}

        {viewingDocs?.documents?.tinFile?.url ? (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>
              <i className="fa-solid fa-receipt" /> TIN Certificate
            </p>
            <img
              src={viewingDocs.documents.tinFile.url}
              alt="TIN Certificate"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </div>
        ) : (
          <p style={{ color: "#999" }}>✗ TIN Certificate upload হয়নি</p>
        )}

        {viewingDocs?.documents?.extraFile?.url && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>
              <i className="fa-solid fa-file-circle-plus" /> Additional Document
            </p>
            <img
              src={viewingDocs.documents.extraFile.url}
              alt="Additional Document"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button className="ad-btn-ghost" onClick={() => setViewingDocs(null)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 3 — CROP LIBRARY
══════════════════════════════════════════════════════════════ */
const BLANK_CROP = {
  name: "",
  type: "grain",
  season: "kharif",
  region: "",
  period: "",
  desc: "",
  img: "",
  tags: "",
};
const CROP_TYPES = ["grain", "vegetable", "fruit", "cash", "pulse"];
const SEASONS = ["kharif", "rabi", "yearround"];

function CropsTab() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [form, setForm] = useState(BLANK_CROP);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const loadCrops = async () => {
    try {
      const data = await apiCall("/admin/crops");
      setCrops(data.crops || []);
    } catch {
      // Demo data
      setCrops([
        {
          _id: "c1",
          name: "Rice",
          type: "grain",
          season: "kharif",
          region: "All Divisions",
          period: "120–150 days",
          tags: ["Staple", "High Yield"],
          img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=60",
        },
        {
          _id: "c2",
          name: "Wheat",
          type: "grain",
          season: "rabi",
          region: "Rajshahi, Rangpur",
          period: "100–120 days",
          tags: ["Winter", "Cool Climate"],
          img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=60",
        },
        {
          _id: "c3",
          name: "Potato",
          type: "vegetable",
          season: "rabi",
          region: "Munshiganj, Bogura",
          period: "70–90 days",
          tags: ["High Yield", "Export"],
          img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=60",
        },
        {
          _id: "c4",
          name: "Mango",
          type: "fruit",
          season: "kharif",
          region: "Rajshahi, Chapai",
          period: "4–5 months",
          tags: ["Premium", "Export Quality"],
          img: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=60",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const openAdd = () => {
    setEditingCrop(null);
    setForm(BLANK_CROP);
    setModalOpen(true);
  };

  const openEdit = (crop) => {
    setEditingCrop(crop);
    setForm({ ...crop, tags: (crop.tags || []).join(", ") });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.img.trim()) {
      showToast("Crop name and image URL are required.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingCrop) {
        await apiCall(`/admin/crops/${editingCrop._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setCrops((prev) =>
          prev.map((c) =>
            c._id === editingCrop._id ? { ...c, ...payload } : c,
          ),
        );
        showToast("Crop updated successfully.");
      } else {
        const res = await apiCall("/admin/crops", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setCrops((prev) => [
          ...prev,
          res.crop || { ...payload, _id: Date.now().toString() },
        ]);
        showToast("Crop added successfully.");
      }
      setModalOpen(false);
    } catch {
      // Demo: update locally
      if (editingCrop) {
        setCrops((prev) =>
          prev.map((c) =>
            c._id === editingCrop._id ? { ...c, ...payload } : c,
          ),
        );
      } else {
        setCrops((prev) => [
          ...prev,
          { ...payload, _id: Date.now().toString() },
        ]);
      }
      showToast(`Crop ${editingCrop ? "updated" : "added"} (demo mode).`);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiCall(`/admin/crops/${id}`, { method: "DELETE" });
    } catch {
      /* demo */
    }
    setCrops((prev) => prev.filter((c) => c._id !== id));
    setDeleteId(null);
    showToast("Crop deleted.");
  };

  return (
    <div className="ad-tab-content">
      {toast && <div className="ad-toast">{toast}</div>}
      <div className="ad-tab-header">
        <div>
          <h2>Crop Library Management</h2>
          <p>
            Add, edit, or remove crops — changes reflect across all farmer
            dashboards
          </p>
        </div>
        <button className="ad-btn-primary" onClick={openAdd}>
          <i className="fa-solid fa-plus" /> Add Crop
        </button>
      </div>

      <div className="ad-notice ad-notice-info">
        <i className="fa-solid fa-circle-info" />
        Image URLs you enter here replace the images shown in the Crop Explorer
        and farmer recommendation cards. Use direct image URLs (Unsplash,
        Cloudinary, etc.).
      </div>

      {loading ? (
        <div className="ad-loading-state">Loading crops…</div>
      ) : (
        <div className="ad-crop-grid">
          {crops.map((crop) => (
            <div key={crop._id} className="ad-crop-card">
              <div className="ad-crop-card-img-wrap">
                <img
                  src={crop.img}
                  alt={crop.name}
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x160?text=No+Image")
                  }
                />
                <span className={`ad-crop-type-tag ad-ct-${crop.type}`}>
                  {crop.type}
                </span>
              </div>
              <div className="ad-crop-card-body">
                <div className="ad-crop-card-name">{crop.name}</div>
                <div className="ad-crop-card-meta">
                  <span>
                    <i className="fa-solid fa-sun" /> {crop.season}
                  </span>
                  <span>
                    <i className="fa-solid fa-location-dot" /> {crop.region}
                  </span>
                </div>
                <div className="ad-crop-card-tags">
                  {(crop.tags || []).slice(0, 2).map((t) => (
                    <span key={t} className="ad-crop-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ad-crop-card-actions">
                <button className="ad-btn-edit" onClick={() => openEdit(crop)}>
                  <i className="fa-solid fa-pen" /> Edit
                </button>
                <button
                  className="ad-btn-delete"
                  onClick={() => setDeleteId(crop._id)}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCrop ? `Edit: ${editingCrop.name}` : "Add New Crop"}
      >
        <div className="ad-form-grid">
          <div className="ad-form-group ad-fg-full">
            <label>Crop Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              placeholder="e.g. Rice"
            />
          </div>
          <div className="ad-form-group">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => upd("type", e.target.value)}
            >
              {CROP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="ad-form-group">
            <label>Season</label>
            <select
              value={form.season}
              onChange={(e) => upd("season", e.target.value)}
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="ad-form-group">
            <label>Region / Divisions</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => upd("region", e.target.value)}
              placeholder="e.g. Rajshahi, Dhaka"
            />
          </div>
          <div className="ad-form-group">
            <label>Growing Period</label>
            <input
              type="text"
              value={form.period}
              onChange={(e) => upd("period", e.target.value)}
              placeholder="e.g. 120–150 days"
            />
          </div>
          <div className="ad-form-group ad-fg-full">
            <label>
              Image URL *{" "}
              <span className="ad-label-hint">(direct link to crop photo)</span>
            </label>
            <input
              type="url"
              value={form.img}
              onChange={(e) => upd("img", e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="ad-img-preview"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
          <div className="ad-form-group ad-fg-full">
            <label>Description</label>
            <textarea
              value={form.desc}
              onChange={(e) => upd("desc", e.target.value)}
              placeholder="Brief description of the crop…"
              rows={3}
            />
          </div>
          <div className="ad-form-group ad-fg-full">
            <label>
              Tags <span className="ad-label-hint">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => upd("tags", e.target.value)}
              placeholder="e.g. High Yield, Export, Staple"
            />
          </div>
        </div>
        <div className="ad-modal-footer">
          <button className="ad-btn-ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button
            className="ad-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Saving…
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Save Crop
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
      >
        <p style={{ marginBottom: 20 }}>
          Are you sure you want to delete this crop? This will remove it from
          the crop library and farmer recommendations.
        </p>
        <div className="ad-modal-footer">
          <button className="ad-btn-ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </button>
          <button
            className="ad-btn-danger"
            onClick={() => handleDelete(deleteId)}
          >
            <i className="fa-solid fa-trash" /> Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 4 — MARKETPLACE
══════════════════════════════════════════════════════════════ */
const BLANK_LISTING = {
  crop: "",
  farmer: "",
  location: "",
  qty: "",
  price: "",
  img: "",
  featured: false,
};

function MarketplaceTab() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [form, setForm] = useState(BLANK_LISTING);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const data = await apiCall("/admin/marketplace");
        setListings(data.listings || []);
      } catch {
        setListings([
          {
            _id: "l1",
            crop: "Rice (Boro)",
            farmer: "Rahim Uddin",
            location: "Gazipur",
            qty: "12T",
            price: 48,
            img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=400&q=60",
            featured: true,
            status: "active",
          },
          {
            _id: "l2",
            crop: "Red Lentil",
            farmer: "Karim Sheikh",
            location: "Comilla",
            qty: "3T",
            price: 110,
            img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=400&q=60",
            featured: false,
            status: "active",
          },
          {
            _id: "l3",
            crop: "Potato",
            farmer: "Fatema Begum",
            location: "Munshiganj",
            qty: "22T",
            price: 32,
            img: "https://images.unsplash.com/photo-1553978297-833b17d9f0e0?auto=format&fit=crop&w=400&q=60",
            featured: true,
            status: "active",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFeatured = async (id) => {
    setListings((prev) =>
      prev.map((l) => (l._id === id ? { ...l, featured: !l.featured } : l)),
    );
    try {
      const l = listings.find((x) => x._id === id);
      await apiCall(`/admin/marketplace/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ featured: !l.featured }),
      });
      showToast("Listing updated.");
    } catch {
      showToast("Updated (demo mode).");
    }
  };

  const handleSave = async () => {
    if (!form.crop || !form.farmer || !form.price) {
      showToast("Crop name, farmer and price are required.");
      return;
    }
    setSaving(true);
    try {
      if (editingListing) {
        await apiCall(`/admin/marketplace/${editingListing._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setListings((prev) =>
          prev.map((l) =>
            l._id === editingListing._id ? { ...l, ...form } : l,
          ),
        );
      } else {
        const res = await apiCall("/admin/marketplace", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setListings((prev) => [
          ...prev,
          res.listing || { ...form, _id: Date.now().toString() },
        ]);
      }
      showToast(`Listing ${editingListing ? "updated" : "added"}.`);
      setModalOpen(false);
    } catch {
      if (editingListing) {
        setListings((prev) =>
          prev.map((l) =>
            l._id === editingListing._id ? { ...l, ...form } : l,
          ),
        );
      } else {
        setListings((prev) => [
          ...prev,
          { ...form, _id: Date.now().toString(), status: "active" },
        ]);
      }
      showToast(`Listing ${editingListing ? "updated" : "added"} (demo mode).`);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await apiCall(`/admin/marketplace/${id}`, { method: "DELETE" });
    } catch {
      /* demo */
    }
    setListings((prev) => prev.filter((l) => l._id !== id));
    showToast("Listing removed.");
  };

  return (
    <div className="ad-tab-content">
      {toast && <div className="ad-toast">{toast}</div>}
      <div className="ad-tab-header">
        <div>
          <h2>Marketplace Management</h2>
          <p>Control listings shown to buyers — feature or remove items</p>
        </div>
        <button
          className="ad-btn-primary"
          onClick={() => {
            setEditingListing(null);
            setForm(BLANK_LISTING);
            setModalOpen(true);
          }}
        >
          <i className="fa-solid fa-plus" /> Add Listing
        </button>
      </div>

      <div className="ad-section-card">
        <table className="ad-table">
          <thead>
            <tr>
              {[
                "Image",
                "Crop",
                "Farmer",
                "Location",
                "Qty",
                "Price/kg",
                "Featured",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="ad-td-loading">
                  Loading listings…
                </td>
              </tr>
            ) : (
              listings.map((l) => (
                <tr key={l._id}>
                  <td>
                    {l.img && (
                      <img
                        src={l.img}
                        alt={l.crop}
                        className="ad-table-thumb"
                      />
                    )}
                  </td>
                  <td className="ad-td-name">{l.crop}</td>
                  <td className="ad-td-muted">{l.farmer}</td>
                  <td className="ad-td-muted">{l.location}</td>
                  <td className="ad-td-muted">{l.qty}</td>
                  <td className="ad-td-price">৳{l.price}</td>
                  <td>
                    <button
                      className={`ad-toggle-btn ${l.featured ? "ad-toggle-on" : ""}`}
                      onClick={() => toggleFeatured(l._id)}
                    >
                      <i
                        className={`fa-solid ${l.featured ? "fa-star" : "fa-star-half-stroke"}`}
                      />
                      {l.featured ? "Featured" : "Normal"}
                    </button>
                  </td>
                  <td>
                    <div className="ad-action-row">
                      <button
                        className="ad-btn-edit"
                        onClick={() => {
                          setEditingListing(l);
                          setForm({ ...l });
                          setModalOpen(true);
                        }}
                      >
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button
                        className="ad-btn-delete"
                        onClick={() => handleRemove(l._id)}
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingListing ? "Edit Listing" : "Add Marketplace Listing"}
      >
        <div className="ad-form-grid">
          <div className="ad-form-group">
            <label>Crop Name *</label>
            <input
              type="text"
              value={form.crop}
              onChange={(e) => upd("crop", e.target.value)}
              placeholder="e.g. Rice (Boro)"
            />
          </div>
          <div className="ad-form-group">
            <label>Farmer Name *</label>
            <input
              type="text"
              value={form.farmer}
              onChange={(e) => upd("farmer", e.target.value)}
              placeholder="Farmer's name"
            />
          </div>
          <div className="ad-form-group">
            <label>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => upd("location", e.target.value)}
              placeholder="e.g. Gazipur"
            />
          </div>
          <div className="ad-form-group">
            <label>Quantity Available</label>
            <input
              type="text"
              value={form.qty}
              onChange={(e) => upd("qty", e.target.value)}
              placeholder="e.g. 12T avail."
            />
          </div>
          <div className="ad-form-group">
            <label>Price per kg (৳) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => upd("price", e.target.value)}
              placeholder="e.g. 48"
            />
          </div>
          <div className="ad-form-group ad-fg-full">
            <label>Image URL</label>
            <input
              type="url"
              value={form.img}
              onChange={(e) => upd("img", e.target.value)}
              placeholder="https://..."
            />
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="ad-img-preview"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
          <div className="ad-form-group ad-fg-full">
            <label className="ad-checkbox-label">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => upd("featured", e.target.checked)}
              />
              Mark as Featured (shown prominently to buyers)
            </label>
          </div>
        </div>
        <div className="ad-modal-footer">
          <button className="ad-btn-ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button
            className="ad-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              "Saving…"
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Save Listing
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 5 — AGRICULTURAL EXPERTS
══════════════════════════════════════════════════════════════ */
const BLANK_EXPERT = {
  name: "",
  specialty: "",
  bio: "",
  phone: "",
  email: "",
  img: "",
  institution: "",
  experience: "",
  available: true,
};

function ExpertsTab() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [form, setForm] = useState(BLANK_EXPERT);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    (async () => {
      try {
        const data = await apiCall("/admin/experts");
        setExperts(data.experts || []);
      } catch {
        setExperts([
          {
            _id: "e1",
            name: "Dr. Anisur Rahman",
            specialty: "Rice Cultivation & Pest Management",
            institution: "BRRI Gazipur",
            experience: "18 years",
            phone: "01712000001",
            email: "anis@brri.gov.bd",
            available: true,
            img: "",
          },
          {
            _id: "e2",
            name: "Prof. Sumaiya Khanam",
            specialty: "Soil Science & Fertilizer",
            institution: "BAU Mymensingh",
            experience: "12 years",
            phone: "01755000002",
            email: "sumaiya@bau.edu.bd",
            available: true,
            img: "",
          },
          {
            _id: "e3",
            name: "Md. Jahed Hossain",
            specialty: "Vegetable Farming & Post-Harvest",
            institution: "DAE Extension",
            experience: "9 years",
            phone: "01812000003",
            email: "jahed@dae.gov.bd",
            available: false,
            img: "",
          },
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.specialty) {
      showToast("Name and specialty are required.");
      return;
    }
    setSaving(true);
    try {
      if (editingExpert) {
        await apiCall(`/admin/experts/${editingExpert._id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setExperts((prev) =>
          prev.map((e) =>
            e._id === editingExpert._id ? { ...e, ...form } : e,
          ),
        );
      } else {
        const res = await apiCall("/admin/experts", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setExperts((prev) => [
          ...prev,
          res.expert || { ...form, _id: Date.now().toString() },
        ]);
      }
      showToast(`Expert ${editingExpert ? "updated" : "added"}.`);
      setModalOpen(false);
    } catch {
      if (editingExpert) {
        setExperts((prev) =>
          prev.map((e) =>
            e._id === editingExpert._id ? { ...e, ...form } : e,
          ),
        );
      } else {
        setExperts((prev) => [
          ...prev,
          { ...form, _id: Date.now().toString() },
        ]);
      }
      showToast(`Expert ${editingExpert ? "updated" : "added"} (demo mode).`);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiCall(`/admin/experts/${id}`, { method: "DELETE" });
    } catch {
      /* demo */
    }
    setExperts((prev) => prev.filter((e) => e._id !== id));
    showToast("Expert removed.");
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="ad-tab-content">
      {toast && <div className="ad-toast">{toast}</div>}
      <div className="ad-tab-header">
        <div>
          <h2>Agricultural Experts</h2>
          <p>Manage the expert directory shown to farmers for consultation</p>
        </div>
        <button
          className="ad-btn-primary"
          onClick={() => {
            setEditingExpert(null);
            setForm(BLANK_EXPERT);
            setModalOpen(true);
          }}
        >
          <i className="fa-solid fa-plus" /> Add Expert
        </button>
      </div>

      {loading ? (
        <div className="ad-loading-state">Loading experts…</div>
      ) : (
        <div className="ad-expert-grid">
          {experts.map((e) => (
            <div key={e._id} className="ad-expert-card">
              <div className="ad-expert-avatar">
                {e.img ? (
                  <img src={e.img} alt={e.name} />
                ) : (
                  <div className="ad-expert-initials">
                    {getInitials(e.name)}
                  </div>
                )}
                <span
                  className={`ad-avail-dot ${e.available ? "ad-avail-yes" : "ad-avail-no"}`}
                />
              </div>
              <div className="ad-expert-info">
                <div className="ad-expert-name">{e.name}</div>
                <div className="ad-expert-specialty">{e.specialty}</div>
                <div className="ad-expert-inst">
                  <i className="fa-solid fa-building-columns" /> {e.institution}
                </div>
                <div className="ad-expert-exp">
                  <i className="fa-solid fa-clock" /> {e.experience}
                </div>
                <div
                  className={`ad-avail-label ${e.available ? "ad-avail-yes" : "ad-avail-no"}`}
                >
                  {e.available
                    ? "Available for consultation"
                    : "Currently unavailable"}
                </div>
              </div>
              <div className="ad-expert-actions">
                <button
                  className="ad-btn-edit"
                  onClick={() => {
                    setEditingExpert(e);
                    setForm({ ...e });
                    setModalOpen(true);
                  }}
                >
                  <i className="fa-solid fa-pen" /> Edit
                </button>
                <button
                  className="ad-btn-delete"
                  onClick={() => handleDelete(e._id)}
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingExpert
            ? `Edit: ${editingExpert.name}`
            : "Add Agricultural Expert"
        }
      >
        <div className="ad-form-grid">
          <div className="ad-form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => upd("name", e.target.value)}
              placeholder="Dr. / Prof. / Md."
            />
          </div>
          <div className="ad-form-group">
            <label>Specialty *</label>
            <input
              type="text"
              value={form.specialty}
              onChange={(e) => upd("specialty", e.target.value)}
              placeholder="e.g. Rice Cultivation & Pest Management"
            />
          </div>
          <div className="ad-form-group">
            <label>Institution</label>
            <input
              type="text"
              value={form.institution}
              onChange={(e) => upd("institution", e.target.value)}
              placeholder="e.g. BRRI, BAU, DAE"
            />
          </div>
          <div className="ad-form-group">
            <label>Years of Experience</label>
            <input
              type="text"
              value={form.experience}
              onChange={(e) => upd("experience", e.target.value)}
              placeholder="e.g. 12 years"
            />
          </div>
          <div className="ad-form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => upd("phone", e.target.value)}
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div className="ad-form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => upd("email", e.target.value)}
              placeholder="expert@institution.bd"
            />
          </div>
          <div className="ad-form-group ad-fg-full">
            <label>
              Profile Photo URL{" "}
              <span className="ad-label-hint">(optional)</span>
            </label>
            <input
              type="url"
              value={form.img}
              onChange={(e) => upd("img", e.target.value)}
              placeholder="https://..."
            />
            {form.img && (
              <img
                src={form.img}
                alt="preview"
                className="ad-img-preview ad-img-round"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
          <div className="ad-form-group ad-fg-full">
            <label>Short Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => upd("bio", e.target.value)}
              rows={3}
              placeholder="Brief expert bio…"
            />
          </div>
          <div className="ad-form-group ad-fg-full">
            <label className="ad-checkbox-label">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => upd("available", e.target.checked)}
              />
              Currently available for farmer consultations
            </label>
          </div>
        </div>
        <div className="ad-modal-footer">
          <button className="ad-btn-ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </button>
          <button
            className="ad-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              "Saving…"
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk" /> Save Expert
              </>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TAB 6 — CONTENT BLOCKS
   Controls: Dashboard hero images, alert banners, advisory text
══════════════════════════════════════════════════════════════ */
const DEFAULT_BLOCKS = [
  {
    key: "farmer_hero_img",
    label: "Farmer Dashboard — Hero Image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    desc: "The main rice field photo on the farmer dashboard hero section.",
  },
  {
    key: "buyer_hero_img",
    label: "Buyer Dashboard — Hero Image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    desc: "The market photo on the buyer dashboard hero section.",
  },
  {
    key: "farmer_alert_text",
    label: "Farmer Dashboard — Alert Banner",
    type: "text",
    value:
      "Warning: Stem borer activity reported in nearby Gazipur fields. Inspect crop edges and apply chlorpyrifos if infestation exceeds 5% of plants.",
    desc: "The orange warning banner shown to farmers on the dashboard.",
  },
  {
    key: "buyer_alert_text",
    label: "Buyer Dashboard — Market Notice",
    type: "text",
    value:
      "Market Notice: Rice (Boro) prices expected to rise 3–5% next week due to Aman season shortfall. Consider locking in bulk pricing with verified farmers now.",
    desc: "The info banner shown to buyers on the dashboard.",
  },
  {
    key: "crop_suggest_img_1",
    label: "Farmer Crop Suggestion — Card 1 Image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
    desc: "Image for the first AI crop suggestion card (Red Lentil).",
  },
  {
    key: "crop_suggest_img_2",
    label: "Farmer Crop Suggestion — Card 2 Image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80",
    desc: "Image for the second AI crop suggestion card (Potato).",
  },
  {
    key: "crop_suggest_img_3",
    label: "Farmer Crop Suggestion — Card 3 Image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80",
    desc: "Image for the third AI crop suggestion card (Wheat).",
  },
  {
    key: "homepage_hero_img",
    label: "Home Page — Hero/Background Image",
    type: "image",
    value: "",
    desc: "The main background image on the public home page (if applicable).",
  },
];

function ContentTab() {
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS.map((b) => ({ ...b })));
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await apiCall("/admin/content");
        if (data.blocks) {
          setBlocks((prev) =>
            prev.map((b) => {
              const found = data.blocks.find((db) => db.key === b.key);
              return found ? { ...b, value: found.value } : b;
            }),
          );
        }
      } catch {
        /* use defaults */
      }
    })();
  }, []);

  const handleUpdate = async (key) => {
    const block = blocks.find((b) => b.key === key);
    setSaving(key);
    try {
      await apiCall(`/admin/content/${key}`, {
        method: "PUT",
        body: JSON.stringify({ value: block.value }),
      });
      showToast("Content updated successfully.");
    } catch {
      showToast("Updated (demo mode — connect backend to persist).");
    } finally {
      setSaving(null);
    }
  };

  const updateBlock = (key, value) => {
    setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, value } : b)));
  };

  const imageBlocks = blocks.filter((b) => b.type === "image");
  const textBlocks = blocks.filter((b) => b.type === "text");

  return (
    <div className="ad-tab-content">
      {toast && <div className="ad-toast">{toast}</div>}
      <div className="ad-tab-header">
        <div>
          <h2>Content Management</h2>
          <p>Update images and text shown in farmer and buyer dashboards</p>
        </div>
      </div>

      <div className="ad-notice ad-notice-info">
        <i className="fa-solid fa-circle-info" />
        Changes here update the images and announcements shown in the farmer and
        buyer dashboards. Image fields accept any direct URL (Unsplash,
        Cloudinary, S3, etc.). Text fields update alert banners and notices.
      </div>

      <h3 className="ad-content-section-title">
        <i className="fa-solid fa-image" /> Dashboard Images
      </h3>
      <div className="ad-content-blocks">
        {imageBlocks.map((block) => (
          <div key={block.key} className="ad-content-block">
            <div className="ad-content-block-meta">
              <div className="ad-content-block-label">{block.label}</div>
              <div className="ad-content-block-desc">{block.desc}</div>
            </div>
            <div className="ad-content-block-editor">
              <div className="ad-content-img-row">
                {block.value && (
                  <div className="ad-content-img-preview">
                    <img
                      src={block.value}
                      alt="current"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="ad-current-label">Current</span>
                  </div>
                )}
                <div className="ad-content-input-col">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={block.value}
                    onChange={(e) => updateBlock(block.key, e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <button
                className="ad-btn-primary ad-btn-sm"
                onClick={() => handleUpdate(block.key)}
                disabled={saving === block.key}
              >
                {saving === block.key ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" /> Updating…
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk" /> Update Image
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="ad-content-section-title">
        <i className="fa-solid fa-bullhorn" /> Alert Banners & Announcements
      </h3>
      <div className="ad-content-blocks">
        {textBlocks.map((block) => (
          <div key={block.key} className="ad-content-block">
            <div className="ad-content-block-meta">
              <div className="ad-content-block-label">{block.label}</div>
              <div className="ad-content-block-desc">{block.desc}</div>
            </div>
            <div className="ad-content-block-editor">
              <textarea
                value={block.value}
                onChange={(e) => updateBlock(block.key, e.target.value)}
                rows={3}
              />
              <button
                className="ad-btn-primary ad-btn-sm"
                onClick={() => handleUpdate(block.key)}
                disabled={saving === block.key}
              >
                {saving === block.key ? (
                  "Updating…"
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk" /> Update Text
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "overview", icon: "fa-chart-pie", label: "Overview" },
  { id: "users", icon: "fa-users", label: "Users" },
  { id: "crops", icon: "fa-seedling", label: "Crop Library" },
  { id: "marketplace", icon: "fa-store", label: "Marketplace" },
  { id: "experts", icon: "fa-user-graduate", label: "Experts" },
  { id: "content", icon: "fa-pen-to-square", label: "Content" },
];

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabComponents = {
    overview: <OverviewTab />,
    users: <UsersTab />,
    crops: <CropsTab />,
    marketplace: <MarketplaceTab />,
    experts: <ExpertsTab />,
    content: <ContentTab />,
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <div className="ad-root">
        {/* ── SIDEBAR ── */}
        <nav className="ad-sidebar">
          <div className="ad-sidebar-brand">
            <i className="fa-solid fa-leaf" />
            <span>KrishiBondhu</span>
            <span className="ad-brand-tag">Admin</span>
          </div>

          <div className="ad-sidebar-nav">
            <div className="ad-nav-label">Control Panel</div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`ad-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <i className={`fa-solid ${item.icon}`} />
                <span>{item.label}</span>
                {item.id === "users" && <span className="ad-nav-dot" />}
              </button>
            ))}
          </div>

          <div className="ad-sidebar-footer">
            <div className="ad-sidebar-user">
              <div className="ad-sidebar-avatar">A</div>
              <div>
                <div className="ad-sidebar-uname">{user?.name || "Admin"}</div>
                <div className="ad-sidebar-urole">System Administrator</div>
              </div>
            </div>
            <button className="ad-logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket" /> Logout
            </button>
          </div>
        </nav>

        {/* ── MAIN ── */}
        <div className="ad-main-wrap">
          {/* Topbar */}
          <div className="ad-topbar">
            <div className="ad-topbar-left">
              <div className="ad-topbar-title">
                {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </div>
              <div className="ad-topbar-breadcrumb">
                Admin / {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
              </div>
            </div>
            <div className="ad-topbar-right">
              <div className="ad-topbar-time">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="ad-topbar-badge">
                <i className="fa-solid fa-shield-halved" /> Secure Session
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="ad-page-content">{tabComponents[activeTab]}</div>
        </div>
      </div>
    </>
  );
}
