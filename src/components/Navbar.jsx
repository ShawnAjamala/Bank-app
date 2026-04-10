import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import Modal from './Modal';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout, deleteAccount } = useBank();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setDropdownOpen(false);
  };
  const confirmLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setDropdownOpen(false);
  };
  const confirmDelete = () => {
    deleteAccount();
    navigate('/register');
    setShowDeleteModal(false);
  };

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
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand" end>
          Vault<span>Ex</span>
        </NavLink>

        <div className="nav-links-desktop">
          {!currentUser ? (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Register
              </NavLink>
            </>
          ) : (
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

              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="avatar-btn" onClick={toggleDropdown}>
                  <div className="avatar">{getInitials()}</div>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-user-info">
                      <div className="avatar-large">{getInitials()}</div>
                      <div>
                        <strong>{currentUser.name}</strong>
                        <small>{currentUser.email}</small>
                      </div>
                    </div>
                    <hr />
                    <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                      Logout
                    </button>
                    <button className="dropdown-item delete-item" onClick={handleDeleteClick}>
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button className="hamburger" onClick={toggleSidebar}>☰</button>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={closeSidebar}>✕</button>
        {!currentUser ? (
          <>
            <NavLink to="/login" onClick={closeSidebar}>Login</NavLink>
            <NavLink to="/register" onClick={closeSidebar}>Register</NavLink>
          </>
        ) : (
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
      <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Logout" message="Are you sure you want to log out?" type="warning" onConfirm={confirmLogout} />
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Permanently Delete Account" message="This action cannot be undone. All your data will be lost forever." type="danger" onConfirm={confirmDelete} confirmText="Yes, Delete" />
    </>
  );
};

export default Navbar;