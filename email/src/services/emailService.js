const nodemailer = require('nodemailer');
const { 
  generateOrderConfirmationTemplate, 
  generatePaymentConfirmationTemplate, 
  generateWelcomeTemplate, 
  generateShippingTemplate,
  generateOrderCancellationTemplate
} = require('../utils/templateGenerator');

// Create email transporter
const createTransporter = () => {
  console.log('📧 Creating email transporter with:', {
    user: process.env.EMAIL_USER,
    hasPassword: !!(process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS)
  });

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
    }
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (orderData, userEmail) => {
  try {
    console.log('📧 Attempting to send order confirmation to:', userEmail);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"QuickCart" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Order Confirmed - #${(orderData.id || orderData._id || '').toString().slice(-8)}`,
      html: generateOrderConfirmationTemplate(orderData)
    };

    console.log('📤 Sending order confirmation email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

// Send payment confirmation email
const sendPaymentConfirmation = async (paymentData, userEmail) => {
  try {
    console.log('💰 Attempting to send payment confirmation to:', userEmail);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"QuickCart" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `💳 Payment Confirmed - Order #${(paymentData.orderId || '').toString().slice(-8)}`,
      html: generatePaymentConfirmationTemplate(paymentData)
    };

    console.log('📤 Sending payment confirmation email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Payment confirmation email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (userData) => {
  try {
    console.log('👋 Attempting to send welcome email to:', userData.email);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"QuickCart" <${process.env.EMAIL_USER}>`,
      to: userData.email,
      subject: '🎉 Welcome to QuickCart!',
      html: generateWelcomeTemplate(userData)
    };

    console.log('📤 Sending welcome email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

// Send shipping update email
const sendShippingUpdate = async (orderData, userEmail, status) => {
  try {
    console.log('🚚 Attempting to send shipping update to:', userEmail, 'Status:', status);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"QuickCart" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `📦 Shipping Update - Order #${(orderData.id || orderData._id || '').toString().slice(-8)}`,
      html: generateShippingTemplate(orderData, status)
    };

    console.log('📤 Sending shipping update email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Shipping update email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending shipping update email:', error);
    throw error;
  }
};

// Send order cancellation email
const sendOrderCancellation = async (orderData, userEmail) => {
  try {
    console.log('❌ Attempting to send order cancellation to:', userEmail);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"QuickCart" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `❌ Order Cancelled - #${(orderData.id || orderData._id || '').toString().slice(-8)}`,
      html: generateOrderCancellationTemplate(orderData)
    };

    console.log('📤 Sending order cancellation email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order cancellation email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error sending order cancellation email:', error);
    throw error;
  }
};

module.exports = {
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendWelcomeEmail,
  sendShippingUpdate,
  sendOrderCancellation
};