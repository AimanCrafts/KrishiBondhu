import { Link } from "react-router-dom";
import "../../css_files/home_page/Footer.css";

const quickLinks = [
  { label: "Home", href: "#header" },
  { label: "Platform", href: "#sec-title" },
  { label: "Explore", href: "#" },
  { label: "Contact", href: "#contact" },
  { label: "Admin Login", href: "/admin_login", isRoute: true },
];

const secondaryLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const socialLinks = [
  { icon: "fab fa-facebook-f", href: "#" },
  { icon: "fab fa-twitter", href: "#" },
  { icon: "fab fa-instagram", href: "#" },
  { icon: "fab fa-linkedin-in", href: "#" },
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Animated background glow */}
      <div className="footer-bg"></div>

      <div className="footer-content">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <h2>
              <i className="fa-solid fa-leaf"></i> KrishiBondhu
            </h2>
            <p>Empowering Farmers with Smart Agriculture</p>
          </div>

          {/* Links */}
          <div className="footer-links-wrapper">
            <div className="footer-links">
              {quickLinks.map((link) =>
                link.isRoute ? (
                  <Link key={link.label} to={link.href}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ),
              )}
            </div>
            <div className="footer-links center-links">
              {secondaryLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Icons */}
          <div className="footer-social">
            {socialLinks.map((s) => (
              <a key={s.icon} href={s.href}>
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copy">
          <p>© 2026 KrishiBondhu | Precision Agriculture Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
