import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationPackageStep from '../components/ApplicationPackageStep';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useDates } from '../hooks/useDates';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';


const FosterApplicationPackage = () => {
  const { applicationPackageId } = useParams();
  const [forms, setForms] = React.useState([]);
  const [household, setHousehold] = React.useState();
  const [appPackage, setAppPackage] = React.useState();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = React.useState(false);
  const [isApplicationLocked, setIsApplicationLocked] = React.useState(false);
  const navigate = useNavigate();     
  const { getApplicationForms, getApplicationPackage, lockApplicationPackage, validateHouseholdCompletion } = useApplicationPackage();
  const { formatSubmissionDate } = useDates();

    const breadcrumbItems = [
        { label: 'Back', path: `/foster-application/${applicationPackageId}` },
      ];

      const handleBackClick = (item) => {
        navigate(item.path);
      };

      const handleContinue = (item) => {
        if (item.type && item.type.toLowerCase().includes('household')) {
          // Special case for household form
          navigate(`/foster-application/application-package/${applicationPackageId}/household-form/${item.applicationFormId}`);
          return;
        } else { 
          navigate(`/foster-application/application-package/${applicationPackageId}/application-form/${item.applicationFormId}`);
          return
        }
      }

      const handleState = (item) => {
        // TODO: Finish this

        //household will need a verify complet function that looks into the hasHoushold, hasSpouse, etc to verify they are not null
        //and for either of those that are true, verify that there is at least one household member that matches those criterion
        // the other types will be based off the applicationForm.status; which may not be right yet until we figure out the submission
        // state

        if (item.type && item.type.toLowerCase().includes('household') && household?.isComplete) {
          return 'complete';
        } else {
          return 'default';
        }
      }

      const isApplicationComplete = () => {
        return household?.isComplete === true;
      };

      const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
          const result = await lockApplicationPackage(applicationPackageId);
          console.log('lock successful:', result);
          setIsApplicationLocked(true);
        } catch (error) {
          console.error('lock failed:', error);
          alert('Failed to lock application. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      }

      React.useEffect(() => {
        const loadPackage = async () => {
          try {
            console.log('Loading package for packageId:', applicationPackageId)
            const appPackage = await getApplicationPackage(applicationPackageId);
            console.log('Application package:', appPackage);
            setAppPackage(appPackage);
            if(appPackage.status === 'Submitted') {
              console.log('locking application');
              setIsApplicationLocked(true);
              navigate(`/foster-application/${applicationPackageId}`); // navigate back to the process page
            } else {
              console.log('not locking application');
            }
          } catch (error) {
            console.error('failed to load application package', error);
          }
        }
        loadPackage();
      }, []);
  
      React.useEffect(() => {
        const loadForms = async () => {
          if (applicationPackageId) {
            try {
              console.log('Loading forms for packageId:', applicationPackageId);
              const formsArray = await getApplicationForms(applicationPackageId);
              console.log('loaded forms:', formsArray);
              setForms(formsArray);
            } catch (error) {
              console.error('Failed to load forms:', error);
            }
          }
        };
        loadForms();
      }, []);

      React.useEffect(() => {
        const loadHouseholdStatus = async () => {
          if (applicationPackageId) {
            const householdStatus = await validateHouseholdCompletion(applicationPackageId)
            setHousehold(householdStatus);
            console.log('household status:', householdStatus);
        }
        };
        loadHouseholdStatus();
      }, []);

      console.log('applicationPackageId:', applicationPackageId);
      console.log('forms:', forms);


  
      
    //const applicationPackageItems = [
/*
        {key: 'profile', label: 'About me', path: `/foster-application/application-package/${applicationPackageId}/application-form/${applicationFormId}`, description: 'Provide details about your household, lifestyle, and experience.'},
        {key: 'household', label: 'My household and support network', path: `/foster-application/application-package/household-form/${applicationId}`, description: 'All adults in the household must consent to background checks.'},
        {key: 'pastinvolvement', label: 'Past involvement with Child Welfare'},
        {key: 'healthhistory', label: 'Health history'},
        {key: 'placementconsiderations', label: 'Placement considerations'},
        {key: 'references', label: 'References', description: 'All adults in the household must consent to background checks.'},        
        {key: 'consent', label: 'Consent for prior contact check', description: 'Complete required training sessions.'},   
*/// ]

    return (
      <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
        </div>
        <div className='page-details-row-small'>
          <h1 className="page-title">Application to provide foster family care</h1>
        </div>
        <div className='page-details-row-small'>
          <p className="caption">The personal information requested on these forms is being collected by the Ministry of Children and Family Development (MCFD)
            under Section 26(c) and will be used for the purposes of your Caregiver Application. The information collected on these forms will be strictly used by 
            MCFD for Caregiver Application and Assessment activities. If you have questions about the collection of your information for this purpose, please contact 
            the Community Liaison/Quality Assurance Officer, toll free at 1-866-623-3001, or mail PO Box 9776 Station Provincial Government, Victoria BC V8W 9S5.</p>
        </div>
        <div className='page-details-row-small'>
          <div className="application-package">
            {forms.map((step, index) => (
              step.type !== 'Referral' && // Exclude 'Referral' type steps
               <ApplicationPackageStep key={step.key} step={step} index={index} onContinue={() => {handleContinue(step)}} state={handleState(step)}/>
            ))}
        </div>
        </div>
        
        <div className="page-details-row-footer">
        {!isApplicationComplete() &&
          <p className="caption">Once all sections are complete, you'll be able to submit your application.</p>
        }
        {isApplicationComplete() && 
          <>
          <p className="caption">All sections are complete! Review the information you've provided then submit when ready.</p>
          <div className="declaration">
          <input className="declaration-checkbox" 
            checked={isDeclarationChecked || isApplicationLocked} 
            onChange={(e) => setIsDeclarationChecked(e.target.checked)} 
            disabled={isApplicationLocked}
            type="checkbox"
            /><p className='declaration-text'>I declare that the information contained in this application is true to the best of my knowledge and belief, and belive that I have not ommitted any information requested.</p>
          </div>
      
          </>
        }
        <div className="page-details-row-small">
        {!isApplicationLocked ? (
        <Button variant={isApplicationComplete() && isDeclarationChecked ? 'primary' : 'disabled'} onClick={handleSubmit} disabled={!isApplicationComplete() || !isDeclarationChecked || isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Application'}</Button>
        ) : (
          <div className="section-description">
          <p><strong>Application Submitted on {formatSubmissionDate(appPackage.submittedAt)}</strong></p>
          
        </div>
        )}
        </div>
        </div>
      </div>
      </div>
    )
};

export default FosterApplicationPackage;