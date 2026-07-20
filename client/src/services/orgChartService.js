import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Returns { tree, totalEmployees } — tree is an array of root nodes, each
// with a nested `children` array.
export const getOrgChart = async () => {
  const res = await axios.get(`${API_BASE}/org-chart?_=${Date.now()}`, authHeaders());
  return res.data;
};

// node: { name, title, department, email, phone, avatarUrl, parentId }
// parentId omitted/null adds a new top-of-chart box.
export const createOrgNode = async (node) => {
  const res = await axios.post(`${API_BASE}/org-chart`, node, authHeaders());
  return res.data.node;
};

// updates: any subset of { name, title, department, email, phone, avatarUrl, parentId }
export const updateOrgNode = async (id, updates) => {
  const res = await axios.patch(`${API_BASE}/org-chart/${id}`, updates, authHeaders());
  return res.data.node;
};

export const deleteOrgNode = async (id) => {
  const res = await axios.delete(`${API_BASE}/org-chart/${id}`, authHeaders());
  return res.data;
};
