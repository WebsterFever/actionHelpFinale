// import React, { useState } from "react";
// import styles from "./SearchBar.module.css";
// import { useLanguage } from "../context/LanguageContext";

// const SearchBar = () => {
//   const { t } = useLanguage();
//   const [input, setInput] = useState("");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const term = input.trim();
//     const regex = new RegExp(`(${term})`, "gi");

//     const elements = document.querySelectorAll("a, li, h1, h2, h3, p, span, div");

//     elements.forEach((el) => {
//       // Skip if the element has children (to avoid breaking structure)
//       if (el.children.length > 0) return;

//       // Remove previous highlights
//       el.innerHTML = el.textContent;

//       if (regex.test(el.textContent)) {
//         const highlighted = el.textContent.replace(
//           regex,
//           `<mark class="${styles.highlight}">$1</mark>`
//         );
//         el.innerHTML = highlighted;
//         el.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     });

//     setInput("");
//   };

//   return (
//     <form onSubmit={handleSearch} className={styles.searchForm}>
//       <input
//         type="text"
//         placeholder={t.search?.placeholder || "Search..."}
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className={styles.searchInput}
//       />
//       <button type="submit" className={styles.searchButton}>🔍</button>
//     </form>
//   );
// };

// export default SearchBar;
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
