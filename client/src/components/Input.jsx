import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, icon: Icon, type = "text", name, placeholder, error, required = false, ...props }, ref) => {
    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={name} className="form-label fw-medium small">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        <div className={Icon ? "auth-input-wrap" : ""}>
          {Icon && (
            <span className="auth-input-icon">
              <Icon size={16} />
            </span>
          )}
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`form-control auth-form-control ${error ? "is-invalid" : ""}`}
            {...props}
          />
        </div>

        {error && <div className="text-danger small mt-1">{error.message || error}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
