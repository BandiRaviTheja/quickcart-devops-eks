const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-alb-url.com';

export const emailService = {
  // Send order confirmation
  sendOrderConfirmation: async (orderData, userEmail) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData, userEmail }),
      });
      return await response.json();
    } catch (error) {
      console.error('Order confirmation email failed:', error);
      throw error;
    }
  },

  // Send payment confirmation
  sendPaymentConfirmation: async (paymentData, userEmail) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/payment-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentData, userEmail }),
      });
      return await response.json();
    } catch (error) {
      console.error('Payment confirmation email failed:', error);
      throw error;
    }
  },

  // Send welcome email
  sendWelcomeEmail: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/email/welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData }),
      });
      return await response.json();
    } catch (error) {
      console.error('Welcome email failed:', error);
      throw error;
    }
  }
};

export const authService = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  }
};