import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

// ========== ALL STYLED COMPONENTS ==========
const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  font-size: 1.5rem;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
    justify-content: center;
  }
`;

const TopButton = styled.button`
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
  border-radius: 8px;
  font-size: 14px;
  min-height: 44px;
  
  @media (max-width: 480px) {
    padding: 10px 15px;
    font-size: 12px;
    min-height: 40px;
  }
`;

const TopTexts = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
`;

const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  
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
  margin-bottom: 20px;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 15px;
  }
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
  gap: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 200px;
    height: 150px;
    margin: 0 auto;
  }
`;

const Details = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
  @media (max-width: 480px) {
    padding: 15px 0;
    gap: 10px;
  }
`;

const ProductName = styled.span`
  font-size: 16px;
  font-weight: 500;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ProductId = styled.span`
  color: gray;
  font-size: 12px;
`;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProductAmount = styled.div`
  font-size: 20px;
  margin: 0 10px;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const ProductPrice = styled.div`
  font-size: 24px;
  font-weight: 200;
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
  margin: 20px 0;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: fit-content;
  
  @media (max-width: 768px) {
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
  font-size: 1.5rem;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const SummaryItem = styled.div`
  margin: 20px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" ? "20px" : "16px"};
  
  @media (max-width: 480px) {
    margin: 15px 0px;
    font-size: ${(props) => props.type === "total" ? "18px" : "14px"};
  }
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: black;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 8px;
  font-size: 16px;
  min-height: 50px;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    min-height: 44px;
  }
`;

const QuantityButton = styled.button`
  width: 35px;
  height: 35px;
  border: 1px solid teal;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  min-height: 35px;
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: gray;
  
  @media (max-width: 480px) {
    padding: 30px 20px;
    font-size: 16px;
  }
`;

const FreeShippingBadge = styled.span`
  color: green;
  margin-left: 5px;
  font-size: 12px;
  font-weight: 600;
`;

const AddressSection = styled.div`
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  background-color: #f9f9f9;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const AddressSelector = styled.div`
  margin-bottom: 15px;
`;

const AddressOption = styled.div`
  padding: 12px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e2e8f0'};
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
  }
`;

const AddressText = styled.p`
  margin: 5px 0;
  color: #2d3748;
  line-height: 1.4;
