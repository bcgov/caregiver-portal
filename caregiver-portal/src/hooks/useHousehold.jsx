import { useState, useCallback} from 'react';
import { useDates } from './useDates';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useHousehold = ({applicationPackageId}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {calculateAge} = useDates();

    const [partner, setPartner] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        relationship: '',
        householdMemberId: null
    });

    //const [allMembers, setAllMembers] = useState([]);   // all household members (excludes "self")
    const [householdMembers, setHouseholdMembers] = useState([]); // all non-spouse household members 
    const [hasPartner, setHasPartner] = useState(null);
    const [hasHousehold, setHasHousehold] = useState(null);
 
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
    const [lastSaved, setLastSaved] = useState(null);

      // Add function to load application package
  const loadApplicationPackage = useCallback(async () => {
    try {
      console.log('Loading application package for:', applicationPackageId); 
      const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Response status:', response.status); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Application package data:', data);

      setHasPartner(data.hasPartner === "true" ? true : data.hasPartner === "false" ? false : null);
      setHasHousehold(data.hasHousehold === "true" ? true : data.hasHousehold === "false" ? false : null);
    } catch (err) {
      console.error('Error loading application package:', err);
    }
  }, [applicationPackageId]);

  // Add function to save radio button state
  const saveRadioButtonState = useCallback(async (field, value) => {
    try {
      await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ [field]: value })
      });
    } catch (err) {
      console.error('Error saving radio button state:', err);
    }
  }, [applicationPackageId]);

    const loadHousehold = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/household-members`, {
              method: 'GET',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // remove primary applicant from household data
            const householdData = data.filter(member => member.relationshipToPrimary !== 'Self'); 
            console.log("Loaded household data: ", householdData);
            // find partner/spouse in household data
            const existingPartner = data.find(member => member.relationshipToPrimary === 'Spouse' || member.relationshipToPrimary === 'Common law' || member.relationshipToPrimary === 'Partner'); // TO DO: Add 'Common-law', 'Partner' when available in dropdown
            if (existingPartner) {
                setPartner({
                    firstName: existingPartner.firstName,
                    lastName: existingPartner.lastName,
                    dob: existingPartner.dateOfBirth,
                    email: existingPartner.email,
                    relationship: existingPartner.relationshipToPrimary,
                    genderType: existingPartner.genderType || '',
                    householdMemberId: existingPartner.householdMemberId,
                    requireScreening: existingPartner.requireScreening,
                    screeningInfoProvided: existingPartner.screeningInfoProvided,
                    userId: existingPartner.userId,
                });
            }
            // find non-spouse members
            const nonPartnerMembers = householdData.filter(member => member.relationshipToPrimary !== 'Spouse' && member.relationshipToPrimary !== 'Common law' && member.relationshipToPrimary !== 'Partner');
            if(nonPartnerMembers.length > 0) {
                const formattedMembers = nonPartnerMembers.map(member => ({
                    householdMemberId: member.householdMemberId,
                    firstName: member.firstName,
                    lastName: member.lastName,
                    dob: member.dateOfBirth,
                    email: member.email,
                    relationship: member.relationshipToPrimary,
                    genderType: member.genderType || '',
                    requireScreening: member.requireScreening,
                    screeningInfoProvided: member.screeningInfoProvided,
                    userId: member.userId,

                }));
                setHouseholdMembers(formattedMembers);
            } else {
                setHouseholdMembers([]);
            }
            
            //setHousehold(householdData);

        } catch (err) {
            setError(err.message);
            setHouseholdMembers([]);
        } finally {
            setIsLoading(false);
        }
    }, [applicationPackageId]);

    const saveHouseholdMember = useCallback(async (memberData) => {
        setSaveStatus('Updating household records.');
        try {

            const requestBody = {
                applicationPackageId: applicationPackageId,
                householdMemberId: memberData.householdMemberId,
                firstName: memberData.firstName,
                lastName: memberData.lastName,
                dateOfBirth: memberData.dob,
                email: memberData.email,
                relationshipToPrimary: memberData.relationship,
            };
          
            // Only include genderType if it has a value
            if (memberData.genderType && memberData.genderType !== '') {
                requestBody.genderType = memberData.genderType;
            }          

            const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/household-members`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
                });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Check if it's a duplicate error from backend
                if (errorData.message && errorData.message.includes('duplicate')) {
                    throw new Error('DUPLICATE:' + errorData.message);
                }
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const savedMember = await response.json();
            // update the appropriate state based on relationship type
            if (memberData.relationship === 'Spouse' || memberData.relationship === 'Partner' || memberData.relationship === 'Common law') { 
                if(!memberData.householdMemberId && savedMember.householdMemberId) {
                    setPartner(prev => ({...prev, householdMemberId: savedMember.householdMemberId}));
                }
            } 

            setSaveStatus('Household record updated.');
            setLastSaved(new Date().toLocaleString());
            //console.log(`${memberData.relationship} saved:`);
            return savedMember;
        } catch(error) {
            setSaveStatus('There are errors with the form that are preventing it from being saved.');
            console.error('Error saving household member:', error);
            throw error;
        }
    }, [applicationPackageId]);

    const deleteHouseholdMember = useCallback(async (householdMemberId) => {
        if (!householdMemberId) {
            console.error('No householdMemberId provided for deletion.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/household-members/${householdMemberId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            console.error('Error deleting household member:', error);
            return false;
        }
    }, [applicationPackageId]);


    const addHouseholdMember = useCallback(() => {
        const newMember = {
            firstName: '',
            lastName: '',
            dob: '',
            relationship: '',
            email: '',
            genderType: '',
            householdMemberId: null
        };
        setHouseholdMembers(prev => [...prev, newMember]);
    }, []);
  
    const updatePartner = useCallback((field, value) => {
        setPartner(prev => ({ ...prev, [field]: value }));
    }, []);
  
    const updateHouseholdMember = useCallback((identifier, field, value) => {
        setHouseholdMembers(prev =>
            prev.map((member, index) => {
                const matches = member.householdMemberId
                    ? member.householdMemberId === identifier
                    : index === identifier;
                    if (matches) {
                        let updatedMember = { ...member, [field]: value };
                        // Clear gender/email when crossing adult/non-adult boundary
                        
                        if (field === 'dob' && value) {
                            const newAge = calculateAge(value);
                            const oldAge = member.dob ? calculateAge(member.dob) : 0;
                            // Changed from non-adult to adult - clear gender
                            if (oldAge < 19 && newAge >= 19) {
                                updatedMember.genderType = '';
                            }
                            // Changed from adult to non-adult - clear email
                            else if (oldAge >= 19 && newAge < 19) {
                                updatedMember.email = '';
                            }
                        }
                        
                        // Don't set isDirty when we're updating the isDirty field itself
                        if (field === 'isDirty') {
                            return updatedMember;
                        } else {
                            return { ...updatedMember, isDirty: true };
                        }
                    }
                    return member;
            })
        );
    }, [calculateAge]);
  
    const removeHouseholdMember = useCallback(async (householdMemberId) => {
        if (householdMemberId) {
            const deleted = await deleteHouseholdMember(householdMemberId);
            if (!deleted) {
                console.error('Failed to delete household member from backend');
                return;
            }
        }
        setHouseholdMembers(prev =>
            prev.filter(member => member.householdMemberId !== householdMemberId)
        );
    }, [deleteHouseholdMember]);
  
    const removePartner = useCallback(async () => {
        if (partner.householdMemberId) {
            const deleted = await deleteHouseholdMember(partner.householdMemberId);
            if (!deleted) {
                console.error('Failed to delete spouse from backend');
                return false;
            }
        }
  
        setPartner({
            firstName: '',
            lastName: '',
            dob: '',
            email: '',
            householdMemberId: null
        });
  
        return true;
    }, [partner.householdMemberId, deleteHouseholdMember]);

  // Check if household data is complete
  const isHouseholdComplete = useCallback(() => {
    // If user said no partner and no household, that's complete
    if (hasPartner === false && hasHousehold === false) {
      return true;
    }

    // Check partner if they have one
    if (hasPartner === true) {
      if (!partner.firstName || !partner.lastName || !partner.dob || !partner.email ||
  !partner.relationship) {
        return false;
      }
    }

    // Check household members if they have any
    if (hasHousehold === true) {
      if (householdMembers.length === 0) {
        return false;
      }

      for (const member of householdMembers) {
        const age = calculateAge(member.dob);
        const isAdult = age >= 19;

        // Check required fields
        if (!member.firstName || !member.lastName || !member.dob || !member.relationship) {
          return false;
        }

        // Adults need email
        if (isAdult && !member.email) {
          return false;
        }

        // Children need gender
        if (!isAdult && !member.genderType) {
          return false;
        }
      }
    }

    return true;
  }, [hasPartner, hasHousehold, partner, householdMembers, calculateAge]);    

    const loadHouseholdMember = useCallback(async (householdMemberId) => {
        if (!householdMemberId) {
            console.error('No householdMemberId provided for deletion.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}/household-members/${householdMemberId}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error deleting household member:', error);
            return false;
        }
    }, [applicationPackageId]);

    const getAccessCode = useCallback(async (householdMemberId) => {
        if (!householdMemberId) {
            console.error('No householdMemberId provided for access code retrieval');
            return null;
        }
        try {
            const response = await fetch(
                `${API_BASE_URL}/application-package/${applicationPackageId}/household-members/${householdMemberId}/access-code`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            if (!response.ok) {
                // If 404, there's no access code yet
                if (response.status === 404) {
                    return null;
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
  
            const data = await response.json();
            return data; // Returns { accessCode, expiresAt, isUsed, attemptCount }
        } catch (error) {
            console.error('Error fetching access code:', error);
            return null;
        }
    }, [applicationPackageId]);



  
    return {
        // state
        partner,
        householdMembers,
        isLoading,
        error,
        saveStatus,
        lastSaved,
        hasPartner,
        hasHousehold,
        // setters
        setHasPartner: (value) => {
            setHasPartner(value);
            saveRadioButtonState('hasPartner', value);
        },
        setHasHousehold: (value) => {
            setHasHousehold(value);
            saveRadioButtonState('hasHousehold', value);
        },
        
        // actions
        saveHouseholdMember,
        addHouseholdMember,
        updatePartner,
        updateHouseholdMember,
        removeHouseholdMember,
        removePartner,
        loadHousehold,
        loadHouseholdMember,
        loadApplicationPackage,
        getAccessCode,
        isHouseholdComplete,
      };

};