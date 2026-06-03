export type Language = 'az' | 'tr' | 'en' | 'ru' | 'ar';

export const translations: Record<Language, Record<string, string>> = {
  az: {
    appName: "QR Təcili Əlaqə",
    tagline: "Şəxsi məlumatlarınızı gizli saxlayaraq avtomobilinizlə əlaqəli təcili hallarda xəbərdar olun.",
    startFree: "Pulsuz Başla",
    dashboard: "İdarəetmə Paneli",
    logout: "Çıxış",
    login: "Daxil Ol",
    register: "Qeydiyyat",
    loading: "Yüklənir...",
    success: "Uğurlu!",
    error: "Xəta baş verdi",
    save: "Yadda Saxla",
    delete: "Sil",
    cancel: "Ləğv Et",
    edit: "Düzəliş Et",
    
    // Landing
    heroTitle: "Nömrənizi Paylaşmadan",
    heroSubtitle: "Avtomobiliniz üçün Təhlükəsiz QR Əlaqə",
    howItWorks: "Necə Çalışır?",
    step1: "Qeydiyyatdan Keçin",
    step1Desc: "Saniyələr içində hesab yaradın və avtomobilinizi əlavə edin.",
    step2: "QR Kodunuzu Alın",
    step2Desc: "Avtomatik yaradılmış dinamik QR kodunuzu çap edib şüşəyə yapışdırın.",
    step3: "Təhlükəsiz Əlaqə",
    step3Desc: "Hər hansı bir problem olduqda, nömrəniz görünmədən dərhal bildiriş alın.",
    
    pricing: "Tariflər",
    freePlan: "Pulsuz Paket",
    freeDesc: "Tək avtomobil üçün əla başlanğıc",
    premiumPlan: "Premium Paket",
    premiumDesc: "Sərhədsiz imkanlar və anında çoxşaxəli bildirişlər",
    activePlan: "Aktiv Paket",
    upgradeToPremium: "Premium-a Keç",
    pricingFreePrice: "Pulsuz",
    pricingPremiumPrice: "Aylıq 49 ₺",
    unlimitedCars: "Sonsuz sayda avtomobil",
    oneCarLimit: "1 Avtomobil limiti",
    emailNotificationOnly: "Yalnız E-poçt bildirişləri",
    allNotificationChannels: "WhatsApp, Telegram, SMS və E-poçt",
    locationSharing: "Mövqe (GPS) paylaşımı",
    prioritySupport: "Prioritet dəstək",
    
    // Auth
    email: "E-poçt",
    phone: "Telefon nömrəsi",
    password: "Şifrə",
    haveAccount: "Hesabınız var? Daxil olun",
    noAccount: "Hesabınız yoxdur? Qeydiyyatdan keçin",
    verifyOTP: "OTP Təsdiqi",
    enterOTP: "Telefonunuza göndərilən 6 rəqəmli kodu daxil edin:",
    verify: "Təsdiqlə",
    resendOTP: "Kodu Yenidən Göndər",
    otpHint: "(Simulyator: Kod backend terminalında çap edilib!)",

    // Dashboard
    myVehicles: "Mənim Avtomobillərim",
    addVehicle: "Avtomobil Əlavə Et",
    plate: "Dövlət Nömrə Nişanı (Plaka)",
    brand: "Marka",
    model: "Model",
    color: "Rəng",
    country: "Ölkə",
    viewQR: "QR Kod",
    noVehicles: "Hələ avtomobil əlavə edilməyib.",
    channelPreferences: "Bildiriş Kanalları Ayarları",
    whatsappToggle: "WhatsApp Bildirişləri",
    telegramToggle: "Telegram Bildirişləri",
    smsToggle: "SMS Bildirişləri",
    emailToggle: "E-poçt Bildirişləri",
    telegramChatId: "Telegram Chat ID",
    telegramSetupInstructions: "Telegram bildirişlərini aktivləşdirmək üçün: Telegram-da @QRVehicleBot botunu tapın və /start əmrini göndərərək Chat ID-nizi buraya yazın.",
    
    // Public Scan Page
    scanTitle: "Avtomobil Sahibi ilə Əlaqə",
    scanSubtitle: "Aşağıdakı kateqoriyalardan birini seçərək sahibə dərhal təhlükəsiz bildiriş göndərə bilərsiniz.",
    vehicleDetails: "Nəqliyyat Vasitəsi Məlumatı",
    incorrectPark: "❌ Hatalı Park",
    danger: "🔥 Təhlükə Var",
    accident: "💥 Kaza Durumu",
    emergency: "🚨 Təcili Durum",
    customMessage: "✉️ Təcili Mesaj Göndər",
    captchaTitle: "Təhlükəsizlik Yoxlanışı (Spam Qorunması)",
    sendAlert: "Bildiriş Göndər",
    locationChecked: "Mövqeyi paylaş (Premium sahiblər üçün GPS)",
    
    // Options Incorrect Park
    road_blocked: "Yol çıxışı qapalı",
    garage_blocked: "Qaraj önü qapalı",
    double_parked: "İkinci cərgə park",
    emergency_exit: "Təcili çıxış bağlanıb",
    blocking_traffic: "Nəqliyyatın hərəkətinə mane olur",
    
    // Options Danger
    headlights_on: "Farlar açıq qalıb",
    window_open: "Şüşə açıqdır",
    door_open: "Qapı açıqdır",
    flat_tire: "Təkər partlayıb/enib",
    being_towed: "Avtomobil evakuasiya olunur",
    
    // Options Accident
    scratched: "Avtomobilə toxunublar / Vurublar",
    damage: "Maddi zərər var",
    witness: "Şahid məlumatı buraxmaq istəyirəm",
    fire_engine: "Yanğın var, itfaiye keçə bilmir",
    ambulance: "Xəstə var, ambulans keçə bilmir",
    police: "Təcili durum, polis keçə bilmir",
    
    // Admin Panel
    adminPanel: "Admin Panel",
    statsUsers: "Ümumi İstifadəçi",
    statsVehicles: "Ümumi Avtomobil",
    statsMessages: "Göndərilən Mesaj",
    statsPremium: "Premium Nisbəti",
    statsReports: "Şikayətlər",
    userEmail: "İstifadəçi E-poçtu",
    userRole: "Rol",
    userPlan: "Tarif",
    userVerified: "Təsdiqlənib",
    adminUsersTab: "İstifadəçilər",
    adminVehiclesTab: "Avtomobillər",
    adminMessagesTab: "Mesaj Tarixçəsi",
    adminReportsTab: "Şikayətlər",
    senderIp: "Göndərən IP",
    status: "Status"
  },
  tr: {
    appName: "QR Acil İletişim",
    tagline: "Kişisel bilgilerinizi koruyarak, aracınızla ilgili acil durumlarda güvenle bildirim alın.",
    startFree: "Ücretsiz Başla",
    dashboard: "İdare Paneli",
    logout: "Çıkış Yap",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    loading: "Yükleniyor...",
    success: "Başarılı!",
    error: "Bir hata oluştu",
    save: "Kaydet",
    delete: "Sil",
    cancel: "İptal",
    edit: "Düzenle",
    
    // Landing
    heroTitle: "Numaranızı Paylaşmadan",
    heroSubtitle: "Aracınız İçin Güvenli QR İletişim",
    howItWorks: "Nasıl Çalışır?",
    step1: "Hesap Oluşturun",
    step1Desc: "Saniyeler içinde kayıt olun ve araç bilgilerinizi sisteme ekleyin.",
    step2: "QR Kodunu Alın",
    step2Desc: "Otomatik üretilen dinamik QR kodunuzu bastırıp aracınızın camına yapıştırın.",
    step3: "Güvenle İletişim",
    step3Desc: "Herhangi bir acil durumda üçüncü şahıslar numaranızı görmeden size anında ulaşsın.",
    
    pricing: "Fiyatlandırma",
    freePlan: "Ücretsiz Paket",
    freeDesc: "Tek araç için harika bir başlangıç",
    premiumPlan: "Premium Paket",
    premiumDesc: "Sınırsız özgürlük ve anında çoklu kanal bildirimleri",
    activePlan: "Aktif Paket",
    upgradeToPremium: "Premium'a Yükselt",
    pricingFreePrice: "Ücretsiz",
    pricingPremiumPrice: "Aylık 49 ₺",
    unlimitedCars: "Sınırsız araç ekleme",
    oneCarLimit: "1 Araç limiti",
    emailNotificationOnly: "Sadece E-posta bildirimi",
    allNotificationChannels: "WhatsApp, Telegram, SMS ve E-posta",
    locationSharing: "Konum (GPS) paylaşımı",
    prioritySupport: "Öncelikli destek",
    
    // Auth
    email: "E-posta",
    phone: "Telefon Numarası",
    password: "Şifre",
    haveAccount: "Zaten üye misiniz? Giriş yapın",
    noAccount: "Üyeliğiniz yok mu? Kayıt olun",
    verifyOTP: "OTP Doğrulama",
    enterOTP: "Telefonunuza gönderilen 6 haneli doğrulama kodunu girin:",
    verify: "Doğrula",
    resendOTP: "Kodu Yeniden Gönder",
    otpHint: "(Simülatör: Kod backend terminalinde yazdırılmıştır!)",

    // Dashboard
    myVehicles: "Araçlarım",
    addVehicle: "Araç Ekle",
    plate: "Plaka",
    brand: "Marka",
    model: "Model",
    color: "Renk",
    country: "Ülke",
    viewQR: "QR Kodu",
    noVehicles: "Henüz araç eklemediniz.",
    channelPreferences: "Bildirim Kanalları Tercihi",
    whatsappToggle: "WhatsApp Bildirimleri",
    telegramToggle: "Telegram Bildirişleri",
    smsToggle: "SMS Bildirimleri",
    emailToggle: "E-posta Bildirimleri",
    telegramChatId: "Telegram Chat ID",
    telegramSetupInstructions: "Telegram bildirimlerini almak için: Telegram'da @QRVehicleBot botunu aratın, /start gönderin ve size verilen Chat ID'yi buraya girin.",
    
    // Public Scan Page
    scanTitle: "Araç Sahibiyle İletişim",
    scanSubtitle: "Aşağıdaki acil durum kategorilerinden birini seçerek sahibe güvenli bildirim gönderin.",
    vehicleDetails: "Araç Bilgileri",
    incorrectPark: "❌ Hatalı Park",
    danger: "🔥 Araçta Tehlike Var",
    accident: "💥 Kaza Durumu",
    emergency: "🚨 Acil Durum",
    customMessage: "✉️ Acil Mesaj Gönder",
    captchaTitle: "Güvenlik Doğrulaması (Spam Koruması)",
    sendAlert: "Bildirimi Gönder",
    locationChecked: "Konumumu paylaş (Premium sahiplere GPS iletilir)",
    
    // Options Incorrect Park
    road_blocked: "Yol çıkışı kapalı",
    garage_blocked: "Garaj önü kapalı",
    double_parked: "Çift sıra park",
    emergency_exit: "Acil çıkış engelli",
    blocking_traffic: "Trafiği engelliyor",
    
    // Options Danger
    headlights_on: "Farlar açık kaldı",
    window_open: "Cam açık",
    door_open: "Kapı açık",
    flat_tire: "Lastik patlak",
    being_towed: "Araç çekiliyor",
    
    // Options Accident
    scratched: "Araca çarpıldı",
    damage: "Maddi hasar oluştu",
    witness: "Tanık bilgisi bırakmak istiyorum",
    fire_engine: "Yangın var, itfaiye geçemiyor",
    ambulance: "Hasta var, ambulans geçemiyor",
    police: "Acil durum, polis geçemiyor",
    
    // Admin Panel
    adminPanel: "Yönetim Paneli",
    statsUsers: "Toplam Kullanıcı",
    statsVehicles: "Toplam Araç",
    statsMessages: "Gönderilen Mesaj",
    statsPremium: "Premium Oranı",
    statsReports: "İhlal İhbarları",
    userEmail: "Kullanıcı E-postası",
    userRole: "Rol",
    userPlan: "Paket",
    userVerified: "Onaylı",
    adminUsersTab: "Kullanıcılar",
    adminVehiclesTab: "Araçlar",
    adminMessagesTab: "Mesaj Geçmişi",
    adminReportsTab: "İhbarlar",
    senderIp: "Gönderen IP",
    status: "Durum"
  },
  en: {
    appName: "QR Emergency Contact",
    tagline: "Keep your personal data safe and receive instant alerts about your vehicle.",
    startFree: "Start Free",
    dashboard: "Dashboard",
    logout: "Log Out",
    login: "Log In",
    register: "Register",
    loading: "Loading...",
    success: "Success!",
    error: "An error occurred",
    save: "Save",
    delete: "Delete",
    cancel: "Cancel",
    edit: "Edit",
    
    // Landing
    heroTitle: "Without Sharing Your Phone",
    heroSubtitle: "Secure QR Contact System for Vehicles",
    howItWorks: "How It Works",
    step1: "Create an Account",
    step1Desc: "Sign up in seconds and input your vehicle information.",
    step2: "Place the QR Code",
    step2Desc: "Print the automatically generated dynamic QR and place it on your window.",
    step3: "Receive Alerts",
    step3Desc: "If there's an emergency, third parties can alert you without seeing your phone.",
    
    pricing: "Pricing Plans",
    freePlan: "Free Tier",
    freeDesc: "A great start for one single vehicle",
    premiumPlan: "Premium Tier",
    premiumDesc: "Unlimited freedom and multi-channel instant alerts",
    activePlan: "Active Plan",
    upgradeToPremium: "Upgrade to Premium",
    pricingFreePrice: "Free",
    pricingPremiumPrice: "$1.99 / mo",
    unlimitedCars: "Add unlimited vehicles",
    oneCarLimit: "1 Vehicle limit",
    emailNotificationOnly: "Email notifications only",
    allNotificationChannels: "WhatsApp, Telegram, SMS & Email",
    locationSharing: "GPS Location sharing",
    prioritySupport: "Priority support",
    
    // Auth
    email: "Email",
    phone: "Phone Number",
    password: "Password",
    haveAccount: "Already have an account? Log in",
    noAccount: "Don't have an account? Sign up",
    verifyOTP: "Verify OTP",
    enterOTP: "Enter the 6-digit code sent to your phone:",
    verify: "Verify",
    resendOTP: "Resend Code",
    otpHint: "(Simulator: Code is printed in backend terminal!)",

    // Dashboard
    myVehicles: "My Vehicles",
    addVehicle: "Add Vehicle",
    plate: "License Plate",
    brand: "Brand",
    model: "Model",
    color: "Color",
    country: "Country",
    viewQR: "QR Code",
    noVehicles: "No vehicles registered yet.",
    channelPreferences: "Notification Channels",
    whatsappToggle: "WhatsApp Alerts",
    telegramToggle: "Telegram Alerts",
    smsToggle: "SMS Alerts",
    emailToggle: "Email Alerts",
    telegramChatId: "Telegram Chat ID",
    telegramSetupInstructions: "To configure Telegram: Search for @QRVehicleBot on Telegram, send /start, and input your given Chat ID here.",
    
    // Public Scan Page
    scanTitle: "Contact Vehicle Owner",
    scanSubtitle: "Select an emergency category below to safely and anonymously alert the owner.",
    vehicleDetails: "Vehicle Specifications",
    incorrectPark: "❌ Bad Parking",
    danger: "🔥 Hazard/Danger",
    accident: "💥 Accident Status",
    emergency: "🚨 Emergency Alert",
    customMessage: "✉️ Send Custom Alert",
    captchaTitle: "Security Check (Anti-Spam)",
    sendAlert: "Dispatch Alert",
    locationChecked: "Share GPS location (transferred to Premium owners)",
    
    // Options Incorrect Park
    road_blocked: "Road exit blocked",
    garage_blocked: "Garage front blocked",
    double_parked: "Double parked",
    emergency_exit: "Emergency exit blocked",
    blocking_traffic: "Blocking traffic flow",
    
    // Options Danger
    headlights_on: "Headlights left on",
    window_open: "Window left open",
    door_open: "Door left open",
    flat_tire: "Flat tire detected",
    being_towed: "Vehicle being towed",
    
    // Options Accident
    scratched: "Vehicle got hit",
    damage: "Property damage occurred",
    witness: "I want to leave witness info",
    fire_engine: "Fire alert, fire engine cannot pass",
    ambulance: "Medical emergency, ambulance cannot pass",
    police: "Emergency, police cannot pass",
    
    // Admin Panel
    adminPanel: "Admin Panel",
    statsUsers: "Total Users",
    statsVehicles: "Total Vehicles",
    statsMessages: "Messages Sent",
    statsPremium: "Premium Ratio",
    statsReports: "Abuse Flags",
    userEmail: "User Email",
    userRole: "Role",
    userPlan: "Plan",
    userVerified: "Verified",
    adminUsersTab: "Users",
    adminVehiclesTab: "Vehicles",
    adminMessagesTab: "Messages Log",
    adminReportsTab: "Abuse Flags",
    senderIp: "Sender IP",
    status: "Status"
  },
  ru: {
    appName: "QR Экстренная Связь",
    tagline: "Сохраняйте свои личные данные в безопасности и получайте мгновенные оповещения о вашем автомобиле.",
    startFree: "Начать бесплатно",
    dashboard: "Личный Кабинет",
    logout: "Выйти",
    login: "Войти",
    register: "Регистрация",
    loading: "Загрузка...",
    success: "Успешно!",
    error: "Произошла ошибка",
    save: "Сохранить",
    delete: "Удалить",
    cancel: "Отмена",
    edit: "Редактировать",
    
    // Landing
    heroTitle: "Без Обмена Номерами",
    heroSubtitle: "Безопасная Связь по QR для Автомобилей",
    howItWorks: "Как это работает?",
    step1: "Создайте Аккаунт",
    step1Desc: "Зарегистрируйтесь за секунды и добавьте характеристики вашего автомобиля.",
    step2: "Разместите QR-Код",
    step2Desc: "Распечатайте сгенерированный динамический QR-код и наклейте на лобовое стекло.",
    step3: "Получайте Уведомления",
    step3Desc: "В экстренной ситуации люди отправят вам сигнал, не видя вашего телефона.",
    
    pricing: "Тарифные Планы",
    freePlan: "Бесплатный Тариф",
    freeDesc: "Отличный старт для одного автомобиля",
    premiumPlan: "Премиум Тариф",
    premiumDesc: "Полная свобода и моментальные оповещения по всем каналам",
    activePlan: "Активный Тариф",
    upgradeToPremium: "Перейти на Премиум",
    pricingFreePrice: "Бесплатно",
    pricingPremiumPrice: "150 ₽ / мес",
    unlimitedCars: "Добавление неограниченного числа авто",
    oneCarLimit: "Лимит на 1 автомобиль",
    emailNotificationOnly: "Только Email-уведомления",
    allNotificationChannels: "WhatsApp, Telegram, SMS и Email",
    locationSharing: "Передача GPS-координат",
    prioritySupport: "Приоритетная поддержка",
    
    // Auth
    email: "Электронная почта",
    phone: "Номер телефона",
    password: "Пароль",
    haveAccount: "Уже зарегистрированы? Войти",
    noAccount: "Нет учетной записи? Регистрация",
    verifyOTP: "Подтверждение OTP",
    enterOTP: "Введите 6-значный код, отправленный на ваш телефон:",
    verify: "Подтвердить",
    resendOTP: "Отправить код еще раз",
    otpHint: "(Симулятор: Код напечатан в консоли бэкенда!)",

    // Dashboard
    myVehicles: "Мои Автомобили",
    addVehicle: "Добавить Автомобиль",
    plate: "Номерной знак",
    brand: "Марка",
    model: "Модель",
    color: "Цвет",
    country: "Страна",
    viewQR: "QR-Код",
    noVehicles: "У вас еще нет добавленных автомобилей.",
    channelPreferences: "Каналы Уведомлений",
    whatsappToggle: "Уведомления WhatsApp",
    telegramToggle: "Уведомления Telegram",
    smsToggle: "Уведомления SMS",
    emailToggle: "Уведомления Email",
    telegramChatId: "Telegram Chat ID",
    telegramSetupInstructions: "Для настройки Telegram: Найдите в Telegram бота @QRVehicleBot, отправьте /start и введите ваш Chat ID здесь.",
    
    // Public Scan Page
    scanTitle: "Связаться с Владельцем",
    scanSubtitle: "Выберите экстренную категорию ниже, чтобы анонимно отправить сообщение владельцу.",
    vehicleDetails: "Сведения об Автомобиле",
    incorrectPark: "❌ Неправильная парковка",
    danger: "🔥 Опасность / Поломка",
    accident: "💥 Аварийная Ситуация",
    emergency: "🚨 Экстренная Ситуация",
    customMessage: "✉️ Отправить Свое Сообщение",
    captchaTitle: "Проверка безопасности (Защита от спама)",
    sendAlert: "Отправить Оповещение",
    locationChecked: "Поделиться местоположением (доступно для Premium)",
    
    // Options Incorrect Park
    road_blocked: "Заблокирован выезд со двора/дороги",
    garage_blocked: "Заблокирован въезд в гараж",
    double_parked: "Второй ряд парковки",
    emergency_exit: "Заблокирован пожарный выход",
    blocking_traffic: "Препятствует движению транспорта",
    
    // Options Danger
    headlights_on: "Остались включенными фары",
    window_open: "Открыто окно",
    door_open: "Открыта дверь",
    flat_tire: "Спущено колесо",
    being_towed: "Машину эвакуируют",
    
    // Options Accident
    scratched: "Машину задели/поцарапали",
    damage: "Нанесен материальный ущерб",
    witness: "Я хочу оставить контакт свидетеля",
    fire_engine: "Пожар, пожарной машина не может проехать",
    ambulance: "Пациент, скорая помощь не может проехать",
    police: "Экстренный случай, полиция не может проехать",
    
    // Admin Panel
    adminPanel: "Панель Администратора",
    statsUsers: "Всего Пользователей",
    statsVehicles: "Всего Автомобилей",
    statsMessages: "Отправлено Оповещений",
    statsPremium: "Процент Премиума",
    statsReports: "Жалобы на спам",
    userEmail: "Email пользователя",
    userRole: "Роль",
    userPlan: "Тариф",
    userVerified: "Верифицирован",
    adminUsersTab: "Пользователи",
    adminVehiclesTab: "Автомобили",
    adminMessagesTab: "История сообщений",
    adminReportsTab: "Жалобы",
    senderIp: "IP отправителя",
    status: "Статус"
  },
  ar: {
    appName: "الاتصال الطارئ بالرمز QR",
    tagline: "حافظ على سرية بياناتك الشخصية وتلقى تنبيهات فورية وآمنة بشأن سيارتك.",
    startFree: "ابدأ مجاناً",
    dashboard: "لوحة التحكم",
    logout: "تسجيل الخروج",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    loading: "جاري التحميل...",
    success: "تم بنجاح!",
    error: "حدث خطأ ما",
    save: "حفظ",
    delete: "حذف",
    cancel: "إلغاء",
    edit: "تعديل",
    
    // Landing
    heroTitle: "دون مشاركة هاتفك",
    heroSubtitle: "نظام اتصال آمن بالرمز QR للمركبات",
    howItWorks: "كيف يعمل النظام؟",
    step1: "أنشئ حساباً",
    step1Desc: "سجل في ثوانٍ معدودة وأدخل معلومات سيارتك.",
    step2: "احصل على رمز QR",
    step2Desc: "اطبع رمز QR الديناميكي المولد تلقائياً وضعه على زجاج سيارتك.",
    step3: "تواصل آمن",
    step3Desc: "في الحالات الطارئة، يمكن للآخرين إرسال إشعار لك دون رؤية رقم هاتفك.",
    
    pricing: "خطط الأسعار",
    freePlan: "الباقة المجانية",
    freeDesc: "بداية ممتازة لسيارة واحدة فقط",
    premiumPlan: "الباقة المميزة",
    premiumDesc: "حرية غير محدودة وتنبيهات فورية عبر قنوات متعددة",
    activePlan: "الباقة النشطة",
    upgradeToPremium: "الترقية للمميزة",
    pricingFreePrice: "مجاني",
    pricingPremiumPrice: "49 ليرة / شهرياً",
    unlimitedCars: "إضافة سيارات غير محدودة",
    oneCarLimit: "حد سيارة واحدة",
    emailNotificationOnly: "إشعارات البريد الإلكتروني فقط",
    allNotificationChannels: "واتساب، تليجرام، رسائل نصية بريد إلكتروني",
    locationSharing: "مشاركة الموقع الجغرافي (GPS)",
    prioritySupport: "دعم فني ذو أولوية",
    
    // Auth
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    haveAccount: "هل لديك حساب بالفعل؟ سجل دخولك",
    noAccount: "ليس لديك حساب؟ أنشئ حساباً",
    verifyOTP: "التحقق من رمز OTP",
    enterOTP: "أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك:",
    verify: "تحقق",
    resendOTP: "إعادة إرسال الرمز",
    otpHint: "(محاكي: الرمز مطبوع في شاشة الخادم الخلفية!)",

    // Dashboard
    myVehicles: "مركباتي",
    addVehicle: "إضافة مركبة",
    plate: "لوحة السيارة",
    brand: "العلامة التجارية",
    model: "الطراز",
    color: "اللون",
    country: "البلد",
    viewQR: "رمز QR",
    noVehicles: "لم تقم بإضافة أي مركبة بعد.",
    channelPreferences: "قنوات التنبيه",
    whatsappToggle: "تنبيهات واتساب",
    telegramToggle: "تنبيهات تليجرام",
    smsToggle: "تنبيهات الرسائل القصيرة SMS",
    emailToggle: "تنبيهات البريد الإلكتروني",
    telegramChatId: "معرف Telegram Chat",
    telegramSetupInstructions: "لتفعيل تليجرام: ابحث عن البوت @QRVehicleBot في تليجرام، أرسل /start، وأدخل معرف الشات (Chat ID) هنا.",
    
    // Public Scan Page
    scanTitle: "الاتصال بمالك السيارة",
    scanSubtitle: "اختر فئة الطوارئ أدناه لإرسال تنبيه آمن وبشكل مجهول إلى المالك.",
    vehicleDetails: "معلومات المركبة",
    incorrectPark: "❌ وقوف خاطئ",
    danger: "🔥 خطر على السيارة",
    accident: "💥 حالة حادث",
    emergency: "🚨 حالة طوارئ",
    customMessage: "✉️ إرسال رسالة عاجلة",
    captchaTitle: "التحقق الأمني (حماية ضد البريد العشوائي)",
    sendAlert: "إرسال التنبيه",
    locationChecked: "مشاركة موقعي الجغرافي (يتم إرساله للمشتركين المميزين)",
    
    // Options Incorrect Park
    road_blocked: "مخرج الطريق مغلق",
    garage_blocked: "أمام المرآب مغلق",
    double_parked: "وقوف مزدوج (صف ثاني)",
    emergency_exit: "مخرج الطوارئ مغلق",
    blocking_traffic: "يعيق حركة المرور",
    
    // Options Danger
    headlights_on: "المصابيح الأمامية مضاءة",
    window_open: "النافذة مفتوحة",
    door_open: "الباب مفتوح",
    flat_tire: "إطار مثقوب / مسطح",
    being_towed: "السيارة تسحب",
    
    // Options Accident
    scratched: "السيارة تعرضت لضربة/احتكاك",
    damage: "حدوث أضرار مادية",
    witness: "أريد ترك معلومات كشاهد عيان",
    fire_engine: "يوجد حريق، سيارة الإطفاء لا تستطيع المرور",
    ambulance: "يوجد مريض، سيارة الإسعاف لا تستطيع المرور",
    police: "حالة طارئة، الشرطة لا تستطيع المرور",
    
    // Admin Panel
    adminPanel: "لوحة التحكم للمسؤول",
    statsUsers: "إجمالي المستخدمين",
    statsVehicles: "إجمالي المركبات",
    statsMessages: "الرسائل المرسلة",
    statsPremium: "نسبة المشتركين المميزين",
    statsReports: "التقارير والبلاغات",
    userEmail: "البريد الإلكتروني",
    userRole: "الدور",
    userPlan: "الباقة",
    userVerified: "مؤكد",
    adminUsersTab: "المستخدمين",
    adminVehiclesTab: "المركبات",
    adminMessagesTab: "سجل الرسائل",
    adminReportsTab: "البلاغات",
    senderIp: "عنوان IP للمرسل",
    status: "الحالة"
  }
};

/**
 * Hook or class to handle quick i18n translation
 */
export class TranslateManager {
  private static activeLang: Language = 'tr';

  public static init() {
    // Detect system / browser language
    try {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (['az', 'tr', 'en', 'ru', 'ar'].includes(browserLang)) {
        this.activeLang = browserLang as Language;
      }
    } catch {
      // Fallback
      this.activeLang = 'tr';
    }

    // Read stored language if exists
    const stored = localStorage.getItem('qr_vehicle_lang');
    if (stored && ['az', 'tr', 'en', 'ru', 'ar'].includes(stored)) {
      this.activeLang = stored as Language;
    }
  }

  public static getLang(): Language {
    return this.activeLang;
  }

  public static setLang(lang: Language) {
    this.activeLang = lang;
    localStorage.setItem('qr_vehicle_lang', lang);
    // Reload to apply RTL / LTR dynamically on document
    const isRtl = lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  public static t(key: string): string {
    const list = translations[this.activeLang] || translations['tr'];
    return list[key] || translations['en'][key] || key;
  }
}
