const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const cartRoutes = require('./routes/cartRoutes');
const { clearTestCarts, seedSampleCarts } = require('./utils/seedCart');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cart', cartRoutes);

// ALB Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'cart-service',
    timestamp: new Date().toISOString()
  });
});

// Database sync and startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Cart service DB connected');
    
    await sequelize.sync();
    console.log('Cart tables synchronized');
    
    // Clear test data and seed samples
    await clearTestCarts();
    await seedSampleCarts();
    
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`Cart service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;