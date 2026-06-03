"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const notification_1 = require("../services/notification");
const router = (0, express_1.Router)();
// Store interactive math captcha challenge keys per session / IP
// Simple local in-memory store for local ease of use
const activeCaptchas = {};
// Get public vehicle info
router.get('/vehicles/:qr_uuid', async (req, res) => {
    try {
        const { qr_uuid } = req.params;
        const vehicleResult = await (0, db_1.query)('SELECT * FROM vehicles WHERE qr_uuid = $1', [qr_uuid]);
        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        const vehicle = vehicleResult.rows[0];
        const ownerId = vehicle.user_id;
        // Fetch owner's plan and notifications settings
        const ownerResult = await (0, db_1.query)('SELECT plan FROM users WHERE id = $1', [ownerId]);
        const ownerPlan = ownerResult.rows[0]?.plan || 'free';
        const settingsResult = await (0, db_1.query)('SELECT * FROM notification_settings WHERE user_id = $1', [ownerId]);
        const settings = settingsResult.rows[0];
        // Enforce limits: if free plan, override and disable premium channels
        const isPremium = ownerPlan === 'premium';
        const allowedChannels = {
            whatsapp: isPremium && Number(settings?.whatsapp_enabled) === 1,
            telegram: isPremium && Number(settings?.telegram_enabled) === 1,
            sms: isPremium && Number(settings?.sms_enabled) === 1,
            push: isPremium && Number(settings?.push_enabled) === 1,
            email: Number(settings?.email_enabled) === 1
        };
        // Generate a fresh math captcha
        const ip = req.ip || '127.0.0.1';
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        activeCaptchas[ip] = num1 + num2;
        res.json({
            vehicle: {
                plate: vehicle.plate,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color,
                country: vehicle.country
            },
            plan: ownerPlan,
            allowedChannels,
            captcha: {
                question: `Kaçtır: ${num1} + ${num2} = ?`
            }
        });
    }
    catch (err) {
        console.error('Fetch Public Vehicle Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Trigger Notification from QR scanner
router.post('/vehicles/:qr_uuid/notify', async (req, res) => {
    try {
        const { qr_uuid } = req.params;
        const { category, sub_category, custom_text, location_lat, location_lng, captcha_answer } = req.body;
        const ip = req.ip || '127.0.0.1';
        // 1. Verify captcha
        const expected = activeCaptchas[ip];
        delete activeCaptchas[ip]; // Single use
        if (expected === undefined || parseInt(captcha_answer) !== expected) {
            return res.status(400).json({ error: 'Güvenlik kodu hatalı / Incorrect CAPTCHA answer.' });
        }
        // 2. Look up vehicle
        const vehicleResult = await (0, db_1.query)('SELECT * FROM vehicles WHERE qr_uuid = $1', [qr_uuid]);
        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({ error: 'Araç bulunamadı / Vehicle not found' });
        }
        const vehicle = vehicleResult.rows[0];
        const ownerId = vehicle.user_id;
        // 3. Fetch owner info & notification settings
        const ownerResult = await (0, db_1.query)('SELECT email, phone, plan FROM users WHERE id = $1', [ownerId]);
        const owner = ownerResult.rows[0];
        if (!owner) {
            return res.status(404).json({ error: 'Araç sahibi bulunamadı / Vehicle owner not found' });
        }
        const settingsResult = await (0, db_1.query)('SELECT * FROM notification_settings WHERE user_id = $1', [ownerId]);
        const settings = settingsResult.rows[0];
        const isPremium = owner.plan === 'premium';
        // 4. Validate spam/message length limits
        if (custom_text && custom_text.length > 500) {
            return res.status(400).json({ error: 'Mesaj maksimum 500 karakter olmalıdır.' });
        }
        // IP rate limits: limit to 3 requests per 10 minutes per IP to avoid spam
        const rateLimitCheck = await (0, db_1.query)(`SELECT COUNT(*) as count FROM messages 
       WHERE sender_ip = $1 AND created_at > datetime('now', '-10 minutes')`, // SQLite format (db adapter translates properly or works on both)
        [ip]);
        const count = parseInt(rateLimitCheck.rows[0].count || '0');
        if (count >= 3) {
            return res.status(429).json({ error: 'Çok fazla bildirim gönderdiniz. Lütfen daha sonra tekrar deneyin.' });
        }
        // 5. Store message in database
        const messageId = 'msg-' + Math.random().toString(36).substring(2, 15);
        // Validate premium location sharing
        const lat = isPremium ? location_lat : null;
        const lng = isPremium ? location_lng : null;
        await (0, db_1.query)(`INSERT INTO messages (id, vehicle_id, category, sub_category, custom_text, location_lat, location_lng, sender_ip, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [messageId, vehicle.id, category, sub_category || null, custom_text || null, lat, lng, ip, 'pending']);
        // 6. Build channel preferences (enforce premium limits and routing logic)
        const activeSettings = isPremium ? {
            whatsapp_enabled: Number(settings?.whatsapp_enabled) === 1,
            telegram_enabled: Number(settings?.telegram_enabled) === 1,
            sms_enabled: true, // Plus owners receive direct SMS on their phone!
            push_enabled: Number(settings?.push_enabled) === 1,
            email_enabled: false // Plus owners do not receive emails, routing directly to phone!
        } : {
            whatsapp_enabled: false,
            telegram_enabled: false,
            sms_enabled: false,
            push_enabled: false,
            email_enabled: Number(settings?.email_enabled) === 1 // Free owners receive email
        };
        // 7. Dispatch notification
        const dispatchResult = await (0, notification_1.sendNotification)({
            ownerPhone: owner.phone,
            ownerEmail: owner.email,
            plate: vehicle.plate,
            brand: vehicle.brand,
            model: vehicle.model,
            category,
            subCategory: sub_category || null,
            customText: custom_text || null,
            locationLat: lat,
            locationLng: lng,
            telegramChatId: settings?.telegram_chat_id,
            settings: activeSettings
        });
        // Update status in db
        const finalStatus = dispatchResult.channels.length > 0 ? 'sent' : 'failed';
        await (0, db_1.query)('UPDATE messages SET status = $1 WHERE id = $2', [finalStatus, messageId]);
        res.json({
            success: true,
            message: 'Bildirim araç sahibine başarıyla iletildi! / Notification successfully dispatched!',
            channels: dispatchResult.channels
        });
    }
    catch (err) {
        console.error('Send Contact Alert Error:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// SIMULATOR ENDPOINTS (For Interactive Local Testing Overlay)
router.get('/simulator/logs', (req, res) => {
    res.json((0, notification_1.getSimulatorLogs)());
});
router.post('/simulator/clear', (req, res) => {
    (0, notification_1.clearSimulatorLogs)();
    res.json({ success: true, message: 'Simulator log cleared.' });
});
exports.default = router;
