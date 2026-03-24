const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection String
 * URL format: 
 * postgresql://user:password@host:port/database
 ************************** */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Render.com hosted PostgreSQL
  },
});

module.exports = { pool };
