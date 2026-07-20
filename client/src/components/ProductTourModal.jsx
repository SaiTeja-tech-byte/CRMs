import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Welcome to CRM Platform",
    description: "Take a brief 1-minute walkthrough to see how CRM Platform helps you track contacts, manage sales pipelines, and grow revenue.",
    visual: (
      <div className="tour-visual welcome-visual">
        <div className="mock-app-frame">
          <div className="mock-app-sidebar">
            <div className="welcome-sidebar-logo">CRM</div>
            <div className="mock-item-flat active-item-flat">
              <span className="mock-dot-bullet"></span> Dashboard
            </div>
            <div className="mock-item-flat">Contacts</div>
            <div className="mock-item-flat">Deals</div>
            <div className="mock-item-flat">Reports</div>
          </div>
          <div className="mock-app-body">
            <div className="mock-body-header">
              <span className="mock-title">Active Workspace</span>
              <span className="mock-date-pill">Q3 Forecast</span>
            </div>
            <div className="mock-body-stats">
              <div className="mock-stat">
                <span className="stat-lbl">Revenue</span>
                <span className="stat-num">₹8.4L</span>
              </div>
              <div className="mock-stat">
                <span className="stat-lbl">Deals</span>
                <span className="stat-num">42</span>
              </div>
            </div>
            <div className="mock-body-chart-mini">
              <span className="chart-label-mini">Close Trend</span>
              <div className="mini-chart-sparkline">
                <svg viewBox="0 0 100 25" className="sparkline-svg">
                  <path d="M0,20 Q25,5 50,15 T100,5" fill="none" stroke="#2563eb" strokeWidth="2.5" />
                  <circle cx="100" cy="5" r="3.5" fill="#2563eb" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Unified Sales Dashboard",
    description: "Monitor monthly target progression, closed opportunities, deal win rates, and daily priorities from a single dashboard.",
    visual: (
      <div className="tour-visual dashboard-visual">
        <div className="mock-widget">
          <div className="widget-label-flat">Monthly Revenue</div>
          <div className="widget-value-flat">₹8,42,000</div>
          <div className="widget-badge-flat">+24.5% this month</div>
        </div>
        <div className="mock-widget-row">
          <div className="mock-mini-widget">
            <div className="mini-lbl-flat">Deals Won</div>
            <div className="mini-val-flat font-blue">42</div>
          </div>
          <div className="mock-mini-widget">
            <div className="mini-lbl-flat">Win Rate</div>
            <div className="mini-val-flat font-green">76%</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Deep Customer Profiles",
    description: "Access customer data, view timeline histories, store documents, and track team interactions in one centralized profile.",
    visual: (
      <div className="tour-visual customer-visual">
        <div className="mock-customer-card">
          <div className="customer-meta-row">
            <span className="customer-avatar-flat">RK</span>
            <div>
              <div className="customer-name-flat">Rajesh Kumar</div>
              <div className="customer-sub-flat">Nexus Tech solutions</div>
            </div>
            <span className="customer-status-badge">Warm Lead</span>
          </div>
          <div className="customer-timeline">
            <div className="timeline-node">
              <span className="node-dot"></span>
              <span className="node-text">Scheduled product demo</span>
            </div>
            <div className="timeline-node">
              <span className="node-dot dot-inactive"></span>
              <span className="node-text text-muted">Sent follow-up proposal</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Visual Sales Pipeline",
    description: "Track sales progress visually. Drag and drop deals across custom stages and configure automations for pipeline transitions.",
    visual: (
      <div className="tour-visual pipeline-visual">
        <div className="mock-pipeline-grid">
          <div className="pipeline-col-flat">
            <div className="col-header-flat">Leads</div>
            <div className="deal-item-flat">Acme Corp <span className="deal-val-flat">₹12K</span></div>
          </div>
          <div className="pipeline-col-flat active-col-flat">
            <div className="col-header-flat">Contacted</div>
            <div className="deal-item-flat deal-highlight">Globex Ltd <span className="deal-val-flat">₹8.5K</span></div>
          </div>
          <div className="pipeline-col-flat">
            <div className="col-header-flat">Proposal</div>
            <div className="deal-item-flat">Stark Inc <span className="deal-val-flat">₹45K</span></div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "AI-Powered Sales Assistant",
    description: "Save time by letting our integrated assistant draft contextual emails, summarize meeting threads, and score leads automatically.",
    visual: (
      <div className="tour-visual ai-visual">
        <div className="mock-ai-panel">
          <div className="ai-hdr">
            <span className="ai-icon-dot"></span>
            <span>AI Email Assistant</span>
          </div>
          <div className="ai-prompt-box">
            Draft follow-up email to Nexus Tech solutions...
          </div>
          <div className="ai-response-box">
            <strong>Subject:</strong> Follow-up proposal - Nexus Tech<br/>
            Hi Rajesh, following up on our demonstration yesterday...
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Sales Intelligence & Reports",
    description: "Analyze close ratios, identify pipeline logjams, forecast monthly revenue targets, and export reports with one click.",
    visual: (
      <div className="tour-visual report-visual">
        <div className="mock-chart-card">
          <div className="chart-hdr-flat">Quarterly Performance</div>
          <div className="mock-chart-bars">
            <div className="chart-bar bar-q1" style={{ height: "45%" }}></div>
            <div className="chart-bar bar-q2" style={{ height: "65%" }}></div>
            <div className="chart-bar bar-q3" style={{ height: "80%" }}></div>
            <div className="chart-bar bar-q4" style={{ height: "100%" }}></div>
          </div>
          <div className="chart-lbls-flat">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "You're Ready to Start",
    description: "Join 10,000+ growing teams scaling customer relationships, saving time, and closing opportunities using CRM Platform.",
    visual: (
      <div className="tour-visual final-visual">
        <div className="final-check">✓</div>
        <div className="final-tag">No credit card required. 14-day trial.</div>
      </div>
    ),
  },
];

const ProductTourModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleOpenTour = () => {
      setIsOpen(true);
      setCurrentSlide(0);
    };
    window.addEventListener("open-product-tour", handleOpenTour);
    return () => {
      window.removeEventListener("open-product-tour", handleOpenTour);
    };
  }, []);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      handleCloseAndSignup();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCloseAndSignup = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const current = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <>
      <style>{`.tour-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  animation: fadeIn 150ms ease-out;
}

.tour-modal {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  width: 90%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: scaleIn 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.tour-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms ease;
  z-index: 10;
}

.tour-close-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.tour-body {
  padding: 40px 40px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.tour-body h3 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.tour-body p {
  font-size: 14px;
  line-height: 1.55;
  color: #475569;
  max-width: 420px;
  margin: 0 0 8px 0;
}

/* Visual Panel Styles */
.tour-visual-wrapper {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.tour-visual {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Welcome Visual */
.mock-app-frame {
  width: 280px;
  height: 140px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  display: flex;
  overflow: hidden;
}

.mock-app-sidebar {
  width: 80px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.welcome-sidebar-logo {
  font-size: 9px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  letter-spacing: 0.05em;
  padding-left: 4px;
}

.mock-item-flat {
  font-size: 7.5px;
  font-weight: 600;
  color: #64748b;
  padding: 4px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.mock-item-flat.active-item-flat {
  background: #cbd5e1;
  color: #0f172a;
  font-weight: 700;
}

.mock-dot-bullet {
  width: 3.5px;
  height: 3.5px;
  background: #2563eb;
  border-radius: 50%;
}

.mock-app-body {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.mock-body-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.mock-title {
  font-size: 8px;
  font-weight: 700;
  color: #0f172a;
}

.mock-date-pill {
  font-size: 7px;
  background: #f1f5f9;
  color: #475569;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.mock-body-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 100%;
}

.mock-stat {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 5px;
  padding: 4px 6px;
}

.stat-lbl {
  display: block;
  font-size: 5.5px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-num {
  font-size: 10px;
  font-weight: 800;
  color: #0f172a;
}

.mock-body-chart-mini {
  flex: 1;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  padding: 5px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.chart-label-mini {
  font-size: 5.5px;
  color: #64748b;
  font-weight: 600;
}

.mini-chart-sparkline {
  height: 20px;
  display: flex;
  align-items: center;
  width: 100%;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Dashboard Visual */
.dashboard-visual {
  flex-direction: column;
  gap: 8px;
}

.mock-widget {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  width: 100%;
  max-width: 280px;
  text-align: left;
}

.widget-label-flat {
  font-size: 8px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.widget-value-flat {
  font-size: 16px;
  font-weight: 850;
  color: #0f172a;
  margin: 2px 0;
}

.widget-badge-flat {
  font-size: 9px;
  color: #10b981;
  font-weight: 600;
}

.mock-widget-row {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 280px;
}

.mock-mini-widget {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  text-align: left;
}

.mini-lbl-flat {
  font-size: 8px;
  color: #64748b;
  font-weight: 500;
}

.mini-val-flat {
  font-size: 13px;
  font-weight: 700;
}

.mini-val-flat.font-blue { color: #2563eb; }
.mini-val-flat.font-green { color: #10b981; }

/* Customer Profile Visual */
.mock-customer-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  width: 100%;
  max-width: 300px;
  text-align: left;
}

.customer-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.customer-avatar-flat {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-name-flat {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}

.customer-sub-flat {
  font-size: 9px;
  color: #64748b;
}

.customer-status-badge {
  margin-left: auto;
  font-size: 8px;
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.customer-timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding-top: 8px;
}

.timeline-node {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2563eb;
}

.node-dot.dot-inactive {
  background: #cbd5e1;
}

.node-text {
  font-size: 10px;
  color: #334155;
}

.node-text.text-muted {
  color: #64748b;
}

/* Pipeline Visual */
.mock-pipeline-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 320px;
}

.pipeline-col-flat {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pipeline-col-flat.active-col-flat {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.col-header-flat {
  font-size: 8px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
}

.deal-item-flat {
  font-size: 9px;
  font-weight: 600;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 6px;
  color: #0f172a;
}

.deal-item-flat.deal-highlight {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.02);
}

.deal-val-flat {
  display: block;
  font-size: 8px;
  color: #64748b;
  margin-top: 2px;
}

/* AI Visual */
.mock-ai-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ai-hdr {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  font-weight: 700;
  color: #0f172a;
}

.ai-icon-dot {
  width: 6px;
  height: 6px;
  background: #2563eb;
  border-radius: 50%;
}

.ai-prompt-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  font-size: 9px;
  color: #475569;
  text-align: left;
}

.ai-response-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 3px solid #10b981;
  border-radius: 6px;
  padding: 8px;
  font-size: 9px;
  color: #14532d;
  text-align: left;
  line-height: 1.4;
}

/* Report Chart Visual */
.mock-chart-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
}

.chart-hdr-flat {
  font-size: 9px;
  font-weight: 700;
  color: #475569;
  text-align: left;
  margin-bottom: 12px;
}

.mock-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 60px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 4px;
}

.chart-bar {
  width: 16px;
  border-radius: 3px 3px 0 0;
  background: #cbd5e1;
}

.chart-bar.bar-q1 { background: #cbd5e1; }
.chart-bar.bar-q2 { background: #94a3b8; }
.chart-bar.bar-q3 { background: #64748b; }
.chart-bar.bar-q4 { background: #2563eb; }

.chart-lbls-flat {
  display: flex;
  justify-content: space-around;
  margin-top: 4px;
}

.chart-lbls-flat span {
  font-size: 8px;
  color: #94a3b8;
  font-weight: 600;
}

/* Final Visual */
.final-check {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 1.5px solid #10b981;
  color: #10b981;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.final-tag {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

/* Footer Control Row */
.tour-footer {
  padding: 20px 40px 30px 40px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tour-indicators {
  display: flex;
  gap: 6px;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
  transition: all 200ms ease;
}

.indicator.active {
  background: #0f172a;
  width: 16px;
  border-radius: 99px;
}

.tour-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tour-btn {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 150ms ease;
  border: 1px solid transparent;
  outline: none;
}

.tour-btn-prev {
  background: transparent;
  color: #475569;
  border-color: #e2e8f0;
}

.tour-btn-prev:hover {
  background: #f8fafc;
  color: #0f172a;
}

.tour-btn-next {
  background: #0f172a;
  color: #ffffff;
}

.tour-btn-next:hover {
  background: #1e293b;
}

.tour-btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.tour-btn-primary:hover {
  background: #1d4ed8;
}

.tour-btn-skip {
  background: transparent;
  color: #94a3b8;
  padding: 8px 0;
  border: none;
  font-weight: 600;
}

.tour-btn-skip:hover {
  color: #475569;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.97); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
`}</style>
      <div className="tour-overlay" onClick={handleClose}>
        <div className="tour-modal" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="tour-close-btn" onClick={handleClose} aria-label="Close tour">
            <X size={16} />
          </button>

          {/* Slide Content */}
          <div className="tour-body">
            <h3>{current.title}</h3>
            <p>{current.description}</p>
            <div className="tour-visual-wrapper">
              {current.visual}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="tour-footer">
            {/* Skip Option */}
            {!isLastSlide ? (
              <button className="tour-btn tour-btn-skip" onClick={handleClose}>
                Skip Tour
              </button>
            ) : (
              <div style={{ width: "68px" }}></div>
            )}

            {/* Slide Progress Indicators */}
            <div className="tour-indicators">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`indicator ${idx === currentSlide ? "active" : ""}`}
                ></span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="tour-actions">
              {currentSlide > 0 && (
                <button className="tour-btn tour-btn-prev" onClick={handlePrev}>
                  <ArrowLeft size={14} /> Prev
                </button>
              )}

              {isLastSlide ? (
                <button className="tour-btn tour-btn-primary" onClick={handleCloseAndSignup}>
                  Start Free Trial
                </button>
              ) : (
                <button className="tour-btn tour-btn-next" onClick={handleNext}>
                  Next <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductTourModal;
