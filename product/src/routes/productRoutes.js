const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// GET /api/products - Get all products
router.get('/', productController.getProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', productController.getProduct);

// GET /api/products/customer/:id - Get product for customer frontend (with color images)
router.get('/customer/:id', productController.getProductForCustomer);

// POST /api/products - Create new product WITHOUT file upload (JSON)
router.post('/', productController.createProduct);

// ✅ FIXED: POST /api/products/upload - Create new product WITH MULTIPLE file upload
router.post('/upload', upload.any(), productController.createProduct);

// ✅ FIXED: PUT /api/products/:id - Update product with MULTIPLE file upload
router.put('/:id', upload.any(), productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;