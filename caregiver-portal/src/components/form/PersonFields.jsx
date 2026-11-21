import React from 'react';
import { GENDERS, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from '../../constants/household';
import DateOfBirthField from './DateOfBirthField';
import RadioGroupField from './RadioGroupField';
import TextField from './TextField';

// The details of an adult being invited. Pair it with validatePerson().
const PersonFields = ({ form, genderLegend = 'Please indicate their gender:' }) => (
    <>
        <TextField form={form} name="firstName" label="First Name" maxLength={MAX_NAME_LENGTH} />
        <TextField form={form} name="lastName" label="Last Name" maxLength={MAX_NAME_LENGTH} />
        <DateOfBirthField form={form} />
        <RadioGroupField form={form} name="genderType" legend={genderLegend} options={GENDERS} />
        <TextField form={form} name="email" label="Email" type="email" maxLength={MAX_EMAIL_LENGTH} />
    </>
);

export default PersonFields;
