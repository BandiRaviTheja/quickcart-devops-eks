import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const AddressesContainer = styled.div`
  padding: 20px 15px;
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
`;

const AddressCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-bottom: 25px;
`;

const Title = styled.h1`
  color: #2d3748;
  font-size: 2rem;
  margin-bottom: 25px;
  text-align: center;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
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
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled.button`
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 10px;

  &:hover {
    background: #cbd5e0;
    transform: translateY(-1px);
  }
`;

const DangerButton = styled.button`
  background: #fed7d7;
  color: #742a2a;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #feb2b2;
    transform: translateY(-1px);
  }
`;

const AddressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;

const AddressItem = styled.div`
  background: #f7fafc;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid ${props => props.isDefault ? '#667eea' : '#e2e8f0'};
  position: relative;
`;

const AddressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const AddressType = styled.span`
  background: ${props => props.isDefault ? '#667eea' : '#e2e8f0'};
  color: ${props => props.isDefault ? 'white' : '#4a5568'};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AddressActions = styled.div`
  display: flex;
  gap: 10px;
`;

const AddressText = styled.p`
  color: #2d3748;
  margin: 5px 0;
  line-height: 1.4;
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
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  font-size: 1.1rem;
  color: #4a5568;
`;

const NoAddressesMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #718096;
  font-size: 1rem;
`;

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingAddress, setEditingAddress] = useState(null);

  const [formData, setFormData] = useState({
    type: "home",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const addressesData = response.data.addresses || [];
      setAddresses(addressesData);
      
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setMessage("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem('token');
      
      let response;
      if (editingAddress) {
        // UPDATE existing address
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/auth/addresses/${editingAddress.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setMessage("✅ Address updated successfully!");
      } else {
        // ADD NEW address
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/addresses`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setMessage("✅ Address added successfully!");
      }

      // Update addresses from response
      if (response.data.addresses) {
        setAddresses(response.data.addresses);
      }

      // RESET FORM COMPLETELY
      setFormData({
        type: "home",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
        isDefault: false
      });
      setEditingAddress(null);
      
    } catch (error) {
      console.error('Error saving address:', error);
      setMessage(error.response?.data?.error || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
    setFormData({
      type: "home",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      isDefault: false
    });
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/auth/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("✅ Address deleted successfully!");
      
      if (response.data.addresses) {
        setAddresses(response.data.addresses);
      } else {
        await fetchAddresses();
      }
      
    } catch (error) {
      console.error('Error deleting address:', error);
      setMessage("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/addresses/${addressId}`,
        { isDefault: true },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("✅ Default address updated successfully!");
      
      if (response.data.addresses) {
        setAddresses(response.data.addresses);
      } else {
        await fetchAddresses();
      }
      
    } catch (error) {
      console.error('Error setting default address:', error);
      setMessage("Failed to set default address");
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return (
      <AddressesContainer>
        <LoadingMessage>Loading addresses...</LoadingMessage>
      </AddressesContainer>
    );
  }

  return (
    <AddressesContainer>
      <Title>Manage Addresses</Title>
      
      {message && (
        <Message 
          success={!message.includes('Failed') && !message.includes('Error')} 
          error={message.includes('Failed') || message.includes('Error')}
        >
          {message}
        </Message>
      )}

      <AddressCard>
        <SectionTitle>
          {editingAddress ? `Edit Address (${editingAddress.type})` : 'Add New Address'}
        </SectionTitle>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="type">Address Type</Label>
            <Select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="Enter street address"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="city">City *</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="state">State *</Label>
            <Input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter state"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="Enter ZIP code"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="country">Country *</Label>
            <Input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter country"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                style={{ marginRight: '8px' }}
              />
              Set as default address
            </Label>
          </FormGroup>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : (editingAddress ? "Update Address" : "Add Address")}
            </Button>
            {editingAddress && (
              <SecondaryButton type="button" onClick={handleCancelEdit}>
                Cancel
              </SecondaryButton>
            )}
          </div>
        </Form>
      </AddressCard>

      <AddressCard>
        <SectionTitle>My Addresses ({addresses.length})</SectionTitle>
        
        {addresses.length === 0 ? (
          <NoAddressesMessage>
            No addresses saved yet. Add your first address above.
          </NoAddressesMessage>
        ) : (
          <AddressList>
            {addresses.map((address) => (
              <AddressItem key={address.id} isDefault={address.isDefault}>
                <AddressHeader>
                  <AddressType isDefault={address.isDefault}>
                    {address.type?.charAt(0).toUpperCase() + address.type?.slice(1)} 
                    {address.isDefault && ' (Default)'}
                  </AddressType>
                  <AddressActions>
                    {!address.isDefault && (
                      <SecondaryButton onClick={() => handleSetDefault(address.id)}>
                        Set Default
                      </SecondaryButton>
                    )}
                    <SecondaryButton onClick={() => handleEdit(address)}>
                      Edit
                    </SecondaryButton>
                    <DangerButton onClick={() => handleDelete(address.id)}>
                      Delete
                    </DangerButton>
                  </AddressActions>
                </AddressHeader>
                <AddressText>{address.street}</AddressText>
                <AddressText>{address.city}, {address.state} {address.zipCode}</AddressText>
                <AddressText>{address.country}</AddressText>
              </AddressItem>
            ))}
          </AddressList>
        )}
      </AddressCard>
    </AddressesContainer>
  );
};

export default Addresses;