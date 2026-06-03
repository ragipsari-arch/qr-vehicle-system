import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'qr-vehicle-system-jwt-super-secret-key-12345';

/**
 * Generate 6-digit random number
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// User Registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;

    if (!email || !phone || !password) {
      return res.status(400).json({ error: 'Email, phone, and password are required' });
    }

    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1 OR phone = $2', [email, phone]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or phone already exists' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    
    // Generate UUIDs
    const userId = 'u-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create User
    await query(
      `INSERT INTO users (id, email, phone, password_hash, role, plan, is_phone_verified, is_email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [userId, email, phone, passwordHash, 'user', 'free', 0, 0]
    );

    // Create Notification Settings
    const settingsId = 'ns-' + Math.random().toString(36).substring(2, 15);
    await query(
      `INSERT INTO notification_settings (id, user_id, whatsapp_enabled, telegram_enabled, sms_enabled, push_enabled, email_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [settingsId, userId, 0, 0, 0, 0, 1]
    );

    // Create OTP code
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins
    const otpId = 'otp-' + Math.random().toString(36).substring(2, 15);

    await query(
      `INSERT INTO verification_codes (id, user_id, type, code, expires_at, is_used)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [otpId, userId, 'phone_otp', otpCode, expiresAt, 0]
    );

    // LOG THE CODE TO CONSOLE SO THE USER CAN PASS VERIFICATION EASILY
    console.log(`\n======================================================`);
    console.log(`[OTP SIMULATOR] Registration for ${email}`);
    console.log(`[OTP SIMULATOR] Verification code sent to ${phone}: ${otpCode}`);
    console.log(`======================================================\n`);

    res.status(201).json({
      message: 'Registration successful. Verification code generated.',
      userId,
      email,
      phone
    });
  } catch (err: any) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and OTP code are required' });
    }

    const result = await query(
      `SELECT * FROM verification_codes 
       WHERE user_id = $1 AND code = $2 AND is_used = 0`,
      [userId, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or already used verification code' });
    }

    const otpRecord = result.rows[0];
    const expiryTime = new Date(otpRecord.expires_at).getTime();
    
    if (expiryTime < Date.now()) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Mark code as used
    await query('UPDATE verification_codes SET is_used = 1 WHERE id = $1', [otpRecord.id]);

    // Verify user phone
    await query('UPDATE users SET is_phone_verified = 1 WHERE id = $1', [userId]);

    res.json({ message: 'Phone number verified successfully' });
  } catch (err: any) {
    console.error('OTP Verification Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const otpId = 'otp-' + Math.random().toString(36).substring(2, 15);

    // Invalidate prior codes
    await query('UPDATE verification_codes SET is_used = 1 WHERE user_id = $1 AND type = $2', [userId, 'phone_otp']);

    // Create new OTP code
    await query(
      `INSERT INTO verification_codes (id, user_id, type, code, expires_at, is_used)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [otpId, userId, 'phone_otp', otpCode, expiresAt, 0]
    );

    console.log(`\n======================================================`);
    console.log(`[OTP SIMULATOR] Resending code for ${user.email}`);
    console.log(`[OTP SIMULATOR] New Verification code sent to ${user.phone}: ${otpCode}`);
    console.log(`======================================================\n`);

    res.json({ message: 'New verification code has been generated' });
  } catch (err: any) {
    console.error('Resend OTP Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Email/phone and password are required' });
    }

    // Lookup user by email OR phone
    const userResult = await query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2',
      [emailOrPhone, emailOrPhone]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }

    const user = userResult.rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email/phone or password' });
    }

    // Check if phone verified
    const isPhoneVerified = Number(user.is_phone_verified) === 1;

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        plan: user.plan,
        isPhoneVerified
      }
    });
  } catch (err: any) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
