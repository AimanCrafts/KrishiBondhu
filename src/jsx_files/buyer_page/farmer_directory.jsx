import { useState, useEffect, useRef } from "react";
import BuyerLayout from "../../components/BuyerLayout";
import "../../css_files/buyer_page/farmer_directory.css";

/* ── Static farmer data ── */
const FARMERS = [
  { id: 1,  name: "Rahim Uddin",    letter: "R", crops: ["Rice","Mustard"],            division: "dhaka",     district: "Gazipur",       orders: 12, rating: 4.9, verified: true,  featured: true,  land: "8 bigha",  joined: "Jan 2024", phone: "+880 1711-000001", specialty: "Boro Rice expert with cold storage access." },
  { id: 2,  name: "Karim Sheikh",   letter: "K", crops: ["Red Lentil","Chickpea"],     division: "chittagong",district: "Comilla",        orders: 8,  rating: 4.7, verified: true,  featured: false, land: "5 bigha",  joined: "Mar 2024", phone: "+880 1711-000002", specialty: "Pulse specialist, organic certification in progress." },
  { id: 3,  name: "Fatema Begum",   letter: "F", crops: ["Potato","Onion"],            division: "dhaka",     district: "Munshiganj",     orders: 15, rating: 4.8, verified: true,  featured: true,  land: "14 bigha", joined: "Feb 2024", phone: "+880 1711-000003", specialty: "High-yield potato grower, bulk supply available." },
  { id: 4,  name: "Jalal Ahmed",    letter: "J", crops: ["Mustard","Wheat"],           division: "mymensingh",district: "Jamalpur",       orders: 6,  rating: 4.6, verified: true,  featured: false, land: "6 bigha",  joined: "Apr 2024", phone: "+880 1711-000004", specialty: "Winter crop specialist with strong Rabi yield." },
  { id: 5,  name: "Selim Hossain", letter: "S", crops: ["Mango","Jackfruit"],         division: "rajshahi",  district: "Rajshahi",       orders: 10, rating: 4.9, verified: true,  featured: true,  land: "20 bigha", joined: "Dec 2023", phone: "+880 1711-000005", specialty: "Premium mango exporter, Grade A Fazli and Himsagar." },
  { id: 6,  name: "Nurul Islam",    letter: "N", crops: ["Wheat","Maize"],            division: "rangpur",   district: "Dinajpur",       orders: 4,  rating: 4.5, verified: false, featured: false, land: "9 bigha",  joined: "May 2024", phone: "+880 1711-000006", specialty: "Northern grain farmer, bulk Rabi season supply." },
  { id: 7,  name: "Amina Khatun",   letter: "A", crops: ["Tomato","Brinjal"],         division: "khulna",    district: "Jessore",        orders: 7,  rating: 4.7, verified: true,  featured: false, land: "4 bigha",  joined: "Jun 2024", phone: "+880 1711-000007", specialty: "Vegetable farmer with year-round greenhouse capacity." },
  { id: 8,  name: "Rafiq Mia",      letter: "R", crops: ["Sugarcane","Banana"],       division: "rajshahi",  district: "Natore",         orders: 3,  rating: 4.4, verified: false, featured: false, land: "12 bigha", joined: "Jul 2024", phone: "+880 1711-000008", specialty: "Cash crop farmer supplying local sugar mills." },
  { id: 9,  name: "Hanif Sheikh",   letter: "H", crops: ["Banana","Papaya"],          division: "sylhet",    district: "Sylhet",         orders: 9,  rating: 4.8, verified: true,  featured: true,  land: "7 bigha",  joined: "Feb 2024", phone: "+880 1711-000009", specialty: "Tropical fruit specialist, consistent supply throughout year." },
  { id: 10, name: "Shahidul Alam",  letter: "S", crops: ["Jute","Rice"],             division: "dhaka",     district: "Faridpur",       orders: 5,  rating: 4.6, verified: true,  featured: false, land: "10 bigha", joined: "Mar 2024", phone: "+880 1711-000010", specialty: "Jute cultivation with traditional processing knowledge." },
  { id: 11, name: "Bahar Uddin",    letter: "B", crops: ["Maize","Sorghum"],         division: "rangpur",   district: "Rangpur",        orders: 2,  rating: 4.3, verified: false, featured: false, land: "5 bigha",  joined: "Aug 2024", phone: "+880 1711-000011", specialty: "Feed crop supplier for poultry and livestock farms." },
  { id: 12, name: "Sohag Mia",      letter: "S", crops: ["Onion","Garlic"],          division: "dhaka",     district: "Faridpur",       orders: 11, rating: 4.8, verified: true,  featured: false, land: "8 bigha",  joined: "Jan 2024", phone: "+880 1711-000012", specialty: "Spice crop expert, cold storage partnerships available." },
];

