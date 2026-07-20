import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/AuthLayout";
import PasswordInput from "../../components/PasswordInput";
import PasswordStrength from "../../components/PasswordStrength";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ token, newPassword });
      setSuccess(res.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout badge="Invalid link" title="Invalid link" subtitle="This reset link is missing its token.">
        <div className="text-center">
          <Link to="/forgot-password" className="auth-link">
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout badge="New password" title="Set a new password" subtitle="Choose something you haven't used before.">
      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="New password"
          name="newPassword"
          placeholder="Enter new password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {newPassword && <PasswordStrength password={newPassword} />}

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          placeholder="Confirm new password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <div className="text-danger small mb-2">{error}</div>}
        {success && <div className="text-success small mb-2">{success}</div>}

        <button type="submit" className="btn btn-brand w-100 py-2" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" role="status" /> : "Reset password"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
