import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarContainer = styled.div`
  width: 250px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px 0;
`;

const Logo = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    color: #3498db;
  }
`;

const MenuItem = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: #34495e;
  }
  
  &.active {
    background: #3498db;
  }
`;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '📦', label: 'Products' },
    { path: '/admin/orders', icon: '📋', label: 'Orders' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
  ];

  return (
    <SidebarContainer>
      <Logo>
        <h2>QuickCart Admin</h2>
      </Logo>
      
      {menuItems.map((item) => (
        <MenuItem
          key={item.path}
          className={location.pathname === item.path ? 'active' : ''}
          onClick={() => navigate(item.path)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </MenuItem>
      ))}
      
      <MenuItem onClick={() => navigate('/')}>
        <span>🏪</span>
        <span>View Store</span>
      </MenuItem>
      
      <MenuItem onClick={() => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }} style={{ marginTop: '20px' }}>
        <span>🚪</span>
        <span>Logout</span>
      </MenuItem>
    </SidebarContainer>
  );
};

export default AdminSidebar;