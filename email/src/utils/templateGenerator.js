const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Load HTML templates
const orderConfirmationTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/orderConfirmation.html'), 
  'utf8'
);
const paymentConfirmationTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/paymentConfirmation.html'), 
  'utf8'
);
const welcomeTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/welcome.html'), 
  'utf8'
);
const shippingTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/shippingUpdate.html'), 
  'utf8'
);
// ADD CANCELLATION TEMPLATE
const orderCancellationTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/orderCancellation.html'), 
  'utf8'
);

// Register Handlebars helpers
handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

handlebars.registerHelper('gte', function(a, b) {
  return a >= b;
});

// Compile templates
const compiledOrderTemplate = handlebars.compile(orderConfirmationTemplate);
const compiledPaymentTemplate = handlebars.compile(paymentConfirmationTemplate);
const compiledWelcomeTemplate = handlebars.compile(welcomeTemplate);
const compiledShippingTemplate = handlebars.compile(shippingTemplate);
const compiledCancellationTemplate = handlebars.compile(orderCancellationTemplate);

// Generate order confirmation email template
const generateOrderConfirmationTemplate = (orderData) => {
  console.log('📧 Generating order confirmation template with data:', {
    orderId: orderData.id,
    productsCount: orderData.products?.length,
    address: orderData.address
  });

  const products = orderData.products || orderData.items || [];
  const subtotal = products.reduce((sum, product) => {
    return sum + (parseFloat(product.price) * (product.quantity || 1));
  }, 0);
  
  const shipping = parseFloat(orderData.shipping || 0);
  const tax = parseFloat(orderData.tax || 0);
  const totalAmount = subtotal + shipping + tax;

  const templateData = {
    orderId: orderData.id || orderData._id,
    orderDate: new Date(orderData.createdAt || orderData.orderDate || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    totalAmount: totalAmount.toFixed(2),
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    status: orderData.status || 'confirmed',
    products: products.map(product => ({
      title: product.title || product.name,
      price: parseFloat(product.price || product.unitPrice).toFixed(2),
      quantity: product.quantity || 1,
      total: (parseFloat(product.price || product.unitPrice) * (product.quantity || 1)).toFixed(2),
      image: product.image || product.img,
      color: product.color || 'Default',
      size: product.size || 'One Size'
    })),
    address: {
      name: orderData.address?.name || 'Customer',
      street: orderData.address?.street || orderData.shippingAddress?.street,
      city: orderData.address?.city || orderData.shippingAddress?.city,
      state: orderData.address?.state || orderData.shippingAddress?.state,
      zipCode: orderData.address?.zipCode || orderData.shippingAddress?.zipCode,
      country: orderData.address?.country || orderData.shippingAddress?.country || 'United States',
      phone: orderData.address?.phone || '(555) 123-4567'
    },
    orderUrl: `https://quickcart.com/orders/${orderData.id || orderData._id}`,
    trackingUrl: `https://quickcart.com/track/${orderData.trackingNumber || orderData.id || orderData._id}`
  };

  console.log('📦 Template data prepared:', {
    orderId: templateData.orderId,
    products: templateData.products,
    address: templateData.address
  });

  return compiledOrderTemplate(templateData);
};

// Generate payment confirmation email template
const generatePaymentConfirmationTemplate = (paymentData) => {
  console.log('💰 Generating payment confirmation template with data:', paymentData);

  const products = paymentData.products || paymentData.order?.products || [];
  const amount = parseFloat(paymentData.amount || paymentData.order?.totalAmount || 0);

  const templateData = {
    paymentId: paymentData.id || paymentData.paymentIntentId || `PAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    orderId: paymentData.orderId || paymentData.order?.id,
    amount: amount.toFixed(2),
    paymentMethod: paymentData.paymentMethod || 'Credit Card',
    status: paymentData.status || 'completed',
    paymentDate: new Date(paymentData.createdAt || paymentData.paymentDate || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    receiptUrl: paymentData.receiptUrl || '#',
    products: products.map(product => ({
      title: product.title || product.name,
      quantity: product.quantity || 1,
      total: (parseFloat(product.price || product.unitPrice) * (product.quantity || 1)).toFixed(2)
    })),
    shipping: parseFloat(paymentData.shipping || paymentData.order?.shipping || 0).toFixed(2),
    tax: parseFloat(paymentData.tax || paymentData.order?.tax || 0).toFixed(2),
    orderUrl: `https://quickcart.com/orders/${paymentData.orderId || paymentData.order?.id}`,
    trackingUrl: `https://quickcart.com/track/${paymentData.orderId || paymentData.order?.id}`
  };

  return compiledPaymentTemplate(templateData);
};

// Generate welcome email template
const generateWelcomeTemplate = (userData) => {
  const templateData = {
    username: userData.username || userData.name || 'valued customer',
    shopUrl: 'https://quickcart.com/shop'
  };

  return compiledWelcomeTemplate(templateData);
};

// Generate shipping update template
const generateShippingTemplate = (orderData, status) => {
  const statusOrder = {
    'confirmed': 1,
    'processing': 2,
    'shipped': 3,
    'out_for_delivery': 4,
    'delivered': 5
  };

  const products = orderData.products || orderData.items || [];

  const templateData = {
    orderId: orderData.id || orderData._id,
    status: status,
    statusIndex: statusOrder[status] || 1,
    updateDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    orderDate: new Date(orderData.createdAt || orderData.orderDate || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    processingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    shippedDate: status === 'shipped' ? new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null,
    trackingNumber: orderData.trackingNumber || `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    carrier: orderData.carrier || 'QuickCart Logistics',
    trackingUrl: orderData.trackingUrl || `https://quickcart.com/track/${orderData.trackingNumber || orderData.id}`,
    address: `${orderData.address?.street || ''}, ${orderData.address?.city || ''}, ${orderData.address?.state || ''} ${orderData.address?.zipCode || ''}`.trim(),
    contactPhone: orderData.address?.phone || '(555) 123-4567',
    products: products.map(product => ({
      title: product.title || product.name,
      quantity: product.quantity || 1,
      price: parseFloat(product.price || product.unitPrice).toFixed(2)
    }))
  };

  return compiledShippingTemplate(templateData);
};

// Generate order CANCELLATION email template
const generateOrderCancellationTemplate = (orderData) => {
  console.log('📧 Generating order CANCELLATION template with data:', {
    orderId: orderData.id,
    productsCount: orderData.products?.length
  });

  const products = orderData.products || orderData.items || [];
  const subtotal = products.reduce((sum, product) => {
    return sum + (parseFloat(product.price) * (product.quantity || 1));
  }, 0);
  
  const shipping = parseFloat(orderData.shipping || 0);
  const tax = parseFloat(orderData.tax || 0);
  const totalAmount = subtotal + shipping + tax;

  const templateData = {
    orderId: orderData.id || orderData._id,
    orderDate: new Date(orderData.createdAt || orderData.orderDate || Date.now()).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    cancelledDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    totalAmount: totalAmount.toFixed(2),
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    tax: tax.toFixed(2),
    status: 'cancelled',
    products: products.map(product => ({
      title: product.title || product.name,
      price: parseFloat(product.price || product.unitPrice).toFixed(2),
      quantity: product.quantity || 1,
      total: (parseFloat(product.price || product.unitPrice) * (product.quantity || 1)).toFixed(2),
      image: product.image || product.img,
      color: product.color || 'Default',
      size: product.size || 'One Size'
    })),
    address: {
      name: orderData.address?.name || 'Customer',
      street: orderData.address?.street || orderData.shippingAddress?.street,
      city: orderData.address?.city || orderData.shippingAddress?.city,
      state: orderData.address?.state || orderData.shippingAddress?.state,
      zipCode: orderData.address?.zipCode || orderData.shippingAddress?.zipCode,
      country: orderData.address?.country || orderData.shippingAddress?.country || 'United States'
    }
  };

  console.log('📦 Cancellation template data prepared:', {
    orderId: templateData.orderId,
    refundAmount: templateData.totalAmount
  });

  return compiledCancellationTemplate(templateData);
};

module.exports = {
  generateOrderConfirmationTemplate,
  generatePaymentConfirmationTemplate,
  generateWelcomeTemplate,
  generateShippingTemplate,
  generateOrderCancellationTemplate
};