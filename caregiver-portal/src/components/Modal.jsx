import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
//import { isJsxOpeningElement } from 'typescript';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    showCloseButton = true,
    closeOnOverlayClick = true,
    size = 'medium',
}) => {
    if(!isOpen) return null;

    const handleOverlayClick = (e) => {
        if(closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    }

    const handleEscapeKey = (e) => {
        if(e.key === 'Escape') {
            onClose();
        }
    };

    React.useEffect(() => {
        if(isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
  
            return () => {
                document.removeEventListener('keydown', handleEscapeKey);
                document.body.style.overflow = 'unset';
            };
        } else {
            // When modal closes, restore scrolling
            document.body.style.overflow = 'unset';
        }
  
        // Cleanup function that always runs when component unmounts
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-content modal-${size}`}>
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    {showCloseButton && (
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            aria-label="Close modal"
                        >x</Button>
                    )}
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    showCloseButton: PropTypes.bool,
    closeOnOverlayClick: PropTypes.bool,
    size: PropTypes.oneOf(['small','medium','large','fullscreen'])
};

export default Modal;