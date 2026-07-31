import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const payrollService = {
  createPayroll: async (data) => {
    const response = await axios.post(`${API_BASE}/payroll`, data, authHeaders());
    return response.data;
  },
  
  getMyPayrolls: async () => {
    const response = await axios.get(`${API_BASE}/payroll/mine`, authHeaders());
    return response.data;
  },

  getAllPayrolls: async () => {
    const response = await axios.get(`${API_BASE}/payroll`, authHeaders());
    return response.data;
  },

  updatePayroll: async (id, data) => {
    const response = await axios.patch(`${API_BASE}/payroll/${id}`, data, authHeaders());
    return response.data;
  }
};

export default payrollService;