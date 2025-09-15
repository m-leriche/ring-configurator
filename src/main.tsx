import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

console.log('React app starting...');
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Current location:', window.location.href);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
