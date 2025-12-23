import React from "react";
import styles from "./Partners.module.css";
import { useLanguage } from "../context/LanguageContext";

export default function Partners() {
  const { languageData, language } = useLanguage();
  const t = languageData[language].home.partners;

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
          {t.title}
        </h2>

        <p className={styles.subtitle}>
          {t.subtitle}
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
}
