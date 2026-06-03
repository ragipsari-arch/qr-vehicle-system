import { query } from '../config/db';

export interface NotificationPayload {
  ownerPhone: string;
  ownerEmail: string;
  plate: string;
  brand: string;
  model: string;
  category: string;
  subCategory: string | null;
  customText: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  telegramChatId?: string | null;
  settings: {
    whatsapp_enabled: boolean;
    telegram_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
    email_enabled: boolean;
  };
}

// In memory notification log for the simulation overlay
export const notificationSimulatorLogs: any[] = [];

export function getSimulatorLogs() {
  return notificationSimulatorLogs;
}

export function clearSimulatorLogs() {
  notificationSimulatorLogs.length = 0;
}

/**
 * Main dispatcher for sending notifications to various channels
 */
export async function sendNotification(payload: NotificationPayload): Promise<{ success: boolean; channels: string[] }> {
  const sentChannels: string[] = [];
  const timestamp = new Date().toISOString();

  // Create human-friendly messages
  const categoryTitles: Record<string, string> = {
    incorrect_park: '⚠️ Hatalı Park Bildirimi / Parking Incident',
    danger: '🔥 Araçta Tehlike Var / Vehicle Danger',
    accident: '💥 Kaza Durumu / Accident Report',
    emergency: '🚨 Acil Durum Uyarısı / Emergency Alert',
    custom: '✉️ Acil Özel Mesaj / Urgent Custom Message'
  };

  const subCategoryTitles: Record<string, string> = {
    road_blocked: 'Yol çıkışı kapalı (Road blocked)',
    garage_blocked: 'Garaj önü kapalı (Garage entrance blocked)',
    double_parked: 'Çift sıra park (Double parked)',
    emergency_exit: 'Acil çıkış engelli (Emergency exit blocked)',
    blocking_traffic: 'Trafiği engelliyor (Blocking traffic)',
    headlights_on: 'Farlar açık kaldı (Headlights left on)',
    window_open: 'Cam açık (Window open)',
    door_open: 'Kapı açık (Door open)',
    flat_tire: 'Lastik patlak (Flat tire)',
    being_towed: 'Araç çekiliyor (Vehicle being towed)',
    scratched: 'Araca çarpıldı (Vehicle was hit)',
    damage: 'Maddi hasar oluştu (Property damage occurred)',
    witness: 'Tanık bilgisi bırakmak istiyorum (Want to leave witness info)',
    fire_engine: 'Yangın var, itfaiye geçemiyor (Fire alert, fire engine blocked)',
    ambulance: 'Hasta var, ambulans geçemiyor (Medical alert, ambulance blocked)',
    police: 'Acil durum, polis geçemiyor (Emergency alert, police blocked)'
  };

  const categoryTitle = categoryTitles[payload.category] || payload.category;
  const subCategoryTitle = payload.subCategory ? (subCategoryTitles[payload.subCategory] || payload.subCategory) : 'Belirtilmedi';

  // Build SMS / WhatsApp / Telegram Message text
  let alertMessage = `[QR Araç İletişim] Aracınızla İlgili Acil Durum!\n`;
  alertMessage += `Plaka: ${payload.plate}\n`;
  alertMessage += `Durum: ${categoryTitle}\n`;
  if (payload.subCategory) alertMessage += `Ayrıntı: ${subCategoryTitle}\n`;
  if (payload.customText) alertMessage += `Mesaj: "${payload.customText}"\n`;
  if (payload.locationLat && payload.locationLng) {
    alertMessage += `Konum: https://www.google.com/maps/search/?api=1&query=${payload.locationLat},${payload.locationLng}\n`;
  }
  alertMessage += `Zaman: ${new Date().toLocaleTimeString('tr-TR')}`;

  // Log details
  const logEntry = {
    timestamp,
    plate: payload.plate,
    category: payload.category,
    message: alertMessage,
    channels: [] as string[]
  };

  // 1. Email Channel
  if (payload.settings.email_enabled) {
    console.log(`[Email Service] Sending mail to ${payload.ownerEmail}...\nContent:\n${alertMessage}`);
    logEntry.channels.push('email');
    sentChannels.push('email');
  }

  // 2. Telegram Channel (Can connect to real Telegram Bot)
  if (payload.settings.telegram_enabled && payload.telegramChatId) {
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    if (tgToken) {
      try {
        const fetch = require('node-fetch'); // Standard global fetch in modern node, or we can use custom fetch or standard http module
        const response = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: payload.telegramChatId,
            text: alertMessage
          })
        });
        const result = await response.json();
        if (result.ok) {
          console.log(`[Telegram Service] Message successfully sent to Chat ID ${payload.telegramChatId}`);
          logEntry.channels.push('telegram (real)');
          sentChannels.push('telegram');
        } else {
          console.error(`[Telegram Service] Telegram API Error:`, result.description);
          logEntry.channels.push('telegram (failed: ' + result.description + ')');
        }
      } catch (err: any) {
        console.error(`[Telegram Service] Error connecting to Telegram API:`, err.message);
        logEntry.channels.push('telegram (error: connection failed)');
      }
    } else {
      console.log(`[Telegram Simulator] Sending to Chat ID ${payload.telegramChatId}...\nContent:\n${alertMessage}`);
      logEntry.channels.push('telegram (simulated)');
      sentChannels.push('telegram');
    }
  }

  // 3. WhatsApp Channel
  if (payload.settings.whatsapp_enabled) {
    // Simulated WhatsApp API trigger
    console.log(`[WhatsApp Service] Sending WA message to ${payload.ownerPhone}...\nContent:\n${alertMessage}`);
    logEntry.channels.push('whatsapp');
    sentChannels.push('whatsapp');
  }

  // 4. SMS Channel
  if (payload.settings.sms_enabled) {
    console.log(`[SMS Service] Sending SMS to ${payload.ownerPhone}...\nContent:\n${alertMessage}`);
    logEntry.channels.push('sms');
    sentChannels.push('sms');
  }

  // 5. Push Notifications Channel
  if (payload.settings.push_enabled) {
    console.log(`[Push Notification Service] Pushing notification to subscriber...\nContent:\n${alertMessage}`);
    logEntry.channels.push('push');
    sentChannels.push('push');
  }

  // Store in simulator logs
  notificationSimulatorLogs.unshift({
    id: Math.random().toString(36).substring(2, 9),
    ...logEntry
  });

  // Limit simulator logs size to 50
  if (notificationSimulatorLogs.length > 50) {
    notificationSimulatorLogs.pop();
  }

  return { success: true, channels: sentChannels };
}
