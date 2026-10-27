import { useState, useEffect } from 'react';
import { useUserProfile } from './useUserProfile';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

// adult household members on the resource case; filtering is done server-side
export const useHouseholdContacts = () => {
    const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();
    const hasResourceCase = !!userProfile?.resource_case_active_date;

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (profileLoading) return;
      if (!hasResourceCase) {
        setLoading(false);
        return;
      }
      let cancelled = false;
      (async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/resource-case/household-contacts`, {
            credentials: 'include',
          });
          if (!res.ok) throw new Error(`Failed to load household contacts: ${res.status}`);
          const data = await res.json();
          if (!cancelled) {
            setContacts(data);
            setError(null);
          }
        } catch (err) {
          if (!cancelled) setError(err.message);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [profileLoading, hasResourceCase]);

    return {
      contacts,
      hasResourceCase,
      loading: profileLoading || loading,
      error: profileError || error,
    };
  };
