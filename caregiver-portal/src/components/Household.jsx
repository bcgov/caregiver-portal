import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import Button from './Button';

const Household = ({ onClose, currentApplication }) => {

    const [hasPartner, setHasPartner] = useState(null);
    const [hasHousehold, setHasHousehold] = useState(null);
    const [hasValidHousehold, setHasValidHousehold] = useState(false);
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
    const [lastSaved, setLastSaved] = useState(null); // timestamp of last save

    // Partner/Spouse data
    const [partner, setPartner] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: ''
    });

    const updatePartner = (field, value) => {
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
      const response = await fetch(`${API_BASE}/household/partner`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationToken: currentApplication, 
          partnerData,
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
      console.log('Partner draft saved successfully');
      return await response.json()
    };

    // Additional household members
    const [householdMembers, setHouseholdMembers] = useState([]);    
    const addHouseholdMember = () => {
        const newMember = {
            id: Date.now(), // Simple ID generation
            firstName: '',
            lastName: '',
            dob: '',
            relationship: '',
            requiresScreening: false
        };
        setHouseholdMembers([...householdMembers, newMember]);
    };
    
    const removeHouseholdMember = (id) => {
        setHouseholdMembers(householdMembers.filter(member => member.id !== id));
    };
    
    const updateHouseholdMember = (id, field, value) => {
        setHouseholdMembers(householdMembers.map(member => 
            member.id === id ? { ...member, [field]: value } : member
        ));
    };
      
    const handleSubmit = (e) => {
      e.preventDefault();
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
                onChange={() => setHasPartner(false)}
              />
              No
            </label>
          </div>
          <div className="helper-text">Helper text goes here</div>
        </fieldset>
        {hasPartner && (
         <>
          <h2>Spouse/Partner Information</h2>
          <div className="form-group">
            <label htmlFor="partner-firstName">
              First Name<span className="required">*</span>
            </label>
            <input
              type="text"
              id="partner-firstName"
              value={partner.firstName}
              onChange={(e) => updatePartner('firstName', e.target.value)}
            />
            <label htmlFor="partner-lastName">
              Last Name<span className="required">*</span>
            </label>
            <input
              type="text"
              id="partner-lastName"
              value={partner.lastName}
              onChange={(e) => updatePartner('lastName', e.target.value)}
            />

            <div className="helper-text">
              Your spouse/partner will need to complete information and a screening form…
            </div>
          </div>
          <div className="form-group">
          <label htmlFor="partner-dob">
                Date of Birth<span className="required">*</span>
            </label>
                <input
                    type="date"
                    id="partner-dob"
                    value={partner.dob}
                    onChange={(e) => updatePartner('dob', e.target.value)}
                />
                <div className="helper-text">
                Please enter your spouse/partner's birthdate.
                </div>
                </div>
          <div className="form-group">
            <label htmlFor="partner-email">
              Email<span className="required">*</span>
            </label>
            <input
              type="email"
              id="partner-email"
              value={partner.email}
              onChange={(e) => updatePartner('email', e.target.value)}
            />
            <div className="helper-text">
              Your spouse/partner will need to complete information and a screening form…
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
              <h2>Additional Household Members</h2>
            </div>
            
            {householdMembers.length === 0 && (
              <div className="empty-state">
                <p>No household members added yet. Click "Add Member" to start.</p>
              </div>
            )}
            
            {householdMembers.map((member, index) => (
              <div key={member.id} className="household-member-form">
                <div className="member-header">
                  <h3>Household Member {index + 1}</h3>
                </div>
                
                <div className="form-group">
                  <label htmlFor={`member-${member.id}-firstName`}>
                    First Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.id}-firstName`}
                    value={member.firstName}
                    onChange={(e) => updateHouseholdMember(member.id, 'firstName', e.target.value)}
                  />
                  
                  <label htmlFor={`member-${member.id}-lastName`}>
                    Last Name<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id={`member-${member.id}-lastName`}
                    value={member.lastName}
                    onChange={(e) => updateHouseholdMember(member.id, 'lastName', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`member-${member.id}-dob`}>
                    Date of Birth<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id={`member-${member.id}-dob`}
                    value={member.dob}
                    onChange={(e) => updateHouseholdMember(member.id, 'dob', e.target.value)}
                  />
                  <div className="helper-text">
                    Please enter this household member's birthdate.
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor={`member-${member.id}-relationship`}>
                    Relationship to Applicant<span className="required">*</span>
                  </label>
                  <select
                    id={`member-${member.id}-relationship`}
                    value={member.relationship}
                    onChange={(e) => updateHouseholdMember(member.id, 'relationship', e.target.value)}
                  >
                    <option value="">Select relationship</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="grandchild">Grandchild</option>
                    <option value="other-relative">Other Relative</option>
                    <option value="boarder">Boarder</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="helper-text">
                    Select how this person is related to you.
                  </div>
                </div>
                <Button
                    type="button"
                    onClick={() => removeHouseholdMember(member.id)}
                    variant="secondary"
                    aria-label="Remove household member"
                  >
                    <Trash2 size={16} />Remove 
                  </Button>
        
                
              </div>
            ))}
              <div className="section-header">
              <Button type="button" variant="secondary" onClick={addHouseholdMember}>
                <Plus size={16} />
                Add Member
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