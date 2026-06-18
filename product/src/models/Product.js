const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.TEXT,
  },
  img: {
    type: DataTypes.STRING,
  },
  categories: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  size: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  color: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  // ✅ NEW FIELDS ADDED
  colorImages: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  inventory: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;