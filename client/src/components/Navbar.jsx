import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Cloud, ExternalLink, Facebook, Globe, Linkedin, Twitter, User } from "lucide-react";

const industriesData = [
  {
    id: "automotive",
    name: "Automotive",
    icon: "🚗",
    bootstrapIcon: "bi-car-front-fill",
    description: "Manage dealership leads, customer inquiries, test drives, and after-sales service from one CRM.",
    solutions: ["Lead Management", "Test Drive Scheduling", "Service Reminders", "Customer History"],
    preview: {
      title: "Automotive Dashboard Preview",
      items: ["Dealership pipeline", "Test drive bookings", "Service scheduler", "Inventory tracking"],
      metrics: [
        { value: "+32%", label: "Lead Conversion" },
        { value: "8,400", label: "Test Drives Logged" },
        { value: "97%", label: "Satisfaction" }
      ]
    }
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    bootstrapIcon: "bi-heart-pulse-fill",
    description: "Improve patient engagement and streamline healthcare operations with intelligent CRM automation.",
    solutions: ["Patient Appointment Management", "Electronic Medical Records", "Automated Follow-ups", "Doctor Scheduling", "AI Insights"],
    preview: {
      title: "Healthcare Dashboard Preview",
      items: ["Doctor dashboard", "Patient analytics", "Appointment calendar", "KPI cards"],
      metrics: [
        { value: "+42%", label: "Engagement Growth" },
        { value: "12,400", label: "Patients Managed" },
        { value: "98%", label: "Patient Satisfaction" }
      ]
    }
  },
  {
    id: "retail",
    name: "Retail & eCommerce",
    icon: "🛍",
    bootstrapIcon: "bi-cart3",
    description: "Track customers, purchases, loyalty programs, and personalized marketing campaigns.",
    solutions: ["Customer Profiles", "Purchase History", "Loyalty Rewards", "Marketing Automation"],
    preview: {
      title: "Retail Dashboard Preview",
      items: ["Sales analytics", "Customer segmentation", "Revenue chart", "Product insights"],
      metrics: [
        { value: "+54%", label: "Repeat Purchases" },
        { value: "48,200", label: "Active Customers" },
        { value: "95%", label: "CSAT Score" }
      ]
    }
  },
  {
    id: "finance",
    name: "Financial Services",
    icon: "💰",
    bootstrapIcon: "bi-bank",
    description: "Manage client relationships securely while automating onboarding and compliance.",
    solutions: ["Client Management", "Loan Pipeline", "Compliance", "Investment Tracking"],
    preview: {
      title: "Financial Dashboard Preview",
      items: ["Client dashboard", "Loan pipeline", "Investment chart", "Compliance status"],
      metrics: [
        { value: "+28%", label: "AUM Growth" },
        { value: "3,150", label: "Clients Onboarded" },
        { value: "99.4%", label: "Compliance Rate" }
      ]
    }
  },
  {
    id: "realestate",
    name: "Real Estate",
    icon: "🏠",
    bootstrapIcon: "bi-buildings-fill",
    description: "Capture property inquiries and convert prospects into successful property sales.",
    solutions: ["Property Listings", "Buyer Tracking", "Site Visit Scheduling", "Deal Pipeline"],
    preview: {
      title: "Real Estate Dashboard Preview",
      items: ["Property CRM", "Buyer pipeline", "Lead funnel", "Deal stages"],
      metrics: [
        { value: "+39%", label: "Deal Velocity" },
        { value: "1,850", label: "Properties Listed" },
        { value: "96%", label: "Agent Productivity" }
      ]
    }
  },
  {
    id: "education",
    name: "Education",
    icon: "🎓",
    bootstrapIcon: "bi-mortarboard-fill",
    description: "Manage student admissions, inquiries, alumni engagement, and communication.",
    solutions: ["Student CRM", "Admission Pipeline", "Communication", "Reports"],
    preview: {
      title: "Education CRM Preview",
      items: ["Student enrollment stats", "Application funnel", "Alumni engagement score", "Course analytics"],
      metrics: [
        { value: "+45%", label: "Enrollment Rate" },
        { value: "15,600", label: "Students Managed" },
        { value: "98.2%", label: "Retention Rate" }
      ]
    }
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "🏭",
    bootstrapIcon: "bi-gear-fill",
    description: "Track distributors, suppliers, quotations, and customer orders efficiently.",
    solutions: ["Distributor CRM", "Inventory Requests", "Sales Orders", "Service Requests"],
    preview: {
      title: "Manufacturing Portal Preview",
      items: ["Supply chain pipeline", "Order tracking", "Distributor metrics", "Quote funnel"],
      metrics: [
        { value: "+26%", label: "Order Accuracy" },
        { value: "180+", label: "Distributors Managed" },
        { value: "94.8%", label: "On-time Delivery" }
      ]
    }
  },
  {
    id: "saas",
    name: "SaaS & Technology",
    icon: "💻",
    bootstrapIcon: "bi-cpu-fill",
    description: "Manage trial users, subscriptions, onboarding, and customer success.",
    solutions: ["Trial Management", "Customer Success", "Subscription Tracking", "Support Tickets"],
    preview: {
      title: "SaaS Console Preview",
      items: ["Subscription MRR chart", "Churn stats", "Trial conversion funnel", "Support volume"],
      metrics: [
        { value: "+62%", label: "MRR Growth" },
        { value: "98.5%", label: "NPS Score" },
        { value: "3.2%", label: "Net Churn Rate" }
      ]
    }
  },
  {
    id: "telecom",
    name: "Telecommunications",
    icon: "📞",
    bootstrapIcon: "bi-broadcast-pin",
    description: "Manage subscribers, support tickets, and customer lifecycle with AI automation.",
    solutions: ["Customer Accounts", "Service Requests", "Billing Support", "Renewals"],
    preview: {
      title: "Telecom Analytics Preview",
      items: ["Billing alerts", "Subscriber lifecycle", "Customer support ticket stats", "Plan renewal forecast"],
      metrics: [
        { value: "-18%", label: "Churn Reduction" },
        { value: "320,000", label: "Subscribers" },
        { value: "92%", label: "First-contact Resolution" }
      ]
    }
  },
  {
    id: "travel",
    name: "Travel & Hospitality",
    icon: "🌍",
    bootstrapIcon: "bi-airplane-fill",
    description: "Deliver personalized booking experiences and manage guest relationships.",
    solutions: ["Booking CRM", "Guest Profiles", "Promotions", "Loyalty Programs"],
    preview: {
      title: "Hospitality Dashboard Preview",
      items: ["Booking analytics", "Guest loyalty segmentation", "Campaign ROI", "Room availability chart"],
      metrics: [
        { value: "+34%", label: "Direct Bookings" },
        { value: "14,800", label: "Loyalty Members" },
        { value: "97.5%", label: "Guest Rating" }
      ]
    }
  }
];

