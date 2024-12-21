import { openDB } from 'idb';

export const initializeMobileApp = async () => {
  // Only initialize if service workers are supported
  if ('serviceWorker' in navigator && !window.location.hostname.includes('stackblitz')) {
    try {
      await setupOfflineDB();
      await initializeServiceWorker();
    } catch (error) {
      console.warn('Mobile features initialization failed:', error);
    }
  }
};

const setupOfflineDB = async () => {
  const db = await openDB('kiwihr-offline', 1, {
    upgrade(db) {
      // Create object stores
      db.createObjectStore('sessions');
      db.createObjectStore('documents');
      db.createObjectStore('syncQueue');
    },
  });
  return db;
};

const initializeServiceWorker = async () => {
  if ('serviceWorker' in navigator && !window.location.hostname.includes('stackblitz')) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered:', registration);
    } catch (error) {
      console.warn('ServiceWorker registration failed:', error);
    }
  }
};