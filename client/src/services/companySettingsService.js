import axios from "axios";

// Defensively strips a trailing "/auth" in case VITE_API_URL was set to
// match authService.js's convention instead of this file's — works either way.
const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getCompanySettings = async () => {
  const res = await axios.get(`${API_BASE}/company-settings`, authHeaders());
  return res.data.settings;
};

export const updateCompanySettings = async (updates) => {
  const res = await axios.put(`${API_BASE}/company-settings`, updates, authHeaders());
  return res.data.settings;
};