const customersData = [
  {
    id: "stories",
    name: "Customer Success Stories",
    icon: "📈",
    bootstrapIcon: "bi-bar-chart-line-fill",
    title: "Customer Success Stories",
    description: "Discover how businesses use CRM Platform to automate sales, improve customer relationships, and accelerate revenue growth.",
    content: {
      type: "list",
      header: "Featured Stories",
      items: [
        { label: "TechNova Solutions", highlight: "Increased sales by 42%" },
        { label: "RetailHub", highlight: "Reduced response time by 60%" },
        { label: "HealthCare Plus", highlight: "Managed 50,000+ patient interactions" },
        { label: "FinTrust Bank", highlight: "Improved customer retention by 35%" }
      ],
      linkText: "Explore All Success Stories →",
      linkUrl: "#stories"
    }
  },
  {
    id: "enterprise",
    name: "Enterprise Customers",
    icon: "🏢",
    bootstrapIcon: "bi-building-fill",
    title: "Enterprise Customers",
    description: "Trusted by growing enterprises to manage millions of customer interactions every month.",
    content: {
      type: "grid",
      header: "Featured Companies",
      items: ["TechNova", "RetailHub", "FinTrust", "Global Logistics", "EduSmart", "HealthCare Plus"],
      linkText: "View Enterprise Solutions →",
      linkUrl: "#enterprise"
    }
  },
  {
    id: "testimonials",
    name: "Testimonials",
    icon: "⭐",
    bootstrapIcon: "bi-star-fill",
    title: "Customer Testimonials",
    description: "See what our users say about their experience with CRM Platform.",
    content: {
      type: "testimonial",
      quote: "“CRM Platform transformed our sales workflow and increased our conversion rate by 45%.”",
      author: "Sarah Johnson, Sales Director",
      stars: 5,
      linkText: "More Testimonials →",
      linkUrl: "#testimonials"
    }
  },
  {
    id: "case-studies",
    name: "Industry Case Studies",
    icon: "📚",
    bootstrapIcon: "bi-journal-text",
    title: "Industry Case Studies",
    description: "Deep dives into how specific sectors implement CRM solutions for maximum business impact.",
    content: {
      type: "list",
      header: "Case Studies by Industry",
      items: [
        { label: "Retail CRM Success Guide" },
        { label: "Healthcare CRM Implementation" },
        { label: "Financial Services Trust Metrics" },
        { label: "Manufacturing & Supply Integration" },
        { label: "Real Estate Property Funnels" }
      ],
      linkText: "Read Case Studies →",
      linkUrl: "#case-studies"
    }
  },
  {
    id: "videos",
    name: "Video Reviews",
    icon: "🎥",
    bootstrapIcon: "bi-play-btn-fill",
    title: "Customer Video Reviews",
    description: "Watch our customers share how they scaled operations and automated workflows with CRM Platform.",
    content: {
      type: "list",
      header: "Video Library Highlights",
      items: [
        { label: "TechNova Interview", highlight: "5 mins video" },
        { label: "RetailHub Journey", highlight: "3 mins video" },
        { label: "FinTrust Deployment", highlight: "8 mins video" }
      ],
      linkText: "Watch Video Library →",
      linkUrl: "#videos"
    }
  },
  {
    id: "partners",
    name: "Partner Success",
    icon: "🤝",
    bootstrapIcon: "bi-handshake",
    title: "Partner Success",
    description: "Learn how our consulting and technology partners help customers deploy and succeed.",
    content: {
      type: "list",
      header: "Partner Ecosystem",
      items: [
        { label: "Consulting Partners & integrators" },
        { label: "App Exchange Developers" },
        { label: "Managed Service Providers" }
      ],
      linkText: "Explore Partner Directory →",
      linkUrl: "#partners"
    }
  }
];

