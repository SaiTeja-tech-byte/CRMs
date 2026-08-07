import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description: 'Grant secure permissions for Admins, HR, Managers, and Employees while ensuring each user only accesses authorized modules.'
  },
  {
    icon: Lock,
    title: 'Protected Company Data',
    description: 'Sensitive employee records, payroll information, and documents are securely stored with encrypted communication.'
  },
  {
    icon: Activity,
    title: 'Activity Monitoring',
    description: 'Track user actions, login history, attendance updates, approvals, and important system activities from one place.'
  }
];

const statusItems = [
  { label: 'User Authentication', value: 'Enabled', highlight: true },
  { label: 'Role Permissions', value: 'Active', highlight: true },
  { label: 'Data Encryption', value: 'Protected', highlight: true },
  { label: 'Backup Status', value: 'Automatic', highlight: false }
];

const SecuritySection = () => {
  return (
    <>
      <style>{`
        .security-section {
          padding: 100px 0;
          background: var(--section-bg);
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .security-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        /* Left Side */
        .security-left {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .sec-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: flex-start;
        }

        .sec-badge {
          display: inline-flex;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.2);
          color: var(--primary-blue);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sec-header h2 {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 800;
          color: var(--text-heading);
          line-height: 1.15;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .sec-header p {
          color: var(--text-body);
          font-size: 17px;
          line-height: 1.6;
          margin: 0;
        }

        .sec-features {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .sec-feature-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .sec-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-blue);
          flex-shrink: 0;
        }

        .sec-feature-content h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-heading);
          margin: 0 0 8px 0;
        }

        .sec-feature-content p {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        /* Right Side */
        .security-right {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .sec-dashboard-card {
          width: 100%;
          max-width: 540px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          gap: 24px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .sec-dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        }

        .sec-dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
        }

        .sec-dash-header h3 {
          font-size: 1.25rem;
          font-weight: 750;
          color: var(--text-heading);
          margin: 0;
        }

        .status-badge {
          background: rgba(16, 185, 129, 0.1);
          color: #10B981;
          font-size: 12px;
          font-weight: 750;
          padding: 6px 12px;
          border-radius: 999px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .sec-status-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .sec-status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid var(--border-color);
        }
        
        .sec-status-item:last-child {
          border-bottom: none;
        }

        .sec-status-label {
          color: var(--text-body);
          font-size: 15px;
          font-weight: 500;
        }

        .sec-status-value {
          font-size: 14px;
          font-weight: 600;
        }
        
        .sec-status-value.highlight {
          color: #10B981;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .sec-status-value.normal {
          color: var(--primary-blue);
        }

        .sec-info-card {
          background: var(--hover-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          margin-top: 8px;
        }

        .sec-info-card p {
          color: var(--text-secondary);
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }

        .animate-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUpSec 0.6s ease forwards;
        }

        @keyframes fadeUpSec {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .security-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          
          .security-right {
            justify-content: center;
          }
          
          .sec-dashboard-card {
            max-width: 100%;
          }
        }

        @media (max-width: 640px) {
          .security-section {
            padding: 60px 0;
          }
          
          .sec-header h2 {
            font-size: 28px;
          }
          
          .sec-dashboard-card {
            padding: 24px;
          }
        }
      `}</style>
      
      <section className="security-section" id="security">
        <div className="container security-inner">
          
          {/* Left Column */}
          <div className="security-left animate-fade-up">
            <div className="sec-header">
              <span className="sec-badge">Platform Security</span>
              <h2>Enterprise-grade security for your workforce.</h2>
              <p>Protect employee data, payroll, attendance, documents, and organizational information with secure access control, encrypted storage, and centralized administration.</p>
            </div>
            
            <div className="sec-features">
              {securityFeatures.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div className="sec-feature-item" key={index}>
                    <div className="sec-icon-wrapper">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <div className="sec-feature-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="security-right animate-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="sec-dashboard-card">
              
              <div className="sec-dash-header">
                <h3>System Security</h3>
                <span className="status-badge">Secure</span>
              </div>
              
              <div className="sec-status-list">
                {statusItems.map((item, idx) => (
                  <div className="sec-status-item" key={idx}>
                    <span className="sec-status-label">{item.label}</span>
                    <span className={`sec-status-value ${item.highlight ? 'highlight' : 'normal'}`}>
                      {item.highlight && <span style={{ fontSize: '10px' }}>✓</span>}
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="sec-info-card">
                <p>"Your organization's data is protected through secure authentication, encrypted storage, and centralized access management."</p>
              </div>
              
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
};

export default SecuritySection;
