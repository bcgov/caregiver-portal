import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader2, RefreshCw, Plus, Trash2, Trash } from 'lucide-react';
import Button from './Button';
import DateField from './Date'; 
import { useHousehold } from '../hooks/useHousehold';

const Household = ({ applicationPackageId, applicationFormId }) => {

  const {
    partner,
    householdMembers,
    saveStatus,
    lastSaved,
    hasHousehold,
    hasPartner,
    updatePartner,
    updateHouseholdMember,
    addHouseholdMember,
    removeHouseholdMember,
    removePartner,
    calculateAge,
    saveHouseholdMember,
    loadHousehold,
    setHasHousehold,
    setHasPartner,
    loadApplicationPackage,
    } = useHousehold({ applicationPackageId, applicationFormId });

    // UI state only (not data state)
    //const [hasPartner, setHasPartner] = useState(null);
    //const [hasHousehold, setHasHousehold] = useState(null);
    const [partnerAgeValidationError, setPartnerAgeValidationError] = useState('');
    const [partnerEmailValidationError, setPartnerEmailValidationError] = useState('');
    const [memberEmailValidationErrors, setMemberEmailValidationErrors] = useState({});
    const [fieldLengthErrors, setFieldLengthErrors] = useState({});
    const [duplicateError, setDuplicateError] = useState('');
    const savingMembersRef = useRef(new Set());

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const MAX_NAME_LENGTH = 50;
    const MAX_EMAIL_LENGTH = 255;

      // Validate email format
    const validateEmail = (email, fieldKey) => {
      if (!email) {
        setEmailValidationErrors(prev => ({ ...prev, [fieldKey]: '' }));
        return true;
      }

      if (!EMAIL_REGEX.test(email)) {
        setEmailValidationErrors(prev => ({
          ...prev,
          [fieldKey]: 'Please enter a valid email address'
        }));
        return false;
      }

      setEmailValidationErrors(prev => ({ ...prev, [fieldKey]: '' }));
      return true;
    };

    // Validate field length
    const validateFieldLength = (value, maxLength, fieldName, fieldKey) => {
    if (value && value.length > maxLength) {
      setFieldLengthErrors(prev => ({
        ...prev,
        [fieldKey]: `${fieldName} cannot exceed ${maxLength} characters`
      }));
      return false;
    }

    setFieldLengthErrors(prev => ({ ...prev, [fieldKey]: '' }));
    return true;
    };

      // Check for duplicate household member
  const checkForDuplicate = (firstName, lastName, dob, currentMemberId = null) => {
    if (!firstName || !lastName || !dob) {
      return false;
    }

    const firstInitial = firstName.charAt(0).toUpperCase();
    const normalizedLastName = lastName.toLowerCase().trim();

    // Check partner
    if (hasPartner && partner.firstName && partner.lastName && partner.dob) {
      if (currentMemberId !== 'partner') {
        const partnerFirstInitial = partner.firstName.charAt(0).toUpperCase();
        const partnerLastName = partner.lastName.toLowerCase().trim();

        if (
          partnerFirstInitial === firstInitial &&
          partnerLastName === normalizedLastName &&
          partner.dob === dob
        ) {
          return {
            isDuplicate: true,
            name: `${partner.firstName} ${partner.lastName}`,
          };
        }
      }
    }

    // Check other household members
    for (const member of householdMembers) {
      if (currentMemberId && member.householdMemberId === currentMemberId) {
        continue; // Skip self
      }

      if (member.firstName && member.lastName && member.dob) {
        const memberFirstInitial = member.firstName.charAt(0).toUpperCase();
        const memberLastName = member.lastName.toLowerCase().trim();

        if (
          memberFirstInitial === firstInitial &&
          memberLastName === normalizedLastName &&
          member.dob === dob
        ) {
          return {
            isDuplicate: true,
            name: `${member.firstName} ${member.lastName}`,
          };
        }
      }
    }

    return { isDuplicate: false };
  };

    // set initial UI state based on loaded data

    useEffect(() => {
      loadApplicationPackage();
    }, [loadApplicationPackage]);

    useEffect(() => {
      console.log('Radio button states:', { hasPartner, hasHousehold });
    }, [hasPartner, hasHousehold]);

    useEffect(() => {
      if (hasHousehold && householdMembers.length === 0) {
        addHouseholdMember(); // Ensure at least one member is present
      }
    }, [hasHousehold, householdMembers.length, addHouseholdMember]);

    // updatePartner with age validation
    const handleUpdatePartner = (field, value) => {
      // Field length validation
      if (field === 'firstName' || field === 'lastName') {
        if (!validateFieldLength(value, MAX_NAME_LENGTH, field === 'firstName' ? 'First name' : 'Last name', `partner-${field}`)) {
          return; // Don't update if too long
        }
      }
      // field length check for email
      if (field === 'email') {
        if (value && value.length > MAX_EMAIL_LENGTH) {
          setFieldLengthErrors(prev => ({
            ...prev,
            'partner-email': `Email cannot exceed ${MAX_EMAIL_LENGTH} characters`
          }));
          return;
        }
        validateEmail(value, 'partner-email');
      }

    // Age validation for DOB
    if (field === 'dob' && value) {
      const age = calculateAge(value);
      if (age < 19) {
        setPartnerAgeValidationError('Caregivers must be 19 years of age or older.');
        updatePartner(field, value);
        return;
      } else {
        setPartnerAgeValidationError('');
      }

      // Duplicate check
      const dupCheck = checkForDuplicate(partner.firstName, partner.lastName, value, 'partner');
      if (dupCheck.isDuplicate) {
        setDuplicateError(`This person (${dupCheck.name}) has already been added to your household.`);
        return;
      } else {
        setDuplicateError('');
      }
    }

    // Check for duplicates when name changes
    if ((field === 'firstName' || field === 'lastName') && partner.dob) {
      const firstName = field === 'firstName' ? value : partner.firstName;
      const lastName = field === 'lastName' ? value : partner.lastName;
      const dupCheck = checkForDuplicate(firstName, lastName, partner.dob, 'partner');

      if (dupCheck.isDuplicate) {
        setDuplicateError(`This person (${dupCheck.name}) has already been added to your household.`);
        updatePartner(field, value);
        return;
      } else {
        setDuplicateError('');
      }
    }

    updatePartner(field, value);
  };

    // auto save partner data
    useEffect(() => {
      const timer = setTimeout(() => {
        if (hasPartner && partner.firstName && partner.lastName && partner.dob && partner.email && partner.relationship) {
          console.log('Auto-saving partner data:', partner);
          saveHouseholdMember(partner).catch(console.error);
      }
    }, 2000); // 2 seconds delay      

    return () => clearTimeout(timer); // reset the clock.

    }, [partner.firstName, partner.lastName, partner.dob, partner.email, hasPartner, partner, saveHouseholdMember]);

    // auto save household members when they have completed data
    useEffect(() => { 
      const timer = setTimeout(() => {
        if (householdMembers.length > 0) {
          for (const member of householdMembers) {
            const age = calculateAge(member.dob);
            const isAdult = age >= 19;
            const isComplete = member.firstName && member.lastName && member.dob && member.relationship;
            const hasEmailIfAdult = !isAdult || (isAdult && member.email);
            const hasGenderIfNotAdult = isAdult || (!isAdult && member.genderType);

            if (isComplete && hasEmailIfAdult && hasGenderIfNotAdult && member.isDirty) {
              const memberId = member.householdMemberId || `temp-${member.index}`;
          
              if (!savingMembersRef.current.has(memberId)) {
                console.log('Auto-saving household member:', member);
                savingMembersRef.current.add(memberId);
          
                saveHouseholdMember(member)
                  .then(() => {
                    updateHouseholdMember(member.householdMemberId || householdMembers.indexOf(member), 'isDirty', false);
                    savingMembersRef.current.delete(memberId);
                  })
                  .catch((error) => {
                    console.error(error);
                    savingMembersRef.current.delete(memberId);
                  });
              }
            }

            }
          //setLastSaved(new Date().toLocaleString());
        }}, 2000);
      return () => clearTimeout(timer);
    }, [householdMembers, saveHouseholdMember, calculateAge, updateHouseholdMember]);

    const handleRemovePartner = async () => {
      if (hasPartner && partner.firstName && partner.lastName && partner.dob && partner.email) {
        await removePartner();
      }
      setHasPartner(false);
    };

    useEffect(() => {
      loadHousehold();
  }, [loadHousehold]);

    return (
        <div className="form-container">

        <form>
        <fieldset className="form-group">

          <div className="radio-button-group">
            <div className="radio-button-header">Do you have a spouse or partner?<span className="required">*</span></div>
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
                    await handleRemovePartner();
                  }
                  setHasPartner(false)
                }}
              />
              No
            </label>
        </div>
          
        {hasPartner && (
         <>
            <h3 className="form-group-header">My spouse/partner</h3>
              <div className="section-description">
              Your spouse/partner will be named as a co-applicant. They will be required to log into the Portal separately to provide information and consents and sign a declaration.
              </div>
              <div className="field-group">
              <label htmlFor={`partner-relationship`} className="form-control-label">
                    Relationship to you<span className="required">*</span>
                  </label>
                  <select
                    id={`partner-relationship`}
                    value={partner.relationship}
                    onChange={(e) => handleUpdatePartner('relationship', e.target.value)}
                  >
                    <option value="">Select relationship</option>
                    <option value="Common law">Common law</option>
                    <option value="Partner">Partner</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                <div className="field-control">
                <label htmlFor="partner-firstName" className="form-control-label">
                  First Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="partner-firstName"
                  value={partner.firstName}
                  onChange={(e) => handleUpdatePartner('firstName', e.target.value)}
                  className="form-control"
                />
                </div>
                <div className="field-control">
                <label htmlFor="partner-lastName" className="form-control-label">
                  Last Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="partner-lastName"
                  value={partner.lastName}
                  onChange={(e) => handleUpdatePartner('lastName', e.target.value)}
                  className="form-control"
                />
                </div>
                <div className="field-control">
                <label htmlFor="partner-dob" className="form-control-label">
                      Date of Birth<span className="required">*</span>
                </label>
                <DateField 
                  id="partner-dob"
                  variant='adult'
                  value={partner.dob}
                  required
                  onChange={(e) => handleUpdatePartner('dob', e.target.value)}
                  />
                <label htmlFor="partner-dob" className="form-control-validation-label">
                  {partnerAgeValidationError}
                </label>
                </div>
                <div className="field-control">
                <label htmlFor="partner-email" className="form-control-label">
                  Email<span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="partner-email"
                  value={partner.email}
                  onChange={(e) => handleUpdatePartner('email', e.target.value)}
                  className="form-control"
                />
                <label htmlFor="partner-dob" className="form-control-validation-label">
                  {partnerEmailValidationError}
                </label>
                </div>
               </div> 
        </>
        )}
        </fieldset>

        <fieldset className="form-group">
          <div className="radio-button-group">
            <div className="radio-button-header">
              Do you have anyone else living your primary residence?<span className="required">*</span>
            </div>
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
      

        {hasHousehold && (
         <>
          <div className="household-section">


            <h3 className="form-group-header">Other persons in your home</h3>
        
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
                
                <div className="form-sub-group">
                <label htmlFor={`member-${member.householdMemberId}-relationship`} className="form-control-label">
                    Relationship to you<span className="required">*</span>
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
                  {calculateAge(member.dob) < 19 && member.dob && (
                      <div className="field-control">
                        <div className="radio-button-group">
                          <div className="radio-button-header">Gender<span className="required">*</span></div>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Man/Boy"
                              checked={member.genderType === "Man/Boy"}
                              onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Man/Boy
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Woman/Girl"
                              checked={member.genderType === "Woman/Girl"}
                              onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Woman/Girl
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Non-Binary"
                              checked={member.genderType === "Non-Binary"}
                              onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Non-Binary
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Prefer not to say"
                              checked={member.genderType === "Prefer not to say"}
                              onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Prefer not to say
                          </label>
                        </div>
                      </div>
                    )}
                  {calculateAge(member.dob) >= 19 && (
                    <div className="field-control">
                  <label htmlFor={`member-${member.householdMemberId}-email`} className="form-control-label">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.householdMemberId}-email`}
                    value={member.email}
                    onChange={(e) => updateHouseholdMember(member.householdMemberId || index, 'email', e.target.value)}
                    className="form-control"
                  />    
                  </div>
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
        </fieldset>
        
        <div style={{color: 'red', padding: '10px', background: '#fee'}}>
        {saveStatus}
        {lastSaved}
        </div>

        </form>
      </div>
    );

};
    
export default Household;