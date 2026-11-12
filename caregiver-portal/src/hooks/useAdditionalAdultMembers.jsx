import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/';

// household members added through Additional Adult packages:
// pending = screening in progress, submitted = sent to ICM
export const useAdditionalAdultMembers = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/application-package/additional-adult`, {
                    credentials: 'include',
                });
                if (!res.ok) return;
                const data = await res.json();
                if (!cancelled) setMembers(data);
            } catch {
                // supplementary: the pages still render without these
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return {
        members,
        pending: members.filter((m) => !m.submitted),
        submitted: members.filter((m) => m.submitted),
    };
};
