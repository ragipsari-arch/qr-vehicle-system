# QR Emergency Vehicle Contact System (QR Acil Araç İletişim Sistemi)

Welcome to the **QR Emergency Vehicle Contact System** codebase. This is a secure, GDPR/KVKK-compliant, multilingual, mobile-first dynamic QR communication platform. It allows third parties to scan a vehicle's QR code and notify the owner in case of incorrect parking, hazards, or accidents, completely preserving the owner's personal data anonymity.

---

## 🚀 Key Features

* **Multi-lingual Support**: English, Azerbaijani, Turkish, Russian, and Arabic (includes full RTL layout support). Automatic browser detection + user toggle.
* **100% GDPR/KVKK Anonymity**: Absolutely zero personal info (name, email, phone) is exposed to the scanner.
* **Smart Spam Protection**: Mathematical captcha verification + IP rate limiter.
* **Interactive Live Simulator**: A built-in developer-mode phone simulator interface to inspect mock WhatsApp, Telegram, SMS, and Email alert contents in real-time.
* **Pluggable Database Adapter**: Built-in automated local SQLite/JSON storage for zero-dependency local runs + instant switch to production **PostgreSQL**.
* **PWA Enabled**: Installable on Android and iOS devices.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, PWA.
* **Backend**: Node.js, Express, JWT, bcryptjs, TypeScript.
* **Database**: PostgreSQL (production) / Pure JS JSON DB (local fallback).
* **DevOps**: Docker, Nginx, Docker Compose.

---

## 🗂️ Project Structure

```
qr-vehicle-system/
├── docker-compose.yml       # Production microservice orchestrator
├── backend/
│   ├── src/
│   │   ├── config/          # Unified Database connector & schema
│   │   ├── middleware/      # Auth & role-check middleware
│   │   ├── routes/          # API Route definitions (Auth, Vehicle, Settings, Scan, Admin)
│   │   ├── services/        # Notification dispatch engine
│   │   └── app.ts           # Express Application server
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── components/      # UI Blocks
    │   ├── i18n/            # Multi-lingual translations
    │   ├── App.tsx          # Main React Views & Simulator
    │   ├── main.tsx         # client entrypoint
    │   └── index.css        # Glassmorphic themes & scrollbar overrides
    ├── package.json
    ├── tailwind.config.js
    ├── index.html
    └── Dockerfile
```

---

## 💻 Local Quick Start Guide (Testing)

No external databases or costly SMS/WhatsApp API setup are required.

### 1. Start the Backend API
Navigate to `/backend` and install dependencies:
```bash
cd backend
npm install
npm run dev
```
* **DB**: System will auto-create `qr_vehicle_system_db.json` database.
* **Admin Login**: Seeded credentials are `admin@qrvehicle.com` / `admin123`.

### 2. Start the Frontend Application
In a separate terminal, navigate to `/frontend` and run Vite:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 📱 How to Test (Local Flow)

1. **Sign Up**: Register a new user at `http://localhost:5173`.
2. **OTP Verification**: The system will print your 6-digit confirmation code in the **backend terminal log**. Enter it in the UI to confirm.
3. **Add Vehicle**: Click "Add Vehicle" in your dashboard (e.g., Plate: `34 ABC 123`).
4. **Scan QR**: Click the **"QR Kodunu Tara"** button on the vehicle card. This will open the public QR view simulating a scanner.
5. **Interactive Simulator**: Make sure the **"📱 Bildirim Simülatörü"** overlay widget is opened (bottom right of the screen).
6. **Send Alert**: On the scanner page, click "Incorrect Parking -> Garage Blocked", answer the simple mathematical security math captcha, and click **"Dispatch Alert"**.
7. **Verify**: Inspect the smartphone simulator widget. You'll see the exact mock WhatsApp, Telegram, SMS, and Email alert logs populated instantly!

---

## 📡 API Reference Documentations

### Public APIs
* `GET /api/public/vehicles/:qr_uuid` - Returns vehicle info (plate, brand, model, color, country) + mathematical captcha challenge.
* `POST /api/public/vehicles/:qr_uuid/notify` - Dispatches message. Returns channels triggered.
* `GET /api/public/simulator/logs` - Fetch logs for simulator widget.

### Protected APIs (Requires header `Authorization: Bearer <JWT>`)
* `POST /api/auth/register` - Create owner account.
* `POST /api/auth/login` - Authenticate owner, return token.
* `GET /api/vehicles` - List owner's vehicles.
* `POST /api/vehicles` - Register new vehicle.
* `PUT /api/settings` - Toggle notification channels (Telegram Chat ID integration).
* `POST /api/settings/upgrade` - Upgrades user plan instantly to Premium for testing.

---

## 🐳 Docker Production Deployment

To package and deploy the entire microservices array:
```bash
docker-compose up --build -d
```
* **Frontend**: `http://localhost`
* **Backend API**: `http://localhost/api`
* **Nginx**: Serves built React package and proxies API queries to Node container automatically.
