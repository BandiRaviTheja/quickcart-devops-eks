const Order = require('../models/Order');

// Create new order from cart
const createOrder = async (req, res) => {
  try {
    const { cartItems, address, totalAmount } = req.body;
    const userId = req.user.userId;

    if (!cartItems || !address || !totalAmount) {
      return res.status(400).json({ error: 'Cart items, address, and total amount are required' });
    }

    // Validate cart items structure
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items must be a non-empty array' });
    }

    // Validate address structure
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      return res.status(400).json({ error: 'Complete address details are required' });
    }

    // Validate total amount
    if (totalAmount <= 0) {
      return res.status(400).json({ error: 'Total amount must be greater than 0' });
    }

    const order = await Order.create({
      userId,
      products: cartItems,
      amount: totalAmount,
      address,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const orders = await Order.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Orders retrieved successfully',
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Orders retrieved successfully',
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({
      where: { id: orderId, userId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order retrieved successfully',
      order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    
    // ✅ FIXED: If payment is paid, update order status to confirmed and set paidAt
    if (paymentStatus === 'paid') {
      order.status = 'confirmed';
      order.paidAt = new Date();
      console.log(`✅ Order ${orderId} status updated to CONFIRMED and PAID with paidAt: ${order.paidAt}`);
    }

    await order.save();

    res.json({
      message: 'Payment status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete order (Admin only)
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(`🗑️ Attempting to delete order ID: ${orderId}`);

    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Store order info for logging before deletion
    const orderInfo = {
      id: order.id,
      amount: order.amount,
      status: order.status,
      paymentStatus: order.paymentStatus
    };
    
    await order.destroy();

    console.log(`✅ Order deleted successfully:`, orderInfo);
    res.status(200).json({ 
      message: 'Order deleted successfully',
      deletedOrder: orderInfo
    });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
};