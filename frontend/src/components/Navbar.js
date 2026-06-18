import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const NavbarContainer = styled.nav`
  width: 100%;
  height: ${(props) => (props.extendNavbar ? "100vh" : "80px")};
  background-color: black;
  display: flex;
  flex-direction: column;
  @media (min-width: 700px) {
    height: 80px;
  }
`;

const LeftContainer = styled.div`
  flex: 70%;
  display: flex;
  align-items: center;
  padding-left: 5%;
`;

const RightContainer = styled.div`
  flex: 30%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 50px;
`;

const NavbarInnerContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
`;

const NavbarLinkContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const NavbarLink = styled(Link)`
  color: white;
  font-size: 16px;
  font-family: 'Arial', sans-serif;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 80%;
  }
  
  @media (max-width: 700px) {
    display: none;
  }
`;

const AdminNavbarLink = styled(Link)`
  color: #ffd700;
  font-size: 16px;
  font-family: 'Arial', sans-serif;
  text-decoration: none;
  margin: 0 15px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  &:hover {
    background: rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
  }
  
  @media (max-width: 700px) {
    display: none;
  }
`;

const NavbarLinkExtended = styled(Link)`
  color: white;
  font-size: 18px;
  font-family: 'Arial', sans-serif;
  text-decoration: none;
  margin: 15px 0;
  padding: 12px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 200px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(10px);
  }
`;

const AdminNavbarLinkExtended = styled(Link)`
  color: #ffd700;
  font-size: 18px;
  font-family: 'Arial', sans-serif;
  text-decoration: none;
  margin: 15px 0;
  padding: 12px 20px;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 200px;
  text-align: center;
  border: 2px solid rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.1);
  font-weight: 600;
  
  &:hover {
    background: rgba(255, 215, 0, 0.2);
    transform: translateX(10px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.2);
  }
`;

const Logo = styled(Link)`
  margin: 10px;
  color: white;
  font-size: 2.2rem;
  font-weight: bold;
  text-decoration: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const OpenLinksButton = styled.button`
  width: 50px;
  height: 50px;
  background: none;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (min-width: 700px) {
    display: none;
  }
`;

const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  background: rgba(0, 0, 0, 0.95);
  
  @media (min-width: 700px) {
    display: none;
  }
`;

const AuthLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 700px) {
    display: none;
  }
`;

const AuthLink = styled(Link)`
  color: white;
  font-size: 14px;
  text-decoration: none;
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: white;
    color: black;
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
  }
`;

const UserGreeting = styled.span`
  color: white;
  font-size: 14px;
  margin: 0 15px;
  font-weight: 500;
  
  @media (max-width: 700px) {
    display: none;
  }
`;

const AdminGreeting = styled.span`
  color: #ffd700;
  font-size: 14px;
  margin: 0 15px;
  font-weight: 600;
  
  @media (max-width: 700px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  color: white;
  font-size: 14px;
  text-decoration: none;
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: none;
  cursor: pointer;
  
  &:hover {
    background: #ff4757;
    border-color: #ff4757;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
  }
`;

const AdminLogoutButton = styled.button`
  color: #ffd700;
  font-size: 14px;
  text-decoration: none;
  padding: 10px 20px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 215, 0, 0.1);
  cursor: pointer;
  
  &:hover {
    background: #ff4757;
    border-color: #ff4757;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 71, 87, 0.3);
  }
`;

const MobileAuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 10px;
  background: black;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  
  @media (max-width: 700px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: 8px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 14px;
  width: 250px;
  transition: all 0.3s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    width: 300px;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const SearchButton = styled.button`
  margin-left: -40px;
  background: none;
  border: none;
  color: #4299e1;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(66, 153, 225, 0.1);
  }
`;

const MobileSearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  width: 80%;
`;

const MobileSearchInput = styled.input`
  padding: 12px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 14px;
  width: 100%;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
  }
  
  &::placeholder {
    color: #a0aec0;
  }
`;

const MobileSearchButton = styled.button`
  margin-left: -45px;
  background: none;
  border: none;
  color: #4299e1;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
`;

const HomeWithSearchContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProfileLink = styled(Link)`
  color: white;
  font-size: 14px;
  text-decoration: none;
  padding: 10px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: white;
    color: black;
    border-color: white;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
  }
`;

const ProfileLinkExtended = styled(Link)`
  color: white;
  font-size: 16px;
  text-decoration: none;
  margin: 10px 0;
  padding: 12px 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  width: 200px;
  text-align: center;
  
  &:hover {
    background: white;
    color: black;
    border-color: white;
    transform: translateX(10px);
  }
