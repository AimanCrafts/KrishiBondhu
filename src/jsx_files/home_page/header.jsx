import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css_files/home_page/Header.css";

function Header() {
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");
  const navigate = useNavigate();

  useEffect(() => {
    const header = document.getElementById("header");

    const handleScroll = () => {
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };

    window.addEventListener("scroll", handleScroll);
    document.documentElement.setAttribute("data-theme", theme);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "bn" : "en");
  };

  return (
    <header id="header">
      <div className="logo">
        <i className="fa-solid fa-leaf"></i>
        <span className="krishi-text">Krishi</span>Bondhu
      </div>

      <div className="nav-controls">
        <button onClick={toggleLang} className="theme-btn">
          {lang === "en" ? "English" : "বাংলা"}
        </button>

        <button
          onClick={toggleTheme}
          className="theme-btn"
          style={{ background: theme === "dark" ? "#1e1e1e" : "#4caf50" }}
        >
          {theme === "light" ? "Light" : "Dark"}
        </button>

        <button className="header-btn login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="header-btn signup" onClick={() => navigate("/signup")}>
          Sign Up</button>
      </div>
    </header>
  );
}

export default Header;
