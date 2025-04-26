const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE, COOKIE_EXPIRE } = require('../config/auth');
const { sendOTP } = require('../utils/otpService');

exports.register = async (req, res) => {
    try {
        const { national_id, full_name, password, email, phone } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findByNationalId(national_id);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const userId = await User.create({ national_id, full_name, password, email, phone });
        
        // Send OTP for verification
        await sendOTP(phone || email);

        res.status(201).json({ 
            success: true, 
            message: 'User registered successfully. Please verify your account.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { national_id, password } = req.body;
        
        // Check if user exists
        const user = await User.findByNationalId(national_id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if account is verified
        if (!user.is_verified) {
            return res.status(403).json({ 
                success: false, 
                message: 'Account not verified. Please verify your account.' 
            });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

        // Set cookie
        res.cookie('token', token, {
            expires: new Date(Date.now() + COOKIE_EXPIRE),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ 
            success: true, 
            token, 
            user: { 
                id: user.id, 
                national_id: user.national_id, 
                full_name: user.full_name 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add other auth methods (logout, verify, password reset, etc.)