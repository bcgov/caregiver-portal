import { useCallback, useEffect, useState } from 'react';
import { getJson } from '../utils/api';

// The caregiver's relief providers, with each one's progress:
// status is 'invited' | 'redeemed' | 'in_progress' | 'submitted', canEdit is true until they sign in.
export const useReliefProviders = ({ enabled = true } = {}) => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        if (!enabled) return;
        try {
            setProviders(
                await getJson(
                    '/application-package/relief-provider',
                    'We could not load your relief providers. Please try again later.',
                ),
            );
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [enabled]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { providers, loading, error, refresh };
};
