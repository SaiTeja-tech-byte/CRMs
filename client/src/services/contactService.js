import axios from "axios";

const getApiBase = () => {
  const raw = import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api";
  return raw.replace(/\/+$/, "").replace(/\/auth$/, "");
};

const API_BASE = getApiBase();

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export const getContactQueries = async () => {
  const res = await axios.get(`${API_BASE}/contact?_=${Date.now()}`, authHeaders());
  return res.data.queries || [];
};

export const assignContactQuery = async (id, assignedToId) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/assign`, { assignedToId }, authHeaders());
  return res.data.query;
};

export const replyToContactQuery = async (id, reply) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/reply`, { reply }, authHeaders());
  return { ...res.data.query, emailWarning: res.data.emailWarning || null };
};

export const closeContactQuery = async (id) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/close`, {}, authHeaders());
  return res.data.query;
};
