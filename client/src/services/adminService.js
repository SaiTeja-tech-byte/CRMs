import axios from "axios";

// Defensively strips a trailing "/auth" in case VITE_API_URL was set to
// match authService.js's convention instead of this file's — works either way.
const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAdminStats = async () => {
  const res = await axios.get(`${API_BASE}/admin/stats`, authHeaders());
  return res.data.stats;
};

export const getAdminUsers = async () => {
  const res = await axios.get(`${API_BASE}/admin/users`, authHeaders());
  return res.data.users;
};

// updates: any subset of { role, employmentStatus, designation, department, officeLocation, reportingManager }
export const updateAdminUser = async (id, updates) => {
  const res = await axios.patch(`${API_BASE}/admin/users/${id}`, updates, authHeaders());
  return res.data.user;
};

// newMember: { firstName, lastName, email, phone, employeeId, department, designation, role, manager, officeLocation }
// Returns { user, tempPassword } — tempPassword is shown once so the admin can share it.
export const createAdminUser = async (newMember) => {
  const res = await axios.post(`${API_BASE}/admin/users`, newMember, authHeaders());
  return res.data;
};
