import React from 'react';
import PropTypes from 'prop-types';
import "./Button.css"

const Button = ({ variant = 'primary', children, ...props }) => {
    return (
      <button
        className={`btn btn-${variant}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'nav', 'disabled', 'section-header']),
  children: PropTypes.node.isRequired,
};

export default Button;