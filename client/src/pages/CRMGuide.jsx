import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  TrendingUp,
  Heart,
  Zap,
  Database,
  Search,
  UserCheck,
  FileText,
  Clock,
  Activity,
  Sparkles,
  ChevronDown,
  Cloud,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Users
} from "lucide-react";

const whyCRMCards = [
  { title: "Increase Sales", desc: "Track conversions, manage pipelines, and close deal pipelines faster.", icon: TrendingUp },
  { title: "Better Customer Relationships", desc: "Store preferences, log history, and offer personalized touchpoints.", icon: Heart },
  { title: "Automate Repetitive Work", desc: "Let automation trigger reminders, assign lead categories, and sync records.", icon: Zap },
  { title: "Centralized Business Data", desc: "Every department shares access to updated buyer lifecycle databases.", icon: Database }
];

const flowchartNodes = [
  { id: "lead", label: "Lead" },
  { id: "customer", label: "Customer" },
  { id: "opportunity", label: "Opportunity" },
  { id: "deal", label: "Deal" },
  { id: "support", label: "Support" },
  { id: "retention", label: "Retention" }
];

const productModules = [
  { title: "Dashboard", desc: "Overview of sales statistics, active pipelines, and tasks in one visual drawer.", icon: GridIcon },
  { title: "Customers", desc: "Central database of customer profile records, preferences, and contact details.", icon: UserCheck },
  { title: "Leads", desc: "Capture interested website visitors, assign quality scores, and routing pipelines.", icon: Search },
  { title: "Sales Pipeline", desc: "Visualize deals transitioning across acceptance stages in real-time.", icon: TrendingUp },
  { title: "Tasks", desc: "Schedule task checklists, assign triggers to sales members, and update progress.", icon: FileText },
  { title: "Calendar", desc: "Sync meeting calls, schedule buyer demos, and track follow-up times.", icon: Clock },
  { title: "Reports", desc: "Compile revenue stats, check team closure rates, and download reports sheets.", icon: FileText },
  { title: "Analytics", desc: "Deep metrics monitoring application speeds, performance, and trends.", icon: Activity },
  { title: "AI Assistant", desc: "Generate sales letters, auto-draft replies, and check conversion odds.", icon: Sparkles },
  { title: "Team Management", desc: "Assign custom roles, track rep activities, and secure dashboard views.", icon: Users }
];

function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

const testimonials = [
  { company: "ABC Technologies", quote: "Increased sales conversions by 42% using the CRM Platform.", rating: 5, avatarLetter: "A" },
  { company: "XYZ Solutions", quote: "Reduced customer follow-up time by 60%.", rating: 5, avatarLetter: "X" },
  { company: "Bright Retail", quote: "Improved customer retention significantly.", rating: 5, avatarLetter: "B" }
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$29",
    period: "per user / month",
    features: [
      "Up to 5 Users",
      "Standard Contact Management",
      "Leads Tracking Pipeline",
      "10GB Secure Cloud Storage",
      "Email & Chat Support"
    ],
    cta: "Start Starter Plan"
  },
  {
    name: "Professional",
    price: "$79",
    period: "per user / month",
    features: [
      "Up to 25 Users",
      "Advanced Sales Automation",
      "Custom Reporting Dashboards",
      "100GB Secure Storage",
      "Standard AI Copilot Features",
      "Priority Support Desk"
    ],
    cta: "Start Pro Plan",
    popular: true
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "per user / month",
    features: [
      "Unlimited Users",
      "Custom Workflow Architectures",
      "Dedicated Database Hosting",
      "1TB Secure Storage",
      "Advanced AI Models Support",
      "Dedicated Success Manager",
      "24/7 Phone SLA Support"
    ],
    cta: "Contact Enterprise Sales"
  }
];

const faqs = [
  {
    q: "What is CRM?",
    a: "CRM stands for Customer Relationship Management. It refers to software that helps businesses track communications, manage contact details, automate sales pipelines, and analyze customer behaviors."
  },
  {
    q: "Who needs CRM?",
    a: "Any business looking to scale operations, centralize buyer data, remove spreadsheets, automate follow-up tasks, and align sales, marketing, and support teams."
  },
  {
    q: "Is the CRM Platform cloud-based?",
    a: "Yes. The CRM Platform is a fully hosted SaaS platform. Your databases sync securely to cloud hosts, meaning you require zero installation and access tools anywhere."
  },
  {
    q: "Can small businesses use CRM?",
    a: "Absolutely. Our Starter tier is custom-tailored for small companies looking to establish structured pipelines without complex software setups."
  },
  {
    q: "Is there a free trial?",
    a: "Yes. We offer a 14-day free trial on our Starter and Professional plans, with no credit card required to sign up."
  },
  {
    q: "How secure is the CRM Platform?",
    a: "We implement AES-256 resting database encryption, TLS 1.3 transit tunnels, automatic backups, and SOC 2 security compliance guidelines."
  }
];

