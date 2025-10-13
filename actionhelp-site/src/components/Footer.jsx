// // src/components/Footer.tsx
// import React from "react";
// import styles from "./Footer.module.css";
// import { useLanguage } from "../context/LanguageContext";

// const Footer = () => {
//   const { t } = useLanguage();

//   return (
//     <footer className={styles.footer}>
//       <div className={styles.section}>
//         <h4>{t.quickLinks?.getInvolvedTitle || "Get Involved"}</h4>
//         <ul>
//           <li>{t.quickLinks.volunteer}</li>
//           <li>{t.quickLinks.donate}</li>
//           <li>{t.quickLinks.collaborate}</li>
//         </ul>
//       </div>

//       <div className={styles.section}>
//         <h4>{t.quickLinks?.resourcesTitle || "Resources"}</h4>
//         <ul>
//           <li>{t.quickLinks.immigrationGuides}</li>
//           <li>{t.quickLinks.resumeTemplates}</li>
//           <li>{t.quickLinks.supportLinks}</li>
//         </ul>
//       </div>

//       <div className={styles.section}>
//         <h4>{t.quickLinks?.newsEventsTitle || "News & Events"}</h4>
//         <ul>
//           <li>{t.quickLinks.workshops}</li>
//           <li>{t.quickLinks.communityStories}</li>
//           <li>{t.quickLinks.advocacyUpdates}</li>
//         </ul>
//       </div>

//       <div className={styles.section}>
//         <h4>{t.nav.contact}</h4>
//         <ul>
//           <li>📞 (555) 123-4567</li>
//           <li>📧 info@actionhelp.org</li>
//           <li>📍 Springfield, MA</li>
//         </ul>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={styles.section}>
        <h4>{t.quickLinks?.getInvolvedTitle || "Get Involved"}</h4>
        <ul>
          <li>
            <Link to="/contact" className={styles.link}>
              {t.quickLinks.volunteer}
            </Link>
          </li>
          <li>
            <Link to="/donate" className={styles.link}>
              {t.quickLinks.donate}
            </Link>
          </li>
          <li>
            <Link to="/contact" className={styles.link}>
              {t.quickLinks.collaborate}
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h4>{t.quickLinks?.resourcesTitle || "Resources"}</h4>
        <ul>
          <li>{t.quickLinks.immigrationGuides}</li>
          <li>{t.quickLinks.resumeTemplates}</li>
          <li>{t.quickLinks.supportLinks}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h4>{t.quickLinks?.newsEventsTitle || "News & Events"}</h4>
        <ul>
          <li>{t.quickLinks.workshops}</li>
          <li>{t.quickLinks.communityStories}</li>
          <li>{t.quickLinks.advocacyUpdates}</li>
        </ul>
      </div>
    
      <div className={styles.section}>
        <Link to="/contact" className={styles.link}>
        <h4>{t.nav.contact}</h4>
        </Link> 
        
        <ul>
          <li>📞 (413) 749-4324</li>
          <li>📧 actionhelp24@gmail.com</li>
          <li>📍 Springfield, MA</li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
