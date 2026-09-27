const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const { DATABASE_URL, NODE_ENV } = process.env;
if (!DATABASE_URL || !/^postgres(?:ql)?:\/\//.test(DATABASE_URL)) {
  throw new Error("DATABASE_URL must be a PostgreSQL connection URL");
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: NODE_ENV === "production"
    ? { ssl: { require: true, rejectUnauthorized: false }, keepAlive: true }
    : {},
  pool: { max: 5, min: 0, idle: 10000, acquire: 30000 },
});

const Donation = require("./donation")(sequelize, DataTypes);
module.exports = { sequelize, Donation };
