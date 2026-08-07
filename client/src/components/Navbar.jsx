import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Helper to determine if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 9999;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E7EB;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-decoration: none;
        }

        .nav-logo .brand-strong {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .nav-logo .brand-light {
          font-size: 12px;
          font-weight: 500;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.2;
        }

        /* Center Navigation */
        .nav-center {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .nav-link {
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          padding: 24px 0;
          transition: color 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: #2563EB;
        }

        .nav-link.active {
          color: #2563EB;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #2563EB;
          border-radius: 2px 2px 0 0;
        }

        /* Right Section */
        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-login {
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          background: transparent;
          border: none;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: color 0.2s ease;
        }

        .nav-login:hover {
          color: #2563EB;
        }

        .nav-get-started {
          font-size: 15px;
          font-weight: 500;
          color: #FFFFFF;
          background: #2563EB;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .nav-get-started:hover {
          background: #1D4ED8;
        }

        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #374151;
          cursor: pointer;
          padding: 8px;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          display: none;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E7EB;
          padding: 16px 24px;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-drawer .nav-link {
          padding: 8px 0;
        }
        
        .mobile-drawer .nav-link.active::after {
          display: none; /* No bottom border in mobile */
        }
        
        .mobile-drawer .nav-link.active {
          color: #2563EB;
          font-weight: 600;
        }

        .mobile-drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid #E5E7EB;
        }
        
        .mobile-drawer-actions .nav-login {
          padding-left: 0;
        }

        .mobile-drawer-actions .nav-get-started {
          text-align: center;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .nav-center, .nav-right {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .mobile-drawer.open {
            display: flex;
          }
        }
      `}</style>

      <nav className="navbar-wrapper">
        <div className="nav-container">
          
          {/* Left: Logo */}
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="brand-strong">SHNOOR INTERNATIONAL</span>
            <span className="brand-light">ASSESSMENT PLATFORM</span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="nav-center">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#assessments" className="nav-link">Assessments</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          {/* Right: Actions */}
          <div className="nav-right">
            <Link to="/login" className="nav-login">Login</Link>
            <Link to="/register" className="nav-get-started">Get Started</Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#assessments" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Assessments</a>
          <a href="#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          
          <div className="mobile-drawer-actions">
            <Link to="/login" className="nav-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-get-started" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
