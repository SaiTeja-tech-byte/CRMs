import axios from "axios";

// Defensively strips a trailing "/auth" in case VITE_API_URL was set to
// match authService.js's convention instead of this file's — works either way.
const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ---- Employee: my own calendar (includes admin-assigned events) ----

export const getMyEvents = async () => {
  const res = await axios.get(`${API_BASE}/events`, authHeaders());
  return res.data.events;
};

export const createMyEvent = async (event) => {
  const res = await axios.post(`${API_BASE}/events`, event, authHeaders());
  return res.data.event;
};

export const updateMyEvent = async (id, updates) => {
  const res = await axios.patch(`${API_BASE}/events/${id}`, updates, authHeaders());
  return res.data.event;
};

export const deleteMyEvent = async (id) => {
  await axios.delete(`${API_BASE}/events/${id}`, authHeaders());
};

// ---- Admin: view/assign/delete events across every employee ----

export const adminGetAllEvents = async () => {
  const res = await axios.get(`${API_BASE}/admin/events`, authHeaders());
  return res.data.events;
};

// event: { targetType: "employee"|"department"|"all", employeeId, department,
//          title, description, type, date, startTime, endTime, location, priority }
// Returns { count, events, event } — event/events depending on how many were created.
export const adminAssignEvent = async (event) => {
  const res = await axios.post(`${API_BASE}/admin/events`, event, authHeaders());
  return res.data;
};

export const adminDeleteEvent = async (id) => {
  await axios.delete(`${API_BASE}/admin/events/${id}`, authHeaders());
};
