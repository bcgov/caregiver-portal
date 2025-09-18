import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../DesignTokens.css";
import ApplicationProcessStep from '../components/ApplicationProcessStep';
import Breadcrumb from '../components/Breadcrumb';
import { Trash } from 'lucide-react';
import Button from '../components/Button';
import ConfirmationModal from '../components/ConfirmationModal';
import { useCancelApplicationPackage } from '../hooks/useCancelApplication';

const FosterApplicationProcess = () => {
  const { applicationPackageId } = useParams();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const navigate = useNavigate();
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

  const handleContinue = () => {
    navigate(`/foster-application/application-package/${applicationPackageId}`);
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
  const steps = [
    {key: 'referral', label: 'Information Session', description: 'The first step is to register for an information session.' },
    {key: 'application', label: 'Caregiver Application', description: 'After attending an information session, you may submit an application to become a foster caregiver.' },
    {key: 'consent', label: 'Consents & Agreements', description: 'After you submit your application form, all adults in your home need to provide information and consent for background checks to commence.'},
    {key: 'screening', label: 'Screening', description: 'Once consents are received, the ministry will begin reviewing and conducting checks on all the adult members of your household. This process can take anywhere from 2 weeks to 3 months.'},
    {key: 'homevisits', label: 'Home Visits', description: 'A social worker will contact you to schedule a series of home visits. During these visits, the social worker will discuss your motivations for fostering, your family dynamics, and your ability to meet the needs of children in care.'},
 ];

return (
    <div className="application-frame">
        <Breadcrumb items={breadcrumbItems} onBackClick={handleBackClick} />  
          <h1 className="page-title">Become a foster caregiver</h1>
          <p className="caption">You're on Step 1 of 4</p>
        <div className="application-package">
            {steps.map((step, index) => (
            <div key={step.key}>
               <ApplicationProcessStep step={step} index={index} onContinue={handleContinue} />
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