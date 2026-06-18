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
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const UsersTable = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  padding: 15px 20px;
  background: #f8f9fa;
  font-weight: 600;
  border-bottom: 1px solid #e9ecef;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
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

const RoleBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  
  &.admin { 
    background: #667eea; 
    color: white; 
  }
  &.customer { 
    background: #e9ecef; 
    color: #495057; 
  }
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

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  max-width: 400px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5em;
    font-weight: bold;
    color: #667eea;
  }
  
  .label {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  margin-right: 5px;
  
  &.make-admin {
    background: #28a745;
    color: white;
    
    &:hover {
      background: #218838;
    }
  }
  
  &.remove-admin {
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #c82333;
    }
  }
  
  &.delete {
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const ProfileInfo = styled.div`
  .profile-name {
    font-weight: 600;
    font-size: 14px;
  }
  .profile-details {
    font-size: 12px;
    color: #666;
  }
`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // UPDATED: Function to extract user data from profile system
  const extractUserData = (user) => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      // UPDATED: Get name from profile
      name: user.profile?.name || '',
      // UPDATED: Get phone from profile
      phone: user.profile?.phone || '',
      // UPDATED: Role handling
      role: user.role || (user.isAdmin ? 'admin' : 'customer'),
      isAdmin: user.isAdmin || false,
      createdAt: user.createdAt,
      // UPDATED: Profile data for display
      profile: user.profile || {
        name: '',
        phone: '',
        addresses: []
      }
    };
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('🔄 Fetching users from /api/auth/users...');

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/users`,
        { headers: getAuthHeader() }
      );

      console.log('✅ Users API Response:', response.data);

      if (!response.data) {
        throw new Error('No user data received from server');
      }

      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else {
        usersData = response.data.users || Object.values(response.data);
      }

      if (!Array.isArray(usersData)) {
        throw new Error('Invalid user data format received');
      }

      // UPDATED: Process users with profile system
      const processedUsers = usersData.map(user => extractUserData(user));
      
      console.log(`📊 Loaded ${processedUsers.length} users with profile system`);
      
      // UPDATED: Enhanced logging for profile data
      processedUsers.forEach(user => {
        console.log(`👤 User ${user.username}:`, {
          name: user.name,
          email: user.email,
          profile: user.profile,
          role: user.role
        });
      });

      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
      setSuccess(`Successfully loaded ${processedUsers.length} users`);

    } catch (error) {
      console.error('❌ Error fetching users:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        setTimeout(() => {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }, 2000);
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        setError('Users endpoint not found. Please check the API URL.');
      } else {
        setError(`Failed to load users: ${error.message}`);
      }
      
      // UPDATED: Demo data with profile system
      const demoUsers = [
        {
          id: '1',
          username: 'johndoe',
          email: 'john@example.com',
          name: 'John Doe',
          phone: '+1234567890',
          role: 'customer',
          isAdmin: false,
          createdAt: '2024-01-15T10:30:00Z',
          profile: {
            name: 'John Doe',
            phone: '+1234567890',
            addresses: [
              {
                id: 'addr1',
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA',
                isDefault: true
              }
            ]
          }
        },
        {
          id: '2',
          username: 'janesmith',
          email: 'jane@example.com', 
          name: 'Jane Smith',
          phone: '+0987654321',
          role: 'customer',
          isAdmin: false,
          createdAt: '2024-01-20T14:45:00Z',
          profile: {
            name: 'Jane Smith',
            phone: '+0987654321',
            addresses: []
          }
        },
        {
          id: '3',
          username: 'admin',
          email: 'admin@example.com',
          name: 'Admin User',
          phone: '+1112223333',
          role: 'admin',
          isAdmin: true,
          createdAt: '2024-01-10T09:15:00Z',
          profile: {
            name: 'Admin User',
            phone: '+1112223333',
            addresses: []
          }
        }
      ];
      setUsers(demoUsers);
      setFilteredUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // UPDATED: Function to get user display info from profile
  const getUserDisplayInfo = (user) => {
    const name = user.name || user.username;
    const email = user.email;
    const initial = name.charAt(0).toUpperCase();
    const phone = user.phone || user.profile?.phone || 'No phone';
    const addressCount = user.profile?.addresses?.length || 0;

    return {
      name,
      email,
      initial,
      phone,
      addressCount
    };
  };

  const toggleAdminStatus = async (userId, currentUser) => {
    const currentRole = currentUser.role;
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    
    if (!window.confirm(`Are you sure you want to ${newRole === 'admin' ? 'make this user an admin' : 'remove admin privileges'} from ${currentUser.name || currentUser.username}?`)) {
      return;
    }

    setActionLoading(userId);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/users/${userId}/role`,
        { role: newRole },
        { headers: getAuthHeader() }
      );

      // UPDATED: Update local state with profile data preserved
      setUsers(prev => prev.map(user => 
        user.id === userId ? { 
          ...user, 
          role: newRole, 
          isAdmin: newRole === 'admin' 
        } : user
      ));
      
      setSuccess(`✅ User role updated successfully! ${currentUser.name || currentUser.username} is now ${newRole}.`);

    } catch (error) {
      console.error('❌ Error updating user role:', error);
      
      if (error.response?.status === 400) {
        setError(error.response.data.error || 'Failed to update user role');
      } else {
        setError('Failed to update user role. Please try again.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(userId);

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/auth/users/${userId}`,
        { headers: getAuthHeader() }
      );
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      setSuccess(`✅ User "${userName}" deleted successfully!`);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      
      if (error.response?.status === 400) {
        setError(error.response.data.error || 'Failed to delete user');
      } else if (error.response?.status === 404) {
        setError('User not found');
      } else {
        setError('Failed to delete user. Please try again.');
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.role === 'admin' || user.isAdmin).length;
  const customerUsers = totalUsers - adminUsers;
  const usersWithAddresses = users.filter(user => user.profile?.addresses?.length > 0).length;

  if (loading) {
    return (
      <Container>
        <Header>
          <h1>👥 Manage Users</h1>
          <Button onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </Button>
        </Header>
        <Loading>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
          Loading users from database...
        </Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <h1>👥 Manage Users</h1>
          <p>Manage customer accounts and administrator privileges</p>
        </div>
        <Button onClick={() => navigate('/admin/dashboard')}>
          ← Back to Dashboard
        </Button>
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

      {/* UPDATED: Stats bar with profile metrics */}
      <StatsBar>
        <StatItem>
          <div className="number">{totalUsers}</div>
          <div className="label">Total Users</div>
        </StatItem>
        <StatItem>
          <div className="number">{adminUsers}</div>
          <div className="label">Administrators</div>
        </StatItem>
        <StatItem>
          <div className="number">{customerUsers}</div>
          <div className="label">Customers</div>
        </StatItem>
        <StatItem>
          <div className="number">{usersWithAddresses}</div>
          <div className="label">With Addresses</div>
        </StatItem>
      </StatsBar>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search users by username, email, name, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={fetchUsers}>
          🔄 Refresh
        </Button>
      </SearchContainer>

      {filteredUsers.length === 0 ? (
        <EmptyState>
          <i className="fas fa-users" style={{ fontSize: '3em', marginBottom: '20px', opacity: 0.5 }}></i>
          <h3>No users found</h3>
          <p>
            {searchTerm ? 
              `No users match "${searchTerm}"` : 
              'No users registered yet. User accounts will appear here when customers register.'
            }
          </p>
        </EmptyState>
      ) : (
        <UsersTable>
          {/* UPDATED: Table header with profile columns */}
          <TableHeader>
            <div>User Profile</div>
            <div>Contact</div>
            <div>Role</div>
            <div>Addresses</div>
            <div>Joined</div>
            <div>Actions</div>
          </TableHeader>
          
          {filteredUsers.map((user) => {
            const userRole = user.role;
            const userInfo = getUserDisplayInfo(user);
            // UPDATED: Check if current user (you might want to get this from token)
            const isCurrentUser = false; // Implement based on your auth system

            return (
              <TableRow key={user.id}>
                <div>
                  <CustomerInfo>
                    <CustomerAvatar>
                      {userInfo.initial}
                    </CustomerAvatar>
                    <ProfileInfo>
                      <div className="profile-name">{userInfo.name}</div>
                      <div className="profile-details">@{user.username}</div>
                      {userInfo.phone !== 'No phone' && (
                        <div className="profile-details">{userInfo.phone}</div>
                      )}
                    </ProfileInfo>
                  </CustomerInfo>
                </div>
                <div>
                  <div>{user.email}</div>
                </div>
                <div>
                  <RoleBadge className={userRole}>
                    {userRole}
                  </RoleBadge>
                </div>
                <div>
                  <div style={{ 
                    background: userInfo.addressCount > 0 ? '#d4edda' : '#f8d7da',
                    color: userInfo.addressCount > 0 ? '#155724' : '#721c24',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'inline-block'
                  }}>
                    {userInfo.addressCount} {userInfo.addressCount === 1 ? 'address' : 'addresses'}
                  </div>
                </div>
                <div>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <ActionButton
                    className={userRole === 'admin' ? 'remove-admin' : 'make-admin'}
                    onClick={() => toggleAdminStatus(user.id, user)}
                    disabled={actionLoading === user.id || isCurrentUser}
                  >
                    {actionLoading === user.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : userRole === 'admin' ? (
                      'Remove Admin'
                    ) : (
                      'Make Admin'
                    )}
                  </ActionButton>
                  
                  <ActionButton
                    className="delete"
                    onClick={() => deleteUser(user.id, userInfo.name)}
                    disabled={actionLoading === user.id || userRole === 'admin' || isCurrentUser}
                    title={userRole === 'admin' ? 'Cannot delete admin users' : ''}
                  >
                    {actionLoading === user.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      'Delete'
                    )}
                  </ActionButton>
                </div>
              </TableRow>
            );
          })}
        </UsersTable>
      )}
    </Container>
  );
};

export default AdminUsers;