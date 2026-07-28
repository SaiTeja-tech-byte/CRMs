import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Cloud, ExternalLink, Facebook, Globe, Linkedin, Twitter, User } from "lucide-react";

export const industriesData = [
  {
    id: "automotive",
    name: "Automotive",
    title: "Automotive Solutions",
    description: "Manage dealership leads, customer inquiries, test drives, and after-sales service from one CRM.",
    features: ["Lead Management", "Test Drive Scheduling", "Service Reminders", "Customer History"],
    linkText: "Explore Automotive CRM →",
    linkUrl: "#industry-automotive",
    rightPanelTitle: "Supported Features",
    rightPanelContent: ["Dealership pipeline", "Test drive bookings", "Service scheduler", "Inventory tracking", "Sales analytics"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    title: "Healthcare CRM",
    description: "Improve patient engagement and streamline healthcare operations with intelligent CRM automation.",
    features: ["Patient Appointment Management", "Electronic Medical Records", "Automated Follow-ups", "Doctor Scheduling"],
    linkText: "Explore Healthcare CRM →",
    linkUrl: "#industry-healthcare",
    rightPanelTitle: "Common Use Cases",
    rightPanelContent: ["Doctor dashboard", "Patient analytics", "Appointment calendar", "KPI tracking", "Compliance management"]
  },
  {
    id: "retail",
    name: "Retail & eCommerce",
    title: "Retail Solutions",
    description: "Track customers, purchases, loyalty programs, and personalized marketing campaigns.",
    features: ["Customer Profiles", "Purchase History", "Loyalty Rewards", "Marketing Automation"],
    linkText: "Explore Retail CRM →",
    linkUrl: "#industry-retail",
    rightPanelTitle: "Benefits",
    rightPanelContent: ["Increase repeat purchases", "Customer segmentation", "Revenue forecasting", "Product insights", "Campaign ROI"]
  },
  {
    id: "finance",
    name: "Financial Services",
    title: "Financial Services CRM",
    description: "Manage client relationships securely while automating onboarding and compliance.",
    features: ["Client Management", "Loan Pipeline", "Compliance Tracking", "Investment Portfolios"],
    linkText: "Explore Financial CRM →",
    linkUrl: "#industry-finance",
    rightPanelTitle: "Supported Features",
    rightPanelContent: ["Client dashboard", "Loan pipeline stages", "Investment tracking", "Compliance status", "Secure messaging"]
  },
  {
    id: "realestate",
    name: "Real Estate",
    title: "Real Estate Solutions",
    description: "Capture property inquiries and convert prospects into successful property sales.",
    features: ["Property Listings", "Buyer Tracking", "Site Visit Scheduling", "Deal Pipeline"],
    linkText: "Explore Real Estate CRM →",
    linkUrl: "#industry-realestate",
    rightPanelTitle: "Common Use Cases",
    rightPanelContent: ["Property CRM", "Buyer pipeline management", "Lead funnel optimization", "Deal staging", "Agent productivity tracking"]
  },
  {
    id: "education",
    name: "Education",
    title: "Education CRM",
    description: "Manage student admissions, inquiries, alumni engagement, and campus communication.",
    features: ["Student Profiles", "Admission Pipeline", "Omnichannel Communication", "Custom Reports"],
    linkText: "Explore Education CRM →",
    linkUrl: "#industry-education",
    rightPanelTitle: "Benefits",
    rightPanelContent: ["Streamline enrollments", "Application funnel tracking", "Alumni engagement scoring", "Course analytics", "Automated reminders"]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    title: "Manufacturing Solutions",
    description: "Track distributors, suppliers, quotations, and customer orders efficiently.",
    features: ["Distributor CRM", "Inventory Requests", "Sales Orders", "Service Requests"],
    linkText: "Explore Manufacturing CRM →",
    linkUrl: "#industry-manufacturing",
    rightPanelTitle: "Supported Features",
    rightPanelContent: ["Supply chain pipeline", "Order tracking systems", "Distributor metrics", "Quote funnel", "Delivery optimization"]
  },
  {
    id: "saas",
    name: "SaaS & Technology",
    title: "SaaS CRM",
    description: "Manage trial users, subscriptions, onboarding, and customer success.",
    features: ["Trial Management", "Customer Success", "Subscription Tracking", "Support Tickets"],
    linkText: "Explore SaaS CRM →",
    linkUrl: "#industry-saas",
    rightPanelTitle: "Common Use Cases",
    rightPanelContent: ["Subscription MRR tracking", "Churn analytics", "Trial conversion funnel", "Support volume metrics", "Onboarding automation"]
  }
];

export const customersData = [
  {
    id: "stories",
    name: "Success Stories",
    title: "Customer Success Stories",
    description: "Discover how businesses use CRM Platform to automate sales, improve customer relationships, and accelerate revenue growth.",
    features: ["Read detailed case studies", "Watch customer interviews", "Explore ROI metrics", "Learn implementation strategies"],
    linkText: "Explore Success Stories →",
    linkUrl: "#stories",
    rightPanelTitle: "Featured Outcomes",
    rightPanelContent: ["Increased sales velocity", "Reduced response times", "Improved customer retention", "Streamlined global operations"]
  },
  {
    id: "enterprise",
    name: "Enterprise Customers",
    title: "Enterprise Solutions",
    description: "Trusted by growing enterprises to manage millions of customer interactions every month securely.",
    features: ["Dedicated account management", "Custom deployment options", "Advanced security protocols", "SLA guarantees"],
    linkText: "View Enterprise Solutions →",
    linkUrl: "#enterprise",
    rightPanelTitle: "Recommended Modules",
    rightPanelContent: ["Advanced Analytics", "Custom Workflows", "API Integrations", "Role-based Access Control", "Audit Logging"]
  },
  {
    id: "case-studies",
    name: "Case Studies",
    title: "Industry Case Studies",
    description: "Deep dives into how specific sectors implement CRM solutions for maximum business impact.",
    features: ["Retail CRM Implementation", "Healthcare Data Security", "Financial Services Workflows", "Manufacturing Supply Chain"],
    linkText: "Read Case Studies →",
    linkUrl: "#case-studies",
    rightPanelTitle: "Common Use Cases",
    rightPanelContent: ["Pipeline optimization", "Lead scoring models", "Automated marketing campaigns", "Support ticket resolution"]
  }
];

export const learningData = [
  {
    id: "basics",
    name: "CRM Basics",
    title: "CRM Fundamentals",
    description: "Learn the core concepts of Customer Relationship Management and how it helps align teams and build relationships.",
    features: ["What is a CRM system?", "Key components of CRM", "Benefits of centralizing customer data", "Getting started checklist"],
    linkText: "Start Learning →",
    linkUrl: "#learning-basics",
    rightPanelTitle: "Supported Topics",
    rightPanelContent: ["Contact Management", "Deal Pipelines", "Task Tracking", "Basic Reporting", "User Permissions"]
  },
  {
    id: "academy",
    name: "AI CRM Academy",
    title: "AI Workflow Automation",
    description: "Master artificial intelligence in CRM, from automated replies to smart pipeline insights and predictions.",
    features: ["AI-powered lead scoring", "Predictive sales forecasts", "Automating repetitive follow-ups", "AI chatbot configuration"],
    linkText: "Explore AI Academy →",
    linkUrl: "#learning-academy",
    rightPanelTitle: "Benefits",
    rightPanelContent: ["Reduce manual data entry", "Identify high-value leads", "Forecast revenue accurately", "Enhance customer engagement"]
  },
  {
    id: "certification",
    name: "Certification",
    title: "Professional Certifications",
    description: "Validate your skills and earn badges by completing CRM Platform training modules and passing certification exams.",
    features: ["Sales Professional Exam", "Administrator Certification", "Automation Specialist Exam", "Developer Certification"],
    linkText: "View Certifications →",
    linkUrl: "#learning-certification",
    rightPanelTitle: "Recommended Paths",
    rightPanelContent: ["For Sales Reps", "For CRM Administrators", "For IT Managers", "For Marketing Specialists", "For Developers"]
  },
  {
    id: "docs",
    name: "Documentation",
    title: "Technical Documentation",
    description: "Detailed setup guides, server installation parameters, security protocols, and advanced admin settings.",
    features: ["Installation guidelines", "Database synchronization", "User role permissions", "Security & data privacy protocols"],
    linkText: "Read Documentation →",
    linkUrl: "#learning-docs",
    rightPanelTitle: "Key Areas",
    rightPanelContent: ["API Reference", "SDK Guides", "Authentication", "Webhooks", "Data Migration"]
  }
];

export const supportData = [
  {
    id: "help",
    name: "Help Center",
    title: "Knowledge Base",
    description: "Search thousands of helpful guides, tips, and step-by-step documentation articles for CRM Platform.",
    features: ["Setting Up Your CRM", "Importing Customer Data", "Managing Sales Pipelines", "AI Automation Setup"],
    linkText: "Visit Help Center →",
    linkUrl: "#support-help",
    rightPanelTitle: "Popular Categories",
    rightPanelContent: ["Getting Started", "Account & Billing", "Integrations", "Troubleshooting", "Best Practices"]
  },
  {
    id: "contact",
    name: "Contact Support",
    title: "Get in Touch",
    description: "Reach out to our dedicated support team for technical assistance, billing inquiries, or strategic advice.",
    features: ["24/7 Global Support", "Live Chat Assistance", "Priority Phone Routing", "Dedicated Success Managers"],
    linkText: "Contact Us →",
    linkUrl: "#support-contact",
    rightPanelTitle: "Support Channels",
    rightPanelContent: ["Live Chat (Instant)", "Email (Under 2 hours)", "Phone (Toll-Free)", "Community Forum", "Submit a Ticket"]
  },
  {
    id: "community",
    name: "Community Forum",
    title: "User Community",
    description: "Connect with thousands of users, developers, and administrators to share ideas, ask questions, and collaborate.",
    features: ["Developer discussion groups", "Sales rep community chats", "Feature request portal", "Local user groups"],
    linkText: "Join the Community →",
    linkUrl: "#support-community",
    rightPanelTitle: "Trending Topics",
    rightPanelContent: ["Customizing Dashboards", "Advanced Automation Rules", "Third-party Integrations", "New Feature Announcements"]
  }
];

export const companyData = [
  {
    id: "about",
    name: "About Us",
    title: "Our Mission",
    description: "We are building the future of customer relationship management, focusing on simplicity, automation, and AI-driven insights.",
    features: ["Our Founding Story", "Core Values & Culture", "Leadership Team", "Global Offices"],
    linkText: "Learn About Us →",
    linkUrl: "#company-about",
    rightPanelTitle: "Company Highlights",
    rightPanelContent: ["Over 10,000 customers globally", "Recognized as an industry leader", "Commitment to data privacy", "Continuous innovation"]
  },
  {
    id: "careers",
    name: "Careers",
    title: "Join Our Team",
    description: "Explore opportunities to work with a passionate team dedicated to solving complex problems and empowering businesses.",
    features: ["Engineering & Product", "Sales & Marketing", "Customer Success", "Operations & Finance"],
    linkText: "View Open Roles →",
    linkUrl: "#company-careers",
    rightPanelTitle: "Benefits & Perks",
    rightPanelContent: ["Comprehensive Health Coverage", "Flexible Remote Work", "Continuous Learning Stipend", "Equity Options", "Generous PTO"]
  },
  {
    id: "news",
    name: "Newsroom",
    title: "Latest Updates",
    description: "Stay up to date with the latest company announcements, product releases, and industry insights.",
    features: ["Press Releases", "Media Mentions", "Brand Assets", "Upcoming Events"],
    linkText: "Visit Newsroom →",
    linkUrl: "#company-news",
    rightPanelTitle: "Recent Announcements",
    rightPanelContent: ["Launch of AI Copilot", "Expansion into European Markets", "New Enterprise Security Features", "Annual Partner Summit"]
  }
];

export const crmData = [
  {
    id: "overview",
    name: "CRM Overview",
    title: "What is CRM?",
    description: "Customer Relationship Management software helps businesses manage interactions, track sales, and improve relationships.",
    features: ["Centralized Customer Database", "Sales Pipeline Management", "Automated Workflows", "Performance Analytics"],
    linkText: "Explore CRM Benefits →",
    linkUrl: "#crm-overview",
    rightPanelTitle: "Core Capabilities",
    rightPanelContent: ["Lead Tracking", "Contact Management", "Deal Forecasting", "Email Integration", "Task Management"]
  },
  {
    id: "sales",
    name: "Sales Hub",
    title: "Accelerate Sales",
    description: "Empower your sales team with tools to close deals faster, from prospecting to signing contracts.",
    features: ["Lead Scoring", "Email Tracking", "Quote Generation", "Sales Forecasting"],
    linkText: "Explore Sales Hub →",
    linkUrl: "#crm-sales",
    rightPanelTitle: "Common Use Cases",
    rightPanelContent: ["B2B Sales Cycles", "Account-Based Marketing", "Field Sales Tracking", "Inside Sales Workflows"]
  },
  {
    id: "service",
    name: "Service Hub",
    title: "Elevate Support",
    description: "Provide exceptional customer service with a unified help desk, ticketing system, and knowledge base.",
    features: ["Ticketing System", "Live Chat", "Customer Feedback", "Knowledge Base Builder"],
    linkText: "Explore Service Hub →",
    linkUrl: "#crm-service",
    rightPanelTitle: "Benefits",
    rightPanelContent: ["Decrease response times", "Improve customer satisfaction", "Automate ticket routing", "Self-service empowerment"]
  }
];


function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [crmDropdownOpen, setCrmDropdownOpen] = useState(false);
    const [activeCrmTab, setActiveCrmTab] = useState("overview");
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
    const [activeCompanyTab, setActiveCompanyTab] = useState("about");
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

/* Industries Mega Menu Specifics */
.industries-mega {
  width: 960px;
  left: -210px !important;
  transform: none !important;
  animation: megaFadeInIndustries 150ms ease-out both !important;
}

.industries-mega .mega-dropdown-arrow {
  left: 245px !important;
  transform: rotate(45deg) !important;
}

@keyframes megaFadeInIndustries {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.industries-card {
  padding: 0 !important;
  overflow: hidden;
}

.industries-mega-inner {
  display: grid;
  grid-template-columns: 240px 1.1fr 1fr;
  height: 480px;
}

/* Sidebar List */
.industries-sidebar {
  background: #F8FAFC;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
}

.industry-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 13.5px;
  font-weight: 600;
  color: #4A5568;
  transition: all 150ms ease;
  border-left: 3px solid transparent;
}

.industry-btn:hover {
  background: #EDF2F7;
  color: #0176D3;
}

.industry-btn.active {
  background: #EFF6FF;
  color: #0176D3;
  border-left-color: #0176D3;
  padding-left: 17px;
}

.industry-btn-icon {
  margin-right: 10px;
  font-size: 16px;
}

.industry-btn-name {
  flex: 1;
}

.industry-btn-arrow {
  color: #A0AEC0;
  font-size: 16px;
}

.industry-btn.active .industry-btn-arrow {
  color: #0176D3;
}

/* Middle Details Panel */
.industries-middle-panel {
  padding: 28px;
  border-right: 1px solid #E2E8F0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
}

.industry-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.industry-details h3 {
  font-size: 18px;
  font-weight: 800;
  color: #032D60;
  margin: 0;
}

.industry-desc {
  font-size: 13px;
  color: #4A5568;
  line-height: 1.6;
  margin: 0;
}

.industry-solutions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.industry-solutions-list h4 {
  font-size: 11px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}

.industry-solutions-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.industry-solutions-list li {
  font-size: 13px;
  color: #2D3748;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.industry-solutions-list li::before {
  content: "•";
  color: #0176D3;
  font-weight: bold;
}

.industry-cta-link {
  font-size: 13.5px;
  font-weight: 700;
  color: #0176D3;
  text-decoration: none;
  margin-top: 8px;
  transition: color 150ms ease;
}

.industry-cta-link:hover {
  color: #032D60;
  text-decoration: underline;
}

/* Right Preview Panel */
.industries-right-panel {
  padding: 28px;
  background: #F8FAFC;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.industry-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.preview-visualization {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  transition: transform 300ms ease;
}

.preview-visualization:hover {
  transform: scale(1.02);
}

.visualization-header {
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid #F3F4F6;
  padding-bottom: 10px;
}

.viz-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #CBD5E0;
}

