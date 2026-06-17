const Cart = require('../models/Cart');

const clearTestCarts = async () => {
  try {
    // Clear any test carts on startup (optional)
    await Cart.destroy({
      where: {},
      truncate: true
    });
    console.log('Test carts cleared successfully');
  } catch (error) {
    console.error('Error clearing test carts:', error);
  }
};

// Add sample cart items for testing
const seedSampleCarts = async () => {
  try {
    const cartCount = await Cart.count();
    
    if (cartCount === 0 && process.env.SEED_SAMPLE_DATA === 'true') {
      console.log('Seeding sample cart data...');
      
      const sampleCarts = [
        {
          userId: 'test-user-1',
          productId: '54db3c41-1888-4d26-b36d-45180a9d03b4', // From products
          quantity: 2,
          price: 22.30,
          title: 'Mens Casual Premium Slim Fit T-Shirts',
          img: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
        },
        {
          userId: 'test-user-1', 
          productId: '1347c77a-adcf-4dba-a6ac-436d236aae0a', // From products
          quantity: 1,
          price: 55.99,
          title: 'Mens Cotton Jacket',
          img: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg'
        }
      ];

      await Cart.bulkCreate(sampleCarts);
      console.log('Sample cart data seeded successfully');
    } else {
      console.log(`Cart service already has ${cartCount} cart items`);
    }
  } catch (error) {
    console.error('Error seeding cart data:', error);
  }
};

module.exports = { clearTestCarts, seedSampleCarts };