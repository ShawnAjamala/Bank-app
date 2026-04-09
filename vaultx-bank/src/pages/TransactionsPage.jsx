import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const { getFilteredTransactions } = useBank();
  const [filter, setFilter] = useState('all');
  const transactions = getFilteredTransactions(filter);

  return (
    <div className="container">
      <div className="card">
        <h2>Transaction History</h2>
        <div className="transactions-filters">
          {['all','deposit','withdraw'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'deposit' ? 'Deposits' : 'Withdrawals'}
            </button>
          ))}
        </div>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className="transaction-card">
              <div>
                <div className="transaction-type">{tx.type}</div>
                <small>{new Date(tx.date).toLocaleString()}</small>
                <div>{tx.description}</div>
              </div>
              <div className={`transaction-amount ${tx.type}`}>
                {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                <br /><small>Balance: ${tx.balanceAfter.toFixed(2)}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;