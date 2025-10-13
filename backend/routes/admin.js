// routes/admin.js
const express = require("express");
const router = express.Router();
const { Donation } = require("../models");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

router.get("/donations", verifyAdmin, async (req, res) => {
  try {
    const donations = await Donation.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(donations);
  } catch (err) {
    console.error("❌ Error fetching donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

module.exports = router;