.viz-title {
  font-size: 10px;
  font-weight: 700;
  color: #718096;
  margin-left: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.visualization-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.viz-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: #4A5568;
  font-weight: 500;
}

.viz-checkbox {
  color: #10B981;
  font-weight: bold;
}

/* Metrics Section */
.preview-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.metric-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  padding: 8px 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.01);
}

.metric-value {
  font-size: 13.5px;
  font-weight: 800;
  color: #0176D3;
}

.metric-label {
  font-size: 8.5px;
  color: #718096;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 2px;
  line-height: 1.2;
}

/* Action Buttons */
.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.preview-btn-primary {
  background: #0176D3;
  color: #FFFFFF !important;
  text-align: center;
  padding: 9px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: background 150ms ease;
}

.preview-btn-primary:hover {
  background: #014486;
}

.preview-btn-secondary {
  border: 1.5px solid #CBD5E0;
  color: #4A5568 !important;
  text-align: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 150ms ease;
  background: #FFFFFF;
}

.preview-btn-secondary:hover {
  background: #EDF2F7;
  border-color: #A0AEC0;
}

/* Animations */
.animate-fade-in {
  animation: megaPanelFade 200ms ease-out both;
}

@keyframes megaPanelFade {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Customers Mega Menu Specifics */
.customers-mega {
  width: 960px;
  left: -320px !important;
  transform: none !important;
  animation: megaFadeInCustomers 150ms ease-out both !important;
}

.customers-mega .mega-dropdown-arrow {
  left: 345px !important; /* Aligns directly with Customers link center */
  transform: rotate(45deg) !important;
}

.customers-card {
  padding: 0 !important;
  overflow: hidden;
}

.customers-mega-inner {
  display: grid;
  grid-template-columns: 240px 1.1fr 1fr;
  height: 480px;
}

/* Left Sidebar tabs */
.customers-sidebar {
  background: #F8FAFC;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
}

.customer-tab-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 13.5px;
  font-weight: 600;
  color: #4A5568;
  transition: all 150ms ease;
  border-left: 3px solid transparent;
}

