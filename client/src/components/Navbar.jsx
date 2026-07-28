import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Cloud, ExternalLink, Facebook, Globe, Linkedin, Twitter, User } from "lucide-react";

const industriesData = [
  {
    id: "auto",
    name: "Automotive",
    title: "Automotive CRM",
    description: "Streamline dealership operations, manage leads, and enhance customer loyalty with specialized automotive CRM tools.",
    features: [
      "Lead scoring & distribution",
      "Inventory integration",
      "Service scheduling automation",
      "Follow-up reminders",
      "Mobile access for sales floor"
    ],
    rightPanelTitle: "Top Use Cases",
    rightPanelContent: [
      "New & Used Car Sales",
      "Service Department",
      "Finance & Insurance",
      "Fleet Management"
    ],
    linkText: "Explore Automotive ->",
    linkUrl: "#automotive"
  },
  {
    id: "health",
    name: "Healthcare",
    title: "Healthcare CRM",
    description: "Improve patient engagement and manage care coordination while maintaining strict compliance.",
    features: [
      "Patient relationship management",
      "Appointment scheduling",
      "Secure communication",
      "Referral tracking",
      "Integration with EHR systems"
    ],
    rightPanelTitle: "Top Use Cases",
    rightPanelContent: [
      "Hospitals & Clinics",
      "Specialty Care Centers",
      "Medical Equipment Sales",
      "Telehealth Providers"
    ],
    linkText: "Explore Healthcare ->",
    linkUrl: "#healthcare"
  },
  {
    id: "realestate",
    name: "Real Estate",
    title: "Real Estate CRM",
    description: "Manage properties, track buyers and sellers, and close deals faster from anywhere.",
    features: [
      "Property listing management",
      "Client preference matching",
      "Open house tracking",
      "Contract & document management",
      "Automated follow-up campaigns"
    ],
    rightPanelTitle: "Top Use Cases",
    rightPanelContent: [
      "Residential Agencies",
      "Commercial Brokerages",
      "Property Management",
      "Real Estate Developers"
    ],
    linkText: "Explore Real Estate ->",
    linkUrl: "#realestate"
  }
];

const customersData = [
  {
    id: "success",
    name: "Customer Success",
    title: "Customer Success Stories",
    description: "See how forward-thinking companies use our CRM to scale operations and accelerate growth.",
    features: [
      "Customer Success Stories",
      "Enterprise Implementations",
      "Case Studies",
      "Customer Testimonials",
      "ROI & Business Growth"
    ],
    rightPanelTitle: "Featured Resources",
    rightPanelContent: [
      "Industry Success Stories",
      "Customer Interviews",
      "Implementation Guides",
      "Best Practices"
    ],
    linkText: "Explore Customer Stories ->",
    linkUrl: "#success"
  },
  {
    id: "enterprise",
    name: "Enterprise Customers",
    title: "Enterprise Solutions",
    description: "Built for scale, security, and performance. See how large organizations deploy our CRM globally.",
    features: [
      "Global Deployment Strategies",
      "Advanced Security Configurations",
      "Custom API Integrations",
      "Dedicated Support Plans",
      "Volume Licensing"
    ],
    rightPanelTitle: "Enterprise Highlights",
    rightPanelContent: [
      "Compliance Frameworks",
      "SLA Guarantees",
      "Data Residency Options",
      "Custom Onboarding"
    ],
    linkText: "View Enterprise Options ->",
    linkUrl: "#enterprise"
  },
  {
    id: "casestudies",
    name: "Case Studies",
    title: "In-Depth Case Studies",
    description: "Detailed analyses of how organizations solved complex business challenges with our platform.",
    features: [
      "Sales Pipeline Optimization",
      "Marketing Automation ROI",
      "Service Team Efficiency",
      "Cross-Department Alignment",
      "Legacy System Migration"
    ],
    rightPanelTitle: "Latest Reports",
    rightPanelContent: [
      "Q3 Growth Analysis",
      "Retail Sector Benchmark",
      "Automation Impact Study",
      "Migration Checklists"
    ],
    linkText: "Read Case Studies ->",
    linkUrl: "#cases"
  }
];

