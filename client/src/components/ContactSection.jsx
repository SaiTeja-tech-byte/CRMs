import React, { useState } from "react";

const getApiBase = () => {
  const raw = import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api";
  return raw.replace(/\/+$/, "").replace(/\/auth$/, "");
};

const API_BASE = getApiBase();

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <>
        <style>{`.contact-section {
  padding: 80px 0;
  background: #ffffff;
}

.contact-container {
  max-width: 960px;
  margin: 0 auto;
}

.contact-header {
  text-align: center;
  margin-bottom: 48px;
}

.contact-header h2 {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
}

.contact-subheader {
  font-size: 16px;
  color: #64748b;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  align-items: start;
}

/* Left Column: Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item span {
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.info-item a, .info-item p {
  font-size: 16px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition: color 200ms ease;
}

.info-item a:hover {
  color: #2563eb;
}

/* Right Column: Form */
.contact-form-wrap {
  background: #ffffff;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact-form .form-group input, 
.contact-form .form-group textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 200ms ease, box-shadow 200ms ease;
  font-family: inherit;
}

.contact-form .form-group input:focus, 
.contact-form .form-group textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.contact-submit-btn {
  align-self: flex-start;
  padding: 12px 28px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 200ms ease;
}

.contact-submit-btn:hover {
  background: #1d4ed8;
}

/* Success State */
.contact-success {
  padding: 32px 24px;
  border: 1px solid #dcfce7;
  background: #f0fdf4;
  border-radius: 12px;
  text-align: center;
}

.contact-success h4 {
  font-size: 18px;
  color: #15803d;
  margin-bottom: 8px;
  font-weight: 700;
}

.contact-success p {
  font-size: 14px;
  color: #166534;
}

/* Responsiveness */
@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

@media (max-width: 480px) {
  .contact-submit-btn {
    width: 100%;
    text-align: center;
  }
}
`}</style>
    <section className="contact-section" id="contact">
      <div className="container contact-container">
        <div className="contact-header">
          <h2>Get in touch</h2>
          <p className="contact-subheader">
            Have questions about CRM Platform? Drop us a line and our team will get back to you shortly.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Simple Contact Info */}
          <div className="contact-info">
            <div className="info-item">
              <span>Email</span>
              <a href="mailto:hello@crmplatform.com">hello@crmplatform.com</a>
            </div>
            <div className="info-item">
              <span>Phone</span>
              <a href="tel:+919876543210">+91 98765 43210</a>
            </div>
            <div className="info-item">
              <span>Location</span>
              <p>Hyderabad, Telangana, India</p>
            </div>
          </div>

          {/* Right Column: Short Contact Form */}
          <div className="contact-form-wrap">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Work Email"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    rows="4"
                    required
                  ></textarea>
                </div>
                {error && (
                  <p style={{ color: "#dc2626", fontSize: "14px", marginBottom: "12px" }}>{error}</p>
                )}
                <button type="submit" className="primary-btn contact-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            ) : (
              <div className="contact-success">
                <h4>Message Sent!</h4>
                <p>Thank you. We will get back to you within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  
      </>);
};

export default ContactSection;