.customer-tab-btn:hover {
  background: #EDF2F7;
  color: #0176D3;
}

.customer-tab-btn.active {
  background: #EFF6FF;
  color: #0176D3;
  border-left-color: #0176D3;
  padding-left: 17px;
}

.customer-tab-arrow {
  color: #0176D3;
  font-size: 16px;
}

.customer-tab-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 20px;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  color: #4A5568;
  transition: all 150ms ease;
}

.customer-tab-link:hover {
  background: #EDF2F7;
  color: #0176D3;
}

.customer-tab-link .ext-icon {
  color: #A0AEC0;
  margin-top: 2px;
}

.customer-tab-link:hover .ext-icon {
  color: #0176D3;
}

/* Middle success banner panel */
.customers-middle-panel {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  overflow: hidden;
  border-right: 1px solid #E2E8F0;
}

.customer-tab-icon {
  display: inline-block;
  font-size: 16px;
}

.customer-tab-name {
  display: flex;
  align-items: center;
}

/* Middle details override */
.customer-details-wrapper {
  padding: 28px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.customer-details-wrapper h3 {
  font-size: 18px;
  font-weight: 800;
  color: #032D60;
  margin: 0 0 4px 0;
}

.customer-details-desc {
  font-size: 13px;
  color: #4A5568;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.customer-tab-content-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.customer-tab-content-block h4 {
  font-size: 11px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}

.customer-stories-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.customer-stories-ul li {
  font-size: 13px;
  color: #2D3748;
  display: flex;
  align-items: center;
  gap: 6px;
}

.customer-stories-ul li::before {
  content: "•";
  color: #0176D3;
  font-weight: bold;
}

.story-company {
  font-weight: 700;
  color: #032D60;
}

.story-stat {
  color: #4A5568;
}

.enterprise-logos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.enterprise-logo-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 12px 6px;
  text-align: center;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #4A5568;
  box-shadow: 0 2px 5px rgba(0,0,0,0.01);
}

