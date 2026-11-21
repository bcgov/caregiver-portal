import React from 'react';
import FormField from './FormField';

const TextField = ({ form, name, label, type = 'text', maxLength, required = true, id = name }) => (
    <FormField id={id} label={label} required={required} error={form.showError(name)}>
        <input
            id={id}
            type={type}
            className="form-control"
            value={form.values[name]}
            onChange={form.set(name)}
            onBlur={form.touch(name)}
            maxLength={maxLength}
            aria-invalid={!!form.showError(name)}
            aria-describedby={`${id}-error`}
        />
    </FormField>
);

export default TextField;
