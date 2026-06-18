const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ordersRoutes = require('./routes/orders');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', ordersRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'orders',
    timestamp: new Date().toISOString()
  });
});

sequelize.sync()
  .then(() => {
    console.log('Orders service DB connected and synced');
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Orders service running on port ${PORT}`);
});

module.exports = app;