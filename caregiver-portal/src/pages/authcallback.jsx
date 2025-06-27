// src/pages/authcallback.jsx
import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      console.log('User authenticated, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  if (auth.isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Processing login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Login Error</h2>
        <p>Error: {auth.error.message}</p>
        <button onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Login Successful!</h2>
      <p>Redirecting to dashboard...</p>
    </div>
  );
};

export default AuthCallback;