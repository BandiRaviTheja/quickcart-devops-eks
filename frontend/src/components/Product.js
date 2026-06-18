import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px !important;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: auto;
  position: relative;
  width: 260px;
  min-width: 260px;
  margin: 3px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 768px) {
    width: 200px;
    min-width: 200px;
    padding: 10px !important;
    margin: 2px;
  }

  @media (max-width: 480px) {
    width: 150px;
    min-width: 150px;
    padding: 8px !important;
    margin: 2px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 150px;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    height: 120px;
    margin-bottom: 6px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Container}:hover & {
    transform: scale(1.05);
  }
`;

const InfoContainer = styled.div`
  width: 100%;
  padding: 0 2px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 6px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    min-height: 2.2em;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    min-height: 2em;
    margin-bottom: 3px;
  }
`;

const Description = styled.p`
  color: #718096;
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4em;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    min-height: 2.2em;
    margin-bottom: 6px;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 0.85rem;
  color: #a0aec0;
  text-decoration: line-through;

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const DiscountBadge = styled.span`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 2px 5px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 2px 4px;
  }
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  font-size: 0.75rem;
  color: ${(props) => (props.inStock ? "#38a169" : "#e53e3e")};
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const CategoryTag = styled.span`
  background: #edf2f7;
  color: #4a5568;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 0.65rem;
  font-weight: 500;
  margin-bottom: 4px;
  display: inline-block;

  @media (max-width: 480px) {
    font-size: 0.6rem;
    padding: 1px 4px;
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const ColorOption = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid ${(props) => (props.selected ? "#667eea" : "transparent")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const SizeOption = styled.button`
  padding: 4px 8px;
  border: 1px solid ${(props) => (props.selected ? "#667eea" : "#e2e8f0")};
  background: ${(props) => (props.selected ? "#667eea" : "white")};
  color: ${(props) => (props.selected ? "white" : "#4a5568")};
  border-radius: 5px;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 0.65rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 8px 12px;
  background: ${(props) => 
    props.disabled ? "#cbd5e0" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-1px)")};
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
`;

const QuickViewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;

  ${Container}:hover & {
    opacity: 1;
  }

  @media (max-width: 768px) {
    opacity: 1;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const QuickViewButton = styled.button`
  background: white;
  color: #2d3748;
  border: none;
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;

  &:hover {
    background: #667eea;
    color: white;
  }

  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.7rem;
  }
`;

const Product = ({ item: product, loading }) => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [currentSizes, setCurrentSizes] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Safe price formatting function
  const formatPrice = (price) => {
    if (price === null || price === undefined) return "0.00";
    const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);
    if (isNaN(numPrice)) return "0.00";
    return numPrice.toFixed(2);
  };

  // Initialize product data
  useEffect(() => {
    if (product) {
      const defaultColor = product.color && product.color.length > 0 ? product.color[0] : "";
      setSelectedColor(defaultColor);
      
      const displayImage = product.colorImages && product.colorImages[defaultColor] 
        ? product.colorImages[defaultColor] 
        : product.img;
      setCurrentImage(displayImage);
      
      const sizes = getAvailableSizes(product, defaultColor);
      setCurrentSizes(sizes);
      
      if (sizes.length > 0) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [product]);

  const getAvailableSizes = (productData, color) => {
    if (!productData.inventory || !productData.size) {
      return productData.size || [];
    }
    return productData.size.filter(size => {
      const inventoryItem = productData.inventory[color]?.[size];
      return inventoryItem && inventoryItem.quantity > 0;
    });
  };

  const getCurrentPrice = () => {
    if (!selectedColor || !selectedSize || !product.inventory) {
      return product.price || 0;
    }
    const inventoryItem = product.inventory[selectedColor]?.[selectedSize];
    return inventoryItem?.price || product.price || 0;
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (product.colorImages && product.colorImages[color]) {
      setCurrentImage(product.colorImages[color]);
    }
    const sizes = getAvailableSizes(product, color);
    setCurrentSizes(sizes);
    if (sizes.length > 0 && !sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0]);
    } else if (sizes.length === 0) {
      setSelectedSize("");
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const addToCart = async () => {
    if (!selectedColor || (product.size && product.size.length > 0 && !selectedSize)) {
      alert("Please select color and size options");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      const userId = payload.userId;

      const currentPrice = getCurrentPrice();
      const formattedPrice = formatPrice(currentPrice);

      const cartItem = {
        productId: product.id,
        quantity: 1,
        price: parseFloat(formattedPrice),
        title: product.title,
        img: currentImage,
        size: selectedSize || 'One Size',
        color: selectedColor || 'Default'
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
      // REMOVED: alert('Product added to cart successfully!');
      // Cart added silently without notification
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isInStock = () => {
    if (!product.inventory) return true;
    if (selectedColor && selectedSize) {
      const inventoryItem = product.inventory[selectedColor]?.[selectedSize];
      return inventoryItem && inventoryItem.quantity > 0;
    }
    if (product.color && product.color.length > 0) {
      return product.color.some(color => {
        const sizes = getAvailableSizes(product, color);
        return sizes.length > 0;
      });
    }
    return true;
  };

  const getDiscountPercentage = () => {
    const currentPrice = getCurrentPrice();
    const originalPrice = product.price;
    const numCurrent = typeof currentPrice === 'string' ? parseFloat(currentPrice) : Number(currentPrice);
    const numOriginal = typeof originalPrice === 'string' ? parseFloat(originalPrice) : Number(originalPrice);
    if (isNaN(numCurrent) || isNaN(numOriginal)) return 0;
    if (numCurrent < numOriginal) {
      return Math.round(((numOriginal - numCurrent) / numOriginal) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <Container>
        <div style={{ 
          width: '100%', 
          height: '180px', 
          background: '#f0f0f0', 
          borderRadius: '8px',
          marginBottom: '10px'
        }}></div>
        <InfoContainer>
          <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '6px' }}></div>
          <div style={{ height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '6px', width: '80%' }}></div>
          <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '60%' }}></div>
          <div style={{ height: '30px', background: '#f0f0f0', borderRadius: '6px' }}></div>
        </InfoContainer>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  const discountPercentage = getDiscountPercentage();
  const inStock = isInStock();
  const currentPrice = getCurrentPrice();
  const formattedPrice = formatPrice(currentPrice);
  const formattedOriginalPrice = formatPrice(product.price);

  return (
    <Container>
      <ImageContainer onClick={handleProductClick}>
        <Image 
          src={currentImage || product.img} 
          alt={product.title}
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/300x300/667eea/FFFFFF?text=${encodeURIComponent(product.title)}`;
          }}
        />
        <QuickViewOverlay>
          <QuickViewButton onClick={handleProductClick}>
            Quick View
          </QuickViewButton>
        </QuickViewOverlay>
      </ImageContainer>

      <InfoContainer>
        {product.categories && product.categories.length > 0 && (
          <CategoryTag>{product.categories[0]}</CategoryTag>
        )}
        
        <Title>{product.title}</Title>
        
        <Description>{product.description || product.desc || "No description available"}</Description>

        <PriceContainer>
          <Price>${formattedPrice}</Price>
          {discountPercentage > 0 && (
            <>
              <OriginalPrice>${formattedOriginalPrice}</OriginalPrice>
              <DiscountBadge>-{discountPercentage}%</DiscountBadge>
            </>
          )}
        </PriceContainer>

        <StockInfo inStock={inStock}>
          <i className={`fas ${inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </StockInfo>

        {product.color && product.color.length > 0 && (
          <ColorOptions>
            {product.color.map((color) => (
              <ColorOption
                key={color}
                color={color}
                selected={selectedColor === color}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </ColorOptions>
        )}

        {currentSizes && currentSizes.length > 0 && (
          <SizeOptions>
            {currentSizes.map((size) => (
              <SizeOption
                key={size}
                selected={selectedSize === size}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </SizeOption>
            ))}
          </SizeOptions>
        )}

        <Button 
          onClick={addToCart}
          disabled={!inStock || isAddingToCart || (product.size && product.size.length > 0 && !selectedSize) || (product.color && product.color.length > 0 && !selectedColor)}
        >
          {isAddingToCart ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Adding...
            </>
          ) : !inStock ? (
            <>
              <i className="fas fa-times"></i>
              Out of Stock
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart"></i>
              Add to Cart
            </>
          )}
        </Button>
      </InfoContainer>
    </Container>
  );
};

export default Product;