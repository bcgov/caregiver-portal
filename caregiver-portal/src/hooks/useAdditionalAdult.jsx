import { useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

// Creates the Additional Adult package, the household member, and sends the access code.
// Resolves to { applicationPackageId, householdMemberId }; throws an Error with a displayable message.
export const useAdditionalAdult = () => {
    const addMember = useCallback(async (values) => {
        const res = await fetch(`${API_BASE_URL}/application-package/additional-adult`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        if (!res.ok) {
            let message;
            try {
                const body = await res.json();
                message = Array.isArray(body.message) ? body.message.join(' ') : body.message;
            } catch {
                // no JSON body; fall through to the default message
            }
            throw new Error(message || 'We could not add this household member. Please try again.');
        }
        return res.json();
    }, []);
    return { addMember };
};