const CRMGuide = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("why-crm");
  const [openFaq, setOpenFaq] = useState(null);

  // Scrollspy logic using IntersectionObserver
  useEffect(() => {
    const sections = ["why-crm", "what-is-crm", "explore-products", "saas-solutions", "customer-success", "product-pricing", "faq"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -55% 0px", // Trigger active state when section enters viewport center
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
      // Update history with hash
      window.history.pushState({}, "", `/crm-guide#${id}`);
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
      <>
        <style>{`/* Premium CRM Guide & Learning Hub Stylesheet - SalesNova CRM */

.guide-page {
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
  position: relative;
}

/* Background gradients */
.guide-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 15%;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(37, 99, 235, 0) 70%);
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  filter: blur(50px);
}

/* Hero Header */
.guide-hero {
  padding: 8.5rem 0 5rem;
  background: radial-gradient(110% 110% at 50% 0%, rgba(219, 234, 254, 0.35) 0%, rgba(248, 250, 252, 0) 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 2;
}

.guide-hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
}

.guide-hero-content {
  flex: 1.2;
  max-width: 680px;
}

.guide-badge {
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

.guide-hero-content h1 {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.guide-hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.65;
  color: #475569;
  margin-bottom: 2rem;
}

.guide-hero-actions {
  display: flex;
  gap: 1rem;
}

/* Hero Right Side Art - Mock Dashboard (Professional, human-designed look) */
.guide-hero-illustration {
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
.guide-container {
  max-width: 1200px;
  width: min(1200px, 90%);
  margin: 0 auto;
  padding: 4rem 0 6rem;
  position: relative;
}

.guide-content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 4.5rem;
}

/* Sidebar Navigation */
.guide-sidebar {
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

.guide-sidebar h3 {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.guide-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-nav-item a {
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

.guide-nav-item a:hover {
  color: #2563eb;
}

.guide-nav-item.active a {
  color: #2563eb;
  font-weight: 700;
  border-left-color: #2563eb;
}

/* Sections Structure */
.guide-content-area {
  display: flex;
  flex-direction: column;
  gap: 7rem;
}

.guide-sec {
  scroll-margin-top: 110px;
}

.guide-sec-header {
  margin-bottom: 3rem;
}

.guide-sec-header h2 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.guide-sec-header p {
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.6;
}

/* Section 1: Why CRM Cards */
.benefits-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.benefit-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.005);
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.05);
  border-color: rgba(37, 99, 235, 0.12);
}

.benefit-card-icon {
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

.benefit-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.benefit-card p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #475569;
}

/* Section 2: What is CRM Infographic Flowchart */
.flowchart-outer {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3rem 2.5rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.005);
  margin-top: 2rem;
}

.flowchart-timeline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 1rem;
}

/* Connector Line */
.flowchart-timeline::before {
  content: "";
  position: absolute;
  top: 35px;
  left: 5%;
  right: 5%;
  height: 2px;
  background: #e2e8f0;
  z-index: 1;
}

.flowchart-node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
}

.flowchart-bubble {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #cbd5e1;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.flowchart-node-wrapper:hover .flowchart-bubble {
  border-color: #2563eb;
  color: #2563eb;
  background: #f0f7ff;
  transform: scale(1.08);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.12);
}

.flowchart-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
  text-align: center;
}

/* Section 3: Explore Products Grid (10 Modules) */
.modules-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.module-card {
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

.module-card:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.05);
  transform: translateY(-2px);
}

.module-card-icon {
  background: #f0f7ff;
  color: #2563eb;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.module-card-info h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.module-card-info p {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #475569;
  margin-bottom: 1.5rem;
}

.module-card-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #2563eb;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 700;
  transition: gap 0.2s ease;
}

.module-card-action-btn:hover {
  gap: 0.5rem;
}

/* Section 4: SaaS Solutions Cloud Art */
.saas-box-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.005);
  display: flex;
  gap: 3.5rem;
  align-items: center;
  margin-top: 2rem;
}

.saas-art-block {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.saas-cloud-art-wrapper {
  background: #f0f7ff;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.06);
}

.saas-info-block {
  flex: 1.2;
}

.saas-info-block h3 {
  font-size: 1.45rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.5rem;
}

.saas-benefits-checklist {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.saas-checklist-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.95rem;
  color: #475569;
  font-weight: 500;
}

.saas-checklist-item svg {
  color: #10b981;
}

/* Section 5: Customer Success Testimonials Grid */
.testimonials-row-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.testimonial-card-small {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.testimonial-card-small:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.02);
}

.testimonial-rating-row {
  color: #f59e0b;
  margin-bottom: 1.25rem;
}

.testimonial-quote {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #334155;
  font-style: italic;
  margin-bottom: 2rem;
}

.testimonial-client-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.client-logo-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: #2563eb;
  border: 1px solid #cbd5e1;
}

.client-info-names h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.client-info-names span {
  font-size: 0.75rem;
  color: #64748b;
}

/* Section 6: Product Pricing Cards */
.pricing-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.price-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 2.5rem 2rem;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.005);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
}

.price-card.popular-card {
  border-color: #2563eb;
  border-width: 2px;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.05);
}

.price-popular-banner {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #2563eb;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
}

.price-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.price-val-row {
  margin-bottom: 1.5rem;
}

.price-val {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
}

.price-period {
  font-size: 0.875rem;
  color: #64748b;
  margin-left: 0.25rem;
}

.price-features-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.price-feature-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.875rem;
  color: #475569;
}

.price-feature-item svg {
  color: #2563eb;
}

.price-card .btn-primary, .price-card .btn-secondary {
  width: 100%;
  justify-content: center;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .guide-content-layout {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .guide-sidebar {
    display: none; /* Hide sidebar list on mobile/tablet viewports */
  }
  
  .benefits-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .testimonials-row-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .pricing-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .guide-hero {
    padding: 6.5rem 0 3.5rem;
  }
  
  .guide-hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .guide-hero-actions {
    justify-content: center;
  }
  
  .guide-hero-illustration {
    display: none;
  }
  
  .benefits-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .flowchart-timeline {
    flex-direction: column;
    gap: 2rem;
  }
  
  .flowchart-timeline::before {
    display: none;
  }
  
  .modules-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .saas-box-card {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
    gap: 2rem;
  }
  
  .saas-benefits-checklist {
    grid-template-columns: 1fr;
    text-align: left;
  }
  
  .testimonials-row-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-cards-grid {
    grid-template-columns: 1fr;
  }
}
`}</style>
    <div className="guide-page">
      <Navbar />

      {/* Hero Header */}
      <header className="guide-hero">
        <div className="container guide-hero-inner">
          <div className="guide-hero-content">
            <div className="guide-badge">
              <CheckCircle size={16} />
              <span>CRM Learning Hub</span>
            </div>
            <h1>New to CRM?</h1>
            <p className="guide-hero-subtitle">
              Learn CRM fundamentals, discover business benefits, explore platform features, and understand how modern CRM software improves customer relationships, sales productivity, and team collaboration.
            </p>
            <div className="guide-hero-actions">
              <a href="#why-crm" onClick={(e) => handleSidebarClick(e, "why-crm")} className="btn-primary">
                Explore CRM
              </a>
              <a href="mailto:sales@crmplatform.org" className="btn-secondary">
                Contact Sales
              </a>
            </div>
          </div>
          <div className="guide-hero-illustration">
            <div className="mock-dashboard-wrapper">
              <div className="mock-dashboard-card main-card">
                <div className="mock-card-header">
                  <div className="mock-window-dots">
                    <span className="dot-circle red"></span>
                    <span className="dot-circle yellow"></span>
                    <span className="dot-circle green"></span>
                  </div>
                  <span className="mock-card-title">Contacts Database</span>
                </div>
                <div className="mock-card-body">
                  <div className="stat-label">Total Leads Active</div>
                  <div className="stat-value">14,892</div>
                  <div className="stat-badge positive">+18.4% monthly</div>
                </div>
              </div>
              <div className="mock-dashboard-card secondary-card">
                <div className="mock-card-header">
                  <span className="mock-card-title">Conversion Rates</span>
                </div>
                <div className="mock-card-body">
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: "74%" }}></div>
                  </div>
                  <div className="progress-label">74% Deal Conversion</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main sticky navigation layout grid */}
      <main className="guide-container">
        <div className="guide-content-layout">
          
          {/* Left Sidebar Menu */}
          <aside className="guide-sidebar">
            <h3>Guide Sections</h3>
            <ul className="guide-nav-menu">
              <li className={`guide-nav-item ${activeSection === "why-crm" ? "active" : ""}`}>
                <a href="#why-crm" onClick={(e) => handleSidebarClick(e, "why-crm")}>Why CRM?</a>
              </li>
              <li className={`guide-nav-item ${activeSection === "what-is-crm" ? "active" : ""}`}>
                <a href="#what-is-crm" onClick={(e) => handleSidebarClick(e, "what-is-crm")}>What is CRM?</a>
              </li>
              <li className={`guide-nav-item ${activeSection === "explore-products" ? "active" : ""}`}>
                <a href="#explore-products" onClick={(e) => handleSidebarClick(e, "explore-products")}>Explore Products</a>
              </li>
              <li className={`guide-nav-item ${activeSection === "saas-solutions" ? "active" : ""}`}>
                <a href="#saas-solutions" onClick={(e) => handleSidebarClick(e, "saas-solutions")}>SaaS Solutions</a>
              </li>
              <li className={`guide-nav-item ${activeSection === "customer-success" ? "active" : ""}`}>
                <a href="#customer-success" onClick={(e) => handleSidebarClick(e, "customer-success")}>Customer Success</a>
              </li>
              <li className={`guide-nav-item ${activeSection === "product-pricing" ? "active" : ""}`}>
                <a href="#product-pricing" onClick={(e) => handleSidebarClick(e, "product-pricing")}>Product Pricing</a>
              </li>
              <li className={`guide-nav-item ${activeSection === "faq" ? "active" : ""}`}>
                <a href="#faq" onClick={(e) => handleSidebarClick(e, "faq")}>FAQs</a>
              </li>
            </ul>
          </aside>

          {/* Right Content Area */}
          <div className="guide-content-area">
            
            {/* Section 1: Why CRM */}
            <section id="why-crm" className="guide-sec">
              <div className="guide-sec-header">
                <h2>Why CRM?</h2>
                <p>Businesses today lose sales and buyer trust due to scattered spreadsheets, missed emails, and uncoordinated task delegation. CRM centralizes customer intelligence to fuel growth and operational productivity.</p>
              </div>
              <div className="benefits-cards-grid">
                {whyCRMCards.map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <article className="benefit-card" key={idx}>
                      <div className="benefit-card-icon">
                        <Icon size={20} />
                      </div>
                      <h3>{card.title}</h3>
                      <p>{card.desc}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Section 2: What is CRM Infographic */}
            <section id="what-is-crm" className="guide-sec">
              <div className="guide-sec-header">
                <h2>What is CRM?</h2>
                <p>In simple terms, CRM is a centralized hub tracking every touchpoint between your company and potential or current buyers. It aligns Sales, Marketing, Customer Support, and Analytics logs under one umbrella.</p>
              </div>
              
              <div className="flowchart-outer">
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", marginBottom: "2rem", textAlign: "center" }}>
                  Customer Lifecycle Pipeline Journey
                </h3>
                <div className="flowchart-timeline">
                  {flowchartNodes.map((node, idx) => (
                    <div className="flowchart-node-wrapper" key={idx}>
                      <div className="flowchart-bubble">
                        {idx + 1}
                      </div>
                      <span className="flowchart-label">{node.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Explore Products (10 modules) */}
            <section id="explore-products" className="guide-sec">
              <div className="guide-sec-header">
                <h2>Explore Products</h2>
                 <p>Explore the dedicated suite of CRM tools designed to automate pipeline operations and skyrocket conversions.</p>
              </div>
              <div className="modules-cards-grid">
                {productModules.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <article className="module-card" key={idx}>
                      <div>
                        <div className="module-card-icon">
                          <Icon size={20} />
                        </div>
                        <div className="module-card-info">
                          <h3>{item.title}</h3>
                          <p>{item.desc}</p>
                        </div>
                      </div>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert(`${item.title} product details drawer is loaded.`); }} className="module-card-action-btn">
                        Learn More <ArrowRight size={12} />
                      </a>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Section 4: SaaS Solutions Cloud details */}
            <section id="saas-solutions" className="guide-sec">
              <div className="guide-sec-header">
                <h2>SaaS Solutions</h2>
                 <p>The platform runs entirely in secure cloud environments, meaning your databases sync automatically without local hardware dependencies.</p>
              </div>
              
              <div className="saas-box-card">
                <div className="saas-art-block">
                  <div className="saas-cloud-art-wrapper">
                    <Cloud size={60} />
                  </div>
                </div>
                <div className="saas-info-block">
                  <h3>SaaS Integration Benefits</h3>
                  <div className="saas-benefits-checklist">
                    <div className="saas-checklist-item">
                      <CheckCircle size={16} />
                      <span>No Installation</span>
                    </div>
                    <div className="saas-checklist-item">
                      <CheckCircle size={16} />
                      <span>Automatic Updates</span>
                    </div>
                    <div className="saas-checklist-item">
                      <CheckCircle size={16} />
                      <span>Secure Cloud Storage</span>
                    </div>
                    <div className="saas-checklist-item">
                      <CheckCircle size={16} />
                      <span>Access Anywhere</span>
                    </div>
                    <div className="saas-checklist-item">
                      <CheckCircle size={16} />
                      <span>Team Collaboration</span>
                    </div>
                    <div className="saas-checklist-item">
                      <CheckCircle size={16} />
                      <span>Lower Upfront Costs</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Customer Success Testimonials */}
            <section id="customer-success" className="guide-sec">
              <div className="guide-sec-header">
                <h2>Customer Success</h2>
                 <p>See how teams across sectors scaled their sales operations and minimized manual workloads using the CRM Platform.</p>
              </div>
              <div className="testimonials-row-grid">
                {testimonials.map((testi, idx) => (
                  <article className="testimonial-card-small" key={idx}>
                    <div className="testimonial-rating-row">
                      {Array.from({ length: testi.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="testimonial-quote">"{testi.quote}"</p>
                    <div className="testimonial-client-row">
                      <div className="client-logo-avatar">{testi.avatarLetter}</div>
                      <div className="client-info-names">
                        <h4>{testi.company}</h4>
                        <span>Verified Customer</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 6: Product Pricing Tables */}
            <section id="product-pricing" className="guide-sec">
              <div className="guide-sec-header">
                <h2>Product Pricing Plans</h2>
                <p>Choose a billing tier customized to your team capacity. Switch or cancel subscriptions at any time.</p>
              </div>
              
              <div className="pricing-cards-grid">
                {pricingTiers.map((tier, idx) => (
                  <article className={`price-card ${tier.popular ? "popular-card" : ""}`} key={idx}>
                    {tier.popular && <span className="price-popular-banner">Most Popular</span>}
                    <div>
                      <div className="price-header">
                        <h3>{tier.name}</h3>
                      </div>
                      <div className="price-val-row">
                        <span className="price-val">{tier.price}</span>
                        <span className="price-period">{tier.period}</span>
                      </div>
                      <ul className="price-features-list">
                        {tier.features.map((feat, i) => (
                          <li className="price-feature-item" key={i}>
                            <ShieldCheck size={16} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button onClick={() => alert(`${tier.name} checkout sequence loaded.`)} className={tier.popular ? "btn-primary" : "btn-secondary"}>
                      {tier.cta}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            {/* Section 7: FAQs Accordions */}
            <section id="faq" className="guide-sec">
              <div className="guide-sec-header">
                <h2>Frequently Asked CRM Questions</h2>
                <p>Answers to common beginner queries regarding our hosted services, trials, and lock-down security parameters.</p>
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
            </section>

          </div>

        </div>
      </main>

      {/* Bottom CTA banner */}
      <section className="disclosure-section legal-cta" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div className="section-container">
          <div className="legal-cta-inner">
            <h2>Ready to Transform Your Sales Process?</h2>
             <p>Start managing customers, automating follow-ups, and closing more deals with the CRM Platform.</p>
            <div className="legal-cta-buttons">
              <button onClick={() => navigate("/login")} className="btn-primary">
                Start Free Trial
              </button>
              <button onClick={() => alert("Demos reservation booking is loaded.")} className="btn-secondary">
                Book Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  
      </>);
};

export default CRMGuide;