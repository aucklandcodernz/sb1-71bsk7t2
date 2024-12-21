import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      overlay: true
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          pdf: ['@react-pdf/renderer', 'jspdf', 'pdf-lib'],
          utils: ['date-fns', 'uuid', 'xlsx'],
          mobile: ['idb', 'workbox-window']
        }
      }
    }
  },
  worker: {
    format: 'es'
  }
});