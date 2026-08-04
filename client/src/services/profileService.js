import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getMyProfile = async () => {
  const res = await axios.get(`${API_BASE}/profile`, authHeaders());
  return res.data.profile;
};

export const updateMyProfile = async (updates) => {
  const res = await axios.patch(`${API_BASE}/profile`, updates, authHeaders());
  return res.data.profile;
};

export const deleteMyAccount = async () => {
  const res = await axios.delete(`${API_BASE}/profile`, authHeaders());
  return res.data;
};
