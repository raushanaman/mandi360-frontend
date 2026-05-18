import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'
import { dispatchAuthExpired } from './context/AuthContext.jsx'

// Global axios interceptor — sirf auth routes ka 401 session expire kare
axios.interceptors.response.use(
  res => res,
  err => {
    const url    = err.config?.url || '';
    const status = err.response?.status;
    // Sirf /auth/me ya /auth/ routes ka 401 session expire trigger kare
    // Baaki APIs (addresses, wishlist etc) ka 401 ignore karo
    if (status === 401 && (url.includes('/auth/me') || url.includes('/auth/login'))) {
      dispatchAuthExpired();
    }
    return Promise.reject(err);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
