import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// POST /api/contact — PUBLIC, no auth. Used by the public contact form
// (no Authorization header sent, since a visitor isn't logged in).
export const submitContactQuery = async ({ name, email, phone, company, message }) => {
  const res = await axios.post(`${API_BASE}/contact`, { name, email, phone, company, message });
  return res.data;
};

// GET /api/contact — admin only
export const getContactQueries = async () => {
  const res = await axios.get(`${API_BASE}/contact`, authHeaders());
  return res.data.queries;
};

// GET /api/contact/unread-count — admin only, powers the sidebar badge
export const getContactUnreadCount = async () => {
  const res = await axios.get(`${API_BASE}/contact/unread-count?_=${Date.now()}`, authHeaders());
  return res.data.count;
};

// PATCH /api/contact/:id/read — admin only
export const markQueryRead = async (id) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/read`, {}, authHeaders());
  return res.data.query;
};

// PATCH /api/contact/:id/assign  body: { assignedToId }
export const assignContactQuery = async (id, assignedToId) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/assign`, { assignedToId }, authHeaders());
  return res.data.query;
};

// PATCH /api/contact/:id/reply  body: { reply }
// Returns the updated query — may also carry `emailWarning` if the reply
// saved fine but the email to the customer failed to send (see
// contactController.js's replyToQuery, which treats that as non-fatal).
export const replyToContactQuery = async (id, reply) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/reply`, { reply }, authHeaders());
  return { ...res.data.query, emailWarning: res.data.emailWarning };
};

// PATCH /api/contact/:id/close
export const closeContactQuery = async (id) => {
  const res = await axios.patch(`${API_BASE}/contact/${id}/close`, {}, authHeaders());
  return res.data.query;
};