.testimonial-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.testimonial-quote {
  font-size: 13px;
  font-style: italic;
  color: #2D3748;
  line-height: 1.5;
  margin: 0;
}

.testimonial-author {
  font-size: 11px;
  color: #718096;
  font-weight: 700;
}

.testimonial-stars {
  color: #FBBF24;
  font-size: 14px;
  display: flex;
  gap: 2px;
}

.star-icon {
  margin: 0;
}

.customer-details-cta {
  font-size: 13.5px;
  font-weight: 700;
  color: #0176D3;
  text-decoration: none;
  margin-top: auto;
  padding-top: 12px;
  transition: color 150ms ease;
}

.customer-details-cta:hover {
  color: #032D60;
  text-decoration: underline;
}

/* Right Panel Overrides */
.customers-right-panel {
  padding: 28px;
  background: #F8FAFC;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.customers-right-header {
  display: flex;
  justify-content: flex-end;
}

.know-more-link {
  color: #0176D3 !important;
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
}

.featured-customer-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  margin-top: auto;
  margin-bottom: auto;
}

.featured-card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.featured-card-eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.featured-card-header h4 {
  font-size: 14.5px;
  font-weight: 800;
  color: #032D60;
  margin: 0;
  line-height: 1.35;
}

.featured-card-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #4A5568;
  font-weight: 600;
}

