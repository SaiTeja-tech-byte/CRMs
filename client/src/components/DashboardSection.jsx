import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Activity, 
  ChevronRight, 
  Search,
  Plus,
  Play
} from "lucide-react";

const initialDeals = [
  { id: 1, name: "Acme Corp Expansion", value: "₹4,50,000", stage: "lead", owner: "Rajesh K.", tag: "AI Score: 98", level: "hot" },
  { id: 2, name: "Hindustan Retail Group", value: "₹12,00,000", stage: "contacted", owner: "Priya S.", tag: "AI Score: 92", level: "hot" },
  { id: 3, name: "TechNova Solutions", value: "₹6,80,000", stage: "proposal", owner: "Amit S.", tag: "AI Score: 89", level: "warm" },
  { id: 4, name: "Tata Steel Pilot", value: "₹3,50,000", stage: "lead", owner: "Ananya R.", tag: "AI Score: 84", level: "warm" },
  { id: 5, name: "Zylker API Integration", value: "₹8,90,000", stage: "proposal", owner: "Rajesh K.", tag: "AI Score: 95", level: "hot" },
  { id: 6, name: "Infinity Labs SaaS", value: "₹15,00,000", stage: "contract", owner: "Priya S.", tag: "AI Score: 99", level: "hot" }
];

