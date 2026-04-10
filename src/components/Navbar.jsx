import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useBank } from '../context/BankContext';
import Modal from './Modal';

const Navbar = () => {
  const { currentUser, logout, deleteAccount } = useBank();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [avatarHover, setAvatarHover] = useState(false);
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

  // Styles
  const navbarStyle = {
    background: '#0a2540',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const brandStyle = {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'white',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  };

  const navLinksStyle = {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  };

  const getLinkStyle = (isActive, isHovered) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '2rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    background: isActive ? '#0066cc' : isHovered ? 'rgba(255,255,255,0.15)' : 'transparent',
    transform: isHovered ? 'translateY(-1px)' : 'none',
  });

  const avatarStyle = {
    width: '38px',
    height: '38px',
    background: avatarHover ? '#004999' : '#0066cc',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    transform: avatarHover ? 'scale(1.05)' : 'scale(1)',
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    minWidth: '220px',
    zIndex: 2000,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
  };

  const dropdownItemStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: '#1e293b',
    fontWeight: 500,
  };

  const deleteItemStyle = {
    ...dropdownItemStyle,
    color: '#dc2626',
  };

  return (
    <>
      <nav style={navbarStyle}>
        <NavLink to="/" style={brandStyle} end>
          Vault<span style={{ color: '#0066cc' }}>Ex</span>
        </NavLink>

        <div style={navLinksStyle}>
          {!currentUser ? (
            <>
              <NavLink
                to="/login"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'login')}
                onMouseEnter={() => setHoveredLink('login')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'register')}
                onMouseEnter={() => setHoveredLink('register')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'dashboard')}
                onMouseEnter={() => setHoveredLink('dashboard')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/send"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'send')}
                onMouseEnter={() => setHoveredLink('send')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Send
              </NavLink>
              <NavLink
                to="/loans"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'loans')}
                onMouseEnter={() => setHoveredLink('loans')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Loans
              </NavLink>
              <NavLink
                to="/transactions"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'history')}
                onMouseEnter={() => setHoveredLink('history')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                History
              </NavLink>
              <NavLink
                to="/add-money"
                style={({ isActive }) => getLinkStyle(isActive, hoveredLink === 'addmoney')}
                onMouseEnter={() => setHoveredLink('addmoney')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Add Money
              </NavLink>

              {/* Profile Avatar with Dropdown */}
              <div style={{ position: 'relative', marginLeft: '0.5rem' }} ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div style={avatarStyle}>{getInitials()}</div>
                </button>
                {dropdownOpen && (
                  <div style={dropdownMenuStyle}>
                    <div style={{ padding: '1rem', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '48px', height: '48px', background: '#0066cc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
                        {getInitials()}
                      </div>
                      <div>
                        <strong>{currentUser.name}</strong><br />
                        <small>{currentUser.email}</small>
                      </div>
                    </div>
                    <hr style={{ margin: 0, border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <button style={dropdownItemStyle} onClick={handleLogoutClick}>
                      Logout
                    </button>
                    <button style={deleteItemStyle} onClick={handleDeleteClick}>
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer' }}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '280px',
              height: '100%',
              background: '#0a2540',
              zIndex: 1100,
              padding: '2rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <button onClick={closeSidebar} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            {!currentUser ? (
              <>
                <NavLink to="/login" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Login</NavLink>
                <NavLink to="/register" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Register</NavLink>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: '#0066cc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>{getInitials()}</div>
                  <div><strong style={{ color: 'white' }}>{currentUser.name}</strong><br /><small style={{ color: '#94a3b8' }}>{currentUser.email}</small></div>
                </div>
                <hr />
                <NavLink to="/dashboard" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Dashboard</NavLink>
                <NavLink to="/send" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Send Money</NavLink>
                <NavLink to="/loans" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Loans</NavLink>
                <NavLink to="/transactions" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Transactions</NavLink>
                <NavLink to="/add-money" onClick={closeSidebar} style={{ color: 'white', textDecoration: 'none', padding: '0.75rem' }}>Add Money</NavLink>
                <button onClick={handleLogoutClick} style={{ background: 'none', border: 'none', color: 'white', textAlign: 'left', padding: '0.75rem', cursor: 'pointer' }}>Logout</button>
                <button onClick={handleDeleteClick} style={{ background: 'rgba(220,38,38,0.2)', border: 'none', color: '#fca5a5', textAlign: 'left', padding: '0.75rem', cursor: 'pointer', borderRadius: '0.5rem' }}>Delete Account</button>
              </>
            )}
          </div>
          <div onClick={closeSidebar} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1050 }} />
        </>
      )}

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        message="Are you sure you want to log out?"
        type="warning"
        onConfirm={confirmLogout}
      />
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





