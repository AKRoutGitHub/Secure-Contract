const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../../../.env");

const result = dotenv.config({
  path: envPath,
});

if (result.error) {
  throw new Error(`Failed to load environment file: ${envPath}`);
}

module.exports = {
  DB_USER: process.env.DB_USER || "admin",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_NAME: process.env.DB_NAME || "secure_contract",
  DB_PASSWORD: process.env.DB_PASSWORD || "password",
  DB_PORT: Number(process.env.DB_PORT || 5432),
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  PORT: Number(process.env.PORT || 3000),
};
