import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { Moon, Sun, Search } from "lucide-react";
import SearchBar from "./SearchBar";

const Header = ({ theme = "light", setTheme }) => {
  const { t, changeLanguage } = useLanguage();
  const nav = t.nav;
  const home = t.home;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  const isContactPage = pathname === "/contact";
  const isDonatePage = pathname === "/donate";

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const handleLanguageChange = (e) => changeLanguage(e.target.value);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const handleMenuItemClick = () => setIsMobileMenuOpen(false);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {(
        <div className={styles.donateBanner} onClick={() => navigate("/donate")}>
          {home.donateMessage}
        </div>
      )}

      <div className={styles.topLogoBar}>
        <Link to="/" onClick={handleMenuItemClick} className={styles.logoLink} aria-label="ActionHelp home">
          <img src="/images/logo.png" alt="ActionHelp Foundation" className={styles.topLogoImage} />
        </Link>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.isScrolled : ""}`}>
        {/* Mobile inline logo (hidden on desktop) */}
        <Link to="/" className={styles.mobileLogoWrap} onClick={handleMenuItemClick}>
          <img src="/images/logo.png" alt="ActionHelp Logo" className={styles.mobileLogoImage} />
        </Link>

        {/* Mobile controls (hidden on desktop) */}
        <div className={styles.mobileRightGroup}>
          {showSearch ? (
            <div className={styles.mobileSearch}>
              <SearchBar />
              <button className={styles.iconButton} type="button" onClick={() => setShowSearch(false)} aria-label="Close search">✕</button>
            </div>
          ) : (
            <>
              <button className={styles.iconButton} onClick={() => setShowSearch(true)} aria-label="Search">
                <Search size={18} />
              </button>

              <select
                className={styles.languageSelect}
                onChange={handleLanguageChange}
                defaultValue="en"
                aria-label="Change language"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="es">ES</option>
                <option value="ht">HT</option>
              </select>

              <button onClick={toggleTheme} className={styles.iconButton} aria-label="Toggle theme">
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button
                className={styles.menuToggle}
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? "✖" : "☰"}
              </button>
            </>
          )}
        </div>

        {/* Nav (absolutely centered on desktop) */}
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navMobileOpen : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
            onClick={handleMenuItemClick}
          >
            {nav.home}
          </NavLink>

          {!(isContactPage || isDonatePage) && (
            <>
              <a href="#about" onClick={handleMenuItemClick}>{nav.about}</a>
              <a href="#mission" onClick={handleMenuItemClick}>{nav.mission}</a>
              <a href="#services" onClick={handleMenuItemClick}>{nav.services}</a>
            </>
          )}

          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
            onClick={handleMenuItemClick}
          >
            {nav.contact}
          </NavLink>

          {!isDonatePage && (
            <NavLink
              to="/donate"
              onClick={handleMenuItemClick}
              className={styles.donateLinkReset}
            >
              {(t.quickLinks && t.quickLinks.donate) || "Donate"} 💖
            </NavLink>
          )}
        </nav>

        {/* Desktop controls (right-aligned) */}
        <div className={styles.rightControls}>
          <div className={styles.searchDesktopOnly}>
            <SearchBar />
          </div>

          <select
            className={styles.languageSelect}
            onChange={handleLanguageChange}
            defaultValue="en"
            aria-label="Change language"
          >
            <option value="en">English 🇺🇸</option>
            <option value="fr">Français 🇫🇷</option>
            <option value="es">Español 🇪🇸</option>
            <option value="ht">Kreyòl 🇭🇹</option>
          </select>

          <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
