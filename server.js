const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require("./db"); // Import the pool
const session = require('express-session');
const MySQLStore = require("express-mysql-session")(session);

const userRoutes = require('./routes/users');
const fulfillmentRoutes = require('./routes/fulfillment');
const ratingsreviewRoutes = require('./routes/ratingsreview');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://fulfill1st.com', // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());

// Session store options
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, pool); // Use the imported pool here

// Session middleware
app.use(
  session({
    key: "session_cookie_name",
    secret: process.env.SESSION_SECRET || "your-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    },
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);
app.use('/api/ratingsreview', ratingsreviewRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});