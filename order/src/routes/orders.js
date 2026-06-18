const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
} = require('../controllers/ordersController');
const { verifyToken, verifyAdmin } = require('../middleware/verifyToken');

// User routes
router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);
router.get('/:orderId', verifyToken, getOrderById);

// Admin routes (status updates)
router.get('/admin/all', verifyToken, verifyAdmin, getAllOrders);
router.put('/:orderId/status', verifyToken, verifyAdmin, updateOrderStatus);
router.put('/:orderId/payment-status', verifyToken, verifyAdmin, updatePaymentStatus);
router.delete('/:orderId', verifyToken, verifyAdmin, deleteOrder);

module.exports = router;