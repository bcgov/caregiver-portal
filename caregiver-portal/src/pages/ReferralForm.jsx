import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import Breadcrumb from '../components/Breadcrumb';
//import Application from '../components/Application';
//import { useApplicationPackage } from '../hooks/useApplicationPackage';
import Button from '../components/Button';
import { IMaskInput} from 'react-imask';


const ReferralForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const back = `/foster-application/${applicationPackageId}`

  const user = {firstName: "test",
                lastName: "testerson",
                streetAddress: "123 Test Street",
                city:"Testville",
                region: "BC",
                postalCode: "V1Y-8B2",
                email: "test@test.ca",
  };

  const [primaryPhone, setPrimaryPhone] = React.useState('');
  const [secondaryPhone, setSecondaryPhone] = React.useState('');

  const [phone, setPhone ] = React.useState('');


  const breadcrumbItems = [
    { label: 'Become a foster caregiver', path: back },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

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
                <label htmlFor={`user-firstName`} className="form-control-label">
                    Given Names
                </label>
                <input
                  type="text"
                  id="user-firstName"
                  value={user.firstName}
                  className="form-control-readonly"
                  readOnly
                />
                </div>
                <div className="field-control">
                  <label htmlFor={`user-lastName`} className="form-control-label">
                      Surname
                  </label>
                  <input
                    type="text"
                    id="user-lastName"
                    value={user.lastName}
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
                    type="text"
                    id="user-email"
                    value={user.email}
                    className="form-control"
                    
                  />
                </div>
                <div className="field-control">
                  <label htmlFor={`user-primaryPhone`} className="form-control-label">
                      Primary Phone<span className="required">*</span>
                  </label>
                  <IMaskInput
                    mask="(000) 000-0000"
                    value={primaryPhone}
                    onAccept={(value) => setPrimaryPhone(value)}
                    placeholder="e.g. (604) 112-1010"
                    type="tel"
                    id="user-primaryPhone"
                    className="form-control"                    
                  />
                </div>
                <div className="field-control">
                  <label htmlFor={`user-secondaryPhone`} className="form-control-label">
                      Secondary Phone
                  </label>
                  <IMaskInput
                    mask="(000) 000-0000"
                    value={secondaryPhone}
                    onAccept={(value) => setSecondaryPhone(value)}
                    placeholder="e.g. (604) 112-1010"
                    type="tel"
                    id="user-secondaryPhone"
                    className="form-control"   
                  />
                </div>
              </fieldset>
              <Button>Submit</Button>
            </form>
          </div>
        </div>

        </div>
    </div>
  );

};

export default ReferralForm;