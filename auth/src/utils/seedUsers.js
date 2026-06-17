const User = require('../models/User');
const sequelize = require('../config/database');

const seedUsers = async () => {
  try {
    // Sync database without dropping existing tables
    await sequelize.sync({ force: false });
    console.log('Database synced for seeding');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'rark21ec@cmrit.ac.in' } });

    if (!existingAdmin) {
      // Create default admin user
      await User.create({
        username: 'rajesh',
        email: 'rark21ec@cmrit.ac.in',
        password: '12345678',
        isAdmin: true,
        profile: {
          name: 'Rajesh',
          phone: '',
          addresses: []
        }
      });
      console.log('Default admin user created: rajesh');
    } else {
      console.log('Admin user already exists, skipping creation.');
    }

    console.log('User seeding completed - database ready for user registration');

  } catch (error) {
    console.error('Error during user seeding:', error);
  }
};

// Run seed script if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = seedUsers;
