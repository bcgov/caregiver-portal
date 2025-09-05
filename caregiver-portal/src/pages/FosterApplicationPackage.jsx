import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import "../DesignTokens.css";
import ApplicationPackageStep from '../components/ApplicationPackageStep';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';


const FosterApplicationPackage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();      

    const breadcrumbItems = [
        { label: 'Back', path: `/foster-application/${applicationId}` },
      ];

      const handleBackClick = (item) => {
        navigate(item.path);
      };

      const handleContinue = (item) => {
        alert("Continuing to: " + item.path);
        navigate(item.path);
      }
      
    const applicationPackageItems = [

        {key: 'profile', label: 'Caregiver Profile Details', path: `/foster-application/application-package/profile-form/${applicationId}`, description: 'Provide details about your household, lifestyle, and experience.'},
        {key: 'household', label: 'Household Details', description: 'All adults in the household must consent to background checks.'},
        {key: 'references', label: 'References', description: 'All adults in the household must consent to background checks.'},        
        {key: 'consent', label: 'Consent', description: 'Complete required training sessions.'},    ]

    return (
        <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
          <h1 className="page-title">Application to provide foster family care</h1>
          <div className="application-package">
            {applicationPackageItems.map((step, index) => (

               <ApplicationPackageStep key={step.key} step={step} index={index} onClick={() => {handleContinue(step)}}/>
            
            ))}
        </div>
        <p className="caption">Once all sections are complete, you'll be able to submit your application.</p>
        <Button variant="disabled">Submit Application</Button>
      </div>
    )
};

export default FosterApplicationPackage;