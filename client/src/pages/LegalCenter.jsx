import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const legalDocs = [
  {
    title: "Privacy Policy",
    desc: "Understand how we collect, use, process, and protect your personal information.",
    path: "/privacy-policy",
    icon: "bi-shield-check"
  },
  {
    title: "Terms of Service",
    desc: "Learn the rules, terms, and legal conditions for using the CRM Platform.",
    path: "/terms-of-service",
    icon: "bi-file-earmark-text"
  },
  {
    title: "Cookie Policy",
    desc: "Learn how cookies improve your browsing and analytical experience on our site.",
    path: "/cookie-policy",
    icon: "bi-cookie"
  },
  {
    title: "Responsible Disclosure",
    desc: "Understand how to report platform security vulnerabilities responsibly.",
    path: "/responsible-disclosure",
    icon: "bi-shield-exclamation"
  },
  {
    title: "Trust Center",
    desc: "View our real-time system status, infrastructure details, and security measures.",
    path: "/trust-center",
    icon: "bi-shield-lock"
  },
  {
    title: "Accessibility Statement",
    desc: "Our ongoing commitment to providing an inclusive experience for all users.",
    path: "/accessibility",
    icon: "bi-person-square"
  },
  {
    title: "Acceptable Use Policy",
    desc: "Clear guidelines on acceptable behaviors and uses of the CRM Platform.",
    path: "/acceptable-use",
    icon: "bi-check2-circle"
  },
  {
    title: "Data Processing Agreement (DPA)",
    desc: "Information regarding GDPR, SCCs, and customer data processing guidelines.",
    path: "/data-processing-agreement",
    icon: "bi-database-check"
  }
];

const complianceBadges = [
  { title: "GDPR Ready", desc: "Full citizen rights compliance", icon: "bi-shield-check" },
  { title: "ISO 27001", desc: "Information security management", icon: "bi-patch-check" },
  { title: "SOC 2 Practices", desc: "Audited operational procedures", icon: "bi-safe" },
  { title: "SSL Encrypted", desc: "256-bit data transit tunnels", icon: "bi-lock-fill" },
  { title: "24/7 Monitoring", desc: "Intrusion protection active", icon: "bi-activity" },
  { title: "99.99% Uptime", desc: "High availability SLA SLA", icon: "bi-lightning-fill" }
];

const faqs = [
  {
    q: "Where can I find the Privacy Policy?",
    a: "Our Privacy Policy can be accessed directly at /privacy-policy or by clicking the 'Privacy Policy' card on this Legal Center hub. It provides deep visibility into our data practices."
  },
  {
    q: "How do I request deletion of my data?",
    a: "You can submit an automated deletion request by clicking the 'Request Your Data' button in the User Rights section of this page. Alternatively, you can email privacy@crmplatform.org with your details."
  },
  {
    q: "What cookies are used?",
    a: "We utilize essential session cookies for user logins, analytical cookies to identify load failures, functional cookies to store dashboard layouts, and occasional marketing cookies for newsletter outreach. Check out our Cookie Policy page to configure settings."
  },
  {
    q: "Is the CRM Platform GDPR compliant?",
    a: "Yes, the CRM Platform fully implements all core provisions of the General Data Protection Regulation (GDPR) for global users, including right to access, right to rectification, data portability, and right to be forgotten."
  },
  {
    q: "How do I report a security issue?",
    a: "We welcome security researchers. Please review our Responsible Disclosure policy page for instructions on submitting reports safely and getting logged in our security Hall of Fame."
  },
  {
    q: "How can I contact the legal team?",
    a: "Our compliance officers and legal counsel can be reached via email at legal@crmplatform.org or by calling +91 98765 43210. You can also write to our HQ located in Hyderabad, India."
  }
];