.check-bullet {
  color: #10B981;
  font-weight: bold;
}

.featured-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Bottom Metric Footer */
.customers-mega-footer {
  grid-column: span 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  padding: 16px 28px;
}

.footer-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
}

.metric-num {
  font-size: 16px;
  font-weight: 800;
  color: #032D60;
}

.metric-lbl {
  font-size: 10px;
  color: #718096;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 2px;
  letter-spacing: 0.05em;
}

.footer-metric-divider {
  width: 1px;
  height: 28px;
  background: #E2E8F0;
}

@keyframes megaFadeInCustomers {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Resources Mega Menu Specifics */
.resources-mega {
  width: 960px;
  left: -430px !important;
  transform: none !important;
  animation: megaFadeInResources 150ms ease-out both !important;
}

.resources-mega .mega-dropdown-arrow {
  left: 455px !important; /* Aligns directly with Resources link center */
  transform: rotate(45deg) !important;
}

.resources-card {
  padding: 0 !important;
  overflow: hidden;
}

.resources-mega-inner {
  display: grid;
  grid-template-columns: 1.65fr 1fr;
  height: 480px;
}

/* Left Panel - Grid of 10 links */
.resources-left-panel {
  padding: 28px;
  background: #FFFFFF;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resources-left-panel h3 {
  font-size: 16px;
  font-weight: 800;
  color: #032D60;
  margin: 0;
}

.resources-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
}

.resource-link-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-decoration: none;
  transition: all 150ms ease;
  padding: 8px;
  border-radius: 8px;
}

.resource-link-item:hover {
  background: #EFF6FF;
}

.resource-link-icon {
  font-size: 20px;
  margin-top: 2px;
  display: inline-block;
}

.resource-link-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.resource-link-text h5 {
  font-size: 13.5px;
  font-weight: 700;
  color: #032D60;
  margin: 0;
  transition: color 150ms ease;
}

.resource-link-text p {
  font-size: 11.5px;
  color: #718096;
  margin: 0;
  line-height: 1.45;
}

.resource-link-item:hover h5 {
  color: #0176D3;
}

