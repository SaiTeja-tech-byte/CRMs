import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
      <>
        <style>{`.hero {
  position: relative;
  background: #fafbfc;
  padding: 100px 0 120px;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  overflow: hidden;
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
  background: #f1f5f9;
  border-radius: 99px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 24px;
}

.hero-copy h1 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 32px;
  max-width: 520px;
}

/* Email Signup Form styling */
.hero-signup-container {
  margin-bottom: 40px;
  width: 100%;
  max-width: 480px;
}

.hero-signup-form {
  display: flex;
  gap: 12px;
  background: #ffffff;
  padding: 6px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.hero-email-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 15px;
  color: #0f172a;
  background: transparent;
}

.hero-email-input::placeholder {
  color: #94a3b8;
}

.hero-submit-btn {
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.hero-submit-btn:hover {
  background: #1e293b;
}

.hero-form-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
  padding-left: 6px;
}

/* Social Proof (Trust Section) */
.hero-trust {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-group {
  display: flex;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.avatar:first-child {
  margin-left: 0;
}

.avatar:nth-child(1) { background: #dbeafe; color: #1e40af; }
.avatar:nth-child(2) { background: #fee2e2; color: #991b1b; }
.avatar:nth-child(3) { background: #d1fae5; color: #065f46; }
.avatar:nth-child(4) { background: #fef3c7; color: #92400e; }

.trust-text {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
}

/* Right Side - Browser Mockup */
.hero-dashboard-container {
  width: 100%;
  position: relative;
}

.dashboard-browser-frame {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.browser-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
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

.browser-address {
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 11px;
  color: #64748b;
  padding: 2px 24px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.browser-content {
  display: flex;
  height: 380px;
  background: #ffffff;
}

/* Sidebar */
.crm-sidebar {
  width: 130px;
  border-right: 1px solid #f1f5f9;
  background: #f8fafc;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.crm-logo {
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
  padding-left: 8px;
}

.crm-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.nav-item.active {
  background: #e2e8f0;
  color: #0f172a;
}

/* Main Content Workspace */
.crm-main {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.crm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.crm-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.crm-add-btn {
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}

/* Board */
.pipeline-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  height: 100%;
}

.pipeline-column {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}

.column-count {
  background: #e2e8f0;
  color: #475569;
  border-radius: 99px;
  padding: 1px 6px;
  font-size: 10px;
}

.column-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.deal-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.deal-card.highlight-card {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.04);
}

.deal-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.deal-value {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.deal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}

.deal-tag {
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-blue { background: #dbeafe; color: #1e40af; }
.tag-purple { background: #f3e8ff; color: #6b21a8; }
.tag-orange { background: #ffedd5; color: #9a3412; }
.tag-green { background: #dcfce7; color: #166534; }

.deal-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e2e8f0;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .hero {
    padding: 80px 0;
  }
  .hero-copy h1 {
    font-size: 42px;
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
  .hero-signup-container {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-trust {
    justify-content: center;
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
    border-bottom: 1px solid #f1f5f9;
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .crm-nav {
    flex-direction: row;
    gap: 8px;
  }
  .pipeline-board {
    grid-template-columns: 1fr;
    height: auto;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 60px 0;
  }
  .hero-copy h1 {
    font-size: 32px;
  }
  .hero-signup-form {
    flex-direction: column;
    padding: 8px;
    gap: 8px;
  }
  .hero-email-input {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px;
  }
  .hero-submit-btn {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
  .hero-dashboard-container {
    max-width: 100%;
    margin: 0 auto;
  }
}
`}</style>
    <section className="hero" id="home">
      {/* Responsive Unified Hero Layout */}
      <div className="container hero-content">
        <div className="hero-copy">
          <div className="hero-badge">
            <span>Built for growing sales teams</span>
          </div>

          <h1>
            The simple CRM sales teams actually love using.
          </h1>

          <p className="hero-description">
            CRM Platform keeps your pipeline organized, automates repetitive follow-ups, and helps you close deals without the bloated enterprise complexity.
          </p>

          <div className="hero-signup-container">
            <form className="hero-signup-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your work email" 
                required 
                className="hero-email-input" 
              />
              <button type="submit" className="primary-btn hero-submit-btn" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
                Start Free Trial
                <ArrowRight size={16} />
              </button>
            </form>
            <p className="hero-form-hint">No credit card required. 14-day trial.</p>
          </div>

          {/* Social Proof */}
          <div className="hero-trust">
            <div className="avatar-group">
              <div className="avatar">JD</div>
              <div className="avatar">AS</div>
              <div className="avatar">MK</div>
              <div className="avatar">EL</div>
            </div>
            <span className="trust-text">Loved by 10,000+ reps at startups and scale-ups</span>
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
              <div className="browser-address">app.crmplatform.com</div>
            </div>
            
            <div className="browser-content">
              {/* Mock CRM Sidebar */}
              <aside className="crm-sidebar">
                <div className="crm-logo">CRM</div>
                <nav className="crm-nav">
                  <span className="nav-item active">Pipeline</span>
                  <span className="nav-item">Contacts</span>
                  <span className="nav-item">Deals</span>
                  <span className="nav-item">Reports</span>
                </nav>
              </aside>

              {/* Mock CRM Main Workspace */}
              <main className="crm-main">
                <div className="crm-header">
                  <h3 className="crm-title">Sales Pipeline</h3>
                  <button className="crm-add-btn">+ Add Deal</button>
                </div>
                
                <div className="pipeline-board">
                  {/* Stage 1: Leads */}
                  <div className="pipeline-column">
                    <div className="column-header">
                      <span>Leads</span>
                      <span className="column-count">2</span>
                    </div>
                    <div className="column-cards">
                      <div className="deal-card">
                        <div className="deal-title">Acme Corp</div>
                        <div className="deal-value">$12,000</div>
                        <div className="deal-footer">
                          <span className="deal-tag tag-blue">Inbound</span>
                          <span className="deal-avatar">JD</span>
                        </div>
                      </div>
                      <div className="deal-card">
                        <div className="deal-title">Globex Ltd</div>
                        <div className="deal-value">$8,500</div>
                        <div className="deal-footer">
                          <span className="deal-tag tag-purple">Referral</span>
                          <span className="deal-avatar">AS</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2: Contacted */}
                  <div className="pipeline-column">
                    <div className="column-header">
                      <span>Contacted</span>
                      <span className="column-count">1</span>
                    </div>
                    <div className="column-cards">
                      <div className="deal-card">
                        <div className="deal-title">Stark Industries</div>
                        <div className="deal-value">$45,000</div>
                        <div className="deal-footer">
                          <span className="deal-tag tag-orange">Demo Scheduled</span>
                          <span className="deal-avatar">MK</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stage 3: Proposal */}
                  <div className="pipeline-column">
                    <div className="column-header">
                      <span>Proposal</span>
                      <span className="column-count">1</span>
                    </div>
                    <div className="column-cards">
                      <div className="deal-card highlight-card">
                        <div className="deal-title">Wayne Enterprises</div>
                        <div className="deal-value">$28,000</div>
                        <div className="deal-footer">
                          <span className="deal-tag tag-green">Under Review</span>
                          <span className="deal-avatar">EL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  
      </>);
};

export default Hero;