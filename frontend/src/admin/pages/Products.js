import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ========== ALL STYLED COMPONENTS ==========
const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: #764ba2;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ProductTitle = styled.h3`
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
`;

const ProductInfo = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
`;

const StockStatus = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  
  &.in-stock {
    background: #d4edda;
    color: #155724;
  }
  
  &.out-of-stock {
    background: #f8d7da;
    color: #721c24;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FileInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  border: 1px solid #ff4757;
`;

const ColorImageSection = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
`;

const ColorImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const ColorImageCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  background: white;
  text-align: center;
`;

const ColorNameInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  text-align: center;
  font-size: 12px;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
`;

const RemoveButton = styled.button`
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  width: 100%;
  
  &:hover {
    background: #ff3742;
  }
`;

const AddButton = styled.button`
  background: #2ed573;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background: #25c465;
  }
`;

const BulkUploadSection = styled.div`
  border: 2px dashed #ddd;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  background: #f8f9fa;
  
  &:hover {
    border-color: #667eea;
  }
`;

const InventorySection = styled.div`
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  background: #f9f9f9;
`;

const ColorSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #eee;
`;

const ColorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ColorName = styled.span`
  font-weight: bold;
  color: #333;
`;

const ColorImagePreview = styled.div`
  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
`;

const SizeCell = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
`;

const SizeLabel = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  color: #333;
`;

const MatrixInput = styled.input`
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 3px;
  text-align: center;
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const MatrixLabel = styled.label`
  display: block;
  font-size: 10px;
  color: #666;
  margin-bottom: 2px;
  text-align: center;
`;

const DeleteLoading = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
`;

// ========== MAIN COMPONENT ==========
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState({
    title: '',
    desc: '',
    price: '',
    categories: '',
    size: '',
    color: '',
    inStock: true,
    img: null
  });

  const [colorImages, setColorImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [inventory, setInventory] = useState({});
  const [inventoryInitialized, setInventoryInitialized] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products`,
        { headers: getAuthHeader() }
      );
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Color Images Functions
  const handleBulkColorImages = (e) => {
    const files = Array.from(e.target.files);
    
    const newColorImages = files.map(file => {
      const colorName = file.name.split('.')[0];
      return {
        color: colorName,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      };
    });

    setColorImages([...colorImages, ...newColorImages]);
  };

  const handleSingleColorImage = (index, file) => {
    const updated = [...colorImages];
    if (!updated[index]) {
      updated[index] = { color: '', imageFile: null, imagePreview: '' };
    }
    updated[index].imageFile = file;
    updated[index].imagePreview = URL.createObjectURL(file);
    
    if (!updated[index].color) {
      updated[index].color = file.name.split('.')[0];
    }
    
    setColorImages(updated);
  };

  const updateColor = (index, color) => {
    const updated = [...colorImages];
    if (!updated[index]) {
      updated[index] = { color: '', imageFile: null, imagePreview: '' };
    }
    updated[index].color = color;
    setColorImages(updated);
  };

  const removeColorImage = (index) => {
    setColorImages(colorImages.filter((_, i) => i !== index));
  };

  const addColorImageSlot = () => {
    setColorImages([...colorImages, { color: '', imageFile: null, imagePreview: '' }]);
  };

  // Update Inventory Matrix - ONLY SAVE EXPLICIT VALUES
  const updateInventory = (color, size, field, value) => {
    setInventory(prev => {
      const updated = { ...prev };
      
      if (!updated[color]) {
        updated[color] = {};
      }
      
      // If field is empty, remove it completely
      if (value === '' || value === null || value === undefined) {
        if (updated[color][size]) {
          // Remove the specific field
          const { [field]: removed, ...rest } = updated[color][size];
          updated[color][size] = rest;
          
          // If no fields left, remove the entire size entry
          if (Object.keys(updated[color][size]).length === 0) {
            delete updated[color][size];
          }
        }
      } else {
        // Only set value if user explicitly entered something
        if (!updated[color][size]) {
          updated[color][size] = {};
        }
        updated[color][size][field] = field === 'quantity' ? parseInt(value) || 0 
                                    : field === 'price' ? parseFloat(value) || 0 
                                    : value;
      }
      
      // If no sizes left for this color, remove the color entry
      if (updated[color] && Object.keys(updated[color]).length === 0) {
        delete updated[color];
      }
      
      return updated;
    });
  };

  // Initialize inventory - NO AUTO-FILLING AT ALL
  useEffect(() => {
    if (productForm.color && productForm.size && !inventoryInitialized) {
      // Only initialize with existing data, never create defaults
      const colors = productForm.color.split(',').map(c => c.trim()).filter(c => c);
      const sizes = productForm.size.split(',').map(s => s.trim()).filter(s => s);
      
      const newInventory = { ...inventory }; // Keep only what exists
      
      // Clean up any entries for colors/sizes that no longer exist
      Object.keys(newInventory).forEach(color => {
        if (!colors.includes(color)) {
          delete newInventory[color];
        } else {
          Object.keys(newInventory[color]).forEach(size => {
            if (!sizes.includes(size)) {
              delete newInventory[color][size];
            }
          });
        }
      });
      
      setInventory(newInventory);
      setInventoryInitialized(true);
    }
  }, [productForm.color, productForm.size]);

  // Reset inventory initialization when modal closes
  useEffect(() => {
    if (!showModal) {
      setInventoryInitialized(false);
    }
  }, [showModal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && name === 'img') {
      setProductForm(prev => ({
        ...prev,
        img: files[0]
      }));
      if (files[0]) {
        setMainImagePreview(URL.createObjectURL(files[0]));
      }
    } else if (type === 'checkbox') {
      setProductForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle product submission - ONLY SAVE EXPLICIT ENTRIES
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (!productForm.img) {
        setError('Please select a main product image');
        setFormLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('desc', productForm.desc);
      formData.append('price', productForm.price);
      formData.append('categories', productForm.categories);
      formData.append('size', productForm.size);
      formData.append('color', productForm.color);
      formData.append('inStock', productForm.inStock);
      formData.append('img', productForm.img);

      // Color images
      colorImages.forEach((item, index) => {
        if (item.color && item.imageFile) {
          formData.append(`color_${index}`, item.color);
          formData.append(`colorImage_${index}`, item.imageFile);
        }
      });

      // Only send inventory entries that have EXPLICIT quantity values
      let inventoryToSend = {};
      
      // Only include entries where user explicitly set a quantity
      Object.keys(inventory).forEach(color => {
        Object.keys(inventory[color]).forEach(size => {
          const item = inventory[color][size];
          // ONLY include if quantity was explicitly set (not empty/undefined)
          if (item.quantity !== undefined && item.quantity !== null && item.quantity !== '') {
            if (!inventoryToSend[color]) {
              inventoryToSend[color] = {};
            }
            inventoryToSend[color][size] = {
              quantity: item.quantity,
              price: item.price || parseFloat(productForm.price) || 0
            };
          }
        });
      });
      
      formData.append('inventory', JSON.stringify(inventoryToSend));

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products/upload`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setShowModal(false);
      resetForm();
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('❌ Error adding product:', error);
      setError(`Failed to add product: ${error.response?.data?.message || error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  // Edit product - load ONLY existing data
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      desc: product.desc || '',
      price: product.price,
      categories: product.categories ? product.categories.join(',') : '',
      size: product.size ? product.size.join(',') : '',
      color: product.color ? product.color.join(',') : '',
      inStock: product.inStock,
      img: null
    });
    setMainImagePreview(product.img || '');
    setColorImages([]);
    
    // Load EXACT inventory without any modifications
    if (product.inventory && Object.keys(product.inventory).length > 0) {
      setInventory(product.inventory);
    } else {
      // Start with completely empty inventory
      setInventory({});
    }
    
    setInventoryInitialized(true);
    setShowModal(true);
    setError('');
  };

  // Update product - save ONLY explicit entries
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', productForm.title);
      formData.append('desc', productForm.desc);
      formData.append('price', productForm.price);
      formData.append('categories', productForm.categories);
      formData.append('size', productForm.size);
      formData.append('color', productForm.color);
      formData.append('inStock', productForm.inStock);
      
      // Only save inventory entries with explicit quantities
      let inventoryToSend = {};
      
      Object.keys(inventory).forEach(color => {
        Object.keys(inventory[color]).forEach(size => {
          const item = inventory[color][size];
          // ONLY include if quantity was explicitly set
          if (item.quantity !== undefined && item.quantity !== null && item.quantity !== '') {
            if (!inventoryToSend[color]) {
              inventoryToSend[color] = {};
            }
            inventoryToSend[color][size] = {
              quantity: item.quantity,
              price: item.price || parseFloat(productForm.price) || 0
            };
          }
        });
      });
      
      formData.append('inventory', JSON.stringify(inventoryToSend));
      
      if (productForm.img) {
        formData.append('img', productForm.img);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/products/${editingProduct.id}`,
        formData,
        {
          headers: {
            ...getAuthHeader(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      setError(`Failed to update product: ${error.response?.data?.message || error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? All product images will also be deleted from storage.')) {
      return;
    }

    setDeleteLoading(productId);

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}`,
        { headers: getAuthHeader() }
      );
      fetchProducts();
      alert('Product and all associated images deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const resetForm = () => {
    setProductForm({
      title: '',
      desc: '',
      price: '',
      categories: '',
      size: '',
      color: '',
      inStock: true,
      img: null
    });
    setColorImages([]);
    setMainImagePreview('');
    setInventory({});
    setInventoryInitialized(false);
    setError('');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  // Helper function to get display values - show empty for unset
  const getInventoryValue = (color, size, field) => {
    const value = inventory[color]?.[size]?.[field];
    // Return empty string for unset values, ensuring no defaults
    return value !== undefined && value !== null && value !== '' ? value : '';
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <h1>📦 Manage Products</h1>
        </Header>
        <Loading>Loading products from database...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>📦 Manage Products</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </Button>
      </Header>

      <ActionBar>
        <Button onClick={openAddModal}>
          ➕ Add New Product
        </Button>
        <Button onClick={fetchProducts}>
          🔄 Refresh
        </Button>
      </ActionBar>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <Modal>
          <ModalContent>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            
            {error && (
              <ErrorMessage>
                ❌ {error}
              </ErrorMessage>
            )}
            
            <Form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <Input
                type="text"
                name="title"
                placeholder="Product Title"
                value={productForm.title}
                onChange={handleInputChange}
                required
                disabled={formLoading}
              />
              
              <TextArea
                name="desc"
                placeholder="Product Description"
                value={productForm.desc}
                onChange={handleInputChange}
                disabled={formLoading}
              />
              
              <Input
                type="number"
                name="price"
                placeholder="Base Price"
                value={productForm.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                disabled={formLoading}
              />
              
              <Input
                type="text"
                name="categories"
                placeholder="Categories (comma separated)"
                value={productForm.categories}
                onChange={handleInputChange}
                disabled={formLoading}
              />
              
              <Input
                type="text"
                name="size"
                placeholder="Sizes (comma separated) - S, M, L, XL"
                value={productForm.size}
                onChange={handleInputChange}
                disabled={formLoading}
              />
              
              <Input
                type="text"
                name="color"
                placeholder="Colors (comma separated) - Red, Blue, Black"
                value={productForm.color}
                onChange={handleInputChange}
                disabled={formLoading}
              />
              
              {/* Main Product Image */}
              <div>
                <label><strong>Main Product Image *</strong></label>
                <FileInput
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleInputChange}
                  disabled={formLoading}
                />
                {mainImagePreview && (
                  <div style={{marginTop: '10px'}}>
                    <ImagePreview src={mainImagePreview} alt="Main product preview" />
                  </div>
                )}
                <small>This image is required for product creation</small>
              </div>

              {/* Color-Specific Images Section */}
              <ColorImageSection>
                <label><strong>Color-Specific Images (Optional)</strong></label>
                
                <BulkUploadSection>
                  <label>Bulk Upload Color Images</label>
                  <FileInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBulkColorImages}
                    style={{ margin: '10px 0' }}
                    disabled={formLoading}
                  />
                  <small>Select multiple images at once. Color names will be taken from filenames.</small>
                </BulkUploadSection>

                <div>
                  <label>Color Images Preview</label>
                  <ColorImageGrid>
                    {colorImages.map((item, index) => (
                      <ColorImageCard key={index}>
                        <ColorNameInput
                          type="text"
                          placeholder="Color name"
                          value={item.color}
                          onChange={(e) => updateColor(index, e.target.value)}
                          disabled={formLoading}
                        />
                        {item.imagePreview ? (
                          <ImagePreview src={item.imagePreview} alt={`${item.color} preview`} />
                        ) : (
                          <FileInput
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSingleColorImage(index, e.target.files[0])}
                            style={{ fontSize: '12px', padding: '4px' }}
                            disabled={formLoading}
                          />
                        )}
                        <RemoveButton 
                          type="button" 
                          onClick={() => removeColorImage(index)}
                          disabled={formLoading}
                        >
                          Remove
                        </RemoveButton>
                      </ColorImageCard>
                    ))}
                  </ColorImageGrid>
                  
                  <AddButton 
                    type="button" 
                    onClick={addColorImageSlot}
                    disabled={formLoading}
                  >
                    + Add Single Color Image
                  </AddButton>
                </div>
              </ColorImageSection>

              {/* Inventory Matrix Section - ONLY SHOW EXPLICIT VALUES */}
              {productForm.color && productForm.size && (
                <InventorySection>
                  <label><strong>Color-Size Inventory Management</strong></label>
                  <small style={{display: 'block', marginBottom: '15px', color: '#666'}}>
                    Set different quantities and prices for each color-size combination. 
                    {editingProduct ? ' Only previously set values are shown.' : ' Leave empty for sizes without inventory.'}
                  </small>
                  
                  {productForm.color.split(',').map(color => color.trim()).filter(color => color).map(color => (
                    <ColorSection key={color}>
                      <ColorHeader>
                        <ColorName>{color}</ColorName>
                        <ColorImagePreview>
                          {colorImages.find(img => img.color === color)?.imagePreview && (
                            <img 
                              src={colorImages.find(img => img.color === color).imagePreview} 
                              alt={color} 
                            />
                          )}
                        </ColorImagePreview>
                      </ColorHeader>
                      
                      <SizeGrid>
                        {productForm.size.split(',').map(size => size.trim()).filter(size => size).map(size => (
                          <SizeCell key={size}>
                            <SizeLabel>{size}</SizeLabel>
                            <MatrixLabel>Quantity</MatrixLabel>
                            <MatrixInput
                              type="number"
                              placeholder="0"
                              min="0"
                              value={getInventoryValue(color, size, 'quantity')}
                              onChange={(e) => updateInventory(color, size, 'quantity', e.target.value)}
                              disabled={formLoading}
                            />
                            <MatrixLabel>Price ($)</MatrixLabel>
                            <MatrixInput
                              type="number"
                              placeholder={productForm.price}
                              step="0.01"
                              min="0"
                              value={getInventoryValue(color, size, 'price')}
                              onChange={(e) => updateInventory(color, size, 'price', e.target.value)}
                              disabled={formLoading}
                            />
                          </SizeCell>
                        ))}
                      </SizeGrid>
                    </ColorSection>
                  ))}
                </InventorySection>
              )}
              
              <label>
                <input
                  type="checkbox"
                  name="inStock"
                  checked={productForm.inStock}
                  onChange={handleInputChange}
                  disabled={formLoading}
                />
                In Stock
              </label>
              
              <FormActions>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  style={{ background: '#6c757d' }}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Products Grid */}
      <ProductsGrid>
        {products.map((product) => (
          <ProductCard key={product.id}>
            <ProductImage 
              src={product.img || 'https://via.placeholder.com/300x300?text=No+Image'} 
              alt={product.title}
            />
            <ProductTitle>{product.title}</ProductTitle>
            <ProductPrice>${product.price}</ProductPrice>
            
            <ProductInfo>
              Categories: {product.categories ? product.categories.join(', ') : 'N/A'}
            </ProductInfo>
            
            <ProductInfo>
              Sizes: {product.size ? product.size.join(', ') : 'N/A'}
            </ProductInfo>
            
            <ProductInfo>
              Colors: {product.color ? product.color.join(', ') : 'N/A'}
            </ProductInfo>
            
            <ProductInfo>
              Status: <StockStatus className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </StockStatus>
            </ProductInfo>
            
            <ProductActions>
              <Button 
                onClick={() => handleEditProduct(product)}
                style={{background: '#28a745'}}
                disabled={deleteLoading === product.id}
              >
                ✏️ Edit
              </Button>
              <Button 
                onClick={() => handleDeleteProduct(product.id)}
                style={{background: '#dc3545'}}
                disabled={deleteLoading === product.id}
              >
                {deleteLoading === product.id ? (
                  <DeleteLoading>
                    <i className="fas fa-spinner fa-spin"></i>
                    Deleting...
                  </DeleteLoading>
                ) : (
                  '🗑️ Delete'
                )}
              </Button>
            </ProductActions>
          </ProductCard>
        ))}
      </ProductsGrid>
    </Container>
  );
};

export default AdminProducts;