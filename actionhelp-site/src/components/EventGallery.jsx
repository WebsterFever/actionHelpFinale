import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./EventGallery.module.css";

const Slider = ({ items }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className={styles.slider} onClick={next}>
      <div
        className={styles.track}
        style={{
          transform: `translateX(-${index * 60}%)`,
        }}
      >
        {items.map((e, i) => (
          <div
            key={i}
            className={`${styles.slide} ${
              i === index ? styles.active : ""
            }`}
          >
            <img src={e.image} alt={e.title} />
            <p>{e.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const EventGallery = () => {
  const { t } = useLanguage();
  const events = t?.home?.events;
  if (!events) return null;

  return (
    <section className={styles.events}>
      <h2 className={styles.title}>{events.title}</h2>
      <p className={styles.subtitle}>{events.subtitle}</p>

      {events.upcoming?.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>{events.upcomingLabel}</h3>
          <Slider items={events.upcoming} />
        </>
      )}

      {events.past?.length > 0 && (
        <>
          <h3 className={styles.sectionTitle}>{events.pastLabel}</h3>
          <Slider items={events.past} />
        </>
      )}
    </section>
  );
};

export default EventGallery;