const learningData = [
  {
    id: "basics",
    name: "CRM Basics",
    icon: "📚",
    bootstrapIcon: "bi-book-fill",
    title: "CRM Fundamentals",
    description: "Learn the core concepts of Customer Relationship Management and how it helps align teams and build relationships.",
    modules: ["What is a CRM system?", "Key components of CRM", "Benefits of centralizing customer data", "Getting started checklist"]
  },
  {
    id: "academy",
    name: "AI CRM Academy",
    icon: "🤖",
    bootstrapIcon: "bi-cpu-fill",
    title: "AI Workflow Automation",
    description: "Master artificial intelligence in CRM, from automated replies to smart pipeline insights and predictions.",
    modules: ["AI-powered lead scoring", "Predictive sales forecasts", "Automating repetitive follow-ups", "AI chatbot configuration"]
  },
  {
    id: "videos",
    name: "Video Tutorials",
    icon: "🎥",
    bootstrapIcon: "bi-play-circle-fill",
    title: "Interactive Video Library",
    description: "Step-by-step visual guides showing how to configure your sales pipeline and build custom automation workflows.",
    modules: ["Vite deployment walkthrough (3 mins)", "Pipeline stage configuration (5 mins)", "Integrating email systems (4 mins)", "Running reports & dashboards (6 mins)"]
  },
  {
    id: "blog",
    name: "Blog & Articles",
    icon: "📝",
    bootstrapIcon: "bi-pencil-square",
    title: "Sales Insights & Trends",
    description: "Read the latest research, articles, and thought leadership pieces from CRM experts and industry leaders.",
    modules: ["Sales forecasting best practices", "Reducing customer churn rates", "How AI is changing B2B sales", "Startups growth hacks"]
  },
  {
    id: "docs",
    name: "Documentation",
    icon: "📖",
    bootstrapIcon: "bi-file-earmark-text-fill",
    title: "Technical Documentation",
    description: "Detailed setup guides, server installation parameters, security protocols, and advanced admin settings.",
    modules: ["Installation guidelines", "Database synchronization", "User role permissions", "Security & data privacy protocols"]
  },
  {
    id: "practices",
    name: "Best Practices",
    icon: "💡",
    bootstrapIcon: "bi-lightbulb-fill",
    title: "CRM Best Practices",
    description: "Proven tips and strategies to increase CRM adoption rates, clean customer data, and boost sales efficiency.",
    modules: ["CRM data cleanup checklists", "Increasing rep adoption rates", "Designing clear deal pipelines", "Optimizing contact profiles"]
  },
  {
    id: "guides",
    name: "Product Guides",
    icon: "🚀",
    bootstrapIcon: "bi-rocket-takeoff-fill",
    title: "Interactive Product Guides",
    description: "Deep dives into specific features of CRM Platform, including contact management, email tracking, and AI insights.",
    modules: ["Lead management workbook", "Email tracking setups", "AI Sales Assistant configuration", "Custom dashboard guides"]
  },
  {
    id: "certification",
    name: "CRM Certification",
    icon: "🏅",
    bootstrapIcon: "bi-award-fill",
    title: "Professional Certifications",
    description: "Validate your skills and earn badges by completing CRM Platform training modules and passing certification exams.",
    modules: ["Sales Professional Exam", "Administrator Certification", "Automation Specialist Exam", "Developer Certification"]
  },
  {
    id: "api",
    name: "Developer API Guides",
    icon: "👨💻",
    bootstrapIcon: "bi-terminal-fill",
    title: "REST APIs & Developer Tools",
    description: "Connect external software, synchronize databases, and build custom applications on top of CRM Platform API.",
    modules: ["API Authentication setup", "Webhook listener endpoints", "Syncing contact databases", "Rate limiting policies"]
  },
  {
    id: "community",
    name: "Community Forum",
    icon: "💬",
    bootstrapIcon: "bi-chat-left-text-fill",
    title: "Join the CRM Forum",
    description: "Connect with thousands of users, developers, and administrators to share ideas, ask questions, and collaborate.",
    modules: ["Developer discussion groups", "Sales rep community chats", "Feature request portal", "Local user groups"]
  }
];

