import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BankProvider } from './context/BankContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SendMoneyPage from './pages/SendMoneyPage';
import LoansPage from './pages/LoansPage';
import TransactionsPage from './pages/TransactionsPage';
import AddMoneyPage from './pages/AddMoneyPage';

function App() {
  return (
    <Router>
      <BankProvider>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/send" element={<ProtectedRoute><SendMoneyPage /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="/add-money" element={<ProtectedRoute><AddMoneyPage /></ProtectedRoute>} />
          </Routes>
        </div>
        <Footer />
      </BankProvider>
    </Router>
  );
}

export default App;