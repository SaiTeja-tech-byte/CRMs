import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  FileText, 
  Globe, 
  Sliders, 
  AlertOctagon, 
  ShieldCheck, 
  FileCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  X
} from "lucide-react";

const policyData = {
  "/terms-of-service": {
    badge: "📜 User Agreement",
    title: "Terms of Service",
    updated: "July 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        content: "By creating an account, accessing dashboards, or integrating our CRM API calls, you agree to comply with and be legally bound by these Terms of Service. If you do not accept all clauses, you are prohibited from using our services."
      },
      {
        title: "2. User Registration & Security",
        content: "To access the platform, you must register a corporate work email. You are solely responsible for maintaining credentials confidentiality. Any activity conducted through your account will be deemed your legal responsibility."
      },
      {
        title: "3. Subscription Fees & Payments",
        content: "Subscription plans are billed in advance on a recurring monthly or annual basis. All credit details are handled via SSL-encrypted Stripe tunnels. Failure to pay outstanding renewals will lead to database access restrictions after a 7-day grace period."
      },
      {
        title: "4. Intellectual Property Rights",
        content: "The CRM Platform, logos, layout styles, and predictive recommendation algorithms are the exclusive intellectual property of CRM Platform Group Ltd. You are granted a limited, revocable, non-transferable licence to use the dashboard; reverse engineering is strictly prohibited."
      },
      {
        title: "5. Limitation of Liability",
        content: "Under no legal theory shall the CRM Platform be liable for any lost profits, lost datasets, system outages, or indirect business interruptions. Our aggregate liability is capped at the total fees paid by you in the 12 months preceding the claim."
      },
      {
        title: "6. Governing Law & Dispute Resolution",
        content: "These terms are governed by the laws of India. Any litigation or arbitration arising out of platform disputes shall be conducted exclusively within the jurisdiction of courts in Hyderabad, Telangana."
      }
    ]
  },
  "/cookie-policy": {
    badge: "🍪 Browser Cookies",
    title: "Cookie Policy",
    updated: "July 2026",
    sections: [
      {
        title: "1. Introduction to Cookies",
        content: "Cookies are small text documents stored on your local browser to retain preferences and logins. We use cookies and web beacons to ensure stable user sessions, analyze load speed, and customize dashboard rendering."
      },
      {
        title: "2. Essential Cookies",
        content: "Required for basic session management and platform security. They enable account validation, load balancing, and CSRF token security. Essential cookies cannot be toggled off."
      },
      {
        title: "3. Analytics & Performance Cookies",
        content: "Help us count visitor volumes and trace load times. This information enables our developers to optimize dashboard charts and database queries. Toggling these off will limit our telemetry improvements."
      },
      {
        title: "4. Marketing & Targeted Cookies",
        content: "Used to track advertising effectiveness and display relevant newsletters or tutorial features on external networks. Toggling these off stops personalized outreach."
      }
    ],
    showCookiePrefsBtn: true
  },
  "/trust-center": {
    badge: "🛡️ Trust & Security Status",
    title: "Trust Center",
    updated: "July 2026",
    sections: [
      {
        title: "1. Core Security Safeguards",
        content: "We implement advanced server firewalls, mandatory MFA for admins, and AES-256 rest encryption algorithms to shield customer databases. Our systems are scanned daily for vulnerabilities."
      },
      {
        title: "2. Uptime Guarantee (SLA)",
        content: "The CRM Platform guarantees a 99.99% service availability. If monthly uptime drops below this standard, subscription credits will be automatically calculated and issued in accordance with customer service agreements."
      },
      {
        title: "3. Backup & Disaster Recovery",
        content: "All enterprise database tables are backed up hourly across multiple geographic Availability Zones. Backups are encrypted and tested weekly to ensure prompt restore rates in case of critical cloud outages."
      }
    ],
    showStatusBadge: true
  },
  "/responsible-disclosure": {
    badge: "🕵️ Security Audits",
    title: "Responsible Disclosure Policy",
    updated: "July 2026",
    sections: [
      {
        title: "1. Vulnerability Reporting Guidelines",
        content: "We welcome audits from white-hat security researchers. If you identify a SQL injection, XSS, open redirect, or credentials exposure, please report details immediately to security@crmplatform.org."
      },
      {
        title: "2. Safe Harbor Safeguards",
        content: "If you conduct your research in good faith, do not compromise customer files, and grant our engineering team 30 days to resolve findings before public release, we pledge not to initiate legal or law enforcement proceedings against you."
      },
      {
        title: "3. Prohibited Testing Techniques",
        content: "Physical penetration testing, social engineering of employees, spam outreach, and heavy DDoS volume tests are strictly prohibited. Violations will lead to account termination."
      }
    ]
  },
  "/accessibility": {
    badge: "♿ Inclusive Design",
    title: "Accessibility Statement",
    updated: "July 2026",
    sections: [
      {
        title: "1. Accessibility Standards",
        content: "We are committed to providing dashboards that are accessible to everyone. We design our components, color variables, and font sizes to align with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA recommendations."
      },
      {
        title: "2. Accessible Layout Tools",
        content: "Our website offers screen-reader support, aria-labels for buttons, full keyboard navigation options, high color contrast themes, and resizable layout columns."
      },
      {
        title: "3. Accessibility Queries",
        content: "If you encounter layout blocks or forms that limit accessibility, please write to our design leads at support@crmplatform.org so we can refine our HTML structures."
      }
    ]
  },
  "/acceptable-use": {
    badge: "⚖️ Platform Rules",
    title: "Acceptable Use Policy",
    updated: "July 2026",
    sections: [
      {
        title: "1. Prohibited Actions",
        content: "You agree not to utilize the CRM Platform to distribute spam, execute mass unsolicited cold emails, store illegal files, deploy bot nets, or extract target domains using automated scraping tools."
      },
      {
        title: "2. API Rate Limitations",
        content: "To guarantee server stability, developer API calls are limited to 1,000 requests per minute per organization token. Exceeding this rate will trigger temporary HTTP 429 warnings."
      },
      {
        title: "3. Compliance Auditing",
        content: "The CRM Platform retains the right to audit user databases and email delivery rates to ensure alignment. Non-compliant accounts will face immediate suspension."
      }
    ]
  },
  "/data-processing-agreement": {
    badge: "🇪🇺 GDPR Compliance DPA",
    title: "Data Processing Agreement",
    updated: "July 2026",
    sections: [
      {
        title: "1. Scope and Roles",
        content: "This Data Processing Agreement (DPA) applies to the handling of customer files. Under GDPR, the customer acts as the 'Data Controller' and the CRM Platform acts as the 'Data Processor' handling files on their behalf."
      },
      {
        title: "2. Technical & Organizational Safeguards",
        content: "As the processor, we implement strictly audited procedures including data pseudonymization, rest encryption, 24/7 security center monitoring, and standard contractual clauses for cross-border transit."
      },
      {
        title: "3. Sub-Processors",
        content: "We utilize primary sub-processors (such as Stripe for payments, Google Cloud for storage) to deliver cloud services. A list of active sub-processors is updated periodically in our Trust Center."
      }
    ]
  }
};

