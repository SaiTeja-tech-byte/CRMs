import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getDashboardStats = async () => {
  const res = await axios.get(`${API_BASE}/dashboard/stats`, authHeaders());
  return res.data.stats;
};
