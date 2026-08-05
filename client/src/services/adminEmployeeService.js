import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const adminEmployeeService = {
  getEmployees: async (params) => {
    const response = await axios.get(`${API_BASE}/admin/users`, {
      ...authHeaders(),
      params
    });
    return response.data;
  },
  
  getEmployeeProfile: async (id) => {
    const response = await axios.get(`${API_BASE}/admin/users/${id}`, authHeaders());
    return response.data;
  },
  
  createEmployee: async (data) => {
    const response = await axios.post(`${API_BASE}/admin/users`, data, authHeaders());
    return response.data;
  },
  
  updateEmployee: async (id, data) => {
    const response = await axios.patch(`${API_BASE}/admin/users/${id}`, data, authHeaders());
    return response.data;
  },
  
  bulkUpdateEmployees: async (data) => {
    const response = await axios.put(`${API_BASE}/admin/users/bulk`, data, authHeaders());
    return response.data;
  }
};

export default adminEmployeeService;
