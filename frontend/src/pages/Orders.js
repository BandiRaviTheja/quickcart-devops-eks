import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.75rem;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const OrderCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 15px;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  flex-direction: column;
  gap: 10px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const OrderDate = styled.span`
  color: #666;
  font-size: 12px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const OrderStatus = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    switch(props.status) {
      case 'confirmed': return '#e3f2fd';
      case 'shipped': return '#fff3e0';
      case 'delivered': return '#e8f5e8';
      case 'cancelled': return '#ffebee';
      case 'pending': return '#fff3e0';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'confirmed': return '#1976d2';
      case 'shipped': return '#f57c00';
      case 'delivered': return '#388e3c';
      case 'cancelled': return '#d32f2f';
      case 'pending': return '#ff9800';
      default: return '#757575';
    }
  }};
`;

const PaymentStatus = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    switch(props.status) {
      case 'paid': return '#e8f5e8';
      case 'failed': return '#ffebee';
      case 'refunded': return '#fff3e0';
      case 'pending': return '#fff3e0';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'paid': return '#388e3c';
      case 'failed': return '#d32f2f';
      case 'refunded': return '#f57c00';
      case 'pending': return '#ff9800';
      default: return '#757575';
    }
  }};
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const ProductName = styled.div`
  font-weight: 500;
  margin-bottom: 5px;
`;

const ProductPrice = styled.div`
  color: #666;
  font-size: 14px;
`;

const AddressSection = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const AddressTitle = styled.h4`
  margin-bottom: 10px;
  color: #333;
`;

const AddressText = styled.p`
  margin: 5px 0;
  color: #666;
  font-size: 14px;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  font-weight: 600;
  font-size: 18px;
`;

const Loading = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
  min-height: 44px;
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

const StatusRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  min-height: 44px;
  
  &:hover {
    background-color: #d32f2f;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
    width: 100%;
  }
`;

const TrackingSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const TrackingTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
`;

const TrackingSteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 20px 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    
    &::before {
      display: none;
    }
  }
`;

const TrackingStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: row;
    gap: 15px;
  }
`;

const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  border: 2px solid ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const StepLabel = styled.span`
  font-size: 12px;
  text-align: center;
  color: ${props => props.active ? '#4CAF50' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
`;

const TrackingInfo = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
`;

const TrackingItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 5px;
  }
`;

const TrackingLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const TrackingValue = styled.span`
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const CancelledMessage = styled.div`
  padding: 15px;
  margin: 15px 0;
  background-color: #fff3e0;
  border: 1px solid #ffb74d;
  border-radius: 6px;
  text-align: center;
  color: #e65100;
  font-weight: 600;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Function to send cancellation email
  const sendCancellationEmail = async (order) => {
    try {
      console.log('📧 Sending cancellation email for order:', order.id);
      
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email || order.userEmail;

      if (!userEmail) {
        console.warn('No email found for cancellation notification');
        return false;
      }

      const emailData = {
        orderData: {
          id: order.id,
          products: order.products || order.items || [],
          address: order.address || order.shippingAddress,
          totalAmount: order.amount || order.totalAmount,
          shipping: order.shipping || 0,
          tax: order.tax || 0,
          createdAt: order.createdAt
        },
        userEmail: userEmail
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/email/order-cancellation`,
        emailData,
        { headers: getAuthHeader() }
      );

      console.log('✅ Cancellation email sent successfully:', response.data);
      return true;
    } catch (emailError) {
      console.error('❌ Failed to send cancellation email:', emailError);
      return false;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        { headers: getAuthHeader() }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Refund will be processed within 5-7 business days.')) {
      return;
    }

    setCancellingOrder(orderId);
    setMessage('');
    setError('');

    try {
      const orderToCancel = orders.find(order => order.id === orderId);
      
      if (!orderToCancel) {
        throw new Error('Order not found');
      }

      // Step 1: Update order status to 'cancelled'
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`,
        { status: 'cancelled' },
        { headers: getAuthHeader() }
      );

      // Step 2: If payment was paid, update payment status to 'refunded'
      if (orderToCancel.paymentStatus === 'paid') {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/payment-status`,
          { paymentStatus: 'refunded' },
          { headers: getAuthHeader() }
        );
      }

      // ✅ SEND CANCELLATION EMAIL
      const emailSent = await sendCancellationEmail(orderToCancel);
      
      // Update the order status locally immediately
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { 
                ...order, 
                status: 'cancelled',
                paymentStatus: order.paymentStatus === 'paid' ? 'refunded' : order.paymentStatus
              }
            : order
        )
      );

      setMessage(`Order cancelled successfully${emailSent ? ' and confirmation email sent' : ''}`);
      
      // Refresh orders from server after 2 seconds to confirm
      setTimeout(() => {
        fetchOrders();
      }, 2000);

    } catch (error) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.error || 'Failed to cancel order. Please try again.';
      setError(errorMessage);
    } finally {
      setCancellingOrder(null);
    }
  };

  const getTrackingStatus = (order) => {
    if (!['confirmed', 'shipped', 'delivered', 'processing'].includes(order.status)) {
      return null;
    }

    const steps = [
      { id: 'confirmed', label: 'Order Confirmed', description: 'Your order has been confirmed' },
      { id: 'processing', label: 'Processing', description: 'Preparing your order for shipment' },
      { id: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
      { id: 'delivered', label: 'Delivered', description: 'Order delivered successfully' }
    ];

    let activeStep = 0;
    
    switch (order.status) {
      case 'confirmed':
        activeStep = 0;
        break;
      case 'processing':
        activeStep = 1;
        break;
      case 'shipped':
        activeStep = 2;
        break;
      case 'delivered':
        activeStep = 3;
        break;
      default:
        activeStep = 0;
    }

    const trackingNumber = `TRK${order.id.slice(-8).toUpperCase()}`;
    
    const orderDate = new Date(order.createdAt);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(orderDate.getDate() + Math.floor(Math.random() * 5) + 3);

    return {
      steps,
      activeStep,
      trackingNumber,
      estimatedDelivery: estimatedDelivery.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      carrier: 'QuickCart Express',
      currentLocation: getCurrentLocation(order.status)
    };
  };

  const getCurrentLocation = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Processing Center';
      case 'processing':
        return 'Warehouse';
      case 'shipped':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Processing Center';
    }
  };

  const canCancelOrder = (order) => {
    return order.status === 'confirmed' || order.status === 'pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  if (loading) {
    return (
      <Container>
        <Title>MY ORDERS</Title>
        <Loading>Loading your orders...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Title>MY ORDERS</Title>
      
      {message && (
        <SuccessMessage>
          ✅ {message}
          <button onClick={clearMessages} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#155724', cursor: 'pointer' }}>
            ×
          </button>
        </SuccessMessage>
      )}

      {error && (
        <ErrorMessage>
          ❌ {error}
          <button onClick={clearMessages} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#721c24', cursor: 'pointer' }}>
            ×
          </button>
        </ErrorMessage>
      )}
      
      {orders.length === 0 ? (
        <EmptyOrders>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <Button onClick={handleContinueShopping}>START SHOPPING</Button>
        </EmptyOrders>
      ) : (
        orders.map((order) => {
          const tracking = getTrackingStatus(order);
          const showCancelButton = canCancelOrder(order);
          const isCancelled = order.status === 'cancelled';

          return (
            <OrderCard key={order.id}>
              <OrderHeader>
                <div>
                  <OrderId>Order #: {order.id}</OrderId>
                  <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                </div>
                <StatusRow>
                  <OrderStatus status={order.status}>
                    {order.status.toUpperCase()}
                  </OrderStatus>
                  <PaymentStatus status={order.paymentStatus}>
                    {order.paymentStatus.toUpperCase()}
                  </PaymentStatus>
                </StatusRow>
              </OrderHeader>

              <div>
                <h4>Products:</h4>
                {order.products.map((product, index) => (
                  <ProductItem key={index}>
                    <ProductImage 
                      src={product.img || 'https://via.placeholder.com/60x60?text=No+Image'} 
                      alt={product.title}
                    />
                    <ProductDetails>
                      <ProductName>{product.title}</ProductName>
                      <ProductPrice>
                        ${parseFloat(product.price).toFixed(2)} × {product.quantity}
                      </ProductPrice>
                      {product.size && <div>Size: {product.size}</div>}
                      {product.color && <div>Color: {product.color}</div>}
                    </ProductDetails>
                    <div>
                      ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                    </div>
                  </ProductItem>
                ))}
              </div>

              <AddressSection>
                <AddressTitle>Shipping Address</AddressTitle>
                <AddressText>{order.address.street}</AddressText>
                <AddressText>
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </AddressText>
                <AddressText>{order.address.country}</AddressText>
              </AddressSection>

              {isCancelled && (
                <CancelledMessage>
                  ❌ This order has been cancelled. 
                  {order.paymentStatus === 'refunded' && ' Refund has been processed.'}
                </CancelledMessage>
              )}

              {tracking && !isCancelled && (
                <TrackingSection>
                  <TrackingTitle>Order Tracking</TrackingTitle>
                  
                  <TrackingSteps>
                    {tracking.steps.map((step, index) => (
                      <TrackingStep key={step.id}>
                        <StepCircle active={index <= tracking.activeStep}>
                          {index + 1}
                        </StepCircle>
                        <StepLabel active={index <= tracking.activeStep}>
                          {step.label}
                        </StepLabel>
                      </TrackingStep>
                    ))}
                  </TrackingSteps>

                  <TrackingInfo>
                    <TrackingItem>
                      <TrackingLabel>Tracking Number:</TrackingLabel>
                      <TrackingValue>{tracking.trackingNumber}</TrackingValue>
                    </TrackingItem>
                    <TrackingItem>
                      <TrackingLabel>Carrier:</TrackingLabel>
                      <TrackingValue>{tracking.carrier}</TrackingValue>
                    </TrackingItem>
                    <TrackingItem>
                      <TrackingLabel>Current Status:</TrackingLabel>
                      <TrackingValue>{tracking.steps[tracking.activeStep].description}</TrackingValue>
                    </TrackingItem>
                    <TrackingItem>
                      <TrackingLabel>Estimated Delivery:</TrackingLabel>
                      <TrackingValue>{tracking.estimatedDelivery}</TrackingValue>
                    </TrackingItem>
                    <TrackingItem>
                      <TrackingLabel>Current Location:</TrackingLabel>
                      <TrackingValue>{tracking.currentLocation}</TrackingValue>
                    </TrackingItem>
                  </TrackingInfo>
                </TrackingSection>
              )}

              <OrderTotal>
                <span>Total Amount:</span>
                <span>${parseFloat(order.amount).toFixed(2)}</span>
              </OrderTotal>

              {showCancelButton && (
                <ActionButtons>
                  <CancelButton 
                    onClick={() => cancelOrder(order.id)}
                    disabled={cancellingOrder === order.id}
                  >
                    {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                  </CancelButton>
                </ActionButtons>
              )}
            </OrderCard>
          );
        })
      )}
    </Container>
  );
};

export default Orders;