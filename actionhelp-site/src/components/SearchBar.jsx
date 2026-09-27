import React, { useState } from "react";
import styles from "./SearchBar.module.css";
import { useLanguage } from "../context/LanguageContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";

const SearchBar = () => {
  const { t } = useLanguage();
  const { setSearchTerm } = useSearch();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    const term = input.trim();
    if (!term) return;

    setSearchTerm(term);

    // If not on contact and searching "send", go to /contact
    if (term.toLowerCase().includes("send") && location.pathname !== "/contact") {
      navigate("/contact");
    }

    setInput("");
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchForm}>
      <input
        type="text"
        placeholder={t.search?.placeholder || "Search..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>🔍</button>
    </form>
  );
};

export default SearchBar;
