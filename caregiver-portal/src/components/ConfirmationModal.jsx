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
  children,
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
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
      size="medium"
    >
      <div className="confirmation-modal">
        {children ? (
          <div className="confirmation-message">{children}</div>
        ) : (
          <p className="confirmation-message">{message}</p>
        )}
        
        <div className="confirmation-actions">
        <Button 
            variant={confirmVariant} 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : confirmText}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>


        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;