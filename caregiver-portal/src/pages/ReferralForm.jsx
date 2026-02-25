import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
//import Breadcrumb from '../components/Breadcrumb';
import BreadcrumbBar from '../components/BreadcrumbBar';
import Button from '../components/Button';
import { IMaskInput} from 'react-imask';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useUserProfile } from '../hooks/useUserProfile';
import { Loader2 } from 'lucide-react';


const ReferralForm = () => {
  const { applicationPackageId } = useParams();
  const navigate = useNavigate();
  const back = `/foster-application/referral-package/${applicationPackageId}`

  const { userProfile, loading: profileLoading, error: profileError } = useUserProfile();  
  const { saveReferralContactData, getApplicationForm, loading } = useApplicationPackage();

  const [home_phone, setHomePhone] = React.useState(userProfile?.home_phone || '');
  const [alternate_phone, setAlternatePhone] = React.useState(userProfile?.alternate_phone || '');
  const [email, setEmail] = React.useState(userProfile?.email || '');
  const [sex, setSex] = React.useState(userProfile?.gender || '');
  const [emailError, setEmailError] = React.useState('');
  const [sexError, setSexError] = React.useState('');
  const [primaryPhoneError, setPrimaryPhoneError] = React.useState('');
  const [secondaryPhoneError, setSecondaryPhoneError] = React.useState('');
  const [submitError, setSubmitError] = React.useState('');
  const [indigenousFormUrl, setIndigenousFormUrl] = React.useState('');
  const { getApplicationForms } = useApplicationPackage();

  React.useEffect(() => {
    if (userProfile) {
      setSex(userProfile.gender || '');
      setEmail(userProfile.email || '');
      setHomePhone(userProfile.home_phone || '');
      setAlternatePhone(userProfile.alternate_phone || '');
    }
  }, [userProfile]);  

  const user = userProfile ? {
                firstName: userProfile.first_name,
                lastName: userProfile.last_name,
                streetAddress: userProfile.street_address,
                city: userProfile.city,
                sex: userProfile.gender,
                region: userProfile.region,
                postalCode: userProfile.postal_code,
  } : null;

  React.useEffect(() => {
    if (applicationPackageId) {
      getApplicationForms(applicationPackageId).then(formsArray => {
        const indigenousForm = formsArray.find(f => !f.type?.toLowerCase().includes('referral'));
        if (indigenousForm) {
          setIndigenousFormUrl(
            `/foster-application/referral-package/${applicationPackageId}/application-form/${indigenousForm.applicationFormId}`
          );
        }
      });
    }
  }, [applicationPackageId]);


  const breadcrumbItems = [
    { label: 'Request an Information Session', path: back },
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

  const validateSex = (value) => {
    return value.length > 0;
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

  const handleNext = async () => {
    setSubmitError('');

    const isSexValid = validateSex(sex);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePrimaryPhone(home_phone);

    if (!isEmailValid || !isPhoneValid || !isSexValid) {
      setSubmitError('Please fix the errors above before continuing');
      return;
    }

    if (!email || !email.trim()) {
      setEmailError('Email is required');
      setSubmitError('Please complete all required fields');
      return;
    }

    if (!sex || !sex.trim()) {
      setSexError('Please provide a value');
      setSubmitError('Please complete all required fields');
      return;
    }

    if (!home_phone || !home_phone.trim()) {
      setPrimaryPhoneError('Primary phone is required');
      setSubmitError('Please complete all required fields');
      return;
    }

    try {
      await saveReferralContactData(applicationPackageId, {
        sex,
        email,
        home_phone,
        alternate_phone: alternate_phone || undefined,
      });
      navigate(indigenousFormUrl || back);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save. Please try again.');
    }
  };

  const referralFormStatus = {
    type: 'Referral',
    status: (sex && email && home_phone) ? 'Complete' : 'New',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitError('');

    // Validate all required fields
    const isSexValid = validateSex(sex);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePrimaryPhone(home_phone);

    if (!isEmailValid || !isPhoneValid | !isSexValid) {
      setSubmitError('Please fix the errors above before submitting');
      return;
    }

    // Check if fields are empty (additional check)
    if (!email || !email.trim()) {
      setEmailError('Email is required');
      setSubmitError('Please complete all required fields');
      return;
    }


    if(!sex || !sex.trim()) {
      setSexError('Please provide a value');
      setSubmitError('Please complete all required fields')
    }
    if (!home_phone || !home_phone.trim()) {
      setPrimaryPhoneError('Primary phone is required');
      setSubmitError('Please complete all required fields');
      return;
    }

    try {
      const contactData = {
        sex,
        email,
        home_phone,
        alternate_phone: alternate_phone || undefined, // Only include if provided
      };

      await saveReferralContactData(applicationPackageId, contactData);

      // Success! Navigate to confirmation or next page
      navigate(back);

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

    <>
      {/* Submission Overlay */}
      {loading && (
        <div className="submission-overlay">
          <div className="submission-modal">
            <Loader2 className="submission-spinner" />
            <p className="submission-title">Saving</p>
            <p className="submission-text">Please wait while we save your information...</p>
          </div>
        </div>
      )}

      <div className="iframe-container">
        <div className="breadcrumb-top">
          <div className="breadcrumb-top-content">
            <BreadcrumbBar home={back} next={indigenousFormUrl} applicationForm={referralFormStatus} onNext={handleNext} onBack={() => navigate(back)}/>
          </div>
        </div>

        <div className="iframe-content" style={{ overflow: 'auto' }}>

    <div className="page">
      <div className="page-details">
        <div className="page-details-row-small">
         <h1 className="page-title">Attend an information session</h1>
        
        </div>
        <div className="page-details-row">
          <div className="section-description">
            <p>Information sessions are designed to help prospective foster caregivers make the decision about fostering.</p>

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
                <div className="radio-button-group">
                  <div className="radio-button-header">Please indicate your gender:<span className="required">*</span></div>
                  <label>
                    <input
                      type="radio"
                      name={`gender`}
                      value="Man/Boy"
                      checked={sex === "Man/Boy"}
                      onChange={(e) => setSex(e.target.value)}
                    />
                    Man/Boy
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`gender`}
                      value="Woman/Girl"
                      checked={sex === "Woman/Girl"}
                      onChange={(e) => setSex(e.target.value)}
                    />
                    Woman/Girl
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`gender`}
                      value="Non-Binary"
                      checked={sex === "Non-Binary"}
                      onChange={(e) => setSex(e.target.value)}
                    />
                    Non-Binary
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`gender`}
                      value="Unknown"
                      checked={sex === "Unknown"}
                      onChange={(e) => setSex(e.target.value)}
                    />
                    Prefer not to say
                  </label>
                  {sexError && <span className="error-message">{sexError}</span>}
                </div>
                
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
                    value={home_phone}
                    onAccept={(value) => {setHomePhone(value); validatePrimaryPhone(value);}}
                    onBlur={() => validatePrimaryPhone(home_phone)}
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
                    value={alternate_phone}
                    onAccept={(value) => {setAlternatePhone(value); validateSecondaryPhone(value);}}
                    onBlur={() => validateSecondaryPhone(alternate_phone)}
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

        {submitError && (
          <div className="page-details-row">
            <div className="error-message" style={{ marginBottom: '16px' }}>
              {submitError}
            </div>
          </div>
        )}
        </div>
      </div>
      </div>
      </div>
    </>
  );

};

export default ReferralForm;