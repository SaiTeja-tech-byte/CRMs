import axios from "axios";

// Matches the pattern already used in Dashboard.jsx (API_BASE, no "/auth" suffix).
// Defensively strips a trailing "/auth" in case VITE_API_URL was set to
// match authService.js's convention instead of this file's — works either way.
const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

// Forces every GET here to skip the browser's HTTP cache and always hit the
// server fresh. Without this, a plain page refresh can silently reuse a
// cached response and show stale tasks until a full logout/login forces a
// genuinely new request.
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// ---- Employee: my own tasks (includes ones an admin assigned to me) ----

export const getMyTasks = async () => {
  // Cache-busting timestamp — guarantees a unique URL every call, so there's
  // nothing for the browser to serve from cache regardless of headers.
  const res = await axios.get(`${API_BASE}/tasks?_=${Date.now()}`, authHeaders());
  return res.data.tasks;
};

export const createMyTask = async (task) => {
  const res = await axios.post(`${API_BASE}/tasks`, task, authHeaders());
  return res.data.task;
};

export const updateMyTask = async (id, updates) => {
  const res = await axios.patch(`${API_BASE}/tasks/${id}`, updates, authHeaders());
  return res.data.task;
};

export const deleteMyTask = async (id) => {
  await axios.delete(`${API_BASE}/tasks/${id}`, authHeaders());
};

// ---- Admin: view/assign/delete tasks across every employee ----

export const adminGetAllTasks = async () => {
  const res = await axios.get(`${API_BASE}/admin/tasks`, authHeaders());
  return res.data.tasks;
};

// task: { targetType: "employee"|"department"|"all", employeeId, department,
//         title, description, priority, dueDate, dueTime, category, notes }
// Returns { count, tasks, task } — task/tasks depending on how many were created.
export const adminAssignTask = async (task) => {
  const res = await axios.post(`${API_BASE}/admin/tasks`, task, authHeaders());
  return res.data;
};

export const adminDeleteTask = async (id) => {
  await axios.delete(`${API_BASE}/admin/tasks/${id}`, authHeaders());
};

export const adminGetEmployees = async () => {
  const res = await axios.get(`${API_BASE}/admin/users`, authHeaders());
  return res.data.users;
};
