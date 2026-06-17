const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require('../controllers/addressController');

router.post('/', verifyToken, addAddress);
router.get('/', verifyToken, getAddresses);
router.put('/:addressId', verifyToken, updateAddress);
router.delete('/:addressId', verifyToken, deleteAddress);

module.exports = router;