// Import React library (needed for JSX)
import React from 'react';

/**
 * TransactionItem component – displays a single transaction in a list.
 * Used in Dashboard (recent transactions) and TransactionsPage (full history).
 * 
 * Props:
 * - transaction: object containing transaction details (type, amount, description, date, balanceAfter)
 */
const TransactionItem = ({ transaction }) => {
  // Check if this transaction is a deposit (positive) or withdrawal (negative)
  const isDeposit = transaction.type === 'deposit';
  
  // Sign to display: '+' for deposits, '-' for withdrawals
  const sign = isDeposit ? '+' : '-';
  
  // Color coding: green for deposits, red for withdrawals
  const amountColor = isDeposit ? '#10b981' : '#ef4444';
  
  return (
    // Main container: flex row with space between, light bottom border
    <div style={{ 
      padding: '0.75rem 0', 
      borderBottom: '1px solid #edf2f7', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      {/* Left side: transaction description and formatted date */}
      <div>
        <div style={{ fontWeight: 500 }}>{transaction.description}</div>
        <small>{new Date(transaction.date).toLocaleString()}</small>
      </div>
      
      {/* Right side: amount with sign and balance after transaction */}
      <div style={{ 
        color: amountColor, 
        fontWeight: 'bold', 
        textAlign: 'right' 
      }}>
        {/* Example: "+$50.00" or "-$20.00" */}
        {sign}${transaction.amount.toFixed(2)}<br />
        <small>Balance: ${transaction.balanceAfter.toFixed(2)}</small>
      </div>
    </div>
  );
};

export default TransactionItem;