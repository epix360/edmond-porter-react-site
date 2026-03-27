import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const rootElement = document.getElementById('root');

// Check if root element already has content (pre-rendered)
if (rootElement.hasChildNodes()) {
  console.log('🔄 Hydrating pre-rendered content');
  root.hydrateRoot(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter basename="/edmond-porter-react-site">
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.log('🚀 Client-side rendering');
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter basename="/edmond-porter-react-site">
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
}
