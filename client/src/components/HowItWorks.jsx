import React from "react";
import { 
  Users, 
  Activity, 
  FileText 
} from "lucide-react";

const howItWorksCards = [
  {
    step: "01",
    title: "Manage Employees",
    description: "Add employees, assign departments, define roles, and maintain employee information from a centralized workspace.",
    Icon: Users,
  },
  {
    step: "02",
    title: "Manage Daily Operations",
    description: "Employees can mark attendance, manage tasks, submit expenses, access documents, and collaborate with their teams in one place.",
    Icon: Activity,
  },
  {
    step: "03",
    title: "Monitor & Generate Reports",
    description: "Administrators can monitor attendance, payroll, employee activities, expenses, and generate reports for better organizational management.",
    Icon: FileText,
  },
];

const HowItWorks = () => {
  return (
    <>
      <style>{`
        /* How It Works Section */
        .hiw-section {
          padding: 100px 0;
          background: var(--page-bg);
          border-bottom: 1px solid var(--border-color);
          position: relative;
          transition: background-color 0.3s ease;
        }

        .hiw-inner {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          align-items: center;
        }

        .hiw-header {
          max-width: 800px;
          text-align: center;
        }

        .hiw-eyebrow {
          display: inline-flex;
          margin-bottom: 1rem;
          color: var(--primary-blue);
          font-size: 0.85rem;
          font-weight: 750;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .hiw-header h2 {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.2;
          font-weight: 800;
          color: var(--text-heading);
          margin-bottom: 1.25rem;
        }

        .hiw-header p {
          color: var(--text-body);
          font-size: 17px;
          line-height: 1.6;
          margin: 0 auto;
          max-width: 680px;
        }

        .hiw-grid-wrapper {
          width: 100%;
        }

        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
          width: 100%;
        }

        .hiw-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 36px 32px;
          transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          position: relative;
        }

        .hiw-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
          border-color: var(--primary-blue);
        }

        .hiw-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .hiw-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-blue);
        }

        .hiw-step-number {
          font-size: 42px;
          font-weight: 800;
          color: var(--border-color);
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1;
        }

        .hiw-card h3 {
          font-size: 1.35rem;
          line-height: 1.3;
          margin-bottom: 12px;
          color: var(--text-heading);
          font-weight: 750;
        }

        .hiw-card p {
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        .animate-fade-up {
          opacity: 0;
          transform: translateY(15px);
          animation: solutionFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes solutionFadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hiw-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .hiw-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .hiw-card {
            width: 100%;
            padding: 24px;
          }
          .hiw-header h2 {
            font-size: 28px;
          }
          .hiw-section {
            padding: 60px 0;
          }
        }
      `}</style>

      <section className="hiw-section" id="how-it-works">
        <div className="container hiw-inner">
          <div className="hiw-header animate-fade-up">
            <span className="hiw-eyebrow">HOW IT WORKS</span>
            <h2>Manage your workforce in three simple steps</h2>
            <p>
              Our CRM Platform streamlines employee management, attendance, payroll, tasks, documents, and internal operations through one centralized workspace for administrators and employees.
            </p>
          </div>

          <div className="hiw-grid-wrapper">
            <div className="hiw-grid">
              {howItWorksCards.map((item, index) => {
                const IconComponent = item.Icon;
                return (
                  <article
                    key={item.title}
                    className="hiw-card animate-fade-up"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="hiw-card-header">
                      <span className="hiw-icon-wrapper">
                        <IconComponent size={20} className="text-primary" />
                      </span>
                      <span className="hiw-step-number">{item.step}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
