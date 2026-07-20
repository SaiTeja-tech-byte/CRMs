import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import BackHomeButton from "./BackHomeButton";
import Badge from "./Badge";

const SplitAuthLayout = ({
  leftBadge,
  leftTitle,
  leftSubtitle,
  features = [],
  testimonial,
  rightBadge,
  title,
  subtitle,
  activeRole,
  children,
}) => {
  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div className="auth-logo-badge">C</div>
          <span className="fw-bold text-dark">CRM Platform</span>
        </Link>
        <BackHomeButton />
      </div>

      <div className="container pb-5 pt-2">
        <div className="row justify-content-center align-items-center g-4 g-lg-5">
          {/* Left marketing panel - hidden below lg, like the original */}
          <div className="col-lg-6 d-none d-lg-block">
            {leftBadge && <Badge>{leftBadge}</Badge>}
            <h1 className="fw-bold mt-3" style={{ fontSize: "2.25rem", lineHeight: 1.2 }}>
              {leftTitle}
            </h1>
            {leftSubtitle && <p className="text-muted mt-3" style={{ maxWidth: "420px" }}>{leftSubtitle}</p>}

            {features.length > 0 && (
              <div className="mt-4">
                {features.map((f) => (
                  <div key={f.label} className="auth-feature-row">
                    <div className="auth-feature-icon">
                      <f.icon size={16} />
                    </div>
                    <span className="fw-medium">{f.label}</span>
                  </div>
                ))}
              </div>
            )}

            {testimonial && (
              <div className="auth-testimonial mt-4">
                <div className="d-flex align-items-center gap-2 text-primary small fw-semibold text-uppercase" style={{ letterSpacing: "0.05em" }}>
                  <Shield size={14} />
                  {testimonial.label}
                </div>
                <p className="fst-italic text-muted small mt-2 mb-0">"{testimonial.quote}"</p>
              </div>
            )}
          </div>

          {/* Right form card */}
          <div className="col-12 col-md-8 col-lg-5">
            <div className="auth-card">
              {activeRole && (
                <div className="auth-role-toggle">
                  <Link
                    to="/login"
                    className={`auth-role-btn ${activeRole === "employee" ? "active" : ""}`}
                  >
                    Employee Login
                  </Link>
                  <Link
                    to="/admin/login"
                    className={`auth-role-btn ${activeRole === "admin" ? "active" : ""}`}
                  >
                    Admin Login
                  </Link>
                </div>
              )}
              {rightBadge && <Badge>{rightBadge}</Badge>}
              {title && <h2 className={`fw-bold h4 ${rightBadge ? "mt-3" : ""}`}>{title}</h2>}
              {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
              <div className={title || subtitle || rightBadge ? "mt-4" : ""}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitAuthLayout;
