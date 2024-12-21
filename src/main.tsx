import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMobileApp } from './utils/mobileUtils';

// Only initialize mobile features if not in StackBlitz
if (!window.location.hostname.includes('stackblitz')) {
  initializeMobileApp();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);