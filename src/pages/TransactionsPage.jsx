// Import React and useState hook for managing filter state
import React, { useState } from "react";
// Import custom hook to access banking context (getFilteredTransactions)
import { useBank } from "../context/BankContext";
// Import component-specific CSS styles
import "./TransactionsPage.css";

const TransactionsPage = () => {
  // Get the function that returns filtered transactions from the banking context
  const { getFilteredTransactions } = useBank();

  // State to track the current transaction filter ('all', 'deposit', or 'withdraw')
  const [filter, setFilter] = useState("all");

  // Get the filtered transactions based on the selected filter
  // This will re-run whenever the filter changes
  const transactions = getFilteredTransactions(filter);

  return (
    <div className="container">
      <div className="card">
        <h2>Transaction History</h2>

        {/* Filter buttons row */}
        <div className="transactions-filters">
          {["all", "deposit", "withdraw"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {/* Display friendly label for each filter option */}
              {f === "all"
                ? "All"
                : f === "deposit"
                  ? "Deposits"
                  : "Withdrawals"}
            </button>
          ))}
        </div>

        {/* Conditional rendering: show message if no transactions, otherwise list them */}
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          // Map through each transaction and display it in a card
          transactions.map((tx) => (
            <div key={tx.id} className="transaction-card">
              {/* Left side: transaction details */}
              <div>
                {/* Transaction type (deposit or withdraw) */}
                <div className="transaction-type">{tx.type}</div>
                {/* Formatted date and time */}
                <small>{new Date(tx.date).toLocaleString()}</small>
                {/* Description (e.g., "Sent to John", "Cash deposit") */}
                <div>{tx.description}</div>
              </div>

              {/* Right side: amount and balance after transaction */}
              <div className={`transaction-amount ${tx.type}`}>
                {/* Show '+' for deposits, '-' for withdrawals */}
                {tx.type === "deposit" ? "+" : "-"}${tx.amount.toFixed(2)}
                <br />
                {/* Balance after this transaction */}
                <small>Balance: ${tx.balanceAfter.toFixed(2)}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;