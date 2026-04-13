// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import the custom hook to access banking context (addMoney function and currentUser)
import { useBank } from '../context/BankContext';
// Import the reusable Modal component for showing popup messages
import Modal from '../components/Modal';
// Import component-specific CSS styles
import './AddMoneyPage.css';

const AddMoneyPage = () => {
  // State to store the amount the user wants to add
  const [amount, setAmount] = useState('');
  // State to store the 4-digit transaction PIN entered by the user
  const [pin, setPin] = useState('');
  // State to control the modal dialog (open/close, title, message, type)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  
  // Destructure addMoney function and currentUser from the banking context
  const { addMoney, currentUser } = useBank();

  // Helper function to open the modal with a specific title, message, and type (success, danger, etc.)
  const showModal = (title, message, type = 'info') => 
    setModal({ isOpen: true, title, message, type });
  
  // Helper function to close the modal
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // Handle form submission when user clicks "Add Money"
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      // Convert the amount string to a number
      const amt = parseFloat(amount);
      // Validate amount: must be a positive number
      if (isNaN(amt) || amt <= 0) throw new Error("Please enter a valid positive amount");
      
      // Call the addMoney function from context (this will validate PIN and update balance)
      addMoney(amt, pin);
      
      // If successful, show a success modal
      showModal('Success', `$${amt} added to your account!`, 'success');
      // Clear the form fields for the next deposit
      setAmount('');
      setPin('');
    } catch (err) {
      // If any error occurs (e.g., wrong PIN), show an error modal with the error message
      showModal('Error', err.message, 'danger');
    }
  };

  return (
    // Main container for centering the card
    <div className="add-money-container">
      {/* White card that contains the deposit form */}
      <div className="add-money-card">
        {/* Header section with title and description */}
        <div className="add-money-header">
          <h2>Add Money</h2>
          <p>Cash deposit / ATM load</p>
        </div>
        
        {/* Display the current balance of the logged-in user */}
        <div className="balance-display">
          <p>Current Balance</p>
          {/* Use optional chaining (?.) and toFixed(2) to safely show two decimal places */}
          <strong>${currentUser?.balance.toFixed(2)}</strong>
        </div>
        
        {/* Form for entering deposit amount and PIN */}
        <form onSubmit={handleSubmit}>
          {/* Amount input group */}
          <div className="input-group">
            <label>Amount to Add ($)</label>
            <input 
              type="number" 
              placeholder="Enter amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              min="1" 
              step="1" 
              required 
            />
          </div>
          
          {/* PIN input group */}
          <div className="input-group">
            <label>Transaction PIN</label>
            <input 
              type="password" 
              placeholder="Enter your 4-digit PIN" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              maxLength="4" 
              required 
            />
          </div>
          
          {/* Submit button */}
          <button type="submit" className="add-money-btn">Add Money</button>
        </form>
      </div>
      
      {/* Render the Modal component, controlled by modal state */}
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

export default AddMoneyPage;