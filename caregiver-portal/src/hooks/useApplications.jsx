import { useState, useCallback } from 'react';

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  export const useApplications = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [applicationForms, setApplicationForms] = useState([]);
   // const [applicationPackages, setApplicationPackages] = useState([]);
    const [error, setError] = useState(null);

    // will load screening applicationForms for the authenticated user
    const getApplicationForms = useCallback(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/application-forms`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setApplicationForms(data);
        //console.log(`setting application formsssss to ${data}`)
        //setApplicationPackages(hasFosterApp);

      } catch (err) {
        setError(err.message);
        setApplicationForms([]);
       // setApplicationPackages([]);
      } finally {
        setIsLoading(false);
      }
    }, []);

  const getApplicationFormsByHouseholdMember = useCallback(async (householdMemberId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/application-forms/household/${householdMemberId}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Returns array of forms for this specific household member

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

    // mark a screening form as having user-attached documents
    const markFormAsAttached = useCallback(async (applicationFormId) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/application-forms/${applicationFormId}/mark-attached`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []);


    return {
      applicationForms,
      isLoading,
      error,
      getApplicationForms,
      getApplicationFormsByHouseholdMember,
      markFormAsAttached
    };
  };
