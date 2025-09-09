import React from "react";
import Modal from "./Modal";
import Button from "./Button";

const AccessCodeModal = ({
    isOpen,
    onClose,
    accessCode,
    memberName,
    //expiresAt,
    isLoading
}) => {

    //const handleCopyCode = () => {
    //    navigator.clipboard.writeText(accessCode);
    //    // toast!
    //};

    //const formatExpiryDate = 

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Access Code for Household Member"
            size="medium"
        >
            {isLoading ? (
                <div>Generating access code...</div>
            ) : (
                <div>
                    <p>An access code has been generated for <strong>{memberName}</strong> to complete their screening application.</p>
                    <h1>{accessCode}</h1>
                </div>
            )
        
        }
        </Modal>
    );
};

export default AccessCodeModal;