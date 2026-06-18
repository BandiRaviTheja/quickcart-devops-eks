const Payment = require('../models/Payment');
const { createPaymentIntent, confirmPaymentIntent, handleWebhook } = require('../utils/stripe');
const axios = require('axios');

// Create payment intent
const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user.userId;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await createPaymentIntent(amount);

    // Save payment record
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id
    });

    res.status(201).json({
      message: 'Payment intent created successfully',
      paymentId: payment.id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Confirm payment
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.userId;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await confirmPaymentIntent(paymentIntentId);

    // Find and update payment record
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId, userId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status based on Stripe status
    payment.status = paymentIntent.status === 'succeeded' ? 'succeeded' : 'failed';
    payment.paymentMethod = paymentIntent.payment_method_types[0];
    payment.receiptUrl = paymentIntent.charges?.data[0]?.receipt_url;

    await payment.save();

    // If payment succeeded, update order status
    if (payment.status === 'succeeded') {
      try {
        const ordersServiceUrl = process.env.ORDERS_SERVICE_URL || 'http://localhost:5003';
        
        await axios.put(
          `${ordersServiceUrl}/api/orders/${payment.orderId}/payment-status`,
          { paymentStatus: 'paid' },
          { headers: { Authorization: req.headers.authorization } }
        );
        console.log(`✅ Order ${payment.orderId} updated to PAID via Orders Service`);
      } catch (orderError) {
        console.error('Failed to update order status:', orderError.message);
      }
    }

    res.json({
      message: `Payment ${payment.status}`,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        receiptUrl: payment.receiptUrl
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get payment by ID
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.userId;

    const payment = await Payment.findOne({
      where: { id: paymentId, userId }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      message: 'Payment retrieved successfully',
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user's payments
const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.userId;

    const payments = await Payment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'Payments retrieved successfully',
      payments
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Stripe webhook handler
const handleStripeWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const payload = req.body;

    const event = await handleWebhook(payload, sig);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update payment status in database
        await Payment.update(
          { status: 'succeeded' },
          { where: { stripePaymentIntentId: paymentIntent.id } }
        );
        
        // Update order status
        const payment = await Payment.findOne({
          where: { stripePaymentIntentId: paymentIntent.id }
        });
        
        if (payment) {
          try {
            const ordersServiceUrl = process.env.ORDERS_SERVICE_URL || 'http://localhost:5003';
            
            await axios.put(
              `${ordersServiceUrl}/api/orders/${payment.orderId}/payment-status`,
              { paymentStatus: 'paid' }
            );
            console.log(`✅ Webhook: Order ${payment.orderId} updated to PAID via Orders Service`);
          } catch (webhookError) {
            console.error('Webhook: Failed to update order status:', webhookError.message);
          }
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        
        await Payment.update(
          { status: 'failed' },
          { where: { stripePaymentIntentId: failedPaymentIntent.id } }
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
  }
};

module.exports = {
  createPayment,
  confirmPayment,
  getPayment,
  getUserPayments,
  handleStripeWebhook
};