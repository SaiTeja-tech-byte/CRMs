import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export const sendChatRequest = async (receiverId) => {
  const res = await axios.post(`${API_BASE}/chat/request`, { receiverId }, authHeaders());
  return res.data;
};

export const getIncomingRequests = async () => {
  const res = await axios.get(`${API_BASE}/chat/requests?_=${Date.now()}`, authHeaders());
  return res.data.requests;
};

export const acceptChatRequest = async (requestId) => {
  const res = await axios.post(`${API_BASE}/chat/request/${requestId}/accept`, {}, authHeaders());
  return res.data;
};

export const declineChatRequest = async (requestId) => {
  const res = await axios.post(`${API_BASE}/chat/request/${requestId}/decline`, {}, authHeaders());
  return res.data;
};

export const getConversations = async () => {
  const res = await axios.get(`${API_BASE}/chat/conversations?_=${Date.now()}`, authHeaders());
  return res.data.conversations;
};

export const getMessages = async (conversationId) => {
  const res = await axios.get(`${API_BASE}/chat/messages/${conversationId}?_=${Date.now()}`, authHeaders());
  return res.data.messages;
};

export const sendMessage = async (conversationId, message) => {
  const res = await axios.post(`${API_BASE}/chat/messages`, { conversationId, message }, authHeaders());
  return res.data.chatMessage;
};
