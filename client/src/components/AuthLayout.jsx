import { Link } from "react-router-dom";
import BackHomeButton from "./BackHomeButton";
import Badge from "./Badge";

const AuthLayout = ({ badge, title, subtitle, children }) => {
  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div className="auth-logo-badge">C</div>
          <span className="fw-bold text-dark">CRM Platform</span>
        </Link>
        <BackHomeButton />
      </div>

      <div className="d-flex justify-content-center px-3 pb-5 pt-2">
        <div className="auth-card w-100" style={{ maxWidth: "440px" }}>
          {badge && (
            <div className="d-flex justify-content-center mb-3">
              <Badge>{badge}</Badge>
            </div>
          )}
          {title && <h1 className="text-center fw-bold h4 mb-1">{title}</h1>}
          {subtitle && <p className="text-center text-muted small mb-0">{subtitle}</p>}

          <div className={title || subtitle || badge ? "mt-4" : ""}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
