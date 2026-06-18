const express = require('express');
const cors = require('cors');
require('dotenv').config();

const paymentRoutes = require('./routes/payment');
const sequelize = require('./config/database');

const app = express();

// Middleware for webhook (must be before express.json())
app.use('/api/payments/webhook', express.raw({type: 'application/json'}));

// Regular middleware for other routes
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'payment',
    timestamp: new Date().toISOString()
  });
});

// Database sync
sequelize.sync()
  .then(() => {
    console.log('Payment service DB connected and synced');
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});

module.exports = app;