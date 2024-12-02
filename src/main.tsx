import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeAppCheckToken } from './lib/appCheck';
import './index.css';

// Initialize App Check before rendering
initializeAppCheckToken().then(() => {
  const container = document.getElementById('root');
  if (!container) throw new Error('Root element not found');
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize App:', error);
});