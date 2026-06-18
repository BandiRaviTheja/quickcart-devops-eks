const Product = require('../models/Product');

const initialProducts = [
  // REMOVED ALL PRODUCTS - EMPTY ARRAY
];

const seedProducts = async () => {
  try {
    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate(initialProducts);
      console.log('No sample products to insert (array is empty)');
    } else {
      console.log('Products already exist, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

module.exports = seedProducts;