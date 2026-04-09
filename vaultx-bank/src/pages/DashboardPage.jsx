// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useBank } from '../context/BankContext';
// import TransactionItem from '../components/TransactionItem';
// import './DashboardPage.css';

// const DashboardPage = () => {
//   const { currentUser } = useBank();
//   const navigate = useNavigate();

//   if (!currentUser) return <div className="container">Loading...</div>;

//   // Loan notifications (due within 7 days or overdue)
//   const getLoanNotifications = () => {
//     const activeLoans = currentUser.loans.filter(l => l.status === 'active');
//     const today = new Date();
//     return activeLoans
//       .map(loan => {
//         const dueDate = new Date(loan.dueDate);
//         const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
//         if (daysLeft < 0)
//           return { type: 'warning', message: `⚠️ Loan $${loan.amount} is OVERDUE! Please repay.` };
//         if (daysLeft <= 7)
//           return { type: 'warning', message: `🔔 Loan $${loan.amount} due in ${daysLeft} day(s).` };
//         if (daysLeft <= 14)
//           return {
//             type: 'info',
//             message: `📅 Loan $${loan.amount} due on ${dueDate.toLocaleDateString()}.`,
//           };
//         return null;
//       })
//       .filter(Boolean);
//   };

//   const notifications = getLoanNotifications();
//   const lastFiveTransactions = currentUser.transactions.slice(0, 5);

//   const totalSent = currentUser.transactions
//     .filter(tx => tx.type === 'withdraw' && !tx.description.includes('Loan repayment'))
//     .reduce((sum, tx) => sum + tx.amount, 0);

//   const totalReceived = currentUser.transactions
//     .filter(
//       tx =>
//         tx.type === 'deposit' &&
//         !tx.description.includes('Loan disbursed') &&
//         !tx.description.includes('Initial') &&
//         !tx.description.includes('Cash deposit')
//     )
//     .reduce((sum, tx) => sum + tx.amount, 0);

//   const activeLoansCount = currentUser.loans.filter(l => l.status === 'active').length;

//   return (
//     <div className="dashboard-container">
//       {/* Hero Section */}
//       <div className="hero-section">
//         <div className="hero-content">
//           <h1>Welcome back, {currentUser.name} 👋</h1>
//           <p>Account: {currentUser.accountNumber}</p>
//         </div>
//         <button className="hero-send-btn" onClick={() => navigate('/send')}>
//           Send Money →
//         </button>
//       </div>

//       {/* Loan Notifications */}
//       {notifications.length > 0 && (
//         <div className="notifications-card">
//           <h3>📢 Loan Reminders</h3>
//           {notifications.map((notif, idx) => (
//             <div key={idx} className={`notification ${notif.type}`}>
//               <span>{notif.message}</span>
//               <button className="repay-link" onClick={() => navigate('/loans')}>
//                 Repay Now
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Stats Grid */}
//       <div className="stats-grid">
//         <div className="stat-card balance-card">
//           <div className="stat-icon">💰</div>
//           <div className="stat-info">
//             <h3>Total Balance</h3>
//             <p className="stat-value">${currentUser.balance.toFixed(2)}</p>
//           </div>
//         </div>
//         <div className="stat-card sent-card">
//           <div className="stat-icon">📤</div>
//           <div className="stat-info">
//             <h3>Total Sent</h3>
//             <p className="stat-value">${totalSent.toFixed(2)}</p>
//           </div>
//         </div>
//         <div className="stat-card received-card">
//           <div className="stat-icon">📥</div>
//           <div className="stat-info">
//             <h3>Total Received</h3>
//             <p className="stat-value">${totalReceived.toFixed(2)}</p>
//           </div>
//         </div>
//         <div className="stat-card loans-card">
//           <div className="stat-icon">🏦</div>
//           <div className="stat-info">
//             <h3>Active Loans</h3>
//             <p className="stat-value">{activeLoansCount}</p>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="quick-actions">
//         <h2>Quick Actions</h2>
//         <div className="action-grid">
//           <button className="action send-action" onClick={() => navigate('/send')}>
//             <span className="action-icon">💸</span>
//             <span>Send Money</span>
//           </button>
//           <button className="action add-action" onClick={() => navigate('/add-money')}>
//             <span className="action-icon">➕</span>
//             <span>Add Money</span>
//           </button>
//           <button className="action loan-action" onClick={() => navigate('/loans')}>
//             <span className="action-icon">🏦</span>
//             <span>Apply Loan</span>
//           </button>
//           <button className="action history-action" onClick={() => navigate('/transactions')}>
//             <span className="action-icon">📜</span>
//             <span>Transaction History</span>
//           </button>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="recent-transactions">
//         <div className="section-header">
//           <h2>Recent Transactions</h2>
//           <button className="view-all-btn" onClick={() => navigate('/transactions')}>
//             View All →
//           </button>
//         </div>
//         <div className="transactions-list">
//           {lastFiveTransactions.length === 0 ? (
//             <p className="empty-state">No transactions yet. Start sending or adding money.</p>
//           ) : (
//             lastFiveTransactions.map(tx => <TransactionItem key={tx.id} transaction={tx} />)
//           )}
//         </div>
//       </div>

//       {/* Loan CTA */}
//       <div className="loan-cta">
//         <div className="cta-content">
//           <h3>Need a loan?</h3>
//           <p>Get instant approval up to $500,000 with low 5% interest.</p>
//         </div>
//         <button className="cta-button" onClick={() => navigate('/loans')}>
//           Apply Now →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;