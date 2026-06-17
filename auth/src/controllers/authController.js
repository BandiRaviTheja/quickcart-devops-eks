const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { username, email, password, name, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create user with complete profile
    const user = await User.create({
      username,
      email,
      password,
      profile: {
        name: name || '',
        phone: phone || '',
        addresses: []
      },
      isAdmin: false,
      role: 'customer'
    });

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    const userResponse = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await User.findOne({ 
      where: { 
        email: email,
        isAdmin: true 
      } 
    });
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { 
        userId: admin.id, 
        email: admin.email,
        username: admin.username,
        isAdmin: admin.isAdmin
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '8h' }
    );

    const adminResponse = await User.findByPk(admin.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Admin login successful',
      user: adminResponse,
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      error: 'Server error during admin login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure profile has proper structure
    const userWithProfile = {
      ...user.toJSON(),
      profile: {
        name: user.profile?.name || '',
        phone: user.profile?.phone || '',
        addresses: user.profile?.addresses || [],
        ...user.profile
      }
    };

    res.json(userWithProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, profile } = req.body;

    console.log('🔄 Update profile request for user:', userId);
    console.log('📨 Request body:', JSON.stringify(req.body, null, 2));

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('📊 Current user profile:', user.profile);

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // FIXED: Create updated profile without the problematic spread operator at the end
    const updatedProfile = {
      ...user.profile, // Start with existing profile data (including addresses)
      ...(profile || {}) // Then override with new profile data
    };

    // Specifically update name and phone if provided in the profile
    if (profile?.name !== undefined) {
      updatedProfile.name = profile.name;
    }
    if (profile?.phone !== undefined) {
      updatedProfile.phone = profile.phone;
    }

    // Ensure addresses array exists
    if (!updatedProfile.addresses) {
      updatedProfile.addresses = [];
    }

    console.log('🆕 Updated profile will be:', updatedProfile);

    await user.update({
      ...(username && { username }),
      ...(email && { email }),
      profile: updatedProfile
    });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    console.log('✅ Final updated user:', JSON.stringify(updatedUser.toJSON(), null, 2));

    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin functions
const getAllUsers = async (req, res) => {
  try {
    console.log('🔄 Fetching all users...');
    
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${users.length} users`);
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    console.log(`🔄 Updating user role for ID: ${userId} to: ${role}`);

    if (!role || !['admin', 'customer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "admin" or "customer"' });
    }

    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot modify your own role' });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      role: role,
      isAdmin: role === 'admin'
    });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    console.log(`✅ User role updated successfully: ${user.username} is now ${role}`);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log(`🗑️ Attempting to delete user ID: ${userId}`);

    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isAdmin) {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    const userInfo = `${user.profile?.name || user.username} (${user.email})`;
    
    await user.destroy();

    console.log(`✅ User deleted successfully: ${userInfo}`);
    res.status(200).json({ 
      message: 'User deleted successfully',
      deletedUser: { id: userId, email: user.email, username: user.username }
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const adminUsers = await User.count({ where: { isAdmin: true } });
    const customerUsers = totalUsers - adminUsers;

    res.status(200).json({
      totalUsers,
      adminUsers,
      customerUsers
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserStats
};
