import React from "react";
import "./styles/Footer.css";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h3>JuliD's Fashion World</h3>
          <p>70 Fasanmi St, Ikosi Ketu, Lagos, Nigeria</p>
          <p className="footer-tagline">
            Step out in confidence. Step out in style.
          </p>
        </div>

        <div>
          <h4>Shop Categories</h4>
          <ul>
            <li><Link to="/shop?category=corporate">Corporate Wears</Link></li>
            <li><Link to="/shop?category=asoebi">Asoebi & Bespoke</Link></li>
            <li><Link to="/shop?category=kiddies">Kiddies Collection</Link></li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li><Link to="/shop">Ready-Made</Link></li>
            <li><Link to="/custom-order-form">Custom Design</Link></li>
          </ul>
        </div>

        <div>
          <h4>Connect With Us</h4>
          <ul className="social-links">
            <li><a href="https://wa.me/2349166702141" target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/julidsfashion" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://www.facebook.com/share/15aCpPc2PR/" target="_blank" rel="noreferrer">Facebook</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 JuliD’s Fashion World. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

