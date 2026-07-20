import React, { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    key: "starter",
    title: "Starter",
    monthly: 0,
    description: "Perfect for individuals and startups.",
    features: [
      "Up to 500 customers",
      "Contact Management",
      "Sales Pipeline",
      "Email Integration",
      "Basic Reports",
    ],
    cta: "Start Free",
  },
  {
    key: "professional",
    title: "Professional",
    monthly: 2499,
    description: "Best for growing businesses.",
    features: [
      "Unlimited Customers",
      "AI Lead Scoring",
      "Workflow Automation",
      "Analytics Dashboard",
      "Team Collaboration",
      "Priority Support",
    ],
    cta: "Get Started",
    featured: true,
  },
  {
    key: "enterprise",
    title: "Enterprise",
    monthly: null,
    description: "Ideal for large organizations.",
    features: [
      "Everything in Professional",
      "Custom Integrations",
      "Advanced Security",
      "Dedicated Account Manager",
      "API Access",
      "24/7 Support",
    ],
    cta: "Contact Sales",
  },
];

const formatRupee = (n) => n.toLocaleString("en-IN");

const PricingSection = () => {
  const [billing, setBilling] = useState("monthly");

  const priceLabel = (monthly) => {
    if (!monthly) return "Custom Pricing";
    if (billing === "monthly") {
      return `₹${formatRupee(monthly)} / month`;
    }
    const yearly = Math.round(monthly * 12 * 0.8);
    return `₹${formatRupee(yearly)} / year`;
  };

  return (
    <section className="pricing-section" id="pricing">
      <div className="container pricing-inner">
        <div className="pricing-header animate-fade-up">
          <span className="pricing-badge">Pricing</span>
          <h2>Simple pricing for every business.</h2>
          <p>Choose a plan that fits your team today and scale as your business grows.</p>
        </div>

        <div className="pricing-toggle animate-fade-up" style={{ animationDelay: `120ms` }}>
          <div className="toggle">
            <button
              className={`toggle-option ${billing === "monthly" ? "active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`toggle-option ${billing === "yearly" ? "active" : ""}`}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
          {billing === "yearly" && <span className="save-note">Save 20%</span>}
        </div>

        <div className="pricing-grid">
          {plans.map((p, idx) => (
            <PriceCard
              key={p.key}
              title={p.title}
              price={p.monthly}
              billing={billing}
              period={billing === "monthly" ? "month" : "year"}
              description={p.description}
              features={p.features}
              cta={p.key === "enterprise" ? "outline" : p.cta}
              featured={!!p.featured}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};





const PriceCard = ({
  title,
  price,
  period,
  billing,
  description,
  features = [],
  cta,
  featured = false,
  index = 0,
}) => {
  const navigate = useNavigate();

  const getDisplayPrice = () => {
    if (price === null || price === undefined) return "Custom Pricing";
    if (price === 0) return "0";
    if (billing === "monthly") {
      return price.toLocaleString("en-IN");
    }
    const yearlyRate = Math.round(price * 12 * 0.8);
    return yearlyRate.toLocaleString("en-IN");
  };

  const isNumeric = typeof price === "number";

  return (
    <article
      className={`price-card ${featured ? "featured" : ""} animate-fade-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {featured && <span className="popular-badge">Most Popular</span>}

      <div className="price-head">
        <h4>{title}</h4>
        <div className="price-value">
          {isNumeric ? (
            <>
              <span className="currency">₹</span>
              <span className="amount">{getDisplayPrice()}</span>
              <span className="period">{` / ${period}`}</span>
            </>
          ) : (
            <span className="amount custom-price">{getDisplayPrice()}</span>
          )}
        </div>
        <p className="price-desc">{description}</p>
      </div>

      <ul className="price-features">
        {features.map((f) => (
          <li key={f}>
            <Check size={16} className="check-icon" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="price-cta">
        {cta === "outline" ? (
          <button className="btn btn-outline">{title === "Enterprise" ? "Contact Sales" : "Get Started"}</button>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate("/login")}>{cta}</button>
        )}
      </div>
    </article>
  );
};



const PricingSectionComponent = () => {
  return (
    <>
      <style>{`.pricing-section {
  padding: 80px 0;
  background: #fafafb;
}

.pricing-inner {
  display: grid;
  gap: 1.25rem;
  text-align: center;
}

.pricing-header {
  max-width: 620px;
  margin: 0 auto;
}

.pricing-badge {
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

.pricing-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 8px;
}

.pricing-header p {
  color: #64748B;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.pricing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
}

.toggle {
  display: inline-flex;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 4px;
}

.toggle-option {
  padding: 8px 14px;
  border-radius: 999px;
  background: transparent;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.toggle-option.active {
  background: #2563EB;
  color: #fff;
}

.save-note {
  color: #10B981;
  font-weight: 700;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-top: 1rem;
}

.pricing-note {
  display: inline-flex;
  gap: 18px;
  color: #6b7280;
  margin: 18px auto 0 auto;
}

/* Responsive */
@media (max-width: 860px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 1.5rem auto 0 auto;
    gap: 20px;
  }

  .pricing-section {
    padding: 60px 0;
  }

  .pricing-header h2 {
    font-size: 28px;
  }
}

.price-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 18px 20px;
  min-height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

/* Glowing top border on hover */
.price-card::before {
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

.price-card:hover::before {
  opacity: 1;
}

.price-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08);
  border-color: #2563EB;
}

.price-card .popular-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #2563EB;
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 12px;
}

.price-head h4 {
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #0F172A;
}

.price-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 12px;
}

.price-value .currency {
  font-size: 1.25rem;
  font-weight: 600;
  color: #64748B;
}

.price-value .amount {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  font-family: 'Inter', sans-serif;
}

.price-value .custom-price {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: 0;
}

.price-value .period {
  color: #64748B;
  font-size: 0.95rem;
  font-weight: 500;
}

.price-desc {
  color: #64748B;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.price-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.price-features li {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #374151;
}

.price-features .check-icon {
  color: #10b981;
}

.price-cta {
  margin-top: 12px;
  width: 100%;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 999px;
  font-weight: 700;
  border: 1px solid transparent;
  height: 48px;
  width: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  color: #ffffff;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1D4ED8, #2563EB);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #111827;
  border-color: #e5e7eb;
}

.btn-outline:hover {
  background: #F8FAFC;
  border-color: #2563EB;
  color: #2563EB;
}

.featured {
  border-width: 2px;
  border-color: #2563EB;
  box-shadow: 0 16px 40px rgba(37, 99, 235, 0.15);
}

.animate-fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-up 0.5s ease forwards;
}

@keyframes fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`}</style>
      <PricingSection />
    </>
  );
};

export default PricingSectionComponent;