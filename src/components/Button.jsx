import React from 'react';

const Button = ({ type = 'primary', children, onClick, className = '' }) => {
  const buttonClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    warning: 'btn-warning',
    admin: 'btn-admin'
  };

  return (
    <button 
      className={`btn ${buttonClasses[type]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;