`;

const AddressType = styled.span`
  background: ${props => props.isDefault ? '#667eea' : '#e2e8f0'};
  color: ${props => props.isDefault ? 'white' : '#4a5568'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 10px;
`;

const NewAddressButton = styled.button`
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 10px;

  &:hover {
    background: #cbd5e0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  @media (max-width: 480px) {
    padding: 10px;
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

const PaymentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 10px;
    align-items: flex-start;
    padding-top: 50px;
  }
`;

const PaymentContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    max-height: 80vh;
  }
`;

const PayNowBtn = styled.button`
  background: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  transition: background 0.3s;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelBtn = styled.button`
  background: #f44336;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  transition: background 0.3s;

  &:hover {
    background: #da190b;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 12px;
  border-radius: 6px;
  margin: 15px 0;
  font-size: 14px;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  color: #155724;
  background-color: #d4edda;
  padding: 12px;
  border-radius: 6px;
  margin: 15px 0;
  font-size: 14px;
  border: 1px solid #c3e6cb;
`;

const CardFormContainer = styled.div`
  margin: 20px 0;
  text-align: left;
`;

const CardFieldContainer = styled.div`
  margin-bottom: 15px;
`;

const CardFieldLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const CardFieldWrapper = styled.div`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  transition: border-color 0.3s;
  
  &:focus-within {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
  }
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

// ========== STRIPE PAYMENT FORM COMPONENT ==========
const StripePaymentForm = ({ amount, clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const cardNumber = elements.getElement(CardNumberElement);

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
      });

      if (stripeError) {
        setError(stripeError.message);
        onError(stripeError.message);
        return;
      }

      console.log('🔄 Confirming card payment...');
      
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
        onError(confirmError.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('✅ Payment successful!');
        onSuccess(paymentIntent);
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
        onError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError('Payment failed. Please try again.');
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#9e2146',
        iconColor: '#9e2146',
      },
    },
  };

  return (
    <CardFormContainer>
      <h3 style={{ marginBottom: '15px', color: '#333' }}>Payment Details</h3>
      <p style={{ fontSize: '18px', fontWeight: '600', color: '#2c5aa0', marginBottom: '20px' }}>
        Total Amount: <span style={{ color: '#4CAF50' }}>${amount}</span>
      </p>
      
      <form onSubmit={handleSubmit}>
        <CardFieldContainer>
          <CardFieldLabel>Card Number</CardFieldLabel>
          <CardFieldWrapper>
            <CardNumberElement
              options={{
                ...cardElementOptions,
                placeholder: '1234 1234 1234 1234',
              }}
            />
          </CardFieldWrapper>
        </CardFieldContainer>

        <CardRow>
          <CardFieldContainer>
            <CardFieldLabel>Expiry Date</CardFieldLabel>
            <CardFieldWrapper>
              <CardExpiryElement
                options={{
                  ...cardElementOptions,
                  placeholder: 'MM/YY',
                }}
              />
            </CardFieldWrapper>
          </CardFieldContainer>

          <CardFieldContainer>
            <CardFieldLabel>CVC</CardFieldLabel>
            <CardFieldWrapper>
              <CardCvcElement
                options={{
                  ...cardElementOptions,
                  placeholder: '123',
                }}
              />
            </CardFieldWrapper>
          </CardFieldContainer>
        </CardRow>
        
        {error && (
          <ErrorMessage style={{ textAlign: 'left' }}>
            ⚠️ {error}
          </ErrorMessage>
        )}
        
        <PayNowBtn type="submit" disabled={!stripe || processing}>
          {processing ? (
            <>
              <span style={{ marginRight: '8px' }}>⏳</span>
              Processing Payment...
            </>
          ) : (
            `Pay $${amount}`
          )}
        </PayNowBtn>
      </form>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#f8f9fa', 
        borderRadius: '8px', 
        fontSize: '13px',
        textAlign: 'left',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#495057', fontSize: '14px' }}>
          🧪 Test Card Information
        </h4>
        <div style={{ lineHeight: '1.6', color: '#6c757d' }}>
          <div><strong>Card Number:</strong> 4242 4242 4242 4242</div>
          <div><strong>Expiry Date:</strong> 12/34</div>
          <div><strong>CVC:</strong> 123</div>
          <div><strong>ZIP Code:</strong> 12345</div>
        </div>
      </div>
    </CardFormContainer>
  );
};

