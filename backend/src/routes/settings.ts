import { Router, Response } from 'express';
import { query } from '../config/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get notification settings and user plan status
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const userResult = await query('SELECT plan, email, phone FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const settingsResult = await query('SELECT * FROM notification_settings WHERE user_id = $1', [userId]);
    let settings = settingsResult.rows[0];

    // Auto-create settings if missing
    if (!settings) {
      const settingsId = 'ns-' + Math.random().toString(36).substring(2, 15);
      await query(
        `INSERT INTO notification_settings (id, user_id, whatsapp_enabled, telegram_enabled, sms_enabled, push_enabled, email_enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [settingsId, userId, 0, 0, 0, 0, 1]
      );
      const newSettings = await query('SELECT * FROM notification_settings WHERE user_id = $1', [userId]);
      settings = newSettings.rows[0];
    }

    res.json({
      plan: user.plan,
      email: user.email,
      phone: user.phone,
      settings: {
        whatsapp_enabled: Number(settings.whatsapp_enabled) === 1,
        telegram_enabled: Number(settings.telegram_enabled) === 1,
        sms_enabled: Number(settings.sms_enabled) === 1,
        push_enabled: Number(settings.push_enabled) === 1,
        email_enabled: Number(settings.email_enabled) === 1,
        telegram_chat_id: settings.telegram_chat_id || ''
      }
    });
  } catch (err: any) {
    console.error('Fetch Settings Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update notification settings
router.put('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { whatsapp_enabled, telegram_enabled, sms_enabled, push_enabled, email_enabled, telegram_chat_id } = req.body;

    const userResult = await query('SELECT plan FROM users WHERE id = $1', [userId]);
    const plan = userResult.rows[0]?.plan || 'free';

    // Premium checks
    const hasPremium = plan === 'premium';
    const wantsWhatsapp = !!whatsapp_enabled;
    const wantsTelegram = !!telegram_enabled;
    const wantsSms = !!sms_enabled;
    const wantsPush = !!push_enabled;

    if (!hasPremium && (wantsWhatsapp || wantsTelegram || wantsSms || wantsPush)) {
      return res.status(403).json({
        error: 'WhatsApp, Telegram, SMS, and Push notifications require a Premium Subscription.'
      });
    }

    // Convert booleans to sqlite-friendly integers (0 or 1)
    const wa = wantsWhatsapp ? 1 : 0;
    const tg = wantsTelegram ? 1 : 0;
    const sms = wantsSms ? 1 : 0;
    const push = wantsPush ? 1 : 0;
    const email = email_enabled !== false ? 1 : 0;

    await query(
      `UPDATE notification_settings 
       SET whatsapp_enabled = $1, telegram_enabled = $2, sms_enabled = $3, push_enabled = $4, email_enabled = $5, telegram_chat_id = $6, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $7`,
      [wa, tg, sms, push, email, telegram_chat_id || null, userId]
    );

    res.json({ message: 'Notification preferences updated successfully' });
  } catch (err: any) {
    console.error('Update Settings Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Upgrade plan to Premium (Mock Gateway)
router.post('/upgrade', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    await query("UPDATE users SET plan = 'premium' WHERE id = $1", [userId]);

    res.json({
      message: 'Plan upgraded to Premium successfully! Enjoy premium notification channels.',
      plan: 'premium'
    });
  } catch (err: any) {
    console.error('Upgrade Plan Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
