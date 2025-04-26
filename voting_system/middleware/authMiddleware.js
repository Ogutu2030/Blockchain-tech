const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

exports.protect = async (req, res, next) => {
    let token;
    
    // Get token from cookie or header
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized to access this route' 
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ 
            success: false, 
            message: 'Not authorized to access this route' 
        });
    }
};

exports.adminProtect = (req, res, next) => {
    // Check if user is admin (you'll need to implement this in your User model)
    if (!req.user.isAdmin) {
        return res.status(403).json({ 
            success: false, 
            message: 'Not authorized as admin' 
        });
    }
    next();
};