/* Right Panel - Featured guide card */
.resources-right-panel {
  padding: 28px;
  background: #F8FAFC;
  border-left: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featured-guide-card {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.guide-eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  color: #0176D3;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.featured-guide-card h4 {
  font-size: 16px;
  font-weight: 800;
  color: #032D60;
  margin: 0;
  line-height: 1.35;
}

.guide-desc {
  font-size: 12.5px;
  color: #4A5568;
  line-height: 1.5;
  margin: 0;
}

.guide-highlights {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-hl-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #4A5568;
  font-weight: 600;
}

.guide-hl-icon {
  font-size: 14px;
}

.guide-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

@keyframes megaFadeInResources {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hide default scrollbars in all mega dropdown panels for a clean, natural look */
.mega-dropdown-inner,
.industries-sidebar,
.industries-middle-panel,
.industries-right-panel,
.customers-sidebar,
.customers-middle-panel,
.customers-right-panel,
.resources-left-panel,
.resources-right-panel,
.learning-sidebar,
.learning-middle-panel,
.learning-right-panel,
.support-sidebar,
.support-middle-panel,
.support-right-panel,
.company-sidebar,
.company-middle-panel,
.company-right-panel {
  -ms-overflow-style: none !important;  /* IE and Edge */
  scrollbar-width: none !important;  /* Firefox */
}

.mega-dropdown-inner::-webkit-scrollbar,
.industries-sidebar::-webkit-scrollbar,
.industries-middle-panel::-webkit-scrollbar,
.industries-right-panel::-webkit-scrollbar,
.customers-sidebar::-webkit-scrollbar,
.customers-middle-panel::-webkit-scrollbar,
.customers-right-panel::-webkit-scrollbar,
.resources-left-panel::-webkit-scrollbar,
.resources-right-panel::-webkit-scrollbar,
.learning-sidebar::-webkit-scrollbar,
.learning-middle-panel::-webkit-scrollbar,
.learning-right-panel::-webkit-scrollbar,
.support-sidebar::-webkit-scrollbar,
.support-middle-panel::-webkit-scrollbar,
.support-right-panel::-webkit-scrollbar,
.company-sidebar::-webkit-scrollbar,
.company-middle-panel::-webkit-scrollbar,
.company-right-panel::-webkit-scrollbar {
  display: none !important; /* Chrome, Safari and Opera */
}

/* Learning Mega Menu Specifics */
.learning-mega {
  width: 960px;
  left: -520px !important;
  transform: none !important;
  animation: megaFadeInLearning 150ms ease-out both !important;
}

.learning-mega .mega-dropdown-arrow {
  left: 545px !important; /* Aligns directly with Learning link center */
  transform: rotate(45deg) !important;
}

.learning-card {
  padding: 0 !important;
  overflow: hidden;
}

.learning-mega-inner {
  display: grid;
  grid-template-columns: 240px 1.1fr 1fr;
  height: 480px;
}

/* Left Sidebar tabs */
.learning-sidebar {
  background: #F8FAFC;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
}

.learning-tab-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #4A5568;
  transition: all 150ms ease;
  border-left: 3px solid transparent;
}

.learning-tab-btn:hover {
  background: #EDF2F7;
  color: #2563EB;
}

.learning-tab-btn.active {
  background: #EFF6FF;
  color: #2563EB;
  border-left-color: #2563EB;
  padding-left: 17px;
}

.learning-tab-icon {
  display: inline-block;
  font-size: 15px;
}

.learning-tab-name {
  display: flex;
  align-items: center;
}

.learning-tab-arrow {
  color: #A0AEC0;
  font-size: 16px;
}

.learning-tab-btn.active .learning-tab-arrow {
  color: #2563EB;
}

/* Middle Details Panel */
.learning-middle-panel {
  padding: 28px;
  border-right: 1px solid #E2E8F0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
}

.learning-details-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.learning-details-wrapper h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.learning-details-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
}

.learning-tab-content-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.learning-tab-content-block h4 {
  font-size: 11px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}

.learning-modules-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.learning-modules-ul li {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.module-bullet {
  color: #10B981;
  font-weight: bold;
}

.learning-details-cta {
  font-size: 13.5px;
  font-weight: 700;
  color: #2563EB;
  text-decoration: none;
  margin-top: auto;
  padding-top: 12px;
  transition: color 150ms ease;
}

.learning-details-cta:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* Right Featured Course Panel */
.learning-right-panel {
  padding: 28px;
  background: #F8FAFC;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.featured-course-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.course-eyebrow {
  font-size: 10px;
  text-transform: uppercase;
  color: #2563EB;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.featured-course-header h4 {
  font-size: 15.5px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  line-height: 1.35;
}

.course-desc {
  font-size: 12.5px;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
}

.course-card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #64748B;
  font-weight: 600;
}

.detail-bullet {
  font-size: 14px;
}

.course-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Bottom CTA Footer */
.learning-mega-footer {
  grid-column: span 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  padding: 16px 28px;
}

.footer-cta-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}

.footer-cta-text span {
  font-size: 13.5px;
  font-weight: 800;
  color: #0F172A;
}

.footer-cta-text p {
  font-size: 12px;
  color: #64748B;
  margin: 0;
}

.footer-cta-actions {
  display: flex;
  gap: 10px;
}

.cta-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
  transition: all 150ms ease;
  display: inline-block;
}

.cta-btn-primary {
  background: #2563EB;
  color: #FFFFFF !important;
}

.cta-btn-primary:hover {
  background: #1D4ED8;
}

.cta-btn-secondary {
  border: 1.5px solid #E2E8F0;
  color: #475569 !important;
  background: #FFFFFF;
}

.cta-btn-secondary:hover {
  background: #F1F5F9;
  border-color: #CBD5E1;
}

@keyframes megaFadeInLearning {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Support Mega Menu Specifics */
.support-mega {
  width: 960px;
  left: -630px !important;
  transform: none !important;
  animation: megaFadeInSupport 150ms ease-out both !important;
}

.support-mega .mega-dropdown-arrow {
  left: 655px !important; /* Aligns directly with Support link center */
  transform: rotate(45deg) !important;
}

.support-card {
  padding: 0 !important;
  overflow: hidden;
}

.support-mega-inner {
  display: grid;
  grid-template-columns: 240px 1.1fr 1fr;
  height: 480px;
}

/* Left Sidebar tabs */
.support-sidebar {
  background: #F8FAFC;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
}

.support-tab-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #4A5568;
  transition: all 150ms ease;
  border-left: 3px solid transparent;
}

.support-tab-btn:hover {
  background: #EDF2F7;
  color: #2563EB;
}

