import React from 'react';

const Modal = ({ id, title, children, onClose }) => {
  return (
    <div id={id} className="modal" style={{ display: 'none' }}>
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>{title}</h2>
          <span style={{ cursor: 'pointer', fontSize: '24px' }} onClick={onClose}>&times;</span>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;