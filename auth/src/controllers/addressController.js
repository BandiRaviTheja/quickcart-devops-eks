const User = require('../models/User');

const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, street, city, state, zipCode, country, isDefault } = req.body;

    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ error: 'All address fields are required' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // FIX: Get addresses from profile.addresses, not user.addresses
    let addresses = user.profile?.addresses || [];

    const shouldBeDefault = addresses.length === 0 ? true : (isDefault || false);

    const newAddress = {
      id: `addr_${Date.now()}`,
      type: type || 'home',
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.toString().trim(),
      country: country.trim(),
      isDefault: shouldBeDefault
    };

    if (shouldBeDefault && addresses.length > 0) {
      addresses = addresses.map(addr => ({ 
        ...addr, 
        isDefault: false 
      }));
    }

    addresses.push(newAddress);
    
    // FIX: Update profile.addresses, not addresses directly
    await User.update(
      { 
        profile: {
          ...user.profile,
          addresses: addresses
        }
      },
      { where: { id: userId } }
    );

    res.status(201).json({ 
      message: 'Address added successfully', 
      address: newAddress,
      addresses: addresses
    });
  } catch (error) {
    console.error('Error in addAddress:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // FIX: Get addresses from profile.addresses
    const addresses = user.profile?.addresses || [];

    res.json({ 
      addresses: addresses,
      count: addresses.length 
    });
  } catch (error) {
    console.error('Error in getAddresses:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // FIX: Get addresses from profile.addresses
    let addresses = user.profile?.addresses || [];
    const addressIndex = addresses.findIndex(addr => addr.id === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    if (updateData.isDefault === true) {
      addresses = addresses.map(addr => ({ 
        ...addr, 
        isDefault: addr.id === addressId ? true : false 
      }));
    } else {
      addresses[addressIndex] = { 
        ...addresses[addressIndex], 
        ...updateData 
      };
    }
    
    // FIX: Update profile.addresses
    await User.update(
      { 
        profile: {
          ...user.profile,
          addresses: addresses
        }
      },
      { where: { id: userId } }
    );

    res.json({ 
      message: 'Address updated successfully', 
      address: addresses[addressIndex],
      addresses: addresses
    });
  } catch (error) {
    console.error('Error in updateAddress:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // FIX: Get addresses from profile.addresses
    let addresses = user.profile?.addresses || [];
    const addressToDelete = addresses.find(addr => addr.id === addressId);
    
    if (!addressToDelete) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const wasDefault = addressToDelete.isDefault;
    addresses = addresses.filter(addr => addr.id !== addressId);
    
    if (wasDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }
    
    // FIX: Update profile.addresses
    await User.update(
      { 
        profile: {
          ...user.profile,
          addresses: addresses
        }
      },
      { where: { id: userId } }
    );

    res.json({ 
      message: 'Address deleted successfully',
      addresses: addresses
    });
  } catch (error) {
    console.error('Error in deleteAddress:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
};