`;

function Navbar() {
  const [extendNavbar, setExtendNavbar] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    // Check for regular user
    if (token) {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('User data from localStorage:', userData);
        setUser(userData);
        
        // Check if user has admin role
        if (userData.role === 'admin' || userData.isAdmin) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    // Check for admin user (from admin login)
    if (adminToken) {
      try {
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        console.log('Admin user data from localStorage:', adminUser);
        setUser(adminUser);
        setIsAdmin(true);
      } catch (error) {
        console.error('Error parsing admin user:', error);
      }
    }
  }, []);

  // CUSTOMER LOGOUT - removes customer tokens only
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cartItems');
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/';
  };

  // ADMIN LOGOUT - removes admin tokens only
  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
    
    // Check if user still has regular customer token
    const customerToken = localStorage.getItem('token');
    if (!customerToken) {
      setUser(null);
      window.location.href = '/';
    } else {
      // User is still logged in as customer, just update state
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }
  };

  const getDisplayName = () => {
    if (!user) return '';
    
    console.log('User object in getDisplayName:', user);
    
    // Priority order for display name:
    // 1. Check if name exists in profile
    if (user.profile && user.profile.name && user.profile.name.trim() !== '') {
      return user.profile.name;
    }
    // 2. Use username
    else if (user.username && user.username.trim() !== '') {
      return user.username;
    }
    // 3. Use email username part
    else if (user.email) {
      return user.email.split('@')[0];
    }
    // 4. Default fallback
    return 'User';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery('');
      setExtendNavbar(false);
    }
  };

  const handleAdminDashboard = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <NavbarContainer extendNavbar={extendNavbar}>
      <NavbarInnerContainer>
        <LeftContainer>
          <NavbarLinkContainer>
            <HomeWithSearchContainer>
              <NavbarLink to="/">Home</NavbarLink>
              <SearchContainer>
                <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                  <SearchInput
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <SearchButton type="submit">
                    <i className="fas fa-search"></i>
                  </SearchButton>
                </form>
              </SearchContainer>
            </HomeWithSearchContainer>
            
            <NavbarLink to="/products/men">Men</NavbarLink>
            <NavbarLink to="/products/women">Women</NavbarLink>
            <NavbarLink to="/products/accessories">Accessories</NavbarLink>
            <NavbarLink to="/products/shoes">Shoes</NavbarLink>
            <NavbarLink to="/cart">Cart</NavbarLink>
            {user && <NavbarLink to="/orders">Orders</NavbarLink>}
            
            {isAdmin && (
              <AdminNavbarLink to="/admin/dashboard" onClick={handleAdminDashboard}>
                🛠️ Admin
              </AdminNavbarLink>
            )}
            
            <OpenLinksButton
              onClick={() => {
                setExtendNavbar((curr) => !curr);
              }}
            >
              {extendNavbar ? <>&#10005;</> : <>&#8801;</>}
            </OpenLinksButton>
          </NavbarLinkContainer>
        </LeftContainer>
        <RightContainer>
          <AuthLinks>
            {user ? (
              <>
                {isAdmin ? (
                  <AdminGreeting>👑 Admin {getDisplayName()}</AdminGreeting>
                ) : (
                  <UserGreeting>Hello, {getDisplayName()}</UserGreeting>
                )}
                
                {/* Profile Link for both admin and regular users */}
                <ProfileLink to="/profile">
                  Profile
                </ProfileLink>
                
                {isAdmin ? (
                  <AdminLogoutButton onClick={handleAdminLogout}>
                    Logout Admin
                  </AdminLogoutButton>
                ) : (
                  <LogoutButton onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                )}
              </>
            ) : (
              <>
                <AuthLink to="/login">Login</AuthLink>
                <AuthLink to="/register">Register</AuthLink>
              </>
            )}
          </AuthLinks>
          <Logo to="/">QuickCart</Logo>
        </RightContainer>
      </NavbarInnerContainer>
      {extendNavbar && (
        <NavbarExtendedContainer>
          <NavbarLinkExtended to="/">Home</NavbarLinkExtended>
          <NavbarLinkExtended to="/products/men">Men</NavbarLinkExtended>
          <NavbarLinkExtended to="/products/women">Women</NavbarLinkExtended>
          <NavbarLinkExtended to="/products/accessories">Accessories</NavbarLinkExtended>
          <NavbarLinkExtended to="/products/shoes">Shoes</NavbarLinkExtended>
          <NavbarLinkExtended to="/cart">Cart</NavbarLinkExtended>
          {user && <NavbarLinkExtended to="/orders">Orders</NavbarLinkExtended>}
          
          {isAdmin && (
            <AdminNavbarLinkExtended to="/admin/dashboard" onClick={handleAdminDashboard}>
              🛠️ Admin Dashboard
            </AdminNavbarLinkExtended>
          )}
          
          {/* Profile Link in Mobile Menu */}
          {user && (
            <ProfileLinkExtended to="/profile">
              Profile
            </ProfileLinkExtended>
          )}
          
          <MobileSearchContainer>
            <form onSubmit={handleMobileSearch} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <MobileSearchInput
                type="text"
                placeholder="Search products..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
              />
              <MobileSearchButton type="submit">
                <i className="fas fa-search"></i>
              </MobileSearchButton>
            </form>
          </MobileSearchContainer>
          
          <MobileAuthContainer>
            {user ? (
              <>
                {isAdmin ? (
                  <AdminGreeting style={{ display: 'block', textAlign: 'center' }}>
                    👑 Admin {getDisplayName()}
                  </AdminGreeting>
                ) : (
                  <UserGreeting style={{ display: 'block', textAlign: 'center' }}>
                    Hello, {getDisplayName()}
                  </UserGreeting>
                )}
                {isAdmin ? (
                  <AdminLogoutButton onClick={handleAdminLogout}>
                    Logout Admin
                  </AdminLogoutButton>
                ) : (
                  <LogoutButton onClick={handleLogout}>
                    Logout
                  </LogoutButton>
                )}
              </>
            ) : (
              <>
                <AuthLink to="/login" style={{ display: 'block', textAlign: 'center' }}>
                  Login
                </AuthLink>
                <AuthLink to="/register" style={{ display: 'block', textAlign: 'center' }}>
                  Register
                </AuthLink>
              </>
            )}
          </MobileAuthContainer>
        </NavbarExtendedContainer>
      )}
    </NavbarContainer>
  );
}

export default Navbar;