const LegalCenter = () => {
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
        <style>{`/* Premium Legal Center Stylesheet - SalesNova CRM */

.legal-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background Gradients & Blurred Circles */
.legal-page::before {
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

.legal-page::after {
  content: "";
  position: absolute;
  top: 1200px;
  left: 5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(40px);
}

/* Hero Section */
.legal-hero {
  padding: 8.5rem 0 5rem;
  background: radial-gradient(120% 120% at 50% 0%, rgba(219, 234, 254, 0.35) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.legal-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.legal-hero-content {
  flex: 1.2;
  max-width: 700px;
}

.legal-badge {
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

.legal-hero-content h1 {
  font-size: clamp(2.75rem, 4.5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
}

.legal-hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.legal-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.legal-hero-actions {
  display: flex;
  gap: 1rem;
}

/* Right Side Illustration */
.legal-hero-illustration {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 440px;
}

.legal-art-wrapper {
  background: #ffffff;
  width: 300px;
  height: 300px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.03);
  position: relative;
  animation: floatArt 6s ease-in-out infinite;
}

@keyframes floatArt {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
}

.legal-art-badge {
  position: absolute;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.badge-top-left {
  top: 15px;
  left: -20px;
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.badge-bottom-right {
  bottom: 25px;
  right: -25px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

/* Sections General */
.legal-section {
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
  margin: 0 auto 4rem;
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

/* Documents Grid */
.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.doc-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.015);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.doc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.15);
}

.doc-card-top {
  margin-bottom: 2rem;
}

.doc-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #f0f7ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;
}

.doc-card:hover .doc-card-icon {
  background: #2563eb;
  color: #ffffff;
  transform: scale(1.05);
}

.doc-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.doc-card p {
  font-size: 0.925rem;
  line-height: 1.55;
  color: #475569;
}

.doc-card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
  transition: all 0.2s ease;
}

.doc-card-link:hover {
  color: #1d4ed8;
  gap: 0.5rem;
}

/* Compliance Section */
.compliance-section {
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.compliance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 1.5rem;
}

.compliance-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.01);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.25s ease;
}

.compliance-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
  border-color: #cbd5e1;
}

.compliance-card-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f0f7ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  font-size: 1.25rem;
}

.compliance-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.35rem;
}

.compliance-card p {
  font-size: 0.75rem;
  color: #64748b;
}

/* User Rights Section */
.rights-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  background: radial-gradient(100% 100% at 0% 0%, rgba(239, 246, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 4rem;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.015);
}

.rights-content {
  flex: 1.2;
  max-width: 650px;
}

.rights-content h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.rights-content p {
  font-size: 1.05rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.rights-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.rights-list-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.95rem;
  color: #475569;
  font-weight: 500;
}

.rights-list-item svg {
  color: #2563eb;
  flex-shrink: 0;
}

.rights-cta {
  flex: 0.8;
  display: flex;
  justify-content: center;
}

/* FAQ Accordion List (Uses same style structure from PrivacyPolicy but refined) */
.faq-accordion-list {
  max-width: 900px;
  margin: 0 auto;
}

/* Contact Section */
.legal-contact-section {
  background: #f8fafc;
}

.legal-contact-card {
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3.5rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.contact-card-info h3 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.contact-card-info p {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.contact-card-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-detail-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-detail-row svg {
  color: #2563eb;
  margin-top: 0.15rem;
  flex-shrink: 0;
}

.contact-detail-row h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.15rem;
}

.contact-detail-row p, .contact-detail-row a {
  font-size: 0.875rem;
  color: #475569;
  text-decoration: none;
}

.contact-detail-row a:hover {
  color: #2563eb;
}

.contact-card-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-card-actions .btn-primary,
.contact-card-actions .btn-secondary {
  width: 100%;
  justify-content: center;
  padding: 1rem;
}

/* Bottom CTA */
.legal-cta {
  background: radial-gradient(100% 100% at 50% 100%, rgba(219, 234, 254, 0.3) 0%, rgba(248, 250, 252, 0) 100%);
}

.legal-cta-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background: #ffffff;
  padding: 4rem 3rem;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.02);
}

.legal-cta-inner h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.legal-cta-inner p {
  font-size: 1.1rem;
  color: #475569;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.legal-cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .rights-layout {
    flex-direction: column;
    padding: 3rem;
    gap: 2.5rem;
  }
  .rights-content {
    max-width: 100%;
  }
  .rights-cta {
    width: 100%;
  }
  .rights-cta .btn-primary {
    width: 100%;
    justify-content: center;
  }
  .legal-contact-card {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2.5rem;
  }
}

@media (max-width: 768px) {
  .legal-hero {
    padding: 6.5rem 0 3.5rem;
  }
  .legal-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  .legal-hero-actions {
    justify-content: center;
  }
  .legal-hero-illustration {
    display: none;
  }
  .doc-card {
    padding: 1.75rem;
  }
  .compliance-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .rights-list {
    grid-template-columns: 1fr;
  }
  .legal-cta-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  .legal-cta-buttons .btn-primary,
  .legal-cta-buttons .btn-secondary {
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
    <div className="legal-page">
      <Navbar />

      {/* Hero Section */}
      <header className="legal-hero">
        <div className="container" style={{ marginBottom: "1rem" }}>
          <a href="/" className="back-breadcrumb">
            <i className="bi bi-arrow-left" style={{ marginRight: "0.5rem" }}></i> Back to Home
          </a>
        </div>
        <div className="container legal-hero-inner">
          <div className="legal-hero-content">
            <div className="legal-badge">
              <span>⚖️ Legal & Compliance</span>
            </div>
            <h1>Legal Center</h1>
            <p className="legal-hero-subtitle">
              Access all legal documents, privacy policies, compliance information, and customer agreements in one secure location. We are committed to transparency, trust, and protecting your rights while using the CRM Platform.
            </p>
            <p className="legal-meta">
              <strong>Last Updated:</strong> July 2026
            </p>
            <div className="legal-hero-actions">
              <a href="#documents" className="btn-primary">
                View Policies
              </a>
              <a href="#contact-legal-sec" className="btn-secondary">
                Contact Legal Team
              </a>
            </div>
          </div>
          <div className="legal-hero-illustration">
            <div className="legal-art-wrapper">
              <div className="legal-art-badge badge-top-left">
                <i className="bi bi-shield-fill-check text-success"></i> GDPR Ready
              </div>
              <div className="legal-art-badge badge-bottom-right">
                <i className="bi bi-lock-fill text-primary"></i> SSL Secured
              </div>
              <div className="legal-illustration-core" style={{ textAlign: "center" }}>
                <i className="bi bi-file-earmark-lock text-primary" style={{ fontSize: "5.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Documents Grid Section */}
      <section id="documents" className="legal-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Legal Documents</h2>
            <p>Select a document below to review full definitions, customer guarantees, and legal parameters.</p>
          </div>
          <div className="docs-grid">
            {legalDocs.map((doc, idx) => {
              return (
                <article className="doc-card" key={idx}>
                  <div className="doc-card-top">
                    <div className="doc-card-icon">
                      <i className={`bi ${doc.icon}`} style={{ fontSize: "1.5rem" }}></i>
                    </div>
                    <h3>{doc.title}</h3>
                    <p>{doc.desc}</p>
                  </div>
                  <a href={doc.path} className="doc-card-link">
                    Read {doc.title} <i className="bi bi-arrow-right" style={{ marginLeft: "0.25rem" }}></i>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance / Certification Center */}
      <section className="legal-section compliance-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Security & Compliance</h2>
            <p>The CRM Platform complies with global privacy architectures and audits to guarantee absolute trust.</p>
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

      {/* User Rights Section */}
      <section className="legal-section">
        <div className="section-container">
          <div className="rights-layout">
            <div className="rights-content">
              <h2>Your Privacy Rights</h2>
              <p>
                We believe your data belongs to you. Under our global trust parameters, you have the right to access, rectify, export, or permanently erase your files from our CRM databases. Submit a request to our legal team instantly.
              </p>
              <div className="rights-list">
                <div className="rights-list-item">
                  <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "0.5rem" }}></i> Access personal data
                </div>
                <div className="rights-list-item">
                  <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "0.5rem" }}></i> Correct info fields
                </div>
                <div className="rights-list-item">
                  <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "0.5rem" }}></i> Request full deletion
                </div>
                <div className="rights-list-item">
                  <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "0.5rem" }}></i> Export CRM databases
                </div>
                <div className="rights-list-item">
                  <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "0.5rem" }}></i> Withdraw marketing consent
                </div>
                <div className="rights-list-item">
                  <i className="bi bi-check-circle-fill text-success" style={{ marginRight: "0.5rem" }}></i> Contact legal counsel
                </div>
              </div>
            </div>
            <div className="rights-cta">
              <button className="btn-primary" onClick={() => setShowRequestModal(true)}>
                Request Your Data →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="legal-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Legal Center FAQs</h2>
            <p>Find rapid answers to the most common queries surrounding our guidelines and compliance policies.</p>
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

      {/* Contact Legal Section */}
      <section id="contact-legal-sec" className="legal-section legal-contact-section">
        <div className="section-container">
          <div className="legal-contact-card">
            <div className="contact-card-info">
              <h3>Contact Our Legal Team</h3>
              <p>For concerns regarding compliance standard practices, GDPR audits, or security discoveries.</p>
              
              <div className="contact-card-details">
                <div className="contact-detail-row">
                  <i className="bi bi-shield-fill-check text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Legal & Compliance Department</h4>
                    <p>CRM Platform Group Ltd.</p>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <i className="bi bi-envelope-fill text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Email Inquiries</h4>
                    <a href="mailto:legal@crmplatform.org">legal@crmplatform.org</a>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <i className="bi bi-telephone-fill text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Phone (Toll Free India)</h4>
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </div>
                </div>
                <div className="contact-detail-row">
                  <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: "1.25rem" }}></i>
                  <div>
                    <h4>Registered Office</h4>
                    <p>Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-card-actions">
              <a href="mailto:legal@crmplatform.org" className="btn-primary">
                Email Legal Team
              </a>
              <a href="#contact" className="btn-secondary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="legal-section legal-cta">
        <div className="section-container">
          <div className="legal-cta-inner">
            <h2>Need Legal Assistance?</h2>
            <p>Our legal and compliance team is here to help with privacy, security, and policy-related questions.</p>
            <div className="legal-cta-buttons">
              <a href="#contact-legal-sec" className="btn-primary">
                Contact Legal Team
              </a>
              <a href="/" className="btn-secondary">
                Return Home
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Request Your Data Modal */}
      {showRequestModal && (
        <div className="privacy-modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowRequestModal(false)}>
              <i className="bi bi-x-lg" style={{ fontSize: "1.1rem" }}></i>
            </button>
            <div className="modal-header">
              <h3>Request Your Personal Data</h3>
              <p>Submit a secure request to access, export, or purge your account data records.</p>
            </div>

            {showRequestSuccess ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h4>Request Received Successfully</h4>
                <p>Our compliance officers have logged your request. We will contact you at the provided email address within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="request-data-form">
                <div className="modal-body">
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="lc-req-name">Full Name</label>
                    <input
                      id="lc-req-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="lc-req-email">Work Email</label>
                    <input
                      id="lc-req-email"
                      type="email"
                      required
                      placeholder="e.g. john@company.com"
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="lc-req-type">Action Requested</label>
                    <select
                      id="lc-req-type"
                      value={requestForm.type}
                      onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                    >
                      <option value="export">Export All My Data (JSON/CSV)</option>
                      <option value="access">Access and Inspect My Collected Records</option>
                      <option value="update">Update or Correct Inaccurate Information</option>
                      <option value="delete">Delete My Account and Purge All My Data</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lc-req-details">Additional Details</label>
                    <textarea
                      id="lc-req-details"
                      rows="3"
                      placeholder="Please specify any particular date range or database table details..."
                      value={requestForm.details}
                      onChange={(e) => setRequestForm({ ...requestForm, details: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  
      </>);
};

export default LegalCenter;