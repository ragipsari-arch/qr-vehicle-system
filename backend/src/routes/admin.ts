import { Router, Response } from 'express';
import { query } from '../config/db';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Retrieve administrative overview statistics
router.get('/stats', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await query('SELECT COUNT(*) as count FROM users');
    const premiumUsers = await query("SELECT COUNT(*) as count FROM users WHERE plan = 'premium'");
    const totalVehicles = await query('SELECT COUNT(*) as count FROM vehicles');
    const totalMessages = await query('SELECT COUNT(*) as count FROM messages');
    const activeAbuseReports = await query("SELECT COUNT(*) as count FROM abuse_reports WHERE status = 'pending'");

    res.json({
      stats: {
        users: parseInt((totalUsers.rows[0] as any).count || '0'),
        premiumRatio: parseInt((totalUsers.rows[0] as any).count || '0') > 0 
          ? Math.round((parseInt((premiumUsers.rows[0] as any).count || '0') / parseInt((totalUsers.rows[0] as any).count || '0')) * 100) 
          : 0,
        vehicles: parseInt((totalVehicles.rows[0] as any).count || '0'),
        messages: parseInt((totalMessages.rows[0] as any).count || '0'),
        abuseReports: parseInt((activeAbuseReports.rows[0] as any).count || '0')
      }
    });
  } catch (err: any) {
    console.error('Fetch Stats Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve list of all users
router.get('/users', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, email, phone, role, plan, is_phone_verified, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Admin Fetch Users Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve list of all registered vehicles
router.get('/vehicles', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT v.*, u.email as owner_email, u.phone as owner_phone
      FROM vehicles v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Admin Fetch Vehicles Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve list of all logs / notifications
router.get('/messages', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT m.*, v.plate, v.brand, v.model, u.email as owner_email
      FROM messages m
      JOIN vehicles v ON m.vehicle_id = v.id
      JOIN users u ON v.user_id = u.id
      ORDER BY m.created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Admin Fetch Messages Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve all flags / abuse reports
router.get('/abuse-reports', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await query(`
      SELECT ar.*, m.category, m.sub_category, m.custom_text, v.plate
      FROM abuse_reports ar
      LEFT JOIN messages m ON ar.message_id = m.id
      LEFT JOIN vehicles v ON m.vehicle_id = v.id
      ORDER BY ar.created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    console.error('Admin Fetch Abuse Reports Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Resolve an abuse report
router.post('/abuse-reports/:id/action', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'resolved', 'ignored'

    if (!status || !['resolved', 'ignored'].includes(status)) {
      return res.status(400).json({ error: 'Invalid resolution status' });
    }

    await query('UPDATE abuse_reports SET status = $1 WHERE id = $2', [status, id]);

    res.json({ message: 'Abuse report updated successfully' });
  } catch (err: any) {
    console.error('Admin Resolve Abuse Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
