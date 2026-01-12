import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import "../DesignTokens.css";
import BreadcrumbBar from '../components/BreadcrumbBar';
import Household from '../components/Household';
import {useApplicationPackage} from '../hooks/useApplicationPackage';

const HouseholdForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  //const navigate = useNavigate();

  const [nextUrl, setNextUrl] = useState('');
  const { getApplicationForms } = useApplicationPackage();  

  const home = `/foster-application/application-package/${applicationPackageId}`;

  // Load all forms to determine next form in sequence
  useEffect(() => {
  if (applicationPackageId && applicationFormId) {
    getApplicationForms(applicationPackageId)
      .then(formsArray => {
        // Find current form index
        const currentIndex = formsArray.findIndex(
          form => form.applicationFormId === applicationFormId
        );

        // Get next form (skip Referral types)
        if (currentIndex !== -1 && currentIndex < formsArray.length - 1) {
          let nextIndex = currentIndex + 1;
          while (nextIndex < formsArray.length &&
                 formsArray[nextIndex].type === 'Referral') {
            nextIndex++;
          }

          if (nextIndex < formsArray.length) {
            const nextForm = formsArray[nextIndex];

            // Build URL based on form type
            if (nextForm.type && nextForm.type.toLowerCase().includes('household')) {
              setNextUrl(`/foster-application/application-package/${applicationPackageId}/household-form/${nextForm.applicationFormId}`);
            } else {
              setNextUrl(`/foster-application/application-package/${applicationPackageId}/application-form/${nextForm.applicationFormId}`);
            }
          }
        }
      })
      .catch(err => console.error('Error fetching forms:', err));
  }
}, [applicationPackageId, applicationFormId, getApplicationForms]);

  return (
    <div className="household-container">
    {/* Top breadcrumb - aligned with page content */}
    <div className="breadcrumb-top">
      <div className="breadcrumb-top-content">
        <BreadcrumbBar home={home} next={nextUrl} label={"My household"}/>
      </div>
    </div>

    {/* Scrollable content area */}
    <div className="household-content">
      <div className="household-content-inner">
        <div className="page-details-row-small">
          <h1 className="page-title">My household</h1>
        </div>

        <div className="page-details-row">
          <Household applicationPackageId={applicationPackageId} applicationFormId={applicationFormId} />
        </div>
      </div>
    </div>

  </div>
    
  );

};

export default HouseholdForm;