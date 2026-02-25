import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationPackageStep from '../components/ApplicationPackageStep';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import { useDates } from '../hooks/useDates';
import { useUserProfile } from '../hooks/useUserProfile';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Declaration from '../components/Declaration';
import { Loader2 } from 'lucide-react';


const ReferralPackage = () => {
  const { applicationPackageId } = useParams();
  const { userProfile } = useUserProfile();
  const [forms, setForms] = React.useState([]);
  const [appPackage, setAppPackage] = React.useState();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isReferralComplete, setIsReferralComplete] = React.useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = React.useState(false);
  const navigate = useNavigate();     
  const { getApplicationForms, getApplicationPackage, requestInfoSession } = useApplicationPackage();
  const { formatSubmissionDate } = useDates();

    const breadcrumbItems = [
        { label: 'Become a foster caregiver', path: `/foster-application/${applicationPackageId}` },
        { label: 'Request an Information Session' },
      ];

      const handleBackClick = (item) => {
        navigate(item.path);
      };

      const handleContinue = (item) => {
        if (item.type && item.type.toLowerCase().includes('referral')) {
          // Special case for household form
          navigate(`/foster-application/application-package/${applicationPackageId}/referral-form/${item.applicationFormId}`);
          return;
        } else { 
          navigate(`/foster-application/referral-package/${applicationPackageId}/application-form/${item.applicationFormId}`);
          return
        }
      }

      const handleState = (item) => {
        if (item.type && item.type.toLowerCase().includes('referral')) {
          return (userProfile?.gender)
            ? 'Complete'
            : item.status;
        }
        return item.status;
      }

      const isApplicationComplete = () => {

        // Check if all non-household forms have status 'Complete'
        const nonReferralForms = forms.filter(form =>
          !form.type?.toLowerCase().includes('referral') 
        );
        const allFormsComplete = nonReferralForms.length > 0 &&
          nonReferralForms.every(form => form.status === 'Complete');

        const referralDataSaved = !!userProfile?.gender;          
        // Both conditions must be true
        return allFormsComplete && referralDataSaved;
      };

      const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
          await requestInfoSession(applicationPackageId, {});
          navigate(`/foster-application/${applicationPackageId}`);
        } catch (error) {
          console.error('Submission failed:', error);
          alert('Failed to submit request. Please try again.');
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
              //setIsApplicationLocked(true);
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

      console.log('applicationPackageId:', applicationPackageId);
      console.log('forms:', forms);

    return (
      <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
        </div>
        <div className='page-details-row-small'>
          <h1 className="page-title">Submit an Information Session Request</h1>
        </div>
        <div className='page-details-row-small'>
          <p className="caption">Your information is being collected by the Ministry of Children and Family Development (MCFD) for the purpose of facilitating your application to become a caregiver/care provider and be involved in the provision of care to children for MCFD. This information is collected under sections 26(c) and (e) of the Freedom of Information and Protection of Privacy Act. If you have questions about this collection of information, please contact <a href="mailto:MCF.CentralizedRetentionandRecruitment@gov.bc.ca">MCF.CentralizedRetentionandRecruitment@gov.bc.ca</a>.</p>
        </div>
        <div className='page-details-row-small'>
          <div className="application-package">
            {forms.map((step, index) => (
               <ApplicationPackageStep key={step.key} step={step} index={index} onContinue={() => {handleContinue(step)}} state={handleState(step)}/>
            ))}
        </div>
        </div>
        
        <div className="page-details-row-footer">
        {!isApplicationComplete() &&
          <p className="caption">Once all sections are complete, you'll be able to submit your request.</p>
        }
        {isApplicationComplete() && 
          <>
          <p className="caption">All sections are complete! Review the information you've provided then submit when ready.</p>
          <Declaration
            checked={isDeclarationChecked || isReferralComplete}
            onChange={setIsDeclarationChecked}
            disabled={isReferralComplete}
          >
            I declare that the information contained in this application is true to the best of my knowledge and belief, and believe that I have not omitted any information requested.
          </Declaration>
      
          </>
        }
        <div className="page-details-row">
        {!isReferralComplete ? (
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

export default ReferralPackage;