import React, { useState } from 'react';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import Button from './Button';

const Household = ({ onClose }) => {

    const [hasPartner, setHasPartner] = useState(null);
    const [fullName, setFullName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
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
          <h2>Applicant 2</h2>
          <div className="form-group">
            <label htmlFor="firstName">
              First Name<span className="required">*</span>
            </label>
            <input
              type="text"
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="lastName">
              Last Name<span className="required">*</span>
            </label>
            <input
              type="text"
              id="first"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <div className="helper-text">
              Your spouse/partner will need to complete information and a screening form…
            </div>
          </div>
          <div className="form-group">
          <label htmlFor="dob">
                Date of Birth<span className="required">*</span>
            </label>
                <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />
                <div className="helper-text">
                Please enter your spouse/partner's birthdate.
                </div>
                </div>
          <div className="form-group">
            <label htmlFor="email">
              Email<span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="helper-text">
              Your spouse/partner will need to complete information and a screening form…
            </div>
          </div>
  
          <Button>Send invite</Button>
        </>
        )}
        </form>
      </div>
    );

};
    
export default Household;