import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Compass,
  Briefcase,
  Globe,
  BookOpen,
  ShieldAlert,
  Heart,
  Award,
  Leaf,
  FileText,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  ThumbsUp,
  X,
  ExternalLink
} from "lucide-react";

const timelineEvents = [
  { year: "2021", title: "CRM Platform Founded", desc: "Started with a vision of simplifying CRM workflows for growing teams, launched by 3 developers in Hyderabad." },
  { year: "2023", title: "Series A Financing", desc: "Raised $8M to scale hosted cloud storage infrastructures and double engineering team capacity." },
  { year: "2025", title: "AI Assistant Integration", desc: "Rolled out our AI Assistant to automate follow-up letters and pipeline predictions." },
  { year: "2026", title: "Empowering 10,000+ Teams", desc: "Now a global platform maintaining 99.99% system uptime across enterprise customers." }
];

const coreValues = [
  { title: "Trust and Transparency", desc: "We protect customer database privacy with enterprise security certifications.", icon: ShieldCheck },
  { title: "Continuous Innovation", desc: "We build intuitive tools like AI models to save sales reps manual hours.", icon: Award },
  { title: "Customer Obsession", desc: "Our platform lifecycle rotates around keeping client workflows simple.", icon: Heart }
];

const jobsList = [
  { title: "Senior React Engineer", dept: "Engineering", location: "Hyderabad, India / Remote", desc: "Looking for an expert with 5+ years of React and frontend architecture optimization experience." },
  { title: "Lead Product Designer", dept: "Product & Design", location: "Hyderabad, India", desc: "Lead the user interface and customer experience workflows for our core CRM dashboard modules." },
  { title: "Enterprise Account Executive", dept: "Sales", location: "Hyderabad, India", desc: "Join our growing outreach team to onboard scaling enterprise businesses to the CRM Platform." }
];

const pressReleases = [
  { outlet: "TechCrunch", date: "June 2026", title: "CRM Platform Raises $8 Million in Series A Funding to Expand AI Capabilities" },
  { outlet: "Forbes", date: "April 2026", title: "CRM Platform Named One of the Top Emerging CRM Platforms of the Year" },
  { outlet: "VentureBeat", date: "January 2026", title: "How the CRM Platform is Reshaping CRM Workflows with Secure Cloud Automation" }
];

const blogPosts = [
  { title: "5 Sales Hacks for Growing Teams", date: "July 2026", author: "Sarah Jenkins", desc: "Maximize closing rates and organize team reminders without spreadsheet bloat." },
  { title: "How AI is Reshaping CRM Workflows", date: "June 2026", author: "David Vance", desc: "Explore auto-drafting email techniques and pipeline forecasting strategies." },
  { title: "Transitioning from Sheets to CRM", date: "May 2026", author: "Priya Sharma", desc: "A simple step-by-step guide explaining how to migrate legacy sheets records." }
];

const comparisons = [
  { feature: "AI Pipeline Assistant", crmplatform: "Included (Unlimited)", competitor: "Extra Charge ($45/mo)" },
  { feature: "Workspace Setup Time", crmplatform: "Under 5 Minutes", competitor: "3 to 4 Weeks" },
  { feature: "Stripe Payment Gateway", crmplatform: "Native (Zero Markup)", competitor: "Custom Integration" },
  { feature: "Modern Cloud Uptime SLA", crmplatform: "99.99% Guaranteed", competitor: "99.9% Standard" },
  { feature: "Pricing Transparency", crmplatform: "No Hidden Upgrades", competitor: "Complex User Licensing" }
];

const faqs = [
  {
    q: "How can I apply for a role?",
    a: "Please click the apply button on any position, or email your resume along with portfolio details to careers@crmplatform.org."
  },
  {
    q: "Do you offer non-profit discounts?",
    a: "Yes. Through CRMPlatform.org community initiatives, we offer free Starter licenses and 50% discounts on Pro plans to certified non-profits."
  },
  {
    q: "How does the CRM Platform handle platform security?",
    a: "We maintain SOC 2 compliance standards, database encryption at rest (AES-256), and secure isolated VPC networks."
  }
];

