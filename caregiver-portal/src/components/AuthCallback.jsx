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
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      // Check for errors
      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + encodeURIComponent(error));
        return;
      }


      // Verify state parameter
      const savedState = sessionStorage.getItem('oauth_state');

      console.log('Returned state from URL:', state);
      console.log('Saved state from session:', savedState);


      if (!state || state !== savedState) {
        console.error('Invalid state parameter');
        navigate('/login?error=invalid_state');
        return;
      }

      // Clean up state
      sessionStorage.removeItem('oauth_state');

      if (!code) {
        console.error('No authorization code received');
        navigate('/login?error=no_code');
        return;
      }

      try {
        // Exchange code for tokens via your backend
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/auth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for cookies
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}/auth/callback`,
          }),
        });

        if (response.ok) {
          // Authentication successful, refresh auth status
          await checkAuthStatus();
          navigate('/dashboard'); // Redirect to protected route
        } else {
          const errorData = await response.json();
          console.error('Authentication failed:', errorData);
          navigate('/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        navigate('/login?error=callback_failed');
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