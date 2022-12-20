import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts/fonts.css';
import App from './app/layout/app/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);