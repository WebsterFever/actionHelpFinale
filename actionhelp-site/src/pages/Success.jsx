// src/pages/Success.jsx
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import styles from "./Success.module.css"; // optional styling

const Success = () => {
  const { t } = useLanguage();

  return (
    <div className={styles.successContainer}>
      <h1 className={styles.title}>{t.donate.successTitle || "Thank You!"}</h1>
      <p className={styles.message}>
        {t.donate.successMessage ||
          "Your donation was successfully received. We truly appreciate your support!"}
      </p>
      <Link to="/" className={styles.homeBtn}>
        {t.donate.backHome || "Return to Home"}
      </Link>
    </div>
  );
};

export default Success;
