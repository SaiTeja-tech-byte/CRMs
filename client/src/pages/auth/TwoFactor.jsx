import { useState, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout";
import { verifyOtp, resendOtp } from "../../services/authService";

const OTP_LENGTH = 6;

const TwoFactor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, purpose } = location.state || {};

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const focusInput = (index) => inputRefs.current[index]?.focus();

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    const next = [...digits];
    next[index] = clean ? clean[clean.length - 1] : "";
    setDigits(next);
    if (clean && index < OTP_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const otp = digits.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== OTP_LENGTH) {
      setError("Enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp, purpose });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setSuccess("Verified — signing you in");
      const destination = res.user?.role === "admin" ? "/admin/dashboard" : "/dashboard";
      setTimeout(() => navigate(destination), 700);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    try {
      await resendOtp({ email, purpose });
      setSuccess("A new code is on its way.");
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code.");
    }
  };

  return (
    <AuthLayout
      badge="Verify identity"
      title="Enter verification code"
      subtitle={`We sent a 6-digit code to ${email}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between gap-2 mb-3" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-box"
            />
          ))}
        </div>

        {error && <div className="text-danger small mb-2">{error}</div>}
        {success && <div className="text-success small mb-2">{success}</div>}

        <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" role="status" /> : "Verify and continue"}
        </button>

        <p className="text-center small text-muted mt-3 mb-0">
          Didn't get a code?{" "}
          <button type="button" onClick={handleResend} className="btn btn-link p-0 auth-link small">
            Resend
          </button>
        </p>
      </form>
    </AuthLayout>
  );
};

export default TwoFactor;
