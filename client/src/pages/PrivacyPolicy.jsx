import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  { id: "intro", label: "1. Introduction", icon: "bi-file-earmark-text" },
  { id: "collect", label: "2. Information We Collect", icon: "bi-database" },
  { id: "use", label: "3. How We Use Your Information", icon: "bi-eye" },
  { id: "cookies", label: "4. Cookies & Tracking", icon: "bi-sliders" },
  { id: "thirdparty", label: "5. Third-Party Services", icon: "bi-globe" },
  { id: "security", label: "6. Data Security", icon: "bi-lock" },
  { id: "retention", label: "7. Data Retention", icon: "bi-hourglass-split" },
  { id: "rights", label: "8. Your Rights", icon: "bi-person-check" },
  { id: "transfers", label: "9. International Data Transfers", icon: "bi-server" },
  { id: "children", label: "10. Children's Privacy", icon: "bi-shield-exclamation" },
  { id: "changes", label: "11. Changes to This Policy", icon: "bi-file-earmark-check" },
  { id: "contact-sec", label: "12. Contact Information", icon: "bi-envelope" }
];

const faqs = [
  {
    q: "What personal information does the CRM Platform collect?",
    a: "We collect information you provide directly to us, such as your name, business email address, company name, phone number, and billing details. We also collect usage analytics, device metadata, and browser types automatically when you interact with our platform."
  },
  {
    q: "How can I request the deletion of my account and data?",
    a: "You can request account and data deletion by clicking the 'Request Your Data' button under Section 8 (Your Rights) or by contacting our team directly at privacy@crmplatform.org. Once verified, we will permanently delete or anonymize your data within 30 days."
  },
  {
    q: "How do I manage my cookie preferences?",
    a: "You can manage cookie settings at any time by clicking the 'Manage Cookie Preferences' button under Section 4 (Cookies & Tracking) on this page or through the cookie banner preferences footer link. You can toggle functional, analytical, and marketing cookies off."
  },
  {
    q: "Is my CRM data encrypted?",
    a: "Yes. All data stored inside the CRM Platform is encrypted at rest using AES-256 encryption, and all communication between your browser and our servers is secured using SSL/TLS (HTTPS) transmission protocols."
  },
  {
    q: "Can I request a copy of my data?",
    a: "Absolutely. Under regional privacy rules (such as GDPR and CCPA), you are entitled to export your customer and account database. You can submit a data portability request using our interactive form under Section 8, and we will compile a secure JSON or CSV file for download."
  }
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [openFaq, setOpenFaq] = useState(null);
  
  // Modals state
  const [showCookiesModal, setShowCookiesModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  // Cookie preference toggles
  const [cookiePrefs, setCookiePrefs] = useState({
    essential: true, // Always true & disabled
    analytics: true,
    functional: true,
    marketing: false
  });
  const [showCookieSuccess, setShowCookieSuccess] = useState(false);
  
  // Request data form state
  const [requestForm, setRequestForm] = useState({
    name: "",
    email: "",
    type: "export",
    details: ""
  });
  const [showRequestSuccess, setShowRequestSuccess] = useState(false);

  // ScrollSpy implementation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

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

  // PDF Download Action
  const handleDownloadPDF = (e) => {
    e.preventDefault();
    window.print();
  };

  // Cookie Preference Save
  const handleSaveCookiePrefs = (e) => {
    e.preventDefault();
    setShowCookieSuccess(true);
    setTimeout(() => {
      setShowCookieSuccess(false);
      setShowCookiesModal(false);
    }, 1500);
  };

  // Request Data Form Submit
  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setShowRequestSuccess(true);
    setTimeout(() => {
      setShowRequestSuccess(false);
      setShowRequestModal(false);
      setRequestForm({ name: "", email: "", type: "export", details: "" });
    }, 2000);
  };

  return (
      <>
        <style>{`/* Premium Privacy Policy Stylesheet - SalesNova CRM */

.privacy-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background Gradients & Blurred Circles */
.privacy-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 25%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, rgba(37, 99, 235, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(40px);
}

.privacy-page::after {
  content: "";
  position: absolute;
  top: 800px;
  right: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(50px);
}

/* Hero Section */
.privacy-hero {
  padding: 8rem 0 4rem;
  background: radial-gradient(100% 100% at 50% 0%, rgba(219, 234, 254, 0.3) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.privacy-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.privacy-hero-content {
  flex: 1;
  max-width: 650px;
}

.privacy-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  color: #2563eb;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.04);
}

.privacy-hero-content h1 {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.privacy-hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 2rem;
}

.privacy-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.privacy-hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #2563eb;
  color: #ffffff;
  padding: 0.875rem 1.75rem;
  border-radius: 9999px;
  font-weight: 600;
  border: none;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);
  text-decoration: none;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  color: #334155;
  padding: 0.875rem 1.75rem;
  border-radius: 9999px;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  transform: translateY(-1px);
}

.privacy-hero-illustration {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 400px;
}

.shield-wrapper {
  background: #ffffff;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03);
  position: relative;
  animation: float 6s ease-in-out infinite;
}

.shield-pulse {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 1px dashed rgba(37, 99, 235, 0.15);
  border-radius: 50%;
  animation: rotate 30s linear infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

/* Layout Grid */
.privacy-layout {
  padding: 5rem 0;
  position: relative;
  z-index: 2;
}

.privacy-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Sticky Sidebar */
.privacy-sidebar {
  position: sticky;
  top: 140px; /* Safe distance below sticky header */
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-right: 1rem;
}

/* Custom scrollbar for sidebar */
.privacy-sidebar::-webkit-scrollbar {
  width: 4px;
}
.privacy-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.privacy-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 1rem;
  padding-left: 0.75rem;
}

.privacy-nav-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.privacy-nav-link a {
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

.privacy-nav-link a:hover {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.04);
}

.privacy-nav-link.active a {
  color: #2563eb;
  background: #eff6ff;
  border-left-color: #2563eb;
  font-weight: 600;
}

/* Main Content Area */
.privacy-content {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Premium Content Cards */
.privacy-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.5rem;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.015);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.privacy-card:hover {
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
}

.privacy-card-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.privacy-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f0f7ff;
  color: #2563eb;
}

.privacy-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.privacy-card p {
  font-size: 1rem;
  line-height: 1.7;
  color: #475569;
  margin-bottom: 1.25rem;
}

.privacy-card p:last-child {
  margin-bottom: 0;
}

.privacy-card ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.875rem;
  margin: 1.5rem 0;
}

.privacy-card li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
}

.privacy-card li::before {
  content: "✓";
  color: #2563eb;
  font-weight: 700;
  font-size: 0.9rem;
  margin-top: 0.1rem;
}

/* Card Specific Buttons */
.card-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #eff6ff;
  color: #2563eb;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  border: 1px solid #dbeafe;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.card-action-btn:hover {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

/* Partner Logos / Badges Grid */
.partners-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.partner-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.partner-badge:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

/* Security Trust Badges */
.trust-badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.trust-badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 1rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.trust-badge-card:hover {
  background: #ffffff;
  border-color: #2563eb;
  border-style: solid;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.05);
}

.trust-badge-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.trust-badge-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.trust-badge-desc {
  font-size: 0.75rem;
  color: #64748b;
}

/* Contact Grid */
.privacy-contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.contact-info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.contact-info-icon {
  color: #2563eb;
  margin-top: 0.2rem;
}

.contact-info-details h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.contact-info-details p, .contact-info-details a {
  font-size: 0.875rem;
  color: #475569;
  text-decoration: none;
  word-break: break-all;
}

.contact-info-details a:hover {
  color: #2563eb;
}

/* FAQ Accordion Section */
.privacy-faq {
  padding: 6rem 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  z-index: 2;
}

.faq-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3.5rem;
}

.faq-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.faq-header p {
  font-size: 1.1rem;
  color: #475569;
}

.faq-accordion-list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.faq-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.015);
}

.faq-item.open {
  border-color: #dbeafe;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.04);
}

.faq-question-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #ffffff;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.faq-question-btn:hover {
  background-color: #f8fafc;
}

.faq-item.open .faq-question-btn {
  background-color: #eff6ff;
  color: #2563eb;
}

.faq-toggle-icon {
  color: #64748b;
  transition: transform 0.2s ease;
}

.faq-item.open .faq-toggle-icon {
  transform: rotate(180deg);
  color: #2563eb;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0, 1, 0, 1), padding 0.3s ease;
  background: #ffffff;
}

.faq-item.open .faq-answer {
  max-height: 1000px; /* Arbitrary high value to fit text */
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  transition: max-height 0.3s cubic-bezier(1, 0, 1, 0), padding 0.3s ease;
}

.faq-answer p {
  color: #475569;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Bottom CTA Section */
.privacy-cta {
  padding: 6rem 0;
  background: radial-gradient(100% 100% at 50% 100%, rgba(219, 234, 254, 0.25) 0%, rgba(248, 250, 252, 0) 100%);
  position: relative;
  z-index: 2;
}

.privacy-cta-inner {
  max-width: 750px;
  margin: 0 auto;
  text-align: center;
  background: #ffffff;
  padding: 4rem 3rem;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.02);
}

.privacy-cta-inner h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.privacy-cta-inner p {
  font-size: 1.125rem;
  color: #475569;
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

.privacy-cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Modals for Preferences & Request Data */
.privacy-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

.privacy-modal {
  background: #ffffff;
  border-radius: 20px;
  width: 90%;
  max-width: 550px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  color: #475569;
  background: #f1f5f9;
}

.modal-header {
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.modal-header p {
  font-size: 0.9rem;
  color: #64748b;
}

.modal-body {
  margin-bottom: 2rem;
}

/* Cookie Preferences Form */
.cookie-option-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cookie-option-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.cookie-option-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cookie-option-info {
  flex: 1;
}

.cookie-option-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.cookie-option-desc {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.4;
}

/* Switch Toggle Styling */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:checked + .slider {
  background-color: #2563eb;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

input:disabled + .slider {
  background-color: #e2e8f0;
  cursor: not-allowed;
}

/* Request Data Form */
.request-data-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #334155;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  color: #0f172a;
  transition: all 0.2s ease;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem 0;
}

.success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #d1fae5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.success-message h4 {
  font-size: 1.25rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.success-message p {
  font-size: 0.925rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .privacy-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  
  .privacy-sidebar {
    position: static;
    max-height: none;
    overflow-y: visible;
    padding-right: 0;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1.5rem;
  }
  
  .privacy-nav-links {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .privacy-nav-link a {
    border-left: none;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .privacy-nav-link.active a {
    border-left-color: transparent;
    border-bottom-color: #2563eb;
    background: #eff6ff;
  }
}

@media (max-width: 768px) {
  .privacy-hero {
    padding: 6rem 0 3rem;
  }
  
  .privacy-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .privacy-hero-content {
    max-width: 100%;
  }
  
  .privacy-hero-actions {
    justify-content: center;
  }
  
  .privacy-hero-illustration {
    display: none;
  }
  
  .privacy-card {
    padding: 1.75rem;
  }
  
  .privacy-cta-inner {
    padding: 2.5rem 1.5rem;
  }
  
  .privacy-cta-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .privacy-cta-buttons .btn-primary,
  .privacy-cta-buttons .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .faq-question-btn {
    font-size: 0.95rem;
    padding: 1.25rem;
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
    <div className="privacy-page">
      <Navbar />

      {/* Hero Section */}
      <header className="privacy-hero">
        <div className="container" style={{ marginBottom: "1rem" }}>
          <a href="/legal" className="back-breadcrumb">
            <i className="bi bi-arrow-left" style={{ marginRight: "0.5rem" }}></i> Back to Legal Center
          </a>
        </div>
        <div className="container privacy-hero-inner">
          <div className="privacy-hero-content">
            <div className="privacy-badge">
              <i className="bi bi-shield-lock" style={{ marginRight: "0.5rem" }}></i>
              <span>Privacy & Security</span>
            </div>
            <h1>Privacy Policy</h1>
            <p className="privacy-hero-subtitle">
              Your privacy matters to us. This Privacy Policy explains how the CRM Platform collects, uses, protects, and manages your personal information when you use our website and services.
            </p>
            <p className="privacy-meta">
              <strong>Last Updated:</strong> July 2026
            </p>
            <div className="privacy-hero-actions">
              <a href="#contact-sec" className="btn-primary">
                Contact Privacy Team
              </a>
              <a href="#" onClick={handleDownloadPDF} className="btn-secondary">
                <i className="bi bi-download" style={{ marginRight: "0.5rem" }}></i>
                Download PDF
              </a>
            </div>
          </div>
          <div className="privacy-hero-illustration">
            <div className="shield-wrapper">
              <div className="shield-pulse"></div>
              <div className="legal-illustration-core" style={{ textAlign: "center" }}>
                <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: "5.5rem" }}></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <section className="privacy-layout">
        <div className="container privacy-grid">
          
          {/* Quick Navigation Sidebar */}
          <aside className="privacy-sidebar">
            <h3 className="sidebar-title">Quick Navigation</h3>
            <ul className="privacy-nav-links">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <li 
                    key={sec.id} 
                    className={`privacy-nav-link ${activeSection === sec.id ? "active" : ""}`}
                  >
                    <a href={`#${sec.id}`}>
                      {sec.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Core Content cards */}
          <div className="privacy-content">
            
            {/* 1. Introduction */}
            <article id="intro" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-file-earmark-text text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>1. Introduction</h2>
              </div>
              <p>
                Welcome to the CRM Platform. We respect your privacy and are deeply committed to protecting the personal information you share with us. This policy describes our practices regarding the collection, processing, usage, transmission, and preservation of data when you utilize our customer relationship management software platform, website, mobile apps, and developer API environments.
              </p>
              <p>
                By accessing our services, you consent to the collection and use of information in accordance with this policy. If you do not agree with any terms outlined here, please refrain from submitting personal data or using our applications.
              </p>
            </article>

            {/* 2. Information We Collect */}
            <article id="collect" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-database text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>2. Information We Collect</h2>
              </div>
              <p>
                We collect personal and technical information to deliver robust and personalized CRM services. This data falls into several major categories:
              </p>
              <ul>
                <li><strong>Personal Information:</strong> Full names, job titles, and roles within your enterprise organization.</li>
                <li><strong>Contact Details:</strong> Business email addresses, telephone numbers, and corporate physical addresses.</li>
                <li><strong>Business Info:</strong> Company domain, employee size, industry vertical, and financial billing credentials.</li>
                <li><strong>Account Credentials:</strong> Secured hashes of usernames, passwords, and API key tokens.</li>
                <li><strong>Device Information:</strong> Hardware models, operating systems, and local screen configurations.</li>
                <li><strong>Browser Metadata:</strong> Browser type, version, language configuration, and network routing configurations.</li>
                <li><strong>Usage Analytics:</strong> Timing of logins, feature utilization rates, and navigation clickstreams inside dashboards.</li>
              </ul>
            </article>

            <article id="use" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-eye text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>3. How We Use Your Information</h2>
              </div>
              <p>
                The CRM Platform does not sell or rent your personal information to third parties. We use your data exclusively for operational, engineering, and support processes:
              </p>
              <ul>
                <li>Providing core CRM databases, pipelines, contact lists, and automated calendar systems.</li>
                <li>Improving website aesthetics, UI component rendering, and custom developer APIs.</li>
                <li>Responding to customer support tickets and tracking resolving durations.</li>
                <li>Enhancing forecasting dashboards using machine learning recommendation models.</li>
                <li>Sending platform service alerts, feature rollouts, and periodic marketing digests.</li>
                <li>Monitoring system load, mitigating DDoS attempts, and validating credentials.</li>
                <li>Complying with statutory audits, court orders, and standard business tax calculations.</li>
              </ul>
            </article>

            {/* 4. Cookies & Tracking */}
            <article id="cookies" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-sliders text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>4. Cookies & Tracking</h2>
              </div>
              <p>
                We utilize first-party and third-party cookies, tracking beacons, and local storage elements to manage platform logins, retain dashboard states, and monitor performance.
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> Critical for core session authentication and database authorization mapping.</li>
                <li><strong>Analytics Cookies:</strong> Utilized to compile aggregate, anonymous reports on navigation patterns and page response lags.</li>
                <li><strong>Functional Cookies:</strong> Retain layout preferences, side navigation toggle states, and preferred light/dark themes.</li>
                <li><strong>Marketing Cookies:</strong> Employed to evaluate advertising campaign ROI and display targeted newsletters.</li>
              </ul>
              <button className="card-action-btn" onClick={() => setShowCookiesModal(true)}>
                Manage Cookie Preferences
              </button>
            </article>

            {/* 5. Third-Party Services */}
            <article id="thirdparty" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-globe text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>5. Third-Party Services</h2>
              </div>
              <p>
                To provide standard cloud functionality, we integrate with secure external systems. We share only the minimum required information to perform these tasks:
              </p>
              <div className="partners-badges-grid">
                <div className="partner-badge">Google Analytics</div>
                <div className="partner-badge">Stripe Payments</div>
                <div className="partner-badge">Slack Integration</div>
                <div className="partner-badge">Microsoft Azure</div>
                <div className="partner-badge">GitHub OAuth</div>
              </div>
              <p style={{ marginTop: '1.25rem' }}>
                We certify that all integrated third-party partners undergo rigorous annual compliance audits and maintain enterprise privacy controls.
              </p>
            </article>

            {/* 6. Data Security */}
            <article id="security" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-lock text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>6. Data Security</h2>
              </div>
              <p>
                We execute state-of-the-art administrative, technical, and physical safeguards designed to prevent unauthorized access, loss, modification, or exposure of your customer databases:
              </p>
              <ul>
                <li><strong>End-to-End Encryption:</strong> Encrypted data transport via TLS 1.3 protocols, and database rest encryption using AES-256 blocks.</li>
                <li><strong>Secure Infrastructure:</strong> Virtual private clouds isolated from public routing, protected by enterprise firewalls.</li>
                <li><strong>Access Control:</strong> strict role-based access rules limiting backend database visibility to authorized engineers.</li>
                <li><strong>Active Monitoring:</strong> 24/7 logging of database queries, automated intrusion alerts, and system vulnerability sweeps.</li>
                <li><strong>Multi-Factor Authentication:</strong> Mandatory MFA logins for customer panels and administrative dashboards.</li>
              </ul>
              <div className="trust-badges-grid">
                <div className="trust-badge-card">
                  <span className="trust-badge-icon">🔒</span>
                  <span className="trust-badge-title">SSL Secured</span>
                  <span className="trust-badge-desc">256-bit encryption</span>
                </div>
                <div className="trust-badge-card">
                  <span className="trust-badge-icon">✓</span>
                  <span className="trust-badge-title">GDPR Ready</span>
                  <span className="trust-badge-desc">Full rights compliance</span>
                </div>
                <div className="trust-badge-card">
                  <span className="trust-badge-icon">🛡️</span>
                  <span className="trust-badge-title">ISO 27001</span>
                  <span className="trust-badge-desc">Certified center</span>
                </div>
                <div className="trust-badge-card">
                  <span className="trust-badge-icon">🏢</span>
                  <span className="trust-badge-title">SOC 2 Practices</span>
                  <span className="trust-badge-desc">Audited procedures</span>
                </div>
              </div>
            </article>

            {/* 7. Data Retention */}
            <article id="retention" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-hourglass-split text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>7. Data Retention</h2>
              </div>
              <p>
                We store your personal and enterprise customer databases only as long as your account remains active. If you cancel your subscription or delete your account, we trigger automated sanitization protocols.
              </p>
              <p>
                All account data, pipelines, and user info are completely purged from active instances within 14 business days. Backups are retained for a maximum of 30 days before being completely rewritten.
              </p>
            </article>

            {/* 8. Your Rights */}
            <article id="rights" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-person-check text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>8. Your Rights</h2>
              </div>
              <p>
                We grant all users, regardless of geographic location, comprehensive control over their personal data in accordance with modern privacy standards:
              </p>
              <ul>
                <li>The right to inspect and access all collected records about your account.</li>
                <li>The right to update, correct, or refine outdated billing and profile information.</li>
                <li>The right to request absolute deletion of all account databases and files.</li>
                <li>The right to request full export of customer datasets in structured CSV or JSON formats.</li>
                <li>The right to opt-out of marketing newsletters and third-party analytics mapping.</li>
              </ul>
              <button className="card-action-btn" onClick={() => setShowRequestModal(true)}>
                Request Your Data
              </button>
            </article>

            {/* 9. International Data Transfers */}
            <article id="transfers" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-server text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>9. International Data Transfers</h2>
              </div>
              <p>
                 Our platform is based in India, with primary server storage clusters in the Asia-Pacific region, North America, and Europe. In order to provide rapid dashboard latency, your data may be routed across international lines.
              </p>
              <p>
                Whenever we execute cross-border data routing, we implement standard contractual clauses (SCCs) to ensure equivalent security and privacy standards.
              </p>
            </article>

            {/* 10. Children's Privacy */}
            <article id="children" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-shield-exclamation text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>10. Children's Privacy</h2>
              </div>
              <p>
                Our enterprise SaaS CRM platforms and API systems are strictly targeted at adults, company owners, and sales representatives. We do not intentionally compile information about children under 13 years of age.
              </p>
              <p>
                If we discover that a minor under 13 has submitted personal contact information, we will immediately initiate deletion protocols to scrub their metadata from our databases.
              </p>
            </article>

            <article id="changes" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-file-earmark-check text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>11. Changes to This Policy</h2>
              </div>
              <p>
                We reserve the right to modify this Privacy Policy as our features evolve or compliance requirements adapt. We will alert users of major revisions via email newsletters or conspicuous alerts on the dashboard interface.
              </p>
              <p>
                 Your continued use of the CRM Platform after updates constitute acknowledgment and acceptance of the revised policies.
              </p>
            </article>

            {/* 12. Contact Information */}
            <article id="contact-sec" className="privacy-card">
              <div className="privacy-card-header">
                <div className="privacy-card-icon"><i className="bi bi-envelope text-primary" style={{ fontSize: "1.3rem" }}></i></div>
                <h2>12. Contact Information</h2>
              </div>
              <p>
                If you have queries, complaints, or feedback regarding our privacy policies, data collection procedures, or trust compliance certifications, please contact our dedicated officers:
              </p>
              <div className="privacy-contact-grid">
                <div className="contact-info-card">
                  <div className="contact-info-icon"><i className="bi bi-shield-fill-check text-primary" style={{ fontSize: "1.25rem" }}></i></div>
                  <div className="contact-info-details">
                    <h4>Privacy Team</h4>
                     <p>Legal Department</p>
                  </div>
                </div>
                <div className="contact-info-card">
                  <div className="contact-info-icon"><i className="bi bi-envelope-fill text-primary" style={{ fontSize: "1.25rem" }}></i></div>
                  <div className="contact-info-details">
                    <h4>Email Address</h4>
                     <a href="mailto:privacy@crmplatform.org">privacy@crmplatform.org</a>
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
                  <div className="contact-info-icon"><i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: "1.25rem" }}></i></div>
                  <div className="contact-info-details">
                    <h4>HQ Address</h4>
                    <p>Hyderabad, Telangana, India</p>
                  </div>
                </div>
              </div>
            </article>

          </div>
        </div>
      </section>

      {/* FAQ Section Accordion */}
      <section className="privacy-faq">
        <div className="container">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Get quick answers to common questions about your privacy, account deletion, and cookie settings.</p>
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

      {/* Bottom CTA Section */}
      <section className="privacy-cta">
        <div className="container">
          <div className="privacy-cta-inner">
            <h2>Have Questions About Your Privacy?</h2>
            <p>Our privacy specialists are here to help you understand how your information is protected.</p>
            <div className="privacy-cta-buttons">
              <a href="#contact-sec" className="btn-primary">
                Contact Privacy Team
              </a>
              <a href="/" className="btn-secondary">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* Cookie Preferences Modal */}
      {showCookiesModal && (
        <div className="privacy-modal-overlay" onClick={() => setShowCookiesModal(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowCookiesModal(false)}>
              <i className="bi bi-x-lg" style={{ fontSize: "1.1rem" }}></i>
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
                    <label htmlFor="req-name">Full Name</label>
                    <input 
                      id="req-name"
                      type="text" 
                      required 
                      placeholder="e.g. John Doe"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="req-email">Work Email</label>
                    <input 
                      id="req-email"
                      type="email" 
                      required 
                      placeholder="e.g. john@company.com"
                      value={requestForm.email}
                      onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label htmlFor="req-type">Action Requested</label>
                    <select 
                      id="req-type"
                      value={requestForm.type}
                      onChange={(e) => setRequestForm({...requestForm, type: e.target.value})}
                    >
                      <option value="export">Export All My Data (JSON/CSV)</option>
                      <option value="access">Access and Inspect My Collected Records</option>
                      <option value="update">Update or Correct Inaccurate Information</option>
                      <option value="delete">Delete My Account and Purge All My Data</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="req-details">Additional Details</label>
                    <textarea 
                      id="req-details"
                      rows="3" 
                      placeholder="Please specify any particular date range or database table details..."
                      value={requestForm.details}
                      onChange={(e) => setRequestForm({...requestForm, details: e.target.value})}
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

export default PrivacyPolicy;