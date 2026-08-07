import React from "react";
import { 
  ArrowRight, 
  TrendingUp, 
  Headphones, 
  Megaphone, 
  Rocket, 
  Store, 
  Building2, 
  Users, 
  Activity, 
  FileText 
} from "lucide-react";

const solutions = [
  {
    title: "Sales Teams",
    description: "Manage leads, track deals and close opportunities faster.",
    Icon: TrendingUp,
  },
  {
    title: "Customer Support",
    description: "Keep every customer conversation organized in one place.",
    Icon: Headphones,
  },
  {
    title: "Marketing Teams",
    description: "Capture leads, monitor campaigns and measure performance.",
    Icon: Megaphone,
  },
  {
    title: "Startups",
    description: "Scale customer relationships without adding complexity.",
    Icon: Rocket,
  },
  {
    title: "Small Businesses",
    description: "An affordable CRM designed to simplify daily operations.",
    Icon: Store,
  },
  {
    title: "Enterprise",
    description: "Advanced permissions, analytics and automation for growing organizations.",
    Icon: Building2,
  },
];

const SolutionsSection = () => {
  return (
    <section className="solutions-section" id="solutions">
      <div className="container solutions-inner">
        <div className="solutions-header animate-fade-up">
          <span className="solutions-badge">Solutions</span>
          <h2>Built for every growing business.</h2>
          <p>
            Whether you're a startup, sales team, or enterprise, CRM Platform helps
            you manage customers, automate workflows, and grow revenue.
          </p>
        </div>

        <div className="solutions-grid-wrapper">
          <div className="solutions-grid">
            {solutions.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <article
                  key={item.title}
                  className="solution-card animate-fade-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="solution-icon-wrapper">
                    <IconComponent size={20} className="text-primary" />
                  </span>
                  <div className="solution-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="solution-arrow">
                    <ArrowRight size={16} />
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

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

const HowItWorksSection = () => {
  return (
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
  );
}

const Solutions = () => {
  return (
    <>
      <style>{`
        /* How It Works Section */
        .hiw-section {
          padding: 100px 0;
          background: var(--bg-color, #FFFFFF);
          border-bottom: 1px solid var(--border-color, #E2E8F0);
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
          color: #2563EB;
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
          color: var(--text-primary, #0F172A);
          margin-bottom: 1.25rem;
        }

        .hiw-header p {
          color: var(--text-secondary, #64748B);
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
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border-color, #E2E8F0);
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
          border-color: #BFDBFE;
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
          color: #2563EB;
        }

        .hiw-step-number {
          font-size: 42px;
          font-weight: 800;
          color: var(--border-color, #E2E8F0);
          font-family: 'Inter', system-ui, sans-serif;
          line-height: 1;
        }

        .hiw-card h3 {
          font-size: 1.35rem;
          line-height: 1.3;
          margin-bottom: 12px;
          color: var(--text-primary, #0F172A);
          font-weight: 750;
        }

        .hiw-card p {
          color: var(--text-secondary, #64748B);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        /* Solutions Section */
        .solutions-section {
          padding: 100px 0;
          background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.04), transparent 35%), var(--bg-color, #FFFFFF);
          border-bottom: 1px solid var(--border-color, #E2E8F0);
          position: relative;
          transition: background-color 0.3s ease;
        }

        .solutions-inner {
          display: grid;
          gap: 3rem;
          text-align: center;
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .solutions-header {
          max-width: 620px;
          margin: 0 auto;
        }

        .solutions-badge {
          display: inline-flex;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.1);
          border: 1px solid rgba(37, 99, 235, 0.2);
          color: #2563EB;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .solutions-header h2 {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(26px, 4.5vw, 38px);
          line-height: 1.2;
          color: var(--text-primary, #0F172A);
          font-weight: 800;
        }

        .solutions-header p {
          max-width: 620px;
          margin: 12px auto 0;
          color: var(--text-secondary, #64748B);
          font-size: 16px;
          line-height: 1.6;
        }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          width: 100%;
        }

        .solution-card {
          background: var(--card-bg, #ffffff);
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          text-align: left;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        /* Glowing top border on hover */
        .solution-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #2563EB, #60A5FA);
          opacity: 0;
          transition: opacity 300ms ease;
        }

        .solution-card:hover::before {
          opacity: 1;
        }

        .solution-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
          border-color: #2563EB;
        }

        .solution-icon-wrapper {
          width: 48px;
          height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563EB;
          border: 1px solid rgba(37, 99, 235, 0.2);
          transition: all 300ms ease;
        }

        .solution-card:hover .solution-icon-wrapper {
          background: #2563EB;
          color: #FFFFFF;
          transform: scale(1.08);
        }

        .solution-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .solution-copy h3 {
          font-size: 1.2rem;
          line-height: 1.3;
          color: var(--text-primary, #0F172A);
          font-weight: 750;
        }

        .solution-copy p {
          color: var(--text-secondary, #64748B);
          font-size: 14.5px;
          line-height: 1.55;
          margin: 0;
        }

        .solution-arrow {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--hover-bg, #F1F5F9);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary, #64748B);
          transition: all 300ms ease;
          margin-left: auto;
          border: 1px solid var(--border-color, #E2E8F0);
        }

        .solution-card:hover .solution-arrow {
          background: #2563EB;
          color: #FFFFFF;
          border-color: #2563EB;
          transform: translateX(4px);
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
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
          .hiw-grid, .solutions-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .hiw-grid, .solutions-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .hiw-card, .solution-card {
            width: 100%;
            padding: 24px;
          }
          .hiw-header h2, .solutions-header h2 {
            font-size: 28px;
          }
          .hiw-section, .solutions-section {
            padding: 60px 0;
          }
        }
      `}</style>
      <HowItWorksSection />
      <SolutionsSection />
    </>
  );
};

export default Solutions;
