import React from 'react';
import FormField from './FormField';

const RadioGroupField = ({ form, name, legend, options, required = true }) => (
    <>
        <div className="radio-button-group">
            <div className="radio-button-header">
                {legend}{required && <span className="required">*</span>}
            </div>
            {options.map((o) => (
                <label key={o.value}>
                    <input
                        type="radio"
                        name={name}
                        value={o.value}
                        checked={form.values[name] === o.value}
                        onChange={(e) => {
                            form.set(name)(e);
                            form.touch(name)();
                        }}
                    />
                    {o.label}
                </label>
            ))}
        </div>
        <FormField id={name} error={form.showError(name)} />
    </>
);

export default RadioGroupField;