const supportData = [
  {
    id: "help",
    name: "Help Center",
    icon: "🆘",
    bootstrapIcon: "bi-question-circle-fill",
    title: "Browse Knowledge Base",
    description: "Search thousands of helpful guides, tips, and step-by-step documentation articles for CRM Platform.",
    topics: ["Setting Up Your CRM", "Importing Customer Data", "Managing Sales Pipelines", "AI Automation Setup"]
  },
  {
    id: "docs",
    name: "Documentation",
    icon: "📖",
    bootstrapIcon: "bi-file-earmark-text-fill",
    title: "Technical Documentation",
    description: "Read detailed integration references, configuration settings, user roles, and security policies.",
    topics: ["User Roles & Permissions", "API Integration Guide", "Database synchronization", "Security & data privacy"]
  },
  {
    id: "chat",
    name: "Live Chat Support",
    icon: "💬",
    bootstrapIcon: "bi-chat-dots-fill",
    title: "Chat with an Agent 24/7",
    description: "Start a real-time conversation with our support specialists. Average response time is under 15 minutes.",
    topics: ["Real-time troubleshooting", "Billing & plan questions", "Feature walkthrough requests", "API debugging support"]
  },
  {
    id: "ticket",
    name: "Submit a Support Ticket",
    icon: "🎫",
    bootstrapIcon: "bi-ticket-detailed-fill",
    title: "Create Support Case",
    description: "Open a support ticket with our engineering team for complex queries or technical issues.",
    topics: ["Track existing tickets", "Urgent bug reports", "Feature request submissions", "Account access recovery"]
  },
  {
    id: "tutorials",
    name: "Video Tutorials",
    icon: "📺",
    bootstrapIcon: "bi-tv-fill",
    title: "Video Learning Library",
    description: "Watch short screencasts and interactive video guides demonstrating how to configure automation workflows.",
    topics: ["Workflow automation setup", "Custom deal stages guide", "Configuring lead ingestion", "Email client integration"]
  },
  {
    id: "trouble",
    name: "Troubleshooting Guides",
    icon: "🔧",
    bootstrapIcon: "bi-tools",
    title: "Self-Service Troubleshooting",
    description: "Find instant solutions for common configuration challenges, syncing issues, or permission mismatches.",
    topics: ["SMTP email sync problems", "CSV import error codes", "API rate limiting fixes", "UI dashboard loading lags"]
  },
  {
    id: "status",
    name: "System Status",
    icon: "⚙️",
    bootstrapIcon: "bi-activity",
    title: "All Systems Operational",
    description: "Check the current operational status of the CRM platform, cloud databases, and API integrations.",
    topics: ["Platform uptime history", "Scheduled maintenance alerts", "API performance metrics", "Database response speeds"]
  },
  {
    id: "contact",
    name: "Contact Support",
    icon: "📞",
    bootstrapIcon: "bi-telephone-fill",
    title: "Get in Touch Directly",
    description: "Contact our dedicated support helpdesk by phone or direct email address for immediate assistance.",
    topics: ["Toll-free hotline numbers", "Direct email support links", "Enterprise support manager contacts", "Local office addresses"]
  },
  {
    id: "dev",
    name: "Developer Support",
    icon: "👨💻",
    bootstrapIcon: "bi-terminal-fill",
    title: "Developer Help Center",
    description: "Developer resources, SDK documentation, code samples, webhook setups, and API keys help.",
    topics: ["REST API endpoint specs", "Webhook debugger tools", "Client SDK libraries", "Sandbox environment setups"]
  },
  {
    id: "enterprise",
    name: "Enterprise Support",
    icon: "🏢",
    bootstrapIcon: "bi-building-fill",
    title: "Priority Enterprise Desk",
    description: "Exclusive priority support channels for our Enterprise customers including dedicated customer managers.",
    topics: ["Dedicated account managers", "SLA policy definitions", "Custom onboarding services", "On-premise deployment help"]
  }
];