.support-tab-btn.active {
  background: #EFF6FF;
  color: #2563EB;
  border-left-color: #2563EB;
  padding-left: 17px;
}

.support-tab-icon {
  display: inline-block;
  font-size: 15px;
}

.support-tab-name {
  display: flex;
  align-items: center;
}

.support-tab-arrow {
  color: #A0AEC0;
  font-size: 16px;
}

.support-tab-btn.active .support-tab-arrow {
  color: #2563EB;
}

/* Middle Details Panel */
.support-middle-panel {
  padding: 28px;
  border-right: 1px solid #E2E8F0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
}

.support-details-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.support-details-wrapper h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.support-details-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
}

.support-tab-content-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.support-tab-content-block h4 {
  font-size: 11px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}

.support-topics-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.support-topics-ul li {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topic-bullet {
  color: #2563EB;
  font-weight: bold;
}

.support-details-cta {
  font-size: 13.5px;
  font-weight: 700;
  color: #2563EB;
  text-decoration: none;
  margin-top: auto;
  padding-top: 12px;
  transition: color 150ms ease;
}

.support-details-cta:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* Right Featured Support Panel */
.support-right-panel {
  padding: 28px;
  background: #F8FAFC;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.featured-support-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.featured-support-header h4 {
  font-size: 15.5px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  line-height: 1.35;
}

.support-desc {
  font-size: 12.5px;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
}

.support-card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.support-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Bottom Metrics Footer */
.support-mega-footer {
  grid-column: span 3;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  padding: 16px 28px;
}

@keyframes megaFadeInSupport {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Company Mega Menu Specifics */
.company-mega {
  width: 960px;
  left: -740px !important;
  transform: none !important;
  animation: megaFadeInCompany 150ms ease-out both !important;
}

.company-mega .mega-dropdown-arrow {
  left: 765px !important; /* Aligns directly with Company link center */
  transform: rotate(45deg) !important;
}

.company-card {
  padding: 0 !important;
  overflow: hidden;
}

.company-mega-inner {
  display: grid;
  grid-template-columns: 240px 1.1fr 1fr;
  height: 480px;
}

/* Left Sidebar tabs */
.company-sidebar {
  background: #F8FAFC;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px 0;
}

.company-tab-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #4A5568;
  transition: all 150ms ease;
  border-left: 3px solid transparent;
}

.company-tab-btn:hover {
  background: #EDF2F7;
  color: #2563EB;
}

.company-tab-btn.active {
  background: #EFF6FF;
  color: #2563EB;
  border-left-color: #2563EB;
  padding-left: 17px;
}

.company-tab-icon {
  display: inline-block;
  font-size: 15px;
}

.company-tab-name {
  display: flex;
  align-items: center;
}

.company-tab-arrow {
  color: #A0AEC0;
  font-size: 16px;
}

.company-tab-btn.active .company-tab-arrow {
  color: #2563EB;
}

/* Middle Details Panel */
.company-middle-panel {
  padding: 28px;
  border-right: 1px solid #E2E8F0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
}

.company-details-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.company-details-wrapper h3 {
  font-size: 18px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
}

.company-details-desc {
  font-size: 13px;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
}

.company-tab-content-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.company-tab-content-block h4 {
  font-size: 11px;
  text-transform: uppercase;
  color: #718096;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
}

.company-links-ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.company-links-ul li {
  font-size: 13px;
  color: #334155;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.link-bullet {
  color: #2563EB;
  font-weight: bold;
}

.company-details-cta {
  font-size: 13.5px;
  font-weight: 700;
  color: #2563EB;
  text-decoration: none;
  margin-top: auto;
  padding-top: 12px;
  transition: color 150ms ease;
}

.company-details-cta:hover {
  color: #1D4ED8;
  text-decoration: underline;
}

/* Right Featured Company Panel */
.company-right-panel {
  padding: 28px;
  background: #F8FAFC;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.featured-company-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.featured-company-header h4 {
  font-size: 15.5px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  line-height: 1.35;
}

.company-desc {
  font-size: 12.5px;
  color: #64748B;
  line-height: 1.5;
  margin: 0;
}

.company-card-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.company-card-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Bottom Metrics Footer */
.company-mega-footer {
  grid-column: span 3;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #F8FAFC;
  border-top: 1px solid #E2E8F0;
  padding: 16px 28px;
}

@keyframes megaFadeInCompany {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Salesforce-Inspired Dropdown Sidebar Styles */
.industry-btn,
.customer-tab-btn,
.learning-tab-btn,
.support-tab-btn,
.company-tab-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 12px 20px !important;
  border: none !important;
  background: transparent !important;
  width: 100% !important;
  cursor: pointer !important;
  text-align: left !important;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-left: 3px solid transparent !important;
  text-decoration: none !important;
}

.industry-btn:hover,
.customer-tab-btn:hover,
.learning-tab-btn:hover,
.support-tab-btn:hover,
.company-tab-btn:hover,
.industry-btn.active,
.customer-tab-btn.active,
.learning-tab-btn.active,
.support-tab-btn.active,
.company-tab-btn.active {
  background: #EFF6FF !important;
  color: #1E293B !important;
  transform: translateX(4px);
  border-left-color: #2563EB !important;
}

/* Icon Container */
.industry-btn-icon-wrap,
.customer-tab-icon-wrap,
.learning-tab-icon-wrap,
.support-tab-icon-wrap,
.company-tab-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #EFF6FF;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #2563EB;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: 12px;
  flex-shrink: 0;
}

