const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
import { MIN_ADULT_AGE } from '../constants/household';

// YYYY-MM-DD in local time, same as the server's toLocaleDateString('en-CA')
export const toIsoLocal = (d) => d.toLocaleDateString('en-CA');

export const twoYearsFromToday = (today = new Date()) => {
    const max = new Date(today);
    max.setFullYear(max.getFullYear() + 2);
    return toIsoLocal(max);
};

// returns an error message, or null when the date is acceptable
export function validateDepartureDate(value, caseOpenDate, today = new Date()) {
    if (!value) return 'Date of departure is required.';

    const parsed = new Date(`${value}T00:00:00`);
    if (!ISO_DATE.test(value) || Number.isNaN(parsed.getTime()) || toIsoLocal(parsed) !== value) {
        return 'Enter a valid date.';
    }
    if (value > twoYearsFromToday(today)) {
        return 'Date of departure can be no more than 2 years from today.';
    }
    if (caseOpenDate && value < toIsoLocal(new Date(caseOpenDate))) {
        return 'Date of departure cannot be before the case was opened.';
    }
    return null; // past dates are allowed
}

const isRealIsoDate = (value) => {
    const parsed = new Date(`${value}T00:00:00`);
    return ISO_DATE.test(value) && !Number.isNaN(parsed.getTime()) && toIsoLocal(parsed) === value;
};

export const yearsAgo = (years, today = new Date()) => {
    const d = new Date(today);
    d.setFullYear(d.getFullYear() - years);
    return toIsoLocal(d);
};

export function validateAdultDob(value, today = new Date()) {
    if (!value) return 'Date of birth is required.';
    if (!isRealIsoDate(value)) return 'Enter a valid date.';
    if (value > yearsAgo(MIN_ADULT_AGE, today)) {
        return `The household member must be at least ${MIN_ADULT_AGE} years old.`;
    }
    return null;
}

export function validateMoveInDate(value, caseOpenDate, today = new Date()) {
    if (!value) return 'Move-in date is required.';
    if (!isRealIsoDate(value)) return 'Enter a valid date.';
    if (value > twoYearsFromToday(today)) {
        return 'Move-in date can be no more than 2 years from today.';
    }
    if (caseOpenDate && value < toIsoLocal(new Date(caseOpenDate))) {
        return 'Move-in date cannot be before the case was opened.';
    }
    return null;
}

