require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: '24h',
    COOKIE_EXPIRE: 24 * 60 * 60 * 1000, // 24 hours
    PASSWORD_RESET_EXPIRE: 3600000 // 1 hour
};