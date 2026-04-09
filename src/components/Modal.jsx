import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', type = 'info' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container modal-${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {onConfirm ? (
            <>
              <button className="modal-btn modal-btn-cancel" onClick={onClose}>{cancelText}</button>
              <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>{confirmText}</button>
            </>
          ) : (
            <button className="modal-btn modal-btn-ok" onClick={onClose}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;