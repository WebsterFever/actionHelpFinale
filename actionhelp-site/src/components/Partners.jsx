import React from "react";
import styles from "./Partners.module.css";

export default function Partners() {
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
          Our Partners
        </h2>
        <p className={styles.subtitle}>
          We’re proud to work with organizations that support our mission.
        </p>

        <div className={styles.grid}>
          {partners.map((p) => (
            <div key={p.src} className={styles.card}>
              <img className={styles.logo} src={p.src} alt={p.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
