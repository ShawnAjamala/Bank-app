import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BankContext = createContext();

// Helper functions
const generateAccountNumber = () => Math.floor(10000000 + Math.random() * 90000000).toString();

// Load users from localStorage (always fresh)
const loadUsers = () => {
  const stored = localStorage.getItem('bankUsers');
  if (stored) return JSON.parse(stored);
  // Create demo user only once
  const demoUser = {
    id: uuidv4(),
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
    loans: []
  };
  return [demoUser];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem('bankUsers', JSON.stringify(users));
};

export const BankProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadedUsers = loadUsers();
    setUsers(loadedUsers);
    const loggedInEmail = localStorage.getItem('currentUserEmail');
    if (loggedInEmail) {
      const user = loadedUsers.find(u => u.email === loggedInEmail);
      if (user) setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Save users whenever they change
  useEffect(() => {
    if (users.length > 0) {
      saveUsers(users);
    }
  }, [users]);

  // Helper: update a user in the array and optionally update currentUser
  const updateUser = (updatedUser) => {
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(newUsers);
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUserEmail', updatedUser.email);
    }
    return newUsers;
  };

  // Register new user (auto-login)
  const register = (name, email, pin, initialDeposit = 100) => {
    // Check for duplicate email
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
    // Auto-login
    setCurrentUser(newUser);
    localStorage.setItem('currentUserEmail', newUser.email);
    return newUser;
  };

  // Login user
  const login = (email, pin) => {
    const user = users.find(u => u.email === email && u.pin === pin.toString());
    if (!user) throw new Error("Invalid email or PIN");
    setCurrentUser(user);
    localStorage.setItem('currentUserEmail', user.email);
    return user;
  };

  // Logout (only clears session, not data)
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserEmail');
  };

  // Generic transaction handler
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
      transactions: [transaction, ...user.transactions]
    };
    updateUser(updatedUser);
    return updatedUser;
  };

  // Send money
  const sendMoney = (recipientAccountNumber, amount, note, pin) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.pin !== pin.toString()) throw new Error("Invalid transaction PIN");
    if (amount <= 0) throw new Error("Amount must be positive");
    if (currentUser.balance < amount) throw new Error("Insufficient balance");

    const recipient = users.find(u => u.accountNumber === recipientAccountNumber);
    if (!recipient) throw new Error("Recipient account not found");
    if (recipient.id === currentUser.id) throw new Error("Cannot send money to yourself");

    makeTransaction(currentUser, amount, 'withdraw', `Sent to ${recipient.name} (${recipient.accountNumber}) - ${note}`, recipient.accountNumber);
    makeTransaction(recipient, amount, 'deposit', `Received from ${currentUser.name} (${currentUser.accountNumber}) - ${note}`, currentUser.accountNumber);
    return currentUser;
  };

  // Add money (requires PIN)
  const addMoney = (amount, pin) => {
    if (!currentUser) throw new Error("Not logged in");
    if (currentUser.pin !== pin.toString()) throw new Error("Invalid transaction PIN");
    if (amount <= 0) throw new Error("Amount must be positive");
    return makeTransaction(currentUser, amount, 'deposit', 'Cash deposit (ATM)');
  };

  // Apply for a loan
  const applyLoan = (amount, reason, tenureMonths) => {
    if (!currentUser) throw new Error("Not logged in");
    if (amount > 500000) throw new Error(`Loan amount exceeds limit. Maximum loan: $500,000`);
    if (amount <= 0) throw new Error("Invalid loan amount");

    const interestRate = 0.05;
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

  // Repay loan
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

  // Delete account – permanently remove from localStorage
  const deleteAccount = () => {
    if (!currentUser) throw new Error("No user logged in");
    const newUsers = users.filter(u => u.id !== currentUser.id);
    setUsers(newUsers);
    saveUsers(newUsers);
    localStorage.removeItem('currentUserEmail');
    setCurrentUser(null);
    return true;
  };

  // Filter transactions
  const getFilteredTransactions = (typeFilter = 'all') => {
    if (!currentUser) return [];
    if (typeFilter === 'all') return currentUser.transactions;
    return currentUser.transactions.filter(tx => tx.type === typeFilter);
  };

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

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
};

export const useBank = () => useContext(BankContext);