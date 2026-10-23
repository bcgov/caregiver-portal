import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';

// adult household members on the resource case, as synced from ICM at login
export const useHouseholdContacts = () => {
    const { userProfile, loading, error } = useUserProfile();

    const contacts = useMemo(() => {
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time
      return (userProfile?.household_contacts ?? []).filter(
        (c) => !c.is_relief_provider && (!c.contact_end_date || c.contact_end_date > today),
      );
    }, [userProfile]);

    return {
      contacts,
      hasResourceCase: !!userProfile?.resource_case_active_date,
      loading,
      error,
    };
  };
