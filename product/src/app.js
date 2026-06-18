const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const seedProducts = require('./utils/seedProducts');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', productRoutes);

// ALB Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'product-service',
    timestamp: new Date().toISOString()
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // ✅ SYNC DATABASE WITH NEW FIELDS
    await sequelize.sync({ alter: true });
    console.log('Database synchronized with new fields (colorImages, inventory).');
    
    await seedProducts();
    
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Product service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;