

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.text}>Oops! The page you are looking for does not exist.</p>
      <Link to="/" style={styles.button}>Go Back Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "5rem 2rem",
    color: "var(--text)",
    backgroundColor: "var(--background)",
    minHeight: "80vh"
  },
  title: {
    fontSize: "3rem",
    marginBottom: "1rem"
  },
  text: {
    fontSize: "1.25rem",
    marginBottom: "2rem"
  },
  button: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "var(--primary)",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px"
  }
};

export default NotFound;
