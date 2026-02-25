import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationPackageStep from '../components/ApplicationPackageStep';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useDates } from '../hooks/useDates';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Declaration from '../components/Declaration';
import { Loader2 } from 'lucide-react';


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
        { label: 'Become a foster caregiver', path: `/foster-application/${applicationPackageId}` },
        { label: 'Application to provide foster family care' },
      ];

      const handleBackClick = (item) => {
        navigate(item.path);
      };

      const handleContinue = (item) => {
        if (item.type && item.type === 'Adults in household') {
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

        if (item.type === 'Adults in household' && household?.isComplete) {
          return 'Complete';
        } else {
          return item.status;
        }
      }

      const isApplicationComplete = () => {
        // Check if household is complete
        const householdComplete = household?.isComplete === true;
        // Check if all non-household forms have status 'Complete'
        const nonHouseholdForms = forms.filter(form =>
          !form.type?.toLowerCase().includes ('adults') &&
          !form.type?.toLowerCase().includes('referral') &&
          !form.type?.toLowerCase().includes('indigenous')
        );

        //console.log("NonHouseholdForms:",nonHouseholdForms)


        const allFormsComplete = nonHouseholdForms.length > 0 &&
          nonHouseholdForms.every(form => form.status === 'Complete');
        // Both conditions must be true
        return householdComplete && allFormsComplete;
      };

      const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
          const result = await lockApplicationPackage(applicationPackageId);
          console.log('lock successful:', result);
          setIsApplicationLocked(true);
          navigate(`/foster-application/${applicationPackageId}`);
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
          <p className="caption">Your information is being collected by the Ministry of Children and Family Development (MCFD) for the purpose of facilitating your application to become a caregiver/care provider and be involved in the provision of care to children for MCFD. This information is collected under sections 26(c) and (e) of the Freedom of Information and Protection of Privacy Act. If you have questions about this collection of information, please contact <a href="mailto:MCF.CentralizedRetentionandRecruitment@gov.bc.ca">MCF.CentralizedRetentionandRecruitment@gov.bc.ca</a>.</p>
        </div>
        <div className='page-details-row-small'>
          <div className="application-package">
            {forms.map((step, index) => (
              (step.type !== 'Referral' && step.type.indexOf('Indigenous') < 0) && // Exclude 'Referral' type steps
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
          <Declaration
            checked={isDeclarationChecked || isApplicationLocked}
            onChange={setIsDeclarationChecked}
            disabled={isApplicationLocked}
          >
            I declare that the information contained in this application is true to the best of my knowledge and belief, and believe that I have not omitted any information requested.
          </Declaration>
      
          </>
        }
        <div className="page-details-row">
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
                  {/* Submission Overlay - appears over entire page including iframe */}
                  {isSubmitting && (
              <div className="submission-overlay">
                <div className="submission-modal">
                  <Loader2 className="submission-spinner" />
                  <p className="submission-title">Submitting Form</p>
                  <p className="submission-text">Please wait while we process your submission...</p>
                </div>
              </div>
            )}

      </div>
    )
};

export default FosterApplicationPackage;