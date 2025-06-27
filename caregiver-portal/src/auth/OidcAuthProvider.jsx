// src/auth/OidcAuthProvider.jsx
import React from "react";
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
    authority: import.meta.env.VITE_BCSC_AUTHORITY,
    client_id: "caregiver-registry-6059",
    redirect_uri: `${window.location.origin}/auth/callback`,
    post_logout_redirect_uri: `${window.location.origin}/`,
    response_type: "code",
    scope: "openid profile email",
    loadUserInfo: true,
    
    // Add explicit client authentication
    client_authentication: "client_secret_post", // or "client_secret_basic"
    
    // If you have a client secret, add it here
     client_secret: import.meta.env.VITE_BCSC_CLIENT_SECRET,
    
    onSigninCallback: (user) => {
      console.log('Sign-in successful:', user);
      window.history.replaceState({}, document.title, "/dashboard");
    },
    
    onSigninError: (error) => {
      console.error('Sign-in error:', error);
    },
  };

const OidcAuthProvider = ({ children }) => (
  <AuthProvider {...oidcConfig}>{children}</AuthProvider>
);

export default OidcAuthProvider;