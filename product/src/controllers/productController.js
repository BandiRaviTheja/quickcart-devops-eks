const Product = require('../models/Product');
const { s3 } = require('../config/aws');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3'); // ADD THIS FOR SDK v3

// Helper function to delete files from S3 - UPDATED FOR SDK v3
const deleteFromS3 = async (fileUrl) => {
  if (!fileUrl || !fileUrl.includes('amazonaws.com')) {
    console.log('Not an S3 URL or URL is empty:', fileUrl);
    return;
  }

  try {
    // Extract the key from the URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(3).join('/'); // Remove the domain parts
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key
    };

    // ✅ AWS SDK v3 syntax - no .promise() needed
    await s3.send(new DeleteObjectCommand(params));
    console.log('✅ Successfully deleted from S3:', key);
  } catch (error) {
    console.error('❌ Error deleting from S3:', error);
    // Don't throw error, just log it - don't stop product deletion if S3 deletion fails
  }
};

// Get all products - UPDATED WITH COLOR IMAGES
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    
    // Transform data for frontend
    const transformedProducts = products.map(product => ({
      ...product.toJSON(),
      // Ensure colorImages is always an object
      colorImages: product.colorImages || {},
      // Ensure inventory is always an object
      inventory: product.inventory || {}
    }));
    
    res.status(200).json(transformedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID - UPDATED WITH COLOR IMAGES
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Transform product data
    const productData = {
      ...product.toJSON(),
      colorImages: product.colorImages || {},
      inventory: product.inventory || {}
    };
    
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product for customer frontend with optimized data
exports.getProductForCustomer = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Transform data for customer frontend
    const customerProduct = {
      id: product.id,
      title: product.title,
      desc: product.desc,
      img: product.img,
      price: product.price,
      categories: product.categories,
      size: product.size,
      color: product.color,
      inStock: product.inStock,
      // Include color images for frontend
      colorImages: product.colorImages || {},
      // Include inventory for stock checking
      inventory: product.inventory || {}
    };
    
    res.status(200).json(customerProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create product - COMPLETELY FIXED INVENTORY HANDLING
exports.createProduct = async (req, res) => {
  console.log('🎯 CREATE PRODUCT CALLED');
  console.log('Request Body:', req.body);
  console.log('Request Files:', req.files);
  
  // ✅ DEBUG: Check what's being sent
  console.log('=== 🎯 DEBUG INVENTORY DATA ===');
  console.log('Inventory field exists:', !!req.body.inventory);
  console.log('Inventory field type:', typeof req.body.inventory);
  console.log('Inventory field value:', req.body.inventory);
  console.log('=== 🎯 END DEBUG ===');
  
  try {
    // Process array fields from strings to arrays
    const processArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        return field.split(',').map(item => item.trim()).filter(item => item);
      }
      return [];
    };

    const productData = {
      title: req.body.title,
      desc: req.body.desc || '',
      price: parseFloat(req.body.price) || 0,
      categories: processArrayField(req.body.categories),
      size: processArrayField(req.body.size),
      color: processArrayField(req.body.color),
      inStock: req.body.inStock === 'true' || req.body.inStock === true,
      img: req.body.img || '',
      colorImages: {},
      inventory: {} // Initialize empty
    };

    // ✅ HANDLE MULTIPLE FILES
    if (req.files && req.files.length > 0) {
      // Find main image
      const mainImage = req.files.find(file => file.fieldname === 'img');
      if (mainImage) {
        productData.img = mainImage.location;
        console.log('📸 Main image:', mainImage.location);
      }

      // ✅ SAVE COLOR IMAGES TO DATABASE
      const colorImages = req.files.filter(file => file.fieldname.startsWith('colorImage_'));
      if (colorImages.length > 0) {
        console.log('🎨 Color images found:', colorImages.length);
        
        const colorImageMap = {};
        colorImages.forEach((file, index) => {
          const colorName = req.body[`color_${index}`];
          if (colorName) {
            colorImageMap[colorName] = file.location;
            console.log(`✅ Color image ${colorName}:`, file.location);
          }
        });
        
        productData.colorImages = colorImageMap;
      }
    }

    // ✅ FIXED: PROPER INVENTORY HANDLING
    console.log('📦 Processing inventory data...');

    let inventoryData = {};
    const colors = productData.color || [];
    const sizes = productData.size || [];

    // Always create inventory structure if colors and sizes exist
    if (colors.length > 0 && sizes.length > 0) {
      colors.forEach(color => {
        inventoryData[color] = {};
        sizes.forEach(size => {
          // Check if we have existing inventory data for this color-size combination
          let quantity = 10; // Default
          let price = productData.price; // Default to base price
          
          // If inventory was provided in request, use those values
          if (req.body.inventory && req.body.inventory !== '{}') {
            try {
              const receivedInventory = typeof req.body.inventory === 'string' 
                ? JSON.parse(req.body.inventory) 
                : req.body.inventory;
              
              if (receivedInventory[color] && receivedInventory[color][size]) {
                quantity = parseInt(receivedInventory[color][size].quantity) || 10;
                price = parseFloat(receivedInventory[color][size].price) || productData.price;
              }
            } catch (e) {
              console.error('Error parsing received inventory:', e.message);
            }
          }
          
          inventoryData[color][size] = {
            quantity: quantity,
            price: price
          };
        });
      });
      
      productData.inventory = inventoryData;
      console.log('✅ Inventory created successfully:', Object.keys(inventoryData));
    } else {
      productData.inventory = {};
      console.log('⚠️ No inventory created - missing colors or sizes');
    }

    console.log('🔄 Final product data to save:', {
      title: productData.title,
      price: productData.price,
      colors: productData.color,
      colorImagesCount: Object.keys(productData.colorImages).length,
      inventoryCount: Object.keys(productData.inventory).length,
      hasInventoryData: Object.keys(productData.inventory).length > 0
    });

    // Validate required fields
    if (!productData.title || !productData.price) {
      return res.status(400).json({ 
        error: 'Title and price are required'
      });
    }

    const newProduct = await Product.create(productData);
    
    console.log('✅ Product created successfully with all data! ID:', newProduct.id);
    console.log('🎯 Final saved product:', {
      id: newProduct.id,
      title: newProduct.title,
      colorImages: newProduct.colorImages,
      inventory: newProduct.inventory
    });
    
    res.status(201).json(newProduct);
    
  } catch (err) {
    console.error('❌ ERROR creating product:', err);
    console.error('Error message:', err.message);
    
    res.status(500).json({ 
      error: 'Failed to create product',
      message: err.message
    });
  }
};

