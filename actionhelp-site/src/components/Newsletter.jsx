import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import styles from "./Newsletter.module.css";

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus("error");
      return;
    }

    // TODO: Integrate Mailchimp or API
    console.log("Simulate email submit:", email);
    setStatus("success");
    setEmail("");
  };

  return (
    <section className={styles.newsletter}>
      <h2>{t.newsletter.title}</h2>
      <p>{t.newsletter.description}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder={t.newsletter.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{t.newsletter.subscribeButton}</button>
      </form>

      {status === "success" && <p className={styles.success}>{t.newsletter.successMessage}</p>}
      {status === "error" && <p className={styles.error}>{t.newsletter.errorMessage}</p>}
    </section>
  );
};

export default Newsletter;
