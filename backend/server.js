// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { sequelize } = require("./models");


// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// const donateRoutes = require("./routes/donate");
// app.use("/api/donate", donateRoutes);

// const adminRoutes = require("./routes/admin");
// app.use("/api/admin", adminRoutes);




// // Sync DB and start server
// sequelize.sync({ alter: true })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Failed to sync DB:", err);
//   });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- Database Connection ---------- */
const { DATABASE_URL, NODE_ENV } = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions:
    NODE_ENV === "production"
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {},
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to Neon PostgreSQL"))
  .catch((err) => console.error("❌ Database connection failed:", err));

/* ---------- Middleware ---------- */
const allowedOrigins = new Set([
  "https://action-help-finale-sixh-ql4c248wv-websterfevers-projects.vercel.app",
  "https://actionhelp.org",
  "https://www.actionhelp.org",
  "http://localhost:5173", // Vite dev (optional)
  "http://localhost:3000", // CRA dev (optional)
]);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
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

// Simple health check for Koyeb
app.get("/healthz", (_, res) => res.status(200).send("ok"));

app.get("/", (_, res) => res.status(200).send("Server is healthy ✅"));


/* ---------- Start Server ---------- */
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync DB:", err);
    process.exit(1);
  });
