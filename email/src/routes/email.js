const express = require('express');
const router = express.Router();
const {
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendWelcomeEmailToUser,
  sendShippingUpdateEmail,
  sendOrderCancellationEmail,
  testEmailService
} = require('../controllers/emailController');

// Email routes
router.post('/order-confirmation', sendOrderConfirmationEmail);
router.post('/payment-confirmation', sendPaymentConfirmationEmail);
router.post('/welcome', sendWelcomeEmailToUser);
router.post('/shipping-update', sendShippingUpdateEmail);
router.post('/order-cancellation', sendOrderCancellationEmail);
router.post('/test', testEmailService);

module.exports = router;