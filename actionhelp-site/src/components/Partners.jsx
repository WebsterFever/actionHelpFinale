import React from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Partners.module.css";

const Partners = () => {
  const { t } = useLanguage();

  // Safety guard (same idea as Newsletter)
  if (!t?.home?.partners) return null;

  const partners = [
    { src: "/images/american.png", alt: "American Partner" },
    { src: "/images/ash.png", alt: "ASH Partner" },
    { src: "/images/pic.jpg", alt: "Partner" },
    { src: "/images/vils.png", alt: "VILS Partner" },
  ];

  return (
    <section className={styles.partners} aria-labelledby="partners-title">
      <div className={styles.container}>
        <h2 id="partners-title" className={styles.title}>
          {t.home.partners.title}
        </h2>

        <p className={styles.subtitle}>
          {t.home.partners.subtitle}
        </p>

        <div className={styles.grid}>
          {partners.map((p) => (
            <div key={p.src} className={styles.card}>
              <img
                src={p.src}
                alt={p.alt}
                className={styles.logo}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
