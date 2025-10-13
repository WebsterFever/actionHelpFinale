import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LanguageProvider } from "./context/LanguageContext";
import { SearchProvider } from "./context/SearchContext";





// ✅ Redux imports


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <SearchProvider>
        <App />
      </SearchProvider>
    </LanguageProvider>
  </React.StrictMode>
);

// Optional: measure performance
reportWebVitals();
