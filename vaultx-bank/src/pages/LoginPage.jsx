// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useBank } from '../context/BankContext';
// import Modal from '../components/Modal';
// import './LoginPage.css';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [pin, setPin] = useState('');
//   const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
//   const { login } = useBank();
//   const navigate = useNavigate();

//   const showModal = (title, message, type = 'info') => setModal({ isOpen: true, title, message, type });
//   const closeModal = () => setModal({ ...modal, isOpen: false });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     try {
//       login(email, pin);
//       navigate('/dashboard');
//     } catch (err) {
//       showModal('Login Failed', err.message, 'danger');
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <h2>Welcome Back</h2>
//           <p>Sign in to your VaultEx account</p>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label>Email Address</label>
//             <input 
//               type="email" 
//               placeholder="you@example.com" 
//               value={email} 
//               onChange={(e) => setEmail(e.target.value)} 
//               required 
//             />
//           </div>
//           <div className="input-group">
//             <label>Transaction PIN</label>
//             <input 
//               type="password" 
//               placeholder="Enter 4-digit PIN" 
//               value={pin} 
//               onChange={(e) => setPin(e.target.value)} 
//               maxLength="4" 
//               required 
//             />
//           </div>
//           <button type="submit" className="login-btn">Sign In</button>
//         </form>
//         <div className="register-link">
//           <p>Don't have an account? <Link to="/register">Create Account</Link></p>
//         </div>
//         <div className="demo-note">
//           <p>Demo: demo@bank.com / PIN: 1234</p>
//         </div>
//       </div>
//       <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />
//     </div>
//   );
// };

// export default LoginPage;