"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbEngine = void 0;
exports.query = query;
exports.initDb = initDb;
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const isProduction = process.env.NODE_ENV === 'production';
const hasPgUrl = !!process.env.DATABASE_URL;
let pgPool = null;
exports.dbEngine = hasPgUrl ? 'postgres' : 'jsonfile';
console.log(`[DB] Using Database Engine: ${exports.dbEngine.toUpperCase()}`);
const jsonDbPath = path_1.default.resolve(__dirname, '../../qr_vehicle_system_db.json');
let localDbData = {
    users: [],
    vehicles: [],
    notification_settings: [],
    messages: [],
    verification_codes: [],
    abuse_reports: []
};
// Initialize connection / load file
if (exports.dbEngine === 'postgres') {
    pgPool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false
    });
}
else {
    if (fs_1.default.existsSync(jsonDbPath)) {
        try {
            const content = fs_1.default.readFileSync(jsonDbPath, 'utf8');
            localDbData = JSON.parse(content);
            console.log(`[DB] Loaded JSON Database from: ${jsonDbPath}`);
        }
        catch (err) {
            console.error('[DB] Error reading JSON database. Creating new database:', err.message);
        }
    }
    else {
        saveJsonDb();
        console.log(`[DB] Initialized fresh JSON database at: ${jsonDbPath}`);
    }
}
function saveJsonDb() {
    try {
        fs_1.default.writeFileSync(jsonDbPath, JSON.stringify(localDbData, null, 2), 'utf8');
    }
    catch (err) {
        console.error('[DB] Failed to save JSON database:', err.message);
    }
}
/**
 * Unified raw query runner supporting PostgreSQL and standard JS-JSON storage
 */
