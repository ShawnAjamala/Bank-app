// Import React library (needed for JSX)
import React from 'react';
// Import Navigate component from React Router for redirecting unauthenticated users
import { Navigate } from 'react-router-dom';
// Import custom hook to access banking context (currentUser, loading state)
import { useBank } from '../context/BankContext';

/**
 * ProtectedRoute is a wrapper component that prevents unauthenticated users
 * from accessing protected pages (like Dashboard, Send Money, Loans, etc.).
 * If the user is not logged in, they are redirected to the login page.
 * While authentication status is loading, a loading message is shown.
 */
const ProtectedRoute = ({ children }) => {
  // Get the current authenticated user and loading state from context
  const { currentUser, loading } = useBank();

  // If authentication data is still loading, show a temporary loading message
  if (loading) return <div className="container">Loading your account...</div>;

  // If no user is logged in (currentUser is null), redirect to the login page
  // 'replace' replaces the current entry in history (so user can't go back to the protected page)
  if (!currentUser) return <Navigate to="/login" replace />;

  // If user is authenticated, render the child components (the actual page content)
  return children;
};

export default ProtectedRoute;