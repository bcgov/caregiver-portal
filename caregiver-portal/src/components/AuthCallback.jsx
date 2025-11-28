import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if(hasRun.current) return; // prevent double execution
    hasRun.current = true;

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');

      console.log('Auth callback page loaded');

      // Check for errors from middleware redirect
      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }

      // Note: The middleware now handles the OAuth callback directly via GET /auth/callback
      // and redirects to /dashboard after setting cookies. This component is only reached
      // if the middleware redirects here, which means auth was successful.

      try {
        // Verify authentication status
        console.log('Verifying authentication status...');
        await checkAuthStatus();
        console.log('Authentication verified, redirecting to dashboard');
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth verification error:', error);
        navigate('/login?error=auth_verification_failed');
      }
    };

    handleCallback();
  }, [navigate, checkAuthStatus]);

  return (
    <div className="submission-overlay">
    <div className="submission-modal">
      <Loader2 className="submission-spinner" />
      <p className="submission-title">Processing authentication</p>
      <p className="submission-text">Please wait while we process your submission...</p>
    </div>
  </div>
  );
};