const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // 👈 porta correta vinda do .env
    dialect: "postgres",
    logging: false,
  }
);

// ✅ Passe o DataTypes aqui corretamente
const Donation = require("./Donation")(sequelize, DataTypes);

module.exports = {
  sequelize,
  Donation,
};
