import React, { useState, useEffect } from 'react';
import { 
  QrCode, Car, LogOut, CheckCircle2, 
  Globe, Shield, Smartphone, ArrowRight, Bell, Lock, User, Plus, Trash2, 
  Check, AlertOctagon, RefreshCw, Layers, CreditCard, X
} from 'lucide-react';
import { TranslateManager, Language } from './i18n/translate';

// Global API Helper
const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('qr_vehicle_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  // Backend base URL
  const baseUrl = 'https://qr-vehicle-system-backend.vercel.app';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const res = await fetch(fullUrl, { ...options, headers });
  if (!res.ok) {
    throw new Error('ErrorData.error | API Error');
  }
  return res.json();
};
export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'admin'>('landing');
  const [scannerUuid, setScannerUuid] = useState<string | null>(null);
  
  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Global Language trigger state to force redraws
  const [lang, setLang] = useState<Language>(TranslateManager.getLang());

  // Init auth from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('qr_vehicle_user');
    const token = localStorage.getItem('qr_vehicle_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
      setCurrentView('dashboard');
    }

    // Direct routing for Scanner: /v/:uuid
    const path = window.location.pathname;
    if (path.startsWith('/v/')) {
      const uuid = path.substring(3);
      if (uuid) {
        setScannerUuid(uuid);
      }
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    TranslateManager.setLang(newLang);
    setLang(newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('qr_vehicle_user');
    localStorage.removeItem('qr_vehicle_token');
    setUser(null);
    setAuthToken(null);
    setCurrentView('landing');
    window.location.hash = '';
  };

  // Render core views
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Header / Navbar */}
      <header className="glass-panel sticky top-0 z-40 px-6 py-4 shadow-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            onClick={() => {
              if (scannerUuid) {
                // If scanner mode, keep user there or allow escaping
                window.location.pathname = '/';
              } else {
                setCurrentView(user ? 'dashboard' : 'landing');
              }
            }} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="bg-gradient-to-tr from-brand-turquoise to-brand-blue p-2.5 rounded-xl text-brand-navy shadow-lg shadow-brand-turquoise/20 group-hover:scale-105 transition-transform duration-300">
              <QrCode className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-brand-turquoise bg-clip-text text-transparent">
                {TranslateManager.t('appName')}
              </span>
              <span className="block text-[10px] text-brand-turquoise font-medium tracking-widest uppercase">
                Secure QR Vehicle Link
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector Dropdown */}
            <div className="relative group flex items-center bg-brand-navy-light px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-300">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-brand-turquoise" />
              <span className="uppercase font-semibold mr-1">{lang}</span>
              <select 
                value={lang} 
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              >
                <option value="tr">Türkçe (TR)</option>
                <option value="az">Azərbaycan (AZ)</option>
                <option value="en">English (EN)</option>
                <option value="ru">Русский (RU)</option>
                <option value="ar">العربية (AR)</option>
              </select>
            </div>

            {/* Auth Buttons */}
            {authToken ? (
              <div className="flex items-center space-x-3">
                {user?.role === 'admin' && currentView !== 'admin' && (
                  <button 
                    onClick={() => setCurrentView('admin')}
                    className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise/10 transition-colors text-xs font-bold"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}
                {currentView !== 'dashboard' && (
                  <button 
                    onClick={() => setCurrentView('dashboard')}
                    className="px-4 py-2 rounded-lg bg-brand-navy-light border border-white/10 hover:border-brand-turquoise/30 text-xs font-semibold text-gray-300 hover:text-white transition-all"
                  >
                    {TranslateManager.t('dashboard')}
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-xs font-semibold"
                  title={TranslateManager.t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{TranslateManager.t('logout')}</span>
                </button>
              </div>
            ) : (
              !scannerUuid && (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setCurrentView('login')}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    {TranslateManager.t('login')}
                  </button>
                  <button 
                    onClick={() => setCurrentView('register')}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy rounded-lg shadow-lg hover:shadow-brand-turquoise/20 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    {TranslateManager.t('register')}
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        {scannerUuid ? (
          <ScannerView uuid={scannerUuid} />
        ) : currentView === 'landing' ? (
          <LandingView setView={setCurrentView} />
        ) : currentView === 'login' ? (
          <LoginView setView={setCurrentView} onLoginSuccess={(u: any, t: string) => {
            setUser(u);
            setAuthToken(t);
            setCurrentView('dashboard');
          }} />
        ) : currentView === 'register' ? (
          <RegisterView setView={setCurrentView} />
        ) : currentView === 'dashboard' ? (
          <DashboardView user={user} setUser={setUser} />
        ) : currentView === 'admin' ? (
          <AdminView setView={setCurrentView} />
        ) : null}
      </main>

      {/* Interactive Developer Notification Simulator Overlay */}
      <NotificationSimulator />

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-brand-navy-darker text-center text-xs text-gray-500 max-w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {TranslateManager.t('appName')}. Tüm hakları saklıdır. (All rights reserved.)</p>
          <div className="flex space-x-6 text-[11px]">
            <a href="#" className="hover:text-brand-turquoise transition-colors">KVKK Aydınlatma Metni</a>
            <a href="#" className="hover:text-brand-turquoise transition-colors">GDPR Privacy Policy</a>
            <a href="#" className="hover:text-brand-turquoise transition-colors">Kullanıcı Sözleşmesi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   1. LANDING VIEW COMPONENT
   ========================================================================= */
function LandingView({ setView }: { setView: (v: any) => void }) {
  return (
    <div className="space-y-20 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-turquoise/10 text-brand-turquoise text-[11px] font-bold tracking-wider uppercase border border-brand-turquoise/20">
          <Shield className="w-3.5 h-3.5 animate-pulse" />
          <span>%100 Kişisel Bilgi Güvenliği (KVKK & GDPR)</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          <span className="block text-gray-300 font-light">{TranslateManager.t('heroTitle')}</span>
          <span className="block bg-gradient-to-r from-white via-brand-turquoise to-brand-blue bg-clip-text text-transparent font-black mt-2">
            {TranslateManager.t('heroSubtitle')}
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
          {TranslateManager.t('tagline')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button 
            onClick={() => setView('register')}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy rounded-xl shadow-lg shadow-brand-turquoise/15 hover:shadow-brand-turquoise/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>{TranslateManager.t('startFree')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a 
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold border border-white/10 hover:border-brand-turquoise/30 rounded-xl hover:bg-brand-navy-light text-gray-300 hover:text-white transition-all flex items-center justify-center"
          >
            {TranslateManager.t('howItWorks')}
          </a>
        </div>
      </div>

      {/* Steps Section */}
      <div id="how-it-works" className="space-y-12 scroll-mt-28">
        <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-100">
          {TranslateManager.t('howItWorks')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'step1', desc: 'step1Desc', icon: User },
            { step: '2', title: 'step2', desc: 'step2Desc', icon: QrCode },
            { step: '3', title: 'step3', desc: 'step3Desc', icon: Smartphone }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-4xl font-black text-brand-turquoise/10">0{item.step}</span>
                  <div className="bg-brand-navy p-3 rounded-xl border border-white/10 text-brand-turquoise">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-200">{TranslateManager.t(item.title)}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{TranslateManager.t(item.desc)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-100">
            {TranslateManager.t('pricing')}
          </h2>
          <p className="text-gray-400 text-xs">Aracınıza ve bütçenize en uygun seçeneği seçin.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Pack */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{TranslateManager.t('freePlan')}</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold text-white">{TranslateManager.t('pricingFreePrice')}</span>
              </div>
              <p className="text-xs text-gray-400">{TranslateManager.t('freeDesc')}</p>
              <div className="border-t border-white/5 my-4 pt-4 space-y-3 text-xs text-gray-300">
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-turquoise" />
                  <span>{TranslateManager.t('oneCarLimit')}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-turquoise" />
                  <span>{TranslateManager.t('emailNotificationOnly')}</span>
                </div>
                <div className="flex items-center space-x-2.5 opacity-40">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="line-through">{TranslateManager.t('allNotificationChannels')}</span>
                </div>
                <div className="flex items-center space-x-2.5 opacity-40">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="line-through">{TranslateManager.t('locationSharing')}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setView('register')}
              className="w-full py-3.5 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:border-brand-turquoise hover:text-white hover:bg-white/5 transition-all"
            >
              {TranslateManager.t('startFree')}
            </button>
          </div>

          {/* Premium Pack */}
          <div className="glass-panel p-8 rounded-3xl border-2 border-brand-turquoise/40 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-turquoise text-brand-navy text-[9px] font-black tracking-widest uppercase py-1 px-4 rounded-bl-xl">
              POPÜLER
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-turquoise uppercase tracking-widest">{TranslateManager.t('premiumPlan')}</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-extrabold text-white">{TranslateManager.t('pricingPremiumPrice')}</span>
              </div>
              <p className="text-xs text-gray-400">{TranslateManager.t('premiumDesc')}</p>
              <div className="border-t border-brand-turquoise/10 my-4 pt-4 space-y-3 text-xs text-gray-300">
                <div className="flex items-center space-x-2.5 font-semibold text-brand-turquoise">
                  <Check className="w-4 h-4 text-brand-turquoise" />
                  <span>{TranslateManager.t('unlimitedCars')}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-turquoise" />
                  <span>{TranslateManager.t('allNotificationChannels')}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-turquoise" />
                  <span>{TranslateManager.t('locationSharing')}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-brand-turquoise" />
                  <span>{TranslateManager.t('prioritySupport')}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setView('register')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy text-xs font-black shadow-lg shadow-brand-turquoise/15 hover:shadow-brand-turquoise/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
            >
              {TranslateManager.t('upgradeToPremium')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. AUTHENTICATION: LOGIN VIEW
   ========================================================================= */
function LoginView({ setView, onLoginSuccess }: { setView: (v: any) => void, onLoginSuccess: (user: any, token: string) => void }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
       body: JSON.stringify({ email: emailOrPhone, password });

      localStorage.setItem('qr_vehicle_token', data.token);
      localStorage.setItem('qr_vehicle_user', JSON.stringify(data.user));
      
      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-slide-up">
      <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-turquoise/10 p-3 rounded-2xl text-brand-turquoise">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-100">{TranslateManager.t('login')}</h2>
          <p className="text-xs text-gray-400">Hesabınıza güvenle erişim sağlayın.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase">{TranslateManager.t('email')} / {TranslateManager.t('phone')}</label>
            <input 
              type="text" 
              required
              placeholder="user@example.com veya +905..."
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy-darker border border-white/10 text-sm text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase">{TranslateManager.t('password')}</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy-darker border border-white/10 text-sm text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy font-bold rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/15 active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            {loading ? TranslateManager.t('loading') : TranslateManager.t('login')}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5">
          <button 
            onClick={() => setView('register')}
            className="hover:text-brand-turquoise transition-colors"
          >
            {TranslateManager.t('noAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. AUTHENTICATION: REGISTER VIEW
   ========================================================================= */
function RegisterView({ setView }: { setView: (v: any) => void }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  
  // OTP state
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: emailOrPhone, password })
});
      setUserId(data.userId);
      setSuccess('Kayıt oluşturuldu. Doğrulama kodu gönderildi!');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ userId, code: otpCode })
      });
      
      setSuccess('Doğrulama başarılı! Giriş yapabilirsiniz.');
      setTimeout(() => {
        setView('login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Geçersiz doğrulama kodu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-slide-up">
      <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-turquoise/10 p-3 rounded-2xl text-brand-turquoise">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-100">
            {userId ? TranslateManager.t('verifyOTP') : TranslateManager.t('register')}
          </h2>
          <p className="text-xs text-gray-400">
            {userId ? 'Telefon numaranızı onaylayın.' : 'Bilgileriniz hiçbir zaman görünmez.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {!userId ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">{TranslateManager.t('email')}</label>
              <input 
                type="email" 
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-brand-navy-darker border border-white/10 text-sm text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">{TranslateManager.t('phone')}</label>
              <input 
                type="tel" 
                required
                placeholder="+905551234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-brand-navy-darker border border-white/10 text-sm text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">{TranslateManager.t('password')}</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-brand-navy-darker border border-white/10 text-sm text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy font-bold rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/15 active:scale-95 transition-all text-sm disabled:opacity-50"
            >
              {loading ? TranslateManager.t('loading') : TranslateManager.t('register')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-xs text-gray-300 font-semibold">{TranslateManager.t('enterOTP')}</p>
            <input 
              type="text" 
              required
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-brand-navy-darker border border-white/10 text-lg tracking-widest text-center text-white focus:border-brand-turquoise focus:outline-none transition-colors font-bold"
            />
            <p className="text-[10px] text-brand-turquoise bg-brand-turquoise/5 p-2 rounded border border-brand-turquoise/20 text-center font-mono">
              {TranslateManager.t('otpHint')}
            </p>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy font-bold rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/15 active:scale-95 transition-all text-sm disabled:opacity-50"
            >
              {loading ? TranslateManager.t('loading') : TranslateManager.t('verify')}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/5">
          <button 
            onClick={() => setView('login')}
            className="hover:text-brand-turquoise transition-colors"
          >
            {TranslateManager.t('haveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. DASHBOARD COMPONENT
   ========================================================================= */
function DashboardView({ user, setUser }: { user: any, setUser: (u: any) => void }) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State for Adding Vehicle
  const [showAddForm, setShowAddForm] = useState(false);
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [country, setCountry] = useState('Turkey');

  // Selected vehicle for QR Modal
  const [qrModalVehicle, setQrModalVehicle] = useState<any | null>(null);

  // Tabs for Dashboard Sub-sections
  const [activeTab, setActiveTab] = useState<'vehicles' | 'settings'>('vehicles');

  const fetchDashboardData = async () => {
    try {
      const vehiclesData = await apiFetch('/api/vehicles');
      setVehicles(vehiclesData);
      
      const settingsData = await apiFetch('/api/settings');
      setSettings(settingsData);
    } catch (err: any) {
      setError(err.message || 'Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await apiFetch('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify({ plate, brand, model, color, country })
      });
      setSuccess('Araç başarıyla eklendi!');
      setShowAddForm(false);
      setPlate('');
      setBrand('');
      setModel('');
      setColor('');
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message || 'Araç eklenemedi.');
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!window.confirm('Bu aracı silmek istediğinize emin misiniz? (Are you sure you want to delete?)')) return;
    try {
      await apiFetch(`/api/vehicles/${id}`, { method: 'DELETE' });
      setSuccess('Araç silindi.');
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message || 'Araç silinemedi.');
    }
  };

  const handleUpdateSettings = async (updatedFields: any) => {
    try {
      await apiFetch('/api/settings', {
        method: 'PUT',
        body: JSON.stringify({
          ...settings.settings,
          ...updatedFields
        })
      });
      setSuccess('Bildirim ayarları kaydedildi!');
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message || 'Ayarlar kaydedilemedi.');
    }
  };

  const handleUpgradePlan = async () => {
    try {
      const data = await apiFetch('/api/settings/upgrade', { method: 'POST' });
      // Update plan states
      setSettings({ ...settings, plan: 'premium' });
      const updatedUser = { ...user, plan: 'premium' };
      setUser(updatedUser);
      localStorage.setItem('qr_vehicle_user', JSON.stringify(updatedUser));
      setSuccess(data.message || 'Premium plana yükseltildi!');
      fetchDashboardData();
    } catch (err: any) {
      setError(err.message || 'Yükseltme başarısız.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-turquoise animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Alert Banners */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-gray-400">HOŞ GELDİNİZ / WELCOME</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">{settings?.email}</h2>
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <span>{settings?.phone}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            <span className="flex items-center font-bold text-brand-turquoise">
              <Check className="w-3.5 h-3.5 mr-1" /> Onaylı Hesap
            </span>
          </div>
        </div>

        {/* Subscription Plan State Card */}
        <div className="glass-panel p-4 rounded-xl border border-brand-turquoise/15 flex items-center space-x-4 shrink-0 w-full md:w-auto">
          <div className="bg-brand-turquoise/10 p-2.5 rounded-lg text-brand-turquoise">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">ABONELİK / PLAN</span>
            <span className="text-sm font-bold uppercase tracking-wider text-white">
              {settings?.plan === 'premium' ? '🏆 Premium' : '📁 Ücretsiz (Free)'}
            </span>
            {settings?.plan === 'free' && (
              <button 
                onClick={handleUpgradePlan}
                className="block text-[10px] font-black text-brand-turquoise hover:text-white transition-colors underline text-left mt-0.5"
              >
                {TranslateManager.t('upgradeToPremium')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-white/5 space-x-6 text-sm font-semibold select-none">
        <button 
          onClick={() => setActiveTab('vehicles')}
          className={`pb-3 border-b-2 transition-all ${activeTab === 'vehicles' ? 'border-brand-turquoise text-brand-turquoise font-black' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          🚗 {TranslateManager.t('myVehicles')} ({vehicles.length})
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-3 border-b-2 transition-all ${activeTab === 'settings' ? 'border-brand-turquoise text-brand-turquoise font-black' : 'border-transparent text-gray-400 hover:text-white'}`}
        >
          ⚙️ {TranslateManager.t('channelPreferences')}
        </button>
      </div>

      {/* Tabs Layout */}
      {activeTab === 'vehicles' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-white">{TranslateManager.t('myVehicles')}</h3>
            {!showAddForm && (
              <button 
                onClick={() => {
                  if (settings?.plan === 'free' && vehicles.length >= 1) {
                    setError('Ücretsiz paket limiti 1 araçtır. Lütfen Premium paketine geçin.');
                  } else {
                    setShowAddForm(true);
                  }
                }}
                className="px-4 py-2 bg-brand-turquoise text-brand-navy rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-brand-turquoise/15 hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{TranslateManager.t('addVehicle')}</span>
              </button>
            )}
          </div>

          {/* Add Vehicle Form */}
          {showAddForm && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 max-w-xl animate-slide-up">
              <h4 className="font-bold text-sm text-gray-200">Yeni Araç Kaydı</h4>
              <form onSubmit={handleAddVehicle} className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{TranslateManager.t('plate')}*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="34ABC123"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-navy-darker border border-white/10 text-xs text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{TranslateManager.t('brand')}*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Audi, Tesla, BMW..."
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-navy-darker border border-white/10 text-xs text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{TranslateManager.t('model')}*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="A4, Model Y, 320i..."
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-navy-darker border border-white/10 text-xs text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{TranslateManager.t('color')}</label>
                  <input 
                    type="text" 
                    placeholder="Beyaz, Siyah..."
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-navy-darker border border-white/10 text-xs text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{TranslateManager.t('country')}</label>
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-navy-darker border border-white/10 text-xs text-white focus:border-brand-turquoise focus:outline-none"
                  >
                    <option value="Turkey">Türkiye (Turkey)</option>
                    <option value="Azerbaijan">Azerbaycan (Azerbaijan)</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Russia">Rusya (Russia)</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex justify-end space-x-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white"
                  >
                    {TranslateManager.t('cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy font-bold rounded-lg text-xs shadow-lg hover:shadow-brand-turquoise/15 transition-all"
                  >
                    {TranslateManager.t('save')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Vehicles List */}
          {vehicles.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-white/5 text-gray-400 text-sm">
              <Car className="w-10 h-10 text-brand-turquoise/20 mx-auto mb-3" />
              <span>{TranslateManager.t('noVehicles')}</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {vehicles.map((v) => (
                <div key={v.id} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      {/* License Plate Graphic Badge */}
                      <div className="border border-brand-turquoise/30 rounded-lg overflow-hidden flex items-stretch text-xs font-mono font-bold shadow-md shadow-brand-turquoise/5">
                        <div className="bg-brand-blue/20 text-brand-blue px-2 py-1.5 flex items-center justify-center border-r border-brand-turquoise/20 text-[9px] uppercase tracking-wider select-none font-bold">
                          TR
                        </div>
                        <div className="bg-brand-navy-darker text-white px-3.5 py-1.5 tracking-widest text-sm uppercase">
                          {v.plate}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setQrModalVehicle(v)}
                          className="p-2 rounded-lg bg-brand-turquoise/10 hover:bg-brand-turquoise/25 text-brand-turquoise transition-colors"
                          title={TranslateManager.t('viewQR')}
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title={TranslateManager.t('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 pt-2 border-t border-white/5">
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase">{TranslateManager.t('brand')}</span>
                        <span className="font-semibold text-gray-200">{v.brand}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase">{TranslateManager.t('model')}</span>
                        <span className="font-semibold text-gray-200">{v.model}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase">{TranslateManager.t('color')}</span>
                        <span className="font-semibold text-gray-200">{v.color || 'Belirtilmedi'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 uppercase">{TranslateManager.t('country')}</span>
                        <span className="font-semibold text-gray-200">{v.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setQrModalVehicle(v)}
                      className="w-full py-2 bg-brand-navy-light hover:bg-brand-turquoise/10 hover:text-brand-turquoise text-xs font-bold rounded-lg border border-white/10 hover:border-brand-turquoise/20 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{TranslateManager.t('viewQR')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab (Notification Preferences) */
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 animate-fade-in max-w-2xl">
          <h3 className="text-lg font-extrabold text-white">⚙️ {TranslateManager.t('channelPreferences')}</h3>
          <p className="text-xs text-gray-400">Hangi kanallardan acil durum bildirimi almak istediğinizi seçin.</p>

          <div className="space-y-4">
            {/* Email (Free & Premium) */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-brand-navy-darker border border-white/5">
              <div>
                <span className="block text-xs font-bold text-gray-200">{TranslateManager.t('emailToggle')}</span>
                <span className="text-[10px] text-gray-400">Ücretsiz & Premium paketlere dahildir.</span>
              </div>
              <input 
                type="checkbox" 
                checked={settings?.settings?.email_enabled}
                onChange={(e) => handleUpdateSettings({ email_enabled: e.target.checked })}
                className="w-4 h-4 accent-brand-turquoise cursor-pointer"
              />
            </div>

            {/* WhatsApp (Premium-Only) */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-brand-navy-darker border border-white/5">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="block text-xs font-bold text-gray-200">{TranslateManager.t('whatsappToggle')}</span>
                  {settings?.plan !== 'premium' && <span className="bg-brand-turquoise/10 text-brand-turquoise text-[8px] font-bold px-1.5 py-0.5 rounded border border-brand-turquoise/20">PREMIUM</span>}
                </div>
                <span className="text-[10px] text-gray-400">Aracınız hakkında WhatsApp mesajı alın.</span>
              </div>
              <input 
                type="checkbox" 
                disabled={settings?.plan !== 'premium'}
                checked={settings?.settings?.whatsapp_enabled}
                onChange={(e) => handleUpdateSettings({ whatsapp_enabled: e.target.checked })}
                className="w-4 h-4 accent-brand-turquoise cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* Telegram (Premium-Only) */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-brand-navy-darker border border-white/5">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="block text-xs font-bold text-gray-200">{TranslateManager.t('telegramToggle')}</span>
                  {settings?.plan !== 'premium' && <span className="bg-brand-turquoise/10 text-brand-turquoise text-[8px] font-bold px-1.5 py-0.5 rounded border border-brand-turquoise/20">PREMIUM</span>}
                </div>
                <span className="text-[10px] text-gray-400">Telegram Bot anlık mesajları.</span>
              </div>
              <input 
                type="checkbox" 
                disabled={settings?.plan !== 'premium'}
                checked={settings?.settings?.telegram_enabled}
                onChange={(e) => handleUpdateSettings({ telegram_enabled: e.target.checked })}
                className="w-4 h-4 accent-brand-turquoise cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* SMS (Premium-Only) */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-brand-navy-darker border border-white/5">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="block text-xs font-bold text-gray-200">{TranslateManager.t('smsToggle')}</span>
                  {settings?.plan !== 'premium' && <span className="bg-brand-turquoise/10 text-brand-turquoise text-[8px] font-bold px-1.5 py-0.5 rounded border border-brand-turquoise/20">PREMIUM</span>}
                </div>
                <span className="text-[10px] text-gray-400">Telefonunuza doğrudan anlık SMS alın.</span>
              </div>
              <input 
                type="checkbox" 
                disabled={settings?.plan !== 'premium'}
                checked={settings?.settings?.sms_enabled}
                onChange={(e) => handleUpdateSettings({ sms_enabled: e.target.checked })}
                className="w-4 h-4 accent-brand-turquoise cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* Telegram setup inputs (renders only if Telegram enabled) */}
            {settings?.settings?.telegram_enabled && (
              <div className="p-4 bg-brand-navy-darker/60 rounded-lg border border-brand-turquoise/25 text-xs space-y-3">
                <span className="font-bold text-brand-turquoise">Telegram Kurulum Talimatları:</span>
                <p className="text-gray-400 text-[11px] leading-relaxed">{TranslateManager.t('telegramSetupInstructions')}</p>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">{TranslateManager.t('telegramChatId')}</label>
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Örn: 987654321"
                      defaultValue={settings?.settings?.telegram_chat_id}
                      onBlur={(e) => handleUpdateSettings({ telegram_chat_id: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-brand-navy border border-white/10 text-xs text-white focus:border-brand-turquoise focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR MODAL PREVIEW */}
      {qrModalVehicle && (() => {
        const scanUrl = `${window.location.origin}/v/${qrModalVehicle.qr_uuid}`;
        const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(scanUrl)}&color=0A192F&margin=15`;
        
        return (
          <div className="fixed inset-0 z-50 bg-brand-navy-darker/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-sm w-full border border-white/10 space-y-6 text-center animate-slide-up relative shadow-2xl">
              <button 
                onClick={() => setQrModalVehicle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-brand-turquoise uppercase tracking-widest bg-brand-turquoise/10 px-3 py-1 rounded-full border border-brand-turquoise/25 inline-block">
                  DİNAMİK QR KOD
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight">{qrModalVehicle.plate}</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  {qrModalVehicle.brand} {qrModalVehicle.model} ({qrModalVehicle.color || 'Belirtilmedi'})
                </p>
              </div>

              {/* Scannable Real QR Image Frame */}
              <div className="relative group mx-auto">
                {/* Glowing neon turquoise decorative backdrop ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-turquoise to-brand-blue rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white p-4 rounded-3xl inline-block shadow-xl">
                  <img 
                    src={qrImageUrl} 
                    alt={`QR Code for ${qrModalVehicle.plate}`} 
                    className="w-48 h-48 select-none rounded-xl"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* URL Display and Quick Copy */}
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-brand-navy-darker border border-white/5 text-[10px] font-mono text-brand-turquoise break-all select-all flex items-center justify-center space-x-1.5 cursor-pointer hover:bg-brand-navy transition-colors" title="Bağlantıyı Kopyala" onClick={() => {
                  navigator.clipboard.writeText(scanUrl);
                  alert('Bağlantı kopyalandı! (Link copied!)');
                }}>
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{scanUrl}</span>
                </div>

                <div className="p-3 bg-brand-turquoise/5 rounded-xl border border-brand-turquoise/20 text-left space-y-1">
                  <span className="text-[10px] font-bold text-brand-turquoise block">📱 Telefonda Test Etme Rehberi:</span>
                  <p className="text-[9.5px] text-gray-400 leading-normal">
                    Bilgisayarınızın ekranındaki bu QR kodunu cep telefonunuzun kamerasına okutarak sayfayı anında açabilirsiniz! 
                    <span className="block mt-1 font-semibold text-gray-300">⚠️ Telefonunuzun bilgisayarınızla aynı Wi-Fi ağına bağlı olduğundan emin olun.</span>
                  </p>
                </div>

                {/* Print/Scan buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a 
                    href={`/v/${qrModalVehicle.qr_uuid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 bg-brand-turquoise hover:bg-brand-turquoise-dark text-brand-navy font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Aç (Simüle Et)</span>
                  </a>
                  <button 
                    onClick={() => window.print()}
                    className="py-2.5 border border-white/10 hover:border-white/20 text-xs font-semibold rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    Yazdır / Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* =========================================================================
   5. SCANNER VIEW (PUBLIC INTERACTION SCREEN FOR QR SCANS)
   ========================================================================= */
function ScannerView({ uuid }: { uuid: string }) {
  const [vehicle, setVehicle] = useState<any>(null);
  const [allowedChannels, setAllowedChannels] = useState<any>(null);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  // Interaction State
  const [activeCategory, setActiveCategory] = useState<'incorrect_park' | 'danger' | 'accident' | 'emergency' | 'custom' | null>(null);
  const [subCategory, setSubCategory] = useState('');
  const [customText, setCustomText] = useState('');
  const [shareLocation, setShareLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPublicVehicle = async () => {
    try {
      const data = await apiFetch(`/api/public/vehicles/${uuid}`);
      setVehicle(data.vehicle);
      setAllowedChannels(data.allowedChannels);
      setCaptchaQuestion(data.captcha.question);
    } catch (err: any) {
      setError('Geçersiz veya silinmiş QR Kod.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicVehicle();
  }, [uuid]);

  // Handle Location Retrieval
  useEffect(() => {
    if (shareLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocationCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            });
          },
          (err) => {
            console.error('Konum alınamadı:', err.message);
            setError('Konum izni reddedildi. Mesaj konum olmadan gönderilecektir.');
            setShareLocation(false);
          }
        );
      } else {
        setError('Tarayıcınız konum paylaşımını desteklemiyor.');
        setShareLocation(false);
      }
    } else {
      setLocationCoords(null);
    }
  }, [shareLocation]);

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) {
      setError('Lütfen bir acil durum kategorisi seçin.');
      return;
    }
    if (!captchaAnswer) {
      setError('Lütfen güvenlik kodunu yanıtlayın.');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiFetch(`/api/public/vehicles/${uuid}/notify`, {
        method: 'POST',
        body: JSON.stringify({
          category: activeCategory,
          sub_category: subCategory || null,
          custom_text: customText || null,
          location_lat: locationCoords?.lat || null,
          location_lng: locationCoords?.lng || null,
          captcha_answer: captchaAnswer
        })
      });

      setSuccess(res.message);
      // Reset forms
      setActiveCategory(null);
      setSubCategory('');
      setCustomText('');
      setCaptchaAnswer('');
      setShareLocation(false);
      // Refresh captcha challenge
      fetchPublicVehicle();
    } catch (err: any) {
      setError(err.message || 'Bildirim gönderilemedi.');
      // Refresh captcha challenge
      fetchPublicVehicle();
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-turquoise animate-spin" />
      </div>
    );
  }

  // Predefined Category Configuration lists
  const optionsConfig = {
    incorrect_park: [
      { id: 'road_blocked', labelKey: 'road_blocked' },
      { id: 'garage_blocked', labelKey: 'garage_blocked' },
      { id: 'double_parked', labelKey: 'double_parked' },
      { id: 'emergency_exit', labelKey: 'emergency_exit' },
      { id: 'blocking_traffic', labelKey: 'blocking_traffic' }
    ],
    danger: [
      { id: 'headlights_on', labelKey: 'headlights_on' },
      { id: 'window_open', labelKey: 'window_open' },
      { id: 'door_open', labelKey: 'door_open' },
      { id: 'flat_tire', labelKey: 'flat_tire' },
      { id: 'being_towed', labelKey: 'being_towed' }
    ],
    accident: [
      { id: 'scratched', labelKey: 'scratched' },
      { id: 'damage', labelKey: 'damage' },
      { id: 'witness', labelKey: 'witness' }
    ],
    emergency: [
      { id: 'fire_engine', labelKey: 'fire_engine' },
      { id: 'ambulance', labelKey: 'ambulance' },
      { id: 'police', labelKey: 'police' }
    ]
  };

  return (
    <div className="max-w-2xl mx-auto py-4 animate-fade-in space-y-6">
      {/* Privacy Guarantee Card */}
      <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2.5">
        <Shield className="w-5 h-5 shrink-0" />
        <div>
          <span className="font-bold block">Güvenli ve Anonim İletişim (Secure & Anonymous Contact)</span>
          <span className="text-[10px] text-gray-400">Araç sahibinin telefon numarası, e-postası veya kişisel verileri hiçbir şekilde gösterilmez.</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
          <div>
            <span className="block font-bold">Bildirim İletildi! (Notification Sent!)</span>
            <span className="text-xs text-gray-400">{success}</span>
          </div>
        </div>
      )}

      {/* Vehicle Specification Panel */}
      {vehicle && (
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{TranslateManager.t('vehicleDetails')}</span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="border border-brand-turquoise/30 rounded-lg overflow-hidden flex items-stretch text-xs font-mono font-bold shadow-md shadow-brand-turquoise/5">
              <div className="bg-brand-blue/20 text-brand-blue px-2.5 py-1.5 flex items-center justify-center border-r border-brand-turquoise/20 text-[9px] uppercase tracking-wider select-none font-bold">
                TR
              </div>
              <div className="bg-brand-navy-darker text-white px-4 py-1.5 tracking-widest text-sm uppercase">
                {vehicle.plate}
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <div>
                <span className="block text-[9px] text-gray-500 uppercase">{TranslateManager.t('brand')}</span>
                <span className="font-semibold">{vehicle.brand} {vehicle.model}</span>
              </div>
              <span className="w-1 h-3 border-r border-white/10"></span>
              <div>
                <span className="block text-[9px] text-gray-500 uppercase">{TranslateManager.t('color')}</span>
                <span className="font-semibold">{vehicle.color || 'Belirtilmedi'}</span>
              </div>
            </div>
          </div>
          
          {/* Dynamic Allowed Channels Badges */}
          {allowedChannels && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-[9px] text-gray-400">
              <span className="font-bold uppercase tracking-wider text-gray-500 mr-1">Aktif İletişim Kanalları (Active Channels):</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${allowedChannels.email ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-white/5 text-gray-500'}`}>Email</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${allowedChannels.whatsapp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-white/5 text-gray-500'}`}>WhatsApp</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${allowedChannels.sms ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-white/5 text-gray-500'}`}>SMS</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${allowedChannels.telegram ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-white/5 text-gray-500'}`}>Telegram</span>
            </div>
          )}
        </div>
      )}

      {/* Interactive Emergency Forms */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white">{TranslateManager.t('scanTitle')}</h3>
          <p className="text-xs text-gray-400">{TranslateManager.t('scanSubtitle')}</p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { id: 'incorrect_park', label: 'incorrectPark', color: 'border-yellow-500/20 hover:border-yellow-500/50 text-yellow-500' },
            { id: 'danger', label: 'danger', color: 'border-orange-500/20 hover:border-orange-500/50 text-orange-400' },
            { id: 'accident', label: 'accident', color: 'border-blue-500/20 hover:border-blue-500/50 text-blue-400' },
            { id: 'emergency', label: 'emergency', color: 'border-red-500/20 hover:border-red-500/50 text-red-400 animate-pulse-slow' },
            { id: 'custom', label: 'customMessage', color: 'border-brand-turquoise/20 hover:border-brand-turquoise/50 text-brand-turquoise' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setSubCategory('');
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all ${cat.color} ${activeCategory === cat.id ? 'bg-white/5 border-white' : 'bg-brand-navy-darker/60'}`}
            >
              <span className="text-xs font-extrabold">{TranslateManager.t(cat.label)}</span>
              <span className="text-[10px] text-gray-400 font-medium">Seçmek için dokunun</span>
            </button>
          ))}
        </div>

        {/* Detailed Options Form */}
        {activeCategory && (
          <form onSubmit={handleSendAlert} className="space-y-4 pt-4 border-t border-white/5 animate-slide-up">
            {/* Sub-options for categories */}
            {activeCategory !== 'custom' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">ACİL DURUM DETAYI / SUB-OPTION*</label>
                <div className="grid sm:grid-cols-2 gap-2">
                  {optionsConfig[activeCategory as keyof typeof optionsConfig]?.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSubCategory(opt.id)}
                      className={`p-3 rounded-lg border text-xs text-left transition-all ${subCategory === opt.id ? 'bg-brand-turquoise/10 border-brand-turquoise text-brand-turquoise font-semibold' : 'bg-brand-navy border-white/5 text-gray-300 hover:bg-white/5'}`}
                    >
                      {TranslateManager.t(opt.labelKey)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Freeform Text Area */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">ÖZEL MESAJ / CUSTOM MESSAGE {activeCategory === 'custom' ? '*' : '(İsteğe Bağlı)'}</label>
              <textarea
                required={activeCategory === 'custom'}
                maxLength={500}
                placeholder="Araç sahibine iletmek istediğiniz ek acil detayları buraya yazın... (Maks 500 karakter)"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-brand-navy-darker border border-white/10 text-xs text-white placeholder-gray-500 focus:border-brand-turquoise focus:outline-none min-h-[80px]"
              />
            </div>

            {/* GPS Location sharing (For Premium owners) */}
            <div className="flex items-center space-x-2.5 p-3 rounded-lg bg-brand-navy-darker border border-white/5">
              <input 
                type="checkbox" 
                id="location-share-cb"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                className="w-4 h-4 accent-brand-turquoise cursor-pointer"
              />
              <label htmlFor="location-share-cb" className="text-xs text-gray-300 cursor-pointer select-none">
                📍 {TranslateManager.t('locationChecked')}
              </label>
            </div>

            {/* Spam Protection Mathematical Captcha */}
            <div className="p-4 bg-brand-navy-darker rounded-xl border border-white/5 grid sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="block text-xs font-bold text-gray-200">{TranslateManager.t('captchaTitle')}</span>
                <span className="text-[10px] text-brand-turquoise font-mono mt-1 block">{captchaQuestion}</span>
              </div>
              <input 
                type="number" 
                required
                placeholder="Cevabınızı girin..."
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-brand-navy border border-white/10 text-xs text-white text-center font-bold focus:border-brand-turquoise focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy font-bold rounded-lg hover:shadow-lg hover:shadow-brand-turquoise/15 active:scale-95 transition-all text-sm disabled:opacity-50 flex items-center justify-center space-x-1.5"
            >
              {sending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{TranslateManager.t('loading')}</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>{TranslateManager.t('sendAlert')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   6. ADMIN PANEL VIEW COMPONENT
   ========================================================================= */
function AdminView({ setView }: { setView: (v: any) => void }) {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  
  const [adminTab, setAdminTab] = useState<'stats' | 'users' | 'vehicles' | 'messages' | 'reports'>('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      const statsData = await apiFetch('/api/admin/stats');
      setStats(statsData.stats);
      
      const usersData = await apiFetch('/api/admin/users');
      setUsers(usersData);

      const vehiclesData = await apiFetch('/api/admin/vehicles');
      setVehicles(vehiclesData);

      const messagesData = await apiFetch('/api/admin/messages');
      setMessages(messagesData);

      const reportsData = await apiFetch('/api/admin/abuse-reports');
      setReports(reportsData);
    } catch (err: any) {
      setError(err.message || 'Yönetici verileri yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <RefreshCw className="w-8 h-8 text-brand-turquoise animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-black text-white">🏆 {TranslateManager.t('adminPanel')}</h2>
        <button 
          onClick={() => setView('dashboard')}
          className="px-3 py-1.5 border border-white/10 rounded-lg text-xs hover:text-white"
        >
          Panele Dön
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center space-x-2">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Tab Switching */}
      <div className="flex flex-wrap gap-2 text-xs font-bold border-b border-white/5 pb-3">
        {[
          { id: 'stats', label: '📊 İstatistikler' },
          { id: 'users', label: '👤 Kullanıcılar' },
          { id: 'vehicles', label: '🚗 Araçlar' },
          { id: 'messages', label: '✉️ Mesaj Logları' },
          { id: 'reports', label: '🚩 Raporlar' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${adminTab === tab.id ? 'bg-brand-turquoise text-brand-navy' : 'bg-brand-navy-light text-gray-400 hover:text-white border border-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Admin Panels */}
      {adminTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'statsUsers', value: stats.users },
            { label: 'statsPremium', value: `${stats.premiumRatio}%` },
            { label: 'statsVehicles', value: stats.vehicles },
            { label: 'statsMessages', value: stats.messages },
            { label: 'statsReports', value: stats.abuseReports }
          ].map((card, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
              <span className="block text-[10px] text-gray-400 uppercase font-semibold">{TranslateManager.t(card.label)}</span>
              <span className="block text-2xl font-black text-brand-turquoise mt-2">{card.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab Table */}
      {adminTab === 'users' && (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-brand-navy-darker uppercase text-gray-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">{TranslateManager.t('userEmail')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('phone')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('userRole')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('userPlan')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('userVerified')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-semibold text-white">{u.email}</td>
                    <td className="px-6 py-4">{u.phone}</td>
                    <td className="px-6 py-4 uppercase font-bold text-[10px]">{u.role}</td>
                    <td className="px-6 py-4 uppercase font-bold text-brand-turquoise text-[10px]">{u.plan}</td>
                    <td className="px-6 py-4">{Number(u.is_phone_verified) === 1 ? '🟢 Evet' : '🔴 Hayır'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vehicles Tab Table */}
      {adminTab === 'vehicles' && (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-brand-navy-darker uppercase text-gray-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">{TranslateManager.t('plate')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('brand')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('model')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('color')}</th>
                  <th className="px-6 py-4">Araç Sahibi (Owner)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 font-mono">
                    <td className="px-6 py-4 text-brand-turquoise font-bold uppercase">{v.plate}</td>
                    <td className="px-6 py-4 font-sans font-semibold text-white">{v.brand}</td>
                    <td className="px-6 py-4 font-sans">{v.model}</td>
                    <td className="px-6 py-4 font-sans">{v.color || '-'}</td>
                    <td className="px-6 py-4 font-sans">{v.owner_email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Messages Tab Table */}
      {adminTab === 'messages' && (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-brand-navy-darker uppercase text-gray-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">{TranslateManager.t('plate')}</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">İçerik (Message)</th>
                  <th className="px-6 py-4">{TranslateManager.t('senderIp')}</th>
                  <th className="px-6 py-4">{TranslateManager.t('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {messages.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-mono font-bold text-white uppercase">{m.plate}</td>
                    <td className="px-6 py-4 text-[10px] font-bold uppercase">{m.category}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={m.custom_text || m.sub_category}>
                      {m.custom_text || m.sub_category}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px]">{m.sender_ip}</td>
                    <td className="px-6 py-4 font-bold uppercase text-[10px]">
                      {m.status === 'sent' ? '🟢 İletildi' : '🔴 Başarısız'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab Table */}
      {adminTab === 'reports' && (
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-brand-navy-darker uppercase text-gray-400 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">{TranslateManager.t('plate')}</th>
                  <th className="px-6 py-4">Gerekçe (Reason)</th>
                  <th className="px-6 py-4">Gönderen IP</th>
                  <th className="px-6 py-4">Durum (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-semibold">Aktif ihlal raporu yok.</td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 font-mono font-bold uppercase">{r.plate || '-'}</td>
                      <td className="px-6 py-4">{r.reason}</td>
                      <td className="px-6 py-4 font-mono">{r.reporter_ip}</td>
                      <td className="px-6 py-4 font-bold uppercase text-[10px]">{r.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   7. INTERACTIVE NOTIFICATION SIMULATOR OVERLAY COMPONENT
   ========================================================================= */
function NotificationSimulator() {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const fetchSimulatorLogs = async () => {
    try {
      const data = await apiFetch('/api/public/simulator/logs');
      setLogs(data);
    } catch (err) {
      console.error('Simulator log loading failed:', err);
    }
  };

  useEffect(() => {
    let interval: any;
    if (expanded) {
      fetchSimulatorLogs();
      interval = setInterval(fetchSimulatorLogs, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [expanded]);

  const handleClearLogs = async () => {
    try {
      await apiFetch('/api/public/simulator/clear', { method: 'POST' });
      setLogs([]);
    } catch (err) {
      console.error('Clear simulator logs failed:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pulse simulation indicator toggle button */}
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center space-x-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy font-bold text-xs shadow-lg shadow-brand-turquoise/25 hover:shadow-brand-turquoise/40 hover:-translate-y-0.5 active:translate-y-0 transition-all select-none animate-pulse-slow"
        >
          <Smartphone className="w-4 h-4 animate-bounce-slow" />
          <span>📱 Bildirim Simülatörü (Developer Mode)</span>
          {logs.length > 0 && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5"></span>
          )}
        </button>
      ) : (
        /* Smartphone Simulation Overlay box */
        <div className="glass-panel w-80 h-[480px] rounded-3xl border border-brand-turquoise/35 shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-up relative bg-brand-navy-darker">
          {/* Top Speaker/Notch design */}
          <div className="bg-brand-navy-darker py-2 flex justify-center border-b border-white/5 shrink-0 select-none">
            <div className="w-16 h-4 bg-brand-navy rounded-full border border-white/10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>
              <span className="w-8 h-1 bg-gray-600 rounded-full"></span>
            </div>
          </div>

          {/* Simulator Body */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col-reverse justify-end min-h-0">
            {logs.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 py-12 space-y-2">
                <Bell className="w-8 h-8 opacity-25 text-brand-turquoise" />
                <span className="text-[11px] font-bold">Simülatör logu temiz.</span>
                <p className="text-[10px] max-w-[200px] leading-relaxed">QR kodunu taratıp bildirim gönderdiğinizde, SMS/WA/TG mesajları saniyeler içinde canlı olarak burada görüntülenecektir!</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 bg-brand-navy rounded-xl border border-white/10 text-[11px] space-y-1.5 shadow-md animate-slide-up">
                  <div className="flex justify-between items-center text-[9px] uppercase font-bold">
                    <span className="text-brand-turquoise">📦 Bildirim İletildi</span>
                    <span className="text-gray-500 font-mono">{log.timestamp.split('T')[1].substring(0, 8)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {log.channels.map((ch: string, i: number) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-brand-turquoise/10 text-brand-turquoise text-[8px] font-black uppercase tracking-wider">
                        {ch}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-300 font-medium leading-relaxed whitespace-pre-line border-t border-white/5 pt-1.5 mt-1.5">
                    {log.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Controller footer */}
          <div className="p-3 bg-brand-navy border-t border-white/5 flex items-center justify-between shrink-0">
            <button 
              onClick={handleClearLogs}
              className="px-3 py-1.5 text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              Temizle / Clear
            </button>
            <button 
              onClick={() => setExpanded(false)}
              className="px-3 py-1.5 text-[10px] font-black bg-gradient-to-r from-brand-turquoise to-brand-blue text-brand-navy rounded-lg transition-all"
            >
              Kapat / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
