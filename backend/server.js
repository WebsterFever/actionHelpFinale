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
// //   });
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { Sequelize } = require("sequelize");

// const app = express();
// const PORT = process.env.PORT || 5000;

// const { DATABASE_URL, NODE_ENV } = process.env;

// /* ---------- Database Connection ---------- */
// const needsSSL =
//   NODE_ENV === "production" ||
//   /neon\.tech/i.test(DATABASE_URL || "");

// const sequelize = new Sequelize(DATABASE_URL, {
//   dialect: "postgres",
//   logging: false,

//   // ✅ Neon needs SSL. Setting it explicitly avoids ECONNREFUSED.
//   dialectOptions: needsSSL
//     ? {
//         ssl: {
//           require: true,
//           rejectUnauthorized: false,
//         },
//       }
//     : {},

//   // ✅ Helpful in serverless/containers
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10_000,
//     acquire: 30_000,
//   },

//   // ✅ Light retry on transient network issues
//   retry: {
//     max: 3,
//     match: [
//       /SequelizeConnection(?:Error|RefusedError|TimedOutError)/,
//       /ETIMEDOUT/i,
//       /ECONNRESET/i,
//       /ECONNREFUSED/i,
//     ],
//   },
// });

// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Connected to Neon PostgreSQL"))
//   .catch((err) => console.error("❌ Database connection failed:", err));

// /* ---------- Middleware ---------- */
// const allowedOrigins = new Set([
//   "https://action-help-finale-sixh-ql4c248wv-websterfevers-projects.vercel.app",
//   "https://actionhelp.org",
//   "https://www.actionhelp.org",
//   "http://localhost:5173", // Vite dev (optional)
//   "http://localhost:3000", // CRA dev (optional)
// ]);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // allow mobile apps / curl
//       if (allowedOrigins.has(origin)) {
//         console.log("✅ CORS allowed for:", origin);
//         return callback(null, true);
//       } else {
//         console.warn("🚫 CORS blocked for:", origin);
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use(express.json());

// /* ---------- Routes ---------- */
// const donateRoutes = require("./routes/donate");
// app.use("/api/donate", donateRoutes);

// const adminRoutes = require("./routes/admin");
// app.use("/api/admin", adminRoutes);

// // Simple health check for Koyeb
// app.get("/healthz", (_, res) => res.status(200).send("ok"));

// app.get("/", (_, res) => res.status(200).send("Server is healthy ✅"));


// /* ---------- Start Server ---------- */
// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ Failed to sync DB:", err);
//     process.exit(1);
//   });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();
const PORT = process.env.PORT || 5000;

const { DATABASE_URL = "", NODE_ENV = "development" } = process.env;

/* ---------- Database Connection ---------- */
const needsSSL = NODE_ENV === "production";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: needsSSL
    ? {
        ssl: { require: true, rejectUnauthorized: false },
        keepAlive: true,
      }
    : {},
  pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
  retry: {
    max: 3,
    match: [
      /SequelizeConnection(?:Error|RefusedError|TimedOutError)/,
      /ETIMEDOUT/i,
      /ECONNRESET/i,
      /ECONNREFUSED/i,
    ],
  },
});

/* ---------- Initialize Database ---------- */
async function initDatabase() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Connected to PostgreSQL database (Render)");
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
  "https://actionhelp.org",
  "https://www.actionhelp.org",
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