const DIVISIONS = ["all","dhaka","chittagong","rajshahi","khulna","mymensingh","rangpur","sylhet","barishal"];
const CROP_TYPES = ["all","rice","potato","mango","wheat","lentil","mustard","vegetable","fruit","jute"];

const AVATAR_COLORS = ["#4f46e5","#0891b2","#059669","#d97706","#dc2626","#7c3aed","#db2777","#0d9488"];

/* ── Contact Modal ── */
function ContactModal({ farmer, onClose }) {
  return (
    <div className="fd-modal-overlay" onClick={onClose}>
      <div className="fd-modal" onClick={e => e.stopPropagation()}>
        <div className="fd-modal-header">
          <div className="fd-modal-avatar" style={{ background: AVATAR_COLORS[farmer.id % AVATAR_COLORS.length] }}>
            {farmer.letter}
          </div>
          <div className="fd-modal-info">
            <div className="fd-modal-name">{farmer.name}</div>
            <div className="fd-modal-loc"><i className="fa-solid fa-location-dot" /> {farmer.district}, {farmer.division.charAt(0).toUpperCase() + farmer.division.slice(1)}</div>
          </div>
          <button className="fd-modal-close" onClick={onClose}><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="fd-modal-body">
          <p className="fd-modal-specialty">{farmer.specialty}</p>
          <div className="fd-modal-detail-row"><i className="fa-solid fa-seedling" /> <strong>Crops:</strong> {farmer.crops.join(", ")}</div>
          <div className="fd-modal-detail-row"><i className="fa-solid fa-land-mine-on" /> <strong>Land:</strong> {farmer.land}</div>
          <div className="fd-modal-detail-row"><i className="fa-solid fa-calendar" /> <strong>Member since:</strong> {farmer.joined}</div>
          <div className="fd-modal-detail-row"><i className="fa-solid fa-star" /> <strong>Rating:</strong> {farmer.rating} / 5 ({farmer.orders} orders)</div>
        </div>
        <div className="fd-modal-actions">
          <a href={`tel:${farmer.phone}`} className="fd-modal-btn fd-btn-call">
            <i className="fa-solid fa-phone" /> Call Farmer
          </a>
          <button className="fd-modal-btn fd-btn-msg" onClick={() => alert("Messaging: Connect to backend")}>
            <i className="fa-solid fa-comment-dots" /> Send Message
          </button>
          <button className="fd-modal-btn fd-btn-order" onClick={() => alert("Request supply: Connect to backend")}>
            <i className="fa-solid fa-cart-shopping" /> Request Supply
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function FarmerDirectory() {
  const [search, setSearch]           = useState("");
  const [divFilter, setDivFilter]     = useState("all");
  const [cropFilter, setCropFilter]   = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy]           = useState("rating");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const revealRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("fd-vis"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  const filtered = [...FARMERS].filter(f => {
    const matchSearch    = f.name.toLowerCase().includes(search.toLowerCase()) ||
                           f.district.toLowerCase().includes(search.toLowerCase()) ||
                           f.crops.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchDiv       = divFilter === "all" || f.division === divFilter;
    const matchCrop      = cropFilter === "all" || f.crops.some(c => c.toLowerCase().includes(cropFilter));
    const matchVerified  = !verifiedOnly || f.verified;
    return matchSearch && matchDiv && matchCrop && matchVerified;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "orders") return b.orders - a.orders;
    if (sortBy === "name")   return a.name.localeCompare(b.name);
    return 0;
  });

  const stats = {
    total:    FARMERS.length,
    verified: FARMERS.filter(f => f.verified).length,
    divisions: [...new Set(FARMERS.map(f => f.division))].length,
    avgRating: (FARMERS.reduce((s, f) => s + f.rating, 0) / FARMERS.length).toFixed(1),
  };

  return (
    <BuyerLayout activeNav="farmers">
      <div className="fd-page">

        {/* HERO */}
        <section className="fd-hero">
          <div className="fd-hero-bg" />
          <div className="fd-hero-content">
            <div className="fd-hero-badge"><i className="fa-solid fa-tractor" /> Farmer Network</div>
            <h1 className="fd-hero-title">Your Farmer <span>Directory</span></h1>
            <p className="fd-hero-sub">Connect directly with verified farmers across Bangladesh. Browse by crop, region, and rating to find your ideal supply partner.</p>
            <div className="fd-hero-stats">
              {[
                { label: "Active Farmers",  val: stats.total,    icon: "fa-users" },
                { label: "Verified",        val: stats.verified, icon: "fa-shield-halved" },
                { label: "Divisions",       val: stats.divisions,icon: "fa-map-location-dot" },
                { label: "Avg. Rating",     val: `★ ${stats.avgRating}`, icon: "fa-star" },
              ].map(s => (
                <div key={s.label} className="fd-hstat">
                  <div className="fd-hstat-icon"><i className={`fa-solid ${s.icon}`} /></div>
                  <div className="fd-hstat-val">{s.val}</div>
                  <div className="fd-hstat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <div className="fd-controls fd-reveal" ref={addRef}>
          <div className="fd-search-wrap">
            <i className="fa-solid fa-magnifying-glass" />
            <input type="text" placeholder="Search name, district, or crop…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} className="fd-search-clear"><i className="fa-solid fa-xmark" /></button>}
          </div>
          <div className="fd-filter-row">
            <select className="fd-select" value={divFilter} onChange={e => setDivFilter(e.target.value)}>
              <option value="all">All Divisions</option>
              {DIVISIONS.slice(1).map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
            <select className="fd-select" value={cropFilter} onChange={e => setCropFilter(e.target.value)}>
              <option value="all">All Crops</option>
              {CROP_TYPES.slice(1).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <select className="fd-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="rating">Sort: Rating</option>
              <option value="orders">Sort: Orders</option>
              <option value="name">Sort: Name</option>
            </select>
            <label className="fd-toggle-wrap">
              <div className={`fd-toggle ${verifiedOnly ? "on" : ""}`} onClick={() => setVerifiedOnly(p => !p)}>
                <div className="fd-toggle-knob" />
              </div>
              Verified Only
            </label>
          </div>
        </div>

        <div className="fd-meta fd-reveal" ref={addRef}>
          Showing <strong>{filtered.length}</strong> farmers
        </div>

        {/* GRID */}
        <div className="fd-grid fd-reveal" ref={addRef}>
          {filtered.length === 0 ? (
            <div className="fd-empty"><span>🌾</span><h3>No farmers found</h3><p>Try adjusting your filters.</p></div>
          ) : filtered.map((f, i) => (
            <div
              key={f.id}
              className={`fd-card${f.featured ? " fd-card-featured" : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {f.featured && <div className="fd-featured-ribbon"><i className="fa-solid fa-star" /> Top Supplier</div>}

              <div className="fd-card-top">
                <div className="fd-card-avatar" style={{ background: AVATAR_COLORS[f.id % AVATAR_COLORS.length] }}>
                  {f.letter}
                </div>
                {f.verified && (
                  <div className="fd-verified-badge" title="Verified Farmer">
                    <i className="fa-solid fa-shield-halved" /> Verified
                  </div>
                )}
              </div>

              <div className="fd-card-name">{f.name}</div>
              <div className="fd-card-loc"><i className="fa-solid fa-location-dot" /> {f.district}, {f.division.charAt(0).toUpperCase() + f.division.slice(1)}</div>

              <div className="fd-card-crops">
                {f.crops.map(c => <span key={c} className="fd-crop-tag">{c}</span>)}
              </div>

              <div className="fd-card-specialty">{f.specialty}</div>

              <div className="fd-card-stats">
                <div className="fd-stat">
                  <div className="fd-stat-val">{f.orders}</div>
                  <div className="fd-stat-lbl">Orders</div>
                </div>
                <div className="fd-stat-div" />
                <div className="fd-stat">
                  <div className="fd-stat-val">★ {f.rating}</div>
                  <div className="fd-stat-lbl">Rating</div>
                </div>
                <div className="fd-stat-div" />
                <div className="fd-stat">
                  <div className="fd-stat-val">{f.land}</div>
                  <div className="fd-stat-lbl">Land</div>
                </div>
              </div>

              <button className="fd-card-btn" onClick={() => setSelectedFarmer(f)}>
                <i className="fa-solid fa-comment-dots" /> Connect
              </button>
            </div>
          ))}
        </div>

      </div>

      {selectedFarmer && <ContactModal farmer={selectedFarmer} onClose={() => setSelectedFarmer(null)} />}
    </BuyerLayout>
  );
}
