import { useState, useCallback } from 'react';

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  export const useGetFormAccessToken = (applicationId, onSuccess) => {

        const [error, setError] = useState(null);
    
        const getFormAccessToken = useCallback(async () => {
            console.log('Starting getFormAccessToken call'); // Add this

          try {
            setError(null);
    
            const response = await fetch(`${API_BASE_URL}/application-forms/token?applicationId=${applicationId}`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            });

            console.log('Response status:', response.status); // Add this
            console.log('Response ok:', response.ok); // Add this
    
            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Failed to create application');
            }

            console.log('About to parse JSON');
            console.log('Response headers:', response.headers);
            console.log('Content-Type:', response.headers.get('content-type'));

              // Let's try to read the response as text first
            const responseText = await response.text();
            console.log('Response text:', responseText);

              // Then try to parse it
            let data;
            if (responseText) {
                data = JSON.parse(responseText);
            } else {
                console.log('Empty response body');
                return;
            }
    
            //const data = await response.json();
            console.log('Token API response:', data);
            console.log('Type of data:', typeof data);
            console.log('Data keys:', Object.keys(data));            
    
            if (data.formAccessToken && onSuccess) {
              console.log('Calling onSuccess with token:', data.formAccessToken);               
              onSuccess(data.formAccessToken);
            } else {
                console.log('No formAccessToken in response or no onSuccess callback'); 
            }
          } catch (err) {
            setError(err.message);
          }
        }, [applicationId]);
    
        return { getFormAccessToken, error };
      };