import { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = forwardRef(
  ({ label, name, placeholder, error, required = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="mb-3">
        {label && (
          <label htmlFor={name} className="form-label fw-medium small">
            {label}
            {required && <span className="text-danger ms-1">*</span>}
          </label>
        )}

        <div className="auth-input-wrap">
          <span className="auth-input-icon">
            <Lock size={16} />
          </span>
          <input
            ref={ref}
            id={name}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            className={`form-control auth-form-control ${error ? "is-invalid" : ""}`}
            style={{ paddingRight: "2.5rem" }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            className="auth-toggle-eye"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <div className="text-danger small mt-1">{error.message || error}</div>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
