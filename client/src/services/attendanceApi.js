import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const tapIn = async () => {
  const res = await axios.post(`${API_BASE}/attendance/tap-in`, {}, authHeaders());
  return res.data.record;
};

export const tapOut = async () => {
  const res = await axios.post(`${API_BASE}/attendance/tap-out`, {}, authHeaders());
  return res.data.record;
};

export const getMyTodayAttendance = async () => {
  const res = await axios.get(`${API_BASE}/attendance/today`, authHeaders());
  return res.data.record;
};

// Admin only
export const getAllAttendance = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE}/attendance${params ? `?${params}` : ""}`, authHeaders());
  return res.data.records;
};