const learningData = [
  {
    id: "basics",
    name: "CRM Basics",
    title: "CRM Fundamentals",
    description: "Learn the core concepts of Customer Relationship Management and how it helps align teams and build relationships.",
    features: [
      "Contact Management",
      "Lead Management",
      "Sales Pipeline",
      "Task Tracking",
      "Reports"
    ],
    rightPanelTitle: "Resources",
    rightPanelContent: [
      "Documentation",
      "API Guides",
      "Tutorials",
      "Best Practices",
      "FAQs"
    ],
    linkText: "Start Learning ->",
    linkUrl: "#basics"
  },
  {
    id: "ai",
    name: "AI CRM",
    title: "AI in CRM",
    description: "Discover how Artificial Intelligence automates data entry, predicts sales, and personalizes outreach.",
    features: [
      "Predictive Lead Scoring",
      "Automated Data Capture",
      "Sentiment Analysis",
      "Smart Email Drafting",
      "Sales Forecasting"
    ],
    rightPanelTitle: "AI Resources",
    rightPanelContent: [
      "AI Implementation Guide",
      "Machine Learning Basics",
      "Data Privacy Standards",
      "AI Webinars"
    ],
    linkText: "Explore AI Features ->",
    linkUrl: "#ai"
  },
  {
    id: "certifications",
    name: "Certifications",
    title: "Platform Certifications",
    description: "Validate your expertise. Earn globally recognized certifications for administrators and developers.",
    features: [
      "Administrator Track",
      "Developer Track",
      "Marketing Specialist",
      "Sales Consultant",
      "Architect Level"
    ],
    rightPanelTitle: "Study Materials",
    rightPanelContent: [
      "Exam Guides",
      "Practice Tests",
      "Study Groups",
      "Instructor-led Training"
    ],
    linkText: "View Certifications ->",
    linkUrl: "#certs"
  },
  {
    id: "docs",
    name: "Documentation",
    title: "Technical Documentation",
    description: "Comprehensive guides and references for developers and technical administrators.",
    features: [
      "REST API Reference",
      "Webhooks Guide",
      "Authentication flows",
      "Data Models",
      "SDK Setup"
    ],
    rightPanelTitle: "Quick Links",
    rightPanelContent: [
      "Getting Started",
      "Code Samples",
      "Rate Limits",
      "Changelog"
    ],
    linkText: "Read the Docs ->",
    linkUrl: "#docs"
  }
];

const supportData = [
  {
    id: "help",
    name: "Help Center",
    title: "Help Center",
    description: "Search our extensive knowledge base for step-by-step guides, troubleshooting tips, and setup instructions.",
    features: [
      "Getting Started Guides",
      "Account Configuration",
      "Billing & Subscriptions",
      "User Management",
      "Integration Setup"
    ],
    rightPanelTitle: "Popular Articles",
    rightPanelContent: [
      "How to reset your password",
      "Importing contacts via CSV",
      "Setting up 2FA",
      "Understanding user roles"
    ],
    linkText: "Visit Help Center ->",
    linkUrl: "#help"
  },
  {
    id: "community",
    name: "Community",
    title: "Community Forums",
    description: "Connect with other users, share best practices, and get answers from our global community of experts.",
    features: [
      "Discussion Boards",
      "Feature Requests",
      "User Groups",
      "Expert Q&A",
      "Virtual Meetups"
    ],
    rightPanelTitle: "Top Categories",
    rightPanelContent: [
      "Sales Automation",
      "Reporting Customization",
      "API Integrations",
      "Admin Tips"
    ],
    linkText: "Join Community ->",
    linkUrl: "#community"
  },
  {
    id: "contact",
    name: "Contact Support",
    title: "Get Support",
    description: "Our award-winning support team is available 24/7 to help you resolve technical issues quickly.",
    features: [
      "Live Chat Support",
      "Ticket Submission",
      "Phone Support (Premium)",
      "Priority Routing",
      "Screen Sharing"
    ],
    rightPanelTitle: "Support Tiers",
    rightPanelContent: [
      "Standard (Email only)",
      "Professional (Chat + Email)",
      "Enterprise (24/7 Phone)",
      "Dedicated Success Manager"
    ],
    linkText: "Open a Ticket ->",
    linkUrl: "#contact"
  }
];

