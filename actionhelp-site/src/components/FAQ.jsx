import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./FAQ.module.css";

const FAQ = () => {
  const { t } = useLanguage();
  const faqList = t.faq.questions;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.title}>{t.faq.title}</h2>
      <ul className={styles.faqList}>
        {faqList.map((item, idx) => (
          <li key={idx} className={styles.faqItem}>
            <button
              onClick={() => toggleAnswer(idx)}
              className={styles.questionButton}
            >
              {item.question}
              <span
                className={`${styles.arrow} ${
                  openIndex === idx ? styles.rotate : ""
                }`}
              >
                ▼
              </span>
            </button>

            {openIndex === idx && (
              <p className={styles.answer}>{item.answer}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FAQ;
