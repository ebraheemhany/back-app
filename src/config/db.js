const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        // ✅ Railway
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        // ✅ Local
        user: "postgres",
        host: "localhost",
        database: "social_app",
        password: "2004",
        port: 5432,
      }
);

pool
  .connect()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ Connection Error:", err));

module.exports = pool;