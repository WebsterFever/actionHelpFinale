import React, { useRef, useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./Contact.module.css";
import { useLanguage } from "../context/LanguageContext";
import { useSearch } from "../context/SearchContext";
import emailjs from "emailjs-com";

const Contact = () => {
  const form = useRef();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { searchTerm } = useSearch();
  const { pathname } = useLocation();
  const isContactPage = pathname === "/contact";

  const contact = t?.contact || {};
  const nav = t?.nav || {};

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!searchTerm) return;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    document.querySelectorAll("h1, h2, p, button, label, span").forEach((el) => {
      if (el.children.length > 0) return;
      el.innerHTML = el.textContent;
      if (regex.test(el.textContent)) {
        el.innerHTML = el.textContent.replace(
          regex,
          `<mark class="highlight">$1</mark>`
        );
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [searchTerm]);

 const sendEmail = (e) => {
  e.preventDefault();

  const serviceID = "service_xj1ye3e";
  const templateID = "template_8pqhc4f";
  const publicKey = "ViAJaJki00eyMsfZp";

  emailjs
    .sendForm(serviceID, templateID, form.current, publicKey)
    .then(
      () => {
        setStatus("SUCCESS");
        form.current.reset();
      },
      (error) => {
        console.error("EmailJS error:", error);
        setStatus("FAILED");
      }
    );
};


  return (
    <section className={styles.contactSection}>
      {!isContactPage && (
        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : "")}>
            {nav.home}
          </NavLink>
          <a href="#about">{nav.about}</a>
          <a href="#mission">{nav.mission}</a>
          <a href="#services">{nav.services}</a>
        </nav>
      )}

      <h1>{contact.title}</h1>
      <p>{contact.subtitle}</p>

      <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
        <input type="text" name="user_name" placeholder={contact.namePlaceholder} required />
        <input type="email" name="user_email" placeholder={contact.emailPlaceholder} required />
        <input type="tel" name="user_phone" placeholder={contact.phonePlaceholder} required />
        <textarea name="message" placeholder={contact.messagePlaceholder} rows="5" required />
        <button type="submit">{contact.sendButton}</button>
        {status === "SUCCESS" && <p className={styles.success}>Message sent!</p>}
        {status === "FAILED" && <p className={styles.error}>Failed to send. Try again.</p>}
      </form>

      {window.innerWidth <= 767 && (
        <div className={styles.donateBanner} onClick={() => navigate("/donate")}>
          {t.home?.donateMessage}
        </div>
      )}
    </section>
  );
};

export default Contact;
