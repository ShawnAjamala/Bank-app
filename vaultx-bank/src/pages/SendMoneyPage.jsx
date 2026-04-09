import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import Modal from '../components/Modal';
import './SendMoneyPage.css';

const SendMoneyPage = () => {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pin, setPin] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const { sendMoney, currentUser } = useBank();
  const navigate = useNavigate();

  const showModal = (title, message, type = 'info') => setModal({ isOpen: true, title, message, type });
  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const amt = parseFloat(amount);
      if (isNaN(amt)) throw new Error("Invalid amount");
      await sendMoney(recipientAccount, amt, note, pin);
      showModal('Success', 'Money sent successfully!', 'success');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      showModal('Transfer Failed', err.message, 'danger');
    }
  };

  return (
    <div className="container">
      <div className="send-card">
        <h2>Send Money</h2>
        <p>Your Balance: <strong>${currentUser?.balance.toFixed(2)}</strong></p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Recipient Account Number (8 digits)" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} required />
          <input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01" step="0.01" required />
          <textarea placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} rows="2" />
          <input type="password" placeholder="Transaction PIN" value={pin} onChange={(e) => setPin(e.target.value)} maxLength="4" required />
          <button type="submit" className="btn">Send Money</button>
        </form>
      </div>
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
};

export default SendMoneyPage;