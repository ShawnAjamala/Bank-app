import React from 'react';

const TransactionItem = ({ transaction }) => {
  const isDeposit = transaction.type === 'deposit';
  const sign = isDeposit ? '+' : '-';
  const amountColor = isDeposit ? '#10b981' : '#ef4444';
  return (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 500 }}>{transaction.description}</div>
        <small>{new Date(transaction.date).toLocaleString()}</small>
      </div>
      <div style={{ color: amountColor, fontWeight: 'bold', textAlign: 'right' }}>
        {sign}${transaction.amount.toFixed(2)}<br />
        <small>Balance: ${transaction.balanceAfter.toFixed(2)}</small>
      </div>
    </div>
  );
};

export default TransactionItem;