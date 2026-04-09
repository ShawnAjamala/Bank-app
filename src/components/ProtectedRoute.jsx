import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useBank();
  if (loading) return <div className="container">Loading your account...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;