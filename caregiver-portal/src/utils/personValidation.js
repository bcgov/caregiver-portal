import { EMAIL_REGEX, MAX_EMAIL_LENGTH } from '../constants/household';
import { validateAdultDob } from './caseWindow';

export const validateEmail = (value) => {
    const email = (value ?? '').trim();
    if (!email) return 'Email is required.';
    if (email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
        return 'Please enter a valid email address.';
    }
    return null;
};

// Errors for the fields every invited adult has. `subject` names them in messages ("provider", ...).
export function validatePerson(values, { subject = 'household member' } = {}) {
    return {
        firstName: values.firstName.trim() ? null : 'First name is required.',
        lastName: values.lastName.trim() ? null : 'Last name is required.',
        dateOfBirth: validateAdultDob(values.dateOfBirth, new Date(), subject),
        genderType: values.genderType ? null : 'Select a gender.',
        email: validateEmail(values.email),
    };
}

