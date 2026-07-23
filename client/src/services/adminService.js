import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAdminStats = async () => {
  const res = await axios.get(`${API_BASE}/admin/stats`, authHeaders());
  return res.data.stats;
};

// params: { page, limit, sortBy, sortDir, search, department, role, employmentStatus }
export const getAdminUsers = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/admin/users`, { ...authHeaders(), params });
  return { users: res.data.users, pagination: res.data.pagination };
};

export const updateAdminUser = async (id, updates) => {
  const res = await axios.patch(`${API_BASE}/admin/users/${id}`, updates, authHeaders());
  return res.data.user;
};

export const createAdminUser = async (newMember) => {
  const res = await axios.post(`${API_BASE}/admin/users`, newMember, authHeaders());
  return res.data;
};
