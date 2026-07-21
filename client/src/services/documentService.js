import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getDocuments = async () => {
  const res = await axios.get(`${API_BASE}/documents`, authHeaders());
  return res.data.documents;
};

export const createDocument = async (doc) => {
  const res = await axios.post(`${API_BASE}/documents`, doc, authHeaders());
  return res.data.document;
};

export const deleteDocument = async (id) => {
  await axios.delete(`${API_BASE}/documents/${id}`, authHeaders());
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes, i = 0;
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
  return `${size.toFixed(1)} ${units[i]}`;
};
