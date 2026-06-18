import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginForm = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 600;
  
  &:hover {
    background: #764ba2;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #e74c3c;
  background: #ffeaea;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  border: 1px solid #f5c6cb;
`;

const Success = styled.div`
  color: #155724;
  background: #d4edda;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
  border: 1px solid #c3e6cb;
`;

const AdminNote = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #e7f3ff;
  border-radius: 5px;
  border-left: 4px solid #007bff;
  
  h4 {
    margin: 0 0 8px 0;
    color: #004085;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    color: #004085;
  }
`;

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/admin-login`,
        credentials
      );

      if (response.data.token) {
        // Store admin token and user info
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        setSuccess('Login successful! Redirecting...');
        
        // Redirect to admin dashboard after a brief delay
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        'Invalid admin credentials. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Pre-fill with demo admin credentials (remove in production)
    setCredentials({
      email: 'admin@test.com',
      password: 'admin123'
    });
  };

  return (
    <Container>
      <LoginForm>
        <Title>🔐 Admin Dashboard</Title>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Access the QuickCart administration panel
        </p>
        
        <form onSubmit={handleLogin}>
          {error && <Error>⚠️ {error}</Error>}
          {success && <Success>✅ {success}</Success>}
          
          <Input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Signing in...
              </>
            ) : (
              'Admin Login'
            )}
          </Button>
        </form>

        <AdminNote>
          <h4>Admin Access Only</h4>
          <p>
            This area is restricted to authorized administrators only. 
            Please use your admin credentials to access the dashboard.
          </p>
        </AdminNote>

        {/* Demo button - remove in production */}
        <button 
          onClick={handleDemoLogin}
          style={{
            marginTop: '15px',
            background: 'transparent',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline'
          }}
        >
          Use demo admin credentials
        </button>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Return to{' '}
            <a 
              href="/" 
              style={{ color: '#667eea', textDecoration: 'none' }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              customer site
            </a>
          </p>
        </div>
      </LoginForm>
    </Container>
  );
};

export default AdminLogin;