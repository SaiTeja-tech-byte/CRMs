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

// attachment: optional { url, name, type } — url is a base64 data: URL
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

// Powers the unread badge next to "Chat" in the sidebar.
export const getUnreadCount = async () => {
  const res = await axios.get(`${API_BASE}/chat/unread-count?_=${Date.now()}`, authHeaders());
  return res.data; // { unreadMessages, pendingRequests, total }
};

export const editMessage = async (messageId, message) => {
  const res = await axios.put(`${API_BASE}/chat/messages/${messageId}`, { message }, authHeaders());
  return res.data.chatMessage;
};

export const deleteMessage = async (messageId) => {
  const res = await axios.delete(`${API_BASE}/chat/messages/${messageId}`, authHeaders());
  return res.data;
};

// ---- Group chat ----

export const createGroup = async (groupName, groupDescription, memberIds) => {
  const res = await axios.post(
    `${API_BASE}/chat/groups`,
    { groupName, groupDescription, memberIds },
    authHeaders()
  );
  return res.data.group;
};

export const getMyGroups = async () => {
  const res = await axios.get(`${API_BASE}/chat/groups?_=${Date.now()}`, authHeaders());
  return res.data.groups;
};

export const getGroupMessages = async (groupId) => {
  const res = await axios.get(`${API_BASE}/chat/groups/${groupId}/messages?_=${Date.now()}`, authHeaders());
  return res.data.messages;
};

export const sendGroupMessage = async (groupId, message, attachment) => {
  const res = await axios.post(
    `${API_BASE}/chat/groups/${groupId}/messages`,
    {
      message,
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
      attachmentType: attachment?.type,
    },
    authHeaders()
  );
  return res.data.chatMessage;
};

export const editGroup = async (groupId, groupName, groupDescription) => {
  const res = await axios.put(`${API_BASE}/chat/groups/${groupId}`, { groupName, groupDescription }, authHeaders());
  return res.data.group;
};

export const addGroupMembers = async (groupId, memberIds) => {
  const res = await axios.post(`${API_BASE}/chat/groups/${groupId}/members`, { memberIds }, authHeaders());
  return res.data.group;
};

export const removeGroupMember = async (groupId, userId) => {
  const res = await axios.delete(`${API_BASE}/chat/groups/${groupId}/members/${userId}`, authHeaders());
  return res.data;
};

export const deleteGroup = async (groupId) => {
  const res = await axios.delete(`${API_BASE}/chat/groups/${groupId}`, authHeaders());
  return res.data;
};

// WhatsApp-style "search in this chat" — returns every matching message
// (chronological) so the UI can highlight + step through them.
export const searchMessages = async (conversationId, keyword) => {
  const res = await axios.get(
    `${API_BASE}/chat/search?conversationId=${encodeURIComponent(conversationId)}&keyword=${encodeURIComponent(keyword)}`,
    authHeaders()
  );
  return res.data.matches;
};
