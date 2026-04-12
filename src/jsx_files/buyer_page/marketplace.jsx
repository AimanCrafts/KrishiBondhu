import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import BuyerLayout from "../../components/BuyerLayout";
import "../../css_files/buyer_page/marketplace.css";

const ALL_LISTINGS = [
  {
    id: 1,
    crop: "Rice (Boro)",
    type: "grain",
    farmer: "Rahim Uddin",
    location: "Gazipur, Dhaka",
    division: "dhaka",
    qty: "12T",
    qtyNum: 12000,
    price: 48,
    change: "+2.1%",
    up: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    crop: "Red Lentil",
    type: "pulse",
    farmer: "Karim Sheikh",
    location: "Comilla",
    division: "chittagong",
    qty: "3T",
    qtyNum: 3000,
    price: 110,
    change: "+3.2%",
    up: true,
    featured: false,
    img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    crop: "Potato",
    type: "vegetable",
    farmer: "Fatema Begum",
    location: "Munshiganj",
    division: "dhaka",
    qty: "22T",
    qtyNum: 22000,
    price: 32,
    change: "−1.4%",
    up: false,
    featured: true,
    img: "https://images.unsplash.com/photo-1553978297-833b17d9f0e0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    crop: "Mustard",
    type: "cash",
    farmer: "Jalal Ahmed",
    location: "Jamalpur",
    division: "mymensingh",
    qty: "5T",
    qtyNum: 5000,
    price: 92,
    change: "+0.8%",
    up: true,
    featured: false,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    crop: "Mango",
    type: "fruit",
    farmer: "Selim Hossain",
    location: "Rajshahi",
    division: "rajshahi",
    qty: "8T",
    qtyNum: 8000,
    price: 65,
    change: "+5.1%",
    up: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    crop: "Wheat",
    type: "grain",
    farmer: "Nurul Islam",
    location: "Rangpur",
    division: "rangpur",
    qty: "15T",
    qtyNum: 15000,
    price: 38,
    change: "+1.1%",
    up: true,
    featured: false,
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    crop: "Tomato",
    type: "vegetable",
    farmer: "Amina Khatun",
    location: "Jessore, Khulna",
    division: "khulna",
    qty: "4T",
    qtyNum: 4000,
    price: 55,
    change: "−2.0%",
    up: false,
    featured: false,
    img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    crop: "Sugarcane",
    type: "cash",
    farmer: "Rafiq Mia",
    location: "Rajshahi, Natore",
    division: "rajshahi",
    qty: "30T",
    qtyNum: 30000,
    price: 12,
    change: "+0.3%",
    up: true,
    featured: false,
    img: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    crop: "Banana",
    type: "fruit",
    farmer: "Hanif Sheikh",
    location: "Sylhet",
    division: "sylhet",
    qty: "6T",
    qtyNum: 6000,
    price: 28,
    change: "+1.7%",
    up: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    crop: "Jute",
    type: "cash",
    farmer: "Shahidul Alam",
    location: "Faridpur",
    division: "dhaka",
    qty: "9T",
    qtyNum: 9000,
    price: 45,
    change: "−0.5%",
    up: false,
    featured: false,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    crop: "Maize",
    type: "grain",
    farmer: "Bahar Uddin",
    location: "Dinajpur, Rangpur",
    division: "rangpur",
    qty: "18T",
    qtyNum: 18000,
    price: 29,
    change: "+2.8%",
    up: true,
    featured: false,
    img: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    crop: "Onion",
    type: "vegetable",
    farmer: "Sohag Mia",
    location: "Faridpur, Dhaka",
    division: "dhaka",
    qty: "7T",
    qtyNum: 7000,
    price: 80,
    change: "+4.5%",
    up: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
  },
];

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
  if (sort === "featured") return s.sort((a, b) => b.featured - a.featured);
  if (sort === "price_asc") return s.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") return s.sort((a, b) => b.price - a.price);
  if (sort === "qty_desc") return s.sort((a, b) => b.qtyNum - a.qtyNum);
  if (sort === "change_asc") return s.sort((a, b) => a.up - b.up);
  return s;
}

