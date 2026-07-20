import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, ChevronDown, Globe, Info, Mail, MapPin, Phone, ShieldCheck, Sliders } from "lucide-react";

const thirdParties = [
  { name: "Google Analytics", desc: "Used to collect anonymous user behavior analytics and feature engagement trends.", type: "Analytics" },
  { name: "Stripe", desc: "Processes subscription purchases and verifies compliance secure payments.", type: "Essential / Payments" },
  { name: "Microsoft Clarity", desc: "Helps analyze visual navigation heatmaps and debugging error logs.", type: "Performance" },
  { name: "Slack Integration", desc: "Coordinates live workspace communication alerts and real-time support channels.", type: "Functional" },
  { name: "GitHub OAuth", desc: "Supports single sign-on developer login verification steps securely.", type: "Essential / OAuth" }
];

const benefits = [
  { title: "Improved Security", desc: "Protect user sessions, enforce token-based encryption, and detect brute force actions.", icon: "bi-lock" },
  { title: "Better Performance", desc: "Load assets from cloud edge CDNs faster using cache state memories.", icon: "bi-activity" },
  { title: "Personalized Experience", desc: "Remember chosen themes, language settings, and customized database drawers.", icon: "bi-gear" },
  { title: "Analytics Insights", desc: "Help engineers improve platform features using anonymous click streams.", icon: "bi-graph-up-arrow" }
];

const faqs = [
  {
    q: "What are cookies?",
    a: "Cookies are small text files containing alphanumeric strings that websites place on your device when you browse. They store session parameters, preferences, and security tokens."
  },
  {
    q: "Why does the CRM Platform use cookies?",
    a: "We utilize them to maintain your authentication state, protect payment operations via Stripe, remember preference states, and run platform analytics."
  },
  {
    q: "Can I disable cookies?",
    a: "Yes. You can deactivate optional categories (Functional, Analytics, Performance, Marketing) via this preference panel or by modifying your browser settings."
  },
  {
    q: "Will disabling cookies affect my experience?",
    a: "Deactivating optional cookies won't break basic access, but it will disable dashboard personalization, theme memory, and feature suggestion components."
  },
  {
    q: "How often can I change my preferences?",
    a: "You can visit this page to update and save your settings at any time. Changes take effect immediately upon saving."
  },
  {
    q: "Are third-party cookies used?",
    a: "Yes. Trusted partners like Stripe (payments) and Google Analytics (usage stats) set cookies. You can manage these settings under the respective categories."
  }
];

