import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px;

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    border-radius: 12px;
  }
`;

const Header = styled.div`
  padding: 25px 30px 0;
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    padding: 20px 25px 0;
  }

  @media (max-width: 480px) {
    padding: 15px 20px 0;
  }
`;

const BackButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const Content = styled.div`
  padding: 40px;
  display: flex;
  gap: 60px;
  flex-wrap: wrap;

  @media (max-width: 1024px) {
    gap: 40px;
    padding: 30px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    padding: 25px 20px;
  }

  @media (max-width: 480px) {
    gap: 25px;
    padding: 20px 15px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;

  @media (max-width: 768px) {
    min-width: auto;
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 15px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: 400px;
  object-fit: contain;
  border-radius: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 1024px) {
    height: 350px;
  }

  @media (max-width: 768px) {
    height: 300px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const ColorThumbnails = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ColorThumbnail = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid ${props => props.selected ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #667eea;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 20px 0;

  @media (max-width: 768px) {
    min-width: auto;
    padding: 0;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 2.8rem;
  margin-bottom: 20px;
  color: #2d3748;
  line-height: 1.2;

  @media (max-width: 1024px) {
    font-size: 2.4rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
  }
`;

const Category = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 12px;
    margin-bottom: 20px;
  }
`;

const Desc = styled.p`
  margin: 25px 0;
  font-size: 1.1rem;
  line-height: 1.7;
  color: #4a5568;
  background: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid #667eea;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 20px;
    margin: 20px 0;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 15px;
    margin: 15px 0;
    line-height: 1.6;
  }
`;

const PriceSection = styled.div`
  margin: 30px 0;
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 25px 0;
    padding: 20px;
  }

  @media (max-width: 480px) {
    margin: 20px 0;
    padding: 15px;
  }
`;

const PriceLabel = styled.div`
  font-size: 1rem;
  color: #718096;
  margin-bottom: 8px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Price = styled.span`
  font-weight: 700;
  font-size: 3rem;
  color: #2d3748;
  display: block;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: #a0aec0;
  text-decoration: line-through;
  margin-left: 10px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-left: 5px;
  }
`;

const StockInfo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.inStock ? '#48bb78' : '#f56565'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-top: 10px;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
`;

const FilterContainer = styled.div`
  margin: 35px 0;
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 768px) {
    margin: 30px 0;
    gap: 20px;
  }

  @media (max-width: 480px) {
    margin: 25px 0;
    gap: 15px;
  }
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    gap: 12px;
  }
`;

const FilterTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 80px;

  @media (max-width: 480px) {
    min-width: auto;
    font-size: 1rem;
  }
`;

const Select = styled.select`
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  min-width: 200px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    min-width: 180px;
    padding: 10px 16px;
  }

  @media (max-width: 480px) {
    min-width: 100%;
    width: 100%;
    padding: 12px 16px;
  }
`;

const Option = styled.option`
  padding: 10px;
  
  &:disabled {
    color: #a0aec0;
    background: #f7fafc;
  }
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 8px;
    width: 100%;
    justify-content: center;
  }
`;

const SizeOption = styled.button`
  padding: 12px 20px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e2e8f0'};
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#2d3748'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.selected ? '#667eea' : '#f7fafc'};
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.9rem;
    flex: 1;
    min-width: 60px;
    text-align: center;
  }
