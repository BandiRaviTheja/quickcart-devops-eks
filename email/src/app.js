const express = require('express');
const cors = require('cors');
require('dotenv').config();

const emailRoutes = require('./routes/email');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/email', emailRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'email',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'QuickCart Email Service API',
    version: '1.0.0',
    endpoints: [
      'POST /api/email/order-confirmation',
      'POST /api/email/payment-confirmation',
      'POST /api/email/welcome',
      'POST /api/email/shipping-update',
      'POST /api/email/order-cancellation',
      'POST /api/email/test'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`🚀 Email service running on port ${PORT}`);
  console.log(`📧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;