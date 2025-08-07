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

// ✅ Needed for Railway or any proxy (e.g., Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// ✅ CORS Configuration
const corsOptions = {
  origin: ['https://fulfill1st.com', 'https://www.fulfill1st.com', 'http://localhost:5174','http://192.168.68.129:5173','http://192.168.68.9:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ Session Store Configuration
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

sessionStore.onReady().then(() => {
  console.log('✅ Session store connected');
}).catch(error => {
  console.error('❌ Session store connection failed:', error);
});

// ✅ Session Middleware (COOKIE FIXES HERE)
app.use(
  session({
    key: "fulfill1st.sid",
    secret: process.env.SESSION_SECRET || "your-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // Must be true for HTTPS
      sameSite: "none", // Required for cross-site cookies
      //  secure: false, // Must be true for HTTP
      // maxAge: 24 * 60 * 60 * 1000 // 1 day
      // ❌ DO NOT set domain unless backend has custom domain
    },
  })
);


// ✅ Debug session on every request
app.use((req, res, next) => {
  console.log('🧩 Session Info:', {
    sessionId: req.sessionID,
    userId: req.session.userId,
    ip: req.ip,
    method: req.method,
    path: req.path
  });
  next();
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/fulfillment', fulfillmentRoutes);
app.use('/api/ratingsreview', ratingsreviewRoutes);

// ✅ Session Check Route
app.get('/api/users/session-check', (req, res) => {
  console.log('🔍 Session object:', req.session);

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

// ✅ Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    sessionStore: sessionStore.ready ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ✅ Error Handling
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

// ✅ Start Server
const server = app.listen(PORT, () => {
  console.log(`
  🔗 Running at: http://localhost:${PORT}
  📅 Started: ${new Date().toLocaleString()}
  ✅ Session Store: ${sessionStore.ready ? 'Connected' : 'Disconnected'}
  `);
});

// ✅ Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    pool.end();
    console.log('Server terminated');
  });
});