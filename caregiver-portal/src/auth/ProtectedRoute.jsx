// ./auth/ProtectedRoute.jsx
// component used to require authentication for specific routes

import React from 'react';
import { useAuth } from 'react-oidc-context';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  // Show loading spinner while checking authentication
  if (auth.isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
        <p>Checking authentication status...</p>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!auth.isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p>You need to be logged in to access this page.</p>
        <button onClick={() => auth.signinRedirect()}>
          Sign In with BC Services Card
        </button>
      </div>
    );
  }

  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute;