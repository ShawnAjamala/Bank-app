// import React, { useState } from 'react';
// import { useBank } from '../context/BankContext';
// import Modal from '../components/Modal';
// import './LoansPage.css';

// const LoansPage = () => {
//   const { currentUser, applyLoan, repayLoan } = useBank();
//   const [amount, setAmount] = useState('');
//   const [reason, setReason] = useState('');
//   const [tenure, setTenure] = useState(6);
//   const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });
//   const [repayAmount, setRepayAmount] = useState({});

//   const showModal = (title, message, type = 'info') => setModal({ isOpen: true, title, message, type });
//   const closeModal = () => setModal({ ...modal, isOpen: false });

//   const handleApplyLoan = (e) => {
//     e.preventDefault();
//     const amt = parseFloat(amount);
//     if (isNaN(amt) || amt <= 0) return showModal('Invalid Amount', 'Please enter a positive loan amount.', 'warning');
//     if (amt > 500000) return showModal('Limit Exceeded', 'Maximum loan amount is $500,000.', 'warning');
//     try {
//       applyLoan(amt, reason, tenure);
//       showModal('Loan Approved', `$${amt} has been added to your balance. Interest rate: 5% flat.`, 'success');
//       setAmount('');
//       setReason('');
//       setTenure(6);
//     } catch (err) {
//       showModal('Loan Denied', err.message, 'danger');
//     }
//   };

//   const handleRepay = (loanId) => {
//     const amt = parseFloat(repayAmount[loanId]);
//     if (isNaN(amt) || amt <= 0) return showModal('Invalid Repayment', 'Enter a valid positive amount.', 'warning');
//     try {
//       repayLoan(loanId, amt);
//       showModal('Repayment Success', `$${amt} repaid successfully.`, 'success');
//       setRepayAmount({ ...repayAmount, [loanId]: '' });
//     } catch (err) {
//       showModal('Repayment Failed', err.message, 'danger');
//     }
//   };

//   const activeLoans = currentUser?.loans.filter(l => l.status === 'active') || [];
//   const paidLoans = currentUser?.loans.filter(l => l.status === 'paid') || [];

//   // Calculate progress percentage for each active loan
//   const getProgress = (loan) => {
//     const total = loan.totalPayable;
//     const remaining = loan.remainingAmount;
//     return ((total - remaining) / total) * 100;
//   };

//   return (
//     <div className="loans-container">
//       <div className="loan-apply-card">
//         <h2>Apply for a Loan</h2>
//         <p className="loan-limit">💰 Loan limit: up to $500,000 | Interest: 5% flat</p>
//         <form onSubmit={handleApplyLoan}>
//           <div className="form-group">
//             <label>Loan Amount ($)</label>
//             <input type="number" placeholder="e.g., 25000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
//           </div>
//           <div className="form-group">
//             <label>Reason (optional)</label>
//             <input type="text" placeholder="Home improvement, business, etc." value={reason} onChange={(e) => setReason(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Tenure (months)</label>
//             <select value={tenure} onChange={(e) => setTenure(Number(e.target.value))}>
//               <option value={3}>3 months</option>
//               <option value={6}>6 months</option>
//               <option value={12}>12 months</option>
//               <option value={24}>24 months</option>
//             </select>
//           </div>
//           <button type="submit" className="apply-loan-btn">Apply Now</button>
//         </form>
//       </div>

//       {activeLoans.length > 0 && (
//         <div className="loans-section">
//           <h3>Active Loans</h3>
//           <div className="loans-grid">
//             {activeLoans.map(loan => {
//               const daysLeft = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000*60*60*24));
//               const progress = getProgress(loan);
//               const isOverdue = daysLeft < 0;
//               return (
//                 <div key={loan.id} className="loan-card active">
//                   <div className="loan-card-header">
//                     <div className="loan-amount">${loan.amount.toFixed(2)}</div>
//                     <div className={`loan-status-badge ${isOverdue ? 'overdue' : 'active'}`}>
//                       {isOverdue ? 'OVERDUE' : 'ACTIVE'}
//                     </div>
//                   </div>
//                   <div className="loan-card-body">
//                     <div className="loan-reason">{loan.reason}</div>
//                     <div className="loan-details-grid">
//                       <div className="detail-item">
//                         <span className="detail-label">Interest Rate</span>
//                         <span className="detail-value">5% flat</span>
//                       </div>
//                       <div className="detail-item">
//                         <span className="detail-label">Total Payable</span>
//                         <span className="detail-value">${loan.totalPayable.toFixed(2)}</span>
//                       </div>
//                       <div className="detail-item">
//                         <span className="detail-label">Remaining</span>
//                         <span className="detail-value highlight">${loan.remainingAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="detail-item">
//                         <span className="detail-label">Monthly Payment</span>
//                         <span className="detail-value">${loan.monthlyPayment.toFixed(2)}</span>
//                       </div>
//                       <div className="detail-item">
//                         <span className="detail-label">Due Date</span>
//                         <span className={`detail-value ${isOverdue ? 'overdue-text' : ''}`}>
//                           {new Date(loan.dueDate).toLocaleDateString()}
//                           {!isOverdue && ` (${daysLeft} days left)`}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="progress-section">
//                       <div className="progress-label">Repayment Progress</div>
//                       <div className="progress-bar-bg">
//                         <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
//                       </div>
//                       <div className="progress-percent">{progress.toFixed(1)}% paid</div>
//                     </div>
//                   </div>
//                   <div className="loan-card-footer">
//                     <input 
//                       type="number" 
//                       placeholder="Repayment amount" 
//                       value={repayAmount[loan.id] || ''} 
//                       onChange={(e) => setRepayAmount({...repayAmount, [loan.id]: e.target.value})} 
//                     />
//                     <button className="repay-btn" onClick={() => handleRepay(loan.id)}>Make Payment</button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {paidLoans.length > 0 && (
//         <div className="loans-section">
//           <h3>Paid Loans</h3>
//           <div className="loans-grid">
//             {paidLoans.map(loan => (
//               <div key={loan.id} className="loan-card paid">
//                 <div className="loan-card-header">
//                   <div className="loan-amount">${loan.amount.toFixed(2)}</div>
//                   <div className="loan-status-badge paid">PAID</div>
//                 </div>
//                 <div className="loan-card-body">
//                   <div className="loan-reason">{loan.reason}</div>
//                   <div className="loan-details-grid">
//                     <div className="detail-item">
//                       <span className="detail-label">Total Paid</span>
//                       <span className="detail-value">${loan.totalPayable.toFixed(2)}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="detail-label">Paid on</span>
//                       <span className="detail-value">{new Date(loan.dateTaken).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />
//     </div>
//   );
// };

// export default LoansPage;