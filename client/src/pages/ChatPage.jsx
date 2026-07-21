import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send, UserPlus, Check, CheckCheck, X, MessageCircle, Smile, Paperclip, FileText,
  MoreVertical, Pencil, Trash2, Ban,
} from "lucide-react";

import {
  sendChatRequest,
  getIncomingRequests,
  acceptChatRequest,
  declineChatRequest,
  getConversations,
  getMessages,
  sendMessage as sendMessageApi,
  markConversationRead,
  editMessage as editMessageApi,
  deleteMessage as deleteMessageApi,
} from "../services/chatService";
import { connectSocket, onSocketEvent } from "../services/socketService";

const currentUser = JSON.parse(localStorage.getItem("user") || "null");

// Small fixed set covering the common reactions people actually reach for in
// a work chat — avoids pulling in a whole emoji-picker dependency for this.
const EMOJI_OPTIONS = [
  "😀", "😂", "😊", "🙂", "😉", "😍", "😎", "🤔", "😅", "😢",
  "😮", "🙌", "👍", "👎", "🙏", "👏", "🔥", "🎉", "✅", "❌",
  "❤️", "💯", "🚀", "😴", "🤝", "📌", "⚠️", "👀", "💪", "🤷",
];

// 5MB cap keeps a base64-encoded attachment comfortably under the server's
// 15mb JSON body limit (base64 adds ~33% overhead) with room for other files
// in the same conversation history.
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const ChatPage = () => {
  const [team, setTeam] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [showStartChat, setShowStartChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null); // { url, name, type }
  const [attachError, setAttachError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null); // message id whose action menu is open
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
    const bump = () => window.dispatchEvent(new Event("crm_chat_unread_updated"));
    const unsubscribers = [
      onSocketEvent("chat:request-received", () => { loadRequests(); bump(); }),
      onSocketEvent("chat:request-accepted", () => loadConversations()),
      onSocketEvent("chat:conversation-started", () => loadConversations()),
      onSocketEvent("chat:message-received", ({ message, conversationId }) => {
        loadConversations();
        bump();
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) => [...prev, message]);
            // Already viewing this conversation — mark it read immediately
            // instead of waiting for the next time it's opened.
            markConversationRead(conversationId).catch(() => {});
          }
          return current;
        });
      }),
      onSocketEvent("chat:messages-read", ({ conversationId, readerId }) => {
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) =>
              prev.map((m) => (m.senderId !== readerId ? { ...m, readAt: m.readAt || new Date().toISOString() } : m))
            );
          }
          return current;
        });
      }),
      onSocketEvent("chat:message-edited", ({ message, conversationId }) => {
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) => prev.map((m) => (m.id === message.id ? message : m)));
          }
          return current;
        });
      }),
      onSocketEvent("chat:message-deleted", ({ messageId, conversationId }) => {
        setActiveConversation((current) => {
          if (current?.id === conversationId) {
            setMessages((prev) =>
              prev.map((m) => (m.id === messageId ? { ...m, deleted: true, message: "", attachmentUrl: null } : m))
            );
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
    setShowEmojiPicker(false);
    setPendingAttachment(null);
    setAttachError("");
    try {
      const data = await getMessages(conversation.id);
      setMessages(data || []);
      // The server already zeroed this conversation's unread counter (opening
      // it = reading it) — reflect that locally so the sidebar badge and the
      // conversation-list badge update immediately without a refetch.
      setConversations((prev) => prev.map((c) => (c.id === conversation.id ? { ...c, unreadCount: 0 } : c)));
      window.dispatchEvent(new Event("crm_chat_unread_updated"));
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
      window.dispatchEvent(new Event("crm_chat_unread_updated"));
      if (res.conversation) openConversation(res.conversation);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declineChatRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      window.dispatchEvent(new Event("crm_chat_unread_updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again later
    if (!file) return;

    setAttachError("");
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setAttachError("That file is over 5MB — please share a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPendingAttachment({ url: reader.result, name: file.name, type: file.type });
    };
    reader.onerror = () => setAttachError("Couldn't read that file — please try again.");
    reader.readAsDataURL(file);
  };

  const handleEmojiClick = (emoji) => {
    setDraft((prev) => prev + emoji);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text && !pendingAttachment) return;
    if (!activeConversation) return;

    setDraft("");
    setShowEmojiPicker(false);
    const attachment = pendingAttachment;
    setPendingAttachment(null);

    try {
      const message = await sendMessageApi(activeConversation.id, text, attachment);
      setMessages((prev) => [...prev, message]);
      loadConversations();
    } catch (err) {
      alert("Message failed to send.");
    }
  };

  const handleEditStart = (m) => {
    setOpenMenuId(null);
    setEditingMessageId(m.id);
    setEditDraft(m.message);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditDraft("");
  };

  const handleEditSave = async (messageId) => {
    const text = editDraft.trim();
    if (!text) return;
    try {
      const updated = await editMessageApi(messageId, text);
      setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
      setEditingMessageId(null);
      setEditDraft("");
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't edit that message.");
    }
  };

  const handleDelete = async (messageId) => {
    setOpenMenuId(null);
    if (!window.confirm("Delete this message? This can't be undone.")) return;
    try {
      await deleteMessageApi(messageId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, deleted: true, message: "", attachmentUrl: null } : m))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't delete that message.");
    }
  };

  return (
    <div className="dashboard-card-flat" style={{ padding: 0, height: "calc(100vh - 130px)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div className="d-flex" style={{ flex: 1, overflow: "hidden" }}>
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
              className={`w-100 text-start border-0 p-3 border-bottom d-flex justify-content-between align-items-center ${
                activeConversation?.id === c.id ? "bg-light" : "bg-white"
              }`}
            >
              <div>
                <div className="fw-medium">{c.otherUser?.fullName || "Unknown"}</div>
                <div className="small text-muted">{c.otherUser?.email}</div>
              </div>
              {c.unreadCount > 0 && (
                <span className="badge rounded-pill bg-danger">{c.unreadCount}</span>
              )}
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
            <div className="flex-fill p-3" style={{ overflowY: "auto" }} onClick={() => setOpenMenuId(null)}>
              {messages.map((m) => {
                const isMine = m.senderId === currentUser?.id;
                const isEditing = editingMessageId === m.id;

                if (m.deleted) {
                  return (
                    <div key={m.id} className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}>
                      <div
                        className="px-3 py-2 rounded-3 border d-flex align-items-center gap-2 text-muted fst-italic"
                        style={{ maxWidth: "60%", fontSize: "13px" }}
                      >
                        <Ban size={13} /> This message was deleted
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`d-flex mb-2 ${isMine ? "justify-content-end" : "justify-content-start"}`}
                  >
                    <div
                      className="position-relative"
                      style={{ maxWidth: "60%" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={`px-3 py-2 rounded-3 ${isMine ? "bg-primary text-white" : "bg-light"}`}
                      >
                        {m.attachmentUrl && (
                          m.attachmentType?.startsWith("image/") ? (
                            <a href={m.attachmentUrl} target="_blank" rel="noreferrer">
                              <img
                                src={m.attachmentUrl}
                                alt={m.attachmentName || "attachment"}
                                style={{ maxWidth: "220px", maxHeight: "220px", borderRadius: "8px", display: "block", marginBottom: m.message ? "6px" : 0 }}
                              />
                            </a>
                          ) : (
                            <a
                              href={m.attachmentUrl}
                              download={m.attachmentName}
                              className={`d-flex align-items-center gap-2 mb-1 ${isMine ? "text-white" : "text-dark"}`}
                              style={{ textDecoration: "underline" }}
                            >
                              <FileText size={16} /> {m.attachmentName || "Download file"}
                            </a>
                          )
                        )}

                        {isEditing ? (
                          <div className="d-flex align-items-center gap-1">
                            <input
                              type="text"
                              autoFocus
                              className="form-control form-control-sm"
                              style={{ minWidth: "160px", color: "#111" }}
                              value={editDraft}
                              onChange={(e) => setEditDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEditSave(m.id);
                                if (e.key === "Escape") handleEditCancel();
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-light py-0 px-1"
                              onClick={() => handleEditSave(m.id)}
                              title="Save"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-light py-0 px-1"
                              onClick={handleEditCancel}
                              title="Cancel"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            {m.message}
                            {m.edited && (
                              <span
                                className={`ms-1 ${isMine ? "text-white-50" : "text-muted"}`}
                                style={{ fontSize: "11px" }}
                              >
                                (edited)
                              </span>
                            )}
                          </>
                        )}

                        {isMine && !isEditing && (
                          <div className="d-flex justify-content-end align-items-center gap-1 mt-1" style={{ fontSize: "10px" }}>
                            {m.readAt ? (
                              <CheckCheck size={13} className="text-info" title="Read" />
                            ) : (
                              <Check size={13} className="text-white-50" title="Sent" />
                            )}
                          </div>
                        )}
                      </div>

                      {isMine && !isEditing && (
                        <>
                          <button
                            type="button"
                            className="btn btn-sm btn-light border-0 position-absolute p-0 d-flex align-items-center justify-content-center"
                            style={{ top: "-6px", left: "-28px", width: "22px", height: "22px", borderRadius: "50%" }}
                            title="Message options"
                            onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                          >
                            <MoreVertical size={14} />
                          </button>
                          {openMenuId === m.id && (
                            <div
                              className="position-absolute bg-white border rounded-3 shadow-sm"
                              style={{ top: "16px", left: "-120px", width: "120px", zIndex: 30 }}
                            >
                              {!m.attachmentUrl && (
                                <button
                                  type="button"
                                  className="btn btn-sm w-100 text-start d-flex align-items-center gap-2"
                                  onClick={() => handleEditStart(m)}
                                >
                                  <Pencil size={13} /> Edit
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-sm w-100 text-start d-flex align-items-center gap-2 text-danger"
                                onClick={() => handleDelete(m.id)}
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {pendingAttachment && (
              <div className="px-3 pt-2 d-flex align-items-center gap-2 small text-muted border-top">
                {pendingAttachment.type?.startsWith("image/") ? (
                  <img src={pendingAttachment.url} alt="" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "6px" }} />
                ) : (
                  <FileText size={16} />
                )}
                <span className="flex-fill text-truncate">{pendingAttachment.name}</span>
                <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => setPendingAttachment(null)}>
                  <X size={14} />
                </button>
              </div>
            )}
            {attachError && <div className="px-3 pt-1 small text-danger">{attachError}</div>}
            <form onSubmit={handleSend} className="p-3 border-top d-flex gap-2 align-items-center position-relative">
              {showEmojiPicker && (
                <div
                  className="position-absolute bg-white border rounded-3 shadow p-2"
                  style={{ bottom: "56px", left: "12px", width: "260px", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px", zIndex: 20 }}
                >
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      className="btn btn-light p-1"
                      style={{ fontSize: "18px", lineHeight: 1 }}
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChosen}
                style={{ display: "none" }}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center"
                title="Attach a photo or document"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip size={16} />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary d-flex align-items-center"
                title="Emoji"
                onClick={() => setShowEmojiPicker((v) => !v)}
              >
                <Smile size={16} />
              </button>
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setShowEmojiPicker(false)}
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
    </div>
  );
};

export default ChatPage;
