// src/jsx_files/buyer_page/marketplace.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

import "../../css_files/buyer_page/marketplace.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const DIVISIONS = [
  "all",
  "dhaka",
  "chittagong",
  "rajshahi",
  "khulna",
  "mymensingh",
  "rangpur",
  "sylhet",
  "barishal",
];
const TYPES = ["all", "grain", "vegetable", "fruit", "cash", "pulse"];
const SORTS = [
  { id: "featured", label: "Featured First" },
  { id: "price_asc", label: "Price: Low → High" },
  { id: "price_desc", label: "Price: High → Low" },
  { id: "qty_desc", label: "Qty: Most Available" },
  { id: "change_asc", label: "Price Trend: Falling" },
];

function sortListings(arr, sort) {
  const s = [...arr];
  if (sort === "featured")
    return s.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  if (sort === "price_asc") return s.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return s.sort((a, b) => b.price - a.price);
  if (sort === "qty_desc")
    return s.sort((a, b) => (b.qtyNum || 0) - (a.qtyNum || 0));
  if (sort === "change_asc")
    return s.sort((a, b) => (a.up ? 1 : 0) - (b.up ? 1 : 0));
  return s;
}

/* ── Order Modal ── */
function OrderModal({ listing, onClose }) {
  const [qty, setQty] = useState(100);
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const total = (qty * listing.price).toLocaleString("en-BD");

  const handleConfirm = async () => {
    setPlacing(true);
    try {
      const token = localStorage.getItem("kb_token");
      const res = await fetch(`${API_BASE}/api/buyer/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: listing._id,
          crop: listing.crop,
          qtyKg: qty,
          pricePerKg: listing.price,
          farmerName: listing.farmer,
          farmerLocation: listing.location,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");
      setSuccess(true);
    } catch (err) {
      alert("Order place করতে সমস্যা হয়েছে: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (success) {
    return (
      <div className="bm-modal-overlay" onClick={onClose}>
        <div className="bm-modal" onClick={(e) => e.stopPropagation()}>
          <div
            className="bm-modal-body"
            style={{ textAlign: "center", padding: "40px 20px" }}
          >
            <i
              className="fa-solid fa-circle-check"
              style={{ fontSize: "3rem", color: "#16a34a", marginBottom: 16 }}
            />
            <h3 style={{ marginBottom: 8 }}>Order Placed Successfully!</h3>
            <p style={{ color: "#6b7280" }}>
              {qty} kg of {listing.crop} — ৳{total}
            </p>
            <button
              className="bm-modal-confirm"
              style={{ marginTop: 24 }}
              onClick={onClose}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bm-modal-overlay" onClick={onClose}>
      <div className="bm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bm-modal-header">
          <div className="bm-modal-title">
            <i className="fa-solid fa-cart-shopping" /> Place Order
          </div>
          <button className="bm-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="bm-modal-body">
          <div className="bm-modal-crop-row">
            {listing.img && (
              <img
                src={listing.img}
                alt={listing.crop}
                className="bm-modal-crop-img"
              />
            )}
            <div>
              <div className="bm-modal-crop-name">{listing.crop}</div>
              <div className="bm-modal-crop-meta">
                <i className="fa-solid fa-user" /> {listing.farmer}
              </div>
              <div className="bm-modal-crop-meta">
                <i className="fa-solid fa-location-dot" /> {listing.location}
              </div>
              <div className="bm-modal-price">
                ৳{listing.price}
                <span>/kg</span>
              </div>
            </div>
          </div>

          <label className="bm-modal-label">Quantity (kg)</label>
          <input
            type="number"
            className="bm-modal-input"
            value={qty}
            min={1}
            max={listing.qtyNum || 99999}
            onChange={(e) => setQty(Number(e.target.value))}
          />
          {listing.qty && (
            <div className="bm-modal-avail">Available: {listing.qty}</div>
          )}

          <label className="bm-modal-label">Special Notes (optional)</label>
          <textarea
            className="bm-modal-input bm-modal-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Packaging preference, delivery date, etc."
          />

          <div className="bm-modal-total-row">
            <span>Estimated Total</span>
            <strong>৳{total}</strong>
          </div>
        </div>
        <div className="bm-modal-footer">
          <button className="bm-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bm-modal-confirm"
            onClick={handleConfirm}
            disabled={placing}
          >
            {placing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin" /> Placing…
              </>
            ) : (
              <>
                <i className="fa-solid fa-check" /> Confirm Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Marketplace() {
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [divFilter, setDivFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [marketNotice, setMarketNotice] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const revealRefs = useRef([]);

  // ── Fetch listings from backend ────────────────────────────
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("kb_token");
        const res = await fetch(`${API_BASE}/api/buyer/marketplace`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load listings");
        setAllListings(data.listings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // ── Fetch admin market notice ──────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/api/buyer/content/market_notice`)
      .then((r) => r.json())
      .then((d) => {
        if (d.value) setMarketNotice(d.value);
      })
      .catch(() => {});
  }, []);

  // ── Scroll reveal ──────────────────────────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("bm-vis");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [allListings]);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // ── Filter + Sort ──────────────────────────────────────────
  const filtered = sortListings(
    allListings.filter((l) => {
      const matchSearch =
        (l.crop || "").toLowerCase().includes(search.toLowerCase()) ||
        (l.farmer || "").toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || l.type === typeFilter;
      const matchDiv =
        divFilter === "all" || (l.division || "").toLowerCase() === divFilter;
      const matchFeatured = !featuredOnly || l.featured;
      return matchSearch && matchType && matchDiv && matchFeatured;
    }),
    sort,
  );

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <nav className="fd-topbar">
        <a className="fd-brand" href="/buyer_dashboard">
          <i className="fa-solid fa-leaf" />
          <span className="fd-brand-krishi">Krishi</span>Bondhu
        </a>
      </nav>
      <div className="bm-page">
        {/* HERO */}
        <section className="bm-hero">
          <div className="bm-hero-bg" />
          <div className="bm-hero-content">
            <div className="bm-hero-badge">
              <i className="fa-solid fa-store" /> Live Marketplace
            </div>
            <h1 className="bm-hero-title">
              Browse <span>Fresh Listings</span>
            </h1>
            <p className="bm-hero-sub">
              Direct from verified farmers across Bangladesh. Filter by crop,
              region, and price to find your best procurement match.
            </p>
            <div className="bm-hero-stats">
              <div className="bm-hstat">
                <i className="fa-solid fa-seedling" />
                <strong>{loading ? "…" : allListings.length}</strong>
                <span>Active Listings</span>
              </div>
              <div className="bm-hstat">
                <i className="fa-solid fa-location-dot" />
                <strong>
                  {loading
                    ? "…"
                    : [
                        ...new Set(
                          allListings.map((l) => l.division).filter(Boolean),
                        ),
                      ].length || 8}
                </strong>
                <span>Divisions</span>
              </div>
              <div className="bm-hstat">
                <i className="fa-solid fa-tractor" />
                <strong>
                  {loading
                    ? "…"
                    : [
                        ...new Set(
                          allListings.map((l) => l.farmer).filter(Boolean),
                        ),
                      ].length || "—"}
                </strong>
                <span>Verified Farmers</span>
              </div>
            </div>
          </div>
        </section>

        {/* MARKET NOTICE */}
        {marketNotice && (
          <div className="bm-notice-banner">
            <i className="fa-solid fa-circle-info" />{" "}
            <strong>Market Notice:</strong> {marketNotice}
          </div>
        )}

        {/* CONTROLS */}
        <div className="bm-controls bm-reveal" ref={addRef}>
          <div className="bm-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search crop or farmer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="bm-search-clear" onClick={() => setSearch("")}>
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <div className="bm-filter-row">
            <select
              className="bm-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              {TYPES.slice(1).map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="bm-select"
              value={divFilter}
              onChange={(e) => setDivFilter(e.target.value)}
            >
              <option value="all">All Divisions</option>
              {DIVISIONS.slice(1).map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
            <select
              className="bm-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <label className="bm-toggle-wrap">
              <div
                className={`bm-toggle ${featuredOnly ? "on" : ""}`}
                onClick={() => setFeaturedOnly((p) => !p)}
              >
                <div className="bm-toggle-knob" />
              </div>
              Featured Only
            </label>
          </div>
        </div>

        <div className="bm-results-meta bm-reveal" ref={addRef}>
          Showing <strong>{filtered.length}</strong> of {allListings.length}{" "}
          listings
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="bm-empty">
            <i
              className="fa-solid fa-spinner fa-spin"
              style={{ fontSize: "2rem", color: "#16a34a" }}
            />
            <h3>Loading listings…</h3>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="bm-empty">
            <span>⚠️</span>
            <h3>Could not load listings</h3>
            <p>{error}</p>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && (
          <div className="bm-grid bm-reveal" ref={addRef}>
            {filtered.length === 0 ? (
              <div className="bm-empty">
                <span>🌾</span>
                <h3>No listings found</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            ) : (
              filtered.map((l, i) => (
                <div
                  key={l._id}
                  className={`bm-card${l.featured ? " bm-card-featured" : ""}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {l.featured && (
                    <div className="bm-featured-badge">
                      <i className="fa-solid fa-star" /> Featured
                    </div>
                  )}
                  <div className="bm-card-img-wrap">
                    {l.img ? (
                      <img src={l.img} alt={l.crop} loading="lazy" />
                    ) : (
                      <div
                        style={{
                          height: 180,
                          background: "#f0fdf4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="fa-solid fa-seedling"
                          style={{ fontSize: "3rem", color: "#16a34a" }}
                        />
                      </div>
                    )}
                    <div className="bm-card-img-overlay" />
                    {l.location && (
                      <div className="bm-card-location">
                        <i className="fa-solid fa-location-dot" /> {l.location}
                      </div>
                    )}
                  </div>
                  <div className="bm-card-body">
                    {l.type && <div className="bm-card-type-tag">{l.type}</div>}
                    <div className="bm-card-crop">{l.crop}</div>
                    <div className="bm-card-farmer">
                      <i className="fa-solid fa-user-circle" /> {l.farmer}
                    </div>
                    <div className="bm-card-price-row">
                      <div className="bm-card-price">
                        ৳{l.price}
                        <span>/kg</span>
                      </div>
                      {l.change && (
                        <div
                          className={`bm-card-change ${l.up ? "bm-up" : "bm-down"}`}
                        >
                          <i
                            className={`fa-solid fa-arrow-trend-${l.up ? "up" : "down"}`}
                          />{" "}
                          {l.change}
                        </div>
                      )}
                    </div>
                    {l.qty && (
                      <div className="bm-card-qty">
                        <i className="fa-solid fa-scale-balanced" /> {l.qty}{" "}
                        available
                      </div>
                    )}
                    <button
                      className="bm-card-btn"
                      onClick={() => setSelectedListing(l)}
                    >
                      <i className="fa-solid fa-cart-shopping" /> Place Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ORDER MODAL */}
      {selectedListing && (
        <OrderModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </>
  );
}
