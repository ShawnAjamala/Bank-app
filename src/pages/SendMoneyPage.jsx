// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import navigation hook for redirecting after successful transfer
import { useNavigate } from 'react-router-dom';
// Import custom hook to access banking context (sendMoney, currentUser)
import { useBank } from '../context/BankContext';
// Import reusable Modal component for showing success/error messages
import Modal from '../components/Modal';
// Import component-specific CSS styles
import './SendMoneyPage.css';

const SendMoneyPage = () => {
  // State for the recipient's 8-digit account number
  const [recipientAccount, setRecipientAccount] = useState('');
  // State for the amount to send
  const [amount, setAmount] = useState('');
  // State for an optional note/memo attached to the transaction
  const [note, setNote] = useState('');
  // State for the user's 4-digit transaction PIN (required for security)
  const [pin, setPin] = useState('');
  // State to control modal popups (success/error messages)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // Destructure sendMoney function and currentUser from the banking context
  const { sendMoney, currentUser } = useBank();
  // Hook to navigate programmatically (back to dashboard after success)
  const navigate = useNavigate();

  // Helper function to open the modal with a specific title, message, and style type
  const showModal = (title, message, type = 'info') => 
    setModal({ isOpen: true, title, message, type });

  // Helper function to close the modal
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // Handle form submission when user clicks "Send Money"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      // Convert amount string to a number
      const amt = parseFloat(amount);
      if (isNaN(amt)) throw new Error("Invalid amount");

      // Call the sendMoney function from context (validates PIN, balance, recipient)
      await sendMoney(recipientAccount, amt, note, pin);

      // Show success modal
      showModal('Success', 'Money sent successfully!', 'success');
      // Redirect to dashboard after a short delay to let user read the modal
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      // Show error modal with the specific error message (e.g., wrong PIN, insufficient funds)
      showModal('Transfer Failed', err.message, 'danger');
    }
  };

  return (
    <div className="container">
      {/* White card containing the send money form */}
      <div className="send-card">
        <h2>Send Money</h2>
        {/* Display current balance (safe optional chaining, formatted to 2 decimals) */}
        <p>Your Balance: <strong>${currentUser?.balance.toFixed(2)}</strong></p>

        {/* Form for entering transfer details */}
        <form onSubmit={handleSubmit}>
          {/* Recipient account number (8 digits) */}
          <input 
            type="text" 
            placeholder="Recipient Account Number (8 digits)" 
            value={recipientAccount} 
            onChange={(e) => setRecipientAccount(e.target.value)} 
            required 
          />

          {/* Amount to send (positive number, step 0.01 for cents) */}
          <input 
            type="number" 
            placeholder="Amount ($)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            min="0.01" 
            step="0.01" 
            required 
          />

          {/* Optional note / memo for the transaction */}
          <textarea 
            placeholder="Note (optional)" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            rows="2" 
          />

          {/* Transaction PIN (4-digit, hidden) */}
          <input 
            type="password" 
            placeholder="Transaction PIN" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            maxLength="4" 
            required 
          />

          {/* Submit button */}
          <button type="submit" className="btn">Send Money</button>
        </form>
      </div>

      {/* Modal component for displaying success or error messages */}
      <Modal 
        isOpen={modal.isOpen} 
        onClose={closeModal} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
      />
    </div>
  );
};

export default SendMoneyPage;