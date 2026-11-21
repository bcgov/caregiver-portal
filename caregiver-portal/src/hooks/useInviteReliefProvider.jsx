import { useCallback } from 'react';
import { sendJson } from '../utils/api';

// Creates the relief provider's package and emails them an access code.
// Resolves to { applicationPackageId, householdMemberId }; throws an Error with a displayable message
// (for example when the person is already in the household or already invited).
export const useInviteReliefProvider = () => {
    const inviteProvider = useCallback(
        (values) =>
            sendJson(
                'POST',
                '/application-package/relief-provider',
                values,
                'We could not send the invitation. Please try again.',
            ),
        [],
    );
    return { inviteProvider };
};
