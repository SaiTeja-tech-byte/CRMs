import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MapPin } from "lucide-react";

const sections = [
  { id: "acceptance", label: "1. Acceptance of Terms", icon: "bi-check-circle" },
  { id: "eligibility", label: "2. Eligibility", icon: "bi-person-check" },
  { id: "accounts", label: "3. User Accounts", icon: "bi-lock" },
  { id: "acceptable", label: "4. Acceptable Use", icon: "bi-exclamation-triangle" },
  { id: "subscription", label: "5. Subscription & Payments", icon: "bi-currency-dollar" },
  { id: "property", label: "6. Intellectual Property", icon: "bi-briefcase" },
  { id: "thirdparty", label: "7. Third-Party Services", icon: "bi-server" },
  { id: "availability", label: "8. Service Availability", icon: "bi-shield-check" },
  { id: "liability", label: "9. Limitation of Liability", icon: "bi-slash-circle" },
  { id: "termination", label: "10. Account Termination", icon: "bi-x-circle" },
  { id: "governing", label: "11. Governing Law", icon: "bi-file-earmark-text" },
  { id: "changes", label: "12. Changes to Terms", icon: "bi-file-earmark-check" },
  { id: "contact-sec", label: "13. Contact Information", icon: "bi-envelope" }
];

const faqs = [
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel your subscription plan at any time through the Billing settings panel inside your account dashboard. If cancelled, your access will continue until the end of your current paid billing cycle, after which your account will transition to read-only mode."
  },
  {
    q: "Can the CRM Platform terminate my account?",
    a: "We reserve the right to suspend or terminate accounts that breach our Acceptable Use policy, are involved in illicit activities, or show recurring billing failures. We always strive to provide notice and an opportunity to rectify issues before terminating access."
  },
  {
    q: "Are third-party integrations covered under these Terms?",
    a: "No. Integrations with Slack, Microsoft, Google Workspace, and GitHub are subject to their respective terms. We supply the pipeline integration tunnels but are not liable for outages or data handling protocols of those third-party providers."
  },
  {
    q: "How are billing disputes handled?",
    a: "If you detect an incorrect charge, please alert our billing team at billing@crmplatform.org within 30 days of the charge date. We will inspect the transaction logs and issue credits or refunds in accordance with genuine usage outages or billing errors."
  },
  {
    q: "Where can I read the Privacy Policy?",
    a: "Our full Privacy Policy is available at /privacy-policy. It details how we compile, process, and secure your personal credentials and databases."
  }
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [openFaq, setOpenFaq] = useState(null);

  // ScrollSpy implementation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // Offset to trigger slightly before center

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDownloadPDF = (e) => {
    e.preventDefault();
    window.print();
  };

  return (
      <>
        <style>{`/* Premium Terms of Service Stylesheet - SalesNova CRM */

.terms-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background Gradients & Blurred Circles */
.terms-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20%;
  width: 650px;
  height: 650px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(40px);
}

.terms-page::after {
  content: "";
  position: absolute;
  top: 1000px;
  right: 5%;
  width: 550px;
  height: 550px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(45px);
}

/* Hero Section */
.terms-hero {
  padding: 8.5rem 0 4.5rem;
  background: radial-gradient(110% 110% at 50% 0%, rgba(219, 234, 254, 0.35) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.terms-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.terms-hero-content {
  flex: 1.2;
  max-width: 680px;
}

.terms-badge {
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

.terms-hero-content h1 {
  font-size: clamp(2.75rem, 4.2vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.terms-hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.terms-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.terms-hero-actions {
  display: flex;
  gap: 1rem;
}

/* Illustration on Right */
.terms-hero-illustration {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 420px;
}

.contract-wrapper {
  background: #ffffff;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.03);
  position: relative;
  animation: floatContract 6s ease-in-out infinite;
}

@keyframes floatContract {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.contract-deco-circle {
  position: absolute;
  width: 320px;
  height: 320px;
  border: 1px dashed rgba(37, 99, 235, 0.15);
  border-radius: 50%;
  animation: rotateContract 40s linear infinite;
}

@keyframes rotateContract {
  100% { transform: rotate(360deg); }
}

/* Layout Grid */
.terms-layout {
  padding: 5rem 0;
  position: relative;
  z-index: 2;
}

.terms-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Sticky Sidebar Navigation */
.terms-sidebar {
  position: sticky;
  top: 140px;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 1rem;
}

/* Scrollbar styling */
.terms-sidebar::-webkit-scrollbar {
  width: 4px;
}
.terms-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.terms-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.terms-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.terms-nav-link a {
  display: block;
  padding: 0.65rem 0.85rem;
  color: #64748b;
  font-size: 0.925rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
}

.terms-nav-link a:hover {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.04);
}

.terms-nav-link.active a {
  color: #2563eb;
  background: #eff6ff;
  border-left-color: #2563eb;
  font-weight: 600;
}

/* Content cards */
.terms-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.terms-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.015);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.terms-card:hover {
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
}

.terms-card-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.terms-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f0f7ff;
  color: #2563eb;
}

.terms-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.terms-card p {
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.25rem;
}

.terms-card p:last-child {
  margin-bottom: 0;
}

/* Lists inside cards */
.terms-card ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.875rem;
  margin: 1.5rem 0;
}

.terms-card li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
}

.terms-card li::before {
  content: "✓";
  color: #2563eb;
  font-weight: 700;
  font-size: 0.9rem;
  margin-top: 0.1rem;
}

/* Highlighted Caution / Warning Card (Acceptable Use) */
.terms-card.highlight-caution {
  background: #fffdf5;
  border: 1px solid #fef3c7;
  border-left: 4px solid #f59e0b;
}

.terms-card.highlight-caution .terms-card-icon {
  background: #fef3c7;
  color: #d97706;
}

.terms-card.highlight-caution .terms-card-header {
  border-bottom-color: #fef08a;
}

.terms-card.highlight-caution li::before {
  content: "⚠";
  color: #d97706;
}

/* Highlighted Info Card (Limitation of Liability) */
.terms-card.highlight-info {
  background: #fcfdff;
  border: 1px solid #dbeafe;
  border-left: 4px solid #2563eb;
}

.terms-card.highlight-info .terms-card-icon {
  background: #eff6ff;
  color: #2563eb;
}

.terms-card.highlight-info .terms-card-header {
  border-bottom-color: #bfdbfe;
}

/* Service Uptime Widget */
.uptime-badge-container {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 10px;
  margin-top: 1.25rem;
}

.uptime-pulse-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  position: relative;
}

.uptime-pulse-dot::after {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #10b981;
  border-radius: 50%;
  opacity: 0.5;
  animation: pulseUptime 2s infinite;
}

@keyframes pulseUptime {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2.2); opacity: 0; }
}

.uptime-badge-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: #065f46;
}

/* Contact Grid Info */
.terms-contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* Accordions (FAQ) */
.terms-faq {
  padding: 6rem 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

/* CTA Bottom */
.terms-cta {
  padding: 6rem 0;
  background: radial-gradient(100% 100% at 50% 100%, rgba(219, 234, 254, 0.25) 0%, rgba(248, 250, 252, 0) 100%);
}

.terms-cta-inner {
  max-width: 750px;
  margin: 0 auto;
  text-align: center;
  background: #ffffff;
  padding: 4rem 3rem;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.02);
}

.terms-cta-inner h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.terms-cta-inner p {
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.terms-cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .terms-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .terms-sidebar {
    position: static;
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1.5rem;
  }
  
  .terms-nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .terms-nav-link a {
    border-left: none;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .terms-nav-link.active a {
    border-left-color: transparent;
    border-bottom-color: #2563eb;
    background: #eff6ff;
  }
}

@media (max-width: 768px) {
  .terms-hero {
    padding: 6.5rem 0 3.5rem;
  }
  
  .terms-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .terms-hero-content {
    max-width: 100%;
  }
  
  .terms-hero-actions {
    justify-content: center;
  }
  
  .terms-hero-illustration {
    display: none;
  }
  
  .terms-card {
    padding: 1.75rem;
  }
  
  .terms-cta-inner {
    padding: 2.5rem 1.5rem;
  }
  
  .terms-cta-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .terms-cta-buttons .btn-primary,
  .terms-cta-buttons .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

.back-breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-breadcrumb:hover {
  color: #2563eb;
}
`}</style>
    <div className="terms-page">
      <Navbar />

      <header className="terms-hero">
        <div className="container" style={{ marginBottom: "1rem" }}>
          <a href="/legal" className="back-breadcrumb">
            <i className="bi bi-arrow-left" style={{ marginRight: "0.5rem" }}></i> Back to Legal Center
          </a>
        </div>
        <div className="container terms-hero-inner">
          <div className="terms-hero-content">
            <div className="terms-badge">
              <i className="bi bi-file-earmark-text" style={{ marginRight: "0.5rem" }}></i>
              <span>Legal Agreement</span>
            </div>
            <h1>Terms of Service</h1>
            <p className="terms-hero-subtitle">
              These Terms of Service govern your access to and use of the CRM Platform. By using our platform, you agree to comply with these terms and conditions designed to ensure a secure and reliable experience for all users.
            </p>
            <p className="terms-meta">
              <strong>Last Updated:</strong> July 2026
            </p>
            <div className="terms-hero-actions">
              <a href="#contact-sec" className="btn-primary">
                Contact Legal Team
              </a>
              <a href="#" onClick={handleDownloadPDF} className="btn-secondary">
                <i className="bi bi-download" style={{ marginRight: "0.5rem" }}></i>
                Download PDF
              </a>
            </div>
          </div>
          <div className="terms-hero-illustration">
            <div className="contract-wrapper">
              <div className="contract-deco-circle"></div>
              <div className="legal-illustration-core" style={{ textAlign: "center" }}>
                <i className="bi bi-file-earmark-text text-primary" style={{ fontSize: "5.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <section className="terms-layout">
        <div className="container terms-grid">
          
          {/* Quick Navigation Sidebar */}
          <aside className="terms-sidebar">
            <ul className="terms-nav-links">
              {sections.map((sec) => (
                <li
                  key={sec.id}
                  className={`terms-nav-link ${activeSection === sec.id ? "active" : ""}`}
                >
                  <a href={`#${sec.id}`}>{sec.label}</a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Core Content cards */}
          <div className="terms-content">
            
            {/* 1. Acceptance of Terms */}
            <article id="acceptance" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-check-circle text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>1. Acceptance of Terms</h2>
              </div>
              <p>
                 By registering an account, utilizing the dashboard features, or integrating standard APIs of the CRM Platform (collectively referred to as the 'Services'), you agree to comply with and be legally bound by these Terms of Service. These terms form a binding contract between the CRM Platform (under CRM Platform Group Ltd.) and you.
              </p>
              <p>
                If you are agreeing to these Terms on behalf of an enterprise entity, you represent and warrant that you hold appropriate authority to bind that entity to these conditions. If you do not accept these clauses, you are prohibited from utilizing our tools.
              </p>
            </article>

            {/* 2. Eligibility */}
            <article id="eligibility" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-person-check text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>2. Eligibility</h2>
              </div>
              <p>
                You warrant that you are of legal age to form a binding contract under applicable regional laws and are fully authorized to manage business billing transactions. You certify that your use of our CRM software complies with local marketing regulations, privacy laws, and database ownership parameters.
              </p>
            </article>

            {/* 3. User Accounts */}
            <article id="accounts" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-lock text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>3. User Accounts</h2>
              </div>
              <p>
                Access to our CRM systems requires creating a dedicated profile workspace. You agree to:
              </p>
              <ul>
                <li>Supply accurate, current, and verified information during registration.</li>
                <li>Preserve the confidentiality of workspace API keys and account login passwords.</li>
                <li>Decline from sharing access tokens or login accounts with unauthorized external agents.</li>
                <li>Limit workspace usage strictly to authorized workers within your company size limits.</li>
                <li>Notify our support team immediately of security breeches or credentials exposure.</li>
              </ul>
            </article>

            {/* 4. Acceptable Use (Highlighted Warning Card) */}
            <article id="acceptable" className="terms-card highlight-caution">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-slash-circle text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>4. Acceptable Use Policy</h2>
              </div>
              <p>
                To maintain database integrity and prevent server exploitation, you are strictly prohibited from engaging in the following activities:
              </p>
              <ul>
                <li>Attempting unauthorized access to other tenant databases or server hosts.</li>
                <li>Uploading software carrying viruses, trojans, ransomware, or malicious routing scripts.</li>
                <li>Exploiting platform integrations to execute spam, phishing email chains, or illicit bulk outreach.</li>
                <li>Extracting target data records from our user interface using web crawlers or scrapers.</li>
                <li>Reverse engineering dashboard files, CRM databases, or ML forecasting scripts.</li>
                <li>Interfering with system latency or overload server bandwidth metrics.</li>
              </ul>
            </article>

            {/* 5. Subscription & Payments */}
            <article id="subscription" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-currency-dollar text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>5. Subscription & Payments</h2>
              </div>
              <p>
                We bill subscriptions in advance on a recurring monthly or annual basis:
              </p>
              <ul>
                <li><strong>Free Trial:</strong> Grants limited platform trial features. Upon expiration, billing details must be configured to retain pipelines.</li>
                <li><strong>Paid Plans:</strong> Features, data thresholds, and API calls are limited in accordance with your active plan tier.</li>
                <li><strong>Billing Cycles:</strong> Renewals are processed automatically on your contract anniversary date via Stripe gateway.</li>
                <li><strong>Taxes:</strong> Fees are exclusive of VAT, GST, and localized sales taxes, which will be added at check-out.</li>
                <li><strong>Cancellation:</strong> You can cancel renewals at any time. Accounts stay active until the billing period terminates. No prorated refunds are issued.</li>
              </ul>
            </article>

            {/* 6. Intellectual Property */}
            <article id="property" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-briefcase text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>6. Intellectual Property</h2>
              </div>
              <p>
                 The CRM Platform software, layouts, dashboard UI designs, marketing components, assets, databases, documentation, and the brand remain the sole intellectual property of CRM Platform Group Ltd.
              </p>
              <p>
                You are granted a revocable, non-exclusive, non-transferable licence to access the SaaS environment. This licence does not transfer ownership of source code, design systems, or patents.
              </p>
            </article>

            {/* 7. Third-Party Services */}
            <article id="thirdparty" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-server text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>7. Third-Party Services</h2>
              </div>
              <p>
                Our CRM offers native integrations with Google Workspace, Microsoft 365, Slack, Stripe, and GitHub. You acknowledge that:
              </p>
              <ul>
                <li>Third-party integrations are subject to the terms and privacy rules of those services.</li>
                <li>We do not control the uptime, performance, or database structures of external partners.</li>
                <li>API outages on their systems do not invalidate your billing agreements with the CRM Platform.</li>
              </ul>
            </article>

            {/* 8. Service Availability */}
            <article id="availability" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-shield-check text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>8. Service Availability & Uptime SLA</h2>
              </div>
              <p>
                We strive to keep our platform available 24/7. However, routine maintenance and updates may cause brief planned interruptions. We aim to perform server updates during low-traffic weekend periods and issue advance notices.
              </p>
              <p>
                We commit to maintaining a 99.99% core platform uptime rate. Real-time updates and historical reliability ratings are visible in our Trust Center.
              </p>
              <div className="uptime-badge-container">
                <span className="uptime-pulse-dot"></span>
                <span className="uptime-badge-text">99.99% Platform Uptime Commitment</span>
              </div>
            </article>

            {/* 9. Limitation of Liability (Highlighted Info Card) */}
            <article id="liability" className="terms-card highlight-info">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-slash-circle text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>9. Limitation of Liability</h2>
              </div>
              <p>
                To the maximum extent permitted by law, the CRM Platform, its directors, and engineers shall not be liable for any indirect, special, incidental, punitive, or consequential damages.
              </p>
              <p>
                This includes damages for loss of profit, corporate customer databases, system downtime, backup data loss, or business interruptions. In all cases, our maximum aggregate liability is capped at the total subscription fees paid by you in the 12 months preceding the claim.
              </p>
            </article>

            {/* 10. Account Suspension & Termination */}
            <article id="termination" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-x-circle text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>10. Account Suspension & Termination</h2>
              </div>
              <p>
                We reserve the right to suspend workspace access or permanently terminate accounts for violating our Acceptable Use policy, recurring payment failures, or court orders.
              </p>
              <p>
                Upon termination, we retain database records for a grace period of 14 days allowing exports before permanently scrubbing active storage instances.
              </p>
            </article>

            {/* 11. Governing Law */}
            <article id="governing" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-file-earmark-text text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>11. Governing Law</h2>
              </div>
              <p>
                These Terms of Service and any contractual disputes arising out of your use of the platform shall be governed by the laws of India. Any litigation, mediation, or arbitration proceedings shall be conducted exclusively within the jurisdiction of courts in Hyderabad, Telangana.
              </p>
            </article>

            {/* 12. Changes to Terms */}
            <article id="changes" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-file-earmark-check text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>12. Changes to Terms</h2>
              </div>
              <p>
                We may periodically update these Terms of Service to reflect system enhancements or regulatory updates. We will notify users of major revisions via dashboard banner warnings or email newsletters.
              </p>
              <p>
                Your continued use of the CRM Platform following updates indicates acceptance of the amended terms.
              </p>
            </article>

            {/* 13. Contact Information */}
            <article id="contact-sec" className="terms-card">
              <div className="terms-card-header">
                <div className="terms-card-icon"><i className="bi bi-envelope text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>13. Contact Information</h2>
              </div>
              <p>
                If you have queries, concerns, or requests regarding these Terms of Service, please contact our legal counsel:
              </p>
              <div className="terms-contact-grid">
                <div className="contact-info-card">
                  <div className="contact-info-icon"><i className="bi bi-shield-fill-check text-primary" style={{ fontSize: "1.25rem" }}></i></div>
                  <div className="contact-info-details">
                    <h4>Legal & Compliance</h4>
                    <p>Legal Group</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon"><i className="bi bi-envelope-fill text-primary" style={{ fontSize: "1.25rem" }}></i></div>
                  <div className="contact-info-details">
                    <h4>Email Inquiries</h4>
                    <a href="mailto:legal@crmplatform.org">legal@crmplatform.org</a>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon"><i className="bi bi-telephone-fill text-primary" style={{ fontSize: "1.25rem" }}></i></div>
                  <div className="contact-info-details">
                    <h4>Phone Number</h4>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon"><MapPin size={20} /></div>
                  <div className="contact-info-details">
                    <h4>Corporate Office</h4>
                    <p>Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="terms-faq">
        <div className="container">
          <div className="faq-header">
            <h2>Frequently Asked Terms Questions</h2>
            <p>Get quick clarifications on billing cancellations, account actions, and third-party liabilities.</p>
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
                  <i className="bi bi-chevron-down faq-toggle-icon"></i>
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="terms-cta">
        <div className="container">
          <div className="terms-cta-inner">
            <h2>Have Questions About Our Terms?</h2>
            <p>If you have questions about these Terms of Service, our legal team is available to assist you.</p>
            <div className="terms-cta-buttons">
              <a href="#contact-sec" className="btn-primary">
                Contact Legal Team
              </a>
              <a href="/" className="btn-secondary">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  
      </>);
};

export default TermsOfService;