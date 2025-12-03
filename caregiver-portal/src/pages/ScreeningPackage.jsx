import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationPackageStep from '../components/ApplicationPackageStep';
import { useApplications } from '../hooks/useApplications';
import Breadcrumb from '../components/Breadcrumb';
import Button from '../components/Button';
import Declaration from '../components/Declaration';
import { Loader2 } from 'lucide-react';


const ScreeningPackage = () => {
  const navigate = useNavigate();     
  const { householdMemberId } = useParams();
  const [forms, setForms] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeclarationChecked, setIsDeclarationChecked] = React.useState(false);
  const { getApplicationFormsByHouseholdMember, confirmScreeningPackage } = useApplications();
  const back = `/dashboard`

    const breadcrumbItems = [
        { label: 'Back', path: back },
      ];

      const handleBackClick = (item) => {
        navigate(item.path);
      };

      const handleContinue = (item) => {
          navigate(`/screening-package/${householdMemberId}/screening-form/${item.applicationFormId}`);
          return;
      }

      const handleState = (item) => {
          return item.status;
      }

      const isApplicationComplete = () => {

        const allFormsComplete = forms.length > 0 &&
          forms.every(form => form.status === 'Complete');

        return allFormsComplete;
      };

      const handleSubmit = async () => {

        if(!isDeclarationChecked) {
          return;
        }

        setIsSubmitting(true);
        try {
          const applicationPackageId = forms[0]?.applicationPackageId;
          if (!applicationPackageId) {
            throw new Error('Application package ID not found');
          }
          const result = await confirmScreeningPackage(applicationPackageId, householdMemberId);
          console.log('Screening package confirmed', result);
          navigate(back);
        } catch (error) {
          console.error('screening package confirmation failed:', error);
        } finally {
          setIsSubmitting(false);
        }
      }

      React.useEffect(() => {
        const loadForms = async () => {
          if (householdMemberId) {
            try {
              console.log('Loading forms for householdMemberId:', householdMemberId);
              const formsArray = await getApplicationFormsByHouseholdMember(householdMemberId);
              console.log('loaded forms:', formsArray);
              setForms(formsArray);
            } catch (error) {
              console.error('Failed to load forms:', error);
            }
          }
        };
        loadForms();
      }, []);

    return (
      <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />
        </div>
        <div className='page-details-row-small'>
          <h1 className="page-title">Application to provide foster family care</h1>
        </div>
        <div className='page-details-row'>
        <div className="section-description">
              You have been named as the spouse/co-applicant on an application. You must submit this application.</div>
              </div>        
        <div className='page-details-row-small'>
          <div className="application-package">
            {forms.map((step, index) => (
              step.type !== 'Referral' && // Exclude 'Referral' type steps
               <ApplicationPackageStep key={index} step={step} index={index} onContinue={() => {handleContinue(step)}} state={handleState(step)}/>
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
            checked={isDeclarationChecked}
            onChange={setIsDeclarationChecked}
            disabled={false}
          >
            I declare that the information contained in this application is true to the best of my knowledge and belief, and believe that I have not omitted any information requested.
          </Declaration>


      
          </>
        }

        <Button variant={isDeclarationChecked ? "primary" : "disabled"} onClick={handleSubmit} disabled={!isDeclarationChecked || isSubmitting}>Submit</Button>

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

export default ScreeningPackage;