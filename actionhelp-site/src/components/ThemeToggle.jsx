import React from "react";

const ThemeToggle = ({ theme, setTheme }) => {
  return (
    <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
