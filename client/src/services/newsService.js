import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// params: { page, limit, sortBy, sortDir }
export const getNews = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/news`, { ...authHeaders(), params });
  return res.data;
};

export const createNews = async (newsData) => {
  const res = await axios.post(`${API_BASE}/news`, newsData, authHeaders());
  return res.data;
};

export const deleteNews = async (id) => {
  const res = await axios.delete(`${API_BASE}/news/${id}`, authHeaders());
  return res.data;
};
