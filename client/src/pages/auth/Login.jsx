import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, TrendingUp, Repeat, Users } from "lucide-react";

import { loginSchema } from "../../validations/authSchema";

import SplitAuthLayout from "../../components/SplitAuthLayout";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import GoogleButton from "../../components/GoogleButton";
import { loginUser, googleLogin } from "../../services/authService";

const Login = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", remember: false },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await loginUser({ email: data.email, password: data.password });
      navigate("/verify-otp", { state: { email: res.email, purpose: "login" } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (accessToken) => {
    setServerError("");
    try {
      const res = await googleLogin(accessToken);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Google sign-in failed.");
    }
  };

  return (
    <SplitAuthLayout
      leftBadge="Welcome back"
      leftTitle="Manage every deal in one place."
      leftSubtitle="Track contacts, deals, and follow-ups without losing the thread — pick up right where you left off."
      features={[
        { icon: TrendingUp, label: "Track deals in real time" },
        { icon: Repeat, label: "Automate follow-ups" },
        { icon: Users, label: "Collaborate with your team" },
      ]}
      testimonial={{
        label: "Trusted by sales teams",
        quote: "This CRM completely changed how we manage our pipeline.",
      }}
      rightBadge="System access"
      title="Sign in to your account"
      subtitle="Enter your credentials to access your dashboard."
      activeRole="employee"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email address"
          type="email"
          name="email"
          icon={Mail}
          placeholder="Enter your email"
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

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="remember" {...register("remember")} />
            <label className="form-check-label small text-muted" htmlFor="remember">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="auth-link small">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn-brand w-100 py-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            "Sign In"
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

        <p className="text-center small text-muted mt-3 mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </p>
      </form>
    </SplitAuthLayout>
  );
};

export default Login;
