import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import Analytics from './components/Analytics';

// Register service worker for offline caching
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const rootElement = document.getElementById('root');

// Check if root element already has content (pre-rendered)
if (rootElement.hasChildNodes()) {
  root.hydrateRoot(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <Analytics />
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <Analytics />
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
