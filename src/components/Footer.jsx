// Import React library (needed for JSX)
import React from 'react';
// Import component-specific CSS styles
import './Footer.css';
// Import Phone icon from Lucide React (though not used in this version, kept for potential future use)
import { Phone } from 'lucide-react';

const Footer = () => {
  return (
    // Main footer element with class for styling
    <footer className="footer">
      {/* Container that holds all footer content and centers it */}
      <div className="footer-container">
        
        {/* Brand section – company name, tagline, and contact info */}
        <div className="footer-brand">
          <h3>Vault<span>Ex</span></h3>
          <p>Secure digital banking for the modern world. Your finances, simplified.</p>
          <div className="footer-contact">
            <p> Contact :+1 (800) 123-4567</p>
            <p> Email :support@vaultex.com</p>
            <p> Address :123 Finance St, New York, NY 10001</p>
          </div>
        </div>
        
        {/* Quick Links section – navigation to main app pages */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/send">Send Money</a></li>
            <li><a href="/loans">Loans</a></li>
            <li><a href="/add-money">Add Money</a></li>
          </ul>
        </div>
        
        {/* Support section – help and contact links */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        
        {/* Legal section – policies and terms */}
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
        
        {/* Social Media section – links to external platforms */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
      
      {/* Bottom bar – copyright and dynamic year */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Vault Ex. All rights reserved. | Banking reimagined</p>
      </div>
    </footer>
  );
};

export default Footer;