const PolicyDetail = ({ path }) => {
  const currentPolicy = policyData[path] || {
    badge: "📜 Document",
    title: "Legal Policy",
    updated: "July 2026",
    sections: [{ title: "Section", content: "Details to be updated." }]
  };

  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true,
    analytics: true,
    functional: true,
    marketing: false
  });
  const [showCookieSuccess, setShowCookieSuccess] = useState(false);

  const handleSaveCookiePrefs = (e) => {
    e.preventDefault();
    setShowCookieSuccess(true);
    setTimeout(() => {
      setShowCookieSuccess(false);
      setShowCookiesModal(false);
    }, 1500);
  };

  return (
      <>
        <style>{`/* Premium Policy Detail Stylesheet - SalesNova CRM */

.policy-detail-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}

/* Hero Header */
.policy-detail-hero {
  padding: 8rem 0 3.5rem;
  background: radial-gradient(100% 100% at 50% 0%, rgba(219, 234, 254, 0.3) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.back-breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 1.5rem;
  transition: color 0.2s ease;
}

.back-breadcrumb:hover {
  color: #2563eb;
}

.policy-hero-main {
  max-width: 800px;
}

.policy-badge-pill {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #2563eb;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.policy-hero-main h1 {
  font-size: clamp(2.25rem, 3.5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.policy-update-meta {
  font-size: 0.875rem;
  color: #64748b;
}

/* Layout Columns */
.policy-detail-body {
  padding: 4.5rem 0 6rem;
}

.policy-body-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3.5rem;
  align-items: start;
}

/* Table of Contents Sticky Sidebar */
.policy-toc {
  position: sticky;
  top: 130px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toc-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.01);
}

.toc-card h3 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.toc-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.toc-card a {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  line-height: 1.4;
}

.toc-card a:hover {
  color: #2563eb;
  padding-left: 2px;
}

/* Status Widget */
.status-widget {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.01);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  position: relative;
}

.status-dot::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #10b981;
  border-radius: 50%;
  opacity: 0.4;
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
}

.status-widget h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.status-widget p {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.85rem;
}

.status-metric {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #ecfdf5;
  color: #047857;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
}

/* Legal Content Section */
.policy-card-wrapper {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3rem;
  box-shadow: 0 4px 25px rgba(15, 23, 42, 0.01);
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
}

.policy-text-section {
  scroll-margin-top: 150px; /* Safe padding for sticky header anchor jumps */
  padding-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.policy-text-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.policy-text-section h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
}

.policy-text-section p {
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
}

.policy-extra-action {
  margin-top: 1.5rem;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .policy-body-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .policy-toc {
    position: static;
  }
  .toc-card {
    display: none; /* Hide TOC list on tablet/mobile to avoid duplicate navigation clutter */
  }
  .policy-card-wrapper {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .policy-detail-hero {
    padding: 6.5rem 0 3rem;
  }
  .policy-card-wrapper {
    padding: 1.75rem;
  }
}
`}</style>
    <div className="policy-detail-page">
      <Navbar />

      {/* Hero Header */}
      <header className="policy-detail-hero">
        <div className="container">
          <a href="/legal" className="back-breadcrumb">
            <ArrowLeft size={16} /> Back to Legal Center
          </a>
          <div className="policy-hero-main">
            <div className="policy-badge-pill">{currentPolicy.badge}</div>
            <h1>{currentPolicy.title}</h1>
            <p className="policy-update-meta">
              <strong>Last Updated:</strong> {currentPolicy.updated}
            </p>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="policy-detail-body container">
        <div className="policy-body-layout">
          
          {/* Left Table of Contents */}
          <aside className="policy-toc">
            <div className="toc-card">
              <h3>On this page</h3>
              <ul>
                {currentPolicy.sections.map((sec, idx) => (
                  <li key={idx}>
                    <a href={`#sec-${idx}`}>{sec.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            {currentPolicy.showStatusBadge && (
              <div className="status-widget">
                <div className="status-header">
                  <span className="status-dot"></span>
                  <h4>System Status</h4>
                </div>
                <p>All core systems operational.</p>
                <div className="status-metric">99.99% Uptime</div>
              </div>
            )}
          </aside>

          {/* Right Text Content */}
          <article className="policy-text-content">
            <div className="policy-card-wrapper">
              {currentPolicy.sections.map((sec, idx) => (
                <section id={`sec-${idx}`} key={idx} className="policy-text-section">
                  <h2>{sec.title}</h2>
                  <p>{sec.content}</p>
                </section>
              ))}

              {currentPolicy.showCookiePrefsBtn && (
                <div className="policy-extra-action">
                  <button className="btn-primary" onClick={() => setShowCookiesModal(true)}>
                    Manage Cookie Preferences
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />

      {/* Cookie Preferences Modal */}
      {showCookiesModal && (
        <div className="privacy-modal-overlay" onClick={() => setShowCookiesModal(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCookiesModal(false)}>
              <X size={18} />
            </button>
            <div className="modal-header">
              <h3>Cookie Preferences</h3>
              <p>Manage how cookies are used on the CRM Platform.</p>
            </div>
            
            {showCookieSuccess ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h4>Settings Updated</h4>
                <p>Your cookie preferences have been successfully configured.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveCookiePrefs}>
                <div className="modal-body">
                  <div className="cookie-option-list">
                    <div className="cookie-option-item">
                      <div className="cookie-option-info">
                        <div className="cookie-option-title">Essential Cookies</div>
                        <div className="cookie-option-desc">Required to enable core user log-in sessions, system authentication, and secure database mapping. Cannot be deactivated.</div>
                      </div>
                      <label className="switch">
                        <input type="checkbox" checked disabled />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="cookie-option-item">
                      <div className="cookie-option-info">
                        <div className="cookie-option-title">Analytics Cookies</div>
                        <div className="cookie-option-desc">Help us map page loads and dashboard clicks to evaluate rendering speed and spot API latency bugs.</div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={cookiePrefs.analytics} 
                          onChange={(e) => setCookiePrefs({...cookiePrefs, analytics: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="cookie-option-item">
                      <div className="cookie-option-info">
                        <div className="cookie-option-title">Functional Cookies</div>
                        <div className="cookie-option-desc">Enable localized settings, saving your dashboard drawer toggle preference, filter configurations, and theme settings.</div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={cookiePrefs.functional} 
                          onChange={(e) => setCookiePrefs({...cookiePrefs, functional: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <div className="cookie-option-item">
                      <div className="cookie-option-info">
                        <div className="cookie-option-title">Marketing Cookies</div>
                        <div className="cookie-option-desc">Used to evaluate our marketing performance and help us show customized offers or tutorials on the platform.</div>
                      </div>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={cookiePrefs.marketing} 
                          onChange={(e) => setCookiePrefs({...cookiePrefs, marketing: e.target.checked})}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCookiesModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Preferences</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  
      </>);
};

export default PolicyDetail;