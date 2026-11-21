import React from 'react';
import FormField from './FormField';

// options: strings, or { value, label }
const SelectField = ({ form, name, label, options, placeholder, required = true, id = name }) => (
    <FormField id={id} label={label} required={required} error={form.showError(name)}>
        <select
            id={id}
            value={form.values[name]}
            onChange={form.set(name)}
            onBlur={form.touch(name)}
            aria-invalid={!!form.showError(name)}
            aria-describedby={`${id}-error`}
        >
            <option value="">{placeholder ?? `Select ${label.toLowerCase()}`}</option>
            {options.map((o) => {
                const { value, label: text } = typeof o === 'string' ? { value: o, label: o } : o;
                return <option key={value} value={value}>{text}</option>;
            })}
        </select>
    </FormField>
);

export default SelectField;
