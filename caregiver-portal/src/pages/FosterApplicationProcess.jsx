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
  const [forms, setForms] = React.useState([]);
  const [applicationPackage, setApplicationPackage] = React.useState(null);
  const [referralApplicationId, setReferralApplicationId] = React.useState(null);
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

  console.log(`Foster Application Process with: ${applicationPackageId} `);

  // TODO: Figure out what step we're on...

  const breadcrumbItems = [
    { label: 'Home', path: '/dashboard' },
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
          setForms(formsArray);
          setApplicationPackage(packageData);

          const referralForm = formsArray.find(form => form.type === 'Referral');
          //const referralId = referralForm?.applicationId || null;
          setReferralApplicationId(referralForm?.applicationId || null);
          //console.log('referral id:', referralId);
        } catch (error) {
          console.error('Failed to load forms:', error);
        }
      }
    };
    loadForms();
  }, []);

  //const referralId = formsArray.

  const handleContinue = (step) => {
    if(step.key === "referral") {
      navigate(`/foster-application/application-package/${applicationPackageId}/referral-form/${referralApplicationId}`);
    } else {
      navigate(`/foster-application/application-package/${applicationPackageId}`);
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
  const getSteps = (applicationPackage) => {
    const baseSteps = [
      {key: 'referral', label: 'Information Session', description: 'The first step is to register for an information session.', disabled: false },
      {key: 'application', label: 'Caregiver Application', description: 'After attending an information session, you may submit an application to become a foster caregiver.', disabled: true},
      {key: 'consent', label: 'Consents & Agreements', description: 'After you submit your application form, all adults in your home need to provide information and consent for background checks to commence.', disabled: true},
      {key: 'screening', label: 'Screening', description: 'Once consents are received, the ministry will begin reviewing and conducting checks on all the adult members of your household. This process can take anywhere from 2 weeks to 3 months.', disabled: true},
      {key: 'homevisits', label: 'Home Visits', description: 'A social worker will contact you to schedule a series of home visits. During these visits, the social worker will discuss your motivations for fostering, your family dynamics, and your ability to meet the needs of children in care.', disabled: true},
    ];
    return baseSteps.map(step => {
      if (step.key === 'referral' && applicationPackage?.referralstate === 'Requested') {
        return {
          ...step,
          label: 'Information Session Requested',
          description: 'Your request for an information session has been submitted. You will be contacted to schedule your session shortly.',
          disabled: true,
          iconType: 'waiting',
        };
      }
      if (step.key === 'application' && applicationPackage?.srStage === 'Application') {
        return {
          ...step,
          description: 'Complete and submit your caregiver application package.',
          disabled: false,
          iconType: 'start',
        }
      }  
      return step;
    });
  }

    const dynamicSteps = React.useMemo(() => {
      return getSteps(applicationPackage);
    }, [applicationPackage]);

return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
          <h1 className="page-title">Become a foster caregiver</h1>
          <p className="caption">You're on Step 1 of 4</p>
        <div className="application-package">
            {dynamicSteps.map((step, index) => (
            <div key={step.key}>
               <ApplicationProcessStep step={step} index={index} onContinue={ step.disabled ? undefined : () => handleContinue(step)} />
            </div>
            ))}
        </div>
        <div className="application-package-footer">
                <Button variant="danger"
                  onClick={() => handleCancel(applicationPackageId)}
                  disabled={isDeleting}
                  ><Trash size="16" />Cancel application</Button>

                  <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Cancel Application"
                    message="Are you sure you want to cancel your application? This action cannot be undone and all associated data will be permanently deleted."
                    confirmText="Yes, Cancel Application"
                    cancelText="Keep Application"
                    confirmVariant="danger"
                    isLoading={isDeleting}
                    />
                    {error && <div className="error-message">{error}</div>}
        </div>
      </div>
  );
};

export default FosterApplicationProcess;