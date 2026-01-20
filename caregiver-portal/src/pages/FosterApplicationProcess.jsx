import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationProcessStep from '../components/ApplicationProcessStep';
import Breadcrumb from '../components/Breadcrumb';
import { Trash } from 'lucide-react';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { useCancelApplicationPackage } from '../hooks/useCancelApplication';
import { useApplicationPackage } from '../hooks/useApplicationPackage';

const FosterApplicationProcess = () => {
  const { applicationPackageId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showReferralModal, setShowReferralModal] = React.useState(false);
  const [applicationPackage, setApplicationPackage] = React.useState(null);
  const [referralApplicationFormId, setReferralApplicationFormId] = React.useState(null);
  const [householdMemberId, setHouseholdMemberId] = React.useState(null);
  const navigate = useNavigate();
  const { getApplicationForms, getApplicationPackage } = useApplicationPackage();
  const { cancelApplicationPackage, isDeleting, error } = useCancelApplicationPackage(() => {
    // Force restore scrolling before navigation
    document.body.style.overflow = 'unset';
    // Small delay to ensure DOM updates
    setTimeout(() => {
      navigate('/dashboard');
    }, 10);
    });

  const statusStepMap = {
    'Draft': 1,
    'Referral Requested': 1,
    'Application': 2,
    'Consent': 3,
    'Submitted': 4,
    'Complete': 5
  }

  const getCurrentStep = (status) => {
    return statusStepMap[status]
  };
  

  console.log(`Foster Application Process with: ${applicationPackageId} `);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Become a foster caregiver', path: '/dashboard' },
  ];

  const handleBackClick = (item) => {
    navigate(item.path);
  };

  React.useEffect(() => {
    const loadForms = async () => {
      if (applicationPackageId) {
        try {
          const [formsArray, packageData] = await Promise.all([
            getApplicationForms(applicationPackageId),
            getApplicationPackage(applicationPackageId)
          ]);
          //setForms(formsArray);
          setApplicationPackage(packageData);

          const referralForm = formsArray.find(form => form.type === 'Referral');
          setReferralApplicationFormId(referralForm?.applicationFormId || null);
          setHouseholdMemberId(referralForm?.householdMemberId || null);
        } catch (error) {
          console.error('Failed to load forms:', error);
        }
      }
    };
    loadForms();
  }, []);

  const handleContinue = (step) => {

    // show confirmation modal for referral step
    if (step.key === "referral") {
      setShowReferralModal(true);
      return;
    }

    switch(step.key) {
      //case "referral":
      //  navigate(`/foster-application/application-package/${applicationPackageId}/referral-form/${referralApplicationFormId}`);
      //  break;
      case "consent":
        navigate(`/foster-application/application-package/${applicationPackageId}/consent-summary`);
        break;
      case "screening":
        navigate(`/foster-application/application-package/${applicationPackageId}/medical-forms/${householdMemberId}`);
        break;
      default: 
        navigate(`/foster-application/application-package/${applicationPackageId}`);
        break;
    }
  };

  const handleCancel = () => {
    setShowDeleteModal(true);
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    try { 
      await cancelApplicationPackage(applicationPackageId);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to cancel:', err);
    }
  }


  const handleCancelReferral = () => {
    setShowReferralModal(false);
  };

  const handleConfirmReferral = () => {
    setShowReferralModal(false);
    navigate(`/foster-application/application-package/${applicationPackageId}/referral-form/${referralApplicationFormId}`);
  }

  const hasMedicalAssessment = applicationPackage?.hasMedicalAssessment && applicationPackage?.hasMedicalAssessment === true;

  
  const getSteps = (applicationPackage) => {
    const baseSteps = [
      {key: 'referral', label: 'Attend an information session', description: 'The first step is to register for an information session.', disabled: false, iconType: 'start', buttonLabel: 'Submit request to attend info session'},
      {key: 'application', label: 'Submit caregiver application', description: 'After attending an information session, you may submit an application to become a foster caregiver.', disabled: true},
      {key: 'consent', label: 'Submit household screening forms and consents', description: 'After you submit your application form, all adults in your home need to provide information and consent for background checks to commence.', disabled: true},
      {key: 'screening', label: 'Screening', description: 'Once your application and consents are received, the screening process will begin. This includes: four references, a medical assessment completed by a physician, a criminal record check and/or review, and a prior contact check for previous child welfare involvement.', disabled: true},
      {key: 'training', label: 'Training', description: 'Pre-Service training is required prior to your home study. This is a 35-hour online training and is completed over a 12-week period.', disabled: true },
      {key: 'homevisits', label: 'Home Study', description: 'A social worker will contact you to schedule a series of home visits. During these visits, the social worker will discuss your motivations for fostering, your family dynamics, and your ability to meet the needs of children in care.', disabled: true},
    ];
    return baseSteps.map(step => {
      if (step.key === 'referral' && applicationPackage?.status === 'Referral Requested') {

        return {
          ...step,
          label: 'Information Session Requested',
          description: 'Your request for an information session has been submitted. You will be contacted to schedule your session shortly.',
          disabled: true,
          iconType: 'waiting',
        };
      }
      if (step.key === 'referral' && applicationPackage?.status !== 'Draft' && applicationPackage?.status != 'Referral Requested') {

        return {
          ...step,
          label: 'Information Session Completed',
          description: 'You have attended an information session.',
          disabled: true,
          iconType: 'complete',
        };
      }
      if (step.key === 'application' && applicationPackage?.status === 'Application') {

        return {
          ...step,
          description: 'Complete and submit your caregiver application package.',
          disabled: false,
          iconType: 'start',
        }
      } 
      if (step.key === 'application' && (applicationPackage?.status === 'Consent' || applicationPackage?.status === 'Submitted')) {

        return {
          ...step,
          description: 'Your caregiver application package was completed.',
          disabled: true,
          iconType: 'complete',
        }
      }
      if (step.key === 'consent' && applicationPackage?.status === 'Consent') {

        return {
          ...step,
          description: 'Check the status of your household consent forms.',
          disabled: false,
          iconType: 'start',
        }
      }
      if (step.key === 'consent' && applicationPackage?.status === 'Submitted') {

        return {
          ...step,
          description: 'All household members have submitted their screening forms.',
          disabled: true,
          iconType: 'complete',
        }
      }
      if (step.key === 'screening' && (applicationPackage?.srStage === 'Screening' || applicationPackage?.status === 'Submitted') && !hasMedicalAssessment) {

        return {
          ...step,
          description: 'Screening process is underway. You may proceed to complete your medical forms with the assistance of an authorized healthcare practitioner.',
          disabled: false,
          iconType: 'start',
        }
      }

      if (step.key === 'screening' && (applicationPackage?.srStage === 'Screening' || applicationPackage?.status === 'Submitted') && hasMedicalAssessment) {

        return {
          ...step,
          description: 'You have submitted your medical assessment forms. The screening process is underway..',
          disabled: true,
          iconType: 'waiting',
        }
      }

      

      return step;
    });
  }

    const dynamicSteps = React.useMemo(() => {
      return getSteps(applicationPackage);
    }, [applicationPackage]);

