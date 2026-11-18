import React from 'react';
import DateField from '../Date';
import FormField from './FormField';

// 18+ date of birth
const DateOfBirthField = ({ form, name = 'dateOfBirth', label = 'Date of Birth' }) => (
    <FormField id={name} label={label} error={form.showError(name)}>
        <DateField
            id={name}
            variant="adult18"
            value={form.values[name]}
            onChange={form.set(name)}
            onBlur={form.touch(name)}
            aria-describedby={`${name}-error`}
        />
    </FormField>
);

export default DateOfBirthField;
