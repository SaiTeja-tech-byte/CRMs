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
                    <div className="industries-mega-inner">
                      
                      {/* Left Sidebar */}
                      <div className="industries-sidebar">
                        {industriesData.map((ind) => (
                          <button
                            key={ind.id}
                            className={`industry-btn ${activeIndustryId === ind.id ? "active" : ""}`}
                            onMouseEnter={() => setActiveIndustryId(ind.id)}
                          >
                            <span className="industry-btn-icon-wrap">
                              <i className={`bi ${ind.bootstrapIcon}`}></i>
                            </span>
                            <span className="industry-btn-name">{ind.name}</span>
                            <i className="bi bi-chevron-right industry-btn-chevron"></i>
                          </button>
                        ))}
                      </div>

                      {/* Middle Details Panel */}
                      <div className="industries-middle-panel">
                        {(() => {
                          const activeInd = industriesData.find(i => i.id === activeIndustryId) || industriesData[0];
                          return (
                            <div className="industry-details animate-fade-in" key={activeInd.id}>
                              <h3>{activeInd.name} Solutions</h3>
                              <p className="industry-desc">{activeInd.description}</p>
                              
                              <div className="industry-solutions-list">
                                <h4>Key Capabilities</h4>
                                <ul>
                                  {activeInd.solutions.map((sol, index) => (
                                    <li key={index}>{sol}</li>
                                  ))}
                                </ul>
                              </div>

                              <a href={`#industry-${activeInd.id}`} className="industry-cta-link">
                                Explore {activeInd.name} CRM →
                              </a>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Right Preview Panel */}
                      <div className="industries-right-panel">
                        {(() => {
                          const activeInd = industriesData.find(i => i.id === activeIndustryId) || industriesData[0];
                          return (
                            <div className="industry-preview animate-fade-in" key={activeInd.id}>
                              <div className="preview-visualization">
                                <div className="visualization-header">
                                  <span className="viz-dot"></span>
                                  <span className="viz-dot"></span>
                                  <span className="viz-dot"></span>
                                  <span className="viz-title">{activeInd.name} Overview</span>
                                </div>
                                <div className="visualization-body">
                                  {activeInd.preview.items.map((item, idx) => (
                                    <div key={idx} className="viz-item">
                                      <span className="viz-checkbox">✓</span>
                                      <span>{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Metrics */}
                              <div className="preview-metrics">
                                {activeInd.preview.metrics.map((m, idx) => (
                                  <div key={idx} className="metric-box">
                                    <span className="metric-value">{m.value}</span>
                                    <span className="metric-label">{m.label}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="preview-actions">
                                <a href="#contact" className="preview-btn-primary">Explore Solutions</a>
                                <a href="#contact" className="preview-btn-secondary">Book Demo</a>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

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
                    <div className="customers-mega-inner">
                      
                      {/* Left Sidebar */}
                      <div className="customers-sidebar">
                        {customersData.map((tab) => (
                          <button
                            key={tab.id}
                            className={`customer-tab-btn ${activeCustomerTab === tab.id ? "active" : ""}`}
                            onMouseEnter={() => setActiveCustomerTab(tab.id)}
                          >
                            <span className="customer-tab-icon-wrap">
                              <i className={`bi ${tab.bootstrapIcon}`}></i>
                            </span>
                            <span className="customer-tab-name-flat">{tab.name}</span>
                            <i className="bi bi-chevron-right customer-tab-chevron"></i>
                          </button>
                        ))}
                      </div>

                      {/* Middle Panel */}
                      <div className="customers-middle-panel">
                        {(() => {
                          const activeTab = customersData.find(t => t.id === activeCustomerTab) || customersData[0];
                          return (
                            <div className="customer-details-wrapper animate-fade-in" key={activeTab.id}>
                              <h3>{activeTab.title}</h3>
                              <p className="customer-details-desc">{activeTab.description}</p>
                              
                              <div className="customer-tab-content-block">
                                {activeTab.content.type === "list" && (
                                  <>
                                    <h4>{activeTab.content.header}</h4>
                                    <ul className="customer-stories-ul">
                                      {activeTab.content.items.map((item, idx) => (
                                        <li key={idx}>
                                          <span className="story-company">{item.label}</span>
                                          {item.highlight && <span className="story-stat"> – {item.highlight}</span>}
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}

                                {activeTab.content.type === "grid" && (
                                  <>
                                    <h4>{activeTab.content.header}</h4>
                                    <div className="enterprise-logos-grid">
                                      {activeTab.content.items.map((company, idx) => (
                                        <div key={idx} className="enterprise-logo-box">
                                          <span>{company}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </>
                                )}

                                {activeTab.content.type === "testimonial" && (
                                  <div className="testimonial-card">
                                    <p className="testimonial-quote">{activeTab.content.quote}</p>
                                    <span className="testimonial-author">{activeTab.content.author}</span>
                                    <div className="testimonial-stars">
                                      {Array.from({ length: activeTab.content.stars }).map((_, i) => (
                                        <span key={i} className="star-icon">★</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <a href={activeTab.content.linkUrl} className="customer-details-cta">
                                {activeTab.content.linkText}
                              </a>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Right Panel */}
                      <div className="customers-right-panel">
                        <div className="customers-right-header">
                          <span className="know-more-link" style={{ textDecoration: "none" }}>Featured Story</span>
                        </div>

                        <div className="featured-customer-card">
                          <div className="featured-card-header">
                            <span className="featured-card-eyebrow">TechNova Solutions</span>
                            <h4>AI-powered Sales Transformation</h4>
                          </div>
                          
                          <div className="featured-card-checklist">
                            <div className="check-item">
                              <span className="check-bullet">✔</span>
                              <span>42% Increase in Sales</span>
                            </div>
                            <div className="check-item">
                              <span className="check-bullet">✔</span>
                              <span>60% Faster Lead Response</span>
                            </div>
                            <div className="check-item">
                              <span className="check-bullet">✔</span>
                              <span>98% Customer Satisfaction</span>
                            </div>
                          </div>

                          <div className="featured-card-actions">
                            <a href="#case-study" className="preview-btn-primary">Read Case Study</a>
                            <a href="#video-story" className="preview-btn-secondary">Watch Customer Story</a>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Statistics Bar */}
                    <div className="customers-mega-footer">
                      <div className="footer-metric">
                        <span className="metric-num">10,000+</span>
                        <span className="metric-lbl">Businesses</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">1M+</span>
                        <span className="metric-lbl">Customers Managed</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">99.99%</span>
                        <span className="metric-lbl">Platform Uptime</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">4.9/5</span>
                        <span className="metric-lbl">Customer Rating</span>
                      </div>
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
                    <div className="learning-mega-inner">
                      
                      {/* Left Sidebar */}
                      <div className="learning-sidebar">
                        {learningData.map((tab) => (
                          <button
                            key={tab.id}
                            className={`learning-tab-btn ${activeLearningTab === tab.id ? "active" : ""}`}
                            onMouseEnter={() => setActiveLearningTab(tab.id)}
                          >
                            <span className="learning-tab-icon-wrap">
                              <i className={`bi ${tab.bootstrapIcon}`}></i>
                            </span>
                            <span className="learning-tab-name-flat">{tab.name}</span>
                            <i className="bi bi-chevron-right learning-tab-chevron"></i>
                          </button>
                        ))}
                      </div>

                      <div className="learning-middle-panel">
                        {(() => {
                          const activeTab = learningData.find(t => t.id === activeLearningTab) || learningData[0];
                          return (
                            <div className="learning-details-wrapper animate-fade-in" key={activeTab.id}>
                              <h3>{activeTab.title}</h3>
                              <p className="learning-details-desc">{activeTab.description}</p>
                              
                              <div className="learning-tab-content-block">
                                <h4>Course Modules</h4>
                                <ul className="learning-modules-ul">
                                  {activeTab.modules.map((mod, idx) => (
                                    <li key={idx}>
                                      <span className="module-bullet">✔</span>
                                      <span className="module-text">{mod}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <a href={`#learning-${activeTab.id}`} className="learning-details-cta">
                                Start Learning Course →
                              </a>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="learning-right-panel">
                        <div className="featured-course-header">
                          <span className="course-eyebrow">Featured Course</span>
                          <h4>Master AI-Powered CRM in 30 Minutes</h4>
                          <p className="course-desc">Learn how to automate lead management, improve customer engagement, create intelligent workflows, and increase sales using AI-powered CRM.</p>
                        </div>
                        
                        <div className="course-card-details">
                          <div className="detail-row">
                            <span className="detail-bullet">📖</span>
                            <span>Beginner Friendly</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">⏱</span>
                            <span>30 Minutes</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">🎥</span>
                            <span>12 Video Lessons</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">🏆</span>
                            <span>Certificate of Completion</span>
                          </div>
                        </div>

                        <div className="course-card-actions">
                          <a href="#start-learning" className="preview-btn-primary">Start Learning →</a>
                          <a href="#all-courses" className="preview-btn-secondary">Browse All Courses</a>
                        </div>
                      </div>

                    </div>

                    {/* Bottom CTA Bar */}
                    <div className="learning-mega-footer">
                      <div className="footer-cta-text">
                        <span>Need help getting started?</span>
                        <p>Our CRM experts are ready to guide you.</p>
                      </div>
                      <div className="footer-cta-actions">
                        <a href="#contact" className="cta-btn cta-btn-primary">Contact an Expert</a>
                        <a href="#live-training" className="cta-btn cta-btn-secondary">Schedule Live Training</a>
                      </div>
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
                    <div className="support-mega-inner">
                      
                      {/* Left Sidebar */}
                      <div className="support-sidebar">
                        {supportData.map((tab) => (
                          <button
                            key={tab.id}
                            className={`support-tab-btn ${activeSupportTab === tab.id ? "active" : ""}`}
                            onMouseEnter={() => setActiveSupportTab(tab.id)}
                          >
                            <span className="support-tab-icon-wrap">
                              <i className={`bi ${tab.bootstrapIcon}`}></i>
                            </span>
                            <span className="support-tab-name-flat">{tab.name}</span>
                            <i className="bi bi-chevron-right support-tab-chevron"></i>
                          </button>
                        ))}
                      </div>

                      <div className="support-middle-panel">
                        {(() => {
                          const activeTab = supportData.find(t => t.id === activeSupportTab) || supportData[0];
                          return (
                            <div className="support-details-wrapper animate-fade-in" key={activeTab.id}>
                              <h3>{activeTab.title}</h3>
                              <p className="support-details-desc">{activeTab.description}</p>
                              
                              <div className="support-tab-content-block">
                                <h4>Popular Help Topics</h4>
                                <ul className="support-topics-ul">
                                  {activeTab.topics.map((topic, idx) => (
                                    <li key={idx}>
                                      <span className="topic-bullet">✔</span>
                                      <span className="topic-text">{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <a href={`#support-${activeTab.id}`} className="support-details-cta">
                                Launch Support Service →
                              </a>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="support-right-panel">
                        <div className="featured-support-header">
                          <span className="support-eyebrow">Featured Help</span>
                          <h4>Need Help? We're Here 24/7</h4>
                          <p className="support-desc">Get expert assistance whenever you need it. Browse documentation, chat with our support team, track service status, or submit a ticket—all in one place.</p>
                        </div>
                        
                        <div className="support-card-details">
                          <div className="detail-row">
                            <span className="detail-bullet">💬</span>
                            <span>Live Chat Available 24/7</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">📖</span>
                            <span>500+ Help Articles</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">⚡</span>
                            <span>Average Response Time: 15 Mins</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">⭐</span>
                            <span>98% Customer Satisfaction</span>
                          </div>
                        </div>

                        <div className="support-card-actions">
                          <a href="#live-chat" className="preview-btn-primary">Start Live Chat</a>
                          <a href="#help-center" className="preview-btn-secondary">Browse Help Center</a>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Statistics KPI Bar */}
                    <div className="support-mega-footer">
                      <div className="footer-metric">
                        <span className="metric-num">24/7</span>
                        <span className="metric-lbl">Customer Support</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">15 min</span>
                        <span className="metric-lbl">Response Time</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">500+</span>
                        <span className="metric-lbl">Knowledge Articles</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">98%</span>
                        <span className="metric-lbl">Satisfaction Rate</span>
                      </div>
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
                    <div className="company-mega-inner">
                      
                      {/* Left Sidebar */}
                      <div className="company-sidebar">
                        {companyData.map((tab) => (
                          <button
                            key={tab.id}
                            className={`company-tab-btn ${activeCompanyTab === tab.id ? "active" : ""}`}
                            onMouseEnter={() => setActiveCompanyTab(tab.id)}
                          >
                            <span className="company-tab-icon-wrap">
                              <i className={`bi ${tab.bootstrapIcon}`}></i>
                            </span>
                            <span className="company-tab-name-flat">{tab.name}</span>
                            <i className="bi bi-chevron-right company-tab-chevron"></i>
                          </button>
                        ))}
                      </div>

                      <div className="company-middle-panel">
                        {(() => {
                          const activeTab = companyData.find(t => t.id === activeCompanyTab) || companyData[0];
                          return (
                            <div className="company-details-wrapper animate-fade-in" key={activeTab.id}>
                              <h3>{activeTab.title}</h3>
                              <p className="company-details-desc">{activeTab.description}</p>
                              
                              <div className="company-tab-content-block">
                                <h4>Quick Links</h4>
                                <ul className="company-links-ul">
                                  {activeTab.links.map((linkText, idx) => (
                                    <li key={idx}>
                                      <span className="link-bullet">✔</span>
                                      <span className="link-text">{linkText}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <a href={`#company-${activeTab.id}`} className="company-details-cta">
                                Visit {activeTab.name} →
                              </a>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="company-right-panel">
                        <div className="featured-company-header">
                          <span className="company-eyebrow">Featured Company</span>
                          <h4>Building the Future of Customer Relationships</h4>
                          <p className="company-desc">CRM Platform helps businesses automate sales, strengthen customer relationships, and accelerate growth through intelligent CRM technology. Trusted by thousands of growing companies worldwide.</p>
                        </div>
                        
                        <div className="company-card-details">
                          <div className="detail-row">
                            <span className="detail-bullet">🏢</span>
                            <span>Founded in 2026</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">🌍</span>
                            <span>Serving Customers Worldwide</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">🚀</span>
                            <span>AI-Driven CRM Platform</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-bullet">🏆</span>
                            <span>99.99% Platform Uptime</span>
                          </div>
                        </div>

                        <div className="company-card-actions">
                          <a href="#about-us" className="preview-btn-primary">Learn About Us</a>
                          <a href="#careers" className="preview-btn-secondary">View Careers</a>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Statistics KPI Bar */}
                    <div className="company-mega-footer">
                      <div className="footer-metric">
                        <span className="metric-num">10K+</span>
                        <span className="metric-lbl">Businesses Served</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">50+</span>
                        <span className="metric-lbl">Countries</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">99.99%</span>
                        <span className="metric-lbl">Platform Uptime</span>
                      </div>
                      <div className="footer-metric-divider"></div>
                      <div className="footer-metric">
                        <span className="metric-num">4.9★</span>
                        <span className="metric-lbl">Satisfaction Rating</span>
                      </div>
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
                    <div className="mega-dropdown-card">
                      <div className="mega-dropdown-inner">
                        {/* Column 1 */}
                        <div className="mega-column mega-column-left">
                          <span className="mega-subtitle">Get started here</span>
                          <a href="#what-is-crm" className="mega-bold-link">What is CRM?</a>
                          <p className="mega-desc">
                            Build and grow relationships by uniting your teams around a single view of your customer data.
                          </p>
                        </div>
                        {/* Column 2 */}
                        <div className="mega-column mega-column-middle">
                          <a href="#software" className="mega-link-bold">CRM Software</a>
                          <a href="#implementation" className="mega-link-bold">CRM Implementation</a>
                          <a href="#features" className="mega-link-bold">CRM Features</a>
                        </div>
                        {/* Column 3 */}
                        <div className="mega-column mega-column-right">
                          <a href="#best-practices" className="mega-link-bold">Best Practices</a>
                          <a href="#benefits" className="mega-link-bold">Benefits of CRM</a>
                          <a href="#examples" className="mega-link-bold">CRM Examples</a>
                        </div>
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