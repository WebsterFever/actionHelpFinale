// src/pages/AdminDonations.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDonations.module.css"; // CSS Module for styling

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/donations", {
        headers: {
          Authorization: "Bearer supersecrettoken123", // use your real token here
        },
      });
      setDonations(res.data);
    } catch (err) {
      console.error("❌ Error fetching donations:", err.message);
      setError("You are not authorized or there was a problem fetching donations.");
    }
  };

  fetchDonations();
}, []);


  return (
    <div className={styles.container}>
      <h2>Admin Donation Dashboard</h2>
      {error && <p className={styles.error}>{error}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Donor</th>
            <th>Amount</th>
            <th>Monthly</th>
            <th>Anonymous</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Card</th>
            <th>Comment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation.id}>
              <td>{donation.firstName} {donation.lastName}</td>
              <td>${donation.amount}</td>
              <td>{donation.isMonthly ? "✅" : "❌"}</td>
              <td>{donation.isAnonymous ? "✅" : "❌"}</td>
              <td>{donation.email}</td>
              <td>{donation.phone}</td>
              <td>{donation.cardBrand} ****{donation.last4}</td>
              <td>{donation.comment}</td>
              <td>{new Date(donation.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDonations;
