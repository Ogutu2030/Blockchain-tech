const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/authMiddleware');

// Add admin routes here
router.get('/dashboard', protect, adminProtect, (req, res) => {
    res.json({ success: true, message: 'Admin dashboard' });
});

module.exports = router;

