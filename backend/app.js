const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API calisiyor!' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = Buffer.from(email + ':' + Date.now()).toString('base64');
    res.json({
      success: true,
      message: 'Giriş başarılı',
      token: token,
      user: { email: 'admin@example.com', phone: '5551234567' }
    });
  } else {
    res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
  }
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'Kayıt başarılı',
    userId: 'test-user-id'
  });
});

// Vehicles endpoint
app.get('/api/vehicles', (req, res) => {
  res.json([]);
});

module.exports = app;const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API calisiyor!' });
});

// Login endpoint - Sabit kullanıcı
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login denemesi:', email, password);
  
  if (email === 'admin@example.com' && password === 'admin123') {
    const token = Buffer.from(email + ':' + Date.now()).toString('base64');
    res.json({
      success: true,
      message: 'Giriş başarılı',
      token: token,
      user: { email: 'admin@example.com', phone: '5551234567' }
    });
  } else {
    res.status(401).json({ error: 'Kullanıcı adı veya şifre hatali' });
  }
});

// Register endpoint - Basit cevap
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ 
    success: true, 
    message: 'Kayıt başarılı',
    userId: 'test-user-id'
  });
});

// Vehicles endpoint
app.get('/api/vehicles', (req, res) => {
  res.json([]);
});

module.exports = app;
