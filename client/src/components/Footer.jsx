import React from "react";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube, 
  ExternalLink, 
  Globe, 
  ChevronDown, 
  Sparkles 
} from 'lucide-react';

const Footer = () => {
  const [openColumns, setOpenColumns] = React.useState({
    newToCrm: false,
    aboutCrm: false,
    popularLinks: false,
  });

  const toggleColumn = (col) => {
    setOpenColumns(prev => ({
      ...prev,
      [col]: !prev[col]
    }));
  };

  const handleAskClick = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event("open-chatbot"));
  };

  return (
    <>
        <style>{`.footer {
  position: relative;
  background: #FFFFFF;
  border-top: 1px solid #E5E7EB;
  color: #181818;
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
}

/* Upper Footer: White Background */
.footer-upper {
  background: #FFFFFF;
  padding: 50px 0 40px;
}

.footer-upper-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1.3fr repeat(3, 1fr);
  gap: 40px;
}

/* Branding Column */
.footer-brand-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.logo-cloud-icon {
  color: #0176D3;
}

.footer-logo .brand-strong {
  font-size: 26px;
  font-weight: 800;
  color: #181818;
  letter-spacing: -0.02em;
}

.footer-logo .brand-light {
  font-size: 26px;
  font-weight: 500;
  color: #0176D3;
  margin-left: 2px;
}

/* Social icons - solid square style */
.footer-social-icons {
  display: flex;
  gap: 10px;
}

.footer-social-icons a {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #F3F4F6;
  color: #4B5563;
  transition: all 200ms ease;
}

.footer-social-icons a:hover {
  background: #E5E7EB;
  color: #0176D3;
}

.footer-call-us {
  font-size: 14.5px;
  font-weight: 700;
  color: #181818;
  margin-top: 4px;
}

/* Link columns */
.footer-links-column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-links-column h4 {
  color: #181818;
  margin-bottom: 16px;
  font-size: 14.5px;
  font-weight: 700;
  text-transform: none;
}

.accordion-chevron {
  display: none;
}

.footer-links-column a {
  display: inline-flex;
  align-items: center;
  color: #0176D3;
  margin-bottom: 10px;
  font-size: 13.5px;
  text-decoration: none;
  font-weight: 500;
  transition: color 150ms ease;
}

.footer-links-column a:hover {
  color: #014486;
  text-decoration: underline;
}

.footer-links-column .ext-icon {
  margin-left: 4px;
  color: #9CA3AF;
  flex-shrink: 0;
}

/* Lower Footer: Dark Blue Background Banner */
.footer-lower {
  background: #032D60;
  color: #FFFFFF;
  padding: 24px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-lower-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Lower Top Row */
.footer-lower-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

/* Region Selector */
.footer-region-selector {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 150ms ease;
}

.footer-region-selector:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* Policy links */
.footer-policy-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-policy-links a {
  color: #FFFFFF;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 150ms ease;
}

.footer-policy-links a:hover {
  text-decoration: underline;
}

.privacy-choices-link {
  display: inline-flex;
  align-items: center;
}

.privacy-choices-icon {
  display: inline-flex;
  align-items: center;
}

/* Ask AI Pill Button */
.footer-ai-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #0176D3;
  color: #FFFFFF;
  padding: 10px 22px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 13.5px;
  text-decoration: none;
  transition: background-color 150ms ease, transform 150ms ease;
  box-shadow: 0 4px 12px rgba(1, 118, 211, 0.2);
}

.footer-ai-pill:hover {
  background: #014486;
  transform: translateY(-1px);
}

/* Trademark row */
.footer-trademark-row {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
  color: #D1D5DB;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.6;
}

.footer-trademark-row p {
  margin: 0;
}

@media (max-width: 1024px) {
  .footer-upper-inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  .footer-brand-column {
    align-items: flex-start;
    text-align: left;
  }

  .footer-links-column {
    align-items: flex-start;
    text-align: left;
  }

  .footer-lower-top-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .footer-policy-links {
    justify-content: center;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .footer-upper {
    padding: 40px 0 30px;
  }
  .footer-upper-inner {
    grid-template-columns: 1fr !important;
    padding: 0 20px;
    gap: 16px;
  }
  
  .footer-links-column {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-bottom: 1px solid #E5E7EB;
    padding-bottom: 8px;
    align-items: flex-start;
  }
  
  .footer-links-column h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0;
    padding: 14px 0;
    cursor: pointer;
    font-size: 15px;
  }
  
  .accordion-chevron {
    display: block;
    transition: transform 200ms ease;
    color: #475569;
  }
  
  .footer-links-column.open .accordion-chevron {
    transform: rotate(180deg);
  }
  
  .footer-links-list {
    display: none;
    flex-direction: column;
    padding: 4px 0 12px;
    gap: 10px;
    width: 100%;
    align-items: flex-start;
  }
  
  .footer-links-column.open .footer-links-list {
    display: flex;
  }
  
  .footer-links-column a {
    margin-bottom: 0;
    padding: 8px 0;
    font-size: 14px;
    width: 100%;
  }

  .footer-lower-inner {
    padding: 0 20px;
  }
}
`}</style>
  <footer className="footer" id="footer">
    {/* Upper Footer: Pure White Background */}
    <div className="footer-upper">
      <div className="container footer-upper-inner">
        
        {/* Branding & Social Column */}
        <div className="footer-brand-column">
          <a href="#" className="footer-logo">
            <span className="brand-strong">CRM</span>
            <span className="brand-light">Platform</span>
          </a>
          
          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X/Twitter">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>
          
          <div className="footer-call-us">
            Call us at 1800-420-7332
          </div>
        </div>

        {/* Links Column 1: New to CRM Platform? */}
        <div className={`footer-links-column ${openColumns.newToCrm ? 'open' : ''}`}>
          <h4 onClick={() => toggleColumn('newToCrm')}>
            <span>New to CRM Platform?</span>
            <ChevronDown size={16} className="accordion-chevron" />
          </h4>
          <div className="footer-links-list">
            <a href="/crm-guide#why-crm">Why CRM Platform</a>
            <a href="/crm-guide#what-is-crm">What is CRM?</a>
            <a href="/crm-guide#explore-products">Explore All Products</a>
            <a href="/crm-guide#saas-solutions">SaaS Solutions</a>
            <a href="/crm-guide#customer-success">Customer Success</a>
            <a href="/crm-guide#product-pricing">Product Pricing</a>
          </div>
        </div>

        {/* Links Column 2: About CRM Platform */}
        <div className={`footer-links-column ${openColumns.aboutCrm ? 'open' : ''}`}>
          <h4 onClick={() => toggleColumn('aboutCrm')}>
            <span>About CRM Platform</span>
            <ChevronDown size={16} className="accordion-chevron" />
          </h4>
          <div className="footer-links-list">
            <a href="/about#our-story">Our Story</a>
            <a href="/about#careers">Careers</a>
            <a href="/about#press">Press</a>
            <a href="/about#blog">Blog</a>
            <a href="/about#security">Security and Performance</a>
            <a href="/about#community">CRMPlatform.org</a>
            <a href="/about#comparisons">Best CRM Software</a>
            <a href="/about#sustainability">Sustainability</a>
            <a href="/about#legal">Legal</a>
            <a href="/about#feedback">Give us your Feedback</a>
          </div>
        </div>

        {/* Links Column 3: Popular Links */}
        <div className={`footer-links-column ${openColumns.popularLinks ? 'open' : ''}`}>
          <h4 onClick={() => toggleColumn('popularLinks')}>
            <span>Popular Links</span>
            <ChevronDown size={16} className="accordion-chevron" />
          </h4>
          <div className="footer-links-list">
            <a href="#features">New Release Features <ExternalLink size={12} className="ext-icon" /></a>
            <a href="#mobile">CRM Mobile App</a>
            <a href="#store">Business App Store <ExternalLink size={12} className="ext-icon" /></a>
            <a href="#events">Dreamforce Event <ExternalLink size={12} className="ext-icon" /></a>
            <a href="#software">CRM Software</a>
            <a href="#plus">CRM Plus <ExternalLink size={12} className="ext-icon" /></a>
            <a href="#startups">CRM for Startups <ExternalLink size={12} className="ext-icon" /></a>
          </div>
        </div>

      </div>
    </div>

    {/* Lower Footer: Dark Blue Background Banner */}
    <div className="footer-lower">
      <div className="container footer-lower-inner">
        
        {/* Top Row: Region, Links, Pill Button */}
        <div className="footer-lower-top-row">
          
          {/* Region selector */}
          <div className="footer-region-selector">
            <Globe size={16} />
            <span>Worldwide</span>
            <ChevronDown size={14} />
          </div>
          
          {/* Policy Links */}
          <div className="footer-policy-links">
            <a href="/legal">Legal</a>
            <a href="/terms-of-service">Terms of Service</a>
            <a href="/privacy-policy">Privacy</a>
            <a href="/responsible-disclosure">Responsible Disclosure</a>
            <a href="/trust-center">Trust Center</a>
            <a href="#contact">Contact</a>
            <a href="/cookie-preferences">Cookie Preferences</a>
            <a href="#privacy-choices" className="privacy-choices-link">
              <span className="privacy-choices-icon">
                <svg viewBox="0 0 30 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: '12px', width: 'auto', verticalAlign: 'middle', marginRight: '4px' }}>
                  <path d="M7.4 12.8h15.2c4.1 0 7.4-3.3 7.4-7.4S26.7 1 22.6 1H7.4C3.3 1 0 4.3 0 8.4s3.3 7.4 7.4 7.4z" fill="#0072C6"/>
                  <path d="M22.6 12C25 12 27 10 27 7.6s-2-4.4-4.4-4.4c-2.4 0-4.4 2-4.4 4.4s2 4.4 4.4 4.4z" fill="#FFF"/>
                  <path d="M9.5 4.5l-3 3-1.5-1.5M19.5 7.5h-4.5" stroke="#0072C6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Your Privacy Choices
            </a>
          </div>

          {/* Ask AI Pill Button */}
          <a href="#ask" className="footer-ai-pill" onClick={handleAskClick}>
            <Sparkles size={14} />
            <span>Ask CRM AI</span>
          </a>

        </div>

        {/* Bottom Row: Trademark Statement */}
        <div className="footer-trademark-row">
          <p>© Copyright 2026 CRM Platform, Inc. All rights reserved. Various trademarks held by their respective owners.</p>
        </div>

      </div>
    </div>
  </footer>

    </>
  );
};

export default Footer;