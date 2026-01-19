// src/components/ConfirmationModal.jsx
import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  isLoading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    // Force restore scrolling when modal closes
    document.body.style.overflow = 'unset';
    onClose();
  };

  // Cleanup on unmount - force restore scrolling
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);  

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      showCloseButton={true}
      closeOnOverlayClick={!isLoading}
      size="medium"
    >
      <div className="confirmation-modal">
        <p className="confirmation-message">{message}</p>

        <div className="confirmation-actions">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button 
            variant={confirmVariant} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;