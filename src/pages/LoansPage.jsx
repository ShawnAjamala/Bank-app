// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import custom hook to access banking context (currentUser, applyLoan, repayLoan)
import { useBank } from '../context/BankContext';
// Import reusable Modal component for showing popup messages
import Modal from '../components/Modal';
// Import component-specific CSS styles
import './LoansPage.css';
// Import PiggyBank icon from Lucide React for visual enhancement
import { PiggyBank } from 'lucide-react';

const LoansPage = () => {
  // Destructure banking functions and currentUser from context
  const { currentUser, applyLoan, repayLoan } = useBank();

  // State for the loan application form
  const [amount, setAmount] = useState('');           // loan amount entered by user
  const [reason, setReason] = useState('');           // optional reason for the loan
  const [tenure, setTenure] = useState(6);            // repayment tenure in months (default 6)

  // State for controlling modal popups (success/error messages)
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

  // State for storing repayment amounts for each active loan (key = loanId, value = amount)
  const [repayAmount, setRepayAmount] = useState({});

  // Helper function to open the modal with a specific title, message, and type (success, warning, danger)
  const showModal = (title, message, type = 'info') => 
    setModal({ isOpen: true, title, message, type });

  // Helper function to close the modal
  const closeModal = () => setModal({ ...modal, isOpen: false });

  // Handle loan application form submission
  const handleApplyLoan = (e) => {
    e.preventDefault();                           // prevent page reload
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return showModal('Invalid Amount', 'Please enter a positive loan amount.', 'warning');
    if (amt > 500000) return showModal('Limit Exceeded', 'Maximum loan amount is $500,000.', 'warning');
    try {
      applyLoan(amt, reason, tenure);             // call context function to add loan and increase balance
      showModal('Loan Approved', `$${amt} has been added to your balance. Interest rate: 5% flat.`, 'success');
      // Clear the form after successful application
      setAmount('');
      setReason('');
      setTenure(6);
    } catch (err) {
      showModal('Loan Denied', err.message, 'danger');
    }
  };

  // Handle repayment for a specific loan
  const handleRepay = (loanId) => {
    const amt = parseFloat(repayAmount[loanId]);
    if (isNaN(amt) || amt <= 0) return showModal('Invalid Repayment', 'Enter a valid positive amount.', 'warning');
    try {
      repayLoan(loanId, amt);                     // call context function to reduce loan balance
      showModal('Repayment Success', `$${amt} repaid successfully.`, 'success');
      // Clear the repayment input field for this loan
      setRepayAmount({ ...repayAmount, [loanId]: '' });
    } catch (err) {
      showModal('Repayment Failed', err.message, 'danger');
    }
  };

  // Filter loans into active and paid categories (safe with optional chaining and fallback empty array)
  const activeLoans = currentUser?.loans.filter(l => l.status === 'active') || [];
  const paidLoans = currentUser?.loans.filter(l => l.status === 'paid') || [];

  // Calculate the repayment progress percentage for an active loan
  const getProgress = (loan) => {
    const total = loan.totalPayable;      // total amount to repay (principal + interest)
    const remaining = loan.remainingAmount;
    return ((total - remaining) / total) * 100;
  };

  return (
    <div className="loans-container">
      {/* Loan application form card */}
      <div className="loan-apply-card">
        <h2>Apply for a Loan</h2>
        <p className="loan-limit">
          <PiggyBank />  Loan limit: up to $500,000 | Interest: 5% flat
        </p>
        <form onSubmit={handleApplyLoan}>
          <div className="form-group">
            <label>Loan Amount ($)</label>
            <input 
              type="number" 
              placeholder="e.g., 25000" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Reason (optional)</label>
            <input 
              type="text" 
              placeholder="Home improvement, business, etc." 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Tenure (months)</label>
            <select value={tenure} onChange={(e) => setTenure(Number(e.target.value))}>
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
            </select>
          </div>
          <button type="submit" className="apply-loan-btn">Apply Now</button>
        </form>
      </div>

      {/* Display active loans if any exist */}
      {activeLoans.length > 0 && (
        <div className="loans-section">
          <h3>Active Loans</h3>
          <div className="loans-grid">
            {activeLoans.map(loan => {
              // Calculate days left until due date (negative if overdue)
              const daysLeft = Math.ceil((new Date(loan.dueDate) - new Date()) / (1000*60*60*24));
              const progress = getProgress(loan);     // repayment percentage
              const isOverdue = daysLeft < 0;         // true if past due date
              return (
                <div key={loan.id} className="loan-card active">
                  <div className="loan-card-header">
                    <div className="loan-amount">${loan.amount.toFixed(2)}</div>
                    <div className={`loan-status-badge ${isOverdue ? 'overdue' : 'active'}`}>
                      {isOverdue ? 'OVERDUE' : 'ACTIVE'}
                    </div>
                  </div>
                  <div className="loan-card-body">
                    <div className="loan-reason">{loan.reason}</div>
                    <div className="loan-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Interest Rate</span>
                        <span className="detail-value">5% flat</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Total Payable</span>
                        <span className="detail-value">${loan.totalPayable.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Remaining</span>
                        <span className="detail-value highlight">${loan.remainingAmount.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Monthly Payment</span>
                        <span className="detail-value">${loan.monthlyPayment.toFixed(2)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Due Date</span>
                        <span className={`detail-value ${isOverdue ? 'overdue-text' : ''}`}>
                          {new Date(loan.dueDate).toLocaleDateString()}
                          {!isOverdue && ` (${daysLeft} days left)`}
                        </span>
                      </div>
                    </div>
                    <div className="progress-section">
                      <div className="progress-label">Repayment Progress</div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <div className="progress-percent">{progress.toFixed(1)}% paid</div>
                    </div>
                  </div>
                  <div className="loan-card-footer">
                    <input 
                      type="number" 
                      placeholder="Repayment amount" 
                      value={repayAmount[loan.id] || ''} 
                      onChange={(e) => setRepayAmount({...repayAmount, [loan.id]: e.target.value})} 
                    />
                    <button className="repay-btn" onClick={() => handleRepay(loan.id)}>Make Payment</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Display paid loans if any exist */}
      {paidLoans.length > 0 && (
        <div className="loans-section">
          <h3>Paid Loans</h3>
          <div className="loans-grid">
            {paidLoans.map(loan => (
              <div key={loan.id} className="loan-card paid">
                <div className="loan-card-header">
                  <div className="loan-amount">${loan.amount.toFixed(2)}</div>
                  <div className="loan-status-badge paid">PAID</div>
                </div>
                <div className="loan-card-body">
                  <div className="loan-reason">{loan.reason}</div>
                  <div className="loan-details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Total Paid</span>
                      <span className="detail-value">${loan.totalPayable.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Paid on</span>
                      <span className="detail-value">{new Date(loan.dateTaken).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render the modal component for displaying messages */}
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

export default LoansPage;