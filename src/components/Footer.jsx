
import React from 'react';
import { 
  Home, 
  Send, 
  FileText, 
  PlusCircle, 
  HelpCircle, 
  Shield, 
  Mail, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  Phone,
  MapPin
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Vault<span>Ex</span></h3>
          <p>Secure digital banking for the modern world. Your finances, simplified.</p>
          <div className="footer-contact">
            <p><Phone size={14} /> +1 (800) 123-4567</p>
            <p><Mail size={14} /> support@vaultex.com</p>
            <p><MapPin size={14} /> 123 Finance St, New York, NY 10001</p>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/dashboard"><Home size={14} /> Dashboard</a></li>
            <li><a href="/send"><Send size={14} /> Send Money</a></li>
            <li><a href="/loans"><FileText size={14} /> Loans</a></li>
            <li><a href="/add-money"><PlusCircle size={14} /> Add Money</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#"><HelpCircle size={14} /> Help Center</a></li>
            <li><a href="#"><Shield size={14} /> Security</a></li>
            <li><a href="#"><Mail size={14} /> Contact Us</a></li>
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
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
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