const DashboardSection = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [deals, setDeals] = useState(initialDeals);
  const [appliedRecommendations, setAppliedRecommendations] = useState([]);
  
  const handleMoveDeal = (dealId) => {
    setDeals(prevDeals => prevDeals.map(d => {
      if (d.id === dealId) {
        let nextStage = "lead";
        if (d.stage === "lead") nextStage = "contacted";
        else if (d.stage === "contacted") nextStage = "proposal";
        else if (d.stage === "proposal") nextStage = "contract";
        else if (d.stage === "contract") nextStage = "lead";
        return { ...d, stage: nextStage };
      }
      return d;
    }));
  };

  const handleApplyRec = (recId) => {
    if (appliedRecommendations.includes(recId)) return;
    setAppliedRecommendations(prev => [...prev, recId]);
  };

  return (
    <>
      <style>{`/* Premium Interactive CRM Dashboard Section - SalesNova CRM */
.dashboard-section {
  padding: 100px 0;
  background: radial-gradient(120% 120% at 50% 100%, #f1f5f9 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
}

.dashboard-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.dashboard-header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 48px auto;
}

.dashboard-badge {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 16px;
  align-items: center;
  gap: 6px;
}

.dashboard-header h2 {
  font-size: clamp(28px, 4.5vw, 38px);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 14px;
}

.dashboard-header p {
  color: #64748b;
  font-size: 17px;
  line-height: 1.6;
}

/* Tabs Navigation */
.dashboard-tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 36px;
}

.dashboard-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
}

.dashboard-tab-btn:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.dashboard-tab-btn.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
  box-shadow: 0 10px 20px -8px rgba(15, 23, 42, 0.2);
}

/* Glass Dashboard Mockup Window */
.dashboard-mock-window {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 30px 60px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.01);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 520px;
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Mock Header */
.mock-window-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.window-dots {
  display: flex;
  gap: 6px;
}

.window-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
}

.window-dot.red { background: #ef4444; }
.window-dot.yellow { background: #f59e0b; }
.window-dot.green { background: #10b981; }

.mock-window-search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  width: 240px;
  color: #94a3b8;
  font-size: 13px;
}

.mock-window-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mock Workspace Content */
.mock-workspace-content {
  padding: 24px;
  flex: 1;
  background: #fafafb;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* --- Tab 1: Overview Grid --- */
.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.01);
  position: relative;
  overflow: hidden;
  transition: transform 300ms ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
}

.stat-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card h3 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
}

.stat-trend.up { color: #10b981; }
.stat-trend.down { color: #ef4444; }

/* Grid containing Chart and Activity Log */
.overview-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card, .activity-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.01);
}

.card-title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-title-box h4 {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* SVG Line Chart Style */
.svg-chart-container {
  width: 100%;
  height: 180px;
  position: relative;
}

.chart-axis-labels {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px dashed #f1f5f9;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

/* Activity Feed */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.4;
  padding-bottom: 10px;
  border-bottom: 1px solid #f8fafc;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0f2fe;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-badge.ai {
  background: #f3e8ff;
  color: #9333ea;
}

.activity-badge.deal {
  background: #ecfdf5;
  color: #059669;
}

.activity-body {
  color: #475569;
}

.activity-body strong {
  color: #0f172a;
}

.activity-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

/* --- Tab 2: AI Lead Recommendation list --- */
.ai-recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rec-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.01);
  transition: all 300ms ease;
  position: relative;
  overflow: hidden;
}

.rec-card:hover {
  border-color: #c084fc;
  box-shadow: 0 10px 20px rgba(147, 51, 234, 0.04);
}

.rec-score-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: conic-gradient(#a855f7 calc(var(--score) * 1%), #f3e8ff 0);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.rec-score-ring::after {
  content: "";
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
}

.rec-score-value {
  position: relative;
  z-index: 2;
  font-size: 14px;
  font-weight: 800;
  color: #7e22ce;
}

.rec-details h4 {
  font-size: 15px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rec-badge-hot {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #fdf2f8;
  color: #db2777;
  border: 1px solid #fbcfe8;
}

.rec-details p {
  margin: 0;
  font-size: 13px;
  color: #475569;
}

.rec-insight {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #9333ea;
  font-weight: 600;
  font-size: 12px;
  margin-top: 6px;
}

.rec-actions {
  display: flex;
  gap: 10px;
}

.btn-rec-action {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 200ms ease;
  border: none;
}

.btn-rec-action.primary {
  background: #9333ea;
  color: #ffffff;
}

.btn-rec-action.primary:hover {
  background: #7e22ce;
}

.btn-rec-action.applied {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  cursor: default;
}

@media (max-width: 768px) {
  .rec-card {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
    padding: 20px;
  }
  .rec-actions {
    width: 100%;
    justify-content: center;
  }
}

/* --- Tab 3: Sales Pipeline Kanban Board --- */
.pipeline-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  height: 380px;
  overflow-y: auto;
}

@media (max-width: 900px) {
  .pipeline-board {
    grid-template-columns: repeat(2, 1fr);
    height: auto;
  }
}

@media (max-width: 500px) {
  .pipeline-board {
    grid-template-columns: 1fr;
  }
}

.pipeline-col {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100px;
}

.pipeline-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 750;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 6px;
}

.col-count-pill {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}

.deal-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
  cursor: pointer;
  transition: all 200ms ease;
  position: relative;
  overflow: hidden;
}

.deal-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.04);
}

.deal-card h5 {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.deal-value {
  font-size: 14px;
  font-weight: 800;
  color: #2563eb;
}

.deal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.deal-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: #f3e8ff;
  color: #7e22ce;
  font-weight: 700;
}

.click-to-move-hint {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
  transform: scaleX(0);
  transition: transform 200ms ease;
}

.deal-card:hover .click-to-move-hint {
  transform: scaleX(1);
}

.pipeline-board-tip {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-top: 10px;
  font-weight: 600;
}

/* Animations */
@keyframes drawPath {
  to {
    stroke-dashoffset: 0;
  }
}

.chart-line {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawPath 2s ease forwards;
}

.pulse-glow {
  animation: pulseLight 2s infinite alternate;
}

@keyframes pulseLight {
  0% { box-shadow: 0 0 0 rgba(147, 51, 234, 0.1); }
  100% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.2); }
}
`}</style>
      <section className="dashboard-section" id="dashboard">
        <div className="dashboard-inner">
          
          <div className="dashboard-header animate-fade-up">
            <span className="dashboard-badge">
              <Sparkles size={14} /> CRM Dashboard Preview
            </span>
            <h2>Smarter pipeline metrics. In real time.</h2>
            <p>
              Experience a unified view of your leads, custom scoring models, and deals pipeline. 
              Click the tabs below to explore our premium dashboard functions.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="dashboard-tabs animate-fade-up" style={{ animationDelay: "100ms" }}>
            <button 
              className={`dashboard-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <Activity size={16} /> Overview
            </button>
            <button 
              className={`dashboard-tab-btn ${activeTab === "ai" ? "active" : ""}`}
              onClick={() => setActiveTab("ai")}
            >
              <Sparkles size={16} /> AI Recommendations
            </button>
            <button 
              className={`dashboard-tab-btn ${activeTab === "pipeline" ? "active" : ""}`}
              onClick={() => setActiveTab("pipeline")}
            >
              <TrendingUp size={16} /> Sales Pipeline
            </button>
          </div>

          {/* Mock Dashboard Window */}
          <div className="dashboard-mock-window animate-fade-up" style={{ animationDelay: "200ms" }}>
            
            {/* Window header */}
            <div className="mock-window-header">
              <div className="window-dots">
                <span className="window-dot red"></span>
                <span className="window-dot yellow"></span>
                <span className="window-dot green"></span>
              </div>
              <div className="mock-window-search">
                <Search size={14} /> Search customers, leads...
              </div>
              <div className="mock-window-profile">
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569" }}>SalesNova Cloud</span>
                <div className="profile-avatar">S</div>
              </div>
            </div>

            {/* Window body */}
            <div className="mock-workspace-content">
              
              {/* --- VIEW 1: OVERVIEW --- */}
              {activeTab === "overview" && (
                <>
                  <div className="overview-stats">
                    <div className="stat-card">
                      <div className="stat-card-head">
                        <span>MONTHLY RECURRING REVENUE</span>
                        <span className="stat-icon-box"><DollarSign size={14} /></span>
                      </div>
                      <h3>₹12,45,000</h3>
                      <div className="stat-trend up">
                        <ArrowUpRight size={14} /> +12.4% <span style={{ color: "#94a3b8", fontWeight: "500" }}>vs last month</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-head">
                        <span>DEAL WIN RATE</span>
                        <span className="stat-icon-box"><TrendingUp size={14} /></span>
                      </div>
                      <h3>68.2%</h3>
                      <div className="stat-trend up">
                        <ArrowUpRight size={14} /> +3.1% <span style={{ color: "#94a3b8", fontWeight: "500" }}>vs last week</span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-card-head">
                        <span>ACTIVE CLIENT DEALS</span>
                        <span className="stat-icon-box"><Users size={14} /></span>
                      </div>
                      <h3>42 Deals</h3>
                      <div className="stat-trend up">
                        <ArrowUpRight size={14} /> +6 <span style={{ color: "#94a3b8", fontWeight: "500" }}>this week</span>
                      </div>
                    </div>
                  </div>

                  <div className="overview-grid">
                    {/* SVG Interactive Line Chart */}
                    <div className="chart-card">
                      <div className="card-title-box">
                        <h4><TrendingUp size={16} style={{ color: "#2563eb" }} /> Revenue Metrics (Q1-Q2)</h4>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#10b981", background: "#ecfdf5", padding: "2px 8px", borderRadius: "4px" }}>+ ₹2.4L Forecast</span>
                      </div>
                      <div className="svg-chart-container">
                        <svg viewBox="0 0 400 150" width="100%" height="150" style={{ overflow: "visible" }}>
                          <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="25" x2="400" y2="25" stroke="#f1f5f9" strokeDasharray="3" />
                          <line x1="0" y1="75" x2="400" y2="75" stroke="#f1f5f9" strokeDasharray="3" />
                          <line x1="0" y1="125" x2="400" y2="125" stroke="#f1f5f9" strokeDasharray="3" />
                          
                          {/* Fill Gradient path */}
                          <path d="M 0 120 L 80 100 L 160 110 L 240 60 L 320 40 L 400 20 L 400 150 L 0 150 Z" fill="url(#chartGradient)" />
                          
                          {/* Main Line path */}
                          <path 
                            className="chart-line"
                            d="M 0 120 L 80 100 L 160 110 L 240 60 L 320 40 L 400 20" 
                            fill="none" 
                            stroke="#2563eb" 
                            strokeWidth="3.5" 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          
                          {/* Points */}
                          <circle cx="80" cy="100" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="160" cy="110" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="240" cy="60" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="320" cy="40" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          <circle cx="400" cy="20" r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                        </svg>
                        <div className="chart-axis-labels">
                          <span>Jan</span>
                          <span>Feb</span>
                          <span>Mar</span>
                          <span>Apr</span>
                          <span>May</span>
                          <span>Jun</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="activity-card">
                      <div className="card-title-box">
                        <h4><Activity size={16} style={{ color: "#475569" }} /> Pipeline Activity</h4>
                      </div>
                      <div className="activity-list">
                        <div className="activity-item">
                          <span className="activity-badge ai"><Sparkles size={12} /></span>
                          <div className="activity-body">
                            AI scored lead <strong>Rajesh Kumar</strong> as <strong>High Intent (98%)</strong>
                            <div className="activity-time">5 mins ago</div>
                          </div>
                        </div>

                        <div className="activity-item">
                          <span className="activity-badge deal"><TrendingUp size={12} /></span>
                          <div className="activity-body">
                            Deal <strong>Tata Steel Pilot</strong> moved to <strong>Proposal</strong> stage
                            <div className="activity-time">2 hours ago</div>
                          </div>
                        </div>

                        <div className="activity-item">
                          <span className="activity-badge"><UserCheck size={12} /></span>
                          <div className="activity-body">
                            Assigned new lead <strong>Zylker Labs</strong> to <strong>Priya Sharma</strong>
                            <div className="activity-time">Yesterday</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* --- VIEW 2: AI RECOMMENDATIONS --- */}
              {activeTab === "ai" && (
                <div className="ai-recommendations-list">
                  <div className="rec-card" style={{"--score": 98}}>
                    <div className="rec-score-ring">
                      <span className="rec-score-value">98</span>
                    </div>
                    <div className="rec-details">
                      <h4>Rajesh Kumar <span className="rec-badge-hot">Hot Lead</span></h4>
                      <p>Visited your enterprise pricing model 3 times in the last 2 hours. Downloaded API integration docs.</p>
                      <span className="rec-insight">
                        <Sparkles size={12} /> AI Recommendation: Trigger discount call & assign dedicated manager.
                      </span>
                    </div>
                    <div className="rec-actions">
                      {appliedRecommendations.includes(1) ? (
                        <span className="btn-rec-action applied">✓ Task Automated</span>
                      ) : (
                        <button className="btn-rec-action primary pulse-glow" onClick={() => handleApplyRec(1)}>
                          Auto-assign & Email
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rec-card" style={{"--score": 92}}>
                    <div className="rec-score-ring">
                      <span className="rec-score-value">92</span>
                    </div>
                    <div className="rec-details">
                      <h4>Priya Sharma <span className="rec-badge-hot">Hot Lead</span></h4>
                      <p>Opened the setup email sequence and requested contact details. Highly engaged in healthcare sector.</p>
                      <span className="rec-insight">
                        <Sparkles size={12} /> AI Recommendation: Suggest calendar slot for live product demo.
                      </span>
                    </div>
                    <div className="rec-actions">
                      {appliedRecommendations.includes(2) ? (
                        <span className="btn-rec-action applied">✓ Demo Scheduled</span>
                      ) : (
                        <button className="btn-rec-action primary" onClick={() => handleApplyRec(2)}>
                          Send Demo Invite
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="rec-card" style={{"--score": 85}}>
                    <div className="rec-score-ring">
                      <span className="rec-score-value">85</span>
                    </div>
                    <div className="rec-details">
                      <h4>Amit Singh <span className="rec-badge-hot" style={{ background: "#fffbeb", color: "#b45309", borderColor: "#fde68a" }}>Warm Lead</span></h4>
                      <p>Signed up for free trial but hasn't configured standard dashboard integrations. Inactive for 3 days.</p>
                      <span className="rec-insight">
                        <Sparkles size={12} /> AI Recommendation: Trigger automated onboarding tutorial email.
                      </span>
                    </div>
                    <div className="rec-actions">
                      {appliedRecommendations.includes(3) ? (
                        <span className="btn-rec-action applied">✓ Onboarding Sent</span>
                      ) : (
                        <button className="btn-rec-action primary" onClick={() => handleApplyRec(3)}>
                          Send Tutorial
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* --- VIEW 3: SALES PIPELINE --- */}
              {activeTab === "pipeline" && (
                <>
                  <div className="pipeline-board">
                    {/* Stage 1: Lead */}
                    <div className="pipeline-col">
                      <div className="pipeline-col-header">
                        <span>Lead In</span>
                        <span className="col-count-pill">
                          {deals.filter(d => d.stage === "lead").length}
                        </span>
                      </div>
                      {deals.filter(d => d.stage === "lead").map(d => (
                        <div key={d.id} className="deal-card" onClick={() => handleMoveDeal(d.id)}>
                          <h5>{d.name}</h5>
                          <div className="deal-value">{d.value}</div>
                          <div className="deal-footer">
                            <span>{d.owner}</span>
                            <span className="deal-tag">{d.tag}</span>
                          </div>
                          <span className="click-to-move-hint"></span>
                        </div>
                      ))}
                    </div>

                    {/* Stage 2: Contacted */}
                    <div className="pipeline-col">
                      <div className="pipeline-col-header">
                        <span>Contacted</span>
                        <span className="col-count-pill">
                          {deals.filter(d => d.stage === "contacted").length}
                        </span>
                      </div>
                      {deals.filter(d => d.stage === "contacted").map(d => (
                        <div key={d.id} className="deal-card" onClick={() => handleMoveDeal(d.id)}>
                          <h5>{d.name}</h5>
                          <div className="deal-value">{d.value}</div>
                          <div className="deal-footer">
                            <span>{d.owner}</span>
                            <span className="deal-tag">{d.tag}</span>
                          </div>
                          <span className="click-to-move-hint"></span>
                        </div>
                      ))}
                    </div>

                    {/* Stage 3: Proposal Shared */}
                    <div className="pipeline-col">
                      <div className="pipeline-col-header">
                        <span>Proposal</span>
                        <span className="col-count-pill">
                          {deals.filter(d => d.stage === "proposal").length}
                        </span>
                      </div>
                      {deals.filter(d => d.stage === "proposal").map(d => (
                        <div key={d.id} className="deal-card" onClick={() => handleMoveDeal(d.id)}>
                          <h5>{d.name}</h5>
                          <div className="deal-value">{d.value}</div>
                          <div className="deal-footer">
                            <span>{d.owner}</span>
                            <span className="deal-tag">{d.tag}</span>
                          </div>
                          <span className="click-to-move-hint"></span>
                        </div>
                      ))}
                    </div>

                    {/* Stage 4: Contract Pending */}
                    <div className="pipeline-col">
                      <div className="pipeline-col-header">
                        <span>Contract</span>
                        <span className="col-count-pill">
                          {deals.filter(d => d.stage === "contract").length}
                        </span>
                      </div>
                      {deals.filter(d => d.stage === "contract").map(d => (
                        <div key={d.id} className="deal-card" onClick={() => handleMoveDeal(d.id)}>
                          <h5>{d.name}</h5>
                          <div className="deal-value">{d.value}</div>
                          <div className="deal-footer">
                            <span>{d.owner}</span>
                            <span className="deal-tag">{d.tag}</span>
                          </div>
                          <span className="click-to-move-hint"></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pipeline-board-tip">
                    💡 <strong>Tip:</strong> Click any deal card to progress it to the next pipeline stage dynamically!
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default DashboardSection;
