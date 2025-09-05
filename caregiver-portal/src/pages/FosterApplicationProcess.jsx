import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import "../DesignTokens.css";
import ApplicationProcessStep from '../components/ApplicationProcessStep';
import Breadcrumb from '../components/Breadcrumb';


const FosterApplicationProcess = () => {
  const { applicationId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', path: '/dashboard' },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  const handleContinue = () => {
    navigate(`/foster-application/application-package/${applicationId}`);
  };
  
  const [currentStep, setCurrentStep] = useState(null);
  // possible steps: 'application', 'consent', 'screening', 'homevisits'
  
  const steps = [
    {key: 'referral', label: 'Information Session', description: 'The first step is to register for an information session.' },
    {key: 'application', label: 'Caregiver Application', description: 'After attending an information session, you may submit an application to become a foster caregiver.' },
    {key: 'consent', label: 'Consents & Agreements', description: 'After you submit your application form, all adults in your home need to provide information and consent for background checks to commence.'},
    {key: 'screening', label: 'Screening', description: 'Once consents are received, the ministry will begin reviewing and conducting checks on all the adult members of your household. This process can take anywhere from 2 weeks to 3 months.'},
    {key: 'homevisits', label: 'Home Visits', description: 'A social worker will contact you to schedule a series of home visits. During these visits, the social worker will discuss your motivations for fostering, your family dynamics, and your ability to meet the needs of children in care.'},
 ];
// <ApplicationStep step={step} onClick={() => handleStepChange(step.key)}/>
    const handleStepChange = (step) => {
        setCurrentStep(step);
    }

return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
          <h1 className="page-title">Become a foster caregiver</h1>
          <p className="caption">You're on Step 1 of 4</p>
        <div className="application-package">
            {steps.map((step, index) => (
            <div key={step.key}>
               <ApplicationProcessStep step={step} index={index} onContinue={handleContinue} onClick={() => handleStepChange(step.key)}/>
            </div>
            ))}
        </div>
      </div>
  );

};

export default FosterApplicationProcess;