const CookiePreferences = () => {
  const [openFaq, setOpenFaq] = useState(null);
  
  // Cookie settings state
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    functional: true,
    analytics: true,
    performance: false,
    marketing: false
  });

  // Success toast state
  const [toast, setToast] = useState({
    show: false,
    message: ""
  });

  const triggerToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  const handleToggle = (category) => {
    if (category === "essential") return; // Essential is read-only
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = () => {
    triggerToast("Your cookie preferences have been saved.");
  };

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      functional: true,
      analytics: true,
      performance: true,
      marketing: true
    });
    triggerToast("All cookies have been accepted.");
  };

  const handleRejectOptional = () => {
    setPreferences({
      essential: true,
      functional: false,
      analytics: false,
      performance: false,
      marketing: false
    });
    triggerToast("Optional cookies have been deactivated.");
  };

  const scrollToCategories = (e) => {
    e.preventDefault();
    const element = document.getElementById("cookie-categories-sec");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
      <>
        <style>{`/* Premium Cookie Preferences Stylesheet - SalesNova CRM */

.cookies-pref-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background Gradients */
.cookies-pref-page::before {
  content: "";
  position: absolute;
  top: 0;
  right: 15%;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(50px);
}

.cookies-pref-page::after {
  content: "";
  position: absolute;
  top: 1000px;
  left: 5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(40px);
}

/* Hero Header */
.cookies-pref-hero {
  padding: 8.5rem 0 5rem;
  background: radial-gradient(110% 110% at 50% 0%, rgba(219, 234, 254, 0.35) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.cookies-pref-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.cookies-pref-hero-content {
  flex: 1.2;
  max-width: 680px;
}

.cookies-pref-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0f7ff;
  border: 1px solid #dbeafe;
  color: #2563eb;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.04);
}

.cookies-pref-hero-content h1 {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.cookies-pref-hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.cookies-pref-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.cookies-pref-hero-actions {
  display: flex;
  gap: 1rem;
}

/* Hero Right Side Art */
.cookies-pref-hero-illustration {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 440px;
}

.cookie-art-wrapper {
  background: #ffffff;
  width: 290px;
  height: 290px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.03);
  position: relative;
  animation: floatCookie 6s ease-in-out infinite;
}

@keyframes floatCookie {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.cookie-art-deco {
  position: absolute;
  width: 330px;
  height: 330px;
  border: 1px dashed rgba(37, 99, 235, 0.15);
  border-radius: 50%;
  animation: rotateCookie 45s linear infinite;
}

@keyframes rotateCookie {
  100% { transform: rotate(360deg); }
}

/* Sections General */
.cookies-pref-section {
  padding: 6rem 0;
  position: relative;
  z-index: 2;
}

.section-container {
  max-width: 1200px;
  width: min(1200px, 90%);
  margin: 0 auto;
}

.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4.5rem;
}

.section-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-header p {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.5;
}

/* Cookie Overview Card */
.overview-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.005);
  margin-bottom: 3.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.overview-icon {
  background: #eff6ff;
  color: #2563eb;
  padding: 1.25rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.overview-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.overview-text p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #475569;
}

/* Action Cards (Accept All, Reject Optional, Customize) */
.actions-list-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 5rem;
}

.action-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.25rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.01);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.15);
}

.action-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.action-card p {
  font-size: 0.925rem;
  line-height: 1.55;
  color: #64748b;
  margin-bottom: 2rem;
}

.action-card .btn-primary, .action-card .btn-secondary {
  width: 100%;
  justify-content: center;
}

/* Categories List */
.categories-list-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.category-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.01);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2.5rem;
  transition: box-shadow 0.3s ease;
}

.category-card:hover {
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.025);
}

.category-card-info {
  flex: 1;
}

.category-card-header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-card-header-row h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
}

.category-enabled-badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  background: #ecfdf5;
  color: #047857;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid #a7f3d0;
}

.category-card-info p {
  font-size: 0.975rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 1.5rem;
}

.category-examples-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-examples-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.category-examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-example-item {
  padding: 0.35rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

/* Success Toast Alert */
.success-toast {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #ffffff;
  border-radius: 16px;
  border-left: 4px solid #10b981;
  padding: 1.25rem 1.75rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: slideInToast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInToast {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.toast-icon {
  background: #d1fae5;
  color: #10b981;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.toast-message {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .actions-list-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 4rem;
  }
}

@media (max-width: 768px) {
  .cookies-pref-hero {
    padding: 6.5rem 0 3.5rem;
  }
  
  .cookies-pref-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .cookies-pref-hero-actions {
    justify-content: center;
  }
  
  .cookies-pref-hero-illustration {
    display: none;
  }
  
  .overview-card {
    flex-direction: column;
    text-align: center;
    padding: 1.75rem;
    gap: 1.25rem;
  }
  
  .category-card {
    flex-direction: column;
    padding: 1.75rem;
    gap: 1.5rem;
  }
  
  .category-card .switch {
    align-self: flex-start;
  }
  
  .success-toast {
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
}
`}</style>
    <div className="cookies-pref-page">
      <Navbar />

      {/* Hero Header */}
      <header className="cookies-pref-hero">
        <div className="container">
          <a href="/legal" className="back-breadcrumb">
            <ArrowLeft size={16} /> Back to Legal Center
          </a>
        </div>
        <div className="container cookies-pref-hero-inner">
          <div className="cookies-pref-hero-content">
            <div className="cookies-pref-badge">
              <Info size={16} />
              <span>Privacy & Cookie Settings</span>
            </div>
            <h1>Cookie Preferences</h1>
            <p className="cookies-pref-hero-subtitle">
              The CRM Platform uses cookies and similar technologies to improve your browsing experience, personalize content, analyze website traffic, and enhance platform performance. You can manage your preferences at any time.
            </p>
            <p className="cookies-pref-meta">
              <strong>Last Updated:</strong> July 2026
            </p>
            <div className="cookies-pref-hero-actions">
              <button onClick={handleSave} className="btn-primary">
                Save Preferences
              </button>
              <button onClick={handleAcceptAll} className="btn-secondary">
                Accept All Cookies
              </button>
            </div>
          </div>
          <div className="cookies-pref-hero-illustration">
            <div className="cookie-art-wrapper">
              <div className="cookie-art-deco"></div>
              <svg viewBox="0 0 100 100" width="130" height="130" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Cookie base outline */}
                <circle cx="50" cy="50" r="40" fill="#fef3c7" stroke="#d97706" strokeWidth="4" />
                <path d="M72 32c-3-2-8 0-9 4-1 3-5 5-8 3-3-2-7 1-6 5s-2 7 2 7 6 0 7-3 5-3 7-1 5 1 7-3c1-3-4-8-10-9z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" opacity="0.3" />
                {/* Chocolate chips */}
                <circle cx="32" cy="38" r="5" fill="#78350f" />
                <circle cx="48" cy="26" r="4.5" fill="#78350f" />
                <circle cx="68" cy="42" r="5.5" fill="#78350f" />
                <circle cx="38" cy="62" r="6" fill="#78350f" />
                <circle cx="58" cy="68" r="5" fill="#78350f" />
                {/* Bite */}
                <path d="M80 50 A 10 10 0 0 0 90 40 A 10 10 0 0 0 80 30" fill="#f8fafc" stroke="#d97706" strokeWidth="4" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toast.show && (
        <div className="success-toast">
          <div className="toast-icon">✓</div>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}

      {/* Cookie Overview */}
      <section className="cookies-pref-section">
        <div className="section-container">
          <div className="overview-card">
            <div className="overview-icon">
              <Sliders size={24} />
            </div>
            <div className="overview-text">
              <h3>Cookie Overview</h3>
              <p>
                Cookies are small text files stored on your device that help us provide a secure, reliable, and personalized experience while using the CRM Platform.
              </p>
            </div>
          </div>

          {/* Action Cards (Accept All, Reject Optional, Customize) */}
          <div className="actions-list-grid">
            <article className="action-card">
              <div>
                <h3>Accept All</h3>
                <p>Enable every optional cookie to enjoy a highly personalized dashboard, active chat alerts, and performance metrics updates.</p>
              </div>
              <button onClick={handleAcceptAll} className="btn-primary">Accept All</button>
            </article>

            <article className="action-card">
              <div>
                <h3>Reject Optional</h3>
                <p>Only keep essential cookies required for platform security, Stripe checkout processing, and user session validation.</p>
              </div>
              <button onClick={handleRejectOptional} className="btn-secondary">Reject Optional</button>
            </article>

            <article className="action-card">
              <div>
                <h3>Customize Settings</h3>
                <p>Individually select and toggle functional, analytics, performance, or marketing cookie permissions to match your preference.</p>
              </div>
              <a href="#cookie-categories-sec" onClick={scrollToCategories} className="btn-secondary">Customize Preferences</a>
            </article>
          </div>
        </div>
      </section>

      {/* Cookie Categories toggles */}
      <section id="cookie-categories-sec" className="cookies-pref-section" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="section-container">
          <div className="section-header">
            <h2>Cookie Categories Settings</h2>
            <p>Customize your privacy profile by enabling or deactivating cookie groupings.</p>
          </div>
          
          <div className="categories-list-grid">
            {/* Essential Card */}
            <article className="category-card">
              <div className="category-card-info">
                <div className="category-card-header-row">
                  <h3>Essential Cookies</h3>
                  <span className="category-enabled-badge">Always Active</span>
                </div>
                <p>Required for authentication, security tokens checks, login sessions verification, and secure payments transactions processing.</p>
                <div className="category-examples-box">
                  <span className="category-examples-title">Examples</span>
                  <div className="category-examples-list">
                    <span className="category-example-item">User Logins</span>
                    <span className="category-example-item">Session Keys</span>
                    <span className="category-example-item">Security Tokens</span>
                    <span className="category-example-item">Stripe Verification</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch toggle-disabled">
                <input type="checkbox" checked={preferences.essential} disabled />
                <span className="slider round"></span>
              </label>
            </article>

            {/* Functional Card */}
            <article className="category-card">
              <div className="category-card-info">
                <div className="category-card-header-row">
                  <h3>Functional Cookies</h3>
                  <span className="category-enabled-badge" style={{ background: preferences.functional ? "#ecfdf5" : "#f1f5f9", color: preferences.functional ? "#047857" : "#475569", borderColor: preferences.functional ? "#a7f3d0" : "#cbd5e1" }}>
                    {preferences.functional ? "Enabled" : "Deactivated"}
                  </span>
                </div>
                <p>Remember your localized preferences, layout structures, user workspace adjustments, and visual custom themes.</p>
                <div className="category-examples-box">
                  <span className="category-examples-title">Examples</span>
                  <div className="category-examples-list">
                    <span className="category-example-item">Language Settings</span>
                    <span className="category-example-item">Dark Mode Memory</span>
                    <span className="category-example-item">Workspace Custom Layout</span>
                    <span className="category-example-item">Time Zone Settings</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch">
                <input type="checkbox" checked={preferences.functional} onChange={() => handleToggle("functional")} />
                <span className="slider round"></span>
              </label>
            </article>

            {/* Analytics Card */}
            <article className="category-card">
              <div className="category-card-info">
                <div className="category-card-header-row">
                  <h3>Analytics Cookies</h3>
                  <span className="category-enabled-badge" style={{ background: preferences.analytics ? "#ecfdf5" : "#f1f5f9", color: preferences.analytics ? "#047857" : "#475569", borderColor: preferences.analytics ? "#a7f3d0" : "#cbd5e1" }}>
                    {preferences.analytics ? "Enabled" : "Deactivated"}
                  </span>
                </div>
                <p>Help us audit platform interface usage by compiling anonymous visitor clicks, feature selections, and user retention charts.</p>
                <div className="category-examples-box">
                  <span className="category-examples-title">Examples</span>
                  <div className="category-examples-list">
                    <span className="category-example-item">Google Analytics</span>
                    <span className="category-example-item">Page View Audits</span>
                    <span className="category-example-item">Feature Click Rates</span>
                    <span className="category-example-item">Session Durations</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch">
                <input type="checkbox" checked={preferences.analytics} onChange={() => handleToggle("analytics")} />
                <span className="slider round"></span>
              </label>
            </article>

            {/* Performance Card */}
            <article className="category-card">
              <div className="category-card-info">
                <div className="category-card-header-row">
                  <h3>Performance Cookies</h3>
                  <span className="category-enabled-badge" style={{ background: preferences.performance ? "#ecfdf5" : "#f1f5f9", color: preferences.performance ? "#047857" : "#475569", borderColor: preferences.performance ? "#a7f3d0" : "#cbd5e1" }}>
                    {preferences.performance ? "Enabled" : "Deactivated"}
                  </span>
                </div>
                <p>Monitor application loading latency levels, script execution bottlenecks, cloud connectivity metrics, and error code trace logs.</p>
                <div className="category-examples-box">
                  <span className="category-examples-title">Examples</span>
                  <div className="category-examples-list">
                    <span className="category-example-item">Asset Loading Speeds</span>
                    <span className="category-example-item">Console Error Logging</span>
                    <span className="category-example-item">CDN Latency Monitors</span>
                    <span className="category-example-item">Resource File Optimization</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch">
                <input type="checkbox" checked={preferences.performance} onChange={() => handleToggle("performance")} />
                <span className="slider round"></span>
              </label>
            </article>

            {/* Marketing Card */}
            <article className="category-card">
              <div className="category-card-info">
                <div className="category-card-header-row">
                  <h3>Marketing Cookies</h3>
                  <span className="category-enabled-badge" style={{ background: preferences.marketing ? "#ecfdf5" : "#f1f5f9", color: preferences.marketing ? "#047857" : "#475569", borderColor: preferences.marketing ? "#a7f3d0" : "#cbd5e1" }}>
                    {preferences.marketing ? "Enabled" : "Deactivated"}
                  </span>
                </div>
                <p>Coordinate customized marketing outreach campaigns, target specific feature ads, and audit campaign conversion efficiency rates.</p>
                <div className="category-examples-box">
                  <span className="category-examples-title">Examples</span>
                  <div className="category-examples-list">
                    <span className="category-example-item">Campaign Tracking</span>
                    <span className="category-example-item">Conversion Statistics</span>
                    <span className="category-example-item">Targeted Feature Promos</span>
                    <span className="category-example-item">Ad Campaign Optimization</span>
                  </div>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <label className="switch">
                <input type="checkbox" checked={preferences.marketing} onChange={() => handleToggle("marketing")} />
                <span className="slider round"></span>
              </label>
            </article>
          </div>
        </div>
      </section>

      {/* Third Party Cookies list */}
      <section className="cookies-pref-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Third-Party Integration Cookies</h2>
            <p>We work with trusted SaaS compliance providers who set cookies under their privacy policies.</p>
          </div>
          
          <div className="scope-grid">
            {thirdParties.map((tp, idx) => (
              <div className="scope-card" key={idx}>
                <div className="scope-card-icon">
                  <Globe size={18} />
                </div>
                <div className="scope-card-info">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <h3>{tp.name}</h3>
                    <span style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "0.15rem 0.45rem", borderRadius: "4px", fontWeight: "600" }}>{tp.type}</span>
                  </div>
                  <p>{tp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Benefits cards */}
      <section className="cookies-pref-section" style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
        <div className="section-container">
          <div className="section-header">
            <h2>Benefits of Cookies</h2>
            <p>Why enabling cookies guarantees the most optimal workflow experiences inside our platform.</p>
          </div>
          <div className="practices-grid">
            {benefits.map((bene, idx) => {
              return (
                <div className="practice-card" key={idx}>
                  <div className="practice-icon">
                    <i className={`bi ${bene.icon}`} style={{ fontSize: "1.25rem" }}></i>
                  </div>
                  <h3>{bene.title}</h3>
                  <p>{bene.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="cookies-pref-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Frequently Asked Cookie Questions</h2>
            <p>Quick answers explaining why cookie settings keep your browser workflow highly tuned and secure.</p>
          </div>
          
          <div className="faq-accordion-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openFaq === index ? "open" : ""}`}
              >
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="faq-toggle-icon" />
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Notice highlight blue card */}
      <section className="cookies-pref-section" style={{ padding: "3rem 0" }}>
        <div className="section-container">
          <div className="commitment-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Security & Privacy Settings</h2>
              <p style={{ margin: "0" }}>Changing your cookie preferences does not affect essential security cookies required for platform operation.</p>
            </div>
            <a href="/privacy-policy" className="btn-primary">
              Read Privacy Policy
            </a>
          </div>
        </div>
      </section>

      {/* Contact Privacy Team HQ Details card */}
      <section className="cookies-pref-section">
        <div className="section-container">
          <div className="legal-contact-card">
            <div className="contact-card-info">
              <h3>Privacy & Compliance Team</h3>
              <p>For questions or requests relating to GDPR consent records or custom cookies settings.</p>
              
              <div className="contact-card-details">
                <div className="contact-detail-row">
                  <ShieldCheck size={20} />
                  <div>
                    <h4>Consent Compliance Operations</h4>
                    <p>Trust Center</p>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <Mail size={20} />
                  <div>
                    <h4>Data Protection Officer</h4>
                    <a href="mailto:privacy@crmplatform.org">privacy@crmplatform.org</a>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <Phone size={20} />
                  <div>
                    <h4>Data Helpline</h4>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <MapPin size={20} />
                  <div>
                    <h4>Corporate Office</h4>
                    <p>Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-card-actions">
              <a href="mailto:privacy@crmplatform.org" className="btn-primary">
                Contact Privacy Team
              </a>
              <button onClick={() => triggerToast("Privacy manager dashboard is loaded.")} className="btn-secondary">
                Manage Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="cookies-pref-section legal-cta">
        <div className="section-container">
          <div className="legal-cta-inner">
            <h2>You're In Control of Your Privacy</h2>
            <p>Your privacy choices matter. Update your cookie preferences at any time while enjoying a secure and personalized CRM Platform experience.</p>
            <div className="legal-cta-buttons">
              <button onClick={handleSave} className="btn-primary">
                Save Preferences
              </button>
              <a href="/" className="btn-secondary">
                Return Home
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  
      </>);
};

export default CookiePreferences;