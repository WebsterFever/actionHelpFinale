import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./TestimonialSection.module.css";

const TestimonialSection = () => {
  const { t } = useLanguage();
  const { testimonials, testimonialTitle } = t.home;

  const [startIndex, setStartIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState(styles.fadeIn);
  const [perView, setPerView] = useState(3); // responsive count

  // Update perView with breakpoints: <640=1, <1024=2, else=3
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else setPerView(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (!testimonials?.length) return;
    const interval = setInterval(() => {
      setFadeClass(styles.fadeOut);
      setTimeout(() => {
        setStartIndex((prev) => (prev + perView) % testimonials.length);
        setFadeClass(styles.fadeIn);
      }, 800);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, perView]);

  // slice current window of testimonials according to perView
  const currentTestimonials = useMemo(() => {
    const arr = [];
    for (let i = 0; i < perView; i++) {
      arr.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return arr;
  }, [startIndex, perView, testimonials]);

  return (
    <div className={styles.testimonialWrapper}>
      <h2>{testimonialTitle}</h2>
      <div className={`${styles.grid} ${fadeClass}`}>
        {currentTestimonials.map((item, idx) => (
          <div key={`${startIndex}-${idx}`} className={styles.card}>
            <img src={item.image} alt={item.name} />
            <p>"{item.message}"</p>
            <h4>- {item.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
