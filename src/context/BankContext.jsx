// Import necessary modules from React and the uuid library
import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create a Context object that will be used to provide state to all components
const BankContext = createContext();

// ==================== HELPER FUNCTIONS ====================

// Generates a random 8-digit account number (e.g., 12345678)
const generateAccountNumber = () => Math.floor(10000000 + Math.random() * 90000000).toString();

// Loads the list of all users from localStorage, or creates a demo user if none exists
const loadUsers = () => {
  const stored = localStorage.getItem('bankUsers');
  if (stored) return JSON.parse(stored); // Parse stored JSON string back to array

  // Demo user for first-time visitors (email: demo@bank.com, PIN: 1234)
  const demoUser = {
    id: uuidv4(),                     // unique identifier
    name: "John Demo",
    email: "demo@bank.com",
    accountNumber: "12345678",
    pin: "1234",
    balance: 5000,
    transactions: [{
      id: uuidv4(),
      type: "deposit",
      amount: 5000,
      description: "Initial deposit",
      date: new Date().toISOString(),
      balanceAfter: 5000,
    }],
    loans: []                         // no loans initially
  };
  return [demoUser];                  // return array with demo user
};

// Saves the users array back to localStorage (converts to JSON string)
const saveUsers = (users) => {
  localStorage.setItem('bankUsers', JSON.stringify(users));
};

// ==================== PROVIDER COMPONENT ====================

