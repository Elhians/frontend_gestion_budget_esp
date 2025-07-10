import React from 'react';

const StatusBadge = ({ status }) => {
  const statusClasses = {
    'Soumis': 'status-soumis',
    'Consolide': 'status-consolide',
    'Approuve': 'status-approuve',
    'Rejete par Direction': 'status-rejete',
    'Rejete par CDepartement': 'status-rejete',
    'active': 'status-active',
    'inactive': 'status-inactive'
  };

  const statusText = {
    'Soumis': 'Soumis',
    'Consolide': 'Consolide',
    'Approuve': 'Approuve',
    'Rejete par Direction': 'Rejete par Direction',
    'Rejete par CDepartement': 'Rejete par CDepartement',
    'active': 'Actif',
    'inactive': 'Inactif'
  };

  return (
    <span className={`status ${statusClasses[status]}`}>
      {statusText[status]}
    </span>
  );
};

export default StatusBadge;