`;

const AddContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-top: 30px;
    gap: 15px;
  }

  @media (max-width: 480px) {
    margin-top: 25px;
    gap: 12px;
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 18px 35px;
  border: 2px solid;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 200px;
  justify-content: center;

  ${props => props.primary ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }
  ` : `
    background: white;
    color: #667eea;
    border-color: #667eea;
    
    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  `}

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
    background: #a0aec0;
    border-color: #a0aec0;
  }

  @media (max-width: 768px) {
    padding: 16px 25px;
    font-size: 1rem;
    min-width: 180px;
  }

  @media (max-width: 480px) {
    padding: 14px 20px;
    font-size: 0.95rem;
    min-width: auto;
    width: 100%;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 100px 20px;
  color: #718096;
  font-size: 1.2rem;

  @media (max-width: 480px) {
    padding: 80px 15px;
    font-size: 1.1rem;
  }
`;

const ColorOption = styled.option`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InventoryInfo = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  color: #718096;
  text-align: center;
  
  &.low-stock {
    color: #ed8936;
    font-weight: 600;
  }
  
  &.out-of-stock {
    color: #f56565;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const NoSizesMessage = styled.div`
  padding: 15px;
  background: #fff3e0;
  border: 1px solid #ffb74d;
  border-radius: 8px;
  color: #e65100;
  font-weight: 600;
  text-align: center;
  margin-top: 10px;
  width: 100%;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 0.9rem;
  }
`;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  // REMOVED: const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        const productData = res.data;
        setProduct(productData);
        
        // Set default color
        const defaultColor = productData.color && productData.color.length > 0 ? productData.color[0] : '';
        setSelectedColor(defaultColor);
        
        // Initialize image and sizes based on default color
        updateProductImage(productData, defaultColor);
        updateAvailableSizes(productData, defaultColor);
        
        setLoading(false);
      } catch (err) {
        console.log('Error fetching product:', err);
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  // Update image, sizes, and pricing when color changes
  useEffect(() => {
    if (product.id) {
      updateProductImage(product, selectedColor);
      updateAvailableSizes(product, selectedColor);
      updatePricingAndStock(product, selectedColor, selectedSize);
    }
  }, [selectedColor, selectedSize, product]);

  // Update product image based on color selection
  const updateProductImage = (productData, color) => {
    if (productData.colorImages && productData.colorImages[color]) {
      setCurrentImage(productData.colorImages[color]);
    } else {
      setCurrentImage(productData.img);
    }
  };

  // Update available sizes based on selected color and inventory - ONLY SHOW SIZES WITH STOCK
  const updateAvailableSizes = (productData, color) => {
    if (!productData.inventory || !productData.size) {
      setAvailableSizes(productData.size || []);
      if (productData.size && productData.size.length > 0) {
        setSelectedSize(productData.size[0]);
      }
      return;
    }

    // Filter sizes that have quantity > 0 for the selected color
    const sizesWithStock = productData.size.filter(size => {
      const inventoryItem = productData.inventory[color]?.[size];
      return inventoryItem && inventoryItem.quantity > 0;
    });

    console.log(`🔄 Available sizes for ${color}:`, sizesWithStock);
    setAvailableSizes(sizesWithStock);
    
    // Reset selected size if current selection is not available
    if (selectedSize && !sizesWithStock.includes(selectedSize)) {
      setSelectedSize(sizesWithStock[0] || '');
    } else if (!selectedSize && sizesWithStock.length > 0) {
      setSelectedSize(sizesWithStock[0]);
    }
  };

  // Update pricing and stock information
  const updatePricingAndStock = (productData, color, size) => {
    if (!color || !size || !productData.inventory) {
      setCurrentPrice(productData.price || 0);
      setCurrentStock(0);
      return;
    }

    const inventoryItem = productData.inventory[color]?.[size];
    if (inventoryItem) {
      setCurrentPrice(inventoryItem.price || productData.price);
      setCurrentStock(inventoryItem.quantity || 0);
    } else {
      setCurrentPrice(productData.price || 0);
      setCurrentStock(0);
    }
  };

  // Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // Handle size change
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const addToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    // Check if selected combination is in stock
    if (currentStock <= 0) {
      alert('Selected item is out of stock');
      return;
    }

    setIsAdding(true);

    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      const userId = payload.userId;

      const cartItem = {
        productId: product.id,
        quantity: 1,
        price: currentPrice,
        title: product.title,
        img: currentImage,
        size: selectedSize,
        color: selectedColor
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/${userId}`,
        cartItem,
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      // REMOVED: setShowSuccess(true);
      // REMOVED: setTimeout(() => setShowSuccess(false), 2000);
      // Cart added silently without notification
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  // Get stock status text
  const getStockStatus = () => {
    if (currentStock > 10) return { text: 'In Stock', class: '' };
    if (currentStock > 0) return { text: `Only ${currentStock} left!`, class: 'low-stock' };
    return { text: 'Out of Stock', class: 'out-of-stock' };
  };

  const stockStatus = getStockStatus();

  if (loading) {
    return (
      <PageContainer>
        <Container>
          <LoadingContainer>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block', color: '#667eea' }}></i>
            Loading product details...
          </LoadingContainer>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i>
            Back to Products
          </BackButton>
        </Header>
        
        <Content>
          <ImageContainer>
            <MainImage 
              src={currentImage || product.img} 
              alt={product.title}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/500x500/667eea/FFFFFF?text=${encodeURIComponent(product.title || 'Product')}`;
              }}
            />
            
            {/* Color Thumbnails */}
            {product.colorImages && Object.keys(product.colorImages).length > 0 && (
              <div>
                <FilterTitle style={{ marginBottom: '10px', display: 'block' }}>
                  Color Options:
                </FilterTitle>
                <ColorThumbnails>
                  {Object.entries(product.colorImages).map(([color, imageUrl]) => (
                    <ColorThumbnail
                      key={color}
                      src={imageUrl}
                      alt={color}
                      selected={selectedColor === color}
                      onClick={() => handleColorChange(color)}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/60x60/667eea/FFFFFF?text=${color.charAt(0).toUpperCase()}`;
                      }}
                    />
                  ))}
                </ColorThumbnails>
              </div>
            )}
          </ImageContainer>
          
          <InfoContainer>
            <Title>{product.title}</Title>
            
            {product.categories && product.categories.length > 0 && (
              <Category>
                {product.categories[0]}
              </Category>
            )}
            
            <Desc>{product.desc}</Desc>
            
            <PriceSection>
              <PriceLabel>PRICE</PriceLabel>
              <Price>
                ${currentPrice}
                {currentPrice !== product.price && (
                  <OriginalPrice>${product.price}</OriginalPrice>
                )}
              </Price>
              
              <StockInfo inStock={currentStock > 0}>
                <i className={`fas ${currentStock > 0 ? 'fa-check' : 'fa-times'}`}></i>
                {stockStatus.text}
              </StockInfo>
              
              {currentStock > 0 && (
                <InventoryInfo className={stockStatus.class}>
                  {currentStock <= 10 && `${currentStock} items left in stock`}
                </InventoryInfo>
              )}
            </PriceSection>
            
            <FilterContainer>
              {/* Color Selector */}
              {product.color && product.color.length > 0 && (
                <Filter>
                  <FilterTitle>
                    <i className="fas fa-palette" style={{ marginRight: '8px' }}></i>
                    Color:
                  </FilterTitle>
                  <Select 
                    value={selectedColor} 
                    onChange={(e) => handleColorChange(e.target.value)}
                  >
                    {product.color.map((color) => (
                      <ColorOption key={color} value={color}>
                        {color}
                        {product.colorImages && product.colorImages[color] && ' 🎨'}
                      </ColorOption>
                    ))}
                  </Select>
                </Filter>
              )}
              
              {/* Size Selector - ONLY SHOW AVAILABLE SIZES */}
              {product.size && product.size.length > 0 && (
                <Filter>
                  <FilterTitle>
                    <i className="fas fa-ruler" style={{ marginRight: '8px' }}></i>
                    Size:
                  </FilterTitle>
                  {availableSizes.length > 0 ? (
                    <SizeOptions>
                      {availableSizes.map((size) => (
                        <SizeOption
                          key={size}
                          selected={selectedSize === size}
                          onClick={() => handleSizeChange(size)}
                        >
                          {size}
                        </SizeOption>
                      ))}
                    </SizeOptions>
                  ) : (
                    <NoSizesMessage>
                      <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                      No sizes available for this color
                    </NoSizesMessage>
                  )}
                </Filter>
              )}
            </FilterContainer>
            
            <AddContainer>
              <Button 
                primary 
                onClick={addToCart} 
                disabled={isAdding || currentStock <= 0 || !selectedColor || !selectedSize || availableSizes.length === 0}
              >
                {isAdding ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding to Cart...
                  </>
                ) : currentStock <= 0 ? (
                  <>
                    <i className="fas fa-times"></i>
                    Out of Stock
                  </>
                ) : !selectedColor || !selectedSize || availableSizes.length === 0 ? (
                  <>
                    <i className="fas fa-exclamation-triangle"></i>
                    Select Options
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart - ${currentPrice}
                  </>
                )}
              </Button>
              
              <Button disabled={currentStock <= 0 || !selectedColor || !selectedSize || availableSizes.length === 0}>
                <i className="fas fa-bolt"></i>
                Buy Now - ${currentPrice}
              </Button>
            </AddContainer>
          </InfoContainer>
        </Content>
      </Container>

      {/* REMOVED: Success popup */}
    </PageContainer>
  );
};

export default ProductPage;