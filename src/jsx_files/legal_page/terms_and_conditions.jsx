import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/legal_page/terms_and_conditions.css";

const SECTIONS = [
  {
    id: "acceptance",
    num: "01",
    title: "Acceptance of Terms",
    content: `By accessing or using KrishiBondhu ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform. KrishiBondhu is operated by students of Ahsanullah University of Science and Technology (AUST) as an academic project under the Department of Computer Science and Engineering.`,
  },
  {
    id: "eligibility",
    num: "02",
    title: "Eligibility & User Roles",
    content: `KrishiBondhu serves three types of users: Farmers, Buyers, and Administrators. To register as a Farmer, you must be an active agricultural producer in Bangladesh. Buyers may include individuals, restaurants, or small businesses seeking verified agricultural products. By registering, you confirm that all information provided is accurate and truthful. Misrepresentation may result in account termination.`,
  },
  {
    id: "accounts",
    num: "03",
    title: "User Accounts & Security",
    content: `You are responsible for maintaining the confidentiality of your login credentials. Farmers authenticate via phone number and password; buyers authenticate via email and password. You agree to notify us immediately of any unauthorized use of your account. KrishiBondhu cannot be held liable for any loss or damage arising from your failure to protect your account credentials.`,
  },
  {
    id: "conduct",
    num: "04",
    title: "Acceptable Use",
    content: `Users agree not to post false, misleading, or fraudulent crop listings. You must not attempt to circumvent the platform to conduct transactions outside KrishiBondhu. Harassment, abuse, or threatening behavior toward other users is strictly prohibited. You agree not to use the platform for any unlawful purpose or in violation of applicable Bangladeshi law. Spamming, scraping, or unauthorized data collection is not permitted.`,
  },
  {
    id: "marketplace",
    num: "05",
    title: "Marketplace & Transactions",
    content: `KrishiBondhu facilitates connections between farmers and buyers but is not a party to any transaction. All pricing, availability, and product quality representations are the sole responsibility of the listing farmer. KrishiBondhu does not guarantee the accuracy of listings. Buyers should exercise due diligence before placing orders. Disputes between farmers and buyers must be resolved between the parties; KrishiBondhu may assist in mediation but is not obligated to do so.`,
  },
  {
    id: "content",
    num: "06",
    title: "Content & Intellectual Property",
    content: `All platform content, design, and code remain the intellectual property of the KrishiBondhu development team and AUST. Users retain ownership of content they submit (listings, reviews, messages) but grant KrishiBondhu a non-exclusive license to display and use such content to operate the platform. You may not reproduce, distribute, or commercially exploit platform content without written permission.`,
  },
  {
    id: "advisory",
    num: "07",
    title: "Crop Advisory & Information",
    content: `Crop advisory content, disease identification guidance, and seasonal recommendations provided on KrishiBondhu are for informational purposes only. This information does not constitute professional agricultural or legal advice. KrishiBondhu does not guarantee the accuracy or completeness of advisory content. Users should consult qualified agricultural experts before making significant crop management decisions.`,
  },
  {
    id: "termination",
    num: "08",
    title: "Termination",
    content: `KrishiBondhu reserves the right to suspend or terminate any user account at its discretion, including for violation of these Terms, fraudulent activity, or inactivity. Upon termination, your right to use the platform ceases immediately. Provisions regarding intellectual property, disclaimers, and limitations of liability shall survive termination.`,
  },
  {
    id: "liability",
    num: "09",
    title: "Limitation of Liability",
    content: `KrishiBondhu is provided "as is" for academic and demonstrational purposes. To the maximum extent permitted by law, KrishiBondhu and its developers shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. As an academic project, the platform may experience downtime, data loss, or service interruptions without prior notice.`,
  },
  {
    id: "changes",
    num: "10",
    title: "Changes to Terms",
    content: `KrishiBondhu reserves the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms. We encourage users to review these Terms periodically. For questions regarding these Terms, contact the development team through the platform's support channels.`,
  },
];

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("acceptance");
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
      <div className="tc-root">
        {/* ── TOPBAR ── */}
        <nav className={`tc-topbar${scrolled ? " tc-topbar-scrolled" : ""}`}>
          <a
            className="tc-brand"
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-leaf" />
            <span className="tc-brand-k">Krishi</span>
            <span className="tc-brand-b">Bondhu</span>
          </a>
          <div className="tc-topbar-right">
            <button className="tc-back-btn" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left" /> Back
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <header className="tc-hero">
          <div className="tc-hero-bg" />
          <div className="tc-hero-content">
            <div className="tc-hero-tag">
              <i className="fa-solid fa-scale-balanced" /> Legal Document
            </div>
            <h1 className="tc-hero-title">
              Terms &<br />
              Conditions
            </h1>
            <p className="tc-hero-sub">
              Please read these terms carefully before using the KrishiBondhu
              platform.
            </p>
            <div className="tc-hero-meta">
              <span>
                <i className="fa-regular fa-calendar" /> Effective: January 17,
                2026
              </span>
              <span>
                <i className="fa-solid fa-building-columns" /> AUST · CSE
                Department
              </span>
              <span>
                <i className="fa-solid fa-code-branch" /> Version 1.0
              </span>
            </div>
          </div>
          <div className="tc-hero-deco">
            <span>01</span>
            <span>02</span>
            <span>03</span>
            <span>04</span>
            <span>05</span>
            <span>06</span>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="tc-body">
          {/* Sidebar TOC */}
          <aside className="tc-sidebar">
            <div className="tc-sidebar-label">Contents</div>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                className={`tc-toc-item${activeSection === s.id ? " active" : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                <span className="tc-toc-num">{s.num}</span>
                <span className="tc-toc-title">{s.title}</span>
              </button>
            ))}
          </aside>

          {/* Main content */}
          <main className="tc-main">
            <div className="tc-intro-box">
              <i className="fa-solid fa-circle-info" />
              <p>
                These Terms and Conditions govern your use of KrishiBondhu, a
                web-based agricultural guidance and farmer–buyer connection
                platform developed as an academic project at AUST. By using this
                platform, you enter into a binding agreement with the
                KrishiBondhu development team.
              </p>
            </div>

            {SECTIONS.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="tc-section"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="tc-section-num">{s.num}</div>
                <div className="tc-section-body">
                  <h2 className="tc-section-title">{s.title}</h2>
                  <p className="tc-section-text">{s.content}</p>
                </div>
              </section>
            ))}

            <div className="tc-footer-note">
              <i className="fa-solid fa-leaf" />
              <div>
                <strong>KrishiBondhu — Academic Project</strong>
                <p>
                  Developed by Abdur Rahman Aiman, Raisul Islam Sifat & Munawar
                  Mahtab Moon under the supervision of Atiqur Rahman and Ashek
                  Seum, AUST.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
