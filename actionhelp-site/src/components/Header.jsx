// import React, { useState, useEffect } from "react";
// import { useLanguage } from "../context/LanguageContext";
// import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
// import styles from "./Header.module.css";
// import asideStyles from "../components/AsideMenu.module.css";
// import { Moon, Sun, Search } from "lucide-react";
// import SearchBar from "./SearchBar";
// // ❌ Removed: import AsideMenu from "../components/AsideMenu";

// const Header = ({ theme = "light", setTheme }) => {
//   const { t, changeLanguage } = useLanguage();
//   const nav = t.nav;
//   const home = t.home;
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const isContactPage = pathname === "/contact";
//   const isDonatePage  = pathname === "/donate";

//   const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
//   const handleLanguageChange = (e) => changeLanguage(e.target.value);
//   const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
//   const handleMenuItemClick = () => setIsMobileMenuOpen(false);

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [theme]);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     onScroll();
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <>
//       {window.innerWidth <= 767 && (
//         <div className={styles.donateBanner} onClick={() => navigate("/donate")}>
//           {home.donateMessage}
//         </div>
//       )}

//       {/* Desktop-only top-centered logo */}
//       <div className={styles.topLogoBar}>
//         <Link to="/" onClick={handleMenuItemClick} className={styles.logoLink}>
//           <img src="/images/logo.png" alt="ActionHelp Logo" className={styles.topLogoImage} />
//         </Link>
//       </div>

//       {/* Header */}
//       <header className={`${styles.header} ${scrolled ? styles.isScrolled : ""}`}>
//         {/* Mobile inline logo */}
//         <Link to="/" className={styles.mobileLogoWrap} onClick={handleMenuItemClick}>
//           <img src="/images/logo.png" alt="ActionHelp Logo" className={styles.mobileLogoImage} />
//         </Link>

//         {/* Mobile controls */}
//         <div className={styles.mobileRightGroup}>
//           {showSearch ? (
//             <input
//               type="text"
//               className={styles.searchInputMobile}
//               placeholder={t.search?.placeholder || "Search..."}
//               autoFocus
//               onBlur={() => setShowSearch(false)}
//             />
//           ) : (
//             <>
//               <button className={styles.iconButton} onClick={() => setShowSearch(true)}>
//                 <Search size={18} />
//               </button>

//               <select className={styles.languageSelect} onChange={handleLanguageChange} defaultValue="en">
//                 <option value="en">EN</option>
//                 <option value="fr">FR</option>
//                 <option value="es">ES</option>
//                 <option value="ht">HT</option>
//               </select>

//               <button onClick={toggleTheme} className={styles.iconButton}>
//                 {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
//               </button>

//               <button
//                 className={styles.menuToggle}
//                 onClick={toggleMobileMenu}
//                 aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
//               >
//                 {isMobileMenuOpen ? "✖" : "☰"}
//               </button>
//             </>
//           )}
//         </div>

//         {/* Nav */}
//         <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navMobileOpen : ""}`}>
//           <NavLink
//             to="/"
//             className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
//             onClick={handleMenuItemClick}
//           >
//             {nav.home}
//           </NavLink>

//           {!(isContactPage || isDonatePage) && (
//             <>
//               <a href="#about" onClick={handleMenuItemClick}>{nav.about}</a>
//               <a href="#mission" onClick={handleMenuItemClick}>{nav.mission}</a>
//               <a href="#services" onClick={handleMenuItemClick}>{nav.services}</a>
//             </>
//           )}

//           <NavLink
//             to="/contact"
//             className={({ isActive }) => (isActive ? styles.activeLink : undefined)}
//             onClick={handleMenuItemClick}
//           >
//             {nav.contact}
//           </NavLink>

//           {!isDonatePage && (
//             <NavLink
//               to="/donate"
//               onClick={handleMenuItemClick}
//               className={`${asideStyles.flashDonate} ${styles.donateLinkReset}`}
//             >
//               {(t.quickLinks && t.quickLinks.donate) || "Donate"} 💖
//             </NavLink>
//           )}

//           {/* ❌ Removed the AsideMenu on mobile to hide Blog/Services cards */}
//           {/* {isMobileMenuOpen && window.innerWidth <= 767 && !isDonatePage && (
//             <div className={styles.mobileAsideWrapper}>
//               <AsideMenu onItemClick={handleMenuItemClick} />
//             </div>
//           )} */}
//         </nav>

//         {/* Desktop controls (hidden on mobile) */}
//         <div className={styles.rightControls}>
//           <div className={styles.searchDesktopOnly}>
//             <SearchBar />
//           </div>

//           <select className={styles.languageSelect} onChange={handleLanguageChange} defaultValue="en">
//             <option value="en">English 🇺🇸</option>
//             <option value="fr">Français 🇫🇷</option>
//             <option value="es">Español 🇪🇸</option>
//             <option value="ht">Kreyòl 🇭🇹</option>
//           </select>

//           <button onClick={toggleTheme} className={styles.themeToggle}>
//             {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import asideStyles from "../components/AsideMenu.module.css";
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
      {typeof window !== "undefined" && window.innerWidth <= 767 && (
        <div className={styles.donateBanner} onClick={() => navigate("/donate")}>
          {home.donateMessage}
        </div>
      )}

      {/* Desktop-only top-centered logo */}
      <div className={styles.topLogoBar}>
        <Link to="/" onClick={handleMenuItemClick} className={styles.logoLink}>
          <img src="/images/logo.png" alt="ActionHelp Logo" className={styles.topLogoImage} />
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
            <input
              type="text"
              className={styles.searchInputMobile}
              placeholder={t.search?.placeholder || "Search..."}
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
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
              className={`${asideStyles.flashDonate} ${styles.donateLinkReset}`}
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
