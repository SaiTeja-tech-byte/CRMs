import React from "react";
import documentLogo from "../assets/icons/document.png";
import supportLogo from "../assets/icons/support.png";
import videoLogo from "../assets/icons/video-lesson.png";
import codeLogo from "../assets/icons/integration.png";
import bloggingLogo from "../assets/icons/blogging.png";
import helpLogo from "../assets/icons/operator.png";
import { ArrowRight } from "lucide-react";

const cards = [
  {
    title: "Documentation",
    desc: "Complete product documentation and setup guides.",
    image: documentLogo,
    alt: "Documentation logo",
  },
  {
    title: "Help Center",
    desc: "Find answers to frequently asked questions.",
    image: helpLogo,
    alt: "Help Center logo",
  },
  {
    title: "Video Tutorials",
    desc: "Watch step-by-step product walkthroughs.",
    image: videoLogo,
    alt: "Video Tutorials logo",
  },
  {
    title: "API Documentation",
    desc: "Developer resources and API references.",
    image: codeLogo,
    alt: "API Documentation logo",
  },
  {
    title: "Blog & Insights",
    desc: "CRM tips, AI trends, and business growth articles.",
    image: bloggingLogo,
    alt: "Blog & Insights logo",
  },
  {
    title: "Contact Support",
    desc: "Reach our team whenever you need assistance.",
    image: supportLogo,
    alt: "Contact Support logo",
  },
];

const ResourcesSection = () => {
  return (
      <>
        <style>{`.resources-section {
  padding: 60px 0;
  background: #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
}

.resources-inner {
  display: grid;
  gap: 2rem;
  text-align: center;
  max-width: 1280px;
  margin: 0 auto;
}

.resources-header {
  max-width: 620px;
  margin: 0 auto;
  text-align: center;
}

.resources-badge {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #2563EB;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.resources-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(26px, 4.5vw, 36px);
  line-height: 1.25;
  color: #0F172A;
  font-weight: 800;
}

.resources-header p {
  color: #64748B;
  font-size: 16px;
  line-height: 1.6;
  margin: 8px auto 0;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 1rem;
}

.resource-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  text-align: left;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

/* Glowing top border on hover */
.resource-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #2563EB, #60A5FA);
  opacity: 0;
  transition: opacity 300ms ease;
}

.resource-card:hover::before {
  opacity: 1;
}

.resource-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
  border-color: #2563EB;
}

.resource-icon-wrapper {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #F1F5F9;
  color: #2563EB;
  border: 1px solid #E2E8F0;
  transition: all 300ms ease;
}

.resource-card:hover .resource-icon-wrapper {
  background: #EFF6FF;
  border-color: #BFDBFE;
  transform: scale(1.08);
}

.resource-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
}

.resource-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resource-copy h3 {
  font-size: 17px;
  line-height: 1.3;
  color: #0F172A;
  font-weight: 750;
  margin: 0;
}

.resource-copy p {
  color: #64748B;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.resource-more {
  color: #2563EB;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  margin-top: auto;
}

.resource-arrow {
  transition: transform 200ms ease;
}

.resource-more:hover .resource-arrow {
  transform: translateX(3px);
}

/* Responsive */
@media (max-width: 980px) {
  .resources-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .resources-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .resources-header h2 {
    font-size: 28px;
  }
  .resources-section {
    padding: 50px 0;
  }
}
`}</style>
    <section className="resources-section" id="resources">
      <div className="container resources-inner">
        <div className="resources-header animate-fade-up">
          <span className="resources-badge">Resources</span>
          <h2>Everything you need to succeed.</h2>
          <p>
            Explore guides, documentation, tutorials, and support resources to
            help you get the most out of CRM Platform.
          </p>
        </div>

        <div className="resources-grid">
          {cards.map((c, idx) => (
            <article
              key={c.title}
              className="resource-card animate-fade-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <span className="resource-icon-wrapper">
                <img src={c.image} alt={c.alt} className="resource-img" />
              </span>
              <div className="resource-copy">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
              <a className="resource-more" href="#">
                Learn More <ArrowRight size={14} className="resource-arrow" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  
      </>);
};

export default ResourcesSection;
