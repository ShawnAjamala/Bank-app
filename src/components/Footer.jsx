import React from 'react';
import './Footer.css';
import { Phone } from 'lucide-react';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Vault<span>Ex</span></h3>
          <p>Secure digital banking for the modern world. Your finances, simplified.</p>
          <div className="footer-contact">
            <p> Contact :+1 (800) 123-4567</p>
            <p> Email :support@vaultex.com</p>
            <p> Address :123 Finance St, New York, NY 10001</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/send">Send Money</a></li>
            <li><a href="/loans">Loans</a></li>
            <li><a href="/add-money">Add Money</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Security</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
        
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
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Vault Ex. All rights reserved. | Banking reimagined</p>
      </div>
    </footer>
  );
};

export default Footer;