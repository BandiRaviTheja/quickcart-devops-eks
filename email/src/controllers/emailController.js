const {
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendWelcomeEmail,
  sendShippingUpdate,
  sendOrderCancellation
} = require('../services/emailService');

// Send order confirmation email
const sendOrderConfirmationEmail = async (req, res) => {
  try {
    const { orderData, userEmail } = req.body;

    if (!orderData || !userEmail) {
      return res.status(400).json({ error: 'Order data and user email are required' });
    }

    console.log('🔄 Processing order confirmation email request...');
    const result = await sendOrderConfirmation(orderData, userEmail);

    res.json({
      message: 'Order confirmation email sent successfully',
      emailId: result.messageId
    });
  } catch (error) {
    console.error('Send order confirmation error:', error);
    res.status(500).json({ error: 'Failed to send order confirmation email' });
  }
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (req, res) => {
  try {
    const { paymentData, userEmail } = req.body;

    if (!paymentData || !userEmail) {
      return res.status(400).json({ error: 'Payment data and user email are required' });
    }

    console.log('🔄 Processing payment confirmation email request...');
    const result = await sendPaymentConfirmation(paymentData, userEmail);

    res.json({
      message: 'Payment confirmation email sent successfully',
      emailId: result.messageId
    });
  } catch (error) {
    console.error('Send payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to send payment confirmation email' });
  }
};

// Send welcome email
const sendWelcomeEmailToUser = async (req, res) => {
  try {
    const { userData } = req.body;

    if (!userData || !userData.email) {
      return res.status(400).json({ error: 'User data with email is required' });
    }

    console.log('🔄 Processing welcome email request...');
    const result = await sendWelcomeEmail(userData);

    res.json({
      message: 'Welcome email sent successfully',
      emailId: result.messageId
    });
  } catch (error) {
    console.error('Send welcome email error:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
};

// Send shipping update email
const sendShippingUpdateEmail = async (req, res) => {
  try {
    const { orderData, userEmail, status } = req.body;

    if (!orderData || !userEmail || !status) {
      return res.status(400).json({ error: 'Order data, user email, and status are required' });
    }

    console.log('🔄 Processing shipping update email request...');
    const result = await sendShippingUpdate(orderData, userEmail, status);

    res.json({
      message: 'Shipping update email sent successfully',
      emailId: result.messageId
    });
  } catch (error) {
    console.error('Send shipping update error:', error);
    res.status(500).json({ error: 'Failed to send shipping update email' });
  }
};

// Send order cancellation email
const sendOrderCancellationEmail = async (req, res) => {
  try {
    const { orderData, userEmail } = req.body;

    if (!orderData || !userEmail) {
      return res.status(400).json({ error: 'Order data and user email are required' });
    }

    console.log('🔄 Processing order cancellation email request...');
    const result = await sendOrderCancellation(orderData, userEmail);

    res.json({
      message: 'Order cancellation email sent successfully',
      emailId: result.messageId
    });
  } catch (error) {
    console.error('Send order cancellation error:', error);
    res.status(500).json({ error: 'Failed to send order cancellation email' });
  }
};

// Test email service
const testEmailService = async (req, res) => {
  try {
    const testUserData = {
      username: 'Test User',
      email: process.env.TEST_EMAIL || 'test@example.com'
    };

    console.log('🧪 Testing email service...');
    const result = await sendWelcomeEmail(testUserData);

    res.json({
      message: 'Test email sent successfully',
      emailId: result.messageId,
      to: testUserData.email
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendWelcomeEmailToUser,
  sendShippingUpdateEmail,
  sendOrderCancellationEmail,
  testEmailService
};