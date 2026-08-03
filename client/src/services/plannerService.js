import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const createRegularizationRequest = async (request) => {
  const res = await axios.post(`${API_BASE}/planner/request`, request, authHeaders());
  return res.data.request;
};

export const getMyRegularizationRequests = async () => {
  const res = await axios.get(`${API_BASE}/planner/mine`, authHeaders());
  return res.data.requests;
};

export const getMyAttendance = async (month, year) => {
  const res = await axios.get(`${API_BASE}/planner/attendance?month=${month}&year=${year}`, authHeaders());
  return res.data;
};

// Admin only
export const getAllRegularizationRequests = async (status) => {
  const res = await axios.get(`${API_BASE}/planner${status ? `?status=${status}` : ""}`, authHeaders());
  return res.data.requests;
};

export const updateRegularizationStatus = async (id, status, reviewNote) => {
  const res = await axios.patch(`${API_BASE}/planner/${id}`, { status, reviewNote }, authHeaders());
  return res.data.request;
};
