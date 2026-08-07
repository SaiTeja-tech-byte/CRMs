import React from "react";
import { ArrowRight, Users, Clock, DollarSign, Receipt, CheckSquare, FileText, HelpCircle, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        .hero {
          position: relative;
          background: var(--section-bg);
          padding: 100px 0 120px;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          overflow: hidden;
          transition: background-color 0.3s ease;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 48% 52%;
          gap: 48px;
          align-items: center;
          width: 100%;
        }

        /* Left Side Styling */
        .hero-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          background: var(--hover-bg);
          border-radius: 99px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 24px;
          border: 1px solid var(--border-color);
        }

        .hero-copy h1 {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(32px, 4.5vw, 48px);
          font-weight: 800;
          line-height: 1.15;
          color: var(--text-heading);
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }

        .hero-description {
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-body);
          margin-bottom: 36px;
          max-width: 520px;
        }

        .hero-buttons {
          display: flex;
          gap: 16px;
        }

        .hero-primary-btn {
          background: var(--primary-blue);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 14px 28px;
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .hero-primary-btn:hover {
          background: var(--hover-blue);
        }

        .hero-secondary-btn {
          background: var(--card-bg);
          color: var(--text-heading);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 14px 28px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-secondary-btn:hover {
          background: var(--hover-bg);
        }

        /* Right Side - Browser Mockup */
        .hero-dashboard-container {
          width: 100%;
          position: relative;
        }

        .dashboard-browser-frame {
          width: 100%;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .browser-header {
          background: var(--hover-bg);
          border-bottom: 1px solid var(--border-color);
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          position: relative;
        }

        .window-dots {
          display: flex;
          gap: 6px;
          position: absolute;
          left: 16px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-red { background: #ef4444; }
        .dot-yellow { background: #f59e0b; }
        .dot-green { background: #10b981; }

        .browser-content {
          display: flex;
          height: 420px;
          background: var(--page-bg);
        }

        /* Sidebar */
        .crm-sidebar {
          width: 180px;
          border-right: 1px solid var(--border-color);
          background: var(--card-bg);
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .crm-logo {
          font-weight: 700;
          font-size: 15px;
          color: var(--text-heading);
          padding-left: 8px;
          letter-spacing: 0.5px;
        }

        .crm-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nav-item {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          padding: 8px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-item.active {
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-blue);
        }

        /* Main Content Workspace */
        .crm-main {
          flex: 1;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow: hidden;
        }
        
        .crm-main-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .crm-main-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-heading);
        }
        
        .crm-main-subtitle {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Module Grid */
        .module-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          height: 100%;
        }

        .module-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        
        .module-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-blue);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .module-info {
          display: flex;
          flex-direction: column;
        }

        .module-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-heading);
        }
        
        .module-desc {
          font-size: 11px;
          color: var(--text-secondary);
        }

        /* Responsiveness */
        @media (max-width: 1024px) {
          .hero {
            padding: 80px 0;
          }
        }

        @media (max-width: 920px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-copy {
            align-items: center;
            text-align: center;
          }
          .hero-description {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-dashboard-container {
            max-width: 720px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .browser-content {
            height: auto;
            flex-direction: column;
          }
          .crm-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
            padding: 12px;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .crm-nav {
            flex-direction: row;
            gap: 8px;
            overflow-x: auto;
          }
          .nav-item span {
            display: none;
          }
          .module-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero-buttons {
            flex-direction: column;
            width: 100%;
          }
          .hero-primary-btn, .hero-secondary-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
      
      <section className="hero" id="home">
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="hero-badge">
              <span>Modern Workforce Management</span>
            </div>

            <h1>
              Manage your entire workforce from one secure CRM platform.
            </h1>

            <p className="hero-description">
              Simplify employee management, attendance, payroll, expenses, documents, support requests, and team collaboration through one centralized platform built for modern organizations.
            </p>

            <div className="hero-buttons">
              <button className="hero-primary-btn" onClick={() => navigate("/register")}>
                Get Started
              </button>
              <button className="hero-secondary-btn" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
                Explore Platform
              </button>
            </div>
          </div>

          <div className="hero-dashboard-container">
            <div className="dashboard-browser-frame">
              <div className="browser-header">
                <div className="window-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
              </div>
              
              <div className="browser-content">
                {/* Mock CRM Sidebar */}
                <aside className="crm-sidebar">
                  <div className="crm-logo">HRMS Portal</div>
                  <nav className="crm-nav">
                    <div className="nav-item active"><Users size={16} /> <span>Dashboard</span></div>
                    <div className="nav-item"><CheckSquare size={16} /> <span>Tasks</span></div>
                    <div className="nav-item"><FileText size={16} /> <span>Documents</span></div>
                    <div className="nav-item"><HelpCircle size={16} /> <span>Support</span></div>
                  </nav>
                </aside>

                {/* Mock CRM Main Workspace */}
                <main className="crm-main">
                  <div className="crm-main-header">
                    <h3 className="crm-main-title">Workspace Overview</h3>
                    <span className="crm-main-subtitle">Access all organizational modules</span>
                  </div>
                  
                  <div className="module-grid">
                    <div className="module-card">
                      <div className="module-icon"><Users size={20} /></div>
                      <div className="module-info">
                        <span className="module-title">Employee Management</span>
                        <span className="module-desc">Directory & Profiles</span>
                      </div>
                    </div>
                    
                    <div className="module-card">
                      <div className="module-icon"><Clock size={20} /></div>
                      <div className="module-info">
                        <span className="module-title">Attendance</span>
                        <span className="module-desc">Time & Leave</span>
                      </div>
                    </div>
                    
                    <div className="module-card">
                      <div className="module-icon"><DollarSign size={20} /></div>
                      <div className="module-info">
                        <span className="module-title">Payroll</span>
                        <span className="module-desc">Salary & Payslips</span>
                      </div>
                    </div>
                    
                    <div className="module-card">
                      <div className="module-icon"><Receipt size={20} /></div>
                      <div className="module-info">
                        <span className="module-title">Expenses</span>
                        <span className="module-desc">Claims & Approvals</span>
                      </div>
                    </div>
                    
                    <div className="module-card">
                      <div className="module-icon"><Bell size={20} /></div>
                      <div className="module-info">
                        <span className="module-title">Notifications</span>
                        <span className="module-desc">System Alerts</span>
                      </div>
                    </div>
                    
                    <div className="module-card">
                      <div className="module-icon"><HelpCircle size={20} /></div>
                      <div className="module-info">
                        <span className="module-title">Help Center</span>
                        <span className="module-desc">Internal IT Support</span>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;