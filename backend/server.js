require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const donateRoutes = require("./routes/donate");
app.use("/api/donate", donateRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);




// Sync DB and start server
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync DB:", err);
  });
