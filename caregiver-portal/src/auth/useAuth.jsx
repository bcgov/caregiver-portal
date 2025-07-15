// auth/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8090';

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/status`, {
        credentials: 'include', // Important for cookies
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Get environment variables with fallbacks
    const BCSC_CLIENT_ID = import.meta.env.VITE_BCSC_CLIENT_ID;
    const BCSC_AUTHORITY = import.meta.env.VITE_BCSC_AUTHORITY;

    if (!BCSC_CLIENT_ID || !BCSC_AUTHORITY) {
      console.error('Missing required environment variables for BC Services Card');
      return;
    }

    console.log(BCSC_AUTHORITY)

    // Generate and store state for security
    const state = generateRandomState();
    sessionStorage.setItem('oauth_state', state);

    console.log('Generated state:', state);
    console.log('Session state before redirect:', sessionStorage.getItem('oauth_state'));

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
    console.log('authURL:', authUrl)
    window.location.href = authUrl;
  };

  const logout = async () => {
      window.location.href = `${API_BASE}/auth/logout`;
  };

  const value = {
    user,
    loading,
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

// Utility function to generate random state
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};