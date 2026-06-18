const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'usd',
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'canceled'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
  },
  stripePaymentIntentId: {
    type: DataTypes.STRING,
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
  },
  receiptUrl: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true,
});

module.exports = Payment;