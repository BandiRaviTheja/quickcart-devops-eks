const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  adminLogin,
  getProfile, 
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStats
} = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');

// =====================
// PUBLIC AUTH ROUTES
// =====================

// Customer registration and login
router.post('/register', register);
router.post('/login', login);

// Admin login (only for users with isAdmin = true)
router.post('/admin-login', adminLogin);

// =====================
// PROTECTED ROUTES
// =====================

// Customer profile management
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// =====================
// ADMIN USER MANAGEMENT ROUTES
// =====================

// Get all users (admin only)
router.get('/users', verifyToken, verifyAdmin, getAllUsers);

// Update user role (admin only)
router.put('/users/:id/role', verifyToken, verifyAdmin, updateUserRole);

// Delete user (admin only)
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);

// Get user statistics (admin only)
router.get('/stats', verifyToken, verifyAdmin, getUserStats);

module.exports = router;