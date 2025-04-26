const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/register', [
    check('national_id', 'National ID is required').not().isEmpty(),
    check('full_name', 'Full name is required').not().isEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('phone', 'Please include a valid phone number').optional().isMobilePhone()
], validationMiddleware, authController.register);

router.post('/login', [
    check('national_id', 'National ID is required').not().isEmpty(),
    check('password', 'Password is required').exists()
], validationMiddleware, authController.login);

// Add other auth routes (logout, verify, password reset, etc.)

module.exports = router;