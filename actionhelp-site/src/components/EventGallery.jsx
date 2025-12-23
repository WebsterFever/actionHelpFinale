import React from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./EventGallery.module.css";

const EventGallery = () => {
  const { t } = useLanguage();
  const events = t?.home?.events;

  if (!events) return null;

  return (
    <section className={styles.events}>
      <div className={styles.container}>
        <h2 className={styles.title}>{events.title}</h2>
        <p className={styles.subtitle}>{events.subtitle}</p>

        {/* Upcoming */}
        {events.upcoming?.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>
              {events.upcomingLabel}
            </h3>

            <div className={styles.grid}>
              {events.upcoming.map((e, i) => (
                <div key={i} className={styles.card}>
                  <img src={e.image} alt={e.title} />
                  <p>{e.title}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Past */}
        {events.past?.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>
              {events.pastLabel}
            </h3>

            <div className={styles.grid}>
              {events.past.map((e, i) => (
                <div key={i} className={styles.card}>
                  <img src={e.image} alt={e.title} />
                  <p>{e.title}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventGallery;
