const express = require('express');
const router = express.Router();
const {
  createPayment,
  confirmPayment,
  getPayment,
  getUserPayments,
  handleStripeWebhook
} = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/verifyToken');

// Webhook (no auth needed - Stripe calls this)
router.post('/webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

// Protected routes
router.post('/create-payment-intent', verifyToken, createPayment);
router.post('/confirm-payment', verifyToken, confirmPayment);
router.get('/:paymentId', verifyToken, getPayment);
router.get('/', verifyToken, getUserPayments);

module.exports = router;