// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import navigation hook and Link component for routing
import { useNavigate, Link } from 'react-router-dom';
// Import custom hook to access banking context (register function)
import { useBank } from '../context/BankContext';
// Import reusable Modal component for showing error/success messages
import Modal from '../components/Modal';
// Import component-specific CSS styles
import './RegisterPage.css';

const RegisterPage = () => {
  // State for registration form fields
  const [name, setName] = useState('');               // user's full name
  const [email, setEmail] = useState('');             // email address (used as username)
  const [pin, setPin] = useState('');                 // 4-digit transaction PIN
  const [confirmPin, setConfirmPin] = useState('');   // confirm PIN for validation
  const [initialDeposit, setInitialDeposit] = useState(100); // opening deposit amount

  // State to control modal popups (error/warning messages)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // Get the register function from banking context
  const { register } = useBank();
  // Hook to navigate after successful registration
  const navigate = useNavigate();

  // Helper to open modal with a specific title, message, and style type
  const showModal = (title, message, type = 'info') => 
    setModal({ isOpen: true, title, message, type });

  // Helper to close modal
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // Handle form submission when user clicks "Create Account & Login"
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload

    // Validation checks
    if (pin !== confirmPin) 
      return showModal('PIN Error', "PINs do not match", 'warning');

    if (pin.length !== 4 || !/^\d+$/.test(pin)) 
      return showModal('PIN Error', "PIN must be exactly 4 digits", 'warning');

    if (initialDeposit < 10) 
      return showModal('Deposit Error', "Minimum initial deposit is $10", 'warning');

    try {
      // Attempt to register the new user (this also auto-logs in)
      register(name, email, pin, initialDeposit);
      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Show error modal if registration fails (e.g., email already exists)
      showModal('Registration Failed', err.message, 'danger');
    }
  };

  return (
    <div className="register-container">
      {/* White card containing the registration form */}
      <div className="register-card">
        {/* Header section with title and description */}
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join VaultEx today</p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name input */}
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          {/* Email input */}
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* PIN input (max 4 characters) */}
          <div className="input-group">
            <label>Transaction PIN (4 digits)</label>
            <input 
              type="password" 
              placeholder="****" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              maxLength="4" 
              required 
            />
          </div>

          {/* Confirm PIN input */}
          <div className="input-group">
            <label>Confirm PIN</label>
            <input 
              type="password" 
              placeholder="****" 
              value={confirmPin} 
              onChange={(e) => setConfirmPin(e.target.value)} 
              maxLength="4" 
              required 
            />
          </div>

          {/* Initial deposit amount (number input, min $10) */}
          <div className="input-group">
            <label>Initial Deposit ($)</label>
            <input 
              type="number" 
              value={initialDeposit} 
              onChange={(e) => setInitialDeposit(Number(e.target.value))} 
              min="10" 
              step="10" 
              required 
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="register-btn">Create Account & Login</button>
        </form>

        {/* Link to login page for existing users */}
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      {/* Modal component for displaying validation errors or success messages */}
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

export default RegisterPage;