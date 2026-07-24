import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getNotifications = async () => {
  const res = await axios.get(`${API_BASE}/notifications`, authHeaders());
  return res.data.notifications;
};

export const getUnreadNotificationCount = async (type) => {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  const res = await axios.get(`${API_BASE}/notifications/unread-count${query}`, authHeaders());
  return res.data.count;
};

export const markNotificationRead = async (id) => {
  const res = await axios.patch(`${API_BASE}/notifications/${id}/read`, {}, authHeaders());
  return res.data.notification;
};

export const markAllNotificationsRead = async (type) => {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  await axios.patch(`${API_BASE}/notifications/read-all${query}`, {}, authHeaders());
};
