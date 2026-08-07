import React from "react";
import { Mail, Phone, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <style>{`
        .shnoor-footer {
          background-color: #0F172A;
          color: #CBD5E1;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 80px 0 0 0;
          width: 100%;
          border-top: none;
        }

        .shnoor-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .shnoor-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        /* Column 1 */
        .footer-col-brand {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-logo-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .shnoor-icon {
          width: 36px;
          height: 36px;
          background: #FFFFFF;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2563EB;
        }

        .shnoor-title-wrap {
          display: flex;
          flex-direction: column;
        }

        .shnoor-title-top {
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        .shnoor-title-bottom {
          font-size: 13px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #94A3B8;
          max-width: 400px;
          margin-bottom: 32px;
        }

        .footer-heading {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 20px;
        }

        .footer-address {
          font-size: 14px;
          line-height: 1.6;
          color: #94A3B8;
        }

        /* Column 2 & 3 */
        .footer-col {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #CBD5E1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-contact-item:hover {
          color: #FFFFFF;
        }

        .icon-email {
          color: #60A5FA;
        }

        .icon-phone {
          color: #F472B6;
        }

        .footer-link-item {
          font-size: 14px;
          color: #CBD5E1;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-link-item:hover {
          color: #FFFFFF;
        }

        /* Bottom Bar */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-copyright {
          font-size: 13px;
          color: #94A3B8;
        }

        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #94A3B8;
        }
        
        .footer-legal-links span {
          color: #64748B;
        }

        .footer-legal-links a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-legal-links a:hover {
          color: #FFFFFF;
        }

        .footer-secure {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #10B981;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .shnoor-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .footer-col-brand {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .shnoor-footer {
            padding: 60px 0 0 0;
          }
          .shnoor-footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .footer-col-brand {
            grid-column: span 1;
          }
          .footer-bottom-bar {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
      <footer className="shnoor-footer" id="contact">
        <div className="shnoor-footer-inner">
          <div className="shnoor-footer-grid">
            
            {/* Column 1: Company */}
            <div className="footer-col-brand">
              <div className="footer-logo-wrap">
                <div className="shnoor-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="shnoor-title-wrap">
                  <span className="shnoor-title-top">SHNOOR INTERNATIONAL</span>
                  <span className="shnoor-title-bottom">CRM PLATFORM</span>
                </div>
              </div>
              
              <p className="footer-desc">
                Modern CRM platform for employee management, attendance, payroll, tasks, documents, reports, and organizational collaboration.
              </p>
              
              <h4 className="footer-heading">LOCATION</h4>
              <div className="footer-address">
                10009 Mount Tabor Road,<br />
                Odessa Missouri, United States.
              </div>
            </div>

            {/* Column 2: Contacts */}
            <div className="footer-col">
              <h4 className="footer-heading">CONTACTS</h4>
              <div className="footer-list">
                <a href="mailto:info@shnoor.com" className="footer-contact-item">
                  <Mail size={16} className="icon-email" />
                  <span>info@shnoor.com (General)</span>
                </a>
                <a href="mailto:proc@shnoor.com" className="footer-contact-item">
                  <Mail size={16} className="icon-email" />
                  <span>proc@shnoor.com (Sales)</span>
                </a>
                <a href="tel:+919429694298" className="footer-contact-item">
                  <Phone size={16} className="icon-phone" />
                  <span>+91-9429694298</span>
                </a>
                <a href="tel:+919041914601" className="footer-contact-item">
                  <Phone size={16} className="icon-phone" />
                  <span>+91-9041914601</span>
                </a>
              </div>
            </div>

            {/* Column 3: Useful Links */}
            <div className="footer-col">
              <h4 className="footer-heading">USEFUL LINKS</h4>
              <div className="footer-list">
                <a href="#social" className="footer-link-item">We are Social</a>
                <a href="#connect" className="footer-link-item">Let's Connect</a>
                <a href="#company" className="footer-link-item">Company Profile</a>
              </div>
            </div>
            
          </div>
          
          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              © Copyrights 2025. All Rights Reserved. SHNOOR INTERNATIONAL LLC
            </div>
            
            <div className="footer-legal-links">
              <span>•</span>
              <a href="/privacy-policy">Privacy Policy</a>
              <span>•</span>
              <a href="/terms">Terms & Conditions</a>
            </div>
            
            <div className="footer-secure">
              <ShieldCheck size={16} />
              <span>Secure Environment</span>
            </div>
          </div>
          
        </div>
      </footer>
    </>
  );
};

export default Footer;