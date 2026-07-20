import axios from "axios";

// Defensively strips a trailing "/auth" first (in case VITE_API_URL is set
// to end in "/auth", which your deployed Render env currently does), THEN
// appends "/auth" exactly once — works correctly whichever way the env var
// is set, instead of assuming one format and silently doubling the path.
const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE = RAW_BASE.replace(/\/auth\/?$/, "");
const API = `${API_BASE}/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API}/login`, credentials);
  return response.data;
};

export const adminLoginUser = async (credentials) => {
  const response = await axios.post(`${API}/admin/login`, credentials);
  return response.data;
};

export const verifyOtp = async ({ email, otp, purpose }) => {
  const response = await axios.post(`${API}/verify-otp`, { email, otp, purpose });
  return response.data;
};

export const resendOtp = async ({ email, purpose }) => {
  const response = await axios.post(`${API}/resend-otp`, { email, purpose });
  return response.data;
};

export const googleLogin = async (accessToken) => {
  const response = await axios.post(`${API}/google`, { accessToken });
  return response.data;
};

export const adminGoogleLogin = async (accessToken) => {
  const response = await axios.post(`${API}/google`, { accessToken, isAdminLogin: true });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async ({ token, newPassword }) => {
  const response = await axios.post(`${API}/reset-password`, { token, newPassword });
  return response.data;
};