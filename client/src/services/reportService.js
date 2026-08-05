import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const getParams = (params) => {
  // Remove empty keys
  const clean = {};
  for (const k in params) {
    if (params[k] !== undefined && params[k] !== null && params[k] !== "") {
      clean[k] = params[k];
    }
  }
  return clean;
};

const reportService = {
  getAttendanceReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/attendance`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
  getPayrollReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/payroll`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
  getExpensesReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/expenses`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
  getHelpCenterReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/help-center`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
  getTasksReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/tasks`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
  getEmployeesReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/employees`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
  getOrganizationReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/organization`, { ...authHeaders(), params: getParams(params) });
    return response.data;
  },
};

export default reportService;
