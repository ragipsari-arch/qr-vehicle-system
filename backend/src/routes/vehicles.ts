import { Router, Response } from 'express';
import { query } from '../config/db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Retrieve all vehicles of the authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await query(
      'SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error('Fetch Vehicles Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add new vehicle
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { plate, brand, model, color, country } = req.body;

    if (!plate || !brand || !model) {
      return res.status(400).json({ error: 'Plate, brand, and model are required' });
    }

    // Check user plan limits
    const userResult = await query('SELECT plan FROM users WHERE id = $1', [userId]);
    const plan = userResult.rows[0]?.plan || 'free';

    const countResult = await query('SELECT COUNT(*) as count FROM vehicles WHERE user_id = $1', [userId]);
    const vehicleCount = parseInt((countResult.rows[0] as any).count || '0');

    if (plan === 'free' && vehicleCount >= 1) {
      return res.status(403).json({
        error: 'Free plan is limited to 1 vehicle. Please upgrade to Premium for unlimited vehicles.'
      });
    }

    // Check if plate already registered by anyone to avoid duplicates
    const plateCheck = await query('SELECT * FROM vehicles WHERE plate = $1', [plate]);
    if (plateCheck.rows.length > 0) {
      return res.status(400).json({ error: 'This license plate is already registered.' });
    }

    // Generate vehicle & QR codes
    const vehicleId = 'v-' + Math.random().toString(36).substring(2, 15);
    const qrUuid = 'qr-' + Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 10);

    await query(
      `INSERT INTO vehicles (id, user_id, plate, brand, model, color, country, qr_uuid)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [vehicleId, userId, plate.toUpperCase(), brand, model, color || '', country || 'Turkey', qrUuid]
    );

    const newVehicle = await query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);

    res.status(201).json({
      message: 'Vehicle added successfully',
      vehicle: newVehicle.rows[0]
    });
  } catch (err: any) {
    console.error('Add Vehicle Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update vehicle
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const vehicleId = req.params.id;
    const { plate, brand, model, color, country } = req.body;

    if (!plate || !brand || !model) {
      return res.status(400).json({ error: 'Plate, brand, and model are required' });
    }

    // Verify ownership
    const ownershipCheck = await query('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2', [vehicleId, userId]);
    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
    }

    // Check plate collision with other vehicles
    const plateCheck = await query('SELECT * FROM vehicles WHERE plate = $1 AND id != $2', [plate.toUpperCase(), vehicleId]);
    if (plateCheck.rows.length > 0) {
      return res.status(400).json({ error: 'License plate is already in use by another vehicle.' });
    }

    await query(
      `UPDATE vehicles 
       SET plate = $1, brand = $2, model = $3, color = $4, country = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [plate.toUpperCase(), brand, model, color || '', country || 'Turkey', vehicleId]
    );

    const updatedVehicle = await query('SELECT * FROM vehicles WHERE id = $1', [vehicleId]);

    res.json({
      message: 'Vehicle updated successfully',
      vehicle: updatedVehicle.rows[0]
    });
  } catch (err: any) {
    console.error('Update Vehicle Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete vehicle
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const vehicleId = req.params.id;

    // Verify ownership
    const ownershipCheck = await query('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2', [vehicleId, userId]);
    if (ownershipCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found or unauthorized' });
    }

    await query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err: any) {
    console.error('Delete Vehicle Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
