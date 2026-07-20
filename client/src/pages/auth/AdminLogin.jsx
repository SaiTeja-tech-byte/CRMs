import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck, Lock as LockIcon, Users as UsersIcon } from "lucide-react";

import { loginSchema } from "../../validations/authSchema";

import SplitAuthLayout from "../../components/SplitAuthLayout";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import GoogleButton from "../../components/GoogleButton";
import { adminLoginUser, googleLogin } from "../../services/authService";

const AdminLogin = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await adminLoginUser({ email: data.email, password: data.password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/admin/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (accessToken) => {
    setServerError("");
    try {
      const res = await googleLogin(accessToken, true);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/admin/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "This account does not have admin access.");
    }
  };

  return (
    <SplitAuthLayout
      leftBadge="Admin access"
      leftTitle="Manage your organization's workspace."
      leftSubtitle="Oversee users, permissions, and company-wide settings from a single, secured control panel."
      features={[
        { icon: ShieldCheck, label: "Restricted to authorized admins" },
        { icon: UsersIcon, label: "Manage employee accounts" },
        { icon: LockIcon, label: "Every session verified with 2FA" },
      ]}
      rightBadge="Admin login"
      title="Sign in as admin"
      subtitle="This login is for administrators only."
      activeRole="admin"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Admin email"
          type="email"
          name="email"
          icon={Mail}
          placeholder="Enter your admin email"
          required
          error={errors.email}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          required
          error={errors.password}
          {...register("password")}
        />

        <button type="submit" className="btn btn-brand w-100 py-2 mt-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            "Sign in"
          )}
        </button>

        {serverError && <div className="text-danger small text-center mt-3">{serverError}</div>}

        <div className="d-flex align-items-center gap-2 my-3">
          <hr className="flex-fill m-0" />
          <span className="small text-muted">or</span>
          <hr className="flex-fill m-0" />
        </div>

        <GoogleButton
          onSuccess={handleGoogleSuccess}
          onError={() => setServerError("Google sign-in failed.")}
        />
      </form>
    </SplitAuthLayout>
  );
};

export default AdminLogin;
