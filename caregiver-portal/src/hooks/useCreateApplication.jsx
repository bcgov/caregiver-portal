import { useState, useCallback } from 'react';

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const FORM_CONFIG = {
    formId: 'CF0001',
    formParameters: { formId: "CF0001", language: "en" }
  };

  export const useCreateApplication = (onSuccess) => {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);

    const createApplication = useCallback(async () => {
      try {
        setIsCreating(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/application`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(FORM_CONFIG)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to create application');
        }

        const data = await response.json();
        console.log('Create application response:', data); // Add this        

        if (data.applicationFormId && onSuccess) {
          console.log('Calling onSuccess with applicationFormId:', data.applicationFormId); // Add this
          onSuccess(data.applicationFormId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsCreating(false);
      }
    }, [onSuccess]);

    return { createApplication, isCreating, error };
  };