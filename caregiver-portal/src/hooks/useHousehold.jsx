import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useHousehold = ({applicationId}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [household, setHousehold] = useState([]);
    const [error, setError] = useState(null);

    const loadHousehold = useCallback(async () => {

        try {

            setIsLoading(true);
            setError(null);
    
            const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/household-members`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();

            const householdData = data.filter(member => member.relationshipToPrimary !== 'Self');
                  
            setHousehold(householdData);

        } catch (err) {
            setError(err.message);
            setHousehold([]);
        } finally {
            setIsLoading(false);
        }
 

    }, [applicationId]);

    return {
        household,
        isLoading,
        error,
        loadHousehold
      };

};