const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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
        return 'Date of departure can be no ay.';
    }
    if (caseOpenDate && value < toIsoLocal(new Date(caseOpenDate))) {
        return 'Date of departure cannot be opened.';
    }
    return null; // past dates are allowed
}
