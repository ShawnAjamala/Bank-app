import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import Modal from '../components/Modal';
import './RegisterPage.css';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [initialDeposit, setInitialDeposit] = useState(100);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const { register, login } = useBank();
  const navigate = useNavigate();

  const showModal = (title, message, type = 'info') => setModal({ isOpen: true, title, message, type });
  const closeModal = () => setModal({ ...modal, isOpen: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin !== confirmPin) return showModal('PIN Error', "PINs do not match", 'warning');
    if (pin.length !== 4 || !/^\d+$/.test(pin)) return showModal('PIN Error', "PIN must be exactly 4 digits", 'warning');
    if (initialDeposit < 10) return showModal('Deposit Error', "Minimum initial deposit is $10", 'warning');
    try {
      register(name, email, pin, initialDeposit);
      login(email, pin);
      navigate('/dashboard');
    } catch (err) {
      showModal('Registration Failed', err.message, 'danger');
    }
  };

  return (
    <div className="container">
      <div className="register-card">
        <h2>Open an Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="PIN (4 digits)" value={pin} onChange={(e) => setPin(e.target.value)} maxLength="4" required />
          <input type="password" placeholder="Confirm PIN" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength="4" required />
          <label>Initial Deposit ($):</label>
          <input type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(Number(e.target.value))} min="10" step="10" required />
          <button type="submit" className="btn">Register & Login</button>
        </form>
      </div>
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
};

export default RegisterPage;