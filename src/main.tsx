// Normalize local storage app_lang to uppercase 'TR' or 'EN' to prevent crashes from legacy lowercase values
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('app_lang');
  if (stored) {
    const upper = stored.toUpperCase();
    if (upper === 'EN' || upper === 'TR') {
      localStorage.setItem('app_lang', upper);
    } else {
      localStorage.setItem('app_lang', 'TR');
    }
  } else {
    localStorage.setItem('app_lang', 'TR');
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
