// hooks/useAuth.js
import { useState, useEffect, useRef, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const WARNING_LEAD_MS = 60_000; // show modal 60s before session expiry

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false);
  
  const warningTimerRef = useRef(null);
  const expiryTimerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const clearExpiryTimers = () => {
    clearTimeout(warningTimerRef.current);
    clearTimeout(expiryTimerRef.current);
  };

  const scheduleExpiryTimers = (expiresAt) => {
    clearExpiryTimers();

    if (!expiresAt) return;

    const now = Date.now();
    const msUntilExpiry = expiresAt - now;
    const msUntilWarning = msUntilExpiry - WARNING_LEAD_MS;

    if (msUntilExpiry <= 0) {
      setSessionExpiring(true);
      return;
    }

    if (msUntilWarning > 0) {
      warningTimerRef.current = setTimeout(() => {
        setSessionExpiring(true);
      }, msUntilWarning);
    } else {
      // Less than 60s remaining on mount — show warning immediately
      setSessionExpiring(true);
    }

    expiryTimerRef.current = setTimeout(() => {
      setUser(null);
    }, msUntilExpiry);
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/status`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSessionExpiring(false);
        scheduleExpiryTimers(data.expiresAt);
      } else {
        setUser(null);
        clearExpiryTimers();  
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
      clearExpiryTimers();
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
    return () => clearExpiryTimers();
  }, []);

  const login = () => {
    // Get environment variables with fallbacks

    const USE_KONG_OIDC = import.meta.env.VITE_USE_KONG_OIDC === 'true';

    if (USE_KONG_OIDC) { 
      window.location.href = `${API_BASE}/auth/login`;
    } else {

      const BCSC_CLIENT_ID = import.meta.env.VITE_BCSC_CLIENT_ID;
      const BCSC_AUTHORITY = import.meta.env.VITE_BCSC_AUTHORITY;
      if (!BCSC_CLIENT_ID || !BCSC_AUTHORITY) {
        console.error('Missing required environment variables for BC Services Card');
        return;
      }
    
      // Generate and store state for security
      const state = generateRandomState();
      sessionStorage.setItem('oauth_state', state);

      // Redirect to BC Services Card authorization
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: BCSC_CLIENT_ID,
        redirect_uri: `${window.location.origin}/auth/callback`,
        scope: 'openid profile email',
        state: state,
        prompt: 'login'
      });

      const authUrl = `${BCSC_AUTHORITY}/protocol/openid-connect/auth?${params}`;
      window.location.href = authUrl;
    }
  };

  const logout = async () => {
    clearExpiryTimers();
    setSessionExpiring(false);
    window.location.href = `${API_BASE}/auth/logout`;
  };

  const value = {
    user,
    loading,
    sessionExpiring,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};