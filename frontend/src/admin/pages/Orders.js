import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
`;

const OrdersTable = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1.5fr;
  padding: 15px 20px;
  background: #f8f9fa;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1.5fr;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  &.pending { background: #fff3cd; color: #856404; }
  &.confirmed { background: #d1ecf1; color: #0c5460; }
  &.shipped { background: #d4edda; color: #155724; }
  &.delivered { background: #e2e3e5; color: #383d41; }
  &.cancelled { background: #f8d7da; color: #721c24; }
`;

const Loading = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin: 2px;
  
  &.primary { background: #007bff; color: white; }
  &.success { background: #28a745; color: white; }
  &.warning { background: #ffc107; color: black; }
  &.danger { background: #dc3545; color: white; }
`;

const Modal = styled.div`
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
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

const ShippingModal = styled(Modal)``;

const ShippingModalContent = styled(ModalContent)`
  max-width: 500px;
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CustomerAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const CustomerDetails = styled.div`
  text-align: left;
`;

const CustomerName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const CustomerPhone = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;

const CustomerAddress = styled.div`
  font-size: 11px;
  color: #888;
  margin-top: 2px;
  line-height: 1.3;
`;

const OrderDetailsModal = styled(Modal)``;

const OrderDetailsContent = styled(ModalContent)`
  max-width: 600px;
  text-align: left;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #333;
`;

const DetailValue = styled.span`
  color: #666;
`;

const ProductList = styled.div`
  margin-top: 10px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProductInfo = styled.div`
  flex: 2;
`;

const ProductPrice = styled.div`
  flex: 1;
  text-align: right;
  font-weight: 600;
`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [shippingModal, setShippingModal] = useState(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [shippingData, setShippingData] = useState({
    trackingNumber: '',
    carrier: 'QuickCart Logistics',
    estimatedDelivery: ''
  });
  const [userProfiles, setUserProfiles] = useState({});
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ✅ NEW: Function to fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        { 
          headers: getAuthHeader(),
          params: { userId }
        }
      );
      
      console.log('✅ User profile data:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      return null;
    }
  };

  // ✅ NEW: Function to fetch all users for admin
  const fetchAllUsers = async () => {
    try {
      console.log('🔍 Fetching all users...');
      
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/users`,
        { headers: getAuthHeader() }
      );
      
      console.log('✅ All users data:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/orders/admin/all`,
        { 
          headers: getAuthHeader(),
          params: {
            includeUser: true,
            includeCustomer: true
          }
        }
      );
      
      const ordersData = response.data.orders || response.data || [];
      console.log('📦 Orders loaded:', ordersData.length);
      
      // ✅ NEW: Fetch user profiles for all orders
      const userProfilesMap = {};
      const usersList = await fetchAllUsers();
      
      if (Array.isArray(usersList)) {
        usersList.forEach(user => {
          if (user.id || user._id) {
            const userId = user.id || user._id;
            userProfilesMap[userId] = {
              id: userId,
              email: user.email,
              username: user.username,
              name: user.profile?.name || user.name || user.username,
              phone: user.profile?.phone || user.phone || '',
              addresses: user.profile?.addresses || user.addresses || []
            };
          }
        });
      }
      
      console.log('👥 User profiles map:', userProfilesMap);
      setUserProfiles(userProfilesMap);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ UPDATED: Helper to get customer display info with profile data
  const getCustomerDisplayInfo = (order) => {
    const userId = order.userId || order.user?.id || order.user?._id;
    
    if (userId && userProfiles[userId]) {
      const userProfile = userProfiles[userId];
      return {
        name: userProfile.name || 'Customer',
        email: userProfile.email || 'No email',
        phone: userProfile.phone || 'No phone',
        initial: (userProfile.name || 'C').charAt(0).toUpperCase(),
        address: userProfile.addresses?.[0] || null
      };
    }
    
    // Fallback to order data
    const email = order.userEmail || order.email || order.user?.email || 'Customer';
    const nameFromEmail = email.split('@')[0];
    
    return {
      name: nameFromEmail,
      email: email,
      phone: 'No phone',
      initial: nameFromEmail.charAt(0).toUpperCase(),
      address: order.address || null
    };
  };

  // ✅ UPDATED: Function to send email with proper profile data
  const sendEmailWithData = async (order, status, userEmail, customerInfo) => {
    try {
      console.log('📤 Preparing to send email to:', userEmail);

      const orderDataForEmail = {
        id: order.id,
        products: order.products || order.items || [],
        address: customerInfo.address || order.address || order.shippingAddress || {},
        shippingAddress: order.shippingAddress || order.address || customerInfo.address || {},
        totalAmount: order.amount || order.totalAmount || 0,
        shipping: order.shipping || 0,
        tax: order.tax || 0,
        trackingNumber: shippingData.trackingNumber,
        carrier: shippingData.carrier,
        estimatedDelivery: shippingData.estimatedDelivery,
        status: status,
        createdAt: order.createdAt || new Date().toISOString(),
        customerName: customerInfo.name,
        customerEmail: userEmail,
        customerPhone: customerInfo.phone,
        userEmail: userEmail
      };

      console.log('📦 Final email data:', orderDataForEmail);

      const emailData = {
        orderData: orderDataForEmail,
        userEmail: userEmail,
        status: status
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/email/shipping-update`,
        emailData,
        { 
          headers: getAuthHeader(),
          timeout: 15000
        }
      );

      console.log('✅ Email sent successfully:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  };

  // ✅ UPDATED: Function to send shipping email
  const sendShippingEmail = async (order, status) => {
    try {
      console.log('📧 Sending shipping email for order:', order.id);
      
      const customerInfo = getCustomerDisplayInfo(order);
      const userEmail = customerInfo.email;

      if (!userEmail || userEmail === 'No email') {
        console.error('❌ No valid email found for customer');
        return false;
      }

      console.log('✅ Using customer data:', customerInfo);
      return await sendEmailWithData(order, status, userEmail, customerInfo);
        
    } catch (emailError) {
      console.error('❌ Failed to send shipping email:', emailError);
      return false;
    }
  };

  // ✅ UPDATED: Function to send cancellation email
  const sendCancellationEmail = async (order) => {
    try {
      console.log('📧 Sending cancellation email for order:', order.id);
      
      const customerInfo = getCustomerDisplayInfo(order);
      const userEmail = customerInfo.email;

      if (!userEmail || userEmail === 'No email') {
        console.error('❌ No valid email found for cancellation');
        return false;
      }

      const emailData = {
        orderData: {
          id: order.id,
          products: order.products || order.items || [],
          address: customerInfo.address || order.address || order.shippingAddress || {},
          totalAmount: order.amount || order.totalAmount || 0,
          shipping: order.shipping || 0,
          tax: order.tax || 0,
          createdAt: order.createdAt || new Date().toISOString(),
          customerName: customerInfo.name,
          customerEmail: userEmail,
          customerPhone: customerInfo.phone,
          userEmail: userEmail
        },
        userEmail: userEmail
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/email/order-cancellation`,
        emailData,
        { 
          headers: getAuthHeader(),
          timeout: 15000
        }
      );

      console.log('✅ Cancellation email sent successfully:', response.data);
      return true;
    } catch (error) {
      console.error('❌ Cancellation email sending failed:', error);
      return false;
    }
  };

  const updateOrderStatus = async (orderId, newStatus, order) => {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      const updateResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: getAuthHeader() }
      );

      console.log('✅ Order status updated in database:', updateResponse.data);

      let emailSent = false;
      let emailType = '';
      
      if (newStatus === 'shipped') {
        emailSent = await sendShippingEmail(order, 'shipped');
        emailType = 'shipping confirmation';
      } else if (newStatus === 'delivered') {
        emailSent = await sendShippingEmail(order, 'delivered');
        emailType = 'delivery confirmation';
      } else if (newStatus === 'cancelled') {
        emailSent = await sendCancellationEmail(order);
        emailType = 'cancellation';
      }

      setMessage(`Order status updated to ${newStatus}${emailSent ? ` and ${emailType} email sent` : ' (email failed - no user email found)'}`);
      fetchOrders();
      setShippingModal(null);
    } catch (error) {
      console.error('Error updating order:', error);
      setError(`Failed to update order status: ${error.response?.data?.error || error.message}`);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}`,
        { headers: getAuthHeader() }
      );
      setMessage('Order deleted successfully');
      setDeleteModal(null);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order');
      setDeleteModal(null);
    }
  };

  const openDeleteModal = (order) => {
    setDeleteModal(order);
  };

  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  const openShippingModal = (order) => {
    setShippingModal(order);
    const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    setShippingData({
      trackingNumber: trackingNumber,
      carrier: 'QuickCart Logistics',
      estimatedDelivery: estimatedDelivery
    });
  };

  const closeShippingModal = () => {
    setShippingModal(null);
    setShippingData({
      trackingNumber: '',
      carrier: 'QuickCart Logistics',
      estimatedDelivery: ''
    });
  };

  const openOrderDetails = (order) => {
    setOrderDetailsModal(order);
  };

  const closeOrderDetails = () => {
    setOrderDetailsModal(null);
  };

  const handleShippingDataChange = (field, value) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShipOrder = () => {
    if (shippingModal) {
      updateOrderStatus(shippingModal.id, 'shipped', {
        ...shippingModal,
        trackingNumber: shippingData.trackingNumber,
        carrier: shippingData.carrier
      });
    }
  };

  const cancelOrder = async (orderId, order) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`,
        { status: 'cancelled' },
        { headers: getAuthHeader() }
      );

      const emailSent = await sendCancellationEmail(order);

      setMessage(`Order cancelled${emailSent ? ' and cancellation email sent' : ' (email failed - no user email found)'}`);
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order');
    }
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  // ✅ UPDATED: Format address for display
  const formatAddress = (address) => {
    if (!address) return 'No address';
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <h1>📋 Manage Orders</h1>
        </Header>
        <Loading>Loading orders from database...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>📋 Manage Orders</h1>
        <Button onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </Button>
      </Header>

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

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={fetchOrders} style={{marginRight: '10px'}}>
          🔄 Refresh Orders
        </Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState>
          <h3>No orders found</h3>
          <p>Orders will appear here when customers make purchases</p>
        </EmptyState>
      ) : (
        <OrdersTable>
          <TableHeader>
            <div>Order ID</div>
            <div>Customer Details</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Payment</div>
            <div>Actions</div>
          </TableHeader>
          
          {orders.map((order) => {
            const customerInfo = getCustomerDisplayInfo(order);
            return (
              <TableRow key={order.id}>
                <div>#{order.id?.slice(-8) || 'N/A'}</div>
                <div>
                  <CustomerInfo>
                    <CustomerAvatar>
                      {customerInfo.initial}
                    </CustomerAvatar>
                    <CustomerDetails>
                      <CustomerName>{customerInfo.name}</CustomerName>
                      <CustomerEmail>{customerInfo.email}</CustomerEmail>
                      <CustomerPhone>{customerInfo.phone}</CustomerPhone>
                      {customerInfo.address && (
                        <CustomerAddress>
                          {formatAddress(customerInfo.address)}
                        </CustomerAddress>
                      )}
                    </CustomerDetails>
                  </CustomerInfo>
                </div>
                <div>${order.amount || order.totalAmount || '0.00'}</div>
                <div>
                  <StatusBadge className={order.status}>
                    {order.status}
                  </StatusBadge>
                </div>
                <div>
                  <StatusBadge className={order.paymentStatus}>
                    {order.paymentStatus}
                  </StatusBadge>
                </div>
                <div>
                  <ActionButton 
                    className="primary"
                    onClick={() => openOrderDetails(order)}
                  >
                    View
                  </ActionButton>
                  
                  {order.status === 'confirmed' && (
                    <ActionButton 
                      className="success"
                      onClick={() => openShippingModal(order)}
                    >
                      Ship
                    </ActionButton>
                  )}
                  
                  {order.status === 'shipped' && (
                    <ActionButton 
                      className="warning"
                      onClick={() => updateOrderStatus(order.id, 'delivered', order)}
                    >
                      Deliver
                    </ActionButton>
                  )}
                  
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <ActionButton 
                      className="danger"
                      onClick={() => cancelOrder(order.id, order)}
                    >
                      Cancel
                    </ActionButton>
                  )}
                  
                  <ActionButton 
                    className="danger"
                    onClick={() => openDeleteModal(order)}
                  >
                    Delete
                  </ActionButton>
                </div>
              </TableRow>
            );
          })}
        </OrdersTable>
      )}

      {/* Order Details Modal */}
      {orderDetailsModal && (
        <OrderDetailsModal>
          <OrderDetailsContent>
            <h3>📋 Order Details</h3>
            
            <DetailSection>
              <h4>Customer Information</h4>
              {(() => {
                const customerInfo = getCustomerDisplayInfo(orderDetailsModal);
                return (
                  <>
                    <DetailRow>
                      <DetailLabel>Name:</DetailLabel>
                      <DetailValue>{customerInfo.name}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Email:</DetailLabel>
                      <DetailValue>{customerInfo.email}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Phone:</DetailLabel>
                      <DetailValue>{customerInfo.phone}</DetailValue>
                    </DetailRow>
                    <DetailRow>
                      <DetailLabel>Address:</DetailLabel>
                      <DetailValue>{formatAddress(customerInfo.address)}</DetailValue>
                    </DetailRow>
                  </>
                );
              })()}
            </DetailSection>

            <DetailSection>
              <h4>Order Information</h4>
              <DetailRow>
                <DetailLabel>Order ID:</DetailLabel>
                <DetailValue>#{orderDetailsModal.id}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>
                  <StatusBadge className={orderDetailsModal.status}>
                    {orderDetailsModal.status}
                  </StatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Payment Status:</DetailLabel>
                <DetailValue>
                  <StatusBadge className={orderDetailsModal.paymentStatus}>
                    {orderDetailsModal.paymentStatus}
                  </StatusBadge>
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Total Amount:</DetailLabel>
                <DetailValue>${orderDetailsModal.amount || orderDetailsModal.totalAmount}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Order Date:</DetailLabel>
                <DetailValue>
                  {new Date(orderDetailsModal.createdAt).toLocaleDateString()}
                </DetailValue>
              </DetailRow>
            </DetailSection>

            <DetailSection>
              <h4>Products</h4>
              <ProductList>
                {(orderDetailsModal.products || orderDetailsModal.items || []).map((product, index) => (
                  <ProductItem key={index}>
                    <ProductInfo>
                      <div style={{ fontWeight: '600' }}>{product.title || product.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Qty: {product.quantity} • Size: {product.size || 'One Size'} • Color: {product.color || 'Default'}
                      </div>
                    </ProductInfo>
                    <ProductPrice>
                      ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                    </ProductPrice>
                  </ProductItem>
                ))}
              </ProductList>
            </DetailSection>

            <ModalActions>
              <CancelButton onClick={closeOrderDetails}>
                Close
              </CancelButton>
            </ModalActions>
          </OrderDetailsContent>
        </OrderDetailsModal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <Modal>
          <ModalContent>
            <h3>Confirm Order Deletion</h3>
            <p>Are you sure you want to delete this order?</p>
            <p><strong>Order ID:</strong> #{deleteModal.id?.slice(-8) || 'N/A'}</p>
            <p><strong>Amount:</strong> ${deleteModal.amount || deleteModal.totalAmount}</p>
            <p><strong>Status:</strong> {deleteModal.status}</p>
            <p style={{ color: '#dc3545', fontWeight: '600' }}>
              ⚠️ This action cannot be undone!
            </p>
            <ModalActions>
              <ConfirmButton onClick={() => deleteOrder(deleteModal.id)}>
                Delete Order
              </ConfirmButton>
              <CancelButton onClick={closeDeleteModal}>
                Cancel
              </CancelButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* Shipping Modal */}
      {shippingModal && (
        <ShippingModal>
          <ShippingModalContent>
            <h3>🚚 Ship Order</h3>
            <p>Shipping order #{shippingModal.id?.slice(-8) || 'N/A'}</p>
            
            {(() => {
              const customerInfo = getCustomerDisplayInfo(shippingModal);
              return (
                <div style={{ marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <p style={{ margin: '5px 0', fontWeight: '600' }}>{customerInfo.name}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{customerInfo.email}</p>
                  <p style={{ margin: '5px 0', fontSize: '14px' }}>{customerInfo.phone}</p>
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                    {formatAddress(customerInfo.address)}
                  </p>
                </div>
              );
            })()}
            
            <FormGroup>
              <Label>Tracking Number *</Label>
              <Input
                type="text"
                value={shippingData.trackingNumber}
                onChange={(e) => handleShippingDataChange('trackingNumber', e.target.value)}
                placeholder="Enter tracking number"
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Carrier *</Label>
              <Select
                value={shippingData.carrier}
                onChange={(e) => handleShippingDataChange('carrier', e.target.value)}
                required
              >
                <option value="QuickCart Logistics">QuickCart Logistics</option>
                <option value="FedEx">FedEx</option>
                <option value="UPS">UPS</option>
                <option value="USPS">USPS</option>
                <option value="DHL">DHL</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Estimated Delivery *</Label>
              <Input
                type="date"
                value={shippingData.estimatedDelivery}
                onChange={(e) => handleShippingDataChange('estimatedDelivery', e.target.value)}
                required
              />
            </FormGroup>
            
            <div style={{ 
              background: '#e7f3ff', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              borderLeft: '4px solid #007bff'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#004085' }}>📧 Email Notification</h4>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#004085' }}>
                A shipping confirmation email will be sent to the customer's registered email address
              </p>
            </div>
            
            <ModalActions>
              <ConfirmButton 
                onClick={handleShipOrder}
                style={{ background: '#28a745' }}
                disabled={!shippingData.trackingNumber || !shippingData.carrier || !shippingData.estimatedDelivery}
              >
                Confirm Shipping & Send Email
              </ConfirmButton>
              <CancelButton onClick={closeShippingModal}>
                Cancel
              </CancelButton>
            </ModalActions>
          </ShippingModalContent>
        </ShippingModal>
      )}
    </Container>
  );
};

export default AdminOrders;