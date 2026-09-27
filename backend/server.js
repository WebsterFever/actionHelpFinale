require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Initialize Database ---------- */
async function initDatabase() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Connected to PostgreSQL database");
      return;
    } catch (err) {
      console.log(`⏳ DB connection attempt ${attempt} failed...`);
      if (attempt === 3) {
        console.error("❌ Database connection failed:", err);
        throw err;
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
}

/* ---------- Middleware ---------- */
const allowedOrigins = new Set([
  "https://action-help-finale-sixh-ql4c248wv-websterfevers-projects.vercel.app",
  "https://actionhelps.org",
  "https://www.actionhelps.org",
  "http://localhost:5173",
  "http://localhost:3000",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) {
        console.log("✅ CORS allowed for:", origin);
        return callback(null, true);
      }
      console.warn("🚫 CORS blocked for:", origin);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

/* ---------- Routes ---------- */
const donateRoutes = require("./routes/donate");
app.use("/api/donate", donateRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Health check
app.get("/healthz", (_, res) => res.status(200).send("ok"));
app.get("/", (_, res) => res.status(200).send("Server is healthy ✅"));

// ✅ ADD KEEP-ALIVE ROUTES HERE (for Koyeb free tier)
app.get("/keep-alive", (req, res) => {
  console.log('🔄 Keep-alive ping received');
  res.status(200).json({ 
    status: "alive", 
    timestamp: new Date().toISOString(),
    message: "Server is awake and running"
  });
});

/* ---------- Start Server ---------- */
(async () => {
  try {
    await initDatabase();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();