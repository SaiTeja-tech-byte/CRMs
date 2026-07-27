import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export const submitFeedback = async (feedbackData) => {
  const res = await axios.post(`${API_BASE}/feedback`, feedbackData, authHeaders());
  return res.data;
};

export const getAllFeedback = async () => {
  const res = await axios.get(`${API_BASE}/feedback?_=${Date.now()}`, authHeaders());
  return res.data.feedbacks;
};

export const updateFeedbackStatus = async (feedbackId, status) => {
  const res = await axios.patch(`${API_BASE}/feedback/${feedbackId}/status`, { status }, authHeaders());
  return res.data.feedback;
};