/* ── Order Modal ── */
function OrderModal({ listing, onClose }) {
  const [qty, setQty] = useState(100);
  const [note, setNote] = useState("");
  const total = (qty * listing.price).toLocaleString("en-BD");

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
            <img
              src={listing.img}
              alt={listing.crop}
              className="bm-modal-crop-img"
            />
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
            max={listing.qtyNum}
            onChange={(e) => setQty(Number(e.target.value))}
          />
          <div className="bm-modal-avail">Available: {listing.qty}</div>

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
            onClick={() => {
              alert(
                `Order for ${qty}kg of ${listing.crop} placed! (Connect backend for live orders)`,
              );
              onClose();
            }}
          >
            <i className="fa-solid fa-check" /> Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function Marketplace() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [divFilter, setDivFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [marketNotice, setMarketNotice] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    fetch("/api/buyer/content/market_notice")
      .then((r) => r.json())
      .then((d) => {
        if (d.value) setMarketNotice(d.value);
      })
      .catch(() => {});
  }, []);

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
  }, []);

  const addRef = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const filtered = sortListings(
    ALL_LISTINGS.filter((l) => {
      const matchSearch =
        l.crop.toLowerCase().includes(search.toLowerCase()) ||
        l.farmer.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || l.type === typeFilter;
      const matchDiv = divFilter === "all" || l.division === divFilter;
      const matchFeatured = !featuredOnly || l.featured;
      return matchSearch && matchType && matchDiv && matchFeatured;
    }),
    sort,
  );

  return (
    <BuyerLayout activeNav="marketplace">
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
                <strong>{ALL_LISTINGS.length}</strong>
                <span>Active Listings</span>
              </div>
              <div className="bm-hstat">
                <i className="fa-solid fa-location-dot" />
                <strong>8</strong>
                <span>Divisions</span>
              </div>
              <div className="bm-hstat">
                <i className="fa-solid fa-tractor" />
                <strong>120+</strong>
                <span>Verified Farmers</span>
              </div>
            </div>
          </div>
        </section>

        {/* ADMIN NOTICE */}
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
          Showing <strong>{filtered.length}</strong> of {ALL_LISTINGS.length}{" "}
          listings
        </div>

        {/* GRID */}
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
                key={l.id}
                className={`bm-card${l.featured ? " bm-card-featured" : ""}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {l.featured && (
                  <div className="bm-featured-badge">
                    <i className="fa-solid fa-star" /> Featured
                  </div>
                )}
                <div className="bm-card-img-wrap">
                  <img src={l.img} alt={l.crop} loading="lazy" />
                  <div className="bm-card-img-overlay" />
                  <div className="bm-card-location">
                    <i className="fa-solid fa-location-dot" /> {l.location}
                  </div>
                </div>
                <div className="bm-card-body">
                  <div className="bm-card-type-tag">{l.type}</div>
                  <div className="bm-card-crop">{l.crop}</div>
                  <div className="bm-card-farmer">
                    <i className="fa-solid fa-user-circle" /> {l.farmer}
                  </div>
                  <div className="bm-card-price-row">
                    <div className="bm-card-price">
                      ৳{l.price}
                      <span>/kg</span>
                    </div>
                    <div
                      className={`bm-card-change ${l.up ? "bm-up" : "bm-down"}`}
                    >
                      <i
                        className={`fa-solid fa-arrow-trend-${l.up ? "up" : "down"}`}
                      />{" "}
                      {l.change}
                    </div>
                  </div>
                  <div className="bm-card-qty">
                    <i className="fa-solid fa-scale-balanced" /> {l.qty}{" "}
                    available
                  </div>
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
      </div>

      {/* ORDER MODAL */}
      {selectedListing && (
        <OrderModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </BuyerLayout>
  );
}
