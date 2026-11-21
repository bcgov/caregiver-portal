import { useCallback, useMemo, useState } from 'react';

// Values, touched state and errors for a form. `getErrors(values)` returns { field: message | null }
// and must be stable (wrap it in useCallback if it reads props), because errors are recomputed when it changes.
export function useValidatedForm(initialValues, getErrors) {
    const [values, setValues] = useState(initialValues);
    const [touched, setTouched] = useState({});

    const errors = useMemo(() => getErrors(values), [getErrors, values]);
    const isValid = Object.values(errors).every((e) => !e);

    // handlers to hand to inputs: onChange={form.set('email')} onBlur={form.touch('email')}
    const set = useCallback(
        (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value })),
        [],
    );
    const touch = useCallback(
        (field) => () => setTouched((t) => ({ ...t, [field]: true })),
        [],
    );

    // mark every field touched, so all their errors show (used when submit is attempted)
    const touchAll = useCallback(
        () => setTouched(Object.fromEntries(Object.keys(errors).map((f) => [f, true]))),
        [errors],
    );

    // the message to show for a field, once it has been touched
    const showError = (field) => (touched[field] && errors[field]) || null;

    return { values, errors, isValid, set, touch, touchAll, showError };
}