const companyData = [
  {
    id: "about",
    name: "About Us",
    title: "About Our Company",
    description: "We are on a mission to democratize enterprise-grade CRM software for growing businesses everywhere.",
    features: [
      "Our Mission & Vision",
      "Core Values",
      "Leadership Team",
      "Company History",
      "Global Offices"
    ],
    rightPanelTitle: "Company Highlights",
    rightPanelContent: [
      "Over 10M Users Globally",
      "Carbon Neutral since 2020",
      "Voted Best Place to Work",
      "Open Source Contributors"
    ],
    linkText: "Learn More ->",
    linkUrl: "#about"
  },
  {
    id: "careers",
    name: "Careers",
    title: "Join Our Team",
    description: "Explore opportunities to build the future of CRM. We're always looking for passionate, talented people.",
    features: [
      "Engineering Roles",
      "Sales & Marketing",
      "Customer Success",
      "Product & Design",
      "Remote Opportunities"
    ],
    rightPanelTitle: "Perks & Benefits",
    rightPanelContent: [
      "Fully Remote Options",
      "Unlimited PTO",
      "Comprehensive Health",
      "Learning Stipend"
    ],
    linkText: "View Openings ->",
    linkUrl: "#careers"
  },
  {
    id: "news",
    name: "Newsroom",
    title: "Latest News",
    description: "Stay up to date with our latest product announcements, company milestones, and press releases.",
    features: [
      "Product Announcements",
      "Press Releases",
      "Media Kit & Assets",
      "Executive Interviews",
      "Industry Reports"
    ],
    rightPanelTitle: "Recent Articles",
    rightPanelContent: [
      "Our Series C Funding",
      "New AI Features Launched",
      "European Expansion",
      "Q2 Performance Report"
    ],
    linkText: "Go to Newsroom ->",
    linkUrl: "#news"
  }
];

const crmData = [
  {
    id: "overview",
    name: "What is CRM?",
    title: "Understanding CRM",
    description: "Customer Relationship Management software helps organizations track, manage, and analyze customer interactions.",
    features: [
      "Centralized Contact Data",
      "Interaction History",
      "Pipeline Visualization",
      "Activity Tracking",
      "Performance Metrics"
    ],
    rightPanelTitle: "Key Benefits",
    rightPanelContent: [
      "Improved Customer Retention",
      "Higher Sales Conversion",
      "Better Team Collaboration",
      "Data-Driven Decisions"
    ],
    linkText: "Read the Guide ->",
    linkUrl: "#crm"
  },
  {
    id: "benefits",
    name: "Benefits",
    title: "Why Use a CRM?",
    description: "Discover the tangible business benefits of moving away from spreadsheets and adopting a unified CRM platform.",
    features: [
      "Increase Sales Productivity",
      "Enhance Customer Satisfaction",
      "Streamline Internal Processes",
      "Accurate Revenue Forecasting",
      "Automate Repetitive Tasks"
    ],
    rightPanelTitle: "By The Numbers",
    rightPanelContent: [
      "32% average sales increase",
      "40% reduction in admin time",
      "27% higher retention rates",
      "Fast ROI (typically < 6 months)"
    ],
    linkText: "See ROI Calculator ->",
    linkUrl: "#benefits"
  }
];


