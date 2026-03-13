import { useState, useCallback } from 'react';

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  export const useGetFormAccessToken = (applicationFormId, onSuccess) => {

        const [error, setError] = useState(null);
    
        const getFormAccessToken = useCallback(async () => { 

          try {
            setError(null);
    
            const response = await fetch(`${API_BASE_URL}/application-forms/token?applicationFormId=${applicationFormId}`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            });
    
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Failed to create application');
            }

              // Let's try to read the response as text first
            const responseText = await response.text();
              // Then try to parse it
            let data;
            if (responseText) {
                data = JSON.parse(responseText);
            } else {
                return;
            }        
    
            if (data.formAccessToken) {;
              if (onSuccess) {
                onSuccess(data.formAccessToken);
              }
              return data.formAccessToken;
            } else {
                return null;
            }
          
          } catch (err) {
            setError(err.message);
          }
        }, [applicationFormId]);
    
        return { getFormAccessToken, error };
      };