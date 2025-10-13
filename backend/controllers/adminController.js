// controllers/adminController.js
const { Donation } = require("../models");

// Simple token check for demo (replace with proper JWT or session in production)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

exports.getDonations = async (req, res) => {
  const token = req.headers.authorization;

  if (!token || token !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const donations = await Donation.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(donations);
  } catch (error) {
    console.error("❌ Error fetching donations:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
