import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationPackage } from '../hooks/useApplicationPackage';
import ConfirmationModal from '../components/ConfirmationModal';
import Application from '../components/Application';
import "../DesignTokens.css";

const FormResubmission = () => {
  const { applicationPackageId, applicationFormId } = useParams();
  const navigate = useNavigate();
  const { submitFormToICM, deleteApplicationForm } = useApplicationPackage();
  const listPath = `/foster-application/${applicationPackageId}/resubmit`;
  const [showConfirmBack, setShowConfirmBack] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  //const handleClose = () => navigate(listPath);
  const handleBack = () => setShowConfirmBack(true);

  const handleConfirmBack = async () => {
    setIsDeleting(true);
    try {
      await deleteApplicationForm(applicationFormId);
      navigate(listPath);
    } catch (err) {
      console.error('Failed to delete cloned form:', err);
    } finally {
      setIsDeleting(false);
      setShowConfirmBack(false);
    }
  }

  const handleSubmitComplete = async () => {
    console.log('handleSubmitComplete called, applicationFormId:', applicationFormId);
    try {
      await submitFormToICM(applicationFormId);
      console.log('submitFormToICM succeeded');
      navigate(listPath);
    } catch (err) {   
      console.error('submitFormToICM failed:', err);
    }
  };

  return (
    <div className="page">
      <div className="page-details">
        <Application 
            applicationPackageId={applicationPackageId} 
            applicationFormId={applicationFormId} 
            onBack={handleBack}
            onSubmitComplete={handleSubmitComplete}
            nextLabel="Submit form"
            submitPackage={false}
            Context="Application"
            />
                  <ConfirmationModal
            isOpen={showConfirmBack}
            onClose={() => setShowConfirmBack(false)}
            onConfirm={handleConfirmBack}
            title="Go back without submitting?"
            message="Your changes to this form will be discarded. Are you sure you want to go back?"
            confirmText="Go back"
            cancelText="Keep editing"
            confirmVariant="danger"
            isLoading={isDeleting}
          />
    </div>
    </div>
  );

};

export default FormResubmission;