// Import React and necessary hooks for state, refs, and side effects
import React, { useState, useRef, useEffect } from 'react';
// Import NavLink for active link styling and useNavigate for programmatic navigation
import { NavLink, useNavigate } from 'react-router-dom';
// Import custom hook to access banking context (currentUser, logout, deleteAccount)
import { useBank } from '../context/BankContext';
// Import reusable Modal component for confirmation dialogs
import Modal from './Modal';
// Import component-specific CSS styles
import './Navbar.css';

const Navbar = () => {
  // Destructure authentication and account management functions from context
  const { currentUser, logout, deleteAccount } = useBank();
  const navigate = useNavigate();

  // State for mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State for profile dropdown (avatar click) visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State for logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // State for delete account confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Ref to detect clicks outside the profile dropdown (to close it automatically)
  const dropdownRef = useRef(null);

  // Effect to close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle mobile sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // Close mobile sidebar
  const closeSidebar = () => setSidebarOpen(false);
  // Toggle profile dropdown
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Show logout confirmation modal and close dropdown
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setDropdownOpen(false);
  };
  // Confirm logout – call logout from context, redirect to login, close modal
  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  // Show delete account confirmation modal and close dropdown
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDropdownOpen(false);
  };
  // Confirm delete – call deleteAccount from context, redirect to register, close modal
  const confirmDelete = () => {
    deleteAccount();
    navigate('/register');
    setShowDeleteModal(false);
  };

  // Helper to get user initials from name (e.g., "John Doe" -> "JD")
  const getInitials = () => {
    if (!currentUser) return '?';
    return currentUser.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Main navigation bar */}
      <nav className="navbar">
        {/* Brand / logo link to home */}
        <NavLink to="/" className="navbar-brand" end>
          Vault<span>Ex</span>
        </NavLink>

        {/* Desktop navigation links – visible on larger screens */}
        <div className="nav-links-desktop">
          {!currentUser ? (
            // Not logged in: show Login and Register links
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Register
              </NavLink>
            </>
          ) : (
            // Logged in: show main app links and profile dropdown
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </NavLink>
              <NavLink to="/send" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Send
              </NavLink>
              <NavLink to="/loans" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Loans
              </NavLink>
              <NavLink to="/transactions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                History
              </NavLink>
              <NavLink to="/add-money" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Add Money
              </NavLink>

              {/* Profile dropdown with avatar */}
              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="avatar-btn" onClick={toggleDropdown}>
                  <div className="avatar">{getInitials()}</div>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {/* User info section */}
                    <div className="dropdown-user-info">
                      <div className="avatar-large">{getInitials()}</div>
                      <div>
                        <strong>{currentUser.name}</strong>
                        <small>{currentUser.email}</small>
                      </div>
                    </div>
                    <hr />
                    {/* Logout button */}
                    <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                      Logout
                    </button>
                    {/* Delete account button (danger style) */}
                    <button className="dropdown-item delete-item" onClick={handleDeleteClick}>
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Hamburger menu button for mobile – toggles sidebar */}
        <button className="hamburger" onClick={toggleSidebar}>☰</button>
      </nav>

      {/* Mobile sidebar – slides in from the right when open */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={closeSidebar}>✕</button>
        {!currentUser ? (
          // Not logged in: show login/register links in sidebar
          <>
            <NavLink to="/login" onClick={closeSidebar}>Login</NavLink>
            <NavLink to="/register" onClick={closeSidebar}>Register</NavLink>
          </>
        ) : (
          // Logged in: show user info and navigation links, plus logout/delete buttons
          <>
            <div className="sidebar-user">
              <div className="avatar-large">{getInitials()}</div>
              <div className="user-info">
                <strong>{currentUser.name}</strong>
                <small>{currentUser.email}</small>
              </div>
            </div>
            <hr />
            <NavLink to="/dashboard" onClick={closeSidebar}>Dashboard</NavLink>
            <NavLink to="/send" onClick={closeSidebar}>Send Money</NavLink>
            <NavLink to="/loans" onClick={closeSidebar}>Loans</NavLink>
            <NavLink to="/transactions" onClick={closeSidebar}>Transactions</NavLink>
            <NavLink to="/add-money" onClick={closeSidebar}>Add Money</NavLink>
            <button onClick={handleLogoutClick}>Logout</button>
            <button className="danger" onClick={handleDeleteClick}>Delete Account</button>
          </>
        )}
      </div>
      {/* Overlay that appears behind the sidebar to dim the page */}
      <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      {/* Logout confirmation modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        message="Are you sure you want to log out?"
        type="warning"
        onConfirm={confirmLogout}
      />
      {/* Delete account confirmation modal (danger type) */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Permanently Delete Account"
        message="This action cannot be undone. All your data will be lost forever."
        type="danger"
        onConfirm={confirmDelete}
        confirmText="Yes, Delete"
      />
    </>
  );
};

export default Navbar;