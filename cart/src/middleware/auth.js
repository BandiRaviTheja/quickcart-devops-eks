// Simple token decoding without verification (for development)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('🔐 Authorization header:', authHeader);
  
  if (!authHeader) {
    console.log('❌ No authorization header');
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Extracted token:', token ? 'Present' : 'Missing');
  
  if (!token) {
    console.log('❌ No token after Bearer');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Just decode the token without verification
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64');
    req.user = JSON.parse(payload);
    console.log('✅ Token decoded - User:', req.user);
    next();
  } catch (error) {
    console.log('❌ Token decode error:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64');
      req.user = JSON.parse(payload);
    } catch (error) {
      // Silently fail for optional auth
    }
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };