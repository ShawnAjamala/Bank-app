import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const { register } = useBank();
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
      navigate('/dashboard');
    } catch (err) {
      showModal('Registration Failed', err.message, 'danger');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join VaultEx today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Transaction PIN (4 digits)</label>
            <input type="password" placeholder="****" value={pin} onChange={(e) => setPin(e.target.value)} maxLength="4" required />
          </div>
          <div className="input-group">
            <label>Confirm PIN</label>
            <input type="password" placeholder="****" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} maxLength="4" required />
          </div>
          <div className="input-group">
            <label>Initial Deposit ($)</label>
            <input type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(Number(e.target.value))} min="10" step="10" required />
          </div>
          <button type="submit" className="register-btn">Create Account & Login</button>
        </form>
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
      <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />
    </div>
  );
};

export default RegisterPage;