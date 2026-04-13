// Import React and useState hook for managing component state
import React, { useState } from 'react';
// Import navigation hook and Link component for routing
import { useNavigate, Link } from 'react-router-dom';
// Import custom hook to access banking context (login function)
import { useBank } from '../context/BankContext';
// Import reusable Modal component for showing error messages
import Modal from '../components/Modal';
// Import component-specific CSS styles
import './LoginPage.css';

const LoginPage = () => {
  // State for email input field
  const [email, setEmail] = useState('');
  // State for PIN input field (4-digit transaction PIN)
  const [pin, setPin] = useState('');
  // State to control modal dialog (open/close, title, message, type)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  
  // Get the login function from banking context
  const { login } = useBank();
  // Hook to navigate programmatically after successful login
  const navigate = useNavigate();

  // Helper function to open the modal with a specific title, message, and style type
  const showModal = (title, message, type = 'info') => 
    setModal({ isOpen: true, title, message, type });
  
  // Helper function to close the modal
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // Handle form submission when user clicks "Sign In"
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      login(email, pin);             // Attempt to authenticate with context
      navigate('/dashboard');        // Redirect to dashboard on success
    } catch (err) {
      // If login fails (wrong email or PIN), show error modal
      showModal('Login Failed', err.message, 'danger');
    }
  };

  return (
    <div className="login-container">
      {/* White card containing the login form */}
      <div className="login-card">
        {/* Header section with welcome message */}
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your VaultEx account</p>
        </div>
        
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Email input group */}
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
          
          {/* PIN input group (max 4 characters) */}
          <div className="input-group">
            <label>Transaction PIN</label>
            <input 
              type="password" 
              placeholder="Enter 4-digit PIN" 
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              maxLength="4" 
              required 
            />
          </div>
          
          {/* Submit button */}
          <button type="submit" className="login-btn">Sign In</button>
        </form>
        
        {/* Link to registration page for new users */}
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Create Account</Link></p>
        </div>
        
        {/* Demo credentials hint for testing */}
        <div className="demo-note">
          <p>Demo: demo@bank.com / PIN: 1234</p>
        </div>
      </div>
      
      {/* Render modal for displaying error messages */}
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

export default LoginPage;