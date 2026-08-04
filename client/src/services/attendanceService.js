import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const attendanceService = {
  tapIn: async () => {
    const response = await axios.post(`${API_BASE}/attendance/tap-in`, {}, authHeaders());
    return response.data;
  },
  takeBreak: async () => {
    const response = await axios.put(`${API_BASE}/attendance/break`, {}, authHeaders());
    return response.data;
  },
  resume: async () => {
    const response = await axios.put(`${API_BASE}/attendance/resume`, {}, authHeaders());
    return response.data;
  },
  tapOut: async () => {
    const response = await axios.put(`${API_BASE}/attendance/tap-out`, {}, authHeaders());
    return response.data;
  },
  getToday: async () => {
    const response = await axios.get(`${API_BASE}/attendance/today`, authHeaders());
    return response.data;
  },
  getHistory: async () => {
    const response = await axios.get(`${API_BASE}/attendance/history`, authHeaders());
    return response.data;
  },
  getAllAttendance: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/attendance/all`, {
      ...authHeaders(),
      params
    });
    return response.data;
  }
};

export default attendanceService;
