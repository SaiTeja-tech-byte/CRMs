import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertOctagon, CheckCircle, ShieldCheck } from "lucide-react";

const steps = [
  { step: "Step 1", title: "Discover", desc: "Identify a potential security vulnerability.", icon: "bi-search" },
  { step: "Step 2", title: "Report", desc: "Submit detailed information to our Security Team.", icon: "bi-send" },
  { step: "Step 3", title: "Investigation", desc: "Our engineers validate and investigate the issue.", icon: "bi-eye" },
  { step: "Step 4", title: "Resolution", desc: "The issue is fixed and appropriate credit may be provided.", icon: "bi-gift" }
];

const inScopeDocs = [
  { title: "Authentication vulnerabilities", desc: "Privilege escalation or session hijacking bypasses.", icon: "bi-key" },
  { title: "Authorization issues", desc: "Direct object reference flaws or cross-tenant data leakage.", icon: "bi-person-check" },
  { title: "SQL Injection", desc: "Backend database query manipulation.", icon: "bi-database" },
  { title: "Cross-Site Scripting (XSS)", desc: "Malicious scripts executing in client contexts.", icon: "bi-terminal" },
  { title: "Remote Code Execution", desc: "Executing arbitrary script files on our cloud hosts.", icon: "bi-cpu" },
  { title: "API Security Issues", desc: "Broken object level authorization or rate limits bypasses.", icon: "bi-layers" },
  { title: "Sensitive Data Exposure", desc: "Exposure of encryption keys, secrets, or raw databases.", icon: "bi-lock" },
  { title: "Broken Access Control", desc: "Accessing dashboard drawer options without credentials.", icon: "bi-shield" },
  { title: "Server Misconfiguration", desc: "Open server directories or exposed debug panels.", icon: "bi-activity" }
];

const outOfScopeItems = [
  "Spam reports and mass newsletter delivery tests",
  "Social engineering, phishing, or phone queries to employees",
  "Missing HTTP security headers carrying zero exploit impacts",
  "Clickjacking issues on non-sensitive dashboard panels",
  "Rate limiting suggestions or standard DDoS volume testing",
  "Denial-of-Service (DoS) and heavy automated stress testing",
  "Physical attacks on database centers or workspace locations",
  "Vulnerabilities in third-party integrations (Slack, Stripe)"
];

const guidelines = [
  "Provide detailed reproduction steps or step-by-step console scripts.",
  "Include clear screenshots or proof-of-concept video clips.",
  "Include custom exploit proof-of-concept scripts if applicable.",
  "Avoid accessing or modifying other customer account databases.",
  "Avoid causing service disruptions or load performance degradation.",
  "Maintain confidentiality and avoid public disclosures during review.",
  "Allow our engineering team 30 business days to deploy hotfixes."
];

const commitments = [
  "Acknowledge receipt of your vulnerability report within 48 hours.",
  "Investigate validation findings responsibly and objectively.",
  "Keep reporters updated regularly regarding validation progress.",
  "Deploy hotfixes to validate findings promptly and securely.",
  "Credit researchers on our security Hall of Fame page.",
  "Maintain clear and transparent compliance communications."
];

const securityPractices = [
  { title: "Multi-Factor Authentication", desc: "Mandatory MFA settings for account logins and database access controls.", icon: "bi-person-check" },
  { title: "Strong Passwords", desc: "Enforcing complex password schemas and checking credentials leaks.", icon: "bi-key" },
  { title: "Data Encryption", desc: "Data encrypted in transit via TLS 1.3 and at rest using AES-256 blocks.", icon: "bi-lock" },
  { title: "Regular Updates", desc: "Automated vulnerability scans and dependency patching programs.", icon: "bi-arrow-repeat" },
  { title: "Secure API Usage", desc: "Hashed API keys, rate-limiting, and request validation gateways.", icon: "bi-layers" },
  { title: "Role-Based Access Control", desc: "Restricted developer permissions mapping database access.", icon: "bi-shield-check" }
];

const complianceBadges = [
  { title: "SSL Encrypted", desc: "Secure transport protocols", icon: "bi-lock" },
  { title: "GDPR Ready", desc: "Citizen data rights protection", icon: "bi-shield-check" },
  { title: "ISO 27001", desc: "Certified server infrastructure", icon: "bi-shield" },
  { title: "SOC 2 Practices", desc: "Audited operational procedures", icon: "bi-file-earmark-check" },
  { title: "Secure Cloud Infrastructure", desc: "VPC network isolation rules", icon: "bi-globe" },
  { title: "Continuous Monitoring", desc: "24/7 intrusion detection alerts", icon: "bi-activity" }
];

