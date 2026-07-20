import React from "react";
import { 
  ArrowRight, 
  TrendingUp, 
  Headphones, 
  Megaphone, 
  Rocket, 
  Store, 
  Building2, 
  BarChart3, 
  Users, 
  GitFork, 
  Sparkles, 
  CheckSquare, 
  FileText 
} from "lucide-react";

const solutions = [
  {
    title: "Sales Teams",
    description: "Manage leads, track deals and close opportunities faster.",
    Icon: TrendingUp,
  },
  {
    title: "Customer Support",
    description: "Keep every customer conversation organized in one place.",
    Icon: Headphones,
  },
  {
    title: "Marketing Teams",
    description: "Capture leads, monitor campaigns and measure performance.",
    Icon: Megaphone,
  },
  {
    title: "Startups",
    description: "Scale customer relationships without adding complexity.",
    Icon: Rocket,
  },
  {
    title: "Small Businesses",
    description: "An affordable CRM designed to simplify daily operations.",
    Icon: Store,
  },
  {
    title: "Enterprise",
    description: "Advanced permissions, analytics and automation for growing organizations.",
    Icon: Building2,
  },
];

const SolutionsSection = () => {
  return (
    <section className="solutions-section" id="solutions">
      <div className="container solutions-inner">
        <div className="solutions-header animate-fade-up">
          <span className="solutions-badge">Solutions</span>
          <h2>Built for every growing business.</h2>
          <p>
            Whether you're a startup, sales team, or enterprise, CRM Platform helps
            you manage customers, automate workflows, and grow revenue.
          </p>
        </div>

        <div className="solutions-grid-wrapper">
          <div className="solutions-grid">
            {solutions.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <article
                  key={item.title}
                  className="solution-card animate-fade-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="solution-icon-wrapper">
                    <IconComponent size={20} className="text-primary" />
                  </span>
                  <div className="solution-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="solution-arrow">
                    <ArrowRight size={16} />
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}




const productCards = [
  {
    title: "Dashboard",
    description: "Track revenue, leads and customer activity from one clean dashboard.",
    Icon: BarChart3,
  },
  {
    title: "Customers",
    description: "Manage customer details, notes, history and files from one place.",
    Icon: Users,
  },
  {
    title: "Sales Pipeline",
    description: "Move deals through every stage with an intuitive pipeline.",
    Icon: GitFork,
  },
  {
    title: "AI Assistant",
    description: "Generate emails, summaries and smart recommendations.",
    Icon: Sparkles,
  },
  {
    title: "Tasks",
    description: "Assign work, track progress and never miss deadlines.",
    Icon: CheckSquare,
  },
  {
    title: "Reports",
    description: "Visualize sales and performance using real-time reports.",
    Icon: FileText,
  },
];

const ProductSection = () => {
  return (
    <section className="product-section" id="product">
      <div className="container product-inner">
        <div className="product-header animate-fade-up">
          <span className="product-eyebrow">PRODUCT</span>
          <h2>Everything you need to manage your customers.</h2>
          <p>
            CRM Platform gives your team all the tools required to track leads,
            manage customers, automate tasks and grow revenue from one dashboard.
          </p>
        </div>

        <div className="product-grid-wrapper">
          <div className="product-grid">
            {productCards.map((item, index) => {
              const IconComponent = item.Icon;
              return (
                <article
                  key={item.title}
                  className="product-card animate-fade-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="product-icon-wrapper">
                    <IconComponent size={20} className="text-primary" />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <a href="#" className="product-link">
                    Learn more →
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}



const Solutions = () => {
  return (
    <>
      <style>{`.product-section {
  padding: 80px 0;
  background: #F8FAFC;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
}

.product-inner {
  display: grid;
  gap: 2.5rem;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.product-header {
  max-width: 720px;
  text-align: left;
}

.product-eyebrow {
  display: inline-flex;
  margin-bottom: 0.75rem;
  color: #2563EB;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.product-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(26px, 4.5vw, 38px);
  line-height: 1.2;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.75rem;
}

.product-header p {
  color: #64748B;
  font-size: 16px;
  line-height: 1.6;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.product-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 18px 20px;
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);
  position: relative;
  overflow: hidden;
}

/* Glowing top border on hover */
.product-card::before {
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

.product-card:hover::before {
  opacity: 1;
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: #2563EB;
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
}

.product-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #F1F5F9;
  color: #2563EB;
  margin-bottom: 16px;
  transition: all 300ms ease;
  border: 1px solid #E2E8F0;
}

.product-card:hover .product-icon-wrapper {
  background: #EFF6FF;
  border-color: #BFDBFE;
  transform: scale(1.08);
}

.product-icon {
  display: block;
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.product-card h3 {
  font-size: 1.2rem;
  line-height: 1.3;
  margin-bottom: 8px;
  color: #0F172A;
  font-weight: 750;
}

.product-card p {
  color: #64748B;
  font-size: 14.5px;
  line-height: 1.55;
  margin-bottom: 16px;
}

.product-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #2563EB;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
  transition: gap 200ms ease;
  margin-top: auto;
}

.product-link:hover {
  gap: 8px;
}

/* Animations */
.animate-fade-up {
  opacity: 0;
  transform: translateY(15px);
  animation: productFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes productFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .product-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .product-card {
    width: 100%;
    padding: 20px;
  }
  .product-header h2 {
    font-size: 28px;
  }
  .product-header p {
    font-size: 15px;
  }
  .product-section {
    padding: 60px 0;
  }
}

.solutions-section {
  padding: 80px 0;
  background: radial-gradient(circle at top left, rgba(37, 99, 235, 0.04), transparent 35%), #FFFFFF;
  border-bottom: 1px solid #E2E8F0;
  position: relative;
}

.solutions-inner {
  display: grid;
  gap: 2.5rem;
  text-align: center;
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.solutions-header {
  max-width: 620px;
  margin: 0 auto;
}

.solutions-badge {
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

.solutions-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(26px, 4.5vw, 38px);
  line-height: 1.2;
  color: #0F172A;
  font-weight: 800;
}

.solutions-header p {
  max-width: 620px;
  margin: 8px auto 0;
  color: #64748B;
  font-size: 16px;
  line-height: 1.6;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
}

.solution-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  text-align: left;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

/* Glowing top border on hover */
.solution-card::before {
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

.solution-card:hover::before {
  opacity: 1;
}

.solution-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
  border-color: #2563EB;
}

.solution-icon-wrapper {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #F1F5F9;
  color: #2563EB;
  border: 1px solid #E2E8F0;
  overflow: hidden;
  transition: all 300ms ease;
}

.solution-card:hover .solution-icon-wrapper {
  background: #EFF6FF;
  border-color: #BFDBFE;
  transform: scale(1.08);
}

.solution-icon {
  display: block;
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.solution-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.solution-copy h3 {
  font-size: 1.2rem;
  line-height: 1.3;
  color: #0F172A;
  font-weight: 750;
}

.solution-copy p {
  color: #64748B;
  font-size: 14.5px;
  line-height: 1.55;
  margin: 0;
}

.solution-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F1F5F9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  transition: all 300ms ease;
  margin-left: auto;
  border: 1px solid #E2E8F0;
}

.solution-card:hover .solution-arrow {
  background: #2563EB;
  color: #FFFFFF;
  border-color: #2563EB;
  transform: translateX(4px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
}

.animate-fade-up {
  opacity: 0;
  transform: translateY(15px);
  animation: solutionFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes solutionFadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .solutions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .solutions-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .solution-card {
    width: 100%;
    padding: 20px;
  }
  .solutions-header h2 {
    font-size: 28px;
  }
  .solutions-header p {
    font-size: 15px;
  }
  .solutions-section {
    padding: 60px 0;
  }
}
`}</style>
      <ProductSection />
      <SolutionsSection />
    </>
  );
};

export default Solutions;
