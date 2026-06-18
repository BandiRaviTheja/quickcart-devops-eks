import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 40px 20px;
  max-width: 500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 30px 20px;
    min-height: 50vh;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
    min-height: 40vh;
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  color: #10B981;

  @media (max-width: 768px) {
    font-size: 3.5rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 3rem;
    margin-bottom: 12px;
  }
`;

const Title = styled.h1`
  color: #10B981;
  margin-bottom: 16px;
  font-size: 2rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 12px;
  }
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 24px;
  color: #6B7280;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 18px;
    line-height: 1.4;
  }
`;

const OrderSummary = styled.div`
  background: #F9FAFB;
  padding: 20px;
  border-radius: 12px;
  margin: 20px 0;
  text-align: left;
  width: 100%;
  border: 1px solid #E5E7EB;

  @media (max-width: 768px) {
    padding: 18px;
    margin: 18px 0;
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin: 15px 0;
  }
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 0.95rem;
  
  strong {
    color: #374151;
  }
  
  span {
    color: #6B7280;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 6px 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 24px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    width: 100%;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: background-color 0.2s;
  min-width: 140px;
  
  &:hover {
    background-color: #333;
  }
  
  &.outline {
    background-color: transparent;
    border: 1px solid #D1D5DB;
    color: #374151;
    
    &:hover {
      background-color: #F9FAFB;
    }
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 250px;
    padding: 14px 24px;
    font-size: 0.9rem;
  }
`;

const EmailStatus = styled.div`
  margin: 16px 0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
  
  ${props => props.type === 'loading' && `
    background-color: #EFF6FF;
    color: #1E40AF;
    border: 1px solid #DBEAFE;
  `}
  
  ${props => props.type === 'success' && `
    background-color: #D1FAE5;
    color: #065F46;
    border: 1px solid #A7F3D0;
  `}
  
  ${props => props.type === 'error' && `
    background-color: #FEE2E2;
    color: #991B1B;
    border: 1px solid #FECACA;
  `}

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 10px 14px;
    margin: 12px 0;
  }
`;

const Success = () => {
  const navigate = useNavigate();
  const [emailStatus, setEmailStatus] = useState('sending');
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const processSuccess = async () => {
      try {
        // Get order data from localStorage
        const savedOrderData = JSON.parse(localStorage.getItem('lastOrder'));
        const user = JSON.parse(localStorage.getItem('user'));
        
        console.log('🔄 Processing successful order...');

        if (savedOrderData) {
          setOrderData(savedOrderData);

          // Try to send confirmation emails (optional)
          if (user && user.email) {
            try {
              console.log('📧 Sending confirmation emails...');
              
              await axios.post(
                `${process.env.REACT_APP_API_URL}/api/email/order-confirmation`,
                {
                  orderData: {
                    ...savedOrderData,
                    id: savedOrderData.id || `ORD${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    status: 'confirmed'
                  },
                  userEmail: user.email
                },
                { timeout: 5000 }
              );

              setEmailStatus('sent');
              console.log('✅ Confirmation emails sent');
            } catch (emailError) {
              console.error('❌ Email sending failed:', emailError);
              setEmailStatus('failed');
            }
          } else {
            setEmailStatus('no-data');
          }

          // Clear localStorage after a delay
          setTimeout(() => {
            localStorage.removeItem('lastOrder');
          }, 3000);
        } else {
          setEmailStatus('no-data');
        }
      } catch (error) {
        console.error('❌ Error in success page:', error);
        setEmailStatus('failed');
      }
    };

    processSuccess();
  }, []);

  const getEmailStatusMessage = () => {
    switch (emailStatus) {
      case 'sending':
        return '📧 Sending confirmation email...';
      case 'sent':
        return '✅ Confirmation email sent!';
      case 'failed':
        return '⚠️ Order successful! Check your email for confirmation.';
      case 'no-data':
        return '✅ Order successful!';
      default:
        return '';
    }
  };

  const getEmailStatusType = () => {
    switch (emailStatus) {
      case 'sending':
        return 'loading';
      case 'sent':
        return 'success';
      case 'failed':
      case 'no-data':
        return 'error';
      default:
        return 'loading';
    }
  };

  return (
    <Container>
      <SuccessIcon>✅</SuccessIcon>
      <Title>Order Successful!</Title>
      <Message>
        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
      </Message>

      {orderData && (
        <OrderSummary>
          <h3 style={{ margin: '0 0 16px 0', color: '#111827', fontSize: '1.1rem' }}>
            Order Summary
          </h3>
          <OrderDetail>
            <strong>Order ID:</strong>
            <span>{orderData.id ? `#${orderData.id.slice(-8)}` : 'Processing...'}</span>
          </OrderDetail>
          <OrderDetail>
            <strong>Total Amount:</strong>
            <span>${orderData.amount || orderData.total}</span>
          </OrderDetail>
          <OrderDetail>
            <strong>Items:</strong>
            <span>{orderData.products ? orderData.products.length : 0} item(s)</span>
          </OrderDetail>
          <OrderDetail>
            <strong>Status:</strong>
            <span style={{ color: '#10B981', fontWeight: '600' }}>Confirmed</span>
          </OrderDetail>
        </OrderSummary>
      )}

      {emailStatus !== 'no-data' && (
        <EmailStatus type={getEmailStatusType()}>
          {getEmailStatusMessage()}
        </EmailStatus>
      )}

      <ButtonContainer>
        <Button onClick={() => navigate('/orders')}>
          View Orders
        </Button>
        <Button className="outline" onClick={() => navigate('/')}>
          Continue Shopping
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default Success;