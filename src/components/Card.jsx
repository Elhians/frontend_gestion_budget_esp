import React from 'react';

const Card = ({ title, children, headerActions }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
        {headerActions && <div className="header-actions">{headerActions}</div>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;