// Update product - UPDATED FOR NEW FIELDS
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    const updateData = { ...req.body };
    
    // Process array fields if they exist
    if (req.body.categories) {
      updateData.categories = Array.isArray(req.body.categories) 
        ? req.body.categories 
        : req.body.categories.split(',').map(c => c.trim()).filter(c => c);
    }
    if (req.body.size) {
      updateData.size = Array.isArray(req.body.size)
        ? req.body.size
        : req.body.size.split(',').map(s => s.trim()).filter(s => s);
    }
    if (req.body.color) {
      updateData.color = Array.isArray(req.body.color)
        ? req.body.color
        : req.body.color.split(',').map(c => c.trim()).filter(c => c);
    }
    
    // ✅ HANDLE MULTIPLE FILES AND NEW FIELDS
    if (req.files && req.files.length > 0) {
      const mainImage = req.files.find(file => file.fieldname === 'img');
      if (mainImage) {
        updateData.img = mainImage.location;
      }

      // Handle color images in update
      const colorImages = req.files.filter(file => file.fieldname.startsWith('colorImage_'));
      if (colorImages.length > 0) {
        const colorImageMap = { ...product.colorImages }; // Keep existing
        colorImages.forEach((file, index) => {
          const colorName = req.body[`color_${index}`];
          if (colorName) {
            colorImageMap[colorName] = file.location;
          }
        });
        updateData.colorImages = colorImageMap;
      }
    }

    // Handle inventory in update
    if (req.body.inventory) {
      try {
        let inventoryData;
        if (typeof req.body.inventory === 'string') {
          inventoryData = JSON.parse(req.body.inventory);
        } else {
          inventoryData = req.body.inventory;
        }
        updateData.inventory = inventoryData;
      } catch (e) {
        console.error('Inventory parse error in update:', e.message);
        updateData.inventory = req.body.inventory;
      }
    }
    
    await product.update(updateData);
    
    console.log('✅ Product updated successfully:', req.params.id);
    res.status(200).json(product);
  } catch (err) {
    console.error('❌ ERROR updating product:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete product - UPDATED TO DELETE S3 IMAGES
exports.deleteProduct = async (req, res) => {
  try {
    console.log('🗑️ Starting product deletion process...');
    
    // First, find the product to get image URLs
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('📸 Product found, preparing to delete images from S3...');
    console.log('Main image URL:', product.img);
    console.log('Color images:', product.colorImages);

    // Array to store all image deletion promises
    const deletePromises = [];

    // Delete main product image from S3
    if (product.img) {
      console.log('🗑️ Deleting main image from S3...');
      deletePromises.push(deleteFromS3(product.img));
    }

    // Delete color images from S3
    if (product.colorImages && typeof product.colorImages === 'object') {
      console.log('🎨 Deleting color images from S3...');
      Object.values(product.colorImages).forEach(imageUrl => {
        if (imageUrl) {
          deletePromises.push(deleteFromS3(imageUrl));
        }
      });
    }

    // Wait for all S3 deletions to complete (or fail gracefully)
    console.log('⏳ Waiting for S3 deletions to complete...');
    await Promise.allSettled(deletePromises);
    console.log('✅ S3 deletion process completed');

    // Now delete the product from database
    console.log('🗃️ Deleting product from database...');
    await Product.destroy({ where: { id: req.params.id } });
    
    console.log('✅ Product and all associated images deleted successfully!');
    res.status(200).json({ 
      message: "Product and all associated images have been deleted successfully",
      deletedProductId: req.params.id
    });
    
  } catch (err) {
    console.error('❌ ERROR deleting product:', err);
    res.status(500).json({ 
      error: 'Failed to delete product',
      message: err.message
    });
  }
};
