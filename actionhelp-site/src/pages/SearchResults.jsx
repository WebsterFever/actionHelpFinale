import React from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "../context/LanguageContext";
import styles from "./SearchResults.module.css";

const SearchResults = () => {
  const { t } = useLanguage();
  const query = useSelector((state) => state.search.query.toLowerCase());

  if (!query) return null;

  const results = [];

  // Search Services
  t.home.services.forEach((service) => {
    if (service.title.toLowerCase().includes(query)) {
      results.push({ section: "Services", value: service.title });
    }
  });

  // Search Testimonials
  t.home.testimonials.forEach((testimonial) => {
    if (testimonial.message.toLowerCase().includes(query)) {
      results.push({ section: "Testimonials", value: testimonial.message });
    }
  });

  // Search Contact
  if (t.contact.title.toLowerCase().includes(query)) {
    results.push({ section: "Contact", value: t.contact.title });
  }

  // Search Nav
  Object.entries(t.nav).forEach(([key, label]) => {
    if (label.toLowerCase().includes(query)) {
      results.push({ section: "Navigation", value: label });
    }
  });

  // Search QuickLinks
  Object.entries(t.quickLinks).forEach(([key, label]) => {
    if (label.toLowerCase().includes(query)) {
      results.push({ section: "Quick Links", value: label });
    }
  });

  return (
    <div className={styles.results}>
      <h3>Search Results for: <em>{query}</em></h3>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.map((item, idx) => (
            <li key={idx}>
              <strong>{item.section}:</strong> {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
