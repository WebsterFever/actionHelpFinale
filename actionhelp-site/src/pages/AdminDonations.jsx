import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminDonations.module.css";

const AdminDonations = () => {
  const [token, setToken] = useState("");
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDonations = async (event) => {
    event.preventDefault();
    if (!token.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/donations`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });
      setDonations(res.data);
    } catch (err) {
      setDonations([]);
      setError(err.response?.status === 401 ? "Invalid admin token." : "Could not load donations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h1>Admin Donation Dashboard</h1>
      <form className={styles.accessForm} onSubmit={fetchDonations}>
        <label htmlFor="admin-token">Admin token</label>
        <input id="admin-token" type="password" autoComplete="off" value={token}
          onChange={(event) => setToken(event.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Loading…" : "View donations"}</button>
      </form>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {donations.length > 0 && (
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead><tr><th>Donor</th><th>Amount</th><th>Monthly</th><th>Anonymous</th><th>Email</th><th>Phone</th><th>Card</th><th>Comment</th><th>Date</th></tr></thead>
            <tbody>{donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.firstName} {donation.lastName}</td>
                <td>${donation.amount}</td>
                <td>{donation.isMonthly ? "Yes" : "No"}</td>
                <td>{donation.isAnonymous ? "Yes" : "No"}</td>
                <td>{donation.email}</td><td>{donation.phone}</td>
                <td>{donation.cardBrand && donation.last4 ? `${donation.cardBrand} ****${donation.last4}` : "—"}</td>
                <td>{donation.comment}</td>
                <td>{new Date(donation.createdAt).toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminDonations;
