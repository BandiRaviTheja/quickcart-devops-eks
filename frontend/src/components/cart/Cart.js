import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: #f5f5f5;

  @media (max-width: 768px) {
    background: white;
  }
`;

const Wrapper = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin: 20px 0;
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;

const TopTexts = styled.div`
  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;

  @media (max-width: 480px) {
    margin: 5px 0;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
  }
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const Image = styled.img`
  width: 200px;

  @media (max-width: 768px) {
    width: 150px;
  }

  @media (max-width: 480px) {
    width: 120px;
  }
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 10px;
  }
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;

  @media (max-width: 768px) {
    height: auto;
    margin-top: 20px;
  }
`;

const SummaryTitle = styled.h1`
  font-weight: 200;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};

  @media (max-width: 480px) {
    margin: 20px 0px;
    font-size: ${(props) => props.type === "total" && "20px"};
  }
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 16px;
  }
`;

const AddressForm = styled.div`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #f9f9f9;

  @media (max-width: 480px) {
    padding: 15px;
    margin: 15px 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 16px;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputGroup = styled.div`
  flex: 1;
`;

const FreeShippingBadge = styled.span`
  color: green;
  margin-left: 5px;
  font-size: 12px;
  font-weight: 600;
`;

// REMOVED CartContext - using props or local state instead
const Cart = ({ cartItems, updateCartItem, removeFromCart, clearCart }) => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const handleQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, quantity);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    const subtotal = getTotal();
    
    if (subtotal >= 50) {
      return {
        shipping: 0,
        hasFreeShipping: true
      };
    } else {
      return {
        shipping: 5.90,
        hasFreeShipping: false
      };
    }
  };

  const getFinalTotal = () => {
    const shippingInfo = calculateShipping();
    return getTotal() + shippingInfo.shipping;
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!showAddressForm) {
      setShowAddressForm(true);
      return;
    }

    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      alert('Please fill in all address fields');
      return;
    }

    setIsCheckingOut(true);

    try {
      const base64Payload = token.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      const userId = payload.userId;

      const orderData = {
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'One Size',
          color: item.color || 'Default',
          img: item.img
        })),
        address: address,
        totalAmount: getFinalTotal()
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        orderData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/${userId}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      clearCart();
      alert(`Order placed successfully! Order ID: ${response.data.order.id}`);
      navigate('/');

    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Checkout failed';
      alert('Checkout failed: ' + errorMessage);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const shippingInfo = calculateShipping();

  return (
    <Container>
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={() => navigate('/')}>CONTINUE SHOPPING</TopButton>
          <TopTexts>
            <TopText>Shopping Bag({cartItems.length})</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts>
          <TopButton 
            type="filled" 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            {isCheckingOut ? 'PROCESSING...' : 'CHECKOUT NOW'}
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            {cartItems.map((item) => (
              <div key={item.id}>
                <Product>
                  <ProductDetail>
                    <Image src={item.img} />
                    <Details>
                      <ProductName>
                        <b>Product:</b> {item.title}
                      </ProductName>
                      <ProductId>
                        <b>ID:</b> {item.productId}
                      </ProductId>
                      {item.size && (
                        <ProductSize>
                          <b>Size:</b> {item.size}
                        </ProductSize>
                      )}
                      {item.color && (
                        <div>
                          <b>Color:</b> {item.color}
                        </div>
                      )}
                    </Details>
                  </ProductDetail>
                  <PriceDetail>
                    <ProductAmountContainer>
                      <button onClick={() => handleQuantity(item.productId, item.quantity - 1)}>
                        -
                      </button>
                      <ProductAmount>{item.quantity}</ProductAmount>
                      <button onClick={() => handleQuantity(item.productId, item.quantity + 1)}>
                        +
                      </button>
                    </ProductAmountContainer>
                    <ProductPrice>$ {(item.price * item.quantity).toFixed(2)}</ProductPrice>
                  </PriceDetail>
                </Product>
                <Hr />
              </div>
            ))}
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ {getTotal().toFixed(2)}</SummaryItemPrice>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryItemText>
                Shipping
                {shippingInfo.hasFreeShipping && (
                  <FreeShippingBadge>🚚 FREE</FreeShippingBadge>
                )}
              </SummaryItemText>
              <SummaryItemPrice>
                {shippingInfo.hasFreeShipping ? '$ 0.00' : `$ ${shippingInfo.shipping.toFixed(2)}`}
              </SummaryItemPrice>
            </SummaryItem>

            {!shippingInfo.hasFreeShipping && (
              <SummaryItem>
                <SummaryItemText style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                  Add ${(50 - getTotal()).toFixed(2)} more for free shipping!
                </SummaryItemText>
                <SummaryItemPrice></SummaryItemPrice>
              </SummaryItem>
            )}

            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ {getFinalTotal().toFixed(2)}</SummaryItemPrice>
            </SummaryItem>

            {showAddressForm && (
              <AddressForm>
                <h3>Shipping Address</h3>
                <Input
                  type="text"
                  name="street"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleInputChange}
                  required
                />
                <InputRow>
                  <InputGroup>
                    <Input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={address.state}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </InputRow>
                <InputRow>
                  <InputGroup>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={address.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={address.country}
                      onChange={handleInputChange}
                      required
                    />
                  </InputGroup>
                </InputRow>
              </AddressForm>
            )}

            <Button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || isCheckingOut}
            >
              {isCheckingOut ? 'PROCESSING ORDER...' : 
               showAddressForm ? 'PLACE ORDER' : 
               `CHECKOUT NOW ($${getFinalTotal().toFixed(2)})`}
            </Button>
          </Summary>
        </Bottom>
      </Wrapper>
    </Container>
  );
};

export default Cart;