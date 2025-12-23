import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./EventGallery.module.css";

const Carousel = ({ items }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 4000);
    return () => clearInterval(id);
  }, [items.length]);

  const getClass = (i) => {
    if (i === index) return styles.active;
    if (i === (index - 1 + items.length) % items.length) return styles.prev;
    if (i === (index + 1) % items.length) return styles.next;
    return styles.hidden;
  };

  return (
    <div className={styles.carousel}>
      {items.map((e, i) => (
        <div key={i} className={`${styles.card} ${getClass(i)}`}>
          <img src={e.image} alt={e.title} />
          <p>{e.title}</p>
        </div>
      ))}
    </div>
  );
};

export default function EventGallery() {
  const { t } = useLanguage();
  const events = t?.home?.events;
  if (!events) return null;

  return (
    <section className={styles.events}>
      <h2>{events.title}</h2>
      <p>{events.subtitle}</p>

      {events.upcoming?.length > 0 && (
        <>
          <h3>{events.upcomingLabel}</h3>
          <Carousel items={events.upcoming} />
        </>
      )}

      {events.past?.length > 0 && (
        <>
          <h3>{events.pastLabel}</h3>
          <Carousel items={events.past} />
        </>
      )}
    </section>
  );
}
