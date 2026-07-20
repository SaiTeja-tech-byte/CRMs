import React from "react";

// SVG Components for integration logos to ensure they look beautiful and load instantly
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.625 5.625 0 0 1 8.36 12.89a5.625 5.625 0 0 1 5.631-5.63c1.554 0 2.977.568 4.07 1.503l3.208-3.21a10.057 10.057 0 0 0-7.278-2.923C8.423 2.63 3.864 7.189 3.864 12.766c0 5.578 4.559 10.137 10.127 10.137 5.807 0 9.646-4.08 9.646-9.82 0-.66-.06-1.297-.17-1.798H12.24Z" fill="#4285F4"/>
    <path d="M3.864 12.766c0-1.898.52-3.666 1.423-5.187l-3.26-2.53C.72 6.836 0 9.713 0 12.766c0 3.053.72 5.93 2.027 8.717l3.26-2.53a6.113 6.113 0 0 1-1.423-5.187Z" fill="#EA4335"/>
    <path d="M13.99 22.903c2.723 0 5.21-.97 7.118-2.585l-3.26-2.53c-1.047.7-2.348 1.115-3.858 1.115-2.915 0-5.39-1.97-6.27-4.634l-3.26 2.53c1.78 3.568 5.43 6.104 9.53 6.104Z" fill="#34A853"/>
    <path d="M21.108 4.283c-1.908-1.615-4.395-2.585-7.118-2.585-4.1 0-7.75 2.536-9.53 6.104l3.26 2.53c.88-2.664 3.355-4.634 6.27-4.634 1.51 0 2.81.415 3.858 1.115l3.26-2.53Z" fill="#FBBC05"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 23 23" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="11" height="11" fill="#F25022" />
    <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
    <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
    <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
  </svg>
);

const SlackIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 8.823 0a2.528 2.528 0 0 1 2.522 2.521v2.522h-2.522zm0 1.261a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.781a2.528 2.528 0 0 1-2.522-2.522V8.824a2.528 2.528 0 0 1 2.522-2.52h5.042zm10.135 3.761a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522h-2.522v-2.522zm-1.262 0a2.528 2.528 0 0 1-2.52 2.522h-5.043a2.528 2.528 0 0 1-2.522-2.522V5.043a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043zm-3.761 10.134a2.528 2.528 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.522h2.522zm0-1.261a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" fill="#E01E5A"/>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52z" fill="#36C5F0"/>
    <path d="M6.303 15.165a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042z" fill="#36C5F0"/>
    <path d="M8.823 5.043a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 8.823 0a2.528 2.528 0 0 1 2.522 2.521v2.522h-2.522z" fill="#2EB67D"/>
    <path d="M8.823 6.304a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.781a2.528 2.528 0 0 1-2.522-2.522V8.824a2.528 2.528 0 0 1 2.522-2.52h5.042z" fill="#2EB67D"/>
    <path d="M18.958 10.065a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522h-2.522v-2.522z" fill="#ECB22E"/>
    <path d="M17.696 10.065a2.528 2.528 0 0 1-2.52 2.522h-5.043a2.528 2.528 0 0 1-2.522-2.522V5.043a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043z" fill="#ECB22E"/>
    <path d="M15.197 18.888a2.528 2.528 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.522h2.522z" fill="#E01E5A"/>
    <path d="M15.197 17.627a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" fill="#E01E5A"/>
  </svg>
);

const ZoomIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#2D8CFF" />
    <path d="M6 8.5C6 7.67 6.67 7 7.5 7h6C14.33 7 15 7.67 15 8.5v5c0 .83-.67 1.5-1.5 1.5h-6C6.67 15 6 14.33 6 13.5v-5zm10 1.91v3.18l2.5 1.91c.46.35.83.13.83-.45V9.95c0-.58-.37-.8-.83-.45L16 10.41z" fill="#FFFFFF" />
  </svg>
);

const StripeIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="6" fill="#635BFF"/>
    <path d="M12.5 5.5c-1.3 0-2 .6-2 1.3 0 1.2 1.6 1 1.6 1.8 0 .3-.3.4-.6.4-.6 0-1.2-.2-1.7-.5l-.3 1.4c.5.3 1.3.5 2 .5 1.4 0 2-.6 2-1.3 0-1.2-1.6-1-1.6-1.8 0-.3.3-.4.6-.4.5 0 1.1.2 1.5.4l.3-1.4c-.5-.3-1.1-.5-1.8-.5zm-6 2.3h1.7l-.4 1.8h1.7l-.2 1H7.6l-.3 1.5c0 .3.1.4.4.4.2 0 .4 0 .6-.1l-.2 1C8 13.9 7.4 14 7 14c-1.1 0-1.6-.4-1.4-1.3l.8-3.9H5l.2-1h1.4l.3-1.6c.1-.6.5-1.1 1.2-1.1.6 0 1 .1 1.2.2L9.5 7c-.1-.1-.3-.1-.5-.1-.4 0-.6.2-.7.5l-.2.7z" fill="#FFFFFF"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#181717"/>
  </svg>
);

const SalesforceIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.86 10.25a3.86 3.86 0 0 0-3.66-2.62 3.87 3.87 0 0 0-3.3 1.84 4.54 4.54 0 0 0-4.7 1.76A3.87 3.87 0 0 0 4.5 15.5c0 2.13 1.73 3.87 3.87 3.87h10.49A3.87 3.87 0 0 0 22.73 15.5a3.86 3.86 0 0 0-3.87-3.87v-1.38z" fill="#009EDB"/>
  </svg>
);

const HubspotIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.9 10.4c-.6-.7-1.6-1-2.5-.8L15.3 6V4.1c1.2-.4 2-1.5 2-2.8 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 1.3.8 2.4 2 2.8V6L9.2 9.6c-.9-.2-1.9.1-2.5.8-.9.9-.9 2.5 0 3.4.6.7 1.6 1 2.5.8l2.9 2.9v1.9c-1.2.4-2 1.5-2 2.8 0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.3-.8-2.4-2-2.8v-1.9l2.9-2.9c.9.2 1.9-.1 2.5-.8.9-.9.9-2.5 0-3.4zm-7.6-7.7c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3-1.3-.6-1.3-1.3.6-1.3 1.3-1.3zm0 18.5c-.7 0-1.3-.6-1.3-1.3s.6-1.3 1.3-1.3 1.3.6 1.3 1.3-.6 1.3-1.3 1.3zM8.1 12.1c-.5.5-1.2.5-1.7 0-.5-.5-.5-1.2 0-1.7.5-.5 1.2-.5 1.7 0 .5.5.5 1.2 0 1.7zm10.2 1.7c-.5.5-1.2.5-1.7 0-.5-.5-.5-1.2 0-1.7.5-.5 1.2-.5 1.7 0 .5.5.5 1.2 0 1.7z" fill="#FF7A59"/>
  </svg>
);

const ZapierIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L9.4 6.7 2.3 8.3l5.3 4.8L6.1 20 12 16.3l5.9 3.7-1.5-6.9 5.3-4.8-7.1-1.6L12 0z" fill="#FF4A00"/>
  </svg>
);

const NotionIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.2 2h15.6c1.2 0 2.2 1 2.2 2.2v15.6c0 1.2-1 2.2-2.2 2.2H4.2C3 22 2 21 2 19.8V4.2C2 3 3 2 4.2 2zm12.3 4.2H14.1l-2.4 3.9V6.2H9.2v11.6h2.4l3.1-5v5h2.5V6.2h-.7z" fill="#000000"/>
  </svg>
);

const integrations = [
  { name: "Google Workspace", icon: <GoogleIcon /> },
  { name: "Microsoft 365", icon: <MicrosoftIcon /> },
  { name: "Slack", icon: <SlackIcon /> },
  { name: "Zoom", icon: <ZoomIcon /> },
  { name: "Stripe", icon: <StripeIcon /> },
  { name: "GitHub", icon: <GithubIcon /> },
  { name: "Salesforce", icon: <SalesforceIcon /> },
  { name: "HubSpot", icon: <HubspotIcon /> },
  { name: "Zapier", icon: <ZapierIcon /> },
  { name: "Notion", icon: <NotionIcon /> },
];

const Companies = () => {
  return (
      <>
        <style>{`.trusted-section {
  position: relative;
  background: #FFFFFF;
  padding: 60px 0;
  overflow: hidden;
  border-bottom: 1px solid #F1F5F9;
}

.integrations-grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
  background-size: 30px 30px;
  opacity: 0.15;
  pointer-events: none;
}

.trusted-inner {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* Header */
.trusted-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.text-gradient {
  background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.trusted-desc {
  font-size: 16px;
  color: #64748B;
  max-width: 680px;
  line-height: 1.6;
  margin: 12px auto 0;
}

/* Compact Badges list */
.integrations-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px 20px;
  width: 100%;
}

.integration-badge {
  width: 56px;
  height: 56px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.badge-logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms ease;
  filter: none;
  opacity: 1;
}

/* Hover effects */
.integration-badge:hover {
  transform: translateY(-4px);
  border-color: #2563EB;
  background: #FFFFFF;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.1);
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .trusted-section {
    padding: 50px 0;
  }
  .trusted-header h2 {
    font-size: 30px;
  }
  .trusted-desc {
    font-size: 15px;
  }
  .integrations-list-wrapper {
    position: relative;
    margin: 0 -20px;
  }
  .integrations-list-wrapper::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
    z-index: 5;
  }
  .integrations-list-wrapper::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(270deg, #FFFFFF 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
    z-index: 5;
  }
  .integrations-list {
    display: flex;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding: 10px 20px;
    gap: 16px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Hide scrollbar on Firefox */
  }
  .integrations-list::-webkit-scrollbar {
    display: none; /* Hide scrollbar on Chrome/Safari */
  }
  .integration-badge {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .trusted-header h2 {
    font-size: 26px;
  }
  .integration-badge {
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }
}
`}</style>
    <section className="trusted-section" aria-label="Integrations Showcase">
      <div className="integrations-grid-pattern"></div>
      <div className="container trusted-inner">
        <div className="trusted-header">
          <h2>Connect Your Favorite <span className="text-gradient">Business Tools</span></h2>
          <p className="trusted-desc">
            Seamlessly integrate with Google Workspace, Microsoft 365, Slack, Stripe, HubSpot, Notion, and other platforms to synchronize data and automate workflows.
          </p>
        </div>

        <div className="integrations-list-wrapper">
          <div className="integrations-list">
            {integrations.map((item) => (
              <div key={item.name} className="integration-badge" title={item.name}>
                <div className="badge-logo-wrap">
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  
      </>);
};

export default Companies;