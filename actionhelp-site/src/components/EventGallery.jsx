import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./EventGallery.module.css";

const Gallery = ({ items }) => {
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className={styles.slider}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((e, i) => (
            <div key={i} className={styles.slide}>
              <img src={e.image} alt={e.title} />
              <p>{e.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
};

const EventGallery = () => {
  const { t } = useLanguage();
  const events = t?.home?.events;
  if (!events) return null;

  return (
    <section className={styles.events}>
      <div className={styles.container}>
        <h2 className={styles.title}>{events.title}</h2>
        <p className={styles.subtitle}>{events.subtitle}</p>

        {events.upcoming?.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>{events.upcomingLabel}</h3>
            <Gallery items={events.upcoming} />
          </>
        )}

        {events.past?.length > 0 && (
          <>
            <h3 className={styles.sectionTitle}>{events.pastLabel}</h3>
            <Gallery items={events.past} />
          </>
        )}
      </div>
    </section>
  );
};

export default EventGallery;
