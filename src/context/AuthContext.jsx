import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const login = (data) => {
    localStorage.setItem('token',     data.token);
    localStorage.setItem('firstName', data.firstName);
    localStorage.setItem('userId',    data.userId);
    localStorage.setItem('role',      data.role);
    setUser({ _id: data.userId, firstName: data.firstName, role: data.role });
    setSessionExpired(false);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('firstName');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    // Pehle localStorage se user restore karo taaki page refresh pe logout na ho
    const savedRole      = localStorage.getItem('role');
    const savedFirstName = localStorage.getItem('firstName');
    const savedUserId    = localStorage.getItem('userId');
    if (savedUserId && savedRole) {
      setUser({ _id: savedUserId, firstName: savedFirstName, role: savedRole });
    }

    // Background mein verify karo - sirf 401 pe logout karo, network error pe nahi
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (r.status === 401) {
          logout();
          setSessionExpired(true);
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then(data => { if (data) setUser(data); })
      .catch(() => { /* network error - keep existing user, don't logout */ })
      .finally(() => setLoading(false));
  }, []);

  // Intercept 401 — sirf genuine token expiry pe logout karo
  useEffect(() => {
    const handler = (e) => {
      // Check karo ki token actually exist karta hai
      // Agar token hai aur 401 aaya toh genuinely expire hua
      const token = localStorage.getItem('token');
      if (token && e.detail?.status === 401) {
        logout();
        setSessionExpired(true);
      }
    };
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, sessionExpired }}>
      {sessionExpired && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-red-500 text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-3">
          ⚠️ Session expired. Please login again.
          <button onClick={() => setSessionExpired(false)} className="text-white/70 hover:text-white text-lg leading-none">✕</button>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Helper: dispatch auth expired event from anywhere (e.g. axios interceptor)
export const dispatchAuthExpired = () =>
  window.dispatchEvent(new CustomEvent('auth:expired', { detail: { status: 401 } }));
