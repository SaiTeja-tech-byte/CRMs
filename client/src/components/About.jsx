import React from "react";
import { Check, User, Shield, BarChart3 } from "lucide-react";

const aboutCards = [
  {
    title: "Employee Workspace",
    description: "Employees can manage attendance, tasks, documents, expenses, reports, and personal information from one dashboard.",
    Icon: User,
  },
  {
    title: "Admin Control Center",
    description: "Manage employees, departments, attendance, payroll, reports, announcements, and organizational settings with complete control.",
    Icon: Shield,
  },
  {
    title: "Reports & Insights",
    description: "Generate organization-wide reports, monitor operations, and access real-time information for better decision-making.",
    Icon: BarChart3,
  }
];

const checkItems = [
  "Centralized employee and organization management",
  "Secure role-based access for employees and administrators",
  "Streamlined attendance, payroll, reports, and collaboration"
];

const About = () => {
  return (
    <>
      <style>{`
        .about-section {
          padding: 100px 0;
          background: var(--page-bg);
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .about-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
        }

        .about-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .about-badge {
          display: inline-flex;
          align-self: flex-start;
          color: var(--primary-blue);
          font-size: 0.85rem;
          font-weight: 750;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .about-left h2 {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.2;
          font-weight: 800;
          color: var(--text-heading);
          margin: 0;
        }

        .about-desc {
          color: var(--text-body);
          font-size: 17px;
          line-height: 1.6;
          margin: 0;
        }

        .about-checks {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }

        .about-check-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--hover-bg);
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-heading);
          font-size: 15px;
          font-weight: 500;
        }

        .about-check-icon {
          color: var(--primary-blue);
          flex-shrink: 0;
        }

        .about-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .about-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 28px 24px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .about-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
          border-color: var(--primary-blue);
        }

        .about-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-blue);
          flex-shrink: 0;
          transition: transform 300ms ease;
        }

        .about-card:hover .about-card-icon {
          transform: scale(1.05);
        }

        .about-card-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .about-card-content h3 {
          font-size: 1.25rem;
          font-weight: 750;
          color: var(--text-heading);
          margin: 0;
        }

        .about-card-content p {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        .animate-fade-up {
          opacity: 0;
          transform: translateY(15px);
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .about-inner {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        @media (max-width: 640px) {
          .about-section {
            padding: 60px 0;
          }
          .about-left h2 {
            font-size: 28px;
          }
          .about-card {
            flex-direction: column;
            gap: 16px;
            padding: 24px;
          }
        }
      `}</style>
      
      <section className="about-section" id="about">
        <div className="container about-inner">
          <div className="about-left animate-fade-up">
            <span className="about-badge">ABOUT PLATFORM</span>
            <h2>One platform for employees, managers, and administrators</h2>
            <p className="about-desc">
              Our CRM Platform centralizes employee management, attendance, payroll, tasks, documents, communication, and reporting into one secure workspace. It simplifies daily operations while giving administrators complete visibility and control across the organization.
            </p>
            <div className="about-checks">
              {checkItems.map((item, i) => (
                <div key={i} className="about-check-item">
                  <Check size={20} className="about-check-icon" strokeWidth={2.5} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          <div className="about-right">
            {aboutCards.map((card, index) => {
              const Icon = card.Icon;
              return (
                <article 
                  key={index} 
                  className="about-card animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="about-card-icon">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="about-card-content">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
