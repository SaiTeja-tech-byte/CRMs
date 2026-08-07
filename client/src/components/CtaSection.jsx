import React from "react";
import { useNavigate } from "react-router-dom";

const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .cta-section {
          padding: 120px 24px;
          background: #F8FAFF;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .cta-container {
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cta-badge {
          display: inline-flex;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563EB;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .cta-heading {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          color: #0F172A;
          line-height: 1.2;
          margin: 0 0 24px 0;
          letter-spacing: -0.02em;
        }

        .cta-description {
          font-size: clamp(16px, 2vw, 18px);
          color: #475569;
          line-height: 1.6;
          margin: 0 0 40px 0;
          max-width: 680px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 250ms ease;
          border: 2px solid transparent;
        }

        .cta-btn-primary {
          background: #2563EB;
          color: #FFFFFF;
        }

        .cta-btn-primary:hover {
          background: #1D4ED8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
        }

        .cta-btn-secondary {
          background: #FFFFFF;
          color: #2563EB;
          border-color: #2563EB;
        }

        .cta-btn-secondary:hover {
          background: #EFF6FF;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.1);
        }

        .cta-login-text {
          font-size: 14px;
          color: #64748B;
          margin: 0;
        }

        .cta-login-link {
          color: #2563EB;
          font-weight: 700;
          text-decoration: none;
          transition: color 200ms ease;
        }

        .cta-login-link:hover {
          color: #1D4ED8;
          text-decoration: underline;
        }

        .animate-fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fade-up 0.6s ease forwards;
        }

        @keyframes fade-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .cta-section {
            padding: 80px 20px;
          }
          
          .cta-buttons {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          
          .cta-btn {
            width: 100%;
          }
        }
      `}</style>

      <section className="cta-section">
        <div className="cta-container animate-fade-up">
          <span className="cta-badge">GET STARTED</span>
          
          <h2 className="cta-heading">
            Ready to simplify your workplace management?
          </h2>
          
          <p className="cta-description">
            Manage employees, attendance, payroll, tasks, documents, reports, and communication from one secure platform designed for modern organizations.
          </p>
          
          <div className="cta-buttons">
            <button className="cta-btn cta-btn-primary" onClick={() => navigate("/login")}>
              Get Started
            </button>
            <button className="cta-btn cta-btn-secondary" onClick={() => window.location.hash = "contact"}>
              Schedule Demo
            </button>
          </div>
          
          <p className="cta-login-text">
            Already have an account?{" "}
            <a href="/login" className="cta-login-link" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Log In &rarr;
            </a>
          </p>
        </div>
      </section>
    </>
  );
};

export default CtaSection;
