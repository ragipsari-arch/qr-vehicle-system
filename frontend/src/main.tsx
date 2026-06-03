import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TranslateManager } from './i18n/translate.ts';

// Initialize multi-lingual engine
TranslateManager.init();

// Apply RTL if initial language is Arabic
const lang = TranslateManager.getLang();
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = lang;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
