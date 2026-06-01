const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "social_app",
  password: "2004",
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ Connection Error:", err));

module.exports = pool;
