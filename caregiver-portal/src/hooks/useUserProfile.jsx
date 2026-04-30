import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api';

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user profile: ${response.status}`);
        }

        const data = await response.json();
        setUserProfile(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const getHouseholdMemberScreeningStatus = useCallback(async () => {                                                            
    try {                                     
      const response = await fetch(`${API_BASE_URL}/household/members`, {                                            
        method: 'GET',                                                                                               
        credentials: 'include',                                                                                      
        headers: { 'Content-Type': 'application/json' },                                                             
      });                                                                                                            
      if (!response.ok) {
        throw new Error(`Failed to fetch household member screening status: ${response.status}`);                    
      }                                   
      return await response.json();
    } catch (err) {                                                                                                  
      console.error('Error fetching household member screening status:', err);
      return [];                                                                                                     
    }             
  }, []);                                                                                                                 
  

  return { userProfile, loading, error, getHouseholdMemberScreeningStatus };
};