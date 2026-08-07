import React from "react";
import { ArrowRight, Users, Zap, BarChart3, Shield, Link2, FileText, Calendar, Check, Cpu, Download, TrendingUp, Clock, CheckSquare, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    Icon: Users,
    title: 'Employee Management',
    description: 'Add, organize, and manage employee profiles, departments, and roles from one centralized workspace.',
  },
  {
    Icon: Clock,
    title: 'Attendance & Payroll',
    description: 'Track attendance, working hours, leave records, and payroll efficiently.',
  },
  {
    Icon: CheckSquare,
    title: 'Task & Team Collaboration',
    description: 'Assign tasks, monitor progress, and improve collaboration across teams.',
  },
  {
    Icon: FileText,
    title: 'Documents & Expenses',
    description: 'Securely manage documents and streamline expense submissions and approvals.',
  },
  {
    Icon: BarChart3,
    title: 'Reports & Analytics',
    description: 'Generate attendance, payroll, expense, and organizational reports with a few clicks.',
  },
  {
    Icon: Bell,
    title: 'Notifications & Help Center',
    description: 'Stay updated with announcements, notifications, support tickets, and employee communication.',
  },
];


const FeaturesSection = () => (
  <section className="features-section" id="features">
    <div className="container features-inner">
      <div className="features-header animate-fade-up">
        <span className="features-badge">FEATURES</span>
        <h2>Everything your organization needs in one platform</h2>
        <p className="features-desc">
          Manage employees, attendance, payroll, expenses, tasks, documents, communication, and reporting through a single, secure CRM Platform for administrators and employees.
        </p>
      </div>
      <div className="features-grid-wrapper">
        <div className="features-grid">
          {features.map(({ Icon, title, description }, index) => (
            <FeatureCard
              key={title}
              Icon={Icon}
              title={title}
              description={description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);


const FeatureCard = ({ Icon, title, description, index = 0 }) => {
  const isString = typeof Icon === "string";

  return (
    <article
      className="feature-card animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span className="feature-icon-wrapper">
        {isString ? (
          <img src={Icon} alt={`${title} logo`} className="feature-icon" />
        ) : (
          <Icon size={24} strokeWidth={1.5} />
        )}
      </span>

      <div className="feature-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </article>
  );
};




const CtaBannerSection = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-outer" id="cta">
      <div className="container cta-inner animate-fade-up">
        {/* Content Section */}
        <div className="cta-content">
          <div className="cta-badge">
            <span>Join 10,000+ Growing Businesses</span>
          </div>

          <h1>
            Get started with CRM Platform today.
          </h1>

          <p className="cta-description">
            Start your 14-day free trial. Setup takes less than two minutes, and no credit card is required.
          </p>

          {/* Buttons */}
          <div className="cta-actions">
            <button className="primary-btn cta-btn" onClick={() => navigate("/login")}>
              Start Free Trial
              <ArrowRight size={16} className="cta-arrow-icon" />
            </button>
            <button className="secondary-btn cta-btn">
              <Calendar size={16} className="cta-calendar-icon" />
              Schedule Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="cta-trust-indicators">
            <div className="trust-item">
              <Check size={14} className="trust-icon" />
              <span>No credit card required</span>
            </div>
            <div className="trust-item">
              <Check size={14} className="trust-icon" />
              <span>14-day free trial</span>
            </div>
            <div className="trust-item">
              <Check size={14} className="trust-icon" />
              <span>Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};




const steps = [
  {
    step: "01",
    icon: <Download size={20} />,
    title: "Capture leads",
    description: "Automatically collect details from forms, websites, and emails in real time.",
  },
  {
    step: "02",
    icon: <Cpu size={20} />,
    title: "Nurture deals",
    description: "Trigger follow-up emails and assign new leads to reps instantly.",
  },
  {
    step: "03",
    icon: <TrendingUp size={20} />,
    title: "Close deals",
    description: "Track deal stages in the pipeline, manage tasks, and drive revenue growth.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="how-section" id="how">
      <div className="container how-inner">
        {/* Badge & Headers */}
        <div className="how-header animate-fade-up">
          <span className="how-badge">
            Simple Workflow
          </span>
          <h2>Turn every prospect into a customer</h2>
          <p className="how-desc">
            Keep your sales process organized and efficient. Capture details, automate repetitive tasks, and track pipeline progress without the complexity.
          </p>
        </div>

        {/* Timeline grid with connectors */}
        <div className="how-timeline-container">
        <div className="how-grid-wrapper">
          <div className="how-grid">
            {steps.map((s, i) => (
              <div key={s.title} className="how-step-wrapper">
                <article className="how-card animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="how-card-top">
                    <span className="how-card-icon">{s.icon}</span>
                    <span className="how-step-num">{s.step}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                </article>
                {i < steps.length - 1 && (
                  <div className="timeline-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};



const Features = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`.features-section {
  padding: 100px 0;
  background: var(--bg-color, #FFFFFF);
  border-bottom: 1px solid var(--border-color, #E2E8F0);
  position: relative;
  transition: background-color 0.3s ease;
}

.features-inner {
  display: grid;
  gap: 4rem;
  text-align: center;
  max-width: 1280px;
  margin: 0 auto;
}

.features-header {
  max-width: 800px;
  margin: 0 auto;
}

.features-badge {
  display: inline-flex;
  margin-bottom: 1rem;
  color: #2563EB;
  font-size: 0.85rem;
  font-weight: 750;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.features-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.2;
  font-weight: 800;
  color: var(--text-primary, #0F172A);
  margin-bottom: 1.25rem;
}

.features-desc {
  color: var(--text-secondary, #64748B);
  font-size: 17px;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 680px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 32px;
  width: 100%;
}

.feature-card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #E2E8F0);
  border-radius: 20px;
  padding: 32px 24px;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  position: relative;
  text-align: left;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
  border-color: #BFDBFE;
}

.feature-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563EB;
  margin-bottom: 24px;
}

.feature-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-copy h3 {
  font-size: 1.35rem;
  line-height: 1.3;
  color: var(--text-primary, #0F172A);
  font-weight: 750;
  margin: 0;
}

.feature-copy p {
  color: var(--text-secondary, #64748B);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .feature-card {
    width: 100%;
    padding: 24px;
  }
  .features-header h2 {
    font-size: 28px;
  }
  .features-section {
    padding: 60px 0;
  }
}

.animate-fade-up {
  opacity: 0;
  transform: translateY(15px);
  animation: featureFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes featureFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.how-section {
  position: relative;
  background: #fafbfc;
  padding: 80px 0;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
}

.how-inner {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 48px;
}

/* Header */
.how-header {
  text-align: center;
  max-width: 640px;
}

.how-badge {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 99px;
  padding: 6px 14px;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}

.how-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(26px, 4.5vw, 38px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 12px;
}

.how-desc {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Grid Layout */
.how-timeline-container {
  width: 100%;
}

.how-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
}

.how-step-wrapper {
  position: relative;
  width: 100%;
}

.how-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
  position: relative;
  overflow: hidden;
  z-index: 2;
  text-align: left;
}

.how-card:hover {
  transform: translateY(-4px);
  border-color: #2563eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.02);
}

.how-card-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.how-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease;
}

.how-card:hover .how-card-icon {
  transform: scale(1.05);
}

.how-step-num {
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 99px;
}

.how-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.how-card p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* Connectors */
.timeline-connector {
  position: absolute;
  top: 44px;
  right: -24px;
  width: 24px;
  height: 1px;
  background-color: #e2e8f0;
  z-index: 1;
  pointer-events: none;
}

/* Animations */
.animate-fade-up {
  opacity: 0;
  transform: translateY(15px);
  animation: howFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes howFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 920px) {
  .how-header h2 {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .how-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .how-card {
    width: 100%;
  }
  .timeline-connector {
    display: none;
  }
}

@media (max-width: 600px) {
  .how-header h2 {
    font-size: 28px;
  }
  .how-section {
    padding: 60px 0;
  }
}

.cta-outer {
  position: relative;
  background: #fafbfc;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Card container */
.cta-inner {
  position: relative;
  max-width: 1120px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

/* Content Area */
.cta-content {
  max-width: 760px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 99px;
  padding: 6px 14px;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
}

.cta-content h1 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 38px;
  font-weight: 800;
  line-height: 1.2;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.cta-description {
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
  max-width: 580px;
  margin: 0 auto 28px;
}

/* CTA buttons */
.cta-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.cta-btn {
  font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}

.primary-btn.cta-btn {
  height: 48px;
  padding: 0 24px;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  gap: 8px;
  box-shadow: none;
}

.primary-btn.cta-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.cta-arrow-icon {
  transition: transform 200ms ease;
}

.primary-btn.cta-btn:hover .cta-arrow-icon {
  transform: translateX(4px);
}

.secondary-btn.cta-btn {
  height: 48px;
  padding: 0 24px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  font-size: 15px;
  gap: 8px;
  box-shadow: none;
}

.secondary-btn.cta-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

/* Trust indicators */
.cta-trust-indicators {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

.trust-icon {
  color: #10b981;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .cta-content h1 {
    font-size: 34px;
  }
  .cta-inner {
    padding: 50px 32px;
  }
}

@media (max-width: 520px) {
  .cta-content h1 {
    font-size: 28px;
  }
  .cta-description {
    font-size: 15px;
  }
  .cta-actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 12px;
  }
  .cta-btn {
    width: 100%;
  }
  .cta-trust-indicators {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .cta-inner {
    padding: 40px 20px;
    border-radius: 20px;
  }
}
`}</style>
      <FeaturesSection />
    </>
  );
};

export default Features;