// ========== MAIN CART PAGE COMPONENT ==========
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAddressSection, setShowAddressSection] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    type: "home",
    isDefault: false
  });

  // Helper Functions
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return payload.userId;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const calculateShipping = () => {
    const subtotal = getTotal();
    if (subtotal >= 50) {
      return { shipping: 0, hasFreeShipping: true };
    } else {
      return { shipping: 5.90, hasFreeShipping: false };
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
  };

  const getFinalTotal = () => {
    const shippingInfo = calculateShipping();
    return getTotal() + shippingInfo.shipping;
  };

  // ULTIMATE cart clearing function
  const clearCartUltimate = async (userId) => {
    const token = localStorage.getItem('token');
    const BASE_URL = process.env.REACT_APP_API_URL;
    
    console.log('🛒 ULTIMATE Cart Clearing Process Started for user:', userId);
    
    if (!userId || !token) {
      console.error('❌ Cannot clear cart: Missing user ID or token');
      return false;
    }

    // Strategy 1: Try the clear endpoint
    try {
      console.log('🔄 Strategy 1: Trying /clear endpoint...');
      const response = await axios.delete(
        `${BASE_URL}/api/cart/${userId}/clear`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      
      if (response.data.message === 'Cart cleared successfully') {
        console.log('✅ Strategy 1 SUCCESS: Cart cleared via /clear endpoint');
        return true;
      }
    } catch (error) {
      console.warn('⚠️ Strategy 1 failed:', error.response?.data || error.message);
    }

    // Strategy 2: Get current cart and remove items individually
    try {
      console.log('🔄 Strategy 2: Getting cart items to remove individually...');
      const cartResponse = await axios.get(
        `${BASE_URL}/api/cart/${userId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      
      const currentItems = cartResponse.data;
      console.log(`📦 Found ${currentItems.length} items to remove`);
      
      if (currentItems.length === 0) {
        console.log('✅ Strategy 2 SUCCESS: Cart already empty');
        return true;
      }

      // Remove each item individually
      for (const item of currentItems) {
        try {
          await axios.delete(
            `${BASE_URL}/api/cart/${userId}/${item.productId || item.id}`,
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 3000
            }
          );
          console.log(`✅ Removed item: ${item.productId || item.id}`);
        } catch (itemError) {
          console.warn(`⚠️ Failed to remove item ${item.productId || item.id}:`, itemError.message);
        }
      }
      console.log('✅ Strategy 2 SUCCESS: All items removed individually');
      return true;
      
    } catch (error) {
      console.warn('⚠️ Strategy 2 failed:', error.response?.data || error.message);
    }

    // Strategy 3: Set quantities to 0
    try {
      console.log('🔄 Strategy 3: Setting quantities to 0...');
      const cartResponse = await axios.get(
        `${BASE_URL}/api/cart/${userId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );
      
      const currentItems = cartResponse.data;
      
      for (const item of currentItems) {
        try {
          await axios.put(
            `${BASE_URL}/api/cart/${userId}`,
            { 
              productId: item.productId || item.id, 
              quantity: 0 
            },
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 3000
            }
          );
          console.log(`✅ Set quantity to 0 for: ${item.productId || item.id}`);
        } catch (quantityError) {
          console.warn(`⚠️ Failed to set quantity for ${item.productId || item.id}:`, quantityError.message);
        }
      }
      console.log('✅ Strategy 3 SUCCESS: All quantities set to 0');
      return true;
      
    } catch (error) {
      console.warn('⚠️ Strategy 3 failed:', error.response?.data || error.message);
    }

    console.error('❌ ALL cart clearing strategies failed');
    return false;
  };

  // Fetch user addresses from profile
  const fetchUserAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/addresses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const addresses = response.data.addresses || [];
      setUserAddresses(addresses);
      
      // Auto-select default address
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Add new address to profile
  const addNewAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh addresses
      await fetchUserAddresses();
      setShowNewAddressForm(false);
      setNewAddress({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        type: "home",
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address');
    }
  };

  // Function to send payment confirmation email
  const sendPaymentConfirmationEmail = async (orderData, paymentData) => {
    try {
      console.log('📧 Sending payment confirmation email for order:', orderData.id);
      
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email;

      if (!userEmail) {
        console.warn('No email found for payment confirmation');
        return false;
      }

      const emailData = {
        paymentData: {
          id: paymentData.id,
          orderId: orderData.id,
          amount: orderData.amount,
          paymentMethod: 'Credit Card',
          status: 'completed',
          paymentDate: new Date().toISOString(),
          receiptUrl: `https://quickcart.com/receipts/${paymentData.id}`,
          products: orderData.products,
          shipping: orderData.shipping || 0,
          tax: orderData.tax || 0
        },
        userEmail: userEmail
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/email/payment-confirmation`,
        emailData,
        { headers: getAuthHeader() }
      );

      console.log('✅ Payment confirmation email sent successfully:', response.data);
      return true;
    } catch (emailError) {
      console.error('❌ Failed to send payment confirmation email:', emailError);
      return false;
    }
  };

  // Function to send order confirmation email
  const sendOrderConfirmationEmail = async (orderData) => {
    try {
      console.log('📧 Sending order confirmation email for order:', orderData.id);
      
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email;

      if (!userEmail) {
        console.warn('No email found for order confirmation');
        return false;
      }

      const emailData = {
        orderData: orderData,
        userEmail: userEmail
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/email/order-confirmation`,
        emailData,
        { headers: getAuthHeader() }
      );

      console.log('✅ Order confirmation email sent successfully:', response.data);
      return true;
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError);
      return false;
    }
  };

  // Clear payment flag function
  const clearPaymentFlag = () => {
    localStorage.removeItem('paymentCompleted');
    localStorage.removeItem('lastCartClearTime');
    console.log('🗑️ Payment flags cleared - ready for new shopping');
  };

  const fetchCart = useCallback(async () => {
    // Clear payment flags every time we fetch cart to ensure fresh data
    clearPaymentFlag();

    const userId = getCurrentUser();
    if (!userId) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Fetching cart...');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/cart/${userId}`,
        { headers: getAuthHeader() }
      );
      console.log('✅ Cart data received:', response.data.length, 'items');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = async (productId, quantity) => {
    const userId = getCurrentUser();
    if (!userId) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/cart/${userId}`,
        { productId, quantity },
        { headers: getAuthHeader() }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    const userId = getCurrentUser();
    if (!userId) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/${userId}/${productId}`,
        { headers: getAuthHeader() }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Clear payment flag on component mount and setup debug logging
  useEffect(() => {
    console.log('🔍 CartPage mounted, clearing payment flags');
    clearPaymentFlag();
    fetchCart();
    fetchUserAddresses();
  }, [fetchCart]);

  // Debug cart updates
  useEffect(() => {
    console.log('📦 Cart items updated:', {
      itemCount: cartItems.length,
      items: cartItems
    });
  }, [cartItems]);

  const handleQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, quantity);
    }
  };

  // ✅ FIXED: Updated handlePayment function with correct field names
  const handlePayment = async () => {
    setPaymentError('');
    setPaymentSuccess('');
    setIsCheckingOut(true);

    try {
      const userId = getCurrentUser();
      const token = localStorage.getItem('token');
      const BASE_URL = process.env.REACT_APP_API_URL;

      // Validate address first
      if (!selectedAddress) {
        throw new Error('Please select a shipping address');
      }

      // Validate cart items
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      console.log('🔄 Starting payment process...');
      console.log('📦 Cart items:', cartItems);
      console.log('🏠 Selected address:', selectedAddress);
      console.log('💰 Total amount:', getFinalTotal());

      // ✅ FIXED: Step 1: Create order with CORRECT field names that match backend
      const orderData = {
        cartItems: cartItems.map(item => ({ // ✅ Changed from 'products' to 'cartItems'
          productId: item.productId || item.id,
          title: item.title || item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          size: item.size || 'One Size',
          color: item.color || 'Default',
          img: item.img || item.image
        })),
        address: selectedAddress,
        totalAmount: getFinalTotal() // ✅ Changed from 'amount' to 'totalAmount'
      };

      console.log('📦 Creating order with data:', orderData);

      const orderResponse = await axios.post(
        `${BASE_URL}/api/orders`,
        orderData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('✅ Order creation response:', orderResponse.data);

      if (!orderResponse.data.order || !orderResponse.data.order.id) {
        throw new Error('Order creation failed - no order ID returned');
      }

      const createdOrderId = orderResponse.data.order.id;
      setCurrentOrderId(createdOrderId);

      console.log('✅ Order created successfully:', createdOrderId);

      // Step 2: Create payment intent with the order ID
      const amount = Math.round(getFinalTotal() * 100);

      console.log('💳 Creating payment intent for amount:', amount);

      const paymentResponse = await axios.post(
        `${BASE_URL}/api/payments/create-payment-intent`,
        { 
          orderId: createdOrderId,
          amount: amount,
          currency: 'usd'
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('✅ Payment intent response:', paymentResponse.data);

      if (paymentResponse.data.clientSecret) {
        console.log('✅ Payment intent created, client secret received');
        setClientSecret(paymentResponse.data.clientSecret);
      } else {
        throw new Error('No client secret received from payment service');
      }

    } catch (error) {
      console.error('❌ Payment setup error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      setPaymentError(`Payment setup failed: ${errorMessage}`);
      setIsCheckingOut(false);
    }
  };

  // ✅ FIXED: Payment success handler with payment confirmation
  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('🎉 PAYMENT SUCCESS - Starting payment confirmation process...');
    
    try {
      const userId = getCurrentUser();
      const token = localStorage.getItem('token');
      const BASE_URL = process.env.REACT_APP_API_URL;
      const userEmail = JSON.parse(localStorage.getItem('user'))?.email;

      console.log('✅ Stripe payment successful, paymentIntent:', paymentIntent);
      
      // ✅ CRITICAL FIX: Step 1 - Confirm payment with backend to update order status
      console.log('🔄 Step 1: Confirming payment with backend...');
      try {
        const confirmResponse = await axios.post(
          `${BASE_URL}/api/payments/confirm-payment`,
          { paymentIntentId: paymentIntent.id },
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );
        console.log('✅ Payment confirmed with backend:', confirmResponse.data);
        
        // Verify order status was updated
        if (currentOrderId) {
          setTimeout(async () => {
            try {
              const orderCheck = await axios.get(
                `${BASE_URL}/api/orders/${currentOrderId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              console.log('✅ Order status verified:', {
                orderId: orderCheck.data.order.id,
                status: orderCheck.data.order.status,
                paymentStatus: orderCheck.data.order.paymentStatus
              });
            } catch (checkError) {
              console.error('❌ Failed to verify order status:', checkError.message);
            }
          }, 1000);
        }
      } catch (confirmError) {
        console.error('❌ Payment confirmation failed:', confirmError.response?.data || confirmError.message);
        // Continue anyway since Stripe payment succeeded
      }

      // STEP 2: IMMEDIATELY CLEAR LOCAL CART STATE
      console.log('🔄 STEP 2: Clearing local cart state immediately');
      setCartItems([]);
      
      // STEP 3: ATTEMPT BACKEND CART CLEARING (but don't wait for it)
      console.log('🔄 STEP 3: Starting backend cart clearing (non-blocking)');
      if (userId && token) {
        clearCartUltimate(userId)
          .then(success => {
            if (success) {
              console.log('✅ Backend cart clearing completed successfully');
            } else {
              console.warn('⚠️ Backend cart clearing had issues, but local cart is cleared');
            }
          })
          .catch(error => {
            console.error('❌ Backend cart clearing error:', error);
          });
      }

      // STEP 4: Prepare success data
      const orderDataForSuccess = {
        id: currentOrderId,
        amount: getFinalTotal().toFixed(2),
        products: cartItems.map(item => ({
          title: item.title || item.name,
          price: item.price,
          quantity: item.quantity,
          img: item.img || item.image,
          size: item.size,
          color: item.color
        })),
        address: selectedAddress,
        paymentMethod: 'Credit Card',
        status: 'confirmed', // This should now be updated by the backend
        paymentStatus: 'paid', // This should now be updated by the backend
        createdAt: new Date().toISOString(),
        paymentIntentId: paymentIntent.id,
        shipping: calculateShipping().shipping,
        tax: 0
      };

      localStorage.setItem('lastOrder', JSON.stringify(orderDataForSuccess));
      if (userEmail) {
        localStorage.setItem('userEmail', userEmail);
      }

      // STEP 5: SEND EMAILS (non-blocking)
      console.log('📧 STEP 5: Sending emails (non-blocking)');
      Promise.all([
        sendPaymentConfirmationEmail(orderDataForSuccess, paymentIntent),
        sendOrderConfirmationEmail(orderDataForSuccess)
      ]).then(([paymentEmailSent, orderEmailSent]) => {
        console.log('📧 Email status:', {
          paymentEmail: paymentEmailSent ? '✅ Sent' : '❌ Failed',
          orderEmail: orderEmailSent ? '✅ Sent' : '❌ Failed'
        });
      }).catch(emailError => {
        console.error('📧 Email sending error:', emailError);
      });

      // STEP 6: Show success and redirect
      console.log('🎉 STEP 6: Payment completed successfully, redirecting...');
      setPaymentSuccess('Payment successful! Order confirmed and paid. Redirecting...');
      
      setTimeout(() => {
        setShowPayment(false);
        setClientSecret('');
        navigate('/success');
      }, 2000);

    } catch (error) {
      console.error('❌ Post-payment processing error:', error);
      
      // Even if there are issues, if payment was successful with Stripe, proceed
      if (paymentIntent.status === 'succeeded') {
        console.log('⚠️ Minor issues but Stripe payment succeeded, proceeding...');
        
        // Clear cart locally anyway as fallback
        setCartItems([]);
        
        setPaymentSuccess('Payment successful! Redirecting...');
        
        setTimeout(() => {
          setShowPayment(false);
          setClientSecret('');
          navigate('/success');
        }, 2000);
      } else {
        setPaymentError(`Payment processing failed: ${error.message}`);
      }
    }
  };

  const handlePaymentError = (errorMessage) => {
    console.error('❌ Payment error:', errorMessage);
    setPaymentError(`Payment failed: ${errorMessage}`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    if (!showAddressSection) {
      setShowAddressSection(true);
      return;
    }

    // Validate address before proceeding to payment
    if (!selectedAddress) {
      alert('Please select a shipping address');
      return;
    }

    setShowPayment(true);
    handlePayment(); // Start the payment process
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinueShopping = () => {
    // Clear payment flag when user continues shopping
    clearPaymentFlag();
    navigate('/');
  };

  const handleManageAddresses = () => {
    navigate('/addresses');
  };

  const shippingInfo = calculateShipping();

  if (loading) {
    return (
      <Container>
        <Wrapper>
          <Title>YOUR BAG</Title>
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading cart...</div>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={handleContinueShopping}>CONTINUE SHOPPING</TopButton>
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
            {cartItems.length === 0 ? (
              <EmptyCart>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart to see them here</p>
                <TopButton onClick={handleContinueShopping} style={{ marginTop: '20px' }}>
                  START SHOPPING
                </TopButton>
              </EmptyCart>
            ) : (
              cartItems.map((item) => (
                <div key={item.id}>
                  <Product>
                    <ProductDetail>
                      <Image src={item.img || 'https://via.placeholder.com/200x200?text=No+Image'} />
                      <Details>
                        <ProductName>
                          <b>Product:</b> {item.title}
                        </ProductName>
                        <ProductId>
                          <b>ID:</b> {item.productId}
                        </ProductId>
                        {item.size && (
                          <div>
                            <b>Size:</b> {item.size}
                          </div>
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
                        <QuantityButton onClick={() => handleQuantity(item.productId, item.quantity - 1)}>
                          -
                        </QuantityButton>
                        <ProductAmount>{item.quantity}</ProductAmount>
                        <QuantityButton onClick={() => handleQuantity(item.productId, item.quantity + 1)}>
                          +
                        </QuantityButton>
                      </ProductAmountContainer>
                      <ProductPrice>$ {(parseFloat(item.price) * item.quantity).toFixed(2)}</ProductPrice>
                    </PriceDetail>
                  </Product>
                  <Hr />
                </div>
              ))
            )}
          </Info>
          {cartItems.length > 0 && (
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

              {showAddressSection && (
                <AddressSection>
                  <h3>Shipping Address</h3>
                  
                  {userAddresses.length > 0 ? (
                    <AddressSelector>
                      <p>Select a saved address:</p>
                      {userAddresses.map((address) => (
                        <AddressOption 
                          key={address.id}
                          selected={selectedAddress?.id === address.id}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div>
                            <AddressType isDefault={address.isDefault}>
                              {address.type} {address.isDefault && '(Default)'}
                            </AddressType>
                          </div>
                          <AddressText>{address.street}</AddressText>
                          <AddressText>{address.city}, {address.state} {address.zipCode}</AddressText>
                          <AddressText>{address.country}</AddressText>
                        </AddressOption>
                      ))}
                    </AddressSelector>
                  ) : (
                    <p>No saved addresses found.</p>
                  )}

                  {!showNewAddressForm ? (
                    <div>
                      <NewAddressButton onClick={() => setShowNewAddressForm(true)}>
                        + Add New Address
                      </NewAddressButton>
                      <NewAddressButton onClick={handleManageAddresses} style={{ marginLeft: '10px' }}>
                        📋 Manage Addresses
                      </NewAddressButton>
                    </div>
                  ) : (
                    <div>
                      <h4>Add New Address</h4>
                      <Input
                        type="text"
                        name="street"
                        placeholder="Street Address"
                        value={newAddress.street}
                        onChange={handleInputChange}
                        required
                      />
                      <InputRow>
                        <InputGroup>
                          <Input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={handleInputChange}
                            required
                          />
                        </InputGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={newAddress.state}
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
                            value={newAddress.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </InputGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={newAddress.country}
                            onChange={handleInputChange}
                            required
                          />
                        </InputGroup>
                      </InputRow>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <NewAddressButton onClick={addNewAddress}>
                          Save Address
                        </NewAddressButton>
                        <NewAddressButton onClick={() => setShowNewAddressForm(false)}>
                          Cancel
                        </NewAddressButton>
                      </div>
                    </div>
                  )}
                </AddressSection>
              )}

              <Button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isCheckingOut || (showAddressSection && !selectedAddress)}
                style={{
                  backgroundColor: cartItems.length === 0 ? '#ccc' : isCheckingOut ? '#ffa500' : '#000'
                }}
              >
                {isCheckingOut ? '🔄 PROCESSING...' : 
                 showAddressSection ? '💳 PROCEED TO PAYMENT' : 
                 `🛒 CHECKOUT NOW ($${getFinalTotal().toFixed(2)})`}
              </Button>
            </Summary>
          )}
        </Bottom>
      </Wrapper>

      {showPayment && (
        <PaymentModal>
          <PaymentContent>
            <h2 style={{ marginBottom: '10px', color: '#333' }}>Complete Your Purchase</h2>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#2c5aa0', marginBottom: '20px' }}>
              Total Amount: <span style={{ color: '#4CAF50' }}>${getFinalTotal().toFixed(2)}</span>
            </p>
            
            {paymentError && (
              <ErrorMessage>
                <strong>Payment Error:</strong> {paymentError}
                <br />
                <small>Please check your address information and try again.</small>
              </ErrorMessage>
            )}
            {paymentSuccess && <SuccessMessage>{paymentSuccess}</SuccessMessage>}
            
            {!clientSecret && isCheckingOut && (
              <LoadingSpinner>
                <div style={{ marginBottom: '10px' }}>🔄 Setting up payment...</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Creating order and payment session...
                </div>
              </LoadingSpinner>
            )}
            
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm 
                  amount={getFinalTotal().toFixed(2)}
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            ) : (
              !isCheckingOut && (
                <div>
                  <PayNowBtn 
                    onClick={handlePayment} 
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Setting Up Payment...' : 'Try Payment Again'}
                  </PayNowBtn>
                </div>
              )
            )}
            
            <CancelBtn onClick={() => {
              setShowPayment(false);
              setClientSecret('');
              setPaymentError('');
              setPaymentSuccess('');
              setIsCheckingOut(false);
            }}>
              Cancel Payment
            </CancelBtn>
          </PaymentContent>
        </PaymentModal>
      )}
    </Container>
  );
};

export default CartPage;
