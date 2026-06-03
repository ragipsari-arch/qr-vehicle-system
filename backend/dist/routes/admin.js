"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Retrieve administrative overview statistics
router.get('/stats', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const totalUsers = await (0, db_1.query)('SELECT COUNT(*) as count FROM users');
        const premiumUsers = await (0, db_1.query)("SELECT COUNT(*) as count FROM users WHERE plan = 'premium'");
        const totalVehicles = await (0, db_1.query)('SELECT COUNT(*) as count FROM vehicles');
        const totalMessages = await (0, db_1.query)('SELECT COUNT(*) as count FROM messages');
        const activeAbuseReports = await (0, db_1.query)("SELECT COUNT(*) as count FROM abuse_reports WHERE status = 'pending'");
        res.json({
            stats: {
                users: parseInt(totalUsers.rows[0].count || '0'),
                premiumRatio: parseInt(totalUsers.rows[0].count || '0') > 0
                    ? Math.round((parseInt(premiumUsers.rows[0].count || '0') / parseInt(totalUsers.rows[0].count || '0')) * 100)
                    : 0,
                vehicles: parseInt(totalVehicles.rows[0].count || '0'),
                messages: parseInt(totalMessages.rows[0].count || '0'),
                abuseReports: parseInt(activeAbuseReports.rows[0].count || '0')
            }
        });
    }
    catch (err) {
        console.error('Fetch Stats Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Retrieve list of all users
router.get('/users', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT id, email, phone, role, plan, is_phone_verified, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (err) {
        console.error('Admin Fetch Users Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Retrieve list of all registered vehicles
router.get('/vehicles', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const result = await (0, db_1.query)(`
      SELECT v.*, u.email as owner_email, u.phone as owner_phone
      FROM vehicles v
      JOIN users u ON v.user_id = u.id
      ORDER BY v.created_at DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Admin Fetch Vehicles Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Retrieve list of all logs / notifications
router.get('/messages', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const result = await (0, db_1.query)(`
      SELECT m.*, v.plate, v.brand, v.model, u.email as owner_email
      FROM messages m
      JOIN vehicles v ON m.vehicle_id = v.id
      JOIN users u ON v.user_id = u.id
      ORDER BY m.created_at DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Admin Fetch Messages Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Retrieve all flags / abuse reports
router.get('/abuse-reports', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const result = await (0, db_1.query)(`
      SELECT ar.*, m.category, m.sub_category, m.custom_text, v.plate
      FROM abuse_reports ar
      LEFT JOIN messages m ON ar.message_id = m.id
      LEFT JOIN vehicles v ON m.vehicle_id = v.id
      ORDER BY ar.created_at DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Admin Fetch Abuse Reports Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Resolve an abuse report
router.post('/abuse-reports/:id/action', auth_1.authenticateToken, auth_1.requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'resolved', 'ignored'
        if (!status || !['resolved', 'ignored'].includes(status)) {
            return res.status(400).json({ error: 'Invalid resolution status' });
        }
        await (0, db_1.query)('UPDATE abuse_reports SET status = $1 WHERE id = $2', [status, id]);
        res.json({ message: 'Abuse report updated successfully' });
    }
    catch (err) {
        console.error('Admin Resolve Abuse Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
