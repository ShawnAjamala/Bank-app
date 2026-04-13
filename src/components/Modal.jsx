// Import React library (needed for JSX)
import React from 'react';
// Import component-specific CSS styles
import './Modal.css';

// Modal component – a reusable popup dialog for confirmations, alerts, and messages
// Props:
// - isOpen: boolean - controls whether the modal is visible
// - onClose: function - called when user clicks overlay or close button
// - title: string - modal header text
// - message: string - main content text
// - onConfirm: function (optional) - if provided, shows two buttons (Confirm/Cancel); otherwise shows single OK button
// - confirmText: string - text for confirm button (default 'Confirm')
// - cancelText: string - text for cancel button (default 'Cancel')
// - type: string - styling variant ('info', 'warning', 'danger', 'success') – affects header border and colors
const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  onConfirm, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  type = 'info' 
}) => {
  // If modal is not open, render nothing (return null)
  if (!isOpen) return null;

  return (
    // Overlay – semi-transparent background that covers the entire screen
    // Clicking the overlay closes the modal (calls onClose)
    <div className="modal-overlay" onClick={onClose}>
      {/* Modal container – the white popup card */}
      {/* stopPropagation prevents clicks inside the modal from closing it */}
      <div className={`modal-container modal-${type}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal header – contains title and close button */}
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        
        {/* Modal body – displays the message text */}
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        {/* Modal footer – action buttons */}
        <div className="modal-footer">
          {onConfirm ? (
            // If onConfirm is provided, show two buttons: Cancel and Confirm
            <>
              <button className="modal-btn modal-btn-cancel" onClick={onClose}>
                {cancelText}
              </button>
              <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
                {confirmText}
              </button>
            </>
          ) : (
            // If onConfirm is not provided, show a single OK button that closes the modal
            <button className="modal-btn modal-btn-ok" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;