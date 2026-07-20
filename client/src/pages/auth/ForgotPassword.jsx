import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";

import { forgotPasswordSchema } from "../../validations/authSchema";

import AuthLayout from "../../components/AuthLayout";
import Input from "../../components/Input";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setServerMessage("");
    setServerError("");
    try {
      const res = await forgotPassword(data.email);
      setServerMessage(res.message);
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <AuthLayout
      badge="Reset password"
      title="Reset your password"
      subtitle="Enter your account email and we'll send a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          name="email"
          icon={Mail}
          placeholder="Enter your email"
          required
          error={errors.email}
          {...register("email")}
        />

        <button type="submit" className="btn btn-brand w-100 py-2" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner-border spinner-border-sm" role="status" /> : "Send reset link"}
        </button>

        {serverMessage && <div className="text-success small text-center mt-3">{serverMessage}</div>}
        {serverError && <div className="text-danger small text-center mt-3">{serverError}</div>}

        <p className="text-center small text-muted mt-3 mb-0">
          Remember your password?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
