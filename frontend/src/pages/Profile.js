import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileContainer = styled.div`
  padding: 20px 15px;
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 15px 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 8px;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
  }
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 25px;
  text-align: center;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 15px;
    padding-bottom: 8px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    padding: 11px 14px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 11px 20px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    margin-top: 8px;
  }
`;

const UserInfo = styled.div`
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 8px 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const InfoValue = styled.span`
  color: #2d3748;
  font-size: 0.9rem;
  word-break: break-word;
  text-align: right;

  @media (max-width: 480px) {
    text-align: left;
    font-size: 0.85rem;
    width: 100%;
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  
  ${props => props.success && `
    background: #c6f6d5;
    color: #22543d;
    border: 1px solid #9ae6b4;
  `}
  
  ${props => props.error && `
    background: #fed7d7;
    color: #742a2a;
    border: 1px solid #feb2b2;
  `}

  @media (max-width: 768px) {
    padding: 10px 14px;
    margin-bottom: 15px;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    margin-bottom: 12px;
    font-size: 0.8rem;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  font-size: 1.1rem;
  color: #4a5568;

  @media (max-width: 768px) {
    padding: 30px 15px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 20px 10px;
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-top: 15px;
  }
`;

const SecondaryButton = styled.button`
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &:hover {
    background: #cbd5e0;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 11px 20px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
`;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    phone: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Profile data:', response.data);
      setUser(response.data);
      
      // Set form data with profile information
      setFormData({
        username: response.data.username || "",
        email: response.data.email || "",
        name: response.data.profile?.name || "",
        phone: response.data.profile?.phone || ""
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        setMessage("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage("");

    try {
      const token = localStorage.getItem('token');
      
      // FIXED: Send data in correct structure for backend
      const updateData = {
        username: formData.username,
        email: formData.email,
        profile: {
          name: formData.name,
          phone: formData.phone
        }
      };

      console.log('Sending update data:', updateData);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Update response:', response.data);
      setUser(response.data);
      setMessage("Profile updated successfully!");
      
      // Update localStorage user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        ...response.data
      }));

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.error || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleViewAddresses = () => {
    navigate('/addresses');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <ProfileContainer>
        <LoadingMessage>Loading profile...</LoadingMessage>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Title>My Profile</Title>
      
      {message && (
        <Message success={!message.includes('Failed') && !message.includes('Error')}>
          {message}
        </Message>
      )}

      <ProfileCard>
        <SectionTitle>Profile Information</SectionTitle>
        
        <UserInfo>
          <InfoRow>
            <InfoLabel>User ID:</InfoLabel>
            <InfoValue>{user?.id}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Username:</InfoLabel>
            <InfoValue>{user?.username}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Email:</InfoLabel>
            <InfoValue>{user?.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Role:</InfoLabel>
            <InfoValue>{user?.isAdmin ? 'Admin' : 'Customer'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Full Name:</InfoLabel>
            <InfoValue>{user?.profile?.name || "Not set"}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Phone Number:</InfoLabel>
            <InfoValue>{user?.profile?.phone || "Not set"}</InfoValue>
          </InfoRow>
        </UserInfo>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </FormGroup>

          <Button type="submit" disabled={updating}>
            {updating ? "Updating..." : "Update Profile"}
          </Button>
        </Form>

        <ActionButtons>
          <SecondaryButton onClick={handleViewAddresses}>
            Manage Addresses
          </SecondaryButton>
          <SecondaryButton onClick={handleViewOrders}>
            View Orders
          </SecondaryButton>
        </ActionButtons>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Profile;
