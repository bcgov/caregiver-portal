// hooks/useAuth.js
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

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
        console.log('User Data Received:', data.user)
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
    console.log('Initiating login via middleware...');
    console.log('API_BASE:', API_BASE);

    // Redirect to middleware login endpoint
    // The middleware will handle the OAuth flow with BCSC
    const loginUrl = `${API_BASE}/auth/login`;

    console.log('Redirecting to middleware login:', loginUrl);
    window.location.href = loginUrl;
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