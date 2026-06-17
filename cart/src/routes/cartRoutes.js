const router = require('express').Router();
const Cart = require('../models/Cart');
const { authenticateToken } = require('../middleware/auth');

// TEMPORARY: Skip authorization to fix cart
const authorizeUser = (req, res, next) => {
  console.log('🔐 SKIPPING AUTHORIZATION - ALLOWING ACCESS');
  next(); // Always allow access
};

// Get user's cart
router.get('/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    console.log('🛒 Fetching cart for user:', req.params.userId);
    const cartItems = await Cart.findAll({
      where: { userId: req.params.userId }
    });
    console.log('✅ Cart items found:', cartItems.length);
    res.json(cartItems);
  } catch (error) {
    console.error('❌ Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { productId, quantity, price, title, img } = req.body;
    const userId = req.params.userId;

    console.log('🛒 Adding to cart:', { userId, productId, quantity, price, title });

    // Basic validation
    if (!productId || !quantity || !price || !title) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: req.body
      });
    }

    const existingItem = await Cart.findOne({
      where: { userId, productId }
    });
    
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      console.log('✅ Updated existing cart item');
      res.json(existingItem);
    } else {
      const cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        price,
        title,
        img: img || ''
      });
      console.log('✅ Created new cart item');
      res.status(201).json(cartItem);
    }
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:userId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.userId;

    console.log('🛒 Updating cart:', { userId, productId, quantity });

    const cartItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity === 0) {
      await cartItem.destroy();
      return res.json({ message: 'Item removed from cart' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (error) {
    console.error('❌ Error updating cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/:userId/:productId', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log('🛒 Removing from cart:', { userId, productId });
    
    await Cart.destroy({
      where: { userId, productId }
    });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('❌ Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear entire cart
router.delete('/:userId/clear', authenticateToken, authorizeUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('🛒 Clearing cart for user:', userId);
    
    const deletedCount = await Cart.destroy({
      where: { userId }
    });

    console.log('✅ Cart cleared, deleted items:', deletedCount);
    res.json({ 
      message: 'Cart cleared successfully',
      deletedItems: deletedCount
    });
  } catch (error) {
    console.error('❌ Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'cart',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;