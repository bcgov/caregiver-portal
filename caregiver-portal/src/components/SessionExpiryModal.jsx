import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const REDIRECT_DELAY_S = 5;

const SessionExpiryModal = () => {
    const { sessionExpiring, logout } = useAuth();
    const [countdown, setCountdown] = useState(REDIRECT_DELAY_S);

    useEffect(() => { 
      if (!sessionExpiring) return;

      setCountdown(REDIRECT_DELAY_S);
  
      const tick = setInterval(() => {
        setCountdown(c => c - 1);
      }, 1000);
  
      const redirect = setTimeout(() => {
        clearInterval(tick);
        logout();
      }, REDIRECT_DELAY_S * 1000);

      return () => {  
        clearInterval(tick);
        clearTimeout(redirect);
      };
    }, [sessionExpiring, logout]);
  
    if (!sessionExpiring) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content modal-small">
          <div className="modal-header">
            <h2 className="modal-title">Session Expired</h2>
          </div>
          <div className="modal-body">
            <p>
              Your session has expired. All information has been saved. You will be redirected to the login page
              in {countdown} second{countdown !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SessionExpiryModal;