import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import { IMaskInput} from 'react-imask';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useUserProfile } from '../hooks/useUserProfile';


const ReferralForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const back = `/foster-application/${applicationPackageId}`

  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();  
  const { requestInfoSession, loading, error } = useApplicationPackage();

  const [homePhone, setHomePhone] = React.useState(userProfile?.homePhone || '');
  const [alternatePhone, setAlternatePhone] = React.useState(userProfile?.alternatePhone || '');
  const [email, setEmail] = React.useState(userProfile?.email || '');
  const [emailError, setEmailError] = React.useState('');
  const [primaryPhoneError, setPrimaryPhoneError] = React.useState('');
  const [secondaryPhoneError, setSecondaryPhoneError] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');

  React.useEffect(() => {
    if (userProfile) {
      setEmail(userProfile.email || '');
      setHomePhone(userProfile.homePhone || '');
      setAlternatePhone(userProfile.alternatePhone || '');
    }
  }, [userProfile]);  

  const user = userProfile ? {
                firstName: userProfile.first_name,
                lastName: userProfile.last_name,
                streetAddress: userProfile.street_address,
                city: userProfile.city,
                region: userProfile.region,
                postalCode: userProfile.postal_code,
  } : null;


  const breadcrumbItems = [
    { label: 'Become a foster caregiver', path: back },
  ];

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('');
      return true;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  const validatePhone = (value, setError, fieldName) => {
    // Remove all non-digits to count actual numbers entered
    const digits = value.replace(/\D/g, '');

    if (digits.length === 0) {
      setError('');
      return true; // Empty is ok for optional fields
    }

    if (digits.length < 10) {
      setError(`Please enter a complete ${fieldName}`);
      return false;
    }

    setError('');
    return true;
  };

  const validatePrimaryPhone = (value) => {
    return validatePhone(value, setPrimaryPhoneError, 'phone number');
  };

  const validateSecondaryPhone = (value) => {
    return validatePhone(value, setSecondaryPhoneError, 'phone number');
  };

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitError('');

    // Validate all required fields
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePrimaryPhone(homePhone);

    if (!isEmailValid || !isPhoneValid) {
      setSubmitError('Please fix the errors above before submitting');
      return;
    }

    // Check if fields are empty (additional check)
    if (!email || !email.trim()) {
      setEmailError('Email is required');
      setSubmitError('Please complete all required fields');
      return;
    }

    if (!homePhone || !homePhone.trim()) {
      setPrimaryPhoneError('Primary phone is required');
      setSubmitError('Please complete all required fields');
      return;
    }

    try {
      const contactData = {
        email,
        homePhone,
        alternatePhone: alternatePhone || undefined, // Only include if provided
      };

      await requestInfoSession(applicationPackageId, contactData);

      // Success! Navigate to confirmation or next page
      navigate(`/foster-application/${applicationPackageId}`);

    } catch (err) {
      setSubmitError(err.message || 'Failed to submit request. Please try again.');
      console.error('Submission error:', err);
    }
  };
  
  if (profileLoading) {
    return <div className="page"><div className="page-details">Loading...</div></div>;
  }

  if (profileError) {
    return <div className="page"><div className="page-details">Error: {profileError}</div></div>;
  }

  return (
    <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
        </div>
        <div className="page-details-row-small">
         <h1 className="page-title">Attend an information session</h1>
        
        </div>
        <div className="page-details-row">
          <div className="section-description">
            <p>Information sessions are design to help prospective foster caregivers make the decision about fostering.</p>

            <p>Topics include:</p>
            <ul>
              <li>How to become a foster caregiver</li>
              <li>What's involved in being a foster caregiver</li>
              <li>An overview of BC's foster care system</li>
            </ul>

            <p>After receiving your request, we will contact you with information on the next information session in your area.</p>
          </div>
        </div>
        <div className="page-details-row">
          <div className="form-container">
            <form>
              <fieldset className="form-group">
                <div className="section-description">
                  <p>This is the name and address on your BC Services Card. If you have changed your legal name or address, please update your BC Services Card before proceeding.</p>
                </div>
                <div className="field-control">
                <label htmlFor={`user-name`} className="form-control-label">
                    Legal Name
                </label>
                <input
                  type="text"
                  id="Name"
                  value={user.firstName+" "+user.lastName}
                  className="form-control-readonly"
                  readOnly
                />
                </div>
                <div className="field-control">
                  <label htmlFor={`user-homeAddress`} className='form-control-label'>
                    Current Address
                  </label>
                  <textarea className='form-control-multiline-readonly' readOnly
                  value={`${user.streetAddress} \n${user.city} ${user.region} ${user.postalCode}`}>
                  </textarea>
                </div>
                <div className="field-control">
                  <label htmlFor={`user-email`} className="form-control-label">
                      Email<span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="user-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    onBlur={() => validateEmail(email)}  // Validate when user leaves field
                    className={`form-control ${emailError ? 'form-control-error' : ''}`}
                    aria-invalid={emailError ? 'true' : 'false'}
                    />
                    {emailError && <span className="error-message">{emailError}</span>}
                </div>
                <div className="field-control">
                  <label htmlFor={`user-primaryPhone`} className="form-control-label">
                      Primary Phone<span className="required">*</span>
                  </label>
                  <IMaskInput
                    mask="(000) 000-0000"
                    value={homePhone}
                    onAccept={(value) => {setHomePhone(value); validatePrimaryPhone(value);}}
                    onBlur={() => validatePrimaryPhone(homePhone)}
                    placeholder="e.g. (604) 112-1010"
                    type="tel"
                    id="user-primaryPhone"
                    className={`form-control ${primaryPhoneError ? 'form-control-error' : ''}`}
                    />
                    {primaryPhoneError && <span className="error-message">{primaryPhoneError}</span>}             
                </div>
                <div className="field-control">
                  <label htmlFor={`user-secondaryPhone`} className="form-control-label">
                      Secondary Phone
                  </label>
                  <IMaskInput
                    mask="(000) 000-0000"
                    value={alternatePhone}
                    onAccept={(value) => {setAlternatePhone(value); validateSecondaryPhone(value);}}
                    onBlur={() => validateSecondaryPhone(alternatePhone)}
                    placeholder="e.g. (604) 112-1010"
                    type="tel"
                    id="user-secondaryPhone"
                    className={`form-control ${secondaryPhoneError ? 'form-control-error' : ''}`}
                    />
                    {secondaryPhoneError && <span className="error-message">{secondaryPhoneError}</span>}
                </div>
              </fieldset>
              
            </form>
            
          </div>
        </div>
        <div className="page-details-row-bottom">
        {submitError && (
          <div className="error-message" style={{ marginBottom: '16px' }}>
            {submitError}
          </div>
        )}
        <Button type="submit" disabled={loading} onClick={handleSubmit}>
          {loading ? 'Requesting...' : 'Request Information Session'}
        </Button>
        </div>

        </div>
    </div>
  );

};

export default ReferralForm;