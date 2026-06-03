import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const getDbPath = () => {
  if (process.env.VERCEL) {
    return '/tmp/qr_vehicle_system_db.json';
  }
  return path.join(__dirname, '../qr_vehicle_system_db.json');
};

const readDb = () => {
  try {
    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      const initialData = { users: [], vehicles: [] };
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    return { users: [], vehicles: [] };
  }
};

const writeDb = (data: any) => {
  try {
    fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    return false;
  }
};

app.get('/api/test', (req: any, res: any) => {
  res.json({ message: 'API calisiyor!' });
});

app.post('/api/auth/register', async (req: any, res: any) => {
  try {
    const { email, phone, password } = req.body;
    
    if (!email || !phone || !password) {
      return res.status(400).json({ error: 'Eksik bilgi!' });
    }
    
    const db = readDb();
    const existingUser = db.users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta zaten kayitli' });
    }
    
    const newUser = { email, phone, password, verified: true, createdAt: new Date().toISOString() };
    db.users.push(newUser);
    writeDb(db);
    
    const token = Buffer.from(email + ':' + Date.now()).toString('base64');
    
    res.status(201).json({ success: true, message: 'Kayit basarili!', token: token, user: { email, phone } });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatasi' });
  }
});

app.post('/api/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const db = readDb();
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'E-posta veya sifre hatali' });
    }
    
    const token = Buffer.from(email + ':' + Date.now()).toString('base64');
    res.json({ success: true, message: 'Giris basarili', token: token, user: { email: user.email, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatasi' });
  }
});

app.get('/api/vehicles', (req: any, res: any) => {
  const db = readDb();
  res.json(db.vehicles || []);
});

export default app;