import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/legal_page/privacy_policy.css";

const SECTIONS = [
  {
    id: "overview",
    num: "01",
    icon: "fa-shield-halved",
    title: "Overview",
    content: `KrishiBondhu ("we," "us," or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect data when you use our agricultural guidance and farmer–buyer connection platform. KrishiBondhu is an academic project developed at Ahsanullah University of Science and Technology (AUST) and is not a commercial service.`,
  },
  {
    id: "collection",
    num: "02",
    icon: "fa-database",
    title: "Information We Collect",
    content: `Farmer Registration: We collect your full name, phone number, district, division, and password (stored as a hashed value). Buyer Registration: We collect your company name, contact person name, email address, business type, district, division, and trade license document. Usage Data: We automatically collect data about how you interact with the platform, including pages visited, orders placed, listings viewed, and timestamps of activity. We do not collect payment card information or national identification numbers.`,
  },
  {
    id: "use",
    num: "03",
    icon: "fa-gears",
    title: "How We Use Your Information",
    content: `We use collected information to: authenticate and manage your account; display your profile to relevant platform users (e.g., buyers can see farmer names and districts); process and track orders and crop listings; deliver crop advisory, disease guidance, and seasonal recommendations; send notifications related to your activity; improve platform features and user experience; and generate anonymized aggregate statistics for academic research purposes. We do not use your data for advertising.`,
  },
  {
    id: "sharing",
    num: "04",
    icon: "fa-share-nodes",
    title: "Information Sharing",
    content: `KrishiBondhu does not sell or rent your personal information to third parties. Your profile information (name, location, crop listings) may be visible to other registered users as part of normal platform operation. Administrators have access to all user data for platform management purposes. We may disclose information if required by Bangladeshi law or lawful government request. As an academic project, anonymized usage data may be shared in academic publications or presentations.`,
  },
  {
    id: "storage",
    num: "05",
    icon: "fa-server",
    title: "Data Storage & Security",
    content: `Your data is stored on MongoDB Atlas (Free Tier) cloud infrastructure. We implement industry-standard security measures including JWT-based authentication, bcrypt password hashing, and HTTPS-only communication. However, as an academic project, we cannot guarantee enterprise-grade security. Do not store sensitive personal or financial information beyond what is required for registration. We recommend using a password unique to this platform.`,
  },
  {
    id: "cookies",
    num: "06",
    icon: "fa-cookie-bite",
    title: "Cookies & Local Storage",
    content: `KrishiBondhu uses browser localStorage to store your session token (kb_token) and session data (kb_session) to keep you logged in. These are not third-party tracking cookies. We do not use advertising cookies or analytics services like Google Analytics. Clearing your browser's localStorage will log you out of the platform. No cross-site tracking is performed.`,
  },
  {
    id: "rights",
    num: "07",
    icon: "fa-user-check",
    title: "Your Rights",
    content: `You have the right to access the personal information we hold about you. You may request correction of inaccurate data by updating your profile or contacting us. You may request deletion of your account and associated data. Deleting your account will remove your profile but may not immediately remove all references from other users' order histories. To exercise these rights, contact the platform administrators through the support channels provided.`,
  },
  {
    id: "children",
    num: "08",
    icon: "fa-child",
    title: "Children's Privacy",
    content: `KrishiBondhu is intended for use by adults and registered businesses. We do not knowingly collect personal information from individuals under the age of 18. If we become aware that a minor has provided personal information, we will take steps to delete such information promptly. Parents or guardians who believe their child has provided information to us should contact us immediately.`,
  },
  {
    id: "thirdparty",
    num: "09",
    icon: "fa-link",
    title: "Third-Party Services",
    content: `KrishiBondhu may include links to or integrations with third-party services. Crop and product images may be sourced from Unsplash. Font resources are loaded from Google Fonts. Icons are served via Cloudflare CDN (Font Awesome). These third parties have their own privacy policies, and we encourage you to review them. KrishiBondhu is not responsible for the privacy practices of third-party services.`,
  },
  {
    id: "changes",
    num: "10",
    icon: "fa-rotate",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy as the platform evolves. Changes will be reflected by updating the effective date at the top of this document. Continued use of KrishiBondhu after changes are posted constitutes your acceptance of the revised policy. For questions or concerns regarding this Privacy Policy, please reach out through the platform's contact or support features.`,
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div className="pp-root">
        {/* ── TOPBAR ── */}
        <nav className={`pp-topbar${scrolled ? " pp-topbar-scrolled" : ""}`}>
          <a
            className="pp-brand"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-leaf" />
            <span className="pp-brand-k">Krishi</span>
            <span className="pp-brand-b">Bondhu</span>
          </a>
          <div className="pp-topbar-right">
            <button className="pp-back-btn" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left" /> Back
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <header className="pp-hero">
          <div className="pp-hero-bg" />
          <div className="pp-hero-grid-lines" />
          <div className="pp-hero-content">
            <div className="pp-hero-tag">
              <i className="fa-solid fa-shield-halved" /> Privacy Document
            </div>
            <h1 className="pp-hero-title">
              Privacy
              <br />
              Policy
            </h1>
            <p className="pp-hero-sub">
              Your data, your rights. Here is exactly how KrishiBondhu handles
              your information.
            </p>
            <div className="pp-hero-meta">
              <span>
                <i className="fa-regular fa-calendar" /> Effective: January 17,
                2026
              </span>
              <span>
                <i className="fa-solid fa-building-columns" /> AUST · CSE
                Department
              </span>
              <span>
                <i className="fa-solid fa-lock" /> JWT Secured
              </span>
            </div>
          </div>
          <div className="pp-hero-shield">
            <i className="fa-solid fa-shield-halved" />
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="pp-body">
          {/* Sidebar */}
          <aside className="pp-sidebar">
            <div className="pp-sidebar-label">Contents</div>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`pp-toc-item${activeSection === s.id ? " active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                <span className="pp-toc-num">{s.num}</span>
                <i className={`fa-solid ${s.icon} pp-toc-icon`} />
                <span className="pp-toc-title">{s.title}</span>
              </button>
            ))}
          </aside>

          {/* Main */}
          <main className="pp-main">
            {/* Highlight cards */}
            <div className="pp-highlights">
              {[
                {
                  icon: "fa-ban",
                  label: "No Ads",
                  sub: "Zero advertising tracking",
                },
                {
                  icon: "fa-lock",
                  label: "Encrypted",
                  sub: "Passwords are hashed",
                },
                {
                  icon: "fa-user-slash",
                  label: "Not Sold",
                  sub: "Data never sold",
                },
              ].map((h) => (
                <div key={h.label} className="pp-highlight-card">
                  <i className={`fa-solid ${h.icon}`} />
                  <strong>{h.label}</strong>
                  <span>{h.sub}</span>
                </div>
              ))}
            </div>

            {SECTIONS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="pp-section"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="pp-section-icon-col">
                  <div className="pp-section-icon-wrap">
                    <i className={`fa-solid ${s.icon}`} />
                  </div>
                  <div className="pp-section-line" />
                </div>
                <div className="pp-section-body">
                  <div className="pp-section-eyebrow">{s.num}</div>
                  <h2 className="pp-section-title">{s.title}</h2>
                  <p className="pp-section-text">{s.content}</p>
                </div>
              </section>
            ))}

            <div className="pp-contact-box">
              <div className="pp-contact-left">
                <i className="fa-solid fa-envelope-open-text" />
                <div>
                  <strong>Questions about your privacy?</strong>
                  <p>
                    Contact the KrishiBondhu team through the platform's support
                    channels or speak with your assigned agricultural advisor.
                  </p>
                </div>
              </div>
              <button className="pp-contact-btn" onClick={() => navigate(-1)}>
                <i className="fa-solid fa-arrow-left" /> Go Back
              </button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
