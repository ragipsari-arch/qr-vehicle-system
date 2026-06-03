"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Retrieve all vehicles of the authenticated user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await (0, db_1.query)('SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Fetch Vehicles Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Add new vehicle
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { plate, brand, model, color, country } = req.body;
        if (!plate || !brand || !model) {
            return res.status(400).json({ error: 'Plate, brand, and model are required' });
        }
        // Check user plan limits
        const userResult = await (0, db_1.query)('SELECT plan FROM users WHERE id = $1', [userId]);
        const plan = userResult.rows[0]?.plan || 'free';
        const countResult = await (0, db_1.query)('SELECT COUNT(*) as count FROM vehicles WHERE user_id = $1', [userId]);
        const vehicleCount = parseInt(countResult.rows[0].count || '0');
        if (plan === 'free' && vehicleCount >= 1) {
            return res.status(403).json({
                error: 'Free plan is limited to 1 vehicle. Please upgrade to Premium for unlimited vehicles.'
            });
        }
        // Check if plate already registered by anyone to avoid duplicates
        const plateCheck = await (0, db_1.query)('SELECT * FROM vehicles WHERE plate = $1', [plate]);
        if (plateCheck.rows.length > 0) {
            return res.status(400).json({ error: 'This license plate is already registered.' });
        }
        // Generate vehicle & QR codes
        const vehicleId = 'v-' + Math.random().toString(36).substring(2, 15);
        const qrUuid = 'qr-' + Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 10);
        await (0, db_1.query)(`INSERT INTO vehicles (id, user_id, plate, brand, model, color, country, qr_uuid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [vehicleId, userId, plate.toUpperCase(), brand, model, color || '', country || 'Turkey', qrUuid]);
        const newVehicle = await (0, db_1.query)('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
        res.status(201).json({
            message: 'Vehicle added successfully',
            vehicle: newVehicle.rows[0]
        });
    }
    catch (err) {
        console.error('Add Vehicle Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Update vehicle
router.put('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const vehicleId = req.params.id;
        const { plate, brand, model, color, country } = req.body;
        if (!plate || !brand || !model) {
            return res.status(400).json({ error: 'Plate, brand, and model are required' });
        }
        // Verify ownership
        const ownershipCheck = await (0, db_1.query)('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2', [vehicleId, userId]);
        if (ownershipCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
        }
        // Check plate collision with other vehicles
        const plateCheck = await (0, db_1.query)('SELECT * FROM vehicles WHERE plate = $1 AND id != $2', [plate.toUpperCase(), vehicleId]);
        if (plateCheck.rows.length > 0) {
            return res.status(400).json({ error: 'License plate is already in use by another vehicle.' });
        }
        await (0, db_1.query)(`UPDATE vehicles 
       SET plate = $1, brand = $2, model = $3, color = $4, country = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`, [plate.toUpperCase(), brand, model, color || '', country || 'Turkey', vehicleId]);
        const updatedVehicle = await (0, db_1.query)('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);
        res.json({
            message: 'Vehicle updated successfully',
            vehicle: updatedVehicle.rows[0]
        });
    }
    catch (err) {
        console.error('Update Vehicle Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Delete vehicle
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const vehicleId = req.params.id;
        // Verify ownership
        const ownershipCheck = await (0, db_1.query)('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2', [vehicleId, userId]);
        if (ownershipCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
        }
        await (0, db_1.query)('DELETE FROM vehicles WHERE id = $1', [vehicleId]);
        res.json({ message: 'Vehicle deleted successfully' });
    }
    catch (err) {
        console.error('Delete Vehicle Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;
