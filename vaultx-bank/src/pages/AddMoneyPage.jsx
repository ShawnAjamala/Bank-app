import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import Modal from '../components/Modal';
import './AddMoneyPage.css';

const AddMoneyPage = () => {
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const { addMoney, currentUser } = useBank();

  const showModal = (title, message, type = 'info') => setModal({ isOpen: true, title, message, type });
  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Verify PIN
      if (!pin || pin.toString() !== currentUser?.pin) {
        throw new Error("Invalid transaction PIN");
      }
      const amt = parseFloat(amount);
      if (isNaN(amt) || amt <= 0) throw new Error("Please enter a valid positive amount");
      addMoney(amt);
      showModal('Success', `$${amt} added to your account!`, 'success');
      setAmount('');
      setPin('');
    } catch (err) {
      showModal('Error', err.message, 'danger');
    }
  };

  return (
    <div className="add-money-container">
      <div className="add-money-card">
        <div className="add-money-header">
          <h2>Add Money</h2>
          <p>Cash deposit / ATM load</p>
        </div>
        <div className="balance-display">
          <p>Current Balance</p>
          <strong>${currentUser?.balance.toFixed(2)}</strong>
        </div>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="add-money-btn">Add Money</button>
        </form>
      </div>
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
};

export default AddMoneyPage;