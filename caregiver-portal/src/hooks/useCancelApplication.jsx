import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useCancelApplicationPackage = (onSuccess) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const cancelApplicationPackage = useCallback(async (applicationPackageId) => {
        try {
            setIsDeleting(true);
            setError(null);

            const response = await fetch(`${API_BASE_URL}/application-package/${applicationPackageId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                let errorMessage = `Failed to cancel application package`;

                if (response.status === 400) {
                  errorMessage = 'Application cannot be cancelled (may already be submitted)';
                } else if (response.status === 404) {
                  errorMessage = 'Application not found';
                } else if (response.status === 401) {
                  errorMessage = 'Session expired. Please log in again';
                } else if (response.status === 403) {
                  errorMessage = 'You do not have permission to cancel this application';
                }
                
                throw new Error(errorMessage);
            }

            if (onSuccess) {
                onSuccess(applicationPackageId);
            }

        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsDeleting(false);
        }
    }, [onSuccess]);    
    return {
        cancelApplicationPackage,
        isDeleting,
        error,
        clearError: () => setError(null)
    };
};
