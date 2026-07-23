import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// ---- Employee: my own tasks (includes ones an admin assigned to me) ----

export const getMyTasks = async () => {
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

// params: { page, limit, sortBy, sortDir }
export const adminGetAllTasks = async (params = {}) => {
  const res = await axios.get(`${API_BASE}/admin/tasks`, { ...authHeaders(), params });
  return { tasks: res.data.tasks, pagination: res.data.pagination };
};

export const adminAssignTask = async (task) => {
  const res = await axios.post(`${API_BASE}/admin/tasks`, task, authHeaders());
  return res.data;
};

export const adminDeleteTask = async (id) => {
  await axios.delete(`${API_BASE}/admin/tasks/${id}`, authHeaders());
};

// Used to populate "assign to employee" dropdowns — needs the full roster,
// not a paginated page, so this explicitly asks for a high limit.
export const adminGetEmployees = async () => {
  const res = await axios.get(`${API_BASE}/admin/users`, { ...authHeaders(), params: { limit: 1000 } });
  return res.data.users;
};
