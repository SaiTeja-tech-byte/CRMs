import { useState, useEffect, useRef, useCallback } from "react";
import { Send, UserPlus, Check, X, MessageCircle } from "lucide-react";

import {
  sendChatRequest,
  getIncomingRequests,
  acceptChatRequest,
  declineChatRequest,
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
} from "../services/chatService";
import { connectSocket, onSocketEvent } from "../services/socketService";

const currentUser = JSON.parse(localStorage.getItem("user") || "null");

const ChatPage = () => {
  const [team, setTeam] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [showStartChat, setShowStartChat] = useState(false);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const API_BASE = (import.meta.env.VITE_API_URL || "https://crms-1.onrender.com/api").replace(/\/auth\/?$/, "");

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const data = await getIncomingRequests();
      setRequests(data || []);
    } catch (err) {
      console.error("Failed to load chat requests:", err);
    }
  }, []);

  const loadTeam = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/team`, {
        headers: { Authorization: `Bearer ${token}`, "Cache-Control": "no-cache" },
      });
      const data = await res.json();
      if (data.success) {
        setTeam((data.users || []).filter((u) => u.id !== currentUser?.id));
      }
    } catch (err) {
      console.error("Failed to load team:", err);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    loadConversations();
    loadRequests();
    loadTeam();
    connectSocket();
  }, [loadConversations, loadRequests, loadTeam]);

  // Live updates via socket
  useEffect(() => {
    const unsubscribers = [
      onSocketEvent("chat:request-received", () => loadRequests()),
      onSocketEvent("chat:request-accepted", () => loadConversations()),
      onSocketEvent("chat:conversation-started", () => loadConversations()),
      onSocketEvent("chat:message-received", ({ message, conversationId }) => {
        loadConversations();
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) => [...prev, message]);
          }
          return current;
        });
      }),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [loadConversations, loadRequests]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (conversation) => {
    setActiveConversation(conversation);
    try {
      const data = await getMessages(conversation.id);
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const res = await sendChatRequest(userId);
      setShowStartChat(false);
      if (res.conversation) {
        loadConversations();
        openConversation(res.conversation);
      } else if (res.alreadyPending) {
        alert("You already have a pending request with this person.");
      } else {
        alert("Chat request sent — waiting for them to accept.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not start chat.");
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await acceptChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      loadConversations();
      if (res.conversation) openConversation(res.conversation);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declineChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || !activeConversation) return;
    const text = draft.trim();
    setDraft("");
    try {
      const message = await sendMessageApi(activeConversation.id, text);
      setMessages((prev) => [...prev, message]);
      loadConversations();
    } catch (err) {
      alert("Message failed to send.");
    }
  };

  return (
    <div className="d-flex" style={{ height: "calc(100vh - 80px)" }}>
      {/* Sidebar */}
      <div className="border-end" style={{ width: "320px", overflowY: "auto" }}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <h6 className="fw-bold m-0">Chats</h6>
          <button
            className="btn btn-sm btn-brand d-flex align-items-center gap-1"
            onClick={() => setShowStartChat(true)}
          >
            <UserPlus size={14} /> New
          </button>
        </div>

        {requests.length > 0 && (
          <div className="p-3 border-bottom bg-light">
            <div className="small fw-bold text-muted mb-2">CHAT REQUESTS</div>
            {requests.map((r) => (
              <div key={r.id} className="d-flex align-items-center justify-content-between mb-2">
                <span className="small">{r.sender?.fullName || "Someone"} wants to chat</span>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-success" onClick={() => handleAccept(r.id)}>
                    <Check size={12} />
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDecline(r.id)}>
                    <X size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          {conversations.length === 0 && (
            <div className="p-4 text-center text-muted small">No conversations yet.</div>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => openConversation(c)}
              className={`w-100 text-start border-0 p-3 border-bottom ${
                activeConversation?.id === c.id ? "bg-light" : "bg-white"
              }`}
            >
              <div className="fw-medium">{c.otherUser?.fullName || "Unknown"}</div>
              <div className="small text-muted">{c.otherUser?.email}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation window */}
      <div className="flex-fill d-flex flex-column">
        {activeConversation ? (
          <>
            <div className="p-3 border-bottom fw-bold">
              {activeConversation.otherUser?.fullName || "Chat"}
            </div>
            <div className="flex-fill p-3" style={{ overflowY: "auto" }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`d-flex mb-2 ${m.senderId === currentUser?.id ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-3 ${
                      m.senderId === currentUser?.id ? "bg-primary text-white" : "bg-light"
                    }`}
                    style={{ maxWidth: "60%" }}
                  >
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-top d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button type="submit" className="btn btn-brand d-flex align-items-center">
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-fill d-flex flex-column align-items-center justify-content-center text-muted">
            <MessageCircle size={40} className="mb-2" />
            Select a conversation or start a new one
          </div>
        )}
      </div>

      {/* Start chat modal */}
      {showStartChat && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.4)", zIndex: 1050 }}
          onClick={() => setShowStartChat(false)}
        >
          <div className="bg-white rounded-3 p-4" style={{ width: "360px" }} onClick={(e) => e.stopPropagation()}>
            <h6 className="fw-bold mb-3">Start a chat</h6>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {team.map((u) => (
                <button
                  key={u.id}
                  className="w-100 text-start btn btn-light mb-1"
                  onClick={() => handleStartChat(u.id)}
                >
                  {u.fullName} <span className="text-muted small">({u.role})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
