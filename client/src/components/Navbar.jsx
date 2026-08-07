import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

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
          background: var(--navbar-bg, #FFFFFF);
          border-bottom: 1px solid var(--border-color, #E5E7EB);
          font-family: 'Inter', system-ui, sans-serif;
          transition: background-color 0.3s ease, border-color 0.3s ease;
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
          color: var(--text-primary, #111827);
          letter-spacing: 0.5px;
          line-height: 1.2;
          transition: color 0.3s ease;
        }

        .nav-logo .brand-light {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary, #6B7280);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.2;
          transition: color 0.3s ease;
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
          color: var(--text-color, #374151);
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

        /* Theme Toggle */
        .theme-toggle-btn {
          background: transparent;
          border: 1px solid var(--border-color, #E5E7EB);
          color: var(--text-color, #374151);
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .theme-toggle-btn:hover {
          background: var(--hover-bg, #F3F4F6);
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
          color: var(--text-color, #374151);
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
          color: var(--text-color, #374151);
          cursor: pointer;
          padding: 8px;
          transition: color 0.3s ease;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          display: none;
          background: var(--navbar-bg, #FFFFFF);
          border-bottom: 1px solid var(--border-color, #E5E7EB);
          padding: 16px 24px;
          flex-direction: column;
          gap: 16px;
          transition: background-color 0.3s ease, border-color 0.3s ease;
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
          border-top: 1px solid var(--border-color, #E5E7EB);
          transition: border-color 0.3s ease;
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
            <span className="brand-light">CRM PLATFORM</span>
          </Link>

          {/* Center: Navigation Links */}
          <div className="nav-center">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>

          {/* Right: Actions */}
          <div className="nav-right">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
          <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          
          <div className="mobile-drawer-actions">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme" style={{ margin: '0 auto 12px' }}>
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="nav-login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link to="/register" className="nav-get-started" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
