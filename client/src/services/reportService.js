import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const reportService = {
  getAttendanceReport: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/attendance`, {
      ...authHeaders(),
      params,
    });
    return response.data;
  },

  downloadAttendanceCsv: async (params = {}) => {
    const response = await axios.get(`${API_BASE}/reports/attendance`, {
      ...authHeaders(),
      params: { ...params, format: "csv" },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendance-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default reportService;