.industry-btn:hover .industry-btn-icon-wrap,
.industry-btn.active .industry-btn-icon-wrap,
.customer-tab-btn:hover .customer-tab-icon-wrap,
.customer-tab-btn.active .customer-tab-icon-wrap,
.learning-tab-btn:hover .learning-tab-icon-wrap,
.learning-tab-btn.active .learning-tab-icon-wrap,
.support-tab-btn:hover .support-tab-icon-wrap,
.support-tab-btn.active .support-tab-icon-wrap,
.company-tab-btn:hover .company-tab-icon-wrap,
.company-tab-btn.active .company-tab-icon-wrap {
  background: #2563EB;
  color: #ffffff;
}

/* Label text */
.industry-btn-name,
.customer-tab-name-flat,
.learning-tab-name-flat,
.support-tab-name-flat,
.company-tab-name-flat {
  font-size: 13.5px;
  font-weight: 600;
  color: #4A5568;
  flex: 1;
  text-align: left;
}

.industry-btn:hover .industry-btn-name,
.industry-btn.active .industry-btn-name,
.customer-tab-btn:hover .customer-tab-name-flat,
.customer-tab-btn.active .customer-tab-name-flat,
.learning-tab-btn:hover .learning-tab-name-flat,
.learning-tab-btn.active .learning-tab-name-flat,
.support-tab-btn:hover .support-tab-name-flat,
.support-tab-btn.active .support-tab-name-flat,
.company-tab-btn:hover .company-tab-name-flat,
.company-tab-btn.active .company-tab-name-flat {
  color: #1E293B !important;
}

/* Chevron icons */
.industry-btn-chevron,
.customer-tab-chevron,
.learning-tab-chevron,
.support-tab-chevron,
.company-tab-chevron {
  font-size: 11px;
  color: #A0AEC0;
  transition: all 250ms ease;
}

.industry-btn:hover .industry-btn-chevron,
.industry-btn.active .industry-btn-chevron,
.customer-tab-btn:hover .customer-tab-chevron,
.customer-tab-btn.active .customer-tab-chevron,
.learning-tab-btn:hover .learning-tab-chevron,
.learning-tab-btn.active .learning-tab-chevron,
.support-tab-btn:hover .support-tab-chevron,
.support-tab-btn.active .support-tab-chevron,
.company-tab-btn:hover .company-tab-chevron,
.company-tab-btn.active .company-tab-chevron {
  color: #2563EB;
  transform: translateX(2px);
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

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = industriesData.find(i => i.id === activeIndustryId) || industriesData[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={`col1-${activeItem.id}`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={`col2-${activeItem.id}`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={`col3-${activeItem.id}`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
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

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = customersData.find(i => i.id === activeCustomerTab) || customersData[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={`col1-${activeItem.id}`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={`col2-${activeItem.id}`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={`col3-${activeItem.id}`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
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

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = learningData.find(i => i.id === activeLearningTab) || learningData[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={`col1-${activeItem.id}`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={`col2-${activeItem.id}`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={`col3-${activeItem.id}`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
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

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = supportData.find(i => i.id === activeSupportTab) || supportData[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={`col1-${activeItem.id}`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={`col2-${activeItem.id}`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={`col3-${activeItem.id}`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
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

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = companyData.find(i => i.id === activeCompanyTab) || companyData[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={`col1-${activeItem.id}`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={`col2-${activeItem.id}`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={`col3-${activeItem.id}`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
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

                    {/* 3-Column Content Layout */}
                    <div className="mega-content-grid">
                      {(() => {
                        const activeItem = crmData.find(i => i.id === activeCrmTab) || crmData[0];
                        return (
                          <>
                            {/* Column 1: Title, Desc, CTA */}
                            <div className="mega-col-1 animate-fade-in" key={`col1-${activeItem.id}`}>
                              <h3>{activeItem.title}</h3>
                              <p className="mega-desc">{activeItem.description}</p>
                              <a href={activeItem.linkUrl} className="mega-cta-link">
                                {activeItem.linkText}
                              </a>
                            </div>

                            {/* Column 2: Features/Topics */}
                            <div className="mega-col-2 animate-fade-in" key={`col2-${activeItem.id}`}>
                              <h4 className="mega-col-title">Key Topics</h4>
                              <ul className="mega-feature-list">
                                {activeItem.features.map((feat, index) => (
                                  <li key={index}><i className="bi bi-check2"></i> {feat}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Column 3: Highlights/Resources */}
                            <div className="mega-col-3 animate-fade-in" key={`col3-${activeItem.id}`}>
                              <h4 className="mega-col-title">{activeItem.rightPanelTitle}</h4>
                              <ul className="mega-resource-list">
                                {activeItem.rightPanelContent.map((item, idx) => (
                                  <li key={idx}>
                                    <span className="bullet-dot">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
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