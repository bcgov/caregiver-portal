import { useCallback } from 'react';
import { sendJson } from '../utils/api';


// Creates the Additional Adult package, the household member, and sends the access code.
// Resolves to { applicationPackageId, householdMemberId }; throws an Error with a displayable message.
export const useAdditionalAdult = () => {
    const addMember = useCallback(
        (values) =>
            sendJson(
                'POST',
                '/application-package/additional-adult',
                values,
                'We could not add this household member. Please try again.',
            ),
        [],
    );
    return { addMember };
};
