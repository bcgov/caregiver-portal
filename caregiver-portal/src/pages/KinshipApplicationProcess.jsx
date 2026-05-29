import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationProcessStep from '../components/ApplicationProcessStep';
import Breadcrumb from '../components/Breadcrumb';
import { Trash, FilePlus } from 'lucide-react';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { useCancelApplicationPackage } from '../hooks/useCancelApplication';
import { useApplicationPackage } from '../hooks/useApplicationPackage';

const KinshipApplicationProcess = () => {
  const { applicationPackageId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showReferralModal, setShowReferralModal] = React.useState(false);
  const [applicationPackage, setApplicationPackage] = React.useState(null);
  const [householdMemberId, setHouseholdMemberId] = React.useState(null);
  const resubmitLink = `/kinship-application/${applicationPackageId}/resubmit`;
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
    'Application': 1,
    'Consent': 2,
    'Submitted': 3,
    'Complete': 5
  }

  const resubmit_on = import.meta.env.VITE_RESUBMIT_ON === 'true' || false;

  const getCurrentStep = (status) => {
    return statusStepMap[status]
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Become a kinship caregiver', path: '/dashboard' },
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

          console.log(packageData);

          const referralForm = formsArray.find(form => form.type === 'Referral');
          //setReferralApplicationFormId(referralForm?.applicationFormId || null);
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
      case "consent":
        navigate(`/kinship-application/application-package/${applicationPackageId}/consent-summary`);
        break;
      case "screening":
        navigate(`/kinship-application/application-package/${applicationPackageId}/medical-forms/${householdMemberId}`);
        break;
      default: 
        navigate(`/kinship-application/application-package/${applicationPackageId}`);
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
    navigate(`/kinship-application/referral-package/${applicationPackageId}`);
  }

  const hasMedicalAssessment = applicationPackage?.hasMedicalAssessment && applicationPackage?.hasMedicalAssessment === true;

  
  const getSteps = (applicationPackage) => {
    const baseSteps = [
      {key: 'application', label: 'Submit caregiver application', description: 'After attending an information session, you may submit an application to become a kinship caregiver.', disabled: false},
      {key: 'consent', label: 'Submit household screening forms and consents', description: 'After you submit your application form, all adults in your home need to provide information and consent for background checks to commence.', disabled: true},
      {key: 'screening', label: 'Screening', description: 'Once your application and consents are received, the screening process will begin. This includes: four references, a medical assessment completed by a physician, a criminal record check and/or review, and a prior contact check for previous child welfare involvement.', disabled: true},
      {key: 'training', label: 'Training', description: 'Pre-Service training is required prior to your home study. This is a 35-hour online training and is completed over a 12-week period.', disabled: true },
      {key: 'homevisits', label: 'Home Study', description: 'A social worker will contact you to schedule a series of home visits. During these visits, the social worker will discuss your motivations for kinshiping, your family dynamics, and your ability to meet the needs of children in care.', disabled: true},
    ];
    return baseSteps.map(step => {
      if (step.key === 'application' && applicationPackage?.status === 'Application') {

        return {
          ...step,
          description: 'Complete and submit your caregiver application package.',
          disabled: false,
          iconType: 'start',
        }
      } 
      if (step.key === 'application' && (applicationPackage?.status === 'Consent' || applicationPackage?.status === 'Submitted' || applicationPackage?.status === 'Ready')) {

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
      if (step.key === 'consent' && applicationPackage && !['Application', 'New', 'Draft', 'Referral Requested'].includes(applicationPackage?.status)) {
        return {
          ...step,
          description: 'All household members have submitted their screening forms.',
          disabled: true,
          iconType: 'complete',
        }
      }
      if (step.key === 'screening' && (applicationPackage?.status === 'Submitted' && applicationPackage?.srStage !== 'Assessment') && !hasMedicalAssessment) {

        return {
          ...step,
          description: 'Screening process is underway. You may proceed to complete your medical forms with the assistance of an authorized healthcare practitioner.',
          disabled: false,
          iconType: 'start',
        }
      }

      if (step.key === 'screening' && (applicationPackage?.status === 'Ready')) {
        // to cover the 2 minute interval that happens before the screening forms are completed that the cron job picks up the package to submit it
        return {
          ...step,
          iconType: 'waiting',
        }
      }

      if (step.key === 'screening' && (applicationPackage?.status === 'Submitted' && applicationPackage?.srStage !== 'Assessment') && hasMedicalAssessment) {

        return {
          ...step,
          description: 'You have submitted your medical assessment forms. The screening process is underway..',
          disabled: true,
          iconType: 'waiting',
        }
      }

      if (step.key === 'screening' && applicationPackage?.srStage === 'Assessment') {

        return {
          ...step,
          description: 'The kinship caregiver screening has been completed.',
          disabled: true,
          iconType: 'complete',
        }
      }

      if (step.key === 'training' && (applicationPackage?.srStage === 'Assessment')) {

        return {
          ...step,
          description: 'Kinship caregiver applicants are required to complete training before receiving approval as a kinship caregiver. This online training takes approximately 35 hours to complete and is self-paced over a 12-week period. Learners are supported by specialized facilitators. An assigned resource worker will register kinship caregiver applicants for this training.',
          disabled: true,
          iconType: 'waiting',
          learnMoreLink: 'https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving#:~:text=4%2E%20Complete%20Pre%2DService%20Training'

        }
      }

      if (step.key === 'homevisits' && (applicationPackage?.srStage === 'Assessment')) {

        return {
          ...step,
          description: 'A resource worker will complete several in-home interviews with prospective caregivers. Once the home study is complete, it will be reviewed and signed off by the applicants.',
          disabled: true,
          iconType: 'waiting',
          learnMoreLink: 'https://www2.gov.bc.ca/gov/content/family-social-supports/fostering/caringforchildrenandyouth/fostercaregiving#:~:text=5%2E%20Home%20Visit%28s%29%20to%20Start%20Home%20Study'

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
          <h1 className="page-title">Become a kinship caregiver</h1>
        </div>
        <div className='page-details-row-small'>
          <p className="caption">You're on Step {getCurrentStep(applicationPackage?.status)} of 5</p>
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

                { (resubmit_on && applicationPackage?.status === 'Submitted' ) && (
                <Button variant="white"
                  onClick={() => navigate(resubmitLink)}
                  disabled={isDeleting}
                  ><FilePlus size="16" />Add/Update Application Forms</Button>                  
                )}

                  <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Application"
                    message="Are you sure you want to delete your application to become a kinship caregiver? All the work you've done so far will be lost. This cannot be undone."
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
                      <p className="confirmation-modal-text">Kinship caregiving is about opening your home and caring for children and youth in B.C who are under the age of 19 and who temporarily cannot live with their own families.</p>
                      <p>To provide kinship family care in B.C.:</p>
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

export default KinshipApplicationProcess;