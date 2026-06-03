// Kayıt ol - OTP'siz direkt kayıt
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    
    console.log('📝 Kayıt isteği:', { email, phone });
    
    // Eksik alan kontrolü
    if (!email || !phone || !password) {
      return res.status(400).json({ error: 'E-posta, telefon ve şifre gereklidir.' });
    }
    
    const db = readDb();
    const existingUser = db.users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayıtlı' });
    }
    
    const newUser = { 
      email, 
      phone, 
      password, 
      verified: true,
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDb(db);
    
    // Basit token oluştur (gerçek projede JWT kullanın)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    res.status(201).json({ 
      success: true, 
      message: 'Kayıt başarılı! Giriş yapabilirsiniz.',
      token: token,
      user: { email, phone }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası: ' + error.message });
  }
});

// Giriş yap
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const db = readDb();
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    }
    
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    res.json({ 
      success: true, 
      message: 'Giriş başarılı',
      token: token,
      user: { email: user.email, phone: user.phone }
    });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});