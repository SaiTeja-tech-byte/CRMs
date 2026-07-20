import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// request: { type, startDate, endDate, reason }
export const createLeaveRequest = async (request) => {
  const res = await axios.post(`${API_BASE}/leave`, request, authHeaders());
  return res.data.leaveRequest;
};

export const getMyLeaveRequests = async () => {
  const res = await axios.get(`${API_BASE}/leave/mine`, authHeaders());
  return res.data.leaveRequests;
};

export const getMyLeaveBalance = async () => {
  const res = await axios.get(`${API_BASE}/leave/balance`, authHeaders());
  return res.data.balance;
};

// Admin only
export const getAllLeaveRequests = async (status) => {
  const res = await axios.get(`${API_BASE}/leave${status ? `?status=${status}` : ""}`, authHeaders());
  return res.data.leaveRequests;
};

export const updateLeaveRequestStatus = async (id, status, reviewNote) => {
  const res = await axios.patch(`${API_BASE}/leave/${id}`, { status, reviewNote }, authHeaders());
  return res.data.leaveRequest;
};
