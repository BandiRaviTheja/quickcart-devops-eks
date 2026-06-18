const Order = require('../models/Order');
const sequelize = require('../config/database');

const seedOrders = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced for order seeding');

    const orders = [
      {
        userId: '731ed03d-cc03-4026-ac22-3577183b3309', // Your test user
        products: [
          {
            productId: '54db3c41-1888-4d26-b36d-45180a9d03b4',
            title: 'Mens Casual Premium Slim Fit T-Shirts',
            price: 22.30,
            quantity: 2,
            img: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg'
          }
        ],
        amount: 44.60,
        address: {
          type: 'home',
          street: '123 Test Street',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA',
          isDefault: true
        },
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        userId: '731ed03d-cc03-4026-ac22-3577183b3309',
        products: [
          {
            productId: '67eb3c41-1999-5e37-c47e-55180b9d04c5',
            title: 'Wireless Bluetooth Headphones',
            price: 49.99,
            quantity: 1,
            img: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg'
          }
        ],
        amount: 49.99,
        address: {
          type: 'home',
          street: '123 Test Street',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'USA',
          isDefault: true
        },
        status: 'shipped',
        paymentStatus: 'paid'
      }
    ];

    for (const orderData of orders) {
      const existingOrder = await Order.findOne({ 
        where: { 
          userId: orderData.userId,
          amount: orderData.amount
        } 
      });
      
      if (!existingOrder) {
        await Order.create(orderData);
        console.log(`Order created for user: ${orderData.userId}`);
      }
    }

    console.log('Orders seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding orders:', error);
  }
};

if (require.main === module) {
  seedOrders();
}

module.exports = seedOrders;