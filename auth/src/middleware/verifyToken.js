const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token signature and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(401).json({ error: 'Token verification failed' });
    }
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    // Check if user is admin from token
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Optional: Verify admin status from database for extra security
    try {
      const user = await User.findByPk(req.user.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ error: 'Admin privileges revoked' });
      }
    } catch (dbError) {
      console.error('Database verification error:', dbError);
      // Continue with token verification if DB check fails
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ error: 'Server error during admin verification' });
  }
};

module.exports = { verifyToken, verifyAdmin };