import React from 'react';

// A label, a control and its error message, as siblings so they lay out inside .field-group.

const FormField = ({ id, label, required = true, error, children }) => (
    <>
        {label && (
            <label htmlFor={id} className="form-control-label">
                {label}{required && <span className="required">*</span>}
            </label>
        )}
        {children}
        <span id={`${id}-error`} className="error-message" role="alert">
            {error}
        </span>
    </>
);

export default FormField;
