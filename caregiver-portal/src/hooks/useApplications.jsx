import { useState, useCallback } from 'react';

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  export const useApplications = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [applications, setApplications] = useState([]);
    const [hasFosterApp, setHasExistingFosterApp] = useState(false);
    const [error, setError] = useState(null);

    const loadApplications = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/application`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const hasFosterApp = data.some(app => app.type === "Foster Caregiver");

        setApplications(data);
        setHasExistingFosterApp(hasFosterApp);
      } catch (err) {
        setError(err.message);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

    return {
      applications,
      isLoading,
      hasFosterApp,
      error,
      loadApplications
    };
  };
