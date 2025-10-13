import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import styles from "./AsideMenu.module.css";

const MOBILE_QUERY = "(max-width: 1023px)"; // <= iPad

const AsideMenu = ({ onItemClick = () => {} }) => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(false);
  const [openBlog, setOpenBlog] = useState(false);
  const [openServices, setOpenServices] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener
      ? mq.addEventListener("change", update)
      : mq.addListener(update);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", update)
        : mq.removeListener(update);
    };
  }, []);

  // Auto-close accordions after route change on mobile
  useEffect(() => {
    if (isMobile) {
      setOpenBlog(false);
      setOpenServices(false);
    }
  }, [location.pathname, isMobile]);

  // helper: navigate + close drawer (used for /contact items)
  const go = (to) => (e) => {
    e.preventDefault();
    navigate(to);
    onItemClick(); // close drawer
  };

  return (
    <aside className={styles.aside} aria-label="Sidebar">
      {/* BLOG */}
      <div className={`${styles.section} ${isMobile && openBlog ? styles.open : ""}`}>
        {isMobile ? (
          <button
            className={styles.sectionToggle}
            onClick={() => setOpenBlog((v) => !v)}
            aria-expanded={openBlog}
            aria-controls="aside-blog-list"
            type="button"
          >
            <span>{t.menuSections.blog}</span>
          </button>
        ) : (
          <p className={styles.sectionTitle}>{t.menuSections.blog}</p>
        )}

        <ul id="aside-blog-list" role="list">
          <li><NavLink to="/contact" onClick={onItemClick}>{t.quickLinks.volunteer}</NavLink></li>
          <li>
            {/* donate styling untouched; just close the drawer after click */}
            <NavLink to="/donate" className={!isMobile ? styles.flashDonate : ""} onClick={onItemClick}>
              {t.quickLinks.donate} 💖
            </NavLink>
          </li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.collaborate}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.immigrationGuides}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.resumeTemplates}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.supportLinks}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.workshops}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.communityStories}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.advocacyUpdates}</NavLink></li>
        </ul>
      </div>

      {/* SERVICES */}
      <div className={`${styles.section} ${isMobile && openServices ? styles.open : ""}`}>
        {isMobile ? (
          <button
            className={styles.sectionToggle}
            onClick={() => setOpenServices((v) => !v)}
            aria-expanded={openServices}
            aria-controls="aside-services-list"
            type="button"
          >
            <span>{t.menuSections.services}</span>
          </button>
        ) : (
          <p className={styles.sectionTitle}>{t.menuSections.services}</p>
        )}

        <ul id="aside-services-list" role="list">
          {/* All items go to /contact and close the drawer */}
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.immigrationAssistance}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.jobPlacement}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.languagePrograms}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.educationSupport}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.housingResources}</NavLink></li>
          <li><NavLink to="/contact" onClick={go("/contact")}>{t.quickLinks.communityIntegration}</NavLink></li>
        </ul>
      </div>
    </aside>
  );
};

export default AsideMenu;
