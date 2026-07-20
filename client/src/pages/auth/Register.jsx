import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Briefcase, Mail, Clock, Lock, CheckCircle } from "lucide-react";

import { registerSchema } from "../../validations/authSchema";

import SplitAuthLayout from "../../components/SplitAuthLayout";
import Input from "../../components/Input";
import PasswordInput from "../../components/PasswordInput";
import PasswordStrength from "../../components/PasswordStrength";
import GoogleButton from "../../components/GoogleButton";
import { registerUser, googleLogin } from "../../services/authService";

const Register = () => {
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await registerUser({
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        password: data.password,
      });
      navigate("/verify-otp", { state: { email: res.email, purpose: "signup" } });
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
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
      leftBadge="Get started"
      leftTitle="Set up your workspace in minutes."
      leftSubtitle="Bring your team, your pipeline, and your contacts into one place built for how sales actually works."
      features={[
        { icon: Clock, label: "Live in under 5 minutes" },
        { icon: Lock, label: "Secured with 2FA by default" },
        { icon: CheckCircle, label: "No credit card required" },
      ]}
      testimonial={{
        label: "Trusted by growing teams",
        quote: "Setup took minutes and the whole team was onboarded the same day.",
      }}
      rightBadge="Create account"
      title="Create your account"
      subtitle="Set up your workspace in a couple of minutes."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-6">
            <Input
              label="Full name"
              name="fullName"
              icon={User}
              placeholder="Full name"
              required
              error={errors.fullName}
              {...register("fullName")}
            />
          </div>
          <div className="col-6">
            <Input
              label="Company"
              name="companyName"
              icon={Briefcase}
              placeholder="Company"
              error={errors.companyName}
              {...register("companyName")}
            />
          </div>
        </div>

        <Input
          label="Work email"
          type="email"
          name="email"
          icon={Mail}
          placeholder="Work email"
          required
          error={errors.email}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Password"
          required
          error={errors.password}
          {...register("password", { onChange: (e) => setPassword(e.target.value) })}
        />
        {password && <PasswordStrength password={password} />}

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
          error={errors.confirmPassword}
          {...register("confirmPassword")}
        />

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="terms" {...register("terms")} />
          <label className="form-check-label small text-muted" htmlFor="terms">
            I agree to the <span className="fw-medium text-dark">Terms</span> and{" "}
            <span className="fw-medium text-dark">Privacy Policy</span>
          </label>
        </div>
        {errors.terms && <div className="text-danger small mb-2">{errors.terms.message}</div>}

        <button type="submit" className="btn btn-brand w-100 py-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            "Create account"
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
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </form>
    </SplitAuthLayout>
  );
};

export default Register;