export const BankProvider = ({ children }) => {
  // State variables
  const [users, setUsers] = useState([]);          // all registered users
  const [currentUser, setCurrentUser] = useState(null); // logged-in user
  const [loading, setLoading] = useState(true);    // loading state before data is ready

  // ========== EFFECTS ==========

  // Runs once when the app mounts: loads users from localStorage and restores session
  useEffect(() => {
    const loadedUsers = loadUsers();               // fetch from localStorage
    setUsers(loadedUsers);
    const loggedInEmail = localStorage.getItem('currentUserEmail');
    if (loggedInEmail) {
      const user = loadedUsers.find(u => u.email === loggedInEmail);
      if (user) setCurrentUser(user);              // restore logged-in user
    }
    setLoading(false);                             // data loading complete
  }, []); // empty dependency array = runs only on mount

  // Every time the 'users' array changes, save it to localStorage
  useEffect(() => {
    if (users.length > 0) {
      saveUsers(users);
    }
  }, [users]); // runs whenever 'users' is updated

  // ========== HELPER: UPDATE A USER ==========
  // Updates a single user in the global users array.
  // If the updated user is the currently logged-in user, also update currentUser.
  const updateUser = (updatedUser) => {
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(newUsers);
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUserEmail', updatedUser.email);
    }
    return newUsers;
  };

  // ========== AUTHENTICATION FUNCTIONS ==========

  // Register a new user. Throws error if email already exists.
  // After creating the user, automatically logs them in.
  const register = (name, email, pin, initialDeposit = 100) => {
    if (users.some(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser = {
      id: uuidv4(),
      name,
      email,
      accountNumber: generateAccountNumber(),
      pin: pin.toString(),
      balance: initialDeposit,
      transactions: [{
        id: uuidv4(),
        type: "deposit",
        amount: initialDeposit,
        description: "Opening deposit",
        date: new Date().toISOString(),
        balanceAfter: initialDeposit,
      }],
      loans: []
    };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    saveUsers(newUsers);
    // Auto-login after registration
    setCurrentUser(newUser);
    localStorage.setItem('currentUserEmail', newUser.email);
    return newUser;
  };

  // Login an existing user. Throws error if credentials are invalid.
  const login = (email, pin) => {
    const user = users.find(u => u.email === email && u.pin === pin.toString());
    if (!user) throw new Error("Invalid email or PIN");
    setCurrentUser(user);
    localStorage.setItem('currentUserEmail', user.email);
    return user;
  };

  // Logout – only clears the session (removes currentUser), but user data remains in localStorage.
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserEmail');
  };

  // ========== TRANSACTION HELPER ==========
  // Core function for any financial transaction (deposit or withdraw).
  // Updates the user's balance and adds a transaction record.
  const makeTransaction = (user, amount, type, description, otherParty = null) => {
    if (type === 'withdraw' && user.balance < amount) {
      throw new Error("Insufficient balance");
    }
    const newBalance = type === 'deposit' ? user.balance + amount : user.balance - amount;
    const transaction = {
      id: uuidv4(),
      type,
      amount,
      description,
      date: new Date().toISOString(),
      balanceAfter: newBalance,
      otherParty: otherParty || null
    };
    const updatedUser = {
      ...user,
      balance: newBalance,
      transactions: [transaction, ...user.transactions] // newest first
    };
    updateUser(updatedUser);
    return updatedUser;
  };

  // ========== CORE BANKING FEATURES ==========

  // Send money to another user's account.
  // Validates PIN, balance, and recipient existence.
  const sendMoney = (recipientAccountNumber, amount, note, pin) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.pin !== pin.toString()) throw new Error("Invalid transaction PIN");
    if (amount <= 0) throw new Error("Amount must be positive");
    if (currentUser.balance < amount) throw new Error("Insufficient balance");

    const recipient = users.find(u => u.accountNumber === recipientAccountNumber);
    if (!recipient) throw new Error("Recipient account not found");
    if (recipient.id === currentUser.id) throw new Error("Cannot send money to yourself");

    // Withdraw from sender
    makeTransaction(currentUser, amount, 'withdraw', `Sent to ${recipient.name} (${recipient.accountNumber}) - ${note}`, recipient.accountNumber);
    // Deposit to recipient
    makeTransaction(recipient, amount, 'deposit', `Received from ${currentUser.name} (${currentUser.accountNumber}) - ${note}`, currentUser.accountNumber);
    return currentUser;
  };

  // Add money (simulated ATM deposit). Requires PIN for security.
  const addMoney = (amount, pin) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.pin !== pin.toString()) throw new Error("Invalid transaction PIN");
    if (amount <= 0) throw new Error("Amount must be positive");
    return makeTransaction(currentUser, amount, 'deposit', 'Cash deposit (ATM)');
  };

  // Apply for a loan (maximum $500,000). Interest is 5% flat.
  // Adds loan amount to balance immediately and records the loan details.
  const applyLoan = (amount, reason, tenureMonths) => {
    if (!currentUser) throw new Error("Not logged in");
    if (amount > 500000) throw new Error(`Loan amount exceeds limit. Maximum loan: $500,000`);
    if (amount <= 0) throw new Error("Invalid loan amount");

    const interestRate = 0.05;               // 5% flat interest
    const totalPayable = amount * (1 + interestRate);
    const monthlyPayment = totalPayable / tenureMonths;
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + tenureMonths);

    const loan = {
      id: uuidv4(),
      amount,
      reason: reason || "No reason provided",
      tenureMonths,
      interestRate,
      totalPayable,
      remainingAmount: totalPayable,
      monthlyPayment,
      dueDate: dueDate.toISOString(),
      status: "active",
      dateTaken: new Date().toISOString()
    };

    const updatedUser = {
      ...currentUser,
      balance: currentUser.balance + amount,
      loans: [loan, ...currentUser.loans],
      transactions: [{
        id: uuidv4(),
        type: "deposit",
        amount,
        description: `Loan disbursed - ${reason || "Personal loan"}`,
        date: new Date().toISOString(),
        balanceAfter: currentUser.balance + amount,
      }, ...currentUser.transactions]
    };
    updateUser(updatedUser);
    return updatedUser;
  };

  // Repay a loan (partial or full). Updates remaining amount and status.
  const repayLoan = (loanId, amount) => {
    if (!currentUser) throw new Error("Not logged in");
    if (amount <= 0) throw new Error("Repayment amount must be positive");

    const loanIndex = currentUser.loans.findIndex(l => l.id === loanId);
    if (loanIndex === -1) throw new Error("Loan not found");
    const loan = currentUser.loans[loanIndex];
    if (loan.status === "paid") throw new Error("Loan already paid");
    if (amount > currentUser.balance) throw new Error("Insufficient balance to repay");
    if (amount > loan.remainingAmount) throw new Error(`Cannot repay more than remaining amount: $${loan.remainingAmount}`);

    const newBalance = currentUser.balance - amount;
    const newRemaining = loan.remainingAmount - amount;
    const updatedLoans = [...currentUser.loans];
    updatedLoans[loanIndex] = {
      ...loan,
      remainingAmount: newRemaining,
      status: newRemaining <= 0 ? "paid" : "active"
    };

    const updatedUser = {
      ...currentUser,
      balance: newBalance,
      loans: updatedLoans,
      transactions: [{
        id: uuidv4(),
        type: "withdraw",
        amount,
        description: `Loan repayment for loan ${loanId.substring(0,6)}`,
        date: new Date().toISOString(),
        balanceAfter: newBalance,
      }, ...currentUser.transactions]
    };
    updateUser(updatedUser);
    return updatedUser;
  };

  // Permanently delete the currently logged-in user's account.
  // Removes user from users array, saves to localStorage, and logs out.
  const deleteAccount = () => {
    if (!currentUser) throw new Error("No user logged in");
    const newUsers = users.filter(u => u.id !== currentUser.id);
    setUsers(newUsers);
    saveUsers(newUsers);
    localStorage.removeItem('currentUserEmail');
    setCurrentUser(null);
    return true;
  };

  // Returns filtered transaction list based on type ('all', 'deposit', or 'withdraw').
  const getFilteredTransactions = (typeFilter = 'all') => {
    if (!currentUser) return [];
    if (typeFilter === 'all') return currentUser.transactions;
    return currentUser.transactions.filter(tx => tx.type === typeFilter);
  };

  // ========== CONTEXT VALUE ==========
  // All functions and state that will be available to child components.
  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    sendMoney,
    addMoney,
    applyLoan,
    repayLoan,
    deleteAccount,
    getFilteredTransactions,
  };

  // Provide the context to children components
  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};

// Custom hook for easy access to the banking context
export const useBank = () => useContext(BankContext);