return (

  
    <div className="page">
      <div className="page-details">
        <div className="page-details-row-breadcrumb">
          <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
        </div>
        <div className='page-details-row-small'>
          <h1 className="page-title">Become a foster caregiver</h1>
        </div>
        <div className='page-details-row-small'>
          <p className="caption">You're on Step {getCurrentStep(applicationPackage?.status)} of 6</p>
        </div>
        <div className='page-details-row-small'>
        <div className="application-package">
            {dynamicSteps.map((step, index) => (
            <div key={step.key}>
               <ApplicationProcessStep step={step} index={index} last={index === dynamicSteps.length - 1} onContinue={ step.disabled ? undefined : () => handleContinue(step)} buttonLabel={step.buttonLabel} />
            </div>
            ))}
        </div>
        </div>
        <div className="page-details-row-footer">
                <Button variant="danger"
                  onClick={() => handleCancel(applicationPackageId)}
                  disabled={isDeleting}
                  ><Trash size="16" />Cancel application</Button>

                  <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Application"
                    message="Are you sure you want to delete your application to become a foster caregiver? All the work you've done so far will be lost. This cannot be undone."
                    confirmText="Delete my application"
                    cancelText="Cancel"
                    confirmVariant="danger"
                    isLoading={isDeleting}
                    />

                  <ConfirmationModal
                      isOpen={showReferralModal}
                      onClose={handleCancelReferral}
                      onConfirm={handleConfirmReferral}
                      title="Before you apply"                      
                      confirmText="I understand"
                      cancelText="Cancel"
                      confirmVariant="primary-bold"
                      isLoading={false}
                    >
                      <p className="confirmation-modal-text">Foster caregiving is about opening your home and caring for children and youth in B.C who are under the age of 19 and who temporarily cannot live with their own families.</p>
                      <p>To provide foster family care in B.C.:</p>
                      <ul>
                        <li>You understand that Indigenous children and youth are entitled to learn about and practice their Indigenous traditions, customs, and languages, and to belong to their Indigenous communities</li>
                        <li>You understand the need to support a child or youth's sense of self, including cultural, racial, religious, gender, sexual identity</li>
                        <li>You understand that the support needs of children and youth in care are diverse and complex and you understand or are willing to learn about trauma informed care</li>
                      </ul>
                    </ConfirmationModal>
                    {error && <div className="error-message">{error}</div>}



        </div>

        </div>
      </div>
  );
};

export default FosterApplicationProcess;