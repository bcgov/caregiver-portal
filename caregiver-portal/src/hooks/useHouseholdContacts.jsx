import { useState, useEffect, useCallback } from 'react';
import { useUserProfile } from './useUserProfile';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

// adult household members on the resource case; filtering is done server-side
export const useHouseholdContacts = () => {
    const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();
    const hasResourceCase = !!userProfile?.resource_case_active_date;
    const caseOpenDate = userProfile?.resource_case_active_date ?? null;

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

    // Throws an Error with a displayable message when the request fails.
    const removeContact = useCallback(async (caseContactId, departureDate) => {
        const res = await fetch(
          `${API_BASE_URL}/resource-case/household-contacts/${encodeURIComponent(caseContactId)}/removal`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ departure_date: departureDate }),
          },
        );
        if (!res.ok) {
            let message;
            try {
              const body = await res.json();
              message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
            } catch {
              // no JSON body; fall through to the default message
            }
            throw new Error(message || 'We could not submit your request. Please try again.');
          }
          setContacts((prev) =>
            prev.map((c) =>
              c.case_contact_id === caseContactId
                ? { ...c, removal_requested: true, removal_departure_date: departureDate }
                : c,
            ),
          );
        }, []);

        return {
            contacts,
            hasResourceCase,
            caseOpenDate,
            removeContact,
            loading: profileLoading || loading,
            error: profileError || error,
          };
        };
