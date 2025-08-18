import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, RefreshCw, Plus, Trash2, Trash } from 'lucide-react';
import Button from './Button';
import DateField from './Date'; // Assuming you have a Date component for date handling

const Household = ({ onClose, currentApplication }) => {

    // the radio button indicates whether they have a partner/spouse
    const [hasPartner, setHasPartner] = useState(null);
    // radio button indicates whether there are other  household members
    const [hasHousehold, setHasHousehold] = useState(null);
    const [hasValidHousehold, setHasValidHousehold] = useState(false);

    // used to indicate the state of saving
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
    const [lastSaved, setLastSaved] = useState(null); // timestamp of last save

    // Partner/Spouse data
    const [partner, setPartner] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: ''
    });

    // Additional household members is an array of non partner/spouse members
    const [householdMembers, setHouseholdMembers] = useState([]);
    
    
    const addHouseholdMember = () => {
            const newMember = {
                firstName: '',
                lastName: '',
                dob: '',
                relationship: '',
            };
            setHouseholdMembers([...householdMembers, newMember]);
        };

    const [partnerAgeValidationError, setPartnerAgeValidationError] = useState('');
    const [partnerEmailValidationError, setPartnerEmailValidationError] = useState('');

    const updatePartner = (field, value) => {
      // if updating the date of birth, validate that the spouse is an adult
      if (field === 'dob' && value) {
        const age = calculateAge(value);
        if (age < 19 ) {
          setPartnerAgeValidationError('Caregivers must be 19 years of age or older.');
          return;
        } else {
          setPartnerAgeValidationError('');
        }
      }

      //if (field === 'email' && value) { // TO DO: ADD EMAIL VALIDATION
  
      //}
      setPartner(prev => ({ ...prev, [field]: value }));
    };

    // auto save partner data
    useEffect(() => {
      const timer = setTimeout(() => {
        if (hasPartner && partner.firstName && partner.lastName && partner.dob && partner.email) {
          console.log('Auto-saving partner data:', partner);
          autoSavePartner();
      }
    }, 2000); // 2 seconds delay      

    return () => clearTimeout(timer); // reset the clock.

    }, [partner.firstName, partner.lastName, partner.dob, partner.email]);

    // auto save household members when they have completed data
    useEffect(() => {
      const saveCompletedMembers = async () => {
        for (const member of householdMembers) {
          const age = calculateAge(member.dob);
          const isAdult = age >= 19;

          // check if member is 'complete'

          const requiredFields =  [member.firstName, member.lastName, member.dob, member.relationship]
          const hasAllRequiredFields = requiredFields.every(field => field && field.trim() !== '');
          const hasEmailIfRequired = !isAdult || (isAdult && member.email && member.email.trim() !== '');
          
            // skip the post if it's incomplete
            if( !hasAllRequiredFields || !hasEmailIfRequired) {
              continue;
            }

            try {
              await saveHouseholdMemberDraft(member);
            } catch (error) {
              console.error('Failed to auto-save household member:', error);
            }
          }
        
      };

      const timer = setTimeout(() => {
        if (householdMembers.length > 0) {
          saveCompletedMembers();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }, [householdMembers, currentApplication]);

    // load existing household data on component mount
    useEffect(() => {
      const loadHouseholdData = async () => {
        if (!currentApplication) return;

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        try {
          const response = await fetch(`${API_BASE}/applications/${currentApplication}/household-members`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Failed to fetch household data');
          }

          const householdData = await response.json();

          console.log('Loaded household data:', householdData);

          const existingSpouse = householdData.find(member =>
            member.relationshipToPrimary === 'Spouse' 
          );

          if (existingSpouse) {
            setPartner({
              firstName: existingSpouse.firstName,
              lastName: existingSpouse.lastName,
              dob: existingSpouse.dateOfBirth ,
              email: existingSpouse.email,
              householdMemberId: existingSpouse.householdMemberId
            });
            setHasPartner(true);
          }

          const nonSpouseMembers = householdData.filter(member =>
            member.relationshipToPrimary !== 'Spouse'
          );

          if(nonSpouseMembers.length > 0) {
            const formattedMembers = nonSpouseMembers.map(member => ({
              householdMemberId: member.householdMemberId,
              firstName: member.firstName,
              lastName: member.lastName,
              dob: member.dateOfBirth,
              email: member.email,
              relationship: member.relationshipToPrimary
            }));
            // update the UI
            setHouseholdMembers(formattedMembers);
            console.log('Setting hasHousehold = true')
            setHasHousehold(true);

          } else {
            // none were found
            setHouseholdMembers([]);
            //setHasHousehold(false);
          }
          

        } catch (error) {
          console.error('Error loading household data:', error);
        }
      };

      loadHouseholdData();
    }, [currentApplication]);

    useEffect(() => {
      if (hasHousehold && householdMembers.length === 0) {
        addHouseholdMember(); // Ensure at least one member is present
      }
    }, [hasHousehold]);
    

    // delete a household member
    const deleteHouseholdMember = async (householdMemberId) => {
      if (!householdMemberId) {
        console.warn('No householdMemberId provided for deletion');
        return false;
      }

      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE}/applications/${currentApplication}/household-members/${householdMemberId}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log('Household member deleted successfully:', result);

        return true;
      } catch (error) {
        console.error('Error deleting household member:', error);
        return false;
      }

    }

    const autoSavePartner = async () => {
      setSaveStatus('saving');
      try {
        await savePartnerDraft(partner)
        setSaveStatus('saved');
        setLastSaved(new Date().toLocaleString());
      } catch (error) {
        setSaveStatus('error');
      }
    }

    const savePartnerDraft = async (partnerData) => {
      console.log('Saving partner draft:', partnerData);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${API_BASE}/applications/${currentApplication}/household-members`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: currentApplication,
          householdMemberId: partnerData.householdMemberId,
          relationshipToPrimary: 'Spouse',
          firstName: partnerData.firstName,
          lastName: partnerData.lastName,
          dateOfBirth: partnerData.dob,
          email: partnerData.email,
        }),
      });

      if (!response.ok) {
        let errorData = {};
        console.error('Failed to save partner draft:', response.status, response.statusText);
        try {
          errorData = await response.json();
        } catch (e) {
          console.warn('No JSON in error response', e);
        }
        console.error('Failed to save partner draft:', errorData);
        throw new Error(errorData.message || 'Failed to save partner draft');
      }

      const savedPartner = await response.json();

      // if we didn't have a householdMemberId, but the server returned one, update our state
      if(!partnerData.householdMemberId && savedPartner.householdMemberId) {
        setPartner(prev => ({ 
          ...prev, 
          householdMemberId: savedPartner.householdMemberId 
        }));
      }

      console.log('Partner draft saved successfully');

      return savedPartner;
    };

    // helper function to calculate age from date of birth
    const calculateAge = (dob) => {
      if(!dob) return 0;
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // if the birth month is later than this month
      // or there is less than a month until their birthday
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        // then we need to subtract from their age because it hasn't been their birthday yet this year
        age--;
      }
      return age;
    }

    const validateEmail = (email) => {
      if(!email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.trim());
    }

    const saveHouseholdMemberDraft = async (memberData) => {
      console.log('Saving household member draft:', memberData);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      try {
        const response = await
        fetch(`${API_BASE}/applications/${currentApplication}/household-members`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                applicationId: currentApplication,
                householdMemberId: memberData.householdMemberId,
                relationshipToPrimary: memberData.relationship,
                firstName: memberData.firstName,
                lastName: memberData.lastName,
                dateOfBirth: memberData.dob,
                email: memberData.email, // no email is required if under 19
              }),
            });

      if(!response.ok) {
        let errorData = {};
        console.log('Failed to save household member draft:', response.status, response.statusText);
  
      }

      const savedMember = await response.json();

      // update householdMememberId if it was generated by backend
      if (!memberData.householdMemberId && savedMember.householdMemberId) {
        setHouseholdMembers(prev => prev.map(member => 
          member === memberData ? { ...member, householdMemberId: savedMember.householdMemberId } : member
        ));
      }
      console.log('Household member draft saved successfully');
      return savedMember;

      } catch (error) {
        console.error('Error saving household member', error);
        throw error;
      }
    }


    const removeHouseholdMember = async(householdMemberId) => {
      // if the member has a householdMemberId, delete it from the DB
      if (householdMemberId) {
        const deleted = await deleteHouseholdMember(householdMemberId);
        if (!deleted) {
          console.error('Failed to delete household member from backend');
          return;
        }
      }
      // remove from frontend state
      setHouseholdMembers(householdMembers.filter(member => member.householdMemberId !== householdMemberId));
    };

    const removeSpouse = async() => {
      // if there is a spouse identified, delete it from the DB
      if (partner.householdMemberId) {
        const deleted = await deleteHouseholdMember(partner.householdMemberId);
        if (!deleted) {
          console.error('Failed to delete spouse from backend');
          return false;
        }

        // clear partner state after successful deletion
        setPartner({
          firstName: '',
          lastName: '',
          dob: '',
          email: '',
          householdMemberId: null
        });

        console.log('spouse removed successfully');
        return true;
      }
      console.log('no spouse to remove');
      return true;
    };
    


    const updateHouseholdMember = (identifier, field, value) => {
        // before we've saved a household member, they won't have a householdMemberID
        // so we'll need to see if we're using the index or not
        setHouseholdMembers(householdMembers.map((member, index) => {
          const matches = member.householdMemberId 
          ? member.householdMemberId === identifier  
          : index === identifier;
          return matches ? {...member, [field]: value} : member;
        }
        ));
    };

    const saveHousehold = () => {
      alert("SAVING!");
    };

    return (
        <div className="form-container">

        <form>
        <fieldset className="form-group">
          <legend>
            <label className="form-label">
              Do you have a spouse or partner?<span className="required">*</span>
            </label>
          </legend>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="hasPartner"
                value="yes"
                checked={hasPartner === true}
                onChange={() => setHasPartner(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="hasPartner"
                value="no"
                checked={hasPartner === false}
                onChange={async () => {
                  // if switching from yes to no, remove the spouse
                  if (hasPartner === true) {
                    await removeSpouse();
                  }
                  setHasPartner(false)
                }}
              />
              No
            </label>
          </div>
          <div className="helper-text">Helper text goes here</div>
        </fieldset>
        {hasPartner && (
         <>
                   <div className="household-section">

            <div className="household-member-form">
                <div className="member-header">
                  <h3>Spouse/Partner</h3>
                </div>          
                <div className="form-group">
                  <label htmlFor="partner-firstName" className="form-control-label">
                    First Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="partner-firstName"
                    value={partner.firstName}
                    onChange={(e) => updatePartner('firstName', e.target.value)}
                    className="form-control"
                  />
                  <label htmlFor="partner-lastName" className="form-control-label">
                    Last Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="partner-lastName"
                    value={partner.lastName}
                    onChange={(e) => updatePartner('lastName', e.target.value)}
                    className="form-control"
                  />
                  <label htmlFor="partner-dob" className="form-control-label">
                        Date of Birth<span className="required">*</span>
                    </label>
                        <DateField 
                          id="partner-dob"
                          variant='adult'
                          value={partner.dob}
                          required
                          onChange={(e) => updatePartner('dob', e.target.value)}
                          />
                    <label htmlFor="partner-dob" className="form-control-validation-label">
                      {partnerAgeValidationError}
                    </label>
                    <label htmlFor="partner-email" className="form-control-label">
                      Email<span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="partner-email"
                      value={partner.email}
                      onChange={(e) => updatePartner('email', e.target.value)}
                      className="form-control"
                    />
                    <label htmlFor="partner-dob" className="form-control-validation-label">
                      {partnerEmailValidationError}
                    </label>
                  </div>
                  </div>
          </div>
        </>
        )}

          <fieldset className="form-group">
          <legend>
            <label className="form-label">
              Do you have anyone else living your primary residence?<span className="required">*</span>
            </label>
          </legend>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="hasHousehold"
                value="yes"
                checked={hasHousehold === true}
                onChange={() => setHasHousehold(true)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="hasHousehold"
                value="no"
                checked={hasHousehold === false}
                onChange={() => setHasHousehold(false)}
              />
              No
            </label>
          </div>
          <div className="helper-text">Helper text goes here</div>
        </fieldset>
        {hasHousehold && (
         <>
          <div className="household-section">
            <div className="section-header">
              <h2 className="section-header-title">Other persons in your home</h2>
            </div>
            <div className="section-description">
              <p>
              All persons 18 years or older in your home will be required to consent to background checks before your application can be approved. Once you submit your application, we’ll send them an email asking them to log in with their BC Services Card to provide those consents.
              </p>
            </div>
            
            {householdMembers.length === 0 && (
              <div className="empty-state">
                <p>No household members added yet. Click "Add Member" to start.</p>
              </div>
            )}
            
            {householdMembers.map((member, index) => (
              <div key={member.householdMemberId || `new-member-${index}`} className="household-member-form">
                <div className="member-header">
                  <h3>Person {index + 1}</h3>
             
                  <Button
                    type="button"
                    onClick={() => removeHouseholdMember(member.householdMemberId)}
                    variant="section-header"
                    aria-label="Remove household member"
                  >
                    Remove <Trash size={16} />
                  </Button>
                  
                </div>
                
                <div className="form-group">
                <label htmlFor={`member-${member.householdMemberId}-relationship`} className="form-control-label">
                    Relationship to Applicant<span className="required">*</span>
                  </label>
                  <select
                    id={`member-${member.householdMemberId}-relationship`}
                    value={member.relationship}
                    onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'relationship', e.target.value)}
                  >
                    <option value="">Select relationship</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Boarder">Boarder</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="helper-text">
                    Select how this person is related to you.
                  </div>                  
                  <label htmlFor={`member-${member.householdMemberId}-firstName`} className="form-control-label">
                    First Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.householdMemberId}-firstName`}
                    value={member.firstName}
                    onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'firstName', e.target.value)}
                    className="form-control"
                  />
                  
                  <label htmlFor={`member-${member.householdMemberId}-lastName`} className="form-control-label">
                    Last Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.householdMemberId}-lastName`}
                    value={member.lastName}
                    onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'lastName', e.target.value)}
                    className="form-control"
                  />

                  <label htmlFor={`member-${member.householdMemberId}-dob`} className="form-control-label">
                    Date of Birth<span className="required">*</span>
                  </label>
                  <DateField 
                    id={`member-${member.householdMemberId}-dob`}
                    variant='past'
                    value={member.dob}
                    required
                    onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'dob', e.target.value)}
                  />

                  {calculateAge(member.dob) >= 19 && (
                    <>
                  <label htmlFor={`member-${member.householdMemberId}-email`} className="form-control-label">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.householdMemberId}-email`}
                    value={member.email}
                    onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'email', e.target.value)}
                    className="form-control-label"
                  />
                  <div className="helper-text">
                    Household members older than 18 will be required to consent to background checks before your application can be processed.
                  </div>    
                  </>
                  )}
                </div>
        
              </div>
            ))}
              <div className="section-header">
              <Button type="button" variant="primary" onClick={addHouseholdMember}>
                <Plus size={16} />
                Add another person
              </Button>

            </div>
          </div>
        </>
        )}

        
        <div style={{color: 'red', padding: '10px', background: '#fee'}}>
        {saveStatus}
        </div>

              <Button type="button" variant={hasValidHousehold ? 'primary' : 'disabled' } onClick={saveHousehold}>
                
                Save Household
              </Button>
        </form>
      </div>
    );

};
    
export default Household;