async function query(sql, params = []) {
    if (exports.dbEngine === 'postgres') {
        if (!pgPool)
            throw new Error('[DB] Postgres Pool not initialized');
        const result = await pgPool.query(sql, params);
        return { rows: result.rows };
    }
    // --- JSON File-Based Database Simulation ---
    const normalizedSql = sql.replace(/\s+/g, ' ').trim();
    // 1. INSERT INTO users
    if (normalizedSql.startsWith('INSERT INTO users')) {
        const [id, email, phone, password_hash, role, plan, is_phone_verified, is_email_verified] = params;
        const newUser = {
            id, email, phone, password_hash, role, plan,
            is_phone_verified: is_phone_verified ? 1 : 0,
            is_email_verified: is_email_verified ? 1 : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        localDbData.users.push(newUser);
        saveJsonDb();
        return { rows: [newUser] };
    }
    // 2. INSERT INTO notification_settings
    if (normalizedSql.startsWith('INSERT INTO notification_settings')) {
        const [id, user_id, whatsapp, telegram, sms, push, email] = params;
        const newSettings = {
            id, user_id,
            whatsapp_enabled: whatsapp ? 1 : 0,
            telegram_enabled: telegram ? 1 : 0,
            sms_enabled: sms ? 1 : 0,
            push_enabled: push ? 1 : 0,
            email_enabled: email ? 1 : 1,
            telegram_chat_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        localDbData.notification_settings.push(newSettings);
        saveJsonDb();
        return { rows: [newSettings] };
    }
    // 3. INSERT INTO vehicles
    if (normalizedSql.startsWith('INSERT INTO vehicles')) {
        const [id, user_id, plate, brand, model, color, country, qr_uuid] = params;
        const newVehicle = {
            id, user_id, plate, brand, model, color, country, qr_uuid,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        localDbData.vehicles.push(newVehicle);
        saveJsonDb();
        return { rows: [newVehicle] };
    }
    // 4. INSERT INTO verification_codes
    if (normalizedSql.startsWith('INSERT INTO verification_codes')) {
        const [id, user_id, type, code, expires_at, is_used] = params;
        const newCode = {
            id, user_id, type, code, expires_at,
            is_used: is_used ? 1 : 0,
            created_at: new Date().toISOString()
        };
        localDbData.verification_codes.push(newCode);
        saveJsonDb();
        return { rows: [newCode] };
    }
    // 5. INSERT INTO messages
    if (normalizedSql.startsWith('INSERT INTO messages')) {
        const [id, vehicle_id, category, sub_category, custom_text, lat, lng, ip, status] = params;
        const newMessage = {
            id, vehicle_id, category, sub_category, custom_text,
            location_lat: lat,
            location_lng: lng,
            sender_ip: ip,
            status: status || 'pending',
            created_at: new Date().toISOString()
        };
        localDbData.messages.push(newMessage);
        saveJsonDb();
        return { rows: [newMessage] };
    }
    // 6. INSERT INTO abuse_reports
    if (normalizedSql.startsWith('INSERT INTO abuse_reports')) {
        const [id, message_id, reporter_ip, reason, status] = params;
        const newReport = {
            id, message_id, reporter_ip, reason,
            status: status || 'pending',
            created_at: new Date().toISOString()
        };
        localDbData.abuse_reports.push(newReport);
        saveJsonDb();
        return { rows: [newReport] };
    }
    // 7. SELECT FROM users (login & lookup)
    if (normalizedSql.startsWith('SELECT * FROM users WHERE email = $1 OR phone = $2')) {
        const [searchVal1, searchVal2] = params;
        const matched = localDbData.users.filter(u => u.email === searchVal1 || u.phone === searchVal2);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM users WHERE email = $1')) {
        const [email] = params;
        const matched = localDbData.users.filter(u => u.email === email);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM users WHERE id = $1')) {
        const [id] = params;
        const matched = localDbData.users.filter(u => u.id === id);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT plan, email, phone FROM users WHERE id = $1') ||
        normalizedSql.startsWith('SELECT email, phone, plan FROM users WHERE id = $1')) {
        const [id] = params;
        const matched = localDbData.users.filter(u => u.id === id).map(u => ({ plan: u.plan, email: u.email, phone: u.phone }));
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT plan FROM users WHERE id = $1')) {
        const [id] = params;
        const matched = localDbData.users.filter(u => u.id === id).map(u => ({ plan: u.plan }));
        return { rows: matched };
    }
    // 8. SELECT FROM vehicles
    if (normalizedSql.startsWith('SELECT * FROM vehicles WHERE user_id = $1 ORDER BY created_at DESC')) {
        const [userId] = params;
        const matched = localDbData.vehicles.filter(v => v.user_id === userId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM vehicles WHERE plate = $1 AND id != $2')) {
        const [plate, id] = params;
        const matched = localDbData.vehicles.filter(v => v.plate === plate && v.id !== id);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM vehicles WHERE plate = $1')) {
        const [plate] = params;
        const matched = localDbData.vehicles.filter(v => v.plate === plate);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM vehicles WHERE id = $1 AND user_id = $2')) {
        const [id, userId] = params;
        const matched = localDbData.vehicles.filter(v => v.id === id && v.user_id === userId);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM vehicles WHERE qr_uuid = $1')) {
        const [qrUuid] = params;
        const matched = localDbData.vehicles.filter(v => v.qr_uuid === qrUuid);
        return { rows: matched };
    }
    if (normalizedSql.startsWith('SELECT * FROM vehicles WHERE id = $1')) {
        const [id] = params;
        const matched = localDbData.vehicles.filter(v => v.id === id);
        return { rows: matched };
    }
    // 9. SELECT FROM notification_settings
    if (normalizedSql.startsWith('SELECT * FROM notification_settings WHERE user_id = $1')) {
        const [userId] = params;
        const matched = localDbData.notification_settings.filter(ns => ns.user_id === userId);
        return { rows: matched };
    }
    // 10. SELECT FROM verification_codes
    if (normalizedSql.startsWith('SELECT * FROM verification_codes WHERE user_id = $1 AND code = $2 AND is_used = 0')) {
        const [userId, code] = params;
        const matched = localDbData.verification_codes.filter(vc => vc.user_id === userId && vc.code === code && vc.is_used === 0);
        return { rows: matched };
    }
    // 11. SELECT COUNT
    if (normalizedSql.startsWith('SELECT COUNT(*) as count FROM vehicles WHERE user_id = $1')) {
        const [userId] = params;
        const count = localDbData.vehicles.filter(v => v.user_id === userId).length;
        return { rows: [{ count: count.toString() }] };
    }
    if (normalizedSql.startsWith('SELECT COUNT(*) as count FROM messages WHERE sender_ip = $1')) {
        const [ip] = params;
        // Simulate rate-limiting check by pulling all sent from IP in last 10 minutes
        const tenMinsAgo = Date.now() - 10 * 60 * 1000;
        const count = localDbData.messages.filter(m => m.sender_ip === ip && new Date(m.created_at).getTime() > tenMinsAgo).length;
        return { rows: [{ count: count.toString() }] };
    }
    // 12. UPDATE users
    if (normalizedSql.startsWith('UPDATE users SET is_phone_verified = 1')) {
        const [userId] = params;
        const idx = localDbData.users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            localDbData.users[idx].is_phone_verified = 1;
            saveJsonDb();
        }
        return { rows: [] };
    }
    if (normalizedSql.startsWith("UPDATE users SET plan = 'premium'")) {
        const [userId] = params;
        const idx = localDbData.users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            localDbData.users[idx].plan = 'premium';
            saveJsonDb();
        }
        return { rows: [] };
    }
    // 13. UPDATE verification_codes
    if (normalizedSql.startsWith('UPDATE verification_codes SET is_used = 1 WHERE id = $1')) {
        const [id] = params;
        const idx = localDbData.verification_codes.findIndex(vc => vc.id === id);
        if (idx !== -1) {
            localDbData.verification_codes[idx].is_used = 1;
            saveJsonDb();
        }
        return { rows: [] };
    }
    if (normalizedSql.startsWith('UPDATE verification_codes SET is_used = 1 WHERE user_id = $1 AND type = $2')) {
        const [userId, type] = params;
        localDbData.verification_codes.forEach((vc, index) => {
            if (vc.user_id === userId && vc.type === type) {
                localDbData.verification_codes[index].is_used = 1;
            }
        });
        saveJsonDb();
        return { rows: [] };
    }
    // 14. UPDATE vehicles
    if (normalizedSql.startsWith('UPDATE vehicles SET plate = $1')) {
        const [plate, brand, model, color, country, id] = params;
        const idx = localDbData.vehicles.findIndex(v => v.id === id);
        if (idx !== -1) {
            localDbData.vehicles[idx] = {
                ...localDbData.vehicles[idx],
                plate, brand, model, color, country,
                updated_at: new Date().toISOString()
            };
            saveJsonDb();
        }
        return { rows: [] };
    }
    // 15. UPDATE notification_settings
    if (normalizedSql.startsWith('UPDATE notification_settings SET whatsapp_enabled = $1')) {
        const [whatsapp, telegram, sms, push, email, telegram_chat_id, user_id] = params;
        const idx = localDbData.notification_settings.findIndex(ns => ns.user_id === user_id);
        if (idx !== -1) {
            localDbData.notification_settings[idx] = {
                ...localDbData.notification_settings[idx],
                whatsapp_enabled: whatsapp ? 1 : 0,
                telegram_enabled: telegram ? 1 : 0,
                sms_enabled: sms ? 1 : 0,
                push_enabled: push ? 1 : 0,
                email_enabled: email ? 1 : 0,
                telegram_chat_id: telegram_chat_id || null,
                updated_at: new Date().toISOString()
            };
            saveJsonDb();
        }
        return { rows: [] };
    }
    // 16. UPDATE messages status
    if (normalizedSql.startsWith('UPDATE messages SET status = $1 WHERE id = $2')) {
        const [status, id] = params;
        const idx = localDbData.messages.findIndex(m => m.id === id);
        if (idx !== -1) {
            localDbData.messages[idx].status = status;
            saveJsonDb();
        }
        return { rows: [] };
    }
    // 17. DELETE vehicles
    if (normalizedSql.startsWith('DELETE FROM vehicles WHERE id = $1')) {
        const [id] = params;
        localDbData.vehicles = localDbData.vehicles.filter(v => v.id !== id);
        saveJsonDb();
        return { rows: [] };
    }
    // 18. ADMIN stats queries
    if (normalizedSql.startsWith('SELECT COUNT(*) as count FROM users')) {
        return { rows: [{ count: localDbData.users.length.toString() }] };
    }
    if (normalizedSql.startsWith("SELECT COUNT(*) as count FROM users WHERE plan = 'premium'")) {
        const count = localDbData.users.filter(u => u.plan === 'premium').length;
        return { rows: [{ count: count.toString() }] };
    }
    if (normalizedSql.startsWith('SELECT COUNT(*) as count FROM vehicles')) {
        return { rows: [{ count: localDbData.vehicles.length.toString() }] };
    }
    if (normalizedSql.startsWith('SELECT COUNT(*) as count FROM messages')) {
        return { rows: [{ count: localDbData.messages.length.toString() }] };
    }
    if (normalizedSql.startsWith("SELECT COUNT(*) as count FROM abuse_reports WHERE status = 'pending'")) {
        const count = localDbData.abuse_reports.filter(ar => ar.status === 'pending').length;
        return { rows: [{ count: count.toString() }] };
    }
    // 19. ADMIN listings
    if (normalizedSql.startsWith('SELECT id, email, phone, role, plan, is_phone_verified, created_at FROM users ORDER BY created_at DESC')) {
        const sorted = [...localDbData.users].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { rows: sorted };
    }
    if (normalizedSql.includes('SELECT v.*, u.email as owner_email')) {
        const joined = localDbData.vehicles.map(v => {
            const owner = localDbData.users.find(u => u.id === v.user_id);
            return {
                ...v,
                owner_email: owner ? owner.email : 'Unknown',
                owner_phone: owner ? owner.phone : 'Unknown'
            };
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { rows: joined };
    }
    if (normalizedSql.includes('SELECT m.*, v.plate')) {
        const joined = localDbData.messages.map(m => {
            const vehicle = localDbData.vehicles.find(v => v.id === m.vehicle_id);
            const owner = vehicle ? localDbData.users.find(u => u.id === vehicle.user_id) : null;
            return {
                ...m,
                plate: vehicle ? vehicle.plate : 'Unknown',
                brand: vehicle ? vehicle.brand : 'Unknown',
                model: vehicle ? vehicle.model : 'Unknown',
                owner_email: owner ? owner.email : 'Unknown'
            };
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { rows: joined };
    }
    if (normalizedSql.includes('SELECT ar.*, m.category')) {
        const joined = localDbData.abuse_reports.map(ar => {
            const msg = localDbData.messages.find(m => m.id === ar.message_id);
            const vehicle = msg ? localDbData.vehicles.find(v => v.id === msg.vehicle_id) : null;
            return {
                ...ar,
                category: msg ? msg.category : 'Unknown',
                sub_category: msg ? msg.sub_category : 'Unknown',
                custom_text: msg ? msg.custom_text : 'Unknown',
                plate: vehicle ? vehicle.plate : 'Unknown'
            };
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return { rows: joined };
    }
    if (normalizedSql.startsWith('UPDATE abuse_reports SET status = $1 WHERE id = $2')) {
        const [status, id] = params;
        const idx = localDbData.abuse_reports.findIndex(ar => ar.id === id);
        if (idx !== -1) {
            localDbData.abuse_reports[idx].status = status;
            saveJsonDb();
        }
        return { rows: [] };
    }
    console.warn('[DB] SQL command unhandled in JSON Sim mode, returning empty rows:', sql);
    return { rows: [] };
}
/**
 * DB initialization. Creates dummy tables / seeds admin
 */
async function initDb() {
    if (exports.dbEngine === 'postgres') {
        // Standard PostgreSQL structure
        const schemaQueries = [
            `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        plan VARCHAR(20) DEFAULT 'free',
        is_phone_verified INTEGER DEFAULT 0,
        is_email_verified INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
            `CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        plate VARCHAR(50) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        color VARCHAR(50),
        country VARCHAR(100) DEFAULT 'Turkey',
        qr_uuid VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
            `CREATE TABLE IF NOT EXISTS notification_settings (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        whatsapp_enabled INTEGER DEFAULT 0,
        telegram_enabled INTEGER DEFAULT 0,
        sms_enabled INTEGER DEFAULT 0,
        push_enabled INTEGER DEFAULT 0,
        email_enabled INTEGER DEFAULT 1,
        telegram_chat_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
            `CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        vehicle_id VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(100),
        custom_text VARCHAR(500),
        location_lat DECIMAL(9,6),
        location_lng DECIMAL(9,6),
        sender_ip VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
            `CREATE TABLE IF NOT EXISTS verification_codes (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        code VARCHAR(10) NOT NULL,
        expires_at VARCHAR(100) NOT NULL,
        is_used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`,
            `CREATE TABLE IF NOT EXISTS abuse_reports (
        id VARCHAR(255) PRIMARY KEY,
        message_id VARCHAR(255),
        reporter_ip VARCHAR(50) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
        ];
        for (const q of schemaQueries) {
            await pgPool.query(q);
        }
    }
    // Seeding Admin user in JSON storage or PG
    const adminEmail = 'admin@qrvehicle.com';
    const checkAdmin = await query('SELECT * FROM users WHERE email = $1', [adminEmail]);
    if (checkAdmin.rows.length === 0) {
        const adminId = 'admin-uuid-0000-0000-000000000000';
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('admin123', salt);
        await query(`INSERT INTO users (id, email, phone, password_hash, role, plan, is_phone_verified, is_email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [adminId, adminEmail, '+905555555555', hash, 'admin', 'premium', 1, 1]);
        await query(`INSERT INTO notification_settings (id, user_id, whatsapp_enabled, telegram_enabled, sms_enabled, push_enabled, email_enabled)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, ['settings-admin-uuid', adminId, 1, 1, 1, 1, 1]);
        console.log('[DB] Admin user seeded: admin@qrvehicle.com / admin123');
    }
    console.log('[DB] Database system initialized successfully!');
}
