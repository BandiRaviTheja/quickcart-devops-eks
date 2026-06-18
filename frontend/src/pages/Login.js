import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    padding: 20px;
    margin: 0 10px;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  height: 50px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  padding: 0 15px;
  margin-bottom: 20px;
  transition: border-color 0.3s;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  @media (max-width: 480px) {
    height: 45px;
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const Button = styled.button`
  height: 50px;
  border-radius: 8px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
  min-height: 44px;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    height: 45px;
    font-size: 16px;
  }
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Error = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

const Success = styled.div`
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 5px;
  padding: 12px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setSuccess("Login successful! Redirecting...");
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <Input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Button>
          <Links>
            <StyledLink to="/forgot-password">Forgot Password?</StyledLink>
            <StyledLink to="/register">Don't have an account? Sign up</StyledLink>
          </Links>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;