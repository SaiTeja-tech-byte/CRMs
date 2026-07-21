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

export const sendMessage = async (conversationId, message, attachment) => {
  const res = await axios.post(
    `${API_BASE}/chat/messages`,
    {
      conversationId,
      message,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
    },
    authHeaders()
  );
  return res.data.chatMessage;
};

export const markConversationRead = async (conversationId) => {
  const res = await axios.patch(`${API_BASE}/chat/conversations/${conversationId}/read`, {}, authHeaders());
  return res.data;
};

export const editMessage = async (messageId, message) => {
  const res = await axios.patch(`${API_BASE}/chat/messages/${messageId}`, { message }, authHeaders());
  return res.data.chatMessage;
};

export const deleteMessage = async (messageId) => {
  const res = await axios.delete(`${API_BASE}/chat/messages/${messageId}`, authHeaders());
  return res.data.chatMessage;
};

export const getUnreadCount = async () => {
  const res = await axios.get(`${API_BASE}/chat/unread-count?_=${Date.now()}`, authHeaders());
  return res.data;
};
