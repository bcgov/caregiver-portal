import React from 'react';

const Declaration = ({ 
  checked, 
  onChange, 
  disabled = false,
  children
}) => {
  return (
    <div className="declaration">
      <input 
        className="declaration-checkbox" 
        type="checkbox"
        checked={checked} 
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <p className="declaration-text">{children}</p>
    </div>
  );
};

export default Declaration;

