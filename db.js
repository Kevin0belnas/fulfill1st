const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  port: process.env.DB_PORT, // Required for Railway
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then((connection) => {
    console.log('✅ MySQL Connected');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });


module.exports = pool;