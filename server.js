// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const pool = require("./db"); // Import the pool
// const session = require('express-session');
// const MySQLStore = require("express-mysql-session")(session);

// const userRoutes = require('./routes/users');
// const fulfillmentRoutes = require('./routes/fulfillment');
// const ratingsreviewRoutes = require('./routes/ratingsreview');

// const app = express();
// const PORT = process.env.PORT || 56731
// ;

// // Middleware
// app.use(cors({
//   origin: 'https://fulfill1st.com', // Replace with your frontend URL
// // origin: 'http://localhost:5173',
//   credentials: true,
// }));
// app.use(express.json());

// // Session store options
// const sessionStore = new MySQLStore({
//   host: process.env.DB_HOST || '127.0.0.1',
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   createDatabaseTable: true,
//   schema: {
//     tableName: 'sessions',
//     columnNames: {
//       session_id: 'session_id',
//       expires: 'expires',
//       data: 'data'
//     }
//   }
// }, pool); // Use the imported pool here

// // Session middleware
// app.use(
//   session({
//     key: "session_cookie_name",
//     secret: process.env.SESSION_SECRET || "your-secret-key",
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       path: "/",
//       httpOnly: true,
//       secure: true, // Set to true if using HTTPS
//       sameSite: "none",
//       maxAge: 1000 * 60 * 60 * 24
//     },
//   })
// );

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/fulfillment', fulfillmentRoutes);
// app.use('/api/ratingsreview', ratingsreviewRoutes);

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./db');

const userRoutes = require('./routes/users');
const fulfillmentRoutes = require('./routes/fulfillment');
const ratingsreviewRoutes = require('./routes/ratingsreview');

const app = express();
const PORT = process.env.PORT || 56731;

// =============================================
// Enhanced Configuration
// =============================================

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// CORS Configuration
const corsOptions = {
  origin: isProduction 
    ? ['https://fulfill1st.com', 'https://www.fulfill1st.com']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));
app.use(express.json());

// =============================================
// Session Store Configuration
// =============================================

const sessionStoreOptions = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: true,
  clearExpired: true,
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutes
  expiration: 24 * 60 * 60 * 1000, // 24 hours
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
};

const sessionStore = new MySQLStore(sessionStoreOptions, pool);

// Session store connection verification
sessionStore.onReady().then(() => {
  console.log('✅ Session store connected');
}).catch(error => {
  console.error('❌ Session store connection failed:', error);
});

// =============================================
// Session Middleware
// =============================================

app.use(session({
  name: 'fulfill1st.sid',
  secret: process.env.SESSION_SECRET || 'your-strong-secret-here',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset maxAge on activity
  cookie: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Critical!
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 86400000,
    domain: process.env.NODE_ENV === 'production' 
      ? 'fulfill1st.com' // Remove leading dot
      : undefined // For local development
  }
}));

// =============================================
// Session Debugging Middleware
// =============================================

app.use((req, res, next) => {
  console.log('Session Info:', {
    sessionId: req.sessionID,
    userId: req.session.userId || 'unauthenticated',
    ip: req.ip,
    method: req.method,
    path: req.path
  });
  next();
});

// =============================================
// Routes
// =============================================

app.use('/api/users', userRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);
app.use('/api/ratingsreview', ratingsreviewRoutes);

// Session Verification Endpoint
app.get('/api/check-session', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ 
      error: 'No active session',
      sessionInfo: req.session 
    });
  }
  res.json({ 
    userId: req.session.userId,
    role: req.session.role,
    email: req.session.email 
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    sessionStore: sessionStore.ready ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// =============================================
// Error Handling Middleware
// =============================================

app.use((err, req, res, next) => {
  console.error('⚠️ Server Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    timestamp: new Date().toISOString() 
  });
});

// =============================================
// Server Initialization
// =============================================

app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode
  🔗 Base URL: http://localhost:${PORT}
  📅 Started at: ${new Date().toLocaleString()}
  🔒 Session store: ${sessionStore.ready ? '✅ Connected' : '❌ Disconnected'}
  `);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdowns gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    pool.end(); // Close database pool
    console.log('Server terminated');
  });
});