function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [crmDropdownOpen, setCrmDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [activeIndustryId, setActiveIndustryId] = useState("automotive");
  const [customersDropdownOpen, setCustomersDropdownOpen] = useState(false);
  const [activeCustomerTab, setActiveCustomerTab] = useState("stories");
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [activeLearningTab, setActiveLearningTab] = useState("basics");
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const [activeSupportTab, setActiveSupportTab] = useState("help");
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const handleTourClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("open-product-tour"));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
      <>
        <style>{`.navbar-wrapper {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 9999;
  background: #FFFFFF;
  border-bottom: 1px solid #DDDBDA;
  font-family: 'Inter', system-ui, sans-serif;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 300ms ease;
}

.navbar-wrapper.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.nav-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  width: 100%;
}

/* 1. Top Row: Utility Navigation */
.nav-top-row {
  height: 72px;
  background: #FFFFFF;
  border-bottom: 1px solid #DDDBDA;
}

.nav-top-container {
  height: 100%;
  justify-content: space-between;
}

.nav-top-left {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-top-right {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
}

/* Logo */
.nav-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0; /* Logo must never shrink */
  margin-right: 28px; /* Spacing before first navigation item */
}

.nav-logo .brand-strong {
  font-size: 20px; /* Reduced to 20px as requested */
  font-weight: 700; /* CRM -> weight 700 */
  color: #032D60; /* Entire brand text in #032D60 */
  letter-spacing: -0.02em;
}

.nav-logo .brand-light {
  font-size: 20px; /* Reduced to 20px as requested */
  font-weight: 500; /* Platform -> weight 500 */
  color: #032D60; /* Entire brand text in #032D60 */
  margin-left: 4px;
}

/* Top Links */
.nav-top-links {
  display: flex;
  align-items: center;
  gap: 30px; /* gap: 30px as requested */
  flex-shrink: 0;
}

.nav-top-links a, .nav-dropdown-trigger a {
  color: #032D60;
  font-size: 14px; /* Reduced link font size to 14px to save width */
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px; /* Tighter link padding to prevent overflow */
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-top-links a:hover, .nav-dropdown-trigger:hover > a {
  background: #EAF5FE;
  color: #0176D3 !important;
}

/* Top Actions */
.nav-top-actions {
  display: none; /* Renamed to .nav-top-right */
}

.nav-contact-us {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.35;
  width: 135px; /* contact section width 135px as requested */
  flex-shrink: 0;
}

.contact-link {
  color: #0176D3;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.contact-link:hover {
  color: #014486;
  text-decoration: underline;
}

.contact-phone {
  color: #181818;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.nav-icon-btn {
  background: transparent;
  border: none;
  outline: none;
  color: #4A5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background-color 150ms ease, color 150ms ease;
  flex-shrink: 0;
}

.nav-icon-btn:hover {
  background: #F3F4F6;
  color: #0176D3;
}

.nav-login-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px; /* Spaced Globe and Login as requested */
  color: #032D60;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: color 150ms ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.nav-login-link:hover {
  color: #0176D3;
}

.nav-get-started-btn {
  background: #2E844A; /* Soft green */
  color: #FFFFFF;
  height: 44px;
  padding: 0 24px; /* padding: 0 24px */
  border-radius: 6px;
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
  flex-shrink: 0;
  white-space: nowrap;
  min-width: 120px; /* min-width: 120px */
}

.nav-get-started-btn:hover {
  background: #226438;
}

/* 2. Sub Row: Main Section Headers */
.nav-sub-row {
  height: 54px; /* Centered, polished height */
  background: #FFFFFF;
  border-bottom: 1px solid #DDDBDA;
}

.nav-sub-container {
  height: 100%;
  justify-content: space-between;
}

.nav-sub-left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-sub-brand {
  font-size: 18px; /* CRM brand text size 18px */
  font-weight: 700; /* CRM brand text weight 700 as requested */
  color: #032D60;
  letter-spacing: -0.01em;
  margin-right: 12px; /* Moves brand header slightly left */
}

.nav-sub-links {
  display: flex;
  align-items: center;
  gap: 32px; /* More spacing between items */
}

.nav-sub-links a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #032D60;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: color 150ms ease;
}

.nav-sub-links a:hover {
  color: #0176D3;
}

.has-dropdown svg {
  color: #718096;
  transition: transform 150ms ease;
}

.has-dropdown:hover svg {
  transform: rotate(180deg);
  color: #0176D3;
}

.nav-sub-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn-outline {
  border: 1.5px solid #0176D3;
  color: #0176D3;
  background: #FFFFFF;
  height: 44px; /* CTA buttons height 44px */
  padding: 0 28px; /* Padding 28px */
  border-radius: 4px; /* Border radius 4px */
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.nav-btn-outline:hover {
  background: #EFF6FF;
  border-color: #014486;
  color: #014486;
}

.nav-btn-solid {
  background: #0176D3;
  color: #FFFFFF;
  height: 44px; /* CTA buttons height 44px */
  padding: 0 28px; /* Padding 28px */
  border-radius: 4px; /* Border radius 4px */
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 150ms ease;
}

.nav-btn-solid:hover {
  background: #014486;
}

/* 3. Promo Banner */
.nav-promo-banner {
  background: #032D60;
  color: #FFFFFF;
  height: 48px; /* Exactly 48px high */
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
}

@media (max-width: 768px) {
  .nav-promo-banner {
    display: none;
  }
}

.nav-banner-container {
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 40px;
}

.banner-link {
  color: #FFFFFF;
  text-decoration: underline;
  font-weight: 700;
  transition: color 150ms ease;
}

.banner-link:hover {
  color: #93C5FD;
}

/* Mobile Toggle Hamburger */
.nav-mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 22px;
  height: 16px;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
}

.nav-mobile-toggle span {
  width: 100%;
  height: 2px;
  background-color: #1A202C;
  border-radius: 2px;
  transition: all 250ms ease;
}

.nav-mobile-toggle.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav-mobile-toggle.open span:nth-child(2) {
  opacity: 0;
}

.nav-mobile-toggle.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Drawer */
.nav-mobile-drawer {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  z-index: 999;
  animation: drawerSlide 200ms ease both;
}

.drawer-links {
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  gap: 12px;
}

.drawer-section-title {
  font-size: 11px;
  text-transform: uppercase;
  color: #9CA3AF;
  font-weight: 700;
  margin-top: 12px;
  letter-spacing: 0.05em;
}

.drawer-links a {
  color: #1A202C;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
  transition: color 150ms ease;
}

.drawer-links a:hover {
  color: #0176D3;
}

.drawer-action-link {
  color: #0176D3 !important;
}

.drawer-action-btn-green {
  background: #2E7D32;
  color: #FFFFFF !important;
  text-align: center;
  padding: 12px !important;
  border-radius: 4px;
  font-weight: 700 !important;
  margin-top: 8px;
  border: none !important;
}

.drawer-action-btn-blue {
  background: #0176D3;
  color: #FFFFFF !important;
  text-align: center;
  padding: 12px !important;
  border-radius: 4px;
  font-weight: 700 !important;
  border: none !important;
}

@keyframes drawerSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsiveness */
@media (max-width: 1024px) {
  .nav-top-links, 
  .nav-sub-row {
    display: none; /* Hide top links and sub row completely, move to mobile drawer */
  }

  .nav-top-right {
    display: none;
  }

  .nav-mobile-toggle {
    display: flex;
    width: 26px;
    height: 20px;
    padding: 10px;
    box-sizing: content-box;
  }

  .nav-mobile-toggle.open span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  .nav-mobile-toggle.open span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }

  .nav-top-row {
    height: 72px;
  }

  .nav-logo .brand-strong,
  .nav-logo .brand-light {
    font-size: 24px;
  }

  .nav-container {
    padding: 0 20px;
  }

  .drawer-links a {
    padding: 12px 0;
  }
}

/* Mega Dropdown Menu Styles */
.nav-dropdown-trigger {
  position: relative;
  height: 100%;
  display: inline-flex;
  align-items: center;
}

.mega-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 12px;
  z-index: 10000;
  width: 720px;
  animation: megaFadeIn 150ms ease-out both;
}

/* Override position for "What is CRM?" dropdown to prevent screen overflow */
.what-is-crm-mega {
  left: -184px !important;
  transform: none !important;
}

.what-is-crm-mega .mega-dropdown-arrow {
  left: 239px !important;
  transform: rotate(45deg) !important;
}

.mega-dropdown-card {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #E2E8F0;
  padding: 28px;
  width: 100%;
  position: relative;
}

.mega-dropdown-arrow {
  position: absolute;
  top: 5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 14px;
  height: 14px;
  background: #FFFFFF;
  border-left: 1px solid #E2E8F0;
  border-top: 1px solid #E2E8F0;
  z-index: 10001;
}

.mega-dropdown-inner {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 28px;
}

.mega-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.mega-column-left {
  border-right: 1px solid #E2E8F0;
  padding-right: 28px;
}

.mega-column-middle {
  border-right: 1px solid #E2E8F0;
  padding-right: 28px;
}

.mega-subtitle {
  font-size: 12px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.mega-bold-link {
  font-size: 16px;
  font-weight: 800;
  color: #032D60 !important;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 150ms ease;
}

.mega-bold-link:hover {
  color: #0176D3 !important;
  text-decoration: underline;
}

.mega-desc {
  font-size: 13px;
  color: #4A5568;
  line-height: 1.6;
  margin: 0;
}

.mega-link-bold {
  font-size: 14px;
  font-weight: 700;
  color: #0176D3 !important;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 150ms ease;
}

.mega-link-bold:hover {
  color: #032D60 !important;
  text-decoration: underline;
}

@keyframes megaFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Standardized Mega Menu Styles */
.mega-dropdown-card {
  background: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid #E2E8F0;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Top Horizontal Tabs */
.mega-top-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E2E8F0;
  padding: 0 16px;
  background: #F8FAFC;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.mega-tab-btn {
  background: transparent;
  border: none;
  padding: 16px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  flex: 1;
  text-align: center;
}

.mega-tab-btn:hover {
  color: #032D60;
}

.mega-tab-btn.active {
  color: #0056D2;
}

.mega-tab-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0056D2;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.mega-tab-btn.active::after {
  transform: scaleX(1);
}

/* Single-Column Content Layout */
.mega-content-simplified {
  padding: 32px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mega-col-single h3 {
  font-size: 22px;
  font-weight: 700;
  color: #032D60;
  margin-bottom: 12px;
}

.mega-desc {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
}

.mega-cta-link {
  display: inline-flex;
  align-items: center;
  color: #0056D2;
  font-weight: 600;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s ease;
}

.mega-cta-link:hover {
  color: #0043A8;
  text-decoration: underline;
}

/* Shared Megamenu Positioning */
.industries-mega,
.customers-mega,
.learning-mega,
.support-mega,
.company-mega,
.what-is-crm-mega {
  width: 600px; /* Reduced width */
}

/* Adjust absolute positioning to center under the nav items */
.industries-mega { left: -150px !important; }
.customers-mega { left: -200px !important; }
.learning-mega { left: -250px !important; }
.support-mega { left: -300px !important; }
.company-mega { left: -350px !important; }
.what-is-crm-mega { left: -100px !important; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .mega-top-tabs {
    flex-wrap: wrap;
  }
  .mega-tab-btn {
    flex: 1 1 50%;
  }
  .industries-mega,
  .customers-mega,
  .learning-mega,
  .support-mega,
  .company-mega,
  .what-is-crm-mega {
    width: 100%;
    left: 0 !important;
  }
}

  `}</style>

    <>
      <nav className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-top-row">
        <div className="nav-container nav-top-container">
          <div className="nav-top-left">
            {/* Logo */}
            <a href="#home" className="nav-logo">
              <span className="brand-strong">CRM</span>
              <span className="brand-light">Platform</span>
            </a>

            {/* Links Middle */}
            <div className="nav-top-links">
            <a href="#product">Products</a>
            
            {/* Industries Dropdown Trigger */}
            <div 
              className="nav-dropdown-trigger"
              onMouseEnter={() => setIndustriesDropdownOpen(true)}
              onMouseLeave={() => setIndustriesDropdownOpen(false)}
            >
              <a href="#solutions" className="has-dropdown">
                <span>Industries</span>
                <ChevronDown size={14} />
              </a>

              {/* Industries Mega Dropdown */}
              {industriesDropdownOpen && (
                <div className="mega-dropdown industries-mega">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card industries-card">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {industriesData.map((item) => (
                        <button
                          key={item.id}
                          className={`mega-tab-btn ${activeIndustryId === item.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveIndustryId(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Single-Column Content Layout */}
                    <div className="mega-content-simplified">
                      {(() => {
                        const activeItem = industriesData.find(i => i.id === activeIndustryId) || industriesData[0];
                        return (
                          <div className="mega-col-single animate-fade-in" key={`col-${activeItem.id}`}>
                            <h3>{activeItem.title}</h3>
                            <p className="mega-desc">{activeItem.description}</p>
                            <a href={activeItem.linkUrl} className="mega-cta-link">
                              {activeItem.linkText}
                            </a>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}
              </div>

            {/* Customers Dropdown Trigger */}
            <div 
              className="nav-dropdown-trigger"
              onMouseEnter={() => setCustomersDropdownOpen(true)}
              onMouseLeave={() => setCustomersDropdownOpen(false)}
            >
              <a href="#customers" className="has-dropdown">
                <span>Customers</span>
                <ChevronDown size={14} />
              </a>

              {/* Customers Mega Dropdown */}
              {customersDropdownOpen && (
                <div className="mega-dropdown customers-mega">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card customers-card">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {customersData.map((item) => (
                        <button
                          key={item.id}
                          className={`mega-tab-btn ${activeCustomerTab === item.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveCustomerTab(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Single-Column Content Layout */}
                    <div className="mega-content-simplified">
                      {(() => {
                        const activeItem = customersData.find(i => i.id === activeCustomerTab) || customersData[0];
                        return (
                          <div className="mega-col-single animate-fade-in" key={`col-${activeItem.id}`}>
                            <h3>{activeItem.title}</h3>
                            <p className="mega-desc">{activeItem.description}</p>
                            <a href={activeItem.linkUrl} className="mega-cta-link">
                              {activeItem.linkText}
                            </a>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}
              </div>
            {/* Resources Dropdown Trigger */}
            <a href="#resources">Resources</a>
            {/* Learning Dropdown Trigger */}
            <div 
              className="nav-dropdown-trigger"
              onMouseEnter={() => setLearningDropdownOpen(true)}
              onMouseLeave={() => setLearningDropdownOpen(false)}
            >
              <a href="#learning" className="has-dropdown">
                <span>Learning</span>
                <ChevronDown size={14} />
              </a>

              {/* Learning Mega Dropdown */}
              {learningDropdownOpen && (
                <div className="mega-dropdown learning-mega">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card learning-card">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {learningData.map((item) => (
                        <button
                          key={item.id}
                          className={`mega-tab-btn ${activeLearningTab === item.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveLearningTab(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Single-Column Content Layout */}
                    <div className="mega-content-simplified">
                      {(() => {
                        const activeItem = learningData.find(i => i.id === activeLearningTab) || learningData[0];
                        return (
                          <div className="mega-col-single animate-fade-in" key={`col-${activeItem.id}`}>
                            <h3>{activeItem.title}</h3>
                            <p className="mega-desc">{activeItem.description}</p>
                            <a href={activeItem.linkUrl} className="mega-cta-link">
                              {activeItem.linkText}
                            </a>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}
              </div>
            {/* Support Dropdown Trigger */}
            <div 
              className="nav-dropdown-trigger"
              onMouseEnter={() => setSupportDropdownOpen(true)}
              onMouseLeave={() => setSupportDropdownOpen(false)}
            >
              <a href="#support" className="has-dropdown">
                <span>Support</span>
                <ChevronDown size={14} />
              </a>

              {/* Support Mega Dropdown */}
              {supportDropdownOpen && (
                <div className="mega-dropdown support-mega">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card support-card">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {supportData.map((item) => (
                        <button
                          key={item.id}
                          className={`mega-tab-btn ${activeSupportTab === item.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveSupportTab(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Single-Column Content Layout */}
                    <div className="mega-content-simplified">
                      {(() => {
                        const activeItem = supportData.find(i => i.id === activeSupportTab) || supportData[0];
                        return (
                          <div className="mega-col-single animate-fade-in" key={`col-${activeItem.id}`}>
                            <h3>{activeItem.title}</h3>
                            <p className="mega-desc">{activeItem.description}</p>
                            <a href={activeItem.linkUrl} className="mega-cta-link">
                              {activeItem.linkText}
                            </a>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}
              </div>
            {/* Company Dropdown Trigger */}
            <div 
              className="nav-dropdown-trigger"
              onMouseEnter={() => setCompanyDropdownOpen(true)}
              onMouseLeave={() => setCompanyDropdownOpen(false)}
            >
              <a href="#company" className="has-dropdown">
                <span>Company</span>
                <ChevronDown size={14} />
              </a>

              {/* Company Mega Dropdown */}
              {companyDropdownOpen && (
                <div className="mega-dropdown company-mega">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card company-card">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {companyData.map((item) => (
                        <button
                          key={item.id}
                          className={`mega-tab-btn ${activeCompanyTab === item.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveCompanyTab(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Single-Column Content Layout */}
                    <div className="mega-content-simplified">
                      {(() => {
                        const activeItem = companyData.find(i => i.id === activeCompanyTab) || companyData[0];
                        return (
                          <div className="mega-col-single animate-fade-in" key={`col-${activeItem.id}`}>
                            <h3>{activeItem.title}</h3>
                            <p className="mega-desc">{activeItem.description}</p>
                            <a href={activeItem.linkUrl} className="mega-cta-link">
                              {activeItem.linkText}
                            </a>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}
              </div>
          </div>
        </div>

        <div className="nav-top-right">
            <div className="nav-contact-us">
              <a href="#contact" className="contact-link">Contact Us</a>
              <span className="contact-phone">1800-420-7332</span>
            </div>
            
            <button className="nav-icon-btn" aria-label="Globe">
              <Globe size={18} />
            </button>

            <Link to="/login" className="nav-login-link">
              <User size={16} />
              <span>Login</span>
            </Link>

            <a href="#pricing" className="nav-get-started-btn">
              Get started
            </a>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <button 
            className={`nav-mobile-toggle ${mobileMenuOpen ? "open" : ""}`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* 2. Sub Navbar Row */}
      <div className="nav-sub-row">
        <div className="nav-container nav-sub-container">
          <div className="nav-sub-left">
            <span className="nav-sub-brand">CRM</span>
            <div className="nav-sub-links">
              <a href="#home">Overview</a>
              <div 
                className="nav-dropdown-trigger"
                onMouseEnter={() => setCrmDropdownOpen(true)}
                onMouseLeave={() => setCrmDropdownOpen(false)}
              >
                <a href="#what-is-crm" className="has-dropdown">
                  <span>What is CRM?</span>
                  <ChevronDown size={14} />
                </a>
                
                {/* Mega Dropdown Menu */}
                {crmDropdownOpen && (
                <div className="mega-dropdown what-is-crm-mega">
                  <div className="mega-dropdown-arrow"></div>
                  <div className="mega-dropdown-card what-is-crm-card">
                    
                    {/* Top Horizontal Tabs */}
                    <div className="mega-top-tabs">
                      {crmData.map((item) => (
                        <button
                          key={item.id}
                          className={`mega-tab-btn ${activeCrmTab === item.id ? "active" : ""}`}
                          onMouseEnter={() => setActiveCrmTab(item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Single-Column Content Layout */}
                    <div className="mega-content-simplified">
                      {(() => {
                        const activeItem = crmData.find(i => i.id === activeCrmTab) || crmData[0];
                        return (
                          <div className="mega-col-single animate-fade-in" key={`col-${activeItem.id}`}>
                            <h3>{activeItem.title}</h3>
                            <p className="mega-desc">{activeItem.description}</p>
                            <a href={activeItem.linkUrl} className="mega-cta-link">
                              {activeItem.linkText}
                            </a>
                          </div>
                        );
                      })()}
                    </div>

                  </div>
                </div>
              )}
              </div>
              <a href="#solutions" className="has-dropdown">
                <span>Solutions</span>
                <ChevronDown size={14} />
              </a>
              <a href="#pricing">Pricing</a>
              <a href="#features">Features</a>
              <Link to="/login">Dashboard</Link>
            </div>
          </div>

          <div className="nav-sub-right">
            <Link to="/login" className="nav-btn-outline">
              Start for free
            </Link>
            <a href="#guided-tour" className="nav-btn-solid" onClick={handleTourClick}>
              Take guided tour
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer">
          <div className="drawer-links">
            <span className="drawer-section-title">Core Navigation</span>
            <a href="#product" onClick={() => setMobileMenuOpen(false)}>Products</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Industries</a>
            <a href="#customers" onClick={() => setMobileMenuOpen(false)}>Customers</a>
            <a href="#resources" onClick={() => setMobileMenuOpen(false)}>Resources</a>
            <a href="#learning" onClick={() => setMobileMenuOpen(false)}>Learning</a>
            <a href="#company" onClick={() => setMobileMenuOpen(false)}>Company</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            
            <span className="drawer-section-title">CRM Section</span>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Overview</a>
            <a href="#what-is-crm" onClick={() => setMobileMenuOpen(false)}>What is CRM?</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Solutions</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            
            <span className="drawer-section-title">Actions</span>
            <Link to="/login" className="drawer-action-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <a href="#pricing" className="drawer-action-btn-green" onClick={() => setMobileMenuOpen(false)}>Get started</a>
            <a href="#guided-tour" className="drawer-action-btn-blue" onClick={(e) => { setMobileMenuOpen(false); handleTourClick(e); }}>Take guided tour</a>
          </div>
        </div>
      )}
    </nav>

    {/* 3. Promo Banner Row */}
    <div className="nav-promo-banner">
      <div className="nav-container nav-banner-container">
        <span>Close more deals, faster—start your 30-day free Sales Cloud trial today.</span>
        <a href="#pricing" className="banner-link">Know more</a>
      </div>
    </div>
  </>
  
      </>);
}

export default Navbar;
