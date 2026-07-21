import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getOrgChart = async () => {
  const res = await axios.get(`${API_BASE}/org-chart?_=${Date.now()}`, authHeaders());
  return res.data;
};

export const createOrgNode = async (node) => {
  const res = await axios.post(`${API_BASE}/org-chart`, node, authHeaders());
  return res.data.node;
};

export const updateOrgNode = async (id, updates) => {
  const res = await axios.patch(`${API_BASE}/org-chart/${id}`, updates, authHeaders());
  return res.data.node;
};

export const deleteOrgNode = async (id) => {
  const res = await axios.delete(`${API_BASE}/org-chart/${id}`, authHeaders());
  return res.data;
};
