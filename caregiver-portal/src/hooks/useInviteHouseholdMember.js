import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const useInviteHouseholdMember = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const inviteMember = async (applicationId, householdMemberId) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(
                `${API_BASE_URL}/application/${applicationId}/household/${householdMemberId}/invite`,
                {
                  method: 'POST',
                  credentials: 'include',
                  headers: { 'Content-Type': 'application/json' }
                }
              );

            if (!response.ok) {
                throw new Error(`Http error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
            
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };
    return { inviteMember, isLoading, error };
}