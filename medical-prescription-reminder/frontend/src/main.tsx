// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global styles (Tailwind CSS directives should be inside this file)
import './index.css'; 

// Register the Service Worker for background notifications and warning bells
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[ServiceWorker] Registration successful with scope: ', registration.scope);
        
        // Optional: Request notification permission on load 
        // (In a production app, it is better to ask this via a UI button click)
        if (Notification.permission === 'default') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log('[Notifications] Permission granted.');
            }
          });
        }
      })
      .catch((error) => {
        console.error('[ServiceWorker] Registration failed: ', error);
      });
  });
} else {
  console.warn('[ServiceWorker] Push notifications are not supported in this browser.');
}

// Render the application
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);