const faqs = [
  {
    q: "How do I report a vulnerability?",
    a: "Please compile a detailed report including description, reproduction steps, screenshots, and impact metrics. Send the details directly to our response desk at security@crmplatform.org."
  },
  {
    q: "Will I receive a response?",
    a: "Yes. Our response team will acknowledge receipt of your vulnerability report within 48 hours, detailing whether the issue is validated and its severity tier."
  },
  {
    q: "Do you have a bug bounty program?",
    a: "Currently, our platform operates a credit-based hall of fame list. We reward qualifying critical exploits (like Remote Code Execution) with profile credits, platform badges, and physical swag kits."
  },
  {
    q: "What information should I include?",
    a: "Include a title, description, URL of the endpoint, specific parameters carrying flaws, step-by-step reproduction guide, and proof of concept logs."
  },
  {
    q: "How long does the investigation take?",
    a: "We validate reports within 3-5 business days. The complete resolution lifecycle depends on the complexity of the hotfix, but we aim to deploy updates within 30 days."
  },
  {
    q: "Can I publicly disclose my findings?",
    a: "No. In accordance with responsible disclosure guidelines, we request researchers to keep findings confidential until hotfixes are completely deployed to cloud hosts."
  }
];

const ResponsibleDisclosure = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    type: "access",
    details: ""
  });

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setShowRequestSuccess(true);
    setTimeout(() => {
      setShowRequestSuccess(false);
      setShowRequestModal(false);
      setRequestForm({ name: "", email: "", type: "access", details: "" });
    }, 2000);
  };

  return (
      <>
        <style>{`/* Premium Responsible Disclosure & Security Center Stylesheet - SalesNova CRM */

.disclosure-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background Gradients */
.disclosure-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 20%;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(50px);
}

.disclosure-page::after {
  content: "";
  position: absolute;
  top: 1100px;
  right: 8%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(40px);
}

/* Hero Section */
.disclosure-hero {
  padding: 8.5rem 0 5rem;
  background: radial-gradient(110% 110% at 50% 0%, rgba(219, 234, 254, 0.35) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.disclosure-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.disclosure-hero-content {
  flex: 1.2;
  max-width: 680px;
}

.disclosure-badge {
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

.disclosure-hero-content h1 {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.disclosure-hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.disclosure-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.disclosure-hero-actions {
  display: flex;
  gap: 1rem;
}

/* Hero Right Side Art */
.disclosure-hero-illustration {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 440px;
}

.security-art-wrapper {
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
  animation: floatSec 6s ease-in-out infinite;
}

@keyframes floatSec {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.security-art-deco {
  position: absolute;
  width: 330px;
  height: 330px;
  border: 1px dashed rgba(37, 99, 235, 0.15);
  border-radius: 50%;
  animation: rotateSec 45s linear infinite;
}

@keyframes rotateSec {
  100% { transform: rotate(360deg); }
}

/* Sections General */
.disclosure-section {
  padding: 6.5rem 0;
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

/* connected process timeline cards */
.process-timeline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  position: relative;
}

.process-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.01);
  position: relative;
  z-index: 3;
  transition: all 0.3s ease;
}

.process-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.06);
  border-color: rgba(37, 99, 235, 0.12);
}

.process-node {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f7ff;
  color: #2563eb;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08);
}

.process-card:hover .process-node {
  background: #2563eb;
  color: #ffffff;
}

.process-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.process-card p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #475569;
}

/* Connector Lines on Desktop */
@media (min-width: 1025px) {
  .process-timeline::before {
    content: "";
    position: absolute;
    top: 60px;
    left: 10%;
    right: 10%;
    height: 2px;
    background: repeating-linear-gradient(90deg, #cbd5e1, #cbd5e1 6px, transparent 6px, transparent 12px);
    z-index: 1;
  }
}

/* In-Scope Cards Grid */
.scope-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.scope-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 1.75rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  transition: all 0.2s ease;
}

.scope-card:hover {
  border-color: #2563eb;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.04);
}

.scope-card-icon {
  background: #f0f7ff;
  color: #2563eb;
  padding: 0.65rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.scope-card-info h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.scope-card-info p {
  font-size: 0.85rem;
  line-height: 1.45;
  color: #64748b;
}

/* Out of Scope Highlight Card */
.scope-caution-card {
  background: #fffdf5;
  border: 1px solid #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.01);
  margin-top: 3rem;
}

.scope-caution-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #fef08a;
}

.scope-caution-icon {
  background: #fef3c7;
  color: #d97706;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scope-caution-card h3 {
  font-size: 1.35rem;
  font-weight: 700;
  color: #92400e;
}

.scope-caution-card p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 1.5rem;
}

.scope-caution-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}

.scope-caution-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.scope-caution-item::before {
  content: "⚠";
  color: #d97706;
  font-weight: 700;
}

/* Guidelines Checklist Section */
.guidelines-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3rem;
  box-shadow: 0 4px 25px rgba(15, 23, 42, 0.015);
}

.guidelines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.guidelines-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
}

.guidelines-item svg {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

/* Our Commitment Premium Blue Card */
.commitment-card {
  background: radial-gradient(100% 100% at 0% 0%, #eff6ff 0%, #ffffff 100%);
  border: 1px solid #bfdbfe;
  border-left: 4px solid #2563eb;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 6px 25px rgba(37, 99, 235, 0.03);
}

.commitment-card h2 {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.commitment-card p {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.65;
  margin-bottom: 2rem;
}

.commitment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.commitment-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
}

.commitment-item svg {
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 0.15rem;
}

/* Security Contact HQ details Card */
.contact-card-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

/* Best Practices grid cards */
.practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.practice-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  transition: all 0.25s ease;
}

.practice-card:hover {
  transform: translateY(-3px);
  border-color: #2563eb;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.04);
}

.practice-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f0f7ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.practice-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.practice-card p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #475569;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .process-timeline {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .disclosure-hero {
    padding: 6.5rem 0 3.5rem;
  }
  
  .disclosure-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .disclosure-hero-actions {
    justify-content: center;
  }
  
  .disclosure-hero-illustration {
    display: none;
  }
  
  .process-timeline {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .scope-caution-card {
    padding: 1.75rem;
  }
  
  .scope-caution-list {
    grid-template-columns: 1fr;
  }
  
  .guidelines-card, .commitment-card {
    padding: 2rem 1.5rem;
  }
}
`}</style>
    <div className="disclosure-page">
      <Navbar />

      <header className="disclosure-hero">
        <div className="container">
          <a href="/legal" className="back-breadcrumb">
            <i className="bi bi-arrow-left" style={{ marginRight: "0.5rem" }}></i> Back to Legal Center
          </a>
        </div>
        <div className="container disclosure-hero-inner">
          <div className="disclosure-hero-content">
            <div className="disclosure-badge">
              <i className="bi bi-shield-lock" style={{ marginRight: "0.5rem" }}></i>
              <span>Security & Responsible Disclosure</span>
            </div>
            <h1>Responsible Disclosure</h1>
            <p className="disclosure-hero-subtitle">
              We value the security of our platform and encourage security researchers to responsibly report potential vulnerabilities. Your contributions help us keep the CRM Platform secure for everyone.
            </p>
            <p className="disclosure-meta">
              <strong>Last Updated:</strong> July 2026
            </p>
            <div className="disclosure-hero-actions">
              <a href="#contact-security-sec" className="btn-primary">
                Report a Vulnerability
              </a>
              <a href="#contact-security-sec" className="btn-secondary">
                Contact Security Team
              </a>
            </div>
          </div>
          <div className="disclosure-hero-illustration">
            <div className="security-art-wrapper">
              <div className="security-art-deco"></div>
              <div className="legal-illustration-core" style={{ textAlign: "center" }}>
                <i className="bi bi-shield-slash-fill text-primary" style={{ fontSize: "5.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="disclosure-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Vulnerability Reporting Process</h2>
            <p>Our four-step cycle ensures vulnerability discoveries are handled securely and efficiently.</p>
          </div>
          <div className="process-timeline">
            {steps.map((st, idx) => {
              return (
                <article className="process-card" key={idx}>
                  <div className="process-node">
                    <i className={`bi ${st.icon}`} style={{ fontSize: "1.1rem" }}></i>
                  </div>
                  <h3>{st.title}</h3>
                  <p>{st.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-Scope Cards Section */}
      <section className="disclosure-section">
        <div className="section-container">
          <div className="section-header">
            <h2>What You Should Report</h2>
            <p>We encourage auditing and reporting of the following vulnerability areas inside our platform.</p>
          </div>
          <div className="scope-grid">
            {inScopeDocs.map((sc, idx) => {
              return (
                <div className="scope-card" key={idx}>
                  <div className="scope-card-icon">
                    <i className={`bi ${sc.icon}`} style={{ fontSize: "1.25rem" }}></i>
                  </div>
                  <div className="scope-card-info">
                    <h3>{sc.title}</h3>
                    <p>{sc.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="scope-caution-card">
            <div className="scope-caution-header">
              <div className="scope-caution-icon"><AlertOctagon size={20} /></div>
              <h3>Out of Scope Vulnerabilities</h3>
            </div>
            <p>
              The following actions and reports are strictly out of scope. Executing these tests will result in account termination and exclusions from security recognitions:
            </p>
            <ul className="scope-caution-list">
              {outOfScopeItems.map((item, idx) => (
                <li className="scope-caution-item" key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reporting Guidelines Checklist Card */}
      <section className="disclosure-section">
        <div className="section-container">
          <div className="guidelines-card">
            <div className="section-header" style={{ marginBottom: "2.5rem" }}>
              <h2>Reporting Guidelines</h2>
              <p>Please adhere to the following rules to ensure reports qualify for Hall of Fame credits.</p>
            </div>
            <div className="guidelines-grid">
              {guidelines.map((line, idx) => (
                <div className="guidelines-item" key={idx}>
                  <CheckCircle size={18} />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Card */}
      <section className="disclosure-section">
        <div className="section-container">
          <div className="commitment-card">
            <h2>Our Commitment to Security</h2>
            <p>
              We pledge to partner openly and transparently with the white-hat security community. When reporting issues, you can expect the following commitment guarantees from our legal and engineering teams:
            </p>
            <div className="commitment-grid">
              {commitments.map((line, idx) => (
                <div className="commitment-item" key={idx}>
                  <ShieldCheck size={18} />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HQ contact details Card */}
      <section id="contact-security-sec" className="disclosure-section">
        <div className="section-container">
          <div className="legal-contact-card">
            <div className="contact-card-info">
              <h3>Security Response Team</h3>
              <p>For submitting vulnerability reports or getting updates on your security validation cycles.</p>
              
              <div className="contact-card-details">
                <div className="contact-detail-row">
                  <i className="bi bi-shield-fill-check text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Vulnerability Response Team</h4>
                    <p>Security Operations</p>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <i className="bi bi-envelope-fill text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Email Submissions</h4>
                    <a href="mailto:security@crmplatform.org">security@crmplatform.org</a>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <i className="bi bi-telephone-fill text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Support Line</h4>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Location HQ</h4>
                    <p>Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-card-actions">
              <a href="mailto:security@crmplatform.org" className="btn-primary">
                Report Security Issue
              </a>
              <a href="mailto:security@crmplatform.org" className="btn-secondary">
                Email Security Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Grid */}
      <section className="disclosure-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Security Best Practices</h2>
            <p>Follow these dashboard practices to maintain maximum account lock-down integrity.</p>
          </div>
          <div className="practices-grid">
            {securityPractices.map((prac, idx) => {
              return (
                <article className="practice-card" key={idx}>
                  <div className="practice-icon">
                    <i className={`bi ${prac.icon}`} style={{ fontSize: "1.25rem" }}></i>
                  </div>
                  <h3>{prac.title}</h3>
                  <p>{prac.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance / Certification Center */}
      <section className="disclosure-section compliance-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Compliance & Trust Badges</h2>
            <p>We comply with enterprise standards to assure maximum customer trust.</p>
          </div>
          <div className="compliance-grid">
            {complianceBadges.map((badge, idx) => {
              return (
                <div className="compliance-card" key={idx}>
                  <div className="compliance-card-icon">
                    <i className={`bi ${badge.icon}`} style={{ fontSize: "1.25rem" }}></i>
                  </div>
                  <h3>{badge.title}</h3>
                  <p>{badge.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="disclosure-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Frequently Asked Security Questions</h2>
            <p>Find quick answers regarding our reporting SLA levels, bounty programs, and disclosure policies.</p>
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

      {/* Bottom CTA Banner */}
      <section className="disclosure-section legal-cta">
        <div className="section-container">
          <div className="legal-cta-inner">
            <h2>Help Us Keep the CRM Platform Secure</h2>
            <p>We appreciate responsible security research and welcome reports that help improve the safety of our platform.</p>
            <div className="legal-cta-buttons">
              <a href="#contact-security-sec" className="btn-primary">
                Report Vulnerability
              </a>
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

export default ResponsibleDisclosure;