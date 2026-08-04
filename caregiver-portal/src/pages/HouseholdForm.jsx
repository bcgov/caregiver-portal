import React, {useEffect, useState, useMemo} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import "../DesignTokens.css";
import BreadcrumbBar from '../components/BreadcrumbBar';
import Household from '../components/Household';
import {useApplicationPackage} from '../hooks/useApplicationPackage';
import { useHousehold } from '../hooks/useHousehold';

const HouseholdForm = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const [nextUrl, setNextUrl] = useState('');
  const { getApplicationForms } = useApplicationPackage();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/kinship-application')
    ? `/kinship-application/application-package/${applicationPackageId}`
    : `/foster-application/application-package/${applicationPackageId}`;
      
  // Single source of truth for household data (the component page uses it as well)
  const householdHook = useHousehold({applicationPackageId});
  const [formMessage, setFormMessage] = React.useState('');
  const HOUSEHOLDFORM = 'Adults in my home';


  const home = basePath;

    // Mock applicationForm object for the breadcrumb
    const householdFormStatus = useMemo(() => {
      const isComplete = householdHook.isHouseholdComplete();

      return {
        type: HOUSEHOLDFORM,
        status: isComplete && householdHook.hasHousehold !== null && householdHook.hasPartner !== null ? 'Complete' : 'Draft'
      };
    }, [householdHook]);


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
            if (nextForm.type && nextForm.type === HOUSEHOLDFORM) {
              setNextUrl(`${basePath}/household-form/${nextForm.applicationFormId}`);
            } else {
              setNextUrl(`${basePath}/application-form/${nextForm.applicationFormId}`);
            }
          }
        }
      })
      .catch(err => console.error('Error fetching forms:', err));
  }
}, [applicationPackageId, applicationFormId, getApplicationForms]);

  // Update message when household status changes
  useEffect(() => {
    if (householdFormStatus.status === 'Complete') {
      setFormMessage('');
    } else if (householdFormStatus.status === 'Draft') {
      setFormMessage('Household information is incomplete.');
    } else {
      setFormMessage('');
    }
  }, [householdFormStatus.status]);

  return (
    <div className="household-container">
    {/* Top breadcrumb - aligned with page content */}
    <div className="breadcrumb-top">
      <div className="breadcrumb-top-content">
        <BreadcrumbBar home={home} next={nextUrl} applicationForm={householdFormStatus} message={formMessage}/>
      </div>
    </div>

    {/* Scrollable content area */}
    <div className="household-content">
      <div className="household-content-inner">
        <div className="page-details-row-small">
          <h1 className="page-title">{HOUSEHOLDFORM}</h1>
        </div>

        <div className="page-details-row">
          <Household applicationPackageId={applicationPackageId} applicationFormId={applicationFormId} householdHook={householdHook} />
        </div>
      </div>
    </div>

  </div>
    
  );

};

export default HouseholdForm;