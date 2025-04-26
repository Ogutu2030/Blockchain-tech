const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const voteRoutes = require('./routes/voteRoutes');
const electionRoutes = require('./routes/electionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Set CSRF token for all routes
app.use((req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vote', voteRoutes);
app.use('/api/v1/elections', electionRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Server error', 
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

module.exports = app;