const About = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("our-story");
  const [openFaq, setOpenFaq] = useState(null);
  
  // Feedback form state
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    rating: "5",
    message: ""
  });
  
  // Toast notification state
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

  // Scrollspy observer logic
  useEffect(() => {
    const sections = ["our-story", "careers", "press", "blog", "security", "community", "comparisons", "sustainability", "legal", "feedback"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -55% 0px",
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const handleSidebarClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.history.pushState({}, "", `/about#${id}`);
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    triggerToast("Thank you! Your feedback has been submitted successfully.");
    setFeedback({ name: "", email: "", rating: "5", message: "" });
  };

  return (
      <>
        <style>{`/* Premium About Company Hub Stylesheet - SalesNova CRM */

.about-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background gradients */
.about-page::before {
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

/* Hero Header */
.about-hero {
  padding: 8.5rem 0 5rem;
  background: radial-gradient(110% 110% at 50% 0%, rgba(219, 234, 254, 0.35) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.about-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.about-hero-content {
  flex: 1.2;
  max-width: 680px;
}

.about-badge {
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

.about-hero-content h1 {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.about-hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.about-hero-actions {
  display: flex;
  gap: 1rem;
}

/* Hero Right Side Art - Mock Dashboard (Professional, human-designed look) */
.about-hero-illustration {
  flex: 0.9;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 460px;
  position: relative;
}

.mock-dashboard-wrapper {
  position: relative;
  width: 100%;
  height: 320px;
}

.mock-dashboard-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
  position: absolute;
  transition: transform 0.3s ease;
}

.mock-dashboard-card:hover {
  transform: translateY(-4px);
}

.mock-dashboard-card.main-card {
  width: 280px;
  top: 10px;
  left: 0;
  z-index: 2;
}

.mock-dashboard-card.secondary-card {
  width: 220px;
  bottom: 10px;
  right: 0;
  z-index: 3;
}

.mock-card-header {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mock-window-dots {
  display: flex;
  gap: 0.35rem;
}

.dot-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-circle.red { background-color: #ef4444; }
.dot-circle.yellow { background-color: #f59e0b; }
.dot-circle.green { background-color: #10b981; }

.mock-card-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.mock-card-body {
  padding: 1.5rem 1.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.stat-badge {
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.stat-badge.positive {
  background: #ecfdf5;
  color: #059669;
}

.progress-bar-container {
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar-fill {
  height: 100%;
  background: #2563eb;
  border-radius: 999px;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
}

/* Sticky Navigation Layout Grid */
.about-container {
  max-width: 1200px;
  width: min(1200px, 90%);
  margin: 0 auto;
  padding: 4rem 0 6rem;
  position: relative;
}

.about-content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4.5rem;
}

/* Sidebar Navigation */
.about-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
  align-self: start;
  border-right: 1px solid #e2e8f0;
  padding-right: 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 10;
}

.about-sidebar h3 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.about-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.about-nav-item a {
  display: flex;
  align-items: center;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 1.15rem;
  transition: all 0.2s ease;
}

.about-nav-item a:hover {
  color: #2563eb;
}

.about-nav-item.active a {
  color: #2563eb;
  font-weight: 700;
  border-left-color: #2563eb;
}

/* Sections Structure */
.about-content-area {
  display: flex;
  flex-direction: column;
  gap: 7rem;
}

.about-sec {
  scroll-margin-top: 110px;
}

.about-sec-header {
  margin-bottom: 3rem;
}

.about-sec-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.about-sec-header p {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
}

/* Section 1: Our Story Timeline */
.story-timeline {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
  margin-top: 2rem;
  padding-left: 2rem;
}

.story-timeline::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 7px;
  width: 2px;
  background: #cbd5e1;
}

.story-timeline-node {
  position: relative;
}

.story-node-dot {
  position: absolute;
  left: -2rem;
  top: 8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 4px solid #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
  z-index: 2;
}

.story-node-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
}

.story-node-year {
  font-size: 1.1rem;
  font-weight: 800;
  color: #2563eb;
  margin-bottom: 0.5rem;
  display: block;
}

.story-node-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.story-node-card p {
  font-size: 0.925rem;
  line-height: 1.55;
  color: #475569;
}

/* Section 2: Careers Open Positions */
.careers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.job-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
}

.job-card:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.05);
}

.job-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.job-dept-badge {
  padding: 0.25rem 0.55rem;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
}

.job-location {
  font-size: 0.8rem;
  color: #64748b;
}

.job-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.job-card p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #475569;
  margin-bottom: 1.5rem;
}

/* Section 3: Press Cards */
.press-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.press-article-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
}

.press-article-card:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
}

.press-source-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.press-outlet-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #2563eb;
}

.press-date {
  font-size: 0.8rem;
  color: #94a3b8;
}

.press-article-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.45;
  margin-bottom: 2rem;
}

/* Section 4: Blog Grid */
.blog-posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.blog-post-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  transition: all 0.25s ease;
}

.blog-post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.02);
}

.blog-card-img-placeholder {
  height: 160px;
  background: radial-gradient(100% 100% at 0% 0%, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.blog-card-content {
  padding: 1.75rem;
}

.blog-card-meta {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.75rem;
  display: block;
}

.blog-card-content h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.blog-card-content p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #475569;
}

/* Section 7: Best CRM Comparison Table */
.comparison-table-wrapper {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.005);
  overflow: hidden;
  margin-top: 2rem;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.comparison-table th, .comparison-table td {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
}

.comparison-table th {
  background: #f8fafc;
  font-weight: 700;
  color: #0f172a;
}

.comparison-table tr:last-child td {
  border-bottom: none;
}

.comparison-feature-col {
  font-weight: 600;
  color: #334155;
}

.comparison-val-salesnova {
  color: #2563eb;
  font-weight: 700;
}

.comparison-val-other {
  color: #64748b;
}

/* Section 10: Feedback Form */
.feedback-box-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3rem;
  box-shadow: 0 4px 25px rgba(15, 23, 42, 0.01);
  margin-top: 2rem;
}

.feedback-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.feedback-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feedback-input-group.full-width {
  grid-column: span 2;
}

.feedback-input-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.feedback-input-group input, .feedback-input-group textarea, .feedback-input-group select {
  padding: 0.85rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.feedback-input-group input:focus, .feedback-input-group textarea:focus, .feedback-input-group select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Responsiveness */
@media (max-width: 1024px) {
  .about-content-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .about-sidebar {
    display: none; /* Hide sidebar list on mobile/tablet viewports */
  }
  
  .careers-grid, .press-grid, .blog-posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-hero {
    padding: 6.5rem 0 3.5rem;
  }
  
  .about-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .about-hero-actions {
    justify-content: center;
  }
  
  .about-hero-illustration {
    display: none;
  }
  
  .story-timeline {
    padding-left: 1.5rem;
  }
  
  .careers-grid, .press-grid, .blog-posts-grid {
    grid-template-columns: 1fr;
  }
  
  .feedback-form-grid {
    grid-template-columns: 1fr;
  }
  
  .feedback-input-group.full-width {
    grid-column: span 1;
  }
  
  .comparison-table-wrapper {
    overflow-x: auto;
  }
}
`}</style>
    <div className="about-page">
      <Navbar />

      {/* Hero Header */}
      <header className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-content">
            <div className="about-badge">
              <Compass size={16} />
              <span>Company & Culture</span>
            </div>
            <h1>About CRM Platform</h1>
            <p className="about-hero-subtitle">
              We are on a mission to empower growing companies with high-fidelity customer relationship tools, making sales automation, support logs, and CRM intelligence accessible to everyone.
            </p>
            <div className="about-hero-actions">
              <a href="#our-story" onClick={(e) => handleSidebarClick(e, "our-story")} className="btn-primary">
                Explore Our Story
              </a>
              <a href="#careers" onClick={(e) => handleSidebarClick(e, "careers")} className="btn-secondary">
                Join Our Team
              </a>
            </div>
          </div>
          <div className="about-hero-illustration">
            <div className="mock-dashboard-wrapper">
              <div className="mock-dashboard-card main-card">
                <div className="mock-card-header">
                  <div className="mock-window-dots">
                    <span className="dot-circle red"></span>
                    <span className="dot-circle yellow"></span>
                    <span className="dot-circle green"></span>
                  </div>
                  <span className="mock-card-title">Performance Metrics</span>
                </div>
                <div className="mock-card-body">
                  <div className="stat-label">Global Active Users</div>
                  <div className="stat-value">482,900+</div>
                  <div className="stat-badge positive">99.99% Uptime SLA</div>
                </div>
              </div>
              <div className="mock-dashboard-card secondary-card">
                <div className="mock-card-header">
                  <span className="mock-card-title">Yearly Growth</span>
                </div>
                <div className="mock-card-body">
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: "88%", backgroundColor: "#10b981" }}></div>
                  </div>
                  <div className="progress-label">88% Customer Retention</div>
                </div>
              </div>
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

      {/* Main sticky navigation layout grid */}
      <main className="about-container">
        <div className="about-content-layout">
          
          {/* Left Sidebar Menu */}
          <aside className="about-sidebar">
            <h3>Company Hub</h3>
            <ul className="about-nav-menu">
              <li className={`about-nav-item ${activeSection === "our-story" ? "active" : ""}`}>
                <a href="#our-story" onClick={(e) => handleSidebarClick(e, "our-story")}>Our Story</a>
              </li>
              <li className={`about-nav-item ${activeSection === "careers" ? "active" : ""}`}>
                <a href="#careers" onClick={(e) => handleSidebarClick(e, "careers")}>Careers</a>
              </li>
              <li className={`about-nav-item ${activeSection === "press" ? "active" : ""}`}>
                <a href="#press" onClick={(e) => handleSidebarClick(e, "press")}>Press</a>
              </li>
              <li className={`about-nav-item ${activeSection === "blog" ? "active" : ""}`}>
                <a href="#blog" onClick={(e) => handleSidebarClick(e, "blog")}>Blog</a>
              </li>
              <li className={`about-nav-item ${activeSection === "security" ? "active" : ""}`}>
                <a href="#security" onClick={(e) => handleSidebarClick(e, "security")}>Security</a>
              </li>
              <li className={`about-nav-item ${activeSection === "community" ? "active" : ""}`}>
                <a href="#community" onClick={(e) => handleSidebarClick(e, "community")}>CRMPlatform.org</a>
              </li>
              <li className={`about-nav-item ${activeSection === "comparisons" ? "active" : ""}`}>
                <a href="#comparisons" onClick={(e) => handleSidebarClick(e, "comparisons")}>Best CRM</a>
              </li>
              <li className={`about-nav-item ${activeSection === "sustainability" ? "active" : ""}`}>
                <a href="#sustainability" onClick={(e) => handleSidebarClick(e, "sustainability")}>Sustainability</a>
              </li>
              <li className={`about-nav-item ${activeSection === "legal" ? "active" : ""}`}>
                <a href="#legal" onClick={(e) => handleSidebarClick(e, "legal")}>Legal Briefs</a>
              </li>
              <li className={`about-nav-item ${activeSection === "feedback" ? "active" : ""}`}>
                <a href="#feedback" onClick={(e) => handleSidebarClick(e, "feedback")}>Give Feedback</a>
              </li>
            </ul>
          </aside>

          {/* Right Content Area */}
          <div className="about-content-area">
            
            {/* Section 1: Our Story */}
            <section id="our-story" className="about-sec">
              <div className="about-sec-header">
                <h2>Our Story</h2>
                <p>We started in 2021 with one clear observation: businesses waste hours syncing tools that should talk to each other. Here is how we built the CRM Platform to change that.</p>
              </div>
              <div className="story-timeline">
                {timelineEvents.map((ev, idx) => (
                  <article className="story-timeline-node" key={idx}>
                    <div className="story-node-dot"></div>
                    <div className="story-node-card">
                      <span className="story-node-year">{ev.year}</span>
                      <h3>{ev.title}</h3>
                      <p>{ev.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 2: Careers */}
            <section id="careers" className="about-sec">
              <div className="about-sec-header">
                <h2>Careers & Culture</h2>
                <p>We are a distributed team centered on remote collaboration, engineering simplicity, and user-first product design. Join us on our mission.</p>
              </div>
              
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "1.5rem" }}>
                Our Core Values
              </h3>
              <div className="practices-grid" style={{ marginBottom: "3rem" }}>
                {coreValues.map((val, idx) => {
                  const Icon = val.icon;
                  return (
                    <div className="practice-card" key={idx}>
                      <div className="practice-icon"><Icon size={20} /></div>
                      <h3>{val.title}</h3>
                      <p>{val.desc}</p>
                    </div>
                  );
                })}
              </div>

              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a", marginBottom: "1.5rem" }}>
                Open Positions
              </h3>
              <div className="careers-grid">
                {jobsList.map((job, idx) => (
                  <article className="job-card" key={idx}>
                    <div>
                      <div className="job-header-row">
                        <span className="job-dept-badge">{job.dept}</span>
                        <span className="job-location">{job.location}</span>
                      </div>
                      <h3>{job.title}</h3>
                      <p>{job.desc}</p>
                    </div>
                    <button onClick={() => alert(`Application pipeline loaded for ${job.title}.`)} className="btn-secondary">
                      Apply Now
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 3: Press */}
            <section id="press" className="about-sec">
              <div className="about-sec-header">
                <h2>Press & Media Coverage</h2>
                <p>Read about our platform announcements, financing details, and platform reviews in trusted news journals.</p>
              </div>
              <div className="press-grid">
                {pressReleases.map((article, idx) => (
                  <article className="press-article-card" key={idx}>
                    <div>
                      <div className="press-source-row">
                        <span className="press-outlet-title">{article.outlet}</span>
                        <span className="press-date">{article.date}</span>
                      </div>
                      <h3>{article.title}</h3>
                    </div>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert("External media article is loaded."); }} className="module-card-action-btn">
                      Read Article <ExternalLink size={12} />
                    </a>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 4: Blog */}
            <section id="blog" className="about-sec">
              <div className="about-sec-header">
                <h2>Latest Company Blog</h2>
                <p>Tips, hacks, and product announcements direct from our customer success engineers.</p>
              </div>
              <div className="blog-posts-grid">
                {blogPosts.map((post, idx) => (
                  <article className="blog-post-card" key={idx}>
                    <div className="blog-card-img-placeholder">
                      <BookOpen size={40} />
                    </div>
                    <div className="blog-card-content">
                      <span className="blog-card-meta">{post.date} • By {post.author}</span>
                      <h3>{post.title}</h3>
                      <p>{post.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 5: Security */}
            <section id="security" className="about-sec">
              <div className="about-sec-header">
                <h2>Security and Performance</h2>
                <p>Our platform handles business-critical records. We secure customer databases with enterprise-grade SLA and lock-down security targets.</p>
              </div>
              
              <div className="saas-box-card" style={{ marginBottom: "2.5rem" }}>
                <div className="saas-art-block">
                  <div className="saas-cloud-art-wrapper" style={{ background: "#ecfdf5", color: "#10b981", boxShadow: "0 10px 25px rgba(16, 185, 129, 0.06)" }}>
                    <ShieldCheck size={50} />
                  </div>
                </div>
                <div className="saas-info-block">
                  <h3>Security Controls</h3>
                  <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.55", marginBottom: "1rem" }}>
                    We encrypt data at rest via AES-256 blocks, secure all APIs using TLS 1.3, isolate services in dedicated AWS VPC environments, and undergo annual compliance audits.
                  </p>
                  <div className="category-examples-list">
                    <span className="category-example-item">AES-256 Rest Encryption</span>
                    <span className="category-example-item">SOC 2 compliant</span>
                    <span className="category-example-item">TLS 1.3 tunnels</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: CRMPlatform.org Community */}
            <section id="community" className="about-sec">
              <div className="about-sec-header">
                <h2>CRMPlatform.org Community</h2>
                <p>We pledge 1% of our licensing revenues to social community projects, support environmental green server programs, and offer free software to non-profits.</p>
              </div>
              
              <div className="commitment-card">
                <h2>1% Impact Pledge</h2>
                <p>Through the CRMPlatform.org initiative, certified non-profit teams receive complimentary Starter plans and custom onboarding tutorials to organize their volunteer operations.</p>
                <button onClick={() => alert("Non-profit registration sequence loaded.")} className="btn-primary">
                  Request Free Non-Profit Plan
                </button>
              </div>
            </section>

            {/* Section 7: Best CRM Software Comparisons */}
            <section id="comparisons" className="about-sec">
              <div className="about-sec-header">
                <h2>Why CRM Platform is the Best Choice</h2>
                <p>See how our platform stacks up against legacy platform softwares in pricing flexibility, setup speed, and built-in features.</p>
              </div>
              
              <div className="comparison-table-wrapper">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Capabilities</th>
                      <th>CRM Platform</th>
                      <th>Other Legacy CRMs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row, idx) => (
                      <tr key={idx}>
                        <td className="comparison-feature-col">{row.feature}</td>
                        <td className="comparison-val-salesnova">{row.crmplatform}</td>
                        <td className="comparison-val-other">{row.competitor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 8: Sustainability */}
            <section id="sustainability" className="about-sec">
              <div className="about-sec-header">
                <h2>Sustainability Pledges</h2>
                <p>We are dedicated to sustainable digital services. We operate with green server providers and strive for net-zero carbon operations.</p>
              </div>
              
              <div className="saas-box-card">
                <div className="saas-art-block">
                  <div className="saas-cloud-art-wrapper" style={{ background: "#ecfdf5", color: "#059669" }}>
                    <Leaf size={60} />
                  </div>
                </div>
                <div className="saas-info-block">
                  <h3>Carbon-Neutral Digital Operations</h3>
                  <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: "1.6", margin: "0" }}>
                    We partner with cloud server nodes that leverage 100% renewable wind and solar energy grids. By optimizing our application script sizes, we reduce server energy draw offsets.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9: Legal */}
            <section id="legal" className="about-sec">
              <div className="about-sec-header">
                <h2>Legal & Compliance</h2>
                <p>Quick directory references containing our terms, disclosures, cookie preferences, and user privacy center options.</p>
              </div>
              
              <div className="commitment-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <h2 style={{ fontSize: "1.45rem", marginBottom: "0.5rem" }}>Legal & Trust Center</h2>
                  <p style={{ margin: "0", fontSize: "0.95rem" }}>Read about our enterprise compliance protocols, licensing structures, and security audits at our central Legal hub.</p>
                </div>
                <a href="/legal" className="btn-primary">
                  Go to Legal Center
                </a>
              </div>
            </section>

            {/* Section 10: Feedback Form */}
            <section id="feedback" className="about-sec">
              <div className="about-sec-header">
                <h2>Give Us Your Feedback</h2>
                <p>We value your ideas! Let us know how we can improve platform layouts or custom workflow modules.</p>
              </div>
              
              <div className="feedback-box-card">
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="feedback-form-grid">
                    <div className="feedback-input-group">
                      <label htmlFor="feedback-name">Your Name</label>
                      <input
                        type="text"
                        id="feedback-name"
                        value={feedback.name}
                        onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="feedback-input-group">
                      <label htmlFor="feedback-email">Email Address</label>
                      <input
                        type="email"
                        id="feedback-email"
                        value={feedback.email}
                        onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="feedback-input-group">
                      <label htmlFor="feedback-rating">Platform Rating</label>
                      <select
                        id="feedback-rating"
                        value={feedback.rating}
                        onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>

                    <div className="feedback-input-group full-width">
                      <label htmlFor="feedback-msg">Your Message</label>
                      <textarea
                        id="feedback-msg"
                        rows="5"
                        value={feedback.message}
                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                        required
                        placeholder="Tell us what you think or suggest new features..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn-primary">
                    Submit Feedback
                  </button>
                </form>
              </div>
            </section>

          </div>

        </div>
      </main>

      {/* Bottom CTA banner */}
      <section className="disclosure-section legal-cta" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div className="section-container">
          <div className="legal-cta-inner">
            <h2>Ready to Upgrade Your CRM Workflows?</h2>
            <p>Start managing pipeline databases and closing deals today with the CRM Platform.</p>
            <div className="legal-cta-buttons">
              <button onClick={() => navigate("/login")} className="btn-primary">
                Start Free Trial
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

export default About;