import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 15px;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const Wrapper = styled.div`
  width: 450px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 400px;
    padding: 35px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 350px;
    padding: 25px 20px;
    margin-top: 20px;
  }

  @media (max-width: 380px) {
    padding: 20px 15px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 25px;
  }

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
    border-color: #28a745;
  }

  @media (max-width: 480px) {
    height: 45px;
    font-size: 15px;
    margin-bottom: 15px;
    padding: 0 12px;
  }
`;

const Button = styled.button`
  height: 50px;
  border-radius: 8px;
  border: none;
  background-color: #28a745;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #218838;
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    height: 45px;
    font-size: 16px;
    margin-bottom: 15px;
  }
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 13px;
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

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
    margin-bottom: 15px;
  }
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

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
    margin-bottom: 15px;
  }
`;

const Agreement = styled.p`
  font-size: 12px;
  margin: 20px 0;
  text-align: center;
  color: #666;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 11px;
    margin: 15px 0;
    line-height: 1.4;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      // Register user
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password
        }
      );

      // Send welcome email
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/email/welcome`,
          {
            userData: {
              username: formData.username,
              email: formData.email
            }
          }
        );
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.warn('Welcome email failed, but registration successful:', emailError);
        // Continue even if email fails
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setSuccess("Registration successful! Welcome to QuickCart! Redirecting...");
      
      // Redirect after a brief delay to show success message
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Create Account</Title>
        <Form onSubmit={handleSubmit}>
          {error && <Error>{error}</Error>}
          {success && <Success>{success}</Success>}
          <Input
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            placeholder="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit" disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </Button>
          <Links>
            <StyledLink to="/login">Already have an account? Sign in</StyledLink>
          </Links>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;