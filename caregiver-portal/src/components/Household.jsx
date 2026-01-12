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
    const [partnerAgeValidationError, setPartnerAgeValidationError] = useState('');
    const [emailValidationErrors, setEmailValidationErrors] = useState({});
    const [fieldLengthErrors, setFieldLengthErrors] = useState({});
    const [duplicateErrors, setDuplicateErrors] = useState({});
    const savingMembersRef = useRef(new Set());

    const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

  // Validate age is within acceptable range
  const validateAge = (dob, fieldKey) => {
    if (!dob) {
      return true;
    }

    const age = calculateAge(dob);

    if (age > 95) {
      setFieldLengthErrors(prev => ({
        ...prev,
        [fieldKey]: 'Age cannot exceed 95 years'
      }));
      return false;
    }

    setFieldLengthErrors(prev => ({ ...prev, [fieldKey]: '' }));
    return true;
  }; 

    // Check if a required field is empty
    const isFieldEmpty = (value) => {
      return !value || value.trim() === '';
    };
  
  // Get error class for empty required fields
  const getFieldErrorClass = (value) => {
    return isFieldEmpty(value) ? 'form-control-error' : '';
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

    //console.log("checking for duplicate")

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

    //useEffect(() => {
    //  console.log('Radio button states:', { hasPartner, hasHousehold });
    //}, [hasPartner, hasHousehold]);

    useEffect(() => {
      if (hasHousehold && householdMembers.length === 0) {
        addHouseholdMember(); // Ensure at least one member is present
      }
    }, [hasHousehold, householdMembers.length, addHouseholdMember]);

// Re-validate all duplicates when household data changes
useEffect(() => {
  const newDuplicateErrors = {};

  // Validate partner against household members
  if (hasPartner && partner.firstName && partner.lastName && partner.dob) {
    const firstInitial = partner.firstName.charAt(0).toUpperCase();
    const normalizedLastName = partner.lastName.toLowerCase().trim();

    for (const member of householdMembers) {
      if (member.firstName && member.lastName && member.dob) {
        const memberFirstInitial = member.firstName.charAt(0).toUpperCase();
        const memberLastName = member.lastName.toLowerCase().trim();

        if (
          memberFirstInitial === firstInitial &&
          memberLastName === normalizedLastName &&
          member.dob === partner.dob
        ) {
          newDuplicateErrors['partner'] = `This person (${member.firstName} ${member.lastName}) is already in your household; they can be removed.`;
          break;
        }
      }
    }
  }

  // Validate each household member
  if (hasHousehold && householdMembers.length > 0) {
    householdMembers.forEach((member, index) => {
      if (!member.firstName || !member.lastName || !member.dob) {
        return;
      }

      const memberId = member.householdMemberId || index;
      const firstInitial = member.firstName.charAt(0).toUpperCase();
      const normalizedLastName = member.lastName.toLowerCase().trim();

      // Check against partner
      if (hasPartner && partner.firstName && partner.lastName && partner.dob) {
        const partnerFirstInitial = partner.firstName.charAt(0).toUpperCase();
        const partnerLastName = partner.lastName.toLowerCase().trim();

        if (
          partnerFirstInitial === firstInitial &&
          partnerLastName === normalizedLastName &&
          partner.dob === member.dob
        ) {
          newDuplicateErrors[`member-${memberId}`] = `This person (${partner.firstName} ${partner.lastName}) is already in your household; they can be removed.`;
          return;
        }
      }

      // Check against other household members
      for (let i = 0; i < householdMembers.length; i++) {
        if (i === index) continue;

        const otherMember = householdMembers[i];
        if (otherMember.firstName && otherMember.lastName && otherMember.dob) {
          const otherFirstInitial = otherMember.firstName.charAt(0).toUpperCase();
          const otherLastName = otherMember.lastName.toLowerCase().trim();

          if (
            otherFirstInitial === firstInitial &&
            otherLastName === normalizedLastName &&
            otherMember.dob === member.dob
          ) {
            newDuplicateErrors[`member-${memberId}`] = `This person (${otherMember.firstName} ${otherMember.lastName}) is already in your household; they can be removed.`;
            break;
          }
        }
      }
    });
  }

  setDuplicateErrors(newDuplicateErrors);
}, [householdMembers, hasHousehold, hasPartner, partner.firstName, partner.lastName, partner.dob]);

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

      if (!validateAge(value, 'partner-dob')) {
        updatePartner(field, value);
        return;
      }
      // Duplicate check
      const dupCheck = checkForDuplicate(partner.firstName, partner.lastName, value, 'partner');
      if (dupCheck.isDuplicate) {
        setDuplicateErrors(prev => ({
          ...prev,
          'partner': `This person (${dupCheck.name}) is already in your household; they can be removed.`
        }));
        // Don't return - allow the DOB to be saved and show the warning
      } else {
        setDuplicateErrors(prev => ({ ...prev, 'partner': '' }));
      }
    }

    // Check for duplicates when name changes
    if ((field === 'firstName' || field === 'lastName') && partner.dob) {
      const firstName = field === 'firstName' ? value : partner.firstName;
      const lastName = field === 'lastName' ? value : partner.lastName;
      const dupCheck = checkForDuplicate(firstName, lastName, partner.dob, 'partner');

      if (dupCheck.isDuplicate) {
        setDuplicateErrors(prev => ({
          ...prev,
          'partner': `This person (${dupCheck.name}) is already in your household; they can be removed.`
        }));
        setDuplicateErrors(prev => ({ ...prev, 'partner': '' }));
        updatePartner(field, value);
        return;
      } else {
        setDuplicateErrors('');
      }
    }

    updatePartner(field, value);
  };

  const handleUpdateHouseholdMember = (memberId, field, value) => {
    // find member either by householdMemberId or by index
    let member = householdMembers.find(m => m.householdMemberId === memberId);
    let memberIndex = memberId;

    if (!member) {
      // If member not found by ID, try finding by index (for new members)
      const index = typeof memberId === 'number' ? memberId : parseInt(memberId);
      if (index >= 0 && index < householdMembers.length) {
        member = householdMembers[index];
        memberIndex = index;
      } else {
        return;
      }
    }

    // Field length validation - show error
    if (field === 'firstName' || field === 'lastName') {
      validateFieldLength(
        value,
        MAX_NAME_LENGTH,
        field === 'firstName' ? 'First name' : 'Last name',
        `member-${memberId}-${field}`
      );
    }

    // Email validation - ONLY for adults (19+)
    if (field === 'email') {
      const age = member.dob ? calculateAge(member.dob) : null;
      const isAdult = age !== null && age >= 19;

      if (isAdult) {
        // Validate email length
        if (value && value.length > MAX_EMAIL_LENGTH) {
          setFieldLengthErrors(prev => ({
            ...prev,
            [`member-${memberId}-email`]: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters`
          }));
        }
        // Validate email format
        validateEmail(value, `member-${memberId}-email`);

        // Duplicate check when email is entered (for adults)
        if (value && member.firstName && member.lastName && member.dob) {
          //console.log('Running duplicate check on email change');
          const dupCheck = checkForDuplicate(member.firstName, member.lastName, member.dob, memberId);
          if (dupCheck.isDuplicate) {
            setDuplicateErrors(prev => ({
              ...prev, [`member-${memberId}`]: `This person (${dupCheck.name}) is already in your household; they can be removed.`
            }));
          } else {
            setDuplicateErrors(prev => ({ ...prev, [`member-${memberId}`]: '' }));
          }
        }
      } else {
        // Clear email validation errors for children
        setEmailValidationErrors(prev => ({ ...prev, [`member-${memberId}-email`]: '' }));
        setFieldLengthErrors(prev => ({ ...prev, [`member-${memberId}-email`]: '' }));
      }
    }



    // Duplicate check for relationship changes
    if (field === 'relationship') {
      if (value && member.firstName && member.lastName && member.dob) {
        //console.log('Running duplicate check on relationship change');
        const dupCheck = checkForDuplicate(member.firstName, member.lastName, member.dob, memberId);
        if (dupCheck.isDuplicate) {
          setDuplicateErrors(prev => ({
            ...prev,
            [`member-${memberId}`]: `This person (${dupCheck.name}) is already in your household; they can be removed.`
          }));
        } else {
          setDuplicateErrors(prev => ({ ...prev, [`member-${memberId}`]: '' }));
        }
      }
    }

    // duplicate check for gender changes
    if (field === 'genderType') {
      if (value && member.firstName && member.lastName && member.dob) {
        //console.log('Running duplicate check on gender change');
        const dupCheck = checkForDuplicate(member.firstName, member.lastName, member.dob, memberId);
        if (dupCheck.isDuplicate) {
          setDuplicateErrors(prev => ({
            ...prev,
            [`member-${memberId}`]: `This person (${dupCheck.name}) is already in your household; they 
    can be removed.`
          }));
        } else {
          setDuplicateErrors(prev => ({ ...prev, [`member-${memberId}`]: '' }));
        }
      }
    }

    // Duplicate check for DOB changes
    if (field === 'dob' && value && member.firstName && member.lastName) {
      // Validate age range first
      if (!validateAge(value, `member-${memberId}-dob`)) {
        updateHouseholdMember(memberIndex, field, value);
        return;
      }

      // Clear email validation errors if member becomes a child
      const age = calculateAge(value);
      if (age < 19) {
        setEmailValidationErrors(prev => ({ ...prev, [`member-${memberId}-email`]: '' }));
        setFieldLengthErrors(prev => ({ ...prev, [`member-${memberId}-email`]: '' }));
      }

      const dupCheck = checkForDuplicate(member.firstName, member.lastName, value, memberId);
      if (dupCheck.isDuplicate) {
        setDuplicateErrors(prev => ({
          ...prev,
          [`member-${memberId}`]: `This person (${dupCheck.name}) is already in your household; they can be removed.`
        }));
      } else {
        setDuplicateErrors(prev => ({ ...prev, [`member-${memberId}`]: '' }));
      }
    }

    // Duplicate check for name changes
    if ((field === 'firstName' || field === 'lastName') && member.dob) {
      const firstName = field === 'firstName' ? value : member.firstName;
      const lastName = field === 'lastName' ? value : member.lastName;
      const dupCheck = checkForDuplicate(firstName, lastName, member.dob, memberId);

      if (dupCheck.isDuplicate) {
        setDuplicateErrors(prev => ({
          ...prev,
          [`member-${memberId}`]: `This person (${dupCheck.name}) is already in your household; they can be removed.`
        }));
      } else {
        setDuplicateErrors(prev => ({ ...prev, [`member-${memberId}`]: '' }));
      }
    }

    // update the state at the end
    updateHouseholdMember(memberIndex, field, value);
  };

    // auto save partner data
    useEffect(() => {
      const timer = setTimeout(() => {
        if (hasPartner && partner.firstName && partner.lastName && partner.dob && partner.email && partner.relationship) {
          //console.log('Auto-saving partner data:', partner);
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
            const isComplete = member.firstName && member.lastName && member.dob && member.relationship && member.genderType;
            const hasEmailIfAdult = !isAdult || (isAdult && member.email);

            // check for validation errors
            const memberId = member.householdMemberId || householdMembers.indexOf(member);
            const hasEmailError = emailValidationErrors[`member-${memberId}-email`];
            const hasFieldLengthError = fieldLengthErrors[`member-${memberId}-firstName`] ||
              fieldLengthErrors[`member-${memberId}-lastName`] ||
              fieldLengthErrors[`member-${memberId}-email`] ||
              fieldLengthErrors[`member-${memberId}-dob`];
            const hasDuplicateError = duplicateErrors[`member-${memberId}`];      
          
          /*
          // Debug logging
          console.log('Auto-save check for member:', {
            memberId,
            name: `${member.firstName} ${member.lastName}`,
            age,
            isAdult,
            isComplete,
            hasEmailIfAdult,
            hasEmailError,
            hasFieldLengthError,
            hasDuplicateError,
            isDirty: member.isDirty,
            email: member.email,
            genderType: member.genderType,
            willSave: isComplete && hasEmailIfAdult && !hasEmailError && !hasFieldLengthError && !hasDuplicateError && member.isDirty
          });
          */               
  
          // only save if complete, valid and dirty
          if (isComplete && hasEmailIfAdult && !hasEmailError && !hasFieldLengthError && !hasDuplicateError && member.isDirty) {
            const saveId = member.householdMemberId || `temp-${member.index}`;

            if (!savingMembersRef.current.has(saveId)) {
              console.log('Auto-saving household member:', member);
              savingMembersRef.current.add(saveId);

              saveHouseholdMember(member)
              .then((savedMember) => {
                const memberIndex = householdMembers.indexOf(member);
                // Update the householdMemberId if this was a new member
                if (savedMember.householdMemberId && !member.householdMemberId) {
                  updateHouseholdMember(memberIndex, 'householdMemberId', savedMember.householdMemberId);
                }
                // Mark as not dirty
                updateHouseholdMember(member.householdMemberId || memberIndex, 'isDirty', false);
                savingMembersRef.current.delete(saveId);
              })
                .catch((error) => {
                  console.error(error);

                  // Check if it's a duplicate error from backend
                  if (error.message && error.message.startsWith('DUPLICATE:')) {
                    setDuplicateErrors(prev => ({
                      ...prev,
                      [`member-${memberId}`]: 'This person is already in your household; they can be removed.'
                    }));
                  }
                  savingMembersRef.current.delete(saveId);
                });
            } else {
              console.log('Already saving this member, skipping:', saveId);
            }
          }
        }
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [householdMembers, saveHouseholdMember, calculateAge, updateHouseholdMember, emailValidationErrors, fieldLengthErrors, duplicateErrors]);

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
                    className={getFieldErrorClass(partner.relationship)}
                  >
                    <option value="">Select relationship</option>
                    <option value="Common law">Common law</option>
                    <option value="Partner">Partner</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                <label htmlFor="partner-firstName" className="form-control-label">
                  First Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="partner-firstName"
                  value={partner.firstName}
                  onChange={(e) => handleUpdatePartner('firstName', e.target.value)}
                  className={`form-control ${getFieldErrorClass(partner.firstName)}`}
                  maxLength={MAX_NAME_LENGTH}
                />
                {fieldLengthErrors['partner-firstName'] && (
                  <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
                    {fieldLengthErrors['partner-firstName']}
                  </label>
                )}
                <label htmlFor="partner-lastName" className="form-control-label">
                  Last Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="partner-lastName"
                  value={partner.lastName}
                  onChange={(e) => handleUpdatePartner('lastName', e.target.value)}
                  className={`form-control ${getFieldErrorClass(partner.lastName)}`}                  
                  maxLength={MAX_NAME_LENGTH}
                />
                {fieldLengthErrors['partner-lastName'] && (
                  <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
                  {fieldLengthErrors['partner-lastName']}
                  </label>
                )}
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
                {fieldLengthErrors['partner-dob'] && (
                  <label className="form-control-validation-label">
                  {fieldLengthErrors['partner-dob']}
                  </label>
                )}
                <label htmlFor="partner-email" className="form-control-label">
                  Email<span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="partner-email"
                  value={partner.email}
                  onChange={(e) => handleUpdatePartner('email', e.target.value)}
                  className={`form-control ${getFieldErrorClass(partner.email)}`}
                  maxLength={MAX_EMAIL_LENGTH}
                />
                {(emailValidationErrors['partner-email'] || fieldLengthErrors['partner-email']) && (
                  <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
                    {emailValidationErrors['partner-email'] || fieldLengthErrors['partner-email']}
                  </label>
                )}                
                {duplicateErrors['partner'] && (
                <div style={{
                  padding: '12px 16px',
                  background: '#FEE',
                  border: '1px solid #D8292F',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  color: '#D8292F'
                }}>
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                  {duplicateErrors['partner']}
                </div>
              )}
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
                    onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'relationship', e.target.value)}
                    className={getFieldErrorClass(member.relationship)}                    
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
                    onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'firstName', e.target.value)}
                    className={`form-control ${getFieldErrorClass(member.firstName)}`}
                    maxLength={MAX_NAME_LENGTH}
                  />
                  {fieldLengthErrors[`member-${member.householdMemberId || index}-firstName`] && (
                    <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
                      {fieldLengthErrors[`member-${member.householdMemberId || index}-firstName`]}
                    </label>
                  )}
                  
                  <label htmlFor={`member-${member.householdMemberId}-lastName`} className="form-control-label">
                    Last Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.householdMemberId}-lastName`}
                    value={member.lastName}
                    onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'lastName', e.target.value)}
                    className={`form-control ${getFieldErrorClass(member.lastName)}`}
                    maxLength={MAX_NAME_LENGTH}
                  />
                  {fieldLengthErrors[`member-${member.householdMemberId || index}-lastName`] && (
                    <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
                      {fieldLengthErrors[`member-${member.householdMemberId || index}-lastName`]}
                    </label>
                  )}

                  <label htmlFor={`member-${member.householdMemberId}-dob`} className="form-control-label">
                    Date of Birth<span className="required">*</span>
                  </label>
                  <DateField 
                    id={`member-${member.householdMemberId}-dob`}
                    variant='past'
                    value={member.dob}
                    required
                    onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'dob', e.target.value)}
                  />
                  {fieldLengthErrors[`member-${member.householdMemberId || index}-dob`] && (
                  <label className="form-control-validation-label">
                    {fieldLengthErrors[`member-${member.householdMemberId || index}-dob`]}
                  </label>
                  )}
                        <div className="radio-button-group">
                          <div className="radio-button-header">Gender<span className="required">*</span></div>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Man/Boy"
                              checked={member.genderType === "Man/Boy"}
                              onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Man/Boy
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Woman/Girl"
                              checked={member.genderType === "Woman/Girl"}
                              onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Woman/Girl
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Non-Binary"
                              checked={member.genderType === "Non-Binary"}
                              onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Non-Binary
                          </label>
                          <label>
                            <input
                              type="radio"
                              name={`member-${member.householdMemberId || index}-gender`}
                              value="Prefer not to say"
                              checked={member.genderType === "Prefer not to say"}
                              onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'genderType', e.target.value)}
                            />
                            Prefer not to say
                          </label>
                        </div>

                  {calculateAge(member.dob) >= 19 && (
                    <>
                  <label htmlFor={`member-${member.householdMemberId}-email`} className="form-control-label">
                    Email<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.householdMemberId}-email`}
                    value={member.email}
                    onChange={(e) => handleUpdateHouseholdMember(member.householdMemberId || index, 'email', e.target.value)}
                    className={`form-control ${getFieldErrorClass(member.email)}`}
                    maxLength={MAX_EMAIL_LENGTH}
                  />
                  {(emailValidationErrors[`member-${member.householdMemberId || index}-email`] ||
                    fieldLengthErrors[`member-${member.householdMemberId || index}-email`]) && (
                    <label className="form-control-validation-label" style={{ color: '#D8292F' }}>
                      {emailValidationErrors[`member-${member.householdMemberId || index}-email`] ||
                      fieldLengthErrors[`member-${member.householdMemberId || index}-email`]}
                    </label>
                  )}  
                  </>
                  )}
                </div>

                {duplicateErrors[`member-${member.householdMemberId || index}`] && (
                    <div style={{
                      padding: '12px 16px',
                      background: '#FEE',
                      border: '1px solid #D8292F',
                      borderRadius: '4px',
                      marginTop: '12px',
                      color: '#D8292F'
                    }}>
                      <AlertCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                      {duplicateErrors[`member-${member.householdMemberId || index}`]}
                    </div>
                  )}
        
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
        
        {saveStatus !== '' && (
          <div className="debug-message">
            {saveStatus}
          </div>
        )}

        </form>
      </div>
    );

};
    
export default Household;