const companyData = [
  {
    id: "about",
    name: "About CRM Platform",
    icon: "🏢",
    bootstrapIcon: "bi-info-square-fill",
    title: "About Our Company",
    description: "CRM Platform helps businesses automate sales, strengthen customer relationships, and accelerate growth through intelligent CRM technology. Trusted by thousands of growing companies worldwide.",
    links: ["Meet Our Team", "Explore Careers", "Read Company Blog", "Partner With Us"]
  },
  {
    id: "mission",
    name: "Our Mission & Vision",
    icon: "🌟",
    bootstrapIcon: "bi-bullseye",
    title: "Our Mission & Vision",
    description: "To connect businesses with their customers in a whole new way using artificial intelligence, making customer relationships more human and automated at the same time.",
    links: ["Read our story", "AI Ethics statement", "Product roadmap", "Executive letters"]
  },
  {
    id: "values",
    name: "Our Values",
    icon: "💙",
    bootstrapIcon: "bi-heart-fill",
    title: "Trust, Innovation & Success",
    description: "We are guided by four core values: Trust, Customer Success, Continuous Innovation, and Equality for all stakeholders.",
    links: ["Our values booklet", "Customer success stories", "Diversity & inclusion", "Community outreach"]
  },
  {
    id: "team",
    name: "Leadership Team",
    icon: "👥",
    bootstrapIcon: "bi-people-fill",
    title: "Our Executive Leadership",
    description: "Meet the visionary leaders and experts guiding CRM Platform's strategy and technological innovation.",
    links: ["Board of Directors", "Advisory council", "Our founders", "Executive bios"]
  },
  {
    id: "careers",
    name: "Careers",
    icon: "💼",
    bootstrapIcon: "bi-briefcase-fill",
    title: "Join Our Global Team",
    description: "Build the future of CRM with us. We are always looking for passionate engineers, designers, sales reps, and customer success heroes.",
    links: ["Open positions", "Life at CRM Platform", "Benefits & perks", "Internship programs"]
  },
  {
    id: "news",
    name: "News & Press",
    icon: "📰",
    bootstrapIcon: "bi-newspaper",
    title: "Press Releases & News room",
    description: "Stay up to date with CRM Platform product launches, corporate announcements, feature reports, and press coverage.",
    links: ["Press kit downloads", "Media contacts", "News archive", "Award certifications"]
  },
  {
    id: "partners",
    name: "Partners & Affiliates",
    icon: "🤝",
    bootstrapIcon: "bi-handshake",
    title: "Partner Ecosystem",
    description: "Collaborate, integrate, and grow with CRM Platform. Join our global affiliate network or consulting integrations desk.",
    links: ["Consulting integrations", "Developer portal", "Affiliate sign up", "Directory listings"]
  },
  {
    id: "sustain",
    name: "Sustainability & Impact",
    icon: "🌍",
    bootstrapIcon: "bi-globe",
    title: "Sustainability & Social Impact",
    description: "We are committed to building a sustainable future. We donate 1% of equity, product, and employee time to non-profits.",
    links: ["Net-zero carbon pledge", "Community donations", "Volunteer highlights", "Annual impact report"]
  },
  {
    id: "legal",
    name: "Legal & Compliance",
    icon: "⚖️",
    bootstrapIcon: "bi-shield-check",
    title: "Trust & Security Center",
    description: "Review our service terms, privacy policies, GDPR compliance declarations, and security certifications.",
    links: ["GDPR & CCPA policies", "Terms of service", "Data processing agreement", "Security compliance"]
  },
  {
    id: "contact",
    name: "Contact Us",
    icon: "📞",
    bootstrapIcon: "bi-envelope-fill",
    title: "Get In Touch",
    description: "Reach out to our offices, sales departments, or media relations division for custom inquiries and assistance.",
    links: ["Sales inquiries", "Media relations", "Global office locations", "Support hotline"]
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
  padding: 0 32px;
  background: #F8FAFC;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.mega-tab-btn {
  background: transparent;
  border: none;
  padding: 16px 24px;
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

/* 3-Column Content Layout */
.mega-content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  padding: 32px;
  gap: 48px;
}

/* Column 1: Description & CTA */
.mega-col-1 h3 {
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

/* Column 2 & 3 Titles */
.mega-col-title {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748B;
  margin-bottom: 20px;
  font-weight: 700;
}

/* Features List (Checkmarks) */
.mega-feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mega-feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  color: #334155;
  font-weight: 500;
}

.mega-feature-list i {
  color: #0056D2;
  font-size: 18px;
  margin-top: -2px;
}

/* Resource List (Bullets) */
.mega-resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mega-resource-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  color: #334155;
  font-weight: 500;
}

.bullet-dot {
  color: #94A3B8;
  font-size: 16px;
  line-height: 1;
}

/* Shared Megamenu Positioning */
.industries-mega,
.customers-mega,
.learning-mega,
.support-mega,
.company-mega,
.what-is-crm-mega {
  width: 900px;
}

/* Adjust absolute positioning to center roughly */
.industries-mega { left: -150px !important; }
.customers-mega { left: -250px !important; }
.learning-mega { left: -350px !important; }
.support-mega { left: -450px !important; }
.company-mega { left: -550px !important; }
.what-is-crm-mega { left: -100px !important; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .mega-content-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .mega-col-3 {
    grid-column: span 2;
    margin-top: 16px;
    border-top: 1px solid #E2E8F0;
    padding-top: 24px;
  }
}
@media (max-width: 768px) {
  .mega-top-tabs {
    flex-wrap: wrap;
  }
  .mega-tab-btn {
    flex: 1 1 50%;
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
