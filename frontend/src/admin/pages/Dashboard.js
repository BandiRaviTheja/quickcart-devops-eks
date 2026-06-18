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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
  
  h3 {
    color: #666;
    margin-bottom: 10px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .number {
    font-size: 2.5em;
    font-weight: bold;
    color: #667eea;
    margin: 10px 0;
  }
  
  .subtext {
    font-size: 12px;
    color: #888;
    margin-top: 5px;
  }
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
`;

const NavCard = styled.div`
  background: white;
  padding: 30px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border-color: #667eea;
  }
  
  .icon {
    font-size: 2.5em;
    margin-bottom: 15px;
    color: #667eea;
  }
  
  h3 {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.1em;
  }
  
  p {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c0392b;
    transform: translateY(-1px);
  }
`;

const RecentActivity = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 30px;
`;

const ActivityItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #333;
`;

const OrderAmount = styled.span`
  font-weight: bold;
  color: #667eea;
`;

const OrderStatus = styled.span`
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'background: #d4edda; color: #155724;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      case 'cancelled':
        return 'background: #f8d7da; color: #721c24;';
      case 'shipped':
        return 'background: #cce7ff; color: #004085;';
      default:
        return 'background: #e9ecef; color: #495057;';
    }
  }}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 6px;
  margin: 20px 0;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 6px;
  margin: 20px 0;
  border: 1px solid #c3e6cb;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('🔄 Fetching dashboard data...');

      // Fetch ALL data from individual endpoints
      const [productsResponse, ordersResponse, usersResponse] = await Promise.all([
        // Get ALL products
        axios.get(`${process.env.REACT_APP_API_URL}/api/products`, { 
          headers: getAuthHeader() 
        }).catch(error => {
          console.error('❌ Error fetching products:', error);
          return { data: [] };
        }),
        
        // Get ALL orders
        axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, { 
          headers: getAuthHeader() 
        }).catch(error => {
          console.error('❌ Error fetching orders:', error);
          return { data: [] };
        }),
        
        // Get ALL users - Using the correct endpoint from your auth routes
        axios.get(`${process.env.REACT_APP_API_URL}/api/auth/users`, { 
          headers: getAuthHeader() 
        }).catch(error => {
          console.error('❌ Error fetching users:', error);
          return { data: [] };
        })
      ]);

      console.log('📊 Raw API Responses:', {
        products: productsResponse.data,
        orders: ordersResponse.data,
        users: usersResponse.data
      });

      // Extract data from responses
      const productsData = productsResponse.data.products || productsResponse.data || [];
      const ordersData = ordersResponse.data.orders || ordersResponse.data || [];
      
      // Handle user response - it should be an array directly from getAllUsers
      let usersData = [];
      if (Array.isArray(usersResponse.data)) {
        usersData = usersResponse.data;
      } else if (usersResponse.data && typeof usersResponse.data === 'object') {
        // If it's an object, try to extract array from common properties
        usersData = usersResponse.data.users || Object.values(usersResponse.data);
      }

      console.log('📈 Processed Data:', {
        productsCount: Array.isArray(productsData) ? productsData.length : 0,
        ordersCount: Array.isArray(ordersData) ? ordersData.length : 0,
        usersCount: Array.isArray(usersData) ? usersData.length : 0
      });

      // Calculate totals
      const totalProducts = Array.isArray(productsData) ? productsData.length : 0;
      const totalOrders = Array.isArray(ordersData) ? ordersData.length : 0;
      const totalUsers = Array.isArray(usersData) ? usersData.length : 0;
      
      // Calculate total revenue from ALL orders
      const totalRevenue = Array.isArray(ordersData) ? 
        ordersData.reduce((total, order) => {
          const amount = order.amount || order.totalAmount || order.total || order.price || 0;
          return total + parseFloat(amount);
        }, 0) : 0;

      console.log('💰 Revenue Calculation:', {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue
      });

      // Get recent orders (last 5, sorted by date if available)
      let recentOrdersData = [];
      if (Array.isArray(ordersData) && ordersData.length > 0) {
        recentOrdersData = ordersData
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 5);
      }

      setStats({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: totalRevenue.toFixed(2)
      });

      setRecentOrders(recentOrdersData);

      console.log('✅ Final Dashboard Stats:', {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue: totalRevenue.toFixed(2),
        recentOrdersCount: recentOrdersData.length
      });

      if (totalUsers > 0) {
        setSuccess(`Successfully loaded ${totalUsers} users, ${totalProducts} products, and ${totalOrders} orders`);
      }

    } catch (error) {
      console.error('❌ Error in fetchDashboardData:', error);
      setError('Failed to load dashboard data. Please check if the API endpoints are available.');
      
      // Set zeros as fallback
      setStats({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const refreshData = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <div>
            <h1>📊 Admin Dashboard</h1>
            <p>Welcome to QuickCart Admin Panel</p>
          </div>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Header>
        <LoadingMessage>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
          Loading dashboard data...
        </LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Welcome to QuickCart Admin Panel</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={refreshData}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Refresh
          </button>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </div>
      </Header>

      {error && (
        <ErrorMessage>
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
          {error}
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
          {success}
        </SuccessMessage>
      )}

      <StatsGrid>
        <StatCard>
          <h3>Total Orders</h3>
          <div className="number">{stats.totalOrders}</div>
          <div className="subtext">All time orders</div>
        </StatCard>
        <StatCard>
          <h3>Total Products</h3>
          <div className="number">{stats.totalProducts}</div>
          <div className="subtext">Active products in catalog</div>
        </StatCard>
        <StatCard>
          <h3>Total Users</h3>
          <div className="number">{stats.totalUsers}</div>
          <div className="subtext">Registered customers</div>
        </StatCard>
        <StatCard>
          <h3>Total Revenue</h3>
          <div className="number">${stats.totalRevenue}</div>
          <div className="subtext">Lifetime revenue</div>
        </StatCard>
      </StatsGrid>

      <NavGrid>
        <NavCard onClick={() => navigate('/admin/products')}>
          <div className="icon">📦</div>
          <h3>Manage Products</h3>
          <p>Add, edit, or remove products from your store</p>
        </NavCard>
        
        <NavCard onClick={() => navigate('/admin/orders')}>
          <div className="icon">📋</div>
          <h3>Manage Orders</h3>
          <p>View and update customer orders</p>
        </NavCard>
        
        <NavCard onClick={() => navigate('/admin/users')}>
          <div className="icon">👥</div>
          <h3>Manage Users</h3>
          <p>View and manage customer accounts</p>
        </NavCard>
        
        <NavCard onClick={() => navigate('/')}>
          <div className="icon">🏪</div>
          <h3>View Store</h3>
          <p>Go to customer-facing website</p>
        </NavCard>
      </NavGrid>

      {recentOrders.length > 0 ? (
        <RecentActivity>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Recent Orders</h3>
          {recentOrders.map((order, index) => (
            <ActivityItem key={order.id || index}>
              <OrderId>
                Order #{order.id ? order.id.slice(-8) : `ORD${index + 1}`.padStart(8, '0')}
              </OrderId>
              <OrderAmount>
                ${order.amount || order.totalAmount || order.total || order.price || '0.00'}
              </OrderAmount>
              <OrderStatus status={order.status}>
                {order.status || 'Pending'}
              </OrderStatus>
            </ActivityItem>
          ))}
        </RecentActivity>
      ) : (
        <RecentActivity>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Recent Orders</h3>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2em', marginBottom: '10px', display: 'block' }}></i>
            No orders found
          </div>
        </RecentActivity>
      )}
    </Container>
  );
};

export default Dashboard;