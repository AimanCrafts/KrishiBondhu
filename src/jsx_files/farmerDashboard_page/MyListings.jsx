// src/jsx_files/farmerDashboard_page/MyListings.jsx
// Full-page crop listing manager — accessible from farmer sidebar

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../../components/NotificationBell";
import "../../css_files/farmerDashboard_page/MyListings.css";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CROP_SUGGESTIONS = [
  "Rice (Boro)",
  "Rice (Aman)",
  "Rice (Aus)",
  "Wheat",
  "Potato",
  "Onion",
  "Garlic",
  "Tomato",
  "Brinjal",
  "Cauliflower",
  "Cabbage",
  "Spinach",
  "Bitter Gourd",
  "Bottle Gourd",
  "Pumpkin",
  "Banana",
  "Mango",
  "Papaya",
  "Lentil",
  "Mustard",
  "Jute",
  "Sugarcane",
  "Maize",
  "Chilli",
  "Ginger",
  "Turmeric",
];

const UNIT_OPTIONS = ["kg", "quintal", "ton", "maund", "piece", "dozen"];

export default function MyListings() {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

  const [farmerStatus, setFarmerStatus] = useState(null);
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    crop: "",
    qty: "",
    unit: "kg",
    price: "",
    location: "",
    img: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [cropSuggestions, setCropSuggestions] = useState([]);

  const token = localStorage.getItem("kb_token");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  // Fetch farmer status
  const fetchStatus = () => {
    if (!token) return;
    setFarmerStatus(null);
    fetch(`${API}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setFarmerStatus(data.user?.status || "pending"))
      .catch(() => setFarmerStatus("pending"));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Load listings
  const loadListings = () => {
    setListingsLoading(true);
    fetch(`${API}/api/user/listings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setListings(data.listings || []))
      .catch(() => setListings([]))
      .finally(() => setListingsLoading(false));
  };

  useEffect(() => {
    if (farmerStatus === "active") loadListings();
  }, [farmerStatus]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === "crop" && value.length > 0) {
      setCropSuggestions(
        CROP_SUGGESTIONS.filter((c) =>
          c.toLowerCase().includes(value.toLowerCase()),
        ).slice(0, 5),
      );
    } else if (name === "crop") {
      setCropSuggestions([]);
    }
  };

  const resetForm = () => {
    setForm({
      crop: "",
      qty: "",
      unit: "kg",
      price: "",
      location: "",
      img: "",
      description: "",
    });
    setFormError("");
    setFormSuccess("");
    setEditingId(null);
    setCropSuggestions([]);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (listing) => {
    setForm({
      crop: listing.crop || "",
      qty: listing.qty || "",
      unit: listing.unit || "kg",
      price: listing.price || "",
      location: listing.location || "",
      img: listing.img || "",
      description: listing.description || "",
    });
    setEditingId(listing._id);
    setFormError("");
    setFormSuccess("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!form.crop.trim()) return setFormError("Crop name is required.");
    if (!form.price || Number(form.price) <= 0)
      return setFormError("Please enter a valid price.");

    setSubmitting(true);
    try {
      const url = editingId
        ? `${API}/api/user/listings/${editingId}`
        : `${API}/api/user/listings`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          crop: form.crop,
          qty: form.qty,
          unit: form.unit,
          price: Number(form.price),
          location: form.location,
          img: form.img,
          description: form.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setFormSuccess(
        editingId
          ? "✅ Listing updated successfully!"
          : "✅ Crop listed on Marketplace!",
      );
      resetForm();
      setShowForm(false);
      loadListings();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?"))
      return;
    try {
      const res = await fetch(`${API}/api/user/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      loadListings();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`${API}/api/user/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      loadListings();
    } catch (err) {
      alert("Status update failed: " + err.message);
    }
  };

  const handleLogout = () => {
    authLogout();
    navigate("/login", { replace: true });
  };

  // Filtered listings
  const filteredListings = listings.filter((l) => {
    const matchesStatus = filterStatus === "all" || l.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      l.crop?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    inactive: listings.filter((l) => l.status !== "active").length,
  };

  if (!user) return null;

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "F";
  const locationStr = user?.profile
    ? `${user.profile.district || ""}, ${user.profile.division || ""}`
    : "Bangladesh";

  // ── Pending/Blocked State ─────────────────────────────────────
  if (farmerStatus !== null && farmerStatus !== "active") {
    return (
      <div className="ml-root">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <nav className="ml-topbar">
          <a
            className="ml-brand"
            onClick={() => navigate("/farmer_dashboard")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-leaf" />
            <span className="k">Krishi</span>
            <span className="b">Bondhu</span>
          </a>
          <div className="ml-top-right">
            <button
              className="ml-menu-btn"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </nav>
        <div className="ml-blocked-wrap">
          <div className="ml-blocked-card">
            <i className="fa-solid fa-clock ml-blocked-icon" />
            <h2>Account Not Yet Active</h2>
            <p>
              Your account is pending admin approval. Once approved, you can
              list crops on the Marketplace.
            </p>
            <button className="ml-btn-primary" onClick={fetchStatus}>
              <i className="fa-solid fa-rotate-right" /> Check Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div className="ml-root">
        {/* ── TOPBAR ─────────────────────────────────── */}
        <nav className="ml-topbar">
          <a className="ml-brand" onClick={() => navigate("/farmer_dashboard")}>
            <i className="fa-solid fa-leaf" />
            <span className="ml-krishi">Krishi</span>Bondhu
          </a>
          <div className="ml-top-right">
            <button
              className="ml-menu-btn"
              onClick={() => setSidebarOpen((p) => !p)}
            >
              <i className="fa-solid fa-bars" />
            </button>
          </div>
        </nav>

        {/* ── SIDEBAR OVERLAY ────────────────────────── */}
        <div
          className={`ml-sidebar-overlay${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── SIDEBAR ────────────────────────────────── */}
        <nav className={`ml-sidebar${sidebarOpen ? " open" : ""}`}>
          <span className="ml-sidebar-label">Navigation</span>
          <a
            onClick={() => navigate("/farmer_dashboard")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-house" /> Dashboard
          </a>
          <a className="active" style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-store" /> My Listings
          </a>
          <a
            onClick={() => navigate("/crop_library")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-seedling" /> Crop Library
          </a>
          <a
            onClick={() => navigate("/crop_disease")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-bug" /> Pest &amp; Disease
          </a>
          <span className="ml-sidebar-label">Tools</span>
          <a href="#">
            <i className="fa-solid fa-chart-line" /> Market Prices
          </a>
          <a href="#">
            <i className="fa-solid fa-file-alt" /> Crop History
          </a>
          <a
            onClick={() => navigate("/consult-expert")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-user-pen" /> Consult Expert
          </a>
          <a
            onClick={() => navigate("/settings")}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-gear" /> Settings
          </a>
          <span className="ml-sidebar-label">Account</span>
          <a
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "#e53935" }}
          >
            <i
              className="fa-solid fa-right-from-bracket"
              style={{ color: "#e53935" }}
            />{" "}
            Logout
          </a>
        </nav>

        {/* ── MAIN ───────────────────────────────────── */}
        <main className="ml-main">
          {/* ── PAGE HEADER ──────────────────────────── */}
          <div className="ml-page-header">
            <div className="ml-page-header-left">
              <h1 className="ml-page-title">
                <i className="fa-solid fa-store" /> My Crop Listings
              </h1>
              <p className="ml-page-sub">
                Manage all your crops listed on the KrishiBondhu Marketplace.
              </p>
            </div>
            <button className="ml-btn-primary ml-add-btn" onClick={openAddForm}>
              <i className="fa-solid fa-plus" /> Add New Listing
            </button>
          </div>

          {/* ── SUCCESS BANNER ───────────────────────── */}
          {formSuccess && (
            <div className="ml-success-banner">
              <i className="fa-solid fa-circle-check" /> {formSuccess}
              <button onClick={() => setFormSuccess("")}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
          )}

          {/* ── STATS CARDS ──────────────────────────── */}
          <div className="ml-stats-row">
            <div className="ml-stat-card">
              <div className="ml-stat-icon total">
                <i className="fa-solid fa-list" />
              </div>
              <div>
                <div className="ml-stat-val">{stats.total}</div>
                <div className="ml-stat-lbl">Total Listings</div>
              </div>
            </div>
            <div className="ml-stat-card">
              <div className="ml-stat-icon active">
                <i className="fa-solid fa-circle-check" />
              </div>
              <div>
                <div className="ml-stat-val">{stats.active}</div>
                <div className="ml-stat-lbl">Active</div>
              </div>
            </div>
            <div className="ml-stat-card">
              <div className="ml-stat-icon inactive">
                <i className="fa-solid fa-circle-pause" />
              </div>
              <div>
                <div className="ml-stat-val">{stats.inactive}</div>
                <div className="ml-stat-lbl">Inactive</div>
              </div>
            </div>
          </div>

          {/* ── ADD / EDIT FORM ──────────────────────── */}
          {showForm && (
            <div className="ml-form-card">
              <div className="ml-form-header">
                <h2>
                  <i
                    className={`fa-solid ${editingId ? "fa-pen" : "fa-plus-circle"}`}
                  />
                  {editingId ? " Edit Listing" : " Add New Crop Listing"}
                </h2>
                <button
                  className="ml-form-close"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <form className="ml-form" onSubmit={handleSubmit}>
                {/* Row 1: Crop name + quantity + unit */}
                <div className="ml-form-row">
                  <div className="ml-form-group ml-crop-group">
                    <label>Crop Name *</label>
                    <input
                      name="crop"
                      value={form.crop}
                      onChange={handleChange}
                      placeholder="e.g. Rice, Potato, Onion"
                      autoComplete="off"
                      required
                    />
                    {cropSuggestions.length > 0 && (
                      <ul className="ml-crop-suggestions">
                        {cropSuggestions.map((s) => (
                          <li
                            key={s}
                            onClick={() => {
                              setForm((p) => ({ ...p, crop: s }));
                              setCropSuggestions([]);
                            }}
                          >
                            <i className="fa-solid fa-seedling" /> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="ml-form-group">
                    <label>Quantity Available</label>
                    <input
                      name="qty"
                      value={form.qty}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="ml-form-group ml-unit-group">
                    <label>Unit</label>
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Price + Location */}
                <div className="ml-form-row">
                  <div className="ml-form-group">
                    <label>Price per {form.unit} (BDT) *</label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="e.g. 45"
                      type="number"
                      min="1"
                      required
                    />
                  </div>
                  <div className="ml-form-group">
                    <label>Location (District)</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Rajshahi, Bogura"
                    />
                  </div>
                </div>

                {/* Row 3: Image URL */}
                <div className="ml-form-row">
                  <div className="ml-form-group ml-full-width">
                    <label>Crop Image URL (optional)</label>
                    <input
                      name="img"
                      value={form.img}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Row 4: Description */}
                <div className="ml-form-row">
                  <div className="ml-form-group ml-full-width">
                    <label>Description (optional)</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe your crop quality, harvest date, organic/non-organic, storage conditions, etc."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Errors */}
                {formError && (
                  <div className="ml-form-error">
                    <i className="fa-solid fa-triangle-exclamation" />{" "}
                    {formError}
                  </div>
                )}

                {/* Actions */}
                <div className="ml-form-actions">
                  <button
                    type="button"
                    className="ml-btn-outline"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-btn-primary"
                    disabled={submitting}
                  >
                    <i
                      className={`fa-solid ${submitting ? "fa-spinner fa-spin" : editingId ? "fa-check" : "fa-paper-plane"}`}
                    />
                    {submitting
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Publish Listing"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── LISTINGS TABLE ───────────────────────── */}
          <div className="ml-listings-card">
            <div className="ml-listings-toolbar">
              <div className="ml-search-wrap">
                <i className="fa-solid fa-magnifying-glass" />
                <input
                  type="text"
                  placeholder="Search by crop or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")}>
                    <i className="fa-solid fa-xmark" />
                  </button>
                )}
              </div>
              <div className="ml-filter-tabs">
                {["all", "active", "inactive"].map((s) => (
                  <button
                    key={s}
                    className={`ml-filter-tab${filterStatus === s ? " active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === "all"
                      ? "All"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                    <span className="ml-tab-count">
                      {s === "all"
                        ? listings.length
                        : s === "active"
                          ? stats.active
                          : stats.inactive}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {listingsLoading && (
              <div className="ml-loading">
                <i className="fa-solid fa-spinner fa-spin" /> Loading your
                listings...
              </div>
            )}

            {/* Empty state */}
            {!listingsLoading && filteredListings.length === 0 && (
              <div className="ml-empty">
                <div className="ml-empty-icon">🌾</div>
                <h3>
                  {listings.length === 0
                    ? "No listings yet"
                    : "No listings match your filter"}
                </h3>
                <p>
                  {listings.length === 0
                    ? "Click 'Add New Listing' to put your first crop on the Marketplace."
                    : "Try changing the filter or search term."}
                </p>
                {listings.length === 0 && (
                  <button className="ml-btn-primary" onClick={openAddForm}>
                    <i className="fa-solid fa-plus" /> Add Your First Crop
                  </button>
                )}
              </div>
            )}

            {/* Listings Grid */}
            {!listingsLoading && filteredListings.length > 0 && (
              <div className="ml-listings-grid">
                {filteredListings.map((l) => (
                  <div
                    key={l._id}
                    className={`ml-listing-card${l.status !== "active" ? " inactive" : ""}`}
                  >
                    {/* Image */}
                    <div className="ml-listing-img-wrap">
                      {l.img ? (
                        <img
                          src={l.img}
                          alt={l.crop}
                          className="ml-listing-img"
                        />
                      ) : (
                        <div className="ml-listing-img-placeholder">
                          <i className="fa-solid fa-seedling" />
                        </div>
                      )}
                      <div
                        className={`ml-listing-status-badge ${l.status === "active" ? "active" : "inactive"}`}
                      >
                        {l.status === "active" ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="ml-listing-body">
                      <div className="ml-listing-crop">{l.crop}</div>
                      <div className="ml-listing-price">
                        ৳{l.price}
                        <span className="ml-listing-unit">
                          / {l.unit || "kg"}
                        </span>
                      </div>
                      <div className="ml-listing-meta-row">
                        {l.qty && (
                          <span>
                            <i className="fa-solid fa-box" /> {l.qty}{" "}
                            {l.unit || "kg"}
                          </span>
                        )}
                        {l.location && (
                          <span>
                            <i className="fa-solid fa-location-dot" />{" "}
                            {l.location}
                          </span>
                        )}
                      </div>
                      {l.description && (
                        <div className="ml-listing-desc">{l.description}</div>
                      )}
                      <div className="ml-listing-date">
                        <i className="fa-regular fa-calendar" />
                        Listed{" "}
                        {new Date(l.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-listing-actions">
                      <button
                        className="ml-action-btn toggle"
                        onClick={() => handleToggleStatus(l._id, l.status)}
                        title={
                          l.status === "active" ? "Deactivate" : "Activate"
                        }
                      >
                        <i
                          className={`fa-solid ${l.status === "active" ? "fa-pause" : "fa-play"}`}
                        />
                        {l.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="ml-action-btn edit"
                        onClick={() => openEditForm(l)}
                        title="Edit listing"
                      >
                        <i className="fa-solid fa-pen" /> Edit
                      </button>
                      <button
                        className="ml-action-btn delete"
                        onClick={() => handleDelete(l._id